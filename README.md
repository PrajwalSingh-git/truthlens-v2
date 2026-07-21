# TruthLens AI v2

An AI-powered content credibility platform — detects misinformation signals (bias, propaganda, clickbait, emotional manipulation) and explains *why* content scores the way it does, rather than handing back a flat "real/fake" label.

This repo contains two projects:
- `truthlens-frontend/` — React (Vite) + Tailwind CSS v4 + shadcn/ui
- `truthlens-backend/` — FastAPI + Supabase

Both run independently and talk to each other over HTTP.

---

## 1. What's already working, out of the box

- **Frontend**: builds clean (`npm run build`), all pages implemented, fully responsive, animated.
- **Backend**: the `/api/analyze` endpoint works immediately with **zero configuration** — it uses a real rule-based analysis engine (lexicon + regex heuristics for clickbait, propaganda, emotional manipulation, and bias), not a mock. You can run it right now and get real, explainable scores.
- **LLM-backed analysis (optional)**: if you set `ANTHROPIC_API_KEY` or `GROQ_API_KEY` in `truthlens-backend/.env`, analysis is upgraded to a real LLM call automatically — with silent fallback to the heuristic engine if the call fails for any reason. See section 3.5 below for where to get a key.
- **URL analysis**: fetches the actual page and extracts article text (via `trafilatura`) before analyzing — not just the URL string.
- **Rate limiting**: the public `/api/analyze` endpoint is capped per-IP (30/hour by default) to prevent abuse — see `app/core/rate_limit.py`.
- **Content comparison**: `/compare` lets you analyze two pieces of content side-by-side.
- **PDF export**: any analysis result has an "Export PDF" button (browser print-to-PDF under the hood, no extra dependency).
- **Tests**: `truthlens-backend/tests/` has a pytest suite for the heuristic engine — run with `pytest`.
- **Auth, history, and saved reports** require you to connect your own Supabase project (free tier is enough) — instructions below.

### One-command setup
From the repo root:
```bash
chmod +x setup.sh   # first time only
./setup.sh
```
This copies both `.env.example` files to `.env`, installs frontend deps, and sets up a backend virtualenv. Then jump to step 3/4 in "Quick start" below.

---

## 2. Quick start (local development)

### Backend

```bash
cd truthlens-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in Supabase values (step 3 below) — optional for basic analysis
uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/health` — you should see `{"status": "healthy"}`.

### Frontend

```bash
cd truthlens-frontend
npm install
cp .env.example .env            # fill in Supabase values (step 3 below)
npm run dev
```

Visit `http://localhost:5173`. The **Analyze** page works immediately without any Supabase setup — sign-in, history, and saved reports need Supabase connected.

---

## 3. Connecting Supabase (required for auth, history, saved reports)

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the contents of `truthlens-backend/supabase_schema.sql`. This creates the `profiles`, `analyses`, and `saved_reports` tables with row-level security.
3. In **Authentication > Providers**, enable **Google**. You'll need a Google OAuth Client ID/Secret from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — Supabase's docs walk through the redirect URI setup.
4. In **Authentication > URL Configuration**, add your redirect URLs:
   - `http://localhost:5173/dashboard` (local dev)
   - `https://<your-username>.github.io/<repo-name>/dashboard` (production, once deployed)
5. Grab your keys from **Settings > API**:
   - `Project URL` → `SUPABASE_URL` (backend) / `VITE_SUPABASE_URL` (frontend)
   - `anon public` key → `VITE_SUPABASE_ANON_KEY` (frontend only)
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (backend only — **never** expose this to the frontend)
   - `JWT Secret` (same page, further down) → `SUPABASE_JWT_SECRET` (backend only)

Fill these into `truthlens-backend/.env` and `truthlens-frontend/.env` (copy from the `.env.example` files in each folder).

---

## 3.5. (Optional) Enabling LLM-backed analysis

By default, analysis runs on the built-in offline heuristic engine — no key needed, works immediately. If you want deeper, more nuanced analysis, add ONE of these to `truthlens-backend/.env`:

