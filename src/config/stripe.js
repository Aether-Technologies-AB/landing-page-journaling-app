const STRIPE_CONFIG = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  prices: {
    enhanced: process.env.REACT_APP_STRIPE_ENHANCED_PRICE_ID,
    premium: process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID
  },
  plans: {
    basic: {
      id: 'basic',
      name: 'Basic Plan',
      price: 'Free',
      features: [
        'Store up to 100 memories',
        'Basic photo storage',
        'Monthly milestone tracking',
        'Email support'
      ],
      isFree: true
    },
    enhanced: {
      id: 'enhanced',
      name: 'Enhanced Plan',
      priceId: process.env.REACT_APP_STRIPE_ENHANCED_PRICE_ID,
      price: '29 SEK/month',
      features: [
        'Store up to 500 memories',
        'HD photo storage',
        'Weekly milestone tracking',
        'Priority email support',
        'Custom categories',
        'Family sharing (up to 3 members)'
      ],
      isFree: false
    },
    premium: {
      id: 'premium',
      name: 'Premium Plan',
      priceId: process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID,
      price: '39 SEK/month',
      features: [
        'Unlimited memories',
        '4K photo & video storage',
        'Daily milestone tracking',
        '24/7 priority support',
        'Custom categories & tags',
        'Family sharing (up to 10 members)',
        'AI-powered memory suggestions',
        'Premium themes & layouts'
      ],
      isFree: false
    }
  }
};

console.log('Stripe Config:', {
  publishableKey: STRIPE_CONFIG.publishableKey,
  enhancedPriceId: STRIPE_CONFIG.prices.enhanced,
  premiumPriceId: STRIPE_CONFIG.prices.premium
});

export default STRIPE_CONFIG;
