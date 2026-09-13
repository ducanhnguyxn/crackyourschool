# HackYourSchool

Your free AI study partner — generate quizzes and flashcards from your notes, summarize and chat with your PDFs, get help from an AI tutor, and track your study progress, all in one place.

## Features

- **AI Quiz Generator** — turn a PDF into a mixed multiple-choice/open-ended quiz
- **Flashcards** — customizable decks (term-definition, Q&A, cloze, and more) generated from your documents
- **PDF Summarizer** — upload a PDF, get an instant AI summary, then chat with it (including images/diagrams)
- **AI Tutor** — a patient, step-by-step chat tutor for any topic
- **Mind Maps** — visualize concepts and relationships
- **Study Schedule** — plan and track study sessions on a calendar
- **Dashboard** — real study-time, weekly-goal, and points stats pulled from your actual activity
- **Free & Pro tiers** — a generous free tier (2 PDFs, 30 AI tutor questions/month, unlimited quizzes/flashcards), with Pro removing the caps via Stripe subscriptions

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — auth, Postgres database, storage, and edge functions
- [OpenAI](https://platform.openai.com/) — quiz/flashcard generation, summaries, and the AI tutor
- [Stripe](https://stripe.com/) — subscription billing

## Getting started

Requires Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd hackyourschool

# Install dependencies
npm i

# Copy the environment template and fill in your own values (see below)
cp .env.example .env

# Start the development server
npm run dev
```

### Environment variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PROJECT_ID=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

These are all public/client-safe values from your Supabase and Stripe dashboards. Server-side secrets (OpenAI API key, Stripe secret key, webhook signing secret, Supabase service role key) are never stored here — they're configured as Supabase Edge Function secrets. See [OPENAI_SETUP.md](OPENAI_SETUP.md) and [STRIPE_SETUP.md](STRIPE_SETUP.md) for the full setup for each.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview a production build locally |

## Project structure

```
src/
  components/   Shared UI + feature components (auth, quiz, flashcard, pdf-summarizer, ai-tutor, dashboard)
  pages/        Route-level pages
  contexts/     AuthContext (session, profile, subscription state)
  integrations/ Supabase client and generated types
supabase/
  functions/    Edge functions (OpenAI calls, Stripe checkout/webhook)
  migrations/   Database schema
```
