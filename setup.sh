#!/usr/bin/env bash
# TruthLens AI — one-command local setup.
# Copies .env.example -> .env for both projects (without overwriting any
# existing .env you already have) and prints next steps.

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/truthlens-frontend"
BACKEND_DIR="$ROOT_DIR/truthlens-backend"

echo "🔍 TruthLens AI — setup"
echo ""

copy_env() {
  local dir="$1"
  local name="$2"
  if [ -f "$dir/.env" ]; then
    echo "  ✓ $name/.env already exists — leaving it alone"
  else
    cp "$dir/.env.example" "$dir/.env"
    echo "  ✓ Created $name/.env from .env.example"
  fi
}

echo "Setting up environment files..."
copy_env "$FRONTEND_DIR" "truthlens-frontend"
copy_env "$BACKEND_DIR" "truthlens-backend"

echo ""
echo "Installing frontend dependencies..."
(cd "$FRONTEND_DIR" && npm install --silent)
echo "  ✓ Frontend dependencies installed"

echo ""
echo "Setting up backend virtual environment..."
if [ ! -d "$BACKEND_DIR/venv" ]; then
  python3 -m venv "$BACKEND_DIR/venv"
fi
"$BACKEND_DIR/venv/bin/pip" install -q -r "$BACKEND_DIR/requirements.txt"
echo "  ✓ Backend dependencies installed"

echo ""
echo "✅ Setup complete. Next steps:"
echo ""
echo "  1. (Optional but recommended) Connect Supabase for auth/history/reports:"
echo "     - Create a free project at https://supabase.com"
echo "     - Run truthlens-backend/supabase_schema.sql in the SQL Editor"
echo "     - Fill in the Supabase values in both .env files"
echo ""
echo "  2. (Optional) Enable LLM-backed analysis instead of the built-in"
echo "     heuristic engine — add ANTHROPIC_API_KEY or GROQ_API_KEY to"
echo "     truthlens-backend/.env. Works fine without this too."
echo ""
echo "  3. Start the backend:"
echo "     cd truthlens-backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000"
echo ""
echo "  4. In a second terminal, start the frontend:"
echo "     cd truthlens-frontend && npm run dev"
echo ""
echo "  5. Open http://localhost:5173"
echo ""
