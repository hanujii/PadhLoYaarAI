# Supabase Row Level Security (RLS) Recommendations

## Overview
Row Level Security (RLS) is a PostgreSQL feature that restricts which rows users can read, insert, update, or delete. For PadhLoYaarAI, RLS is critical to ensure users can only access their own data.

## Current Tables (Recommended Structure)

### `user_history`
Stores user-generated content (saved flashcards, tutor sessions, etc.)

```sql
CREATE TABLE user_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    type TEXT NOT NULL,
    tool TEXT NOT NULL,
    query TEXT,
    result TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own history
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
```

### `user_settings`
Stores user preferences (theme, model preference, etc.)

```sql
CREATE TABLE user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    preferences JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own settings
CREATE POLICY "Users manage own settings"
    ON user_settings FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```

## Verification Checklist
- [ ] Enable RLS on all user-related tables
- [ ] Test that unauthenticated requests are blocked
- [ ] Test that User A cannot access User B's data
- [ ] Use Supabase Dashboard > SQL Editor to run policy tests

## Important Notes
1. **Service Role Key**: Never expose the `service_role` key on the client. It bypasses RLS.
2. **Anon Key**: The `anon` key respects RLS policies.
3. **Test Regularly**: After any schema change, re-test RLS policies.
