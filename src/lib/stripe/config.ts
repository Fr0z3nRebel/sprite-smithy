/**
 * Stripe configuration constants
 * Product and pricing information for Sprite Smithy
 */

export const STRIPE_CONFIG = {
  // Product information
  PRODUCT_NAME: 'Sprite Smithy Pro - Lifetime Access',

  // Pricing
  PRICE_AMOUNT: 3000, // $30.00 in cents
  CURRENCY: 'usd',

  // Price ID from Stripe Dashboard
  // You'll need to create this product in Stripe and paste the price ID here
  PRICE_ID: process.env.STRIPE_PRICE_ID_LIFETIME || '',

  // Success and cancel URLs
  SUCCESS_URL: `${process.env.NEXT_PUBLIC_APP_URL}/app/tool?purchased=true`,
  CANCEL_URL: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
} as const;

export const STRIPE_FEATURES = {
  FREE: [
    '5 videos per month',
    'All core features',
    'Watermarked exports',
  ],
  PRO: [
    'Unlimited videos',
    'No watermarks',
    'Priority support',
    'Early access to new features',
  ],
} as const;
