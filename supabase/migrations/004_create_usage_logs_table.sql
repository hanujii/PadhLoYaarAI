-- Migration 004: Create Usage Logs Table  
-- This table tracks API usage for rate limiting and analytics

CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address TEXT,
    tool TEXT NOT NULL,
    model_used TEXT,
    tokens_used INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_logs_ip_address ON usage_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(user_id, created_at DESC);

-- Note: Composite index above (idx_usage_logs_user_date) is sufficient for rate limiting

-- Enable Row Level Security
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own usage
CREATE POLICY "Users can view own usage"
    ON usage_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Service role can insert usage logs (from API routes)
CREATE POLICY "Service role can insert usage logs"
    ON usage_logs FOR INSERT
    WITH CHECK (true); -- Any authenticated request can log usage

-- Add automatic cleanup function to delete old logs (retention: 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_usage_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM usage_logs
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension - optional)
-- SELECT cron.schedule('cleanup-usage-logs', '0 2 * * *', 'SELECT cleanup_old_usage_logs()');

-- Add comment
COMMENT ON TABLE usage_logs IS 'API usage tracking for rate limiting and analytics (90-day retention)';
