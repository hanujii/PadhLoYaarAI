-- Migration 002: Create Subscriptions Table
-- This table stores Stripe subscription data for users

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid')),
    plan_id TEXT CHECK (plan_id IN ('pro', 'team')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscription
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Service role (webhooks) can manage all subscriptions
-- Note: This policy allows full access for authenticated service role
CREATE POLICY "Service role can manage subscriptions"
    ON subscriptions FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Add comment
COMMENT ON TABLE subscriptions IS 'Stripe subscription data for Pro and Team plans';