- **Anthropic (Claude)** — best quality. Get a key at [console.anthropic.com](https://console.anthropic.com). New accounts get a small free credit grant; after that it's pay-as-you-go.
  ```
  ANTHROPIC_API_KEY=sk-ant-...
  ```
- **Groq** — genuinely free tier, fast, open models (Llama 3.1). Get a key at [console.groq.com](https://console.groq.com).
  ```
  GROQ_API_KEY=gsk_...
  ```

If both are set, Anthropic is used. If the LLM call ever fails (bad key, network issue, rate limit, malformed response), the app silently falls back to the heuristic engine — analysis never breaks because of this.

Other free/low-cost options if you want to extend `app/services/llm_engine.py` yourself: [Google AI Studio](https://aistudio.google.com) (Gemini free tier), [OpenRouter](https://openrouter.ai) (free-tier access to several open models), or [Ollama](https://ollama.com) (fully local, zero cost, runs on your own machine).

## 4. Deployment (matches the PRD's free-tier stack)

### Frontend → GitHub Pages
```bash
cd truthlens-frontend
npm run build
```
Push the `dist/` folder to a `gh-pages` branch (or use the `gh-pages` npm package / a GitHub Action). Set your repo's Pages source to that branch. Update `VITE_API_BASE_URL` in your production `.env` to your deployed Render backend URL before building.

### Backend → Render
1. Push `truthlens-backend/` to GitHub.
2. On [Render](https://render.com), create a new **Web Service** pointing at that repo/folder.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add the environment variables from your `.env` (Supabase URL, service role key, JWT secret, and set `CORS_ORIGINS` to your GitHub Pages URL).

### Database → Supabase
Already hosted — nothing to deploy.

---

## 5. Project structure

```
truthlens-frontend/
  src/
    components/{analysis,auth,common,dashboard,history,layout,profile,ui}
    context/          # AuthContext
    pages/            # one file per route
    routes/           # ProtectedRoute
    services/         # supabaseClient, authService, api
    lib/utils.js       # shadcn's cn() helper

truthlens-backend/
  app/
    api/              # analyze.py, history.py, reports.py
    core/             # config.py (env settings), security.py (JWT verification)
    models/           # Pydantic schemas
    services/         # analysis_engine.py (heuristic NLP), supabase_service.py
  supabase_schema.sql
```

---

## 6. How the analysis engines fit together

- `app/services/analysis_engine.py` — the offline, rule-based analyzer (lexicons + regex + light structural heuristics). No API keys needed, always available, always the fallback.
- `app/services/llm_engine.py` — calls Anthropic or Groq (see section 3.5) for deeper analysis, returning the same response shape. Falls back to the heuristic engine on any error.
- `app/api/analyze.py` — the route just calls `llm_engine.analyze()`, which internally decides which engine to use based on what's configured. You don't need to touch the route to switch engines.
- `app/services/url_fetcher.py` — for URL input, fetches the page and extracts article text with `trafilatura` before either engine sees it.

---

## 7. What this build does *not* include

Being upfront about the remaining gaps so there are no surprises in an interview or demo:
- No CI/CD pipeline — deployment above is manual. A GitHub Action to auto-deploy on push would be a natural next step.
- The rate limiter is in-memory, scoped to a single backend instance — fine for Render's free tier, but won't work correctly if you ever scale to multiple instances (swap for Redis-backed limiting if you do).
- The political-bias and propaganda-characteristics scores are still lexicon-based heuristics unless you've enabled LLM-backed analysis — treat them as directional, not authoritative (the UI says so too).
- Render's free tier cold-starts after inactivity. The frontend now detects this and shows a "waking up the server" message with automatic retries, but the first request after idle time will still take a few seconds — worth mentioning if you're demoing live.
- PDF export uses the browser's native print-to-PDF rather than a dedicated PDF library, so formatting fidelity depends on the browser's print engine.
