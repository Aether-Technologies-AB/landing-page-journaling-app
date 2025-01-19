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
      client_reference_id: userId
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint to handle Stripe events
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful payment
      console.log('Payment successful for session:', session.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Log environment variables (excluding sensitive values)
console.log('Environment variables status:', {
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY ? 'present' : 'missing',
  FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'present' : 'missing',
  FIREBASE_PROJECT_ID: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'present' : 'missing',
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY ? 'present' : 'missing',
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
