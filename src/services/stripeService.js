import { loadStripe } from '@stripe/stripe-js';
import STRIPE_CONFIG from '../config/stripe.js';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
  }
  return stripePromise;
};

export const createCheckoutSession = async (priceId, userId) => {
  try {
    console.log('Creating checkout session with:', { priceId, userId });
    const stripe = await getStripe();
    
    // Create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    console.log('Server response status:', response.status);
    const data = await response.json();
    console.log('Server response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    if (!data.id) {
      throw new Error('No session ID returned from server');
    }

    console.log('Redirecting to checkout with session ID:', data.id);
    const result = await stripe.redirectToCheckout({
      sessionId: data.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
};

export const handleSubscriptionChange = async (subscriptionId, userId) => {
  try {
    const response = await fetch('/api/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in handleSubscriptionChange:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId, userId) => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    throw error;
  }
};
