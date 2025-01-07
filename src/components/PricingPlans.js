import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import './PricingPlans.css';

const PricingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 'Free',
      features: [
        'Limited storage for transcripts',
        'Essential tools for organizing',
        'Basic review features',
      ],
      priceId: null // Free plan doesn't need a price ID
    },
    {
      id: 'enhanced',
      name: 'Enhanced Plan',
      price: '29',
      currency: 'SEK',
      period: '/month',
      features: [
        'Increased storage space',
        'Share transcripts with others',
        'Collaborative viewing',
        'Comment on shared transcripts'
      ],
      priceId: 'prod_RTdqf9C5cXh8xr'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '39',
      currency: 'SEK',
      period: '/month',
      features: [
        'All Enhanced Plan features',
        'Interactive transcripts',
        'Highlight and annotate',
        'Real-time collaboration',
        'Live comments and updates'
      ],
      priceId: 'prod_RTdr7hKvDAJbM7'
    }
  ];

  const handleSubscribe = async (priceId) => {
    if (!priceId) {
      // Handle free plan subscription
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priceId: priceId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process subscription. Please try again.');
    }
  };

  return (
    <div className="pricing-container">
      <h2>Choose Your Plan</h2>
      <p className="pricing-subtitle">Select the perfect plan for your needs</p>
      
      <div className="pricing-plans">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`pricing-plan ${selectedPlan === plan.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                {plan.price === 'Free' ? (
                  <span className="price">{plan.price}</span>
                ) : (
                  <>
                    <span className="currency">{plan.currency}</span>
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </>
                )}
              </div>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <FaCheck className="feature-icon" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              className="subscribe-button"
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribe(plan.priceId);
              }}
            >
              {plan.price === 'Free' ? 'Get Started' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
