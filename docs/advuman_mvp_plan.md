# Advuman MVP Implementation Plan
## Simplest Version to Validate Core Concept

---

## 🎯 MVP Core Principle

**Build the absolute minimum to test: "Can AI provide personalized business advice that users find valuable enough to pay for?"**

Everything else is secondary.

---

## 📦 What You DON'T Need for MVP

- ❌ Custom knowledge graphs
- ❌ Multi-model orchestration
- ❌ Advanced financial modeling
- ❌ Real-time market data feeds
- ❌ Team collaboration features
- ❌ White-label capabilities
- ❌ Enterprise features
- ❌ Mobile apps
- ❌ Public API
- ❌ Complex personalization engine (initially)

---

## ✅ What You DO Need for MVP (Weeks 1-8)

### Phase 1: Core Chat Interface (Weeks 1-2)

**Tech Stack:**
- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: Next.js API routes (serverless)
- **Database**: Supabase (PostgreSQL + authentication)
- **AI**: Claude API (Anthropic) - single model
- **Hosting**: Vercel (free tier for MVP)

**Features:**
1. **User Authentication** (Supabase Auth)
   - Email/password signup and login
   - Google OAuth (optional but recommended)
   - Simple user profile (name, business type, email)

2. **Basic Chat Interface**
   - Clean, simple chat UI (think ChatGPT but branded)
   - Message history stored in Supabase
   - Conversation threads (one active conversation per user initially)
   - Copy/export conversation functionality

3. **AI Integration**
   - Claude API integration (start with Claude Sonnet 4)
   - System prompt that focuses on business consulting
   - Basic context window management (last 10-15 messages)

**MVP System Prompt Template:**
```
You are Advuman, an AI business consultant specializing in helping MSMEs and young professionals.

User Context:
- Name: {user_name}
- Business Type: {business_type}
- Industry: {industry}
- Current Goal: {goal}

Provide specific, actionable advice tailored to their situation. Ask clarifying questions when needed. Be concise but thorough.
```

**Database Schema (Minimal):**
```sql
-- Users table (Supabase Auth handles most of this)
users (
  id uuid primary key,
  email text,
  full_name text,
  business_type text,  -- solopreneur, MSME, professional
  industry text,
  created_at timestamp
)

-- Conversations table
conversations (
  id uuid primary key,
  user_id uuid references users(id),
  title text,
  created_at timestamp,
  updated_at timestamp
)

-- Messages table
messages (
  id uuid primary key,
  conversation_id uuid references conversations(id),
  role text,  -- 'user' or 'assistant'
  content text,
  created_at timestamp
)

-- User profiles (simple personalization)
user_profiles (
  user_id uuid primary key references users(id),
  business_name text,
  business_stage text,  -- idea, mvp, growth, scale
  monthly_revenue text,  -- range like "0-10k", "10k-50k"
  team_size int,
  primary_goal text,
  challenges text[],
  updated_at timestamp
)
```

### Phase 2: Basic Personalization (Weeks 3-4)

**Features:**
1. **Onboarding Flow** (5-7 questions)
   - What type of business do you have?
   - What industry are you in?
   - What stage is your business at?
   - What's your primary goal right now?
   - What's your biggest challenge?

2. **Context Injection**
   - Store onboarding answers in user_profiles
   - Inject this context into system prompt for every conversation
   - Allow users to update their profile

3. **Conversation Context**
   - Store and retrieve conversation history
   - Include last 10-15 messages in context window
   - Basic conversation naming (auto-generate from first message)

**Implementation:**
```javascript
// Example context building
const buildSystemPrompt = (userProfile, conversationHistory) => {
  return `You are Advuman, an AI business consultant.

User Profile:
- Name: ${userProfile.full_name}
- Business: ${userProfile.business_name}
- Industry: ${userProfile.industry}
- Stage: ${userProfile.business_stage}
- Primary Goal: ${userProfile.primary_goal}
- Key Challenges: ${userProfile.challenges.join(', ')}

Conversation History Summary:
${generateHistorySummary(conversationHistory)}

Provide specific, actionable advice tailored to their unique situation. Reference their profile context when relevant.`;
};
```

### Phase 3: Payment & Tiers (Weeks 5-6)

**Payment Provider:**
- **Stripe Checkout** (simplest implementation)
- **Stripe Customer Portal** (manage subscriptions)

**Pricing Tiers (MVP):**

**Free Tier:**
- 10 conversations per month
- Basic business advice
- 7-day conversation history
- No onboarding personalization

**Professional Tier ($49/month):**
- Unlimited conversations
- Full personalization (onboarding)
- Unlimited conversation history
- Priority response
- Export conversations

**Database Changes:**
```sql
-- Add to users table
subscription_tier text default 'free',  -- 'free', 'professional'
subscription_status text,  -- 'active', 'canceled', 'past_due'
stripe_customer_id text,
stripe_subscription_id text,
conversations_this_month int default 0,
billing_period_start timestamp
```

**Implementation:**
- Stripe webhook to handle subscription events
- Simple usage tracking (conversation count)
- Feature gating in API routes
- Upgrade/downgrade flow

