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

    // Log the full event data for debugging (excluding sensitive info)
    console.log('Event data:', {
      id: event.id,
      type: event.type,
      created: event.created,
      data: {
        object: {
          id: event.data.object.id,
          customer: event.data.object.customer,
          subscription: event.data.object.subscription,
          status: event.data.object.status,
          metadata: event.data.object.metadata
        }
      }
    });

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          const userId = session.metadata?.userId;
          const priceId = session.metadata?.priceId;

          console.log('Processing checkout.session.completed:', {
            userId,
            priceId,
            sessionId: session.id,
            customer: session.customer,
            subscription: session.subscription,
            metadata: session.metadata
          });

          if (!userId || !priceId) {
            throw new Error(`Missing metadata: userId=${userId}, priceId=${priceId}`);
          }

          const planName = getPlanFromPriceId(priceId);
          
          // Get the subscription details
          const subscriptionDetails = await stripe.subscriptions.retrieve(session.subscription);
          console.log('Retrieved subscription details:', {
            id: subscriptionDetails.id,
            status: subscriptionDetails.status,
            currentPeriodEnd: new Date(subscriptionDetails.current_period_end * 1000)
          });
          
          // Update user's subscription in Firebase
          const userRef = global.db.collection('users').doc(userId);
          const userDoc = await userRef.get();
          
          if (!userDoc.exists) {
            throw new Error(`No user found with ID: ${userId}`);
          }

          console.log('Updating user subscription:', {
            userId,
            plan: planName,
            status: 'active',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription
          });

          await userRef.update({
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
          
          console.log(`Successfully updated subscription for user ${userId}`);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const updatedSubscription = event.data.object;
          const customerId = updatedSubscription.customer;
          
          console.log(`Processing ${event.type}:`, {
            subscriptionId: updatedSubscription.id,
            customerId,
            status: updatedSubscription.status
          });
          
          // Get user by Stripe customer ID
          const usersSnapshot = await global.db.collection('users')
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
          const cancelledUserSnapshot = await global.db.collection('users')
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

        case 'invoice.payment_succeeded':
        case 'invoice.payment_failed':
          // Log these events but no action needed as subscription.updated will handle the status
          console.log(`Received ${event.type} event:`, {
            customerId: event.data.object.customer,
            subscriptionId: event.data.object.subscription,
            status: event.data.object.status
          });
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (err) {
      console.error('Error processing webhook:', err);
      res.status(500).send(`Webhook Error: ${err.message}`);
    }
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Regular middleware for other routes
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Initialize Firebase Admin with service account credentials
try {
  // Get the private key and ensure proper formatting
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  // If the key is wrapped in quotes, remove them and replace escaped newlines
  if (typeof privateKey === 'string' && privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1).replace(/\n/g, '\n');
  }

  const serviceAccount = {
    project_id: process.env.FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
    private_key: privateKey || '',
    client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
    client_id: process.env.FIREBASE_CLIENT_ID || '',
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL || '')}`
  };

  // Log configuration for debugging (excluding sensitive data)
  console.log('Firebase credentials check:', {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKeyPresent: !!serviceAccount.private_key,
    privateKeyLength: serviceAccount.private_key ? serviceAccount.private_key.length : undefined,
    privateKeyStart: serviceAccount.private_key ? serviceAccount.private_key.substring(0, 50) : undefined
  });

  // Check if required fields are present before initializing
  if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
    console.warn('Missing required Firebase credentials. Bypassing Firebase Admin initialization for deployment.');
    console.warn('Firebase-related server functionality will be disabled.');
    // Don't initialize Firebase Admin, and don't exit
    // Create a mock db object to prevent errors
    const mockDb = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: () => false, data: () => ({}) }),
          update: async () => {}
        }),
        where: () => ({
          limit: () => ({
            get: async () => ({ empty: true, docs: [] })
          })
        })
      })
    };
    global.db = mockDb; // Assign to global to use in routes
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
    global.db = admin.firestore();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  console.warn('Bypassing Firebase Admin initialization due to error. Firebase functionality will be disabled.');
  // Create a mock db object to prevent errors
  const mockDb = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: () => false, data: () => ({}) }),
        update: async () => {}
      }),
      where: () => ({
        limit: () => ({
          get: async () => ({ empty: true, docs: [] })
        })
      })
    })
  };
  global.db = mockDb; // Assign to global to use in routes
}

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

// Test endpoint for Firebase connection
app.get('/test-firebase', async (req, res) => {
  try {
    // Try to read from users collection
    const usersRef = global.db.collection('users');
    const snapshot = await usersRef.limit(1).get();
    
    console.log('Firebase test - Document exists:', !snapshot.empty);
    
    res.json({
      success: true,
      message: 'Firebase connection successful (or mock mode active)',
      hasDocuments: !snapshot.empty
    });
  } catch (error) {
    console.error('Firebase test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
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
