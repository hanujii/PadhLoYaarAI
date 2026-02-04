# Stripe Integration Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Stripe Configuration
# Get these from https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Webhook Secret
# Get this when you create a webhook in the Stripe Dashboard
# For local testing, use Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs
# Create products and prices in Stripe Dashboard > Products
STRIPE_PRO_PRICE_ID=price_...
STRIPE_TEAM_PRICE_ID=price_...

# App URL (for redirect after checkout)
NEXT_PUBLIC_APP_URL=https://padhloyaar-ai.vercel.app
```

## Setup Steps

### 1. Create Stripe Account
- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Create an account and verify your business

### 2. Create Products
- Navigate to **Products** > **Add Product**
- Create "Pro Plan" with monthly price ₹299
- Create "Team Plan" with monthly price ₹999
- Copy the Price IDs to your `.env.local`

### 3. Configure Webhook
- Go to **Developers** > **Webhooks**
- Add endpoint: `https://your-domain.com/api/webhooks/stripe`
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

### 4. Local Testing
```bash
# Install Stripe CLI
npm install -g stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Important Notes
- Never commit your Stripe keys to Git
- Use test keys (sk_test_...) for development
- Switch to live keys (sk_live_...) only in production