### Phase 4: Polish & Launch Prep (Weeks 7-8)

**Features:**
1. **Landing Page**
   - Clear value proposition
   - Pricing table
   - Testimonials section (prepare 3-5 early user quotes)
   - FAQ section
   - CTA to sign up

2. **User Dashboard**
   - Conversation list
   - Usage stats (conversations used this month)
   - Subscription management
   - Profile settings

3. **Basic Analytics**
   - Plausible or PostHog (privacy-friendly)
   - Track: signups, conversations, upgrades, churn
   - Simple admin dashboard to monitor key metrics

4. **Email System**
   - Welcome email (Resend or SendGrid)
   - Weekly usage summary
   - Upgrade prompts (when approaching limits)
   - Payment reminders

5. **Quality of Life**
   - Loading states
   - Error handling
   - Mobile responsive design
   - Keyboard shortcuts (cmd+enter to send)

---

## 🛠️ Technical Implementation Details

### Project Structure
```
advuman-mvp/
├── app/                    # Next.js 14 app directory
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── chat/
│   │   ├── settings/
│   │   └── billing/
│   ├── api/
│   │   ├── chat/
│   │   ├── webhooks/
│   │   └── stripe/
│   └── layout.tsx
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageList.tsx
│   │   └── MessageInput.tsx
│   ├── onboarding/
│   │   └── OnboardingFlow.tsx
│   └── ui/              # Shadcn UI components
├── lib/
│   ├── supabase.ts
│   ├── stripe.ts
│   ├── claude.ts
│   └── utils.ts
├── types/
│   └── database.types.ts
└── public/
```

### Environment Variables
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Key API Routes

**1. POST /api/chat**
```typescript
// Main chat endpoint
export async function POST(req: Request) {
  // 1. Authenticate user
  // 2. Check subscription limits
  // 3. Get user profile and conversation history
  // 4. Build system prompt with context
  // 5. Call Claude API
  // 6. Save message to database
  // 7. Return response
}
```

**2. POST /api/webhooks/stripe**
```typescript
// Handle Stripe events
export async function POST(req: Request) {
  // Handle: customer.subscription.created
  // Handle: customer.subscription.updated
  // Handle: customer.subscription.deleted
  // Handle: invoice.payment_succeeded
  // Handle: invoice.payment_failed
}
```

**3. GET/POST /api/user/profile**
```typescript
// Get and update user profile
```

