# 🏆 LaunchKS - AI-Powered Career Transition Platform

**Competition:** [2025 Wichita Regional AI Prompt Championship](https://www.aipromptchamp.com)
**Challenge:** #1 - Architect Track
**Date:** October 25, 2024
**Result:** 🥇 **Competition Winner** - Major Part of Winning Submission Portfolio

A comprehensive workforce development platform built for the Kansas Department of Labor to help Kansas citizens upskill, change careers, and navigate personalized career transition pathways.

**Live Demo:** [ADD DEPLOYMENT URL HERE]

---

## 🎯 The Challenge

### Task: Workforce Development Team

**Scenario:** As founding engineers building products for the Kansas Department of Labor, create an application that enables them to serve more citizens looking to upskill and change careers.

### Judging Criteria - Architect Track

The solution was evaluated on:

**Proposed Value – 40% (0-4 points)**
- Accuracy, problem fit, and real-world potential

**Technical Innovation – 30% (0-3 points)**
- Novelty, architecture, and clarity of execution

**User Experience – 30% (0-3 points)**
- Ease of interaction and presentation polish

**Scoring:** Each challenge ranked 1-10 by judges, with scores averaged for final results.

---

## 📋 Challenge Requirements

### Core Required Features

✅ **Intake Portal**
Interactive and engaging information gathering from individuals seeking career change

✅ **Dynamic Plan Generation Module**
AI-powered personalized career transition plans based on user profile and goals

✅ **Progress Tracking Dashboard**
Interactive interface for users to track milestones, tasks, and journey progress

### Challenge Opportunity (Implemented)

✅ **Agent Personas**
AI advisor with distinct personality serving different purposes throughout the learning journey

### Deliverables

✅ **Publicly Accessible Demo Site** - Deployed on Vercel
✅ **Technical Walkthrough** - Complete implementation documentation

---

## 💡 The Solution: LaunchKS

**LaunchKS** (Where Kansans Take Off) is a unified digital platform that addresses Kansas's workforce paradox: 70,000+ job openings while hundreds of thousands struggle to navigate fragmented career development resources.

### Key Features

**1. Conversational AI Intake**
- Natural chat-based onboarding experience
- Progressive information gathering
- Contextual follow-up questions
- Personality-driven AI advisor

**2. AI-Powered Career Planning**
- Real-time web search for Kansas-specific resources
- Dynamic plan generation with structured output
- Multi-phase transition roadmaps
- Integration with local training providers and job boards

**3. Comprehensive Progress Tracking**
- Interactive dashboard with visual progress indicators
- Phase-based journey organization
- Milestone and task management
- Resource library with curated links

**4. Kansas-Specific Integration**
- WSU Tech, Butler CC, Newman University programs
- KansasWorks job listings
- Local workforce centers and apprenticeships
- Real salary data and job market outlook

**5. Admin & Management Tools**
- User management dashboard
- Plan oversight and analytics
- Email reminder scheduling system
- System-wide configuration

---

## 🏗️ Technical Architecture

### Tech Stack

**Frontend**
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Component library (Radix UI primitives)
- **React Hook Form + Zod** - Form validation

**Backend**
- **Next.js API Routes** - Serverless functions
- **Vercel AI SDK 5** - Streaming AI responses with tool calling
- **OpenAI GPT-4** - Language model for conversational AI
- **Tavily API** - Web search integration for real-time data

**Database**
- **Neon PostgreSQL** - Serverless Postgres database
- **Drizzle ORM** - Type-safe database queries
- **Better Auth** - Authentication system

**Infrastructure**
- **Vercel** - Deployment and hosting
- **Vercel Cron** - Scheduled email reminders
- **Resend** - Transactional email service

### System Architecture

```
┌─────────────────┐
│   Landing Page  │
│   (Marketing)   │
└────────┬────────┘
         │
    ┌────▼────────────────────────────┐
    │  Authentication (Better Auth)   │
    │  • Email/Password               │
    │  • Email Verification           │
    │  • Password Reset               │
    └────┬────────────────────────────┘
         │
    ┌────▼────────────────────────────┐
    │   Onboarding Flow               │
    │  • Profile Creation             │
    │  • Initial Assessment           │
    └────┬────────────────────────────┘
         │
    ┌────▼────────────────────────────┐
    │   AI Intake Chat                │
    │  • Conversational UI            │
    │  • Profile Building             │
    │  • Goal Setting                 │
    └────┬────────────────────────────┘
         │
    ┌────▼────────────────────────────┐
    │   Plan Generation Engine        │
    │  • AI Tool Calling (Tavily)     │
    │  • Structured Output (Zod)      │
    │  • Kansas Resource Integration  │
    └────┬────────────────────────────┘
         │
    ┌────▼────────────────────────────┐
    │   Progress Dashboard            │
    │  • Phase Tracking               │
    │  • Milestone Management         │
    │  • Task Completion              │
    │  • Resource Library             │
    └────┬────────────────────────────┘
         │
    ┌────▼────────────────────────────┐
    │   Admin Panel                   │
    │  • User Management              │
    │  • Plan Oversight               │
    │  • Email Management             │
    └─────────────────────────────────┘
```

### Database Schema

**Core Tables:**
- `user` - Authentication and user accounts
- `user_profile` - Detailed profile information (location, employment status, education, barriers)
- `conversation` - Chat sessions with AI advisor
- `message` - Individual chat messages
- `plan` - Generated career transition plans
- `phase` - Plan phases (e.g., "Skill Building", "Job Search")
- `milestone` - Phase milestones with deadlines
- `task` - Actionable tasks for users to complete
- `resource` - Curated links and materials
- `email_log` - Outbound email tracking

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (Neon recommended)
- OpenAI API key
- Tavily API key
- Resend API key (for email)

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd challenge-1

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Configure .env.local with:
# - DATABASE_URL (Neon PostgreSQL connection string)
# - OPENAI_API_KEY
# - TAVILY_API_KEY
# - BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
# - BETTER_AUTH_URL (your deployment URL)
# - RESEND_API_KEY

# Push database schema
pnpm db:push

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Available Scripts

```bash
pnpm dev          # Start development server (port 3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:push      # Push schema changes to database
pnpm db:studio    # Open Drizzle Studio (database GUI)
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
```

---

## 📁 Project Structure

```
challenge-1/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── verify-email/
│   │   └── reset-password/
│   ├── (app)/               # Protected application routes
│   │   ├── dashboard/       # Main user dashboard
│   │   ├── intake/          # AI chat intake portal
│   │   ├── onboarding/      # Initial profile setup
│   │   ├── plan/            # Plan view and management
│   │   │   ├── [planId]/    # Individual plan pages
│   │   │   └── generate/    # Plan generation flow
│   │   ├── settings/        # User settings
│   │   └── admin/           # Admin panel
│   │       ├── users/
│   │       ├── plans/
│   │       └── emails/
│   ├── api/
│   │   ├── auth/            # Better Auth endpoints
│   │   ├── chat/            # AI chat streaming
│   │   ├── plan/            # Plan CRUD operations
│   │   └── cron/            # Scheduled jobs
│   └── page.tsx             # Landing page
│
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Auth-specific components
│   ├── intake/              # Chat interface components
│   ├── plan/                # Plan display components
│   └── dashboard/           # Dashboard widgets
│
├── lib/
│   ├── ai/
│   │   ├── config.ts        # AI model configuration
│   │   ├── prompts.ts       # System prompts
│   │   ├── plan-generator.ts # Plan generation logic
│   │   ├── tools.ts         # AI tool definitions (web search)
│   │   └── schemas/         # Zod schemas for structured output
│   ├── auth/
│   │   ├── server.ts        # Server-side auth utilities
│   │   └── client.ts        # Client-side auth hooks
│   ├── db/
│   │   ├── index.ts         # Database client
│   │   └── schema.ts        # Drizzle schema definitions
│   └── email/
│       ├── client.ts        # Resend email client
│       └── templates/       # React Email templates
│
├── types/                   # TypeScript type definitions
├── docs/                    # Documentation files
├── prompts/                 # Development prompts and notes
└── public/                  # Static assets
```

---

## 🎨 User Experience Flow

### 1. Landing Experience
- Clear value proposition: "Where Kansans Take Off"
- Feature highlights and social proof
- Prominent CTA to get started

### 2. Sign Up & Onboarding
- Quick email/password registration
- Email verification
- Basic profile setup (name, location, residency status)

### 3. AI Intake Conversation
- Natural chat interface with personality-driven AI
- Progressive disclosure of questions
- Topics covered:
  - Current employment and career goals
  - Skills and experience
  - Education level
  - Available time commitment
  - Transportation and financial constraints
  - Learning preferences

### 4. Plan Generation
- Loading state with progress indication
- Real-time web search for Kansas resources
- Structured plan generation with:
  - Career overview and salary expectations
  - Multi-phase roadmap (3-5 phases)
  - Milestone breakdowns with deadlines
  - Actionable tasks with completion criteria
  - Curated resource links

### 5. Dashboard Experience
- Progress overview with completion percentages
- Current phase and next milestones
- Interactive task list with checkboxes
- Resource library
- Ability to regenerate or modify plan

### 6. Ongoing Engagement
- Weekly email reminders (Vercel Cron)
- Milestone celebration emails
- Admin monitoring and support

---

## 🤖 AI Implementation Details

### Conversational AI Advisor

**System Prompt Design:**
- Warm, encouraging, professional tone
- Kansas-focused language and references
- Asks clarifying questions naturally
- Adapts based on user responses

**Tool Integration:**
- `search_web` - Tavily API for real-time Kansas resource discovery
- Searches for training programs, job listings, salary data
- Filters results to Kansas-specific sources

**Structured Output:**
- Zod schemas enforce consistent plan structure
- Type-safe generation with Vercel AI SDK `generateObject`
- Validation ensures all required fields are present

### Example Plan Structure

```typescript
{
  title: "Software Developer Transition Plan",
  currentCareer: "Customer Service Representative",
  targetCareer: "Software Developer",
  estimatedDuration: "12-18 months",
  salaryExpectations: "$65,000 - $85,000 in Wichita",
  phases: [
    {
      title: "Foundation Building",
      description: "Learn programming fundamentals",
      milestones: [
        {
          title: "Complete online coding bootcamp",
          description: "Build core programming skills",
          estimatedDuration: "3 months",
          tasks: [
            {
              title: "Enroll in WSU Tech Web Development program",
              description: "Tuition-free through Wichita Promise",
              completionCriteria: "Registration confirmed"
            }
          ],
          resources: [
            {
              title: "WSU Tech Programs",
              url: "https://wsutech.edu/programs/...",
              type: "training"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🏅 Why This Solution Stood Out

### Technical Innovation

1. **Agentic AI Development** - Built rapidly using AI-assisted development (Claude Code)
2. **Real-time Resource Integration** - Live web search ensures current Kansas data
3. **Type-Safe AI Output** - Zod schemas + Vercel AI SDK for reliable structured generation
4. **Streaming UX** - Progressive loading for better perceived performance
5. **Modern Stack** - Next.js 16 App Router with latest React patterns

### Problem-Solution Fit

1. **Addresses Real Pain Points**
   - Fragmented resource discovery → Unified platform
   - Generic career advice → Kansas-specific guidance
   - Overwhelming options → Personalized roadmaps
   - Motivation loss → Progress tracking and reminders

2. **Kansas-Centric Design**
   - WSU Tech Wichita Promise integration
   - KansasWorks job listings
   - Local workforce centers and programs
   - Regional salary expectations

3. **Scalable Impact**
   - Self-service platform reduces manual counseling load
   - AI scales infinitely while maintaining quality
   - Data-driven insights for program improvement

### User Experience Excellence

1. **Conversational Design** - Feels like talking to a career counselor, not filling forms
2. **Visual Progress** - Clear indicators motivate continued engagement
3. **Mobile Responsive** - Accessible on any device
4. **Accessibility** - WCAG-compliant component library
5. **Email Engagement** - Automated nudges maintain momentum

---

## 📊 Competition Success

### What Made This Submission Win

1. **Complete Feature Set** - All required features plus bonus agent personas
2. **Production Quality** - Deployed, functional demo with real data
3. **Technical Depth** - Sophisticated AI integration with tool calling
4. **Kansas Integration** - Actual local resources, not generic examples
5. **User-Centric Design** - Polished UI/UX with attention to detail
6. **Rapid Development** - Built in competition timeframe using AI assistance

### Architect Track Principles Applied

- ✅ **Accuracy** - Real Kansas programs and job market data
- ✅ **Problem Fit** - Addresses documented workforce development challenges
- ✅ **Real-World Potential** - Could deploy to production with minimal changes
- ✅ **Technical Novelty** - Innovative use of AI tool calling and structured output
- ✅ **Clear Architecture** - Well-organized, maintainable codebase
- ✅ **User Experience** - Intuitive, engaging, accessible interface

---

## 🔧 Key Technical Implementations

### AI Chat with Streaming

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { aiModel } from '@/lib/ai/config';
import { getIntakeSystemPrompt } from '@/lib/ai/prompts';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: aiModel,
    system: getIntakeSystemPrompt(),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### Plan Generation with Tools

```typescript
// lib/ai/plan-generator.ts
import { generateObject } from 'ai';
import { planSchema } from './schemas/plan';
import { availableTools } from './tools';

const result = await generateObject({
  model: aiModel,
  system: getPlanGeneratorSystemPrompt(),
  schema: planSchema,
  tools: availableTools, // Includes Tavily web search
});

const plan = result.object; // Type-safe, validated output
```

### Scheduled Email Reminders

```typescript
// app/api/cron/email-reminders/route.ts
export async function GET() {
  const usersWithPlans = await db
    .select()
    .from(user)
    .innerJoin(plan, eq(plan.userId, user.id))
    .where(eq(plan.status, 'active'));

  for (const { user, plan } of usersWithPlans) {
    await sendProgressReminder(user, plan);
  }

  return new Response('Reminders sent', { status: 200 });
}
```

---

## 🚀 Deployment

**Hosting:** Vercel
**Database:** Neon (serverless PostgreSQL)
**Continuous Deployment:** Automatic on `git push` to main branch

### Environment Variables

Required for production deployment:

```bash
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]

