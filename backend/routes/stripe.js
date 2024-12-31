const express = require('express');
const router = express.Router();
const config = require('../config');
const stripe = require('stripe')(config.stripeSecretKey);
const auth = require('../middleware/auth');

// Create a Stripe Checkout Session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { priceId } = req.body;
    
    if (!priceId) {
      return res.status(400).json({ message: 'Price ID is required' });
    }

    console.log('Creating checkout session for:', {
      userId: req.user._id,
      email: req.user.email,
      priceId
    });
    
    // Create a new customer or get existing one
    let customer;
    try {
      const existingCustomers = await stripe.customers.list({
        email: req.user.email,
        limit: 1
      });
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        console.log('Found existing customer:', customer.id);
      } else {
        customer = await stripe.customers.create({
          email: req.user.email,
          metadata: {
            userId: req.user._id.toString()
          }
        });
        console.log('Created new customer:', customer.id);
      }
    } catch (error) {
      console.error('Error handling customer:', error);
      return res.status(500).json({ 
        message: 'Error creating/finding customer',
        error: config.nodeEnv === 'development' ? error.message : undefined
      });
    }

    // Create the session
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${config.clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.clientUrl}/pricing`,
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_update: {
          address: 'auto'
        },
        automatic_tax: {
          enabled: true
        },
        metadata: {
          userId: req.user._id.toString()
        }
      });

      console.log('Created checkout session:', session.id);
      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return res.status(500).json({ 
        message: 'Error creating checkout session',
        error: config.nodeEnv === 'development' ? error.message : undefined
      });
    }
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: config.nodeEnv === 'development' ? error.message : undefined
    });
  }
});

// Webhook endpoint to handle Stripe events
router.post(
  '/webhook',
  express.raw({type: 'application/json'}),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripeWebhookSecret
      );
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Received webhook event:', event.type);

    try {
      // Handle the event
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object;
          const customerId = subscription.customer;
          
          // Get the customer to find the user ID from metadata
          const customer = await stripe.customers.retrieve(customerId);
          const userId = customer.metadata.userId;
          
          // Update user's subscription status
          const User = require('../models/User');
          await User.findByIdAndUpdate(userId, {
            'subscription.status': subscription.status,
            'subscription.stripeCustomerId': customerId,
            'subscription.stripePlanId': subscription.plan.id
          });
          
          console.log('Updated subscription for user:', userId);
          break;
          
        case 'customer.subscription.deleted':
          const cancelledSubscription = event.data.object;
          const cancelledCustomerId = cancelledSubscription.customer;
          
          // Get the customer to find the user ID from metadata
          const cancelledCustomer = await stripe.customers.retrieve(cancelledCustomerId);
          const cancelledUserId = cancelledCustomer.metadata.userId;
          
          // Update user's subscription status
          const UserModel = require('../models/User');
          await UserModel.findByIdAndUpdate(cancelledUserId, {
            'subscription.status': 'inactive',
            'subscription.stripePlanId': null
          });
          
          console.log('Cancelled subscription for user:', cancelledUserId);
          break;
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

module.exports = router;
