# Database Migrations Guide

## Prerequisites
- Supabase project created at [supabase.com](https://supabase.com)
- Supabase CLI installed (optional but recommended)

## Migration Files
All migration files are located in `supabase/migrations/`:
1. `001_create_profiles_table.sql` - User profiles with gamification
2. `002_create_subscriptions_table.sql` - Stripe subscriptions
3. `003_create_user_history_table.sql` - Saved user content
4. `004_create_usage_logs_table.sql` - Rate limiting and analytics

## Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. For each migration file (in order):
   - Click **"New Query"**
   - Copy-paste the SQL from the migration file
   - Click **Run** or press `Ctrl+Enter`
   - Verify success (check for green checkmark)

## Option 2: Using Supabase CLI (Recommended for teams)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get reference from dashboard)
supabase link --project-ref YOUR_PROJECT_REF

# Run all migrations
supabase db push
```

## Option 3: Manual SQL Execution

```bash
# If you have PostgreSQL client installed
psql postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres -f supabase/migrations/001_create_profiles_table.sql
# Repeat for all migration files
```

## Verify Migrations

After running migrations, verify in Supabase Dashboard:

### 1. Check Tables
- Go to **Table Editor**
- You should see: `profiles`, `subscriptions`, `user_history`, `usage_logs`

### 2. Check RLS Policies
- Select each table
- Click **"Policies"** tab
- Verify policies are enabled

### 3. Test Profile Creation
Users table already exists from Supabase Auth. When a new user signs up:
- A profile should be automatically created (via trigger)
- Test by creating a user in **Authentication > Users**

## Environment Variables

After running migrations, add these to your `.env.local`:

```bash
# Service Role Key (for webhooks - KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# You should already have these:
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Get keys from: **Project Settings > API**

> ⚠️ **WARNING**: Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It bypasses RLS policies!

## Troubleshooting

### Error: "relation already exists"
- Tables might already be created
- Drop tables first: `DROP TABLE IF EXISTS profiles CASCADE;`
- Or modify migration to use `CREATE TABLE IF NOT EXISTS`

### Error: "permission denied"
- Make sure you're using the correct database credentials
- Check that you have admin access to the project

### RLS Policies Not Working
- Verify RLS is enabled: `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`
- Check policy conditions match your auth setup
- Test with different user roles

## Next Steps

After migrations are complete:
1. ✅ Test signup flow (profile should auto-create)
2. ✅ Test Stripe webhook endpoint
3. ✅ Enable rate limiting
4. ✅ Verify history saving works

## Rollback (if needed)

To rollback migrations:

```sql
-- Run in reverse order
DROP TABLE IF EXISTS usage_logs CASCADE;
DROP TABLE IF EXISTS user_history CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
```
