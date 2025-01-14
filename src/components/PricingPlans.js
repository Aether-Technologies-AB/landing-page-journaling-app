import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useFirebase } from '../contexts/FirebaseContext';
import { createCheckoutSession } from '../services/stripeService';
import STRIPE_CONFIG from '../config/stripe';
import './PricingPlans.css';

const PricingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, updateUserData } = useFirebase();

  const plans = [
    {
      ...STRIPE_CONFIG.plans.basic,
      priceId: null,
      isFree: true
    },
    {
      ...STRIPE_CONFIG.plans.enhanced,
      priceId: STRIPE_CONFIG.prices.enhanced,
      price: '29',
      currency: 'SEK',
      period: '/month'
    },
    {
      ...STRIPE_CONFIG.plans.premium,
      priceId: STRIPE_CONFIG.prices.premium,
      price: '39',
      currency: 'SEK',
      period: '/month'
    }
  ];

  const handleFreePlan = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      // Update user's subscription status in Firestore
      await updateUserData({
        subscription: {
          plan: 'basic',
          status: 'active',
          startDate: new Date().toISOString()
        }
      });
      
      // Redirect to dashboard
      window.location.href = '/dashboard?subscription=activated';
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to activate free plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (plan.isFree) {
        await handleFreePlan();
      } else {
        await createCheckoutSession(plan.priceId, user.uid);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
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
            className={`pricing-plan ${selectedPlan === plan.id ? 'selected' : ''} ${plan.id === 'premium' ? 'featured' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.id === 'premium' && <div className="featured-badge">Most Popular</div>}
            <h3>{plan.name}</h3>
            <div className="price">
              {plan.isFree ? (
                <span className="amount">Free</span>
              ) : (
                <>
                  <span className="amount">{plan.price}</span>
                  <span className="currency">{plan.currency}</span>
                  <span className="period">{plan.period}</span>
                </>
              )}
            </div>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <FaCheck className="check-icon" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`subscribe-button ${plan.id === 'premium' ? 'featured' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSubscribe(plan);
              }}
              disabled={loading}
            >
              {loading && selectedPlan === plan.id 
                ? 'Processing...' 
                : plan.isFree 
                  ? 'Get Started' 
                  : 'Subscribe Now'
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
