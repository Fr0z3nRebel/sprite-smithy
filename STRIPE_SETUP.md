# Stripe Setup Guide for Sprite Smithy

## Understanding Stripe Keys

### 1. **Publishable Key** (Client-Side)
- **What it is**: Safe to expose in your frontend code
- **Where it's used**: Client-side JavaScript (browser)
- **Environment variable**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **What it can do**: Create checkout sessions, redirect to Stripe Checkout
- **Security**: This key is public and visible in your browser's JavaScript

### 2. **Secret Key** (Server-Side Only)
- **What it is**: Must be kept secret - never expose to client
- **Where it's used**: Server-side API routes only
- **Environment variable**: `STRIPE_SECRET_KEY`
- **What it can do**: Create customers, checkout sessions, verify payments
- **Security**: This key has full access to your Stripe account - use restricted keys!

### 3. **Webhook Secret** (Server-Side Only)
- **What it is**: Used to verify webhook requests are actually from Stripe
- **Where it's used**: Webhook endpoint to verify signatures
- **Environment variable**: `STRIPE_WEBHOOK_SECRET`
- **What it can do**: Verify webhook authenticity
- **Security**: Keep this secret - it prevents webhook spoofing

## Step-by-Step Setup

### Step 1: Get Your Standard Keys from Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. You'll see:
   - **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for live)
   - **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live)

### Step 2: Create a Restricted API Key (Recommended for Security)

**Why use restricted keys?**
- Limits what your application can do
- Reduces risk if the key is accidentally exposed
- Follows principle of least privilege

**How to create one:**

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Click **"Create restricted key"**
3. Give it a name (e.g., "Sprite Smithy Production" or "Sprite Smithy Development")
4. Set permissions - your app needs:
   - ✅ **Customers**: Read and Write (to create/retrieve customers)
   - ✅ **Checkout Sessions**: Read and Write (to create checkout sessions)
   - ✅ **Payment Intents**: Read (to verify payments)
   - ✅ **Events**: Read (to process webhooks)
   - ❌ **Everything else**: Leave unchecked

5. Click **"Create key"**
6. **Copy the secret key immediately** - you won't be able to see it again!

### Step 3: Create Your Product and Price in Stripe

1. Go to **Products** in Stripe Dashboard
2. Click **"Add product"**
3. Fill in:
   - **Name**: "Sprite Smithy Pro - Lifetime Access"
   - **Description**: (optional)
   - **Pricing model**: One-time payment
   - **Price**: $30.00 USD
4. Click **"Save product"**
5. **Copy the Price ID** (starts with `price_`) - you'll need this for `STRIPE_PRICE_ID_LIFETIME`

### Step 4: Set Up Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   - **Development**: `https://your-app.vercel.app/api/stripe/webhooks`
   - **Production**: `https://your-production-domain.com/api/stripe/webhooks`
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Click **"Add endpoint"**
6. **Copy the Signing secret** (starts with `whsec_`) - this is your `STRIPE_WEBHOOK_SECRET`

### Step 5: Set Up Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist):

```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... or your restricted key)
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product Configuration
STRIPE_PRICE_ID_LIFETIME=price_...

# App URL (for redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_APP_URL=https://your-production-domain.com  # Production
```

**Important Notes:**
- Use **test keys** (`pk_test_`, `sk_test_`) during development
- Use **live keys** (`pk_live_`, `sk_live_`) only in production
- The webhook secret is different for test vs live mode
- Never commit `.env.local` to git (it should be in `.gitignore`)

### Step 6: Set Up Vercel Environment Variables

For your Vercel deployment:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all the environment variables from Step 5
4. Make sure to:
   - Set different values for **Development**, **Preview**, and **Production** environments
   - Use test keys for Development/Preview
   - Use live keys for Production
   - Update `NEXT_PUBLIC_APP_URL` to match each environment's URL

## Security Best Practices

### ✅ DO:
- Use **restricted API keys** instead of standard secret keys
- Keep secret keys and webhook secrets in environment variables only
- Use test keys during development
- Verify webhook signatures (your code already does this)
- Rotate keys if they're ever exposed
- Use different keys for development and production

### ❌ DON'T:
- Never commit secret keys to git
- Never expose secret keys in client-side code
- Never share secret keys publicly
- Don't use the same keys for test and production
- Don't skip webhook signature verification

## Testing Your Setup

### Test Mode:
1. Use test publishable key (`pk_test_...`)
2. Use test secret key (`sk_test_...`)
3. Use test webhook secret
4. Use test card numbers from [Stripe Testing](https://stripe.com/docs/testing)

### Test Cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date, any 3-digit CVC, any ZIP

## Troubleshooting

### "Invalid API Key"
- Check that you're using the correct key (test vs live)
- Verify the key is copied correctly (no extra spaces)

### "Webhook signature verification failed"
- Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint's signing secret
- Make sure you're using the correct secret for test vs live mode
- Verify the webhook URL is correct in Stripe Dashboard

### "Price not found"
- Verify `STRIPE_PRICE_ID_LIFETIME` matches the Price ID from your Stripe product
- Ensure the price exists in the same Stripe account (test vs live)

## Required Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public key for client-side | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Secret key (use restricted!) | `sk_test_...` or `rk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` |
| `STRIPE_PRICE_ID_LIFETIME` | Price ID from Stripe product | `price_...` |
| `NEXT_PUBLIC_APP_URL` | Your app's base URL | `https://your-app.vercel.app` |

