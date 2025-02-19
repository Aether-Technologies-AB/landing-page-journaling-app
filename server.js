require('dotenv').config();
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');
const app = express();

// Webhook endpoint must come before any middleware that parses the body
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  console.log('Received webhook:', {
    type: req.body.type,
    signature: sig ? 'present' : 'missing'
  });

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('Webhook verified. Event type:', event.type);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const priceId = session.metadata?.priceId;

        if (!userId) {
          throw new Error('No userId found in session metadata');
        }

        if (!priceId) {
          throw new Error('No priceId found in session metadata');
        }

        const planName = getPlanFromPriceId(priceId);
        
        console.log('Processing checkout.session.completed:', {
          userId,
          priceId,
          planName,
          sessionId: session.id,
          subscriptionId: session.subscription
        });
        
        // Get the subscription details
        const subscriptionDetails = await stripe.subscriptions.retrieve(session.subscription);
        console.log('Retrieved subscription details:', {
          status: subscriptionDetails.status,
          currentPeriodEnd: new Date(subscriptionDetails.current_period_end * 1000)
        });
        
        // Update user's subscription in Firebase
        await db.collection('users').doc(userId).update({
          subscription: {
            plan: planName,
            status: 'active',
            priceId: priceId,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            currentPeriodEnd: new Date(subscriptionDetails.current_period_end * 1000),
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          }
        });
        
        console.log(`Successfully updated subscription for user ${userId} to ${planName} plan`);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        const customerId = updatedSubscription.customer;
        
        console.log('Processing customer.subscription.updated:', {
          subscriptionId: updatedSubscription.id,
          customerId,
          status: updatedSubscription.status
        });
        
        // Get user by Stripe customer ID
        const usersSnapshot = await db.collection('users')
          .where('subscription.stripeCustomerId', '==', customerId)
          .limit(1)
          .get();
        
        if (!usersSnapshot.empty) {
          const userDoc = usersSnapshot.docs[0];
          await userDoc.ref.update({
            'subscription.status': updatedSubscription.status,
            'subscription.currentPeriodEnd': new Date(updatedSubscription.current_period_end * 1000),
            'subscription.lastUpdated': admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`Updated subscription status for user ${userDoc.id} to ${updatedSubscription.status}`);
        } else {
          console.log(`No user found with Stripe customer ID: ${customerId}`);
        }
        break;

      case 'customer.subscription.deleted':
        const cancelledSubscription = event.data.object;
        const cancelledCustomerId = cancelledSubscription.customer;
        
        console.log('Processing customer.subscription.deleted:', {
          subscriptionId: cancelledSubscription.id,
          customerId: cancelledCustomerId
        });
        
        // Get user by Stripe customer ID
        const cancelledUserSnapshot = await db.collection('users')
          .where('subscription.stripeCustomerId', '==', cancelledCustomerId)
          .limit(1)
          .get();
        
        if (!cancelledUserSnapshot.empty) {
          const userDoc = cancelledUserSnapshot.docs[0];
          await userDoc.ref.update({
            subscription: {
              plan: 'basic',
              status: 'inactive',
              cancelDate: admin.firestore.FieldValue.serverTimestamp(),
              lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            }
          });
          console.log(`Updated subscription status for user ${userDoc.id} to inactive`);
        } else {
          console.log(`No user found with Stripe customer ID: ${cancelledCustomerId}`);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).send(`Webhook Error: ${err.message}`);
  }
});

// Regular middleware for other routes
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Initialize Firebase Admin with service account credentials
try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,  // No need to replace \n as it's already formatted
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  };

  if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
    throw new Error('Missing required Firebase configuration. Check environment variables.');
  }

  // Log the first few characters of credentials for debugging (not the whole thing for security)
  console.log('Firebase credentials check:', {
    projectId: serviceAccount.projectId,
    clientEmail: serviceAccount.clientEmail,
    privateKeyLength: serviceAccount.privateKey?.length,
    privateKeyStart: serviceAccount.privateKey?.substring(0, 50)
  });

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();

// Middleware to parse JSON payloads
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Create Checkout Session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, successUrl, cancelUrl } = req.body;
    console.log('Creating checkout session with:', {
      priceId,
      userId,
      successUrl,
      cancelUrl,
      stripeKey: process.env.STRIPE_SECRET_KEY ? 'present' : 'missing'
    });

    if (!priceId) {
      throw new Error('Price ID is required');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not configured');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        priceId: priceId
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get plan name from price ID
const getPlanFromPriceId = (priceId) => {
  const priceToPlan = {
    [process.env.REACT_APP_STRIPE_ENHANCED_PRICE_ID]: 'enhanced',
    [process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID]: 'premium'
  };
  return priceToPlan[priceId] || 'basic';
};

// Log environment variables (excluding sensitive values)
console.log('Environment variables status:', {
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY ? 'present' : 'missing',
  FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'present' : 'missing',
  FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'present' : 'missing',
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY ? 'present' : 'missing',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'present' : 'missing',
  PORT: process.env.PORT || 3000
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
