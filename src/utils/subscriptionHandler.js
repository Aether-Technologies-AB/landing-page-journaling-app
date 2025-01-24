import { db } from '../firebase/config';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';

export const handleSuccessfulPayment = async (session) => {
  const userId = session.client_reference_id;
  const subscriptionId = session.subscription;
  const customerId = session.customer;

  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    await updateDoc(userRef, {
      subscription: {
        id: subscriptionId,
        status: 'active',
        customerId: customerId,
        priceId: session.line_items.data[0].price.id,
        currentPeriodEnd: new Date(session.subscription.current_period_end * 1000),
        createdAt: new Date(),
      }
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
};

export const handleSubscriptionChange = async (subscription) => {
  // Find user by customer ID
  const querySnapshot = await db.collection('users')
    .where('subscription.customerId', '==', subscription.customer)
    .get();

  if (querySnapshot.empty) {
    console.error('No user found with customer ID:', subscription.customer);
    return;
  }

  const userDoc = querySnapshot.docs[0];
  const userRef = doc(db, 'users', userDoc.id);

  try {
    await updateDoc(userRef, {
      'subscription.status': subscription.status,
      'subscription.currentPeriodEnd': new Date(subscription.current_period_end * 1000),
      'subscription.cancelAtPeriodEnd': subscription.cancel_at_period_end,
    });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
};

export const subscribeToUserPlan = (userId, callback) => {
  if (!userId) {
    callback({ plan: 'basic', status: 'inactive' });
    return () => {};
  }

  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      const subscription = userData.subscription || {};
      
      callback({
        plan: subscription.plan || 'basic',
        status: subscription.status || 'inactive',
        currentPeriodEnd: subscription.currentPeriodEnd,
        lastUpdated: subscription.lastUpdated?.toDate(),
      });
    } else {
      callback({ plan: 'basic', status: 'inactive' });
    }
  }, (error) => {
    console.error('Error subscribing to user plan:', error);
    callback({ plan: 'basic', status: 'inactive' });
  });
};

export const getCurrentPlan = async (userId) => {
  if (!userId) {
    return { plan: 'basic', status: 'inactive' };
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { plan: 'basic', status: 'inactive' };
    }

    const userData = userDoc.data();
    const subscription = userData.subscription || {};

    return {
      plan: subscription.plan || 'basic',
      status: subscription.status || 'inactive',
      currentPeriodEnd: subscription.currentPeriodEnd,
      lastUpdated: subscription.lastUpdated?.toDate(),
    };
  } catch (error) {
    console.error('Error getting current plan:', error);
    return { plan: 'basic', status: 'inactive' };
  }
};
