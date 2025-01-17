const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

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

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not configured');
    }

    const sessionConfig = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/pricing`,
      client_reference_id: userId,
    };

    console.log('Session config:', sessionConfig);

    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('Session created:', session.id);

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', {
      message: error.message,
      type: error.type,
      stack: error.stack
    });
    res.status(500).json({ 
      error: error.message,
      type: error.type,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

// Stripe webhook endpoint
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful payment
      try {
        await handleSuccessfulPayment(session);
      } catch (error) {
        console.error('Error handling successful payment:', error);
      }
      break;
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      try {
        await handleSubscriptionChange(subscription);
      } catch (error) {
        console.error('Error handling subscription change:', error);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Update subscription endpoint
app.post('/api/update-subscription', async (req, res) => {
  const { subscriptionId, userId } = req.body;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    // Add your subscription update logic here
    res.json({ subscription });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription endpoint
app.post('/api/cancel-subscription', async (req, res) => {
  const { subscriptionId, userId } = req.body;

  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    res.json({ subscription });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
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
