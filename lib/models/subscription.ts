export interface Subscription {
  _id?: string;
  userId: string; // ID-ul din colecția users (Next-Auth)
  userEmail: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  planType: 'pro_monthly' | 'pro_yearly' | 'unlimited_monthly' | 'unlimited_yearly';
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  _id?: string;
  userId: string;        // ID-ul din colecția users
  userEmail: string;     // Email pentru queries rapide  
  stripeCustomerId: string; // ID-ul din Stripe
  name?: string;         // Numele utilizatorului (opțional)
  image?: string;        // Avatar-ul utilizatorului (opțional)
  createdAt: Date;
  updatedAt: Date;
}
export interface BillingPeriod {
  start: Date;
  end: Date;
}
