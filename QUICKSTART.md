# Quick Start Guide

Get Advuman AI MVP running in 15 minutes.

## Step 1: Install Dependencies (2 min)

```bash
npm install
```

## Step 2: Set up Supabase (5 min)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to you)
3. Wait for the project to be ready (~2 min)
4. Go to **Settings** > **API**:
   - Copy your **Project URL**
   - Copy your **anon/public** key
   - Copy your **service_role** key (click to reveal)
5. Go to **SQL Editor** and run the entire contents of `lib/supabase/schema.sql`
   - This creates all the tables and security policies

## Step 3: Set up Anthropic (2 min)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys** and create a new key
4. Copy the key (it starts with `sk-ant-`)

## Step 4: Configure Environment (1 min)

Create `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace the values with your actual keys from Steps 2 and 3.

## Step 5: Run the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test the MVP

1. Click "Sign Up" and create an account
2. Complete the 5-step onboarding flow
3. Start chatting with your AI business advisor!

## Common Issues

**Build errors?**
- Make sure you're using Node.js 18 or higher: `node --version`
- Delete `node_modules` and `.next`, then run `npm install` again

**"Unauthorized" errors?**
- Double-check your Supabase keys are correct
- Make sure the SQL schema was run successfully

**Chat not responding?**
- Verify your Anthropic API key is valid
- Check you have credits in your Anthropic account
- Look at the browser console for error messages

## What's Included

- ✅ User authentication (email/password + Google OAuth ready)
- ✅ Personalized onboarding flow
- ✅ AI chat with context awareness
- ✅ Conversation persistence
- ✅ Free tier with 10 conversations/month

## What's NOT Included (Yet)

- ❌ Stripe payments (Phase 3)
- ❌ Conversation history UI
- ❌ Email notifications
- ❌ Analytics
- ❌ Landing page

## Next Actions

1. Test the chat thoroughly
2. Try different business questions
3. Check the conversation is saved (reload the page)
4. Ready to add Stripe? See `/docs/advuman_mvp_plan.md` Phase 3

Enjoy building with Advuman! 🚀
