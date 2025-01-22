import React, { useState } from 'react';
import { FaCheck, FaStar } from 'react-icons/fa';
import { useFirebase } from '../contexts/FirebaseContext';
import { createCheckoutSession } from '../services/stripeService';
import STRIPE_CONFIG from '../config/stripe';
import './PricingPlans.css';

const PricingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, userData, updateUserData } = useFirebase();

  const currentPlan = userData?.subscription?.plan || 'none';
  const isSubscriptionActive = userData?.subscription?.status === 'active';

  const plans = [
    {
      ...STRIPE_CONFIG.plans.basic,
      isFree: true
    },
    {
      ...STRIPE_CONFIG.plans.enhanced,
      price: '29',
      currency: 'SEK',
      period: '/month'
    },
    {
      ...STRIPE_CONFIG.plans.premium,
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
      console.log('Subscribing to plan:', plan);
      console.log('Price ID:', plan.priceId);
      console.log('User ID:', user.uid);
      
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
      <div className="pricing-plans">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id && isSubscriptionActive;
          
          return (
            <div 
              key={plan.id} 
              className={`pricing-plan ${isCurrentPlan ? 'current-plan' : ''}`}
            >
              {isCurrentPlan && (
                <div className="current-plan-badge">
                  <FaStar /> Current Plan
                </div>
              )}
              <h3>{plan.name}</h3>
              <div className="price">
                {plan.isFree ? (
                  <span>Free</span>
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
                onClick={() => handleSubscribe(plan)}
                disabled={loading || isCurrentPlan}
                className={`subscribe-button ${isCurrentPlan ? 'current' : ''}`}
              >
                {isCurrentPlan ? 'Current Plan' : plan.isFree ? 'Get Started' : 'Subscribe'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPlans;
