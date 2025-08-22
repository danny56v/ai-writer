// lib/subscription-helpers.ts
import { connectToDatabase } from "@/lib/mongo";

export interface UserSubscriptionData {
  userId: string;
  customerId: string;
  subscriptionId: string;
  priceId: string;
  status: "pending" | "active" | "failed" | "canceled";
  planType?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Obține subscription-ul unui user
export async function getUserSubscription(userId: string): Promise<UserSubscriptionData | null> {
  try {
    const { db } = await connectToDatabase();
    const subscription = await db.collection('subscriptions').findOne({ userId });
    
    return subscription ? {
      userId: subscription.userId,
      customerId: subscription.customerId,
      subscriptionId: subscription.subscriptionId,
      priceId: subscription.priceId,
      status: subscription.status,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
      planType: subscription.planType || null
    } : null;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

// Verifică dacă user-ul are subscription activ
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const subscription = await getUserSubscription(userId);
    return subscription?.status === "active";
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

// Obține planul din priceId
export function getPlanFromPriceId(priceId: string): { 
  name: string; 
  price: string; 
  interval: string;
  type: string;
} {
  const planMapping: { [key: string]: { name: string; price: string; interval: string; type: string } } = {
    'price_1RqYGERsRyFq7mSBRUl2pfnl': { 
      name: 'Pro Monthly', 
      price: '$14.99', 
      interval: 'month',
      type: 'pro_monthly'
    },
    'price_1RqYhgRsRyFq7mSBmL9rimXh': { 
      name: 'Pro Yearly', 
      price: '$149.99', 
      interval: 'year',
      type: 'pro_yearly'
    },
    'price_1RqYmXRsRyFq7mSBLFPa9xoC': { 
      name: 'Unlimited Monthly', 
      price: '$49.99', 
      interval: 'month',
      type: 'unlimited_monthly'
    },
    'price_1RqYn5RsRyFq7mSBm7j1RBMZ': { 
      name: 'Unlimited Yearly', 
      price: '$499.99', 
      interval: 'year',
      type: 'unlimited_yearly'
    },
  };
  
  return planMapping[priceId] || { 
    name: 'Unknown Plan', 
    price: 'N/A', 
    interval: 'unknown',
    type: 'unknown'
  };
}

// Obține informații complete despre subscription + plan
export async function getUserSubscriptionWithPlan(userId: string) {
  try {
    const subscription = await getUserSubscription(userId);
    
    if (!subscription) {
      return null;
    }

    const planInfo = getPlanFromPriceId(subscription.priceId);
    
    return {
      ...subscription,
      plan: planInfo
    };
  } catch (error) {
    console.error('Error getting subscription with plan:', error);
    return null;
  }
}

// Verifică accesul la funcționalități based pe plan
export async function hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
  try {
    const subscriptionData = await getUserSubscriptionWithPlan(userId);
    
    if (!subscriptionData || subscriptionData.status !== 'active') {
      return false; // Nu are subscription activ
    }

    const { plan } = subscriptionData;
    
    // Definește accesul la funcționalități pentru fiecare plan
    const featureAccess: { [planType: string]: string[] } = {
      'pro_monthly': [
        'basic_articles', 
        'advanced_editor', 
        'seo_optimization',
        'priority_support'
      ],
      'pro_yearly': [
        'basic_articles', 
        'advanced_editor', 
        'seo_optimization',
        'priority_support'
      ],
      'unlimited_monthly': [
        'basic_articles', 
        'advanced_editor', 
        'seo_optimization',
        'priority_support',
        'unlimited_articles',
        'api_access',
        'bulk_generation',
        'custom_templates'
      ],
      'unlimited_yearly': [
        'basic_articles', 
        'advanced_editor', 
        'seo_optimization',
        'priority_support',
        'unlimited_articles',
        'api_access',
        'bulk_generation',
        'custom_templates'
      ]
    };

    const userFeatures = featureAccess[plan.type] || [];
    return userFeatures.includes(feature);
    
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

// Obține limitele pentru generarea de articole
export async function getArticleLimits(userId: string): Promise<{
  hasUnlimited: boolean;
  monthlyLimit: number;
  planType: string;
}> {
  try {
    const subscriptionData = await getUserSubscriptionWithPlan(userId);
    
    if (!subscriptionData || subscriptionData.status !== 'active') {
      return {
        hasUnlimited: false,
        monthlyLimit: 3, // Free tier
        planType: 'free'
      };
    }

    const { plan } = subscriptionData;
    
    const limits: { [planType: string]: { hasUnlimited: boolean; monthlyLimit: number } } = {
      'pro_monthly': { hasUnlimited: false, monthlyLimit: 50 },
      'pro_yearly': { hasUnlimited: false, monthlyLimit: 50 },
      'unlimited_monthly': { hasUnlimited: true, monthlyLimit: -1 },
      'unlimited_yearly': { hasUnlimited: true, monthlyLimit: -1 }
    };

    const userLimits = limits[plan.type] || { hasUnlimited: false, monthlyLimit: 3 };
    
    return {
      ...userLimits,
      planType: plan.type
    };
    
  } catch (error) {
    console.error('Error getting article limits:', error);
    return {
      hasUnlimited: false,
      monthlyLimit: 3,
      planType: 'free'
    };
  }
}