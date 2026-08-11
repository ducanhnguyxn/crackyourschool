# Quick Start Guide - Supabase CLI on Windows

## Using npx (Easiest - No Installation)

Since `npm install -g supabase` doesn't work, use `npx` to run Supabase CLI commands:

### 1. Login to Supabase
```powershell
npx supabase login
```

### 2. Link Your Project
```powershell
npx supabase link --project-ref ejakrzhkyfzxeuqcyxrp
```

### 3. Deploy Edge Functions
```powershell
# Deploy checkout session function
npx supabase functions deploy create-checkout-session

# Deploy webhook function
npx supabase functions deploy stripe-webhook
```

### 4. Apply Database Migrations
```powershell
# Push migrations to your Supabase project
npx supabase db push
```

## Alternative: Install Scoop (Permanent Solution)

If you want to install Supabase CLI permanently:

```powershell
# Install Scoop package manager
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Add Supabase bucket
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git

# Install Supabase CLI
scoop install supabase

# Now you can use 'supabase' directly without 'npx'
supabase login
```

## All Commands Work with npx

Just prefix any Supabase CLI command with `npx`:
- `npx supabase login`
- `npx supabase functions deploy <function-name>`
- `npx supabase db push`
- `npx supabase status`
- etc.

