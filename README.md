# TypeAbroad

TypeAbroad is a deployable MVP for practising English typing with original IELTS, TOEFL, and academic passages. The first version keeps the typing loop local and immediate: no account is required, and sessions, preferences, goals, and saved vocabulary are stored in `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm test
npm run lint
npm run build
```

The project does not require environment variables for Phase 1. Copy `.env.example` to `.env.local` only when configuring a public site URL or beginning the Supabase work.

## Implemented in Phase 1

- Workbench-style landing page with a playable one-sentence typing demo
- IELTS, TOEFL, and Academic English practice filters
- Hidden-input typing engine supporting case, spaces, numbers, and punctuation
- Automatic timer, standard WPM, raw WPM, accuracy, progress, and consistency
- Correct, incorrect, pending, and current-character rendering with a caret
- Backspace correction, blur-to-pause, `Esc` pause, `Tab + Enter` restart, and `Cmd/Ctrl + Enter` next
- Results chart, personal best, detailed character/word mistake analysis
- Learning layer for vocabulary, collocations, and reusable sentence structures
- Searchable article library with 20 original seed passages: 10 IELTS, 5 TOEFL, 5 Academic English
- Light/dark themes, font preferences, optional live WPM/accuracy, smooth caret, and key sounds
- Local progress dashboard, WPM goal, level label, streak, and vocabulary list
- Responsive layouts for phone, tablet, and desktop

## Main structure

```text
src/
  app/
    page.tsx                 landing page
    practice/page.tsx        practice and results flow
    library/page.tsx         article browsing
    progress/page.tsx        local progress dashboard
    vocabulary/page.tsx      saved learning vocabulary
    about/page.tsx           product explanation
  components/
    TypingEngine.tsx         input, timing, pause, shortcuts, completion
    TypingText.tsx           per-character rendering and caret
    TypingStats.tsx          live metrics
    ResultsView.tsx          completion summary
    MistakeAnalysis.tsx      grouped error analysis
    LearningPanel.tsx        post-practice English learning layer
    ArticleSelector.tsx      exam/task/difficulty/length controls
  lib/
    articles.ts              20 original seed articles
    typing.ts                pure metric and error helpers
    storage.ts               localStorage boundary
    types.ts                 domain types
tokens.css                   portable OKLCH design tokens
```

The typing engine is deliberately independent from page routing and persistence. It accepts an `Article`, emits a complete `TypingResult`, and lets the surrounding page decide where to store the result or what to show next. Pure calculations live in `src/lib/typing.ts` so they can be tested without React.

## Deploy to Vercel

1. Push the project to a Git repository.
2. Import the repository in Vercel.
3. Keep the detected framework as Next.js and the build command as `npm run build`.
4. Set `NEXT_PUBLIC_SITE_URL` to `https://typeabroad.com`.
5. Enable Web Analytics and Speed Insights in the Vercel dashboard.
6. Add both `typeabroad.com` and `www.typeabroad.com`, then redirect `www` to the apex domain.
7. Deploy.

No server, database, or secret is required for this MVP.

## Phase 2

The following are intentionally not wired into the MVP yet:

- Email and Google authentication
- Supabase tables, row-level security, and cross-device sync
- Server-managed article editing and moderation
- Weak-word drills generated from long-term error history
- Spaced repetition for vocabulary
- Social leaderboards and multi-device streaks

When account sync is added, keep the local repository as an offline cache and sync the existing `TypingResult`, `TypingError`, `SavedVocabulary`, preference, and goal shapes to Supabase. This avoids coupling the input loop to network latency.

## Future AI integration points

AI belongs after a completed practice, not in the keystroke path. Good extension points are sentence explanations, vocabulary explanations, grammar analysis of a learner's own essay, similar-passage generation, and an IELTS writing coach. Generated learning content should be reviewed or clearly labelled; the typing engine should remain deterministic and work without AI.

## Content note

All seed passages in `src/lib/articles.ts` were written for this demo. They do not copy training-centre model essays or published TOEFL/IELTS materials.
