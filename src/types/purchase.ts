export type Tier = 'free' | 'paid';

export interface Purchase {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_checkout_session_id: string | null;
  tier: Tier;
  amount_paid: number; // in cents
  currency: string;
  purchased_at: string | null;
  created_at: string;
}

export interface PurchaseState {
  purchase: Purchase | null;
  tier: Tier;
  isPro: boolean;
  isLoading: boolean;
}