### Claude API Integration
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function chat(messages: Message[], userProfile: UserProfile) {
  const systemPrompt = buildSystemPrompt(userProfile);
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content
    }))
  });
  
  return response.content[0].text;
}
```

---

## 💰 MVP Budget Estimate

**Initial Setup (One-time):**
- Domain name: $15/year
- Logo/branding (Fiverr): $50-100
- Legal (terms, privacy): $0-500 (templates available)

**Monthly Costs:**
- Vercel hosting: $0 (hobby) → $20 (pro when needed)
- Supabase: $0 (free tier, 500MB DB, 2GB transfer)
- Anthropic API: ~$0.015/1K tokens
  - 1,000 conversations × 10 messages × 1K tokens = ~$150/month
- Stripe: 2.9% + $0.30 per transaction
- Email (Resend): $0 (free tier, 3K emails/month)
- Analytics (Plausible): $9/month

**Total Monthly (100 paying users): ~$200-300/month**

---

## 📊 MVP Success Metrics

**Week 4 Goals:**
- 50 beta signups
- 20 active users (sent 5+ messages)
- Average 8+ messages per active user
- 4+ out of 5 satisfaction rating

**Week 8 Goals (Launch):**
- 200 total signups
- 50 active users
- 10 paying customers ($490 MRR)
- 15% free-to-paid conversion from active users
- <10% churn rate

**Validation Criteria:**
✅ Users return 3+ times per week
✅ Average conversation length >5 messages
✅ Users implement at least one suggestion
✅ 70%+ would recommend to peers
✅ 20%+ free users willing to upgrade

---

## 🚀 Launch Strategy (Weeks 9-12)

### Pre-Launch (Week 9)
1. **Beta Program**
   - Invite 50 ideal users (personal network, LinkedIn)
   - Offer lifetime 50% discount for feedback
   - Collect testimonials and case studies
   - Iterate on feedback

2. **Content Preparation**
   - Write 10 blog posts (business advice topics)
   - Create 20 LinkedIn posts (AI + business insights)
   - Prepare Product Hunt launch assets
   - Record demo video (3-4 minutes)

### Launch Week (Week 10)
1. **Product Hunt Launch**
   - Schedule for Tuesday (best day)
   - Rally beta users for upvotes/comments
   - Monitor and respond to all comments
   - Goal: Top 5 Product of the Day

2. **Social Media Blitz**
   - Post launch announcement on LinkedIn
   - Share in relevant Reddit communities (r/entrepreneur, r/smallbusiness)
   - Tweet thread about building in public
   - Share in Indie Hackers

3. **Community Outreach**
   - Message relevant communities
   - Offer free access to incubators/accelerators
   - Partner with MSME associations

### Post-Launch (Weeks 11-12)
1. **Double down on what works**
   - Track which channels drive signups
   - Optimize landing page based on data
   - Iterate on messaging

2. **User Interviews**
   - Talk to 20+ users about experience
   - Understand why they upgraded (or didn't)
   - Find product/market fit gaps

3. **Content Marketing**
   - Publish case studies
   - Share user success stories
   - Start weekly LinkedIn tips series

---

## 🔧 Technical Stack Summary

| Component | Technology | Why |
|-----------|-----------|-----|
| Frontend | Next.js 14 (App Router) | Modern, fast, great DX |
| UI Library | Shadcn UI + Tailwind | Beautiful, customizable |
| Backend | Next.js API Routes | Serverless, scales automatically |
| Database | Supabase (PostgreSQL) | Free tier, auth included, realtime |
| AI | Claude API (Anthropic) | Best reasoning, long context |
| Payments | Stripe | Industry standard, easy integration |
| Hosting | Vercel | Zero config, perfect for Next.js |
| Email | Resend | Modern API, great deliverability |
| Analytics | Plausible | Privacy-friendly, simple |

---

## 🎨 Design Priorities for MVP

1. **Clean and Simple**
   - White/light background
   - Professional color palette (blue/gray tones)
   - Generous whitespace
   - Clear typography (Inter or similar)

2. **Chat Interface**
   - Focus on conversation
   - Minimal distractions
   - Fast message rendering
   - Clear user/AI distinction

3. **Mobile Responsive**
   - Must work perfectly on mobile
   - 50%+ of users will be on mobile
   - Test on iPhone and Android

4. **Professional Branding**
   - Logo that conveys intelligence + humanity
   - Tagline: "Your AI Business Advisor"
   - Consistent voice (professional but friendly)

---

## 🚨 Common Pitfalls to Avoid

1. **Over-engineering**
   - Don't build features "for the future"
   - Ship fast, iterate based on feedback
   - Perfect is the enemy of done

2. **Feature Creep**
   - Resist adding "one more thing"
   - Stay focused on core value prop
   - Make a list for "version 2"

3. **Ignoring Users**
   - Talk to users weekly (minimum)
   - Watch session recordings
   - Read every piece of feedback

4. **Premature Scaling**
   - Don't worry about 10,000 users yet
   - Get to 10 paying users first
   - Manual processes are okay initially

5. **Analysis Paralysis**
   - Don't spend months planning
   - Start building in week 1
   - Learn by doing

---

## 📈 Next Steps After MVP

**If MVP validates (10+ paying users, 80%+ retention):**

### Phase 2 Features (Months 3-4)
- Document upload & analysis
- Conversation summarization
- Industry-specific templates
- Email weekly insights
- Better conversation search

### Phase 3 Features (Months 5-6)
- Team collaboration
- Advanced analytics
- Custom frameworks builder
- API access
- Slack/Discord integration

### Growth Phase (Months 7-12)
- Fundraising (if needed)
- Hire team (2-3 people)
- Content marketing at scale
- Partnership program
- International expansion

---

## 🎯 Final Checklist Before Building

- [ ] Have you validated the problem with 20+ potential users?
- [ ] Do you have a clear target user persona?
- [ ] Can you describe your MVP in one sentence?
- [ ] Have you set aside 2-3 hours daily for 8 weeks?
- [ ] Do you have technical skills or a technical co-founder?
- [ ] Have you budgeted $300-500 for tools and testing?
- [ ] Do you have a plan to get first 50 users?
- [ ] Are you committed to talking to users weekly?
- [ ] Can you ship an imperfect product?
- [ ] Are you solving a problem people will pay for?

---

## 💡 Key Insight

**Your MVP should answer ONE question:**

*"Will MSMEs and young professionals pay $49/month for AI-powered, personalized business advice that remembers their context and evolves with them?"*

Everything else is optimization. Build the minimum to test this hypothesis, then iterate based on real user feedback and payment behavior.

**Remember**: Perfect is the enemy of shipped. Your first version will be imperfect—that's okay. What matters is learning quickly and adjusting.

---

## 📞 MVP Development Timeline

**Week 1-2:** Set up tech stack, basic auth, chat UI
**Week 3-4:** Personalization, onboarding, context injection  
**Week 5-6:** Stripe integration, tiered access, usage tracking
**Week 7-8:** Polish, testing, landing page, beta program
**Week 9:** Beta feedback, iterations, content prep
**Week 10:** Public launch (Product Hunt + social)
**Week 11-12:** Growth experiments, user interviews, iteration

**Total time to launch: 12 weeks (3 months)**

---

## 🎓 Resources for Building

**Technical:**
- Next.js docs: https://nextjs.org/docs
- Supabase quickstart: https://supabase.com/docs/guides/getting-started
- Anthropic API: https://docs.anthropic.com/
- Stripe checkout: https://stripe.com/docs/payments/checkout

**Design:**
- Shadcn UI: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/
- Heroicons: https://heroicons.com/

**Learning:**
- Build in public on Twitter/LinkedIn
- Join Indie Hackers community
- Follow other AI product launches
- Read user feedback religiously

---

**Now go build! 🚀**
