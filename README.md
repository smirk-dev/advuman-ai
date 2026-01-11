# Advuman AI - MVP

Your AI Business Advisor for MSMEs and Young Professionals

## Overview

Advuman is a personalized AI business consultant SaaS built with Next.js, Supabase, and Claude AI. It provides tailored business advice based on user profiles and conversation context.

## Features (MVP Phase 1-2)

- **User Authentication**: Email/password and Google OAuth via Supabase
- **Onboarding Flow**: 5-step personalization to understand user's business
- **AI Chat Interface**: Conversational business consulting powered by Claude Sonnet 4.5
- **Context-Aware Responses**: AI remembers user profile and conversation history
- **Subscription Tiers**:
  - Free: 10 conversations/month, 7-day history
  - Professional: Unlimited conversations, full history (to be implemented)

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Claude API (Anthropic)
- **Payments**: Stripe (to be integrated)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- An Anthropic API key
- A Stripe account (for Phase 3)

### 1. Clone and Install

```bash
cd advuman-ai
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to SQL Editor and run the schema from `lib/supabase/schema.sql`
4. Enable Google OAuth (optional):
   - Go to Authentication > Providers
   - Enable Google and add your OAuth credentials

### 3. Set up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
advuman-ai/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Protected pages (chat)
│   ├── api/                 # API routes
│   │   ├── chat/           # Chat endpoint
│   │   ├── conversations/  # Conversations management
│   │   └── user/profile/   # User profile management
│   ├── auth/callback/      # OAuth callback
│   ├── onboarding/         # Onboarding flow
│   └── layout.tsx          # Root layout
├── components/
│   ├── chat/               # Chat UI components
│   ├── onboarding/         # Onboarding flow
│   └── ui/                 # Shadcn UI components
├── lib/
│   ├── supabase/           # Supabase client & schema
│   ├── claude.ts           # Claude API integration
│   └── utils.ts            # Utility functions
├── types/
│   └── database.types.ts   # TypeScript types
└── docs/                   # Documentation
```

## Database Schema

The application uses 4 main tables:

1. **users** - Extended user data (business type, subscription, etc.)
2. **user_profiles** - Detailed personalization data
3. **conversations** - Chat conversations
4. **messages** - Individual messages within conversations

All tables have Row Level Security (RLS) enabled for data protection.

## API Endpoints

- `POST /api/chat` - Send message and get AI response
- `GET /api/conversations` - List user's conversations
- `GET /api/conversations/[id]/messages` - Get messages for a conversation
- `GET /api/user/profile` - Get user profile
- `POST /api/user/profile` - Create/update user profile

## Development Workflow

### Adding a New UI Component

Use Shadcn UI for consistent components:

```bash
npx shadcn@latest add [component-name]
```

### Running Database Migrations

Update the schema in `lib/supabase/schema.sql` and run it in Supabase SQL Editor.

### Testing Authentication

1. Create a test account at `/signup`
2. Complete the onboarding flow
3. Start chatting at `/chat`

## Next Steps (Phase 3-4)

- [ ] Stripe integration for subscriptions
- [ ] Usage tracking and limits enforcement
- [ ] Landing page with pricing
- [ ] User dashboard with stats
- [ ] Email notifications (Resend/SendGrid)
- [ ] Conversation history and search
- [ ] Export conversations
- [ ] Analytics integration

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `ANTHROPIC_API_KEY` | Claude API key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Phase 3 |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Phase 3 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Phase 3 |
| `RESEND_API_KEY` | Email service API key | Phase 4 |

## Troubleshooting

### "Unauthorized" errors

- Check that your Supabase environment variables are correct
- Verify you're logged in (check Application > Cookies in browser DevTools)
- Ensure RLS policies are set up correctly in Supabase

### Chat not working

- Verify your Anthropic API key is valid
- Check the browser console for errors
- Ensure the `/api/chat` endpoint is accessible

### Database errors

- Make sure you've run the schema SQL in Supabase
- Check that RLS policies allow the operation
- Verify foreign key relationships are correct

## Contributing

This is an MVP. Focus on core functionality before adding features.

## License

Private - Not for distribution

## Support

For issues, check the `/docs` folder or create an issue in the repository.