# AI Services
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...

# Authentication
BETTER_AUTH_SECRET=[generate-with-openssl]
BETTER_AUTH_URL=https://your-domain.vercel.app

# Email
RESEND_API_KEY=re_...
```

### Vercel Configuration

```json
{
  "crons": [
    {
      "path": "/api/cron/email-reminders",
      "schedule": "0 10 * * 1"  // Every Monday at 10 AM
    }
  ]
}
```

---

## 📝 Development Notes

### Built With AI-First Methodology

This project was developed using **agentic AI development** with [Claude Code](https://claude.com/claude-code):

- **Architecture Design** - AI-assisted system design and technology selection
- **Code Generation** - Components, API routes, and database schema
- **Documentation Lookup** - Context7 MCP for real-time API documentation
- **Debugging** - AI-powered error analysis and fixes
- **Testing** - AI-generated test scenarios

This demonstrates the power of AI-assisted development for rapid prototyping and competition-style development.

---

## 🙏 Acknowledgments

- **Competition Organizers:** Wichita Regional AI Prompt Championship team
- **Kansas Department of Labor:** Challenge inspiration and real-world problem context
- **Community Partners:** WSU Tech, KansasWorks, and local workforce organizations
- **AI Tools:** Claude AI and Claude Code for development assistance
- **Open Source:** Next.js, Vercel AI SDK, shadcn/ui, and entire tech stack

---

## 📄 License

This project was created for the 2025 Wichita Regional AI Prompt Competition. All concepts and code are provided for educational and portfolio purposes.

---

**🏆 Competition Winner - Architect Track Challenge #1**
**🚀 Generated with [Claude Code](https://claude.com/claude-code)**
**🌾 Proudly Built for Kansas**

---

## 🔗 Related Repositories

This submission was part of a complete competition portfolio:

- **[ai_competition_oracle](https://github.com/jsperson/ai_competition_oracle)** - Oracle Track (Winner): Business plan and market research
- **[ai_competition](https://github.com/jsperson/ai_competition)** - Muse Track (2nd Place): Kansas web games
- **[ai_competition_2](https://github.com/jsperson/ai_competition_2)** - Challenge #4: Punchcard decoder
- **challenge-1** (this repo) - Architect Track: LaunchKS platform
