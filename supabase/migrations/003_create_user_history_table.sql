-- Migration 003: Create User History Table
-- This table stores user-generated content like flashcards, saved queries, tutor sessions, etc.

CREATE TABLE IF NOT EXISTS user_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool TEXT NOT NULL,
    query TEXT,
    result JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_history_user_id ON user_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_history_tool ON user_history(tool);
CREATE INDEX IF NOT EXISTS idx_user_history_created_at ON user_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_history_user_tool ON user_history(user_id, tool);

-- Enable Row Level Security
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own history
CREATE POLICY "Users can view own history"
    ON user_history FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own history
CREATE POLICY "Users can insert own history"
    ON user_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own history
CREATE POLICY "Users can delete own history"
    ON user_history FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Users can update their own history (for editing notes, etc.)
CREATE POLICY "Users can update own history"
    ON user_history FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE user_history IS 'Saved user-generated content from various AI tools';
