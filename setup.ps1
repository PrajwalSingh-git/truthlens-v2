# TruthLens AI - one-command local setup (Windows PowerShell).
# Copies .env.example -> .env for both projects (without overwriting any
# existing .env you already have) and prints next steps.
#
# Usage (from the repo root, in PowerShell):
#   .\setup.ps1
#
# If PowerShell blocks the script from running, open PowerShell as your
# normal user and run this once first:
#   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

$ErrorActionPreference = "Stop"

$RootDir     = $PSScriptRoot
$FrontendDir = Join-Path $RootDir "truthlens-frontend"
$BackendDir  = Join-Path $RootDir "truthlens-backend"

Write-Host "TruthLens AI - setup" -ForegroundColor Cyan
Write-Host ""

function Copy-EnvFile {
    param([string]$Dir, [string]$Name)

    $envPath = Join-Path $Dir ".env"
    $examplePath = Join-Path $Dir ".env.example"

    if (Test-Path $envPath) {
        Write-Host "  - $Name\.env already exists - leaving it alone"
    } else {
        Copy-Item $examplePath $envPath
        Write-Host "  - Created $Name\.env from .env.example"
    }
}

Write-Host "Setting up environment files..."
Copy-EnvFile -Dir $FrontendDir -Name "truthlens-frontend"
Copy-EnvFile -Dir $BackendDir -Name "truthlens-backend"

Write-Host ""
Write-Host "Installing frontend dependencies..."
Push-Location $FrontendDir
npm install --silent
Pop-Location
Write-Host "  - Frontend dependencies installed"

Write-Host ""
Write-Host "Setting up backend virtual environment..."

$pythonCmd = "python"
if (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
}

$venvDir = Join-Path $BackendDir "venv"
if (-not (Test-Path $venvDir)) {
    & $pythonCmd -m venv $venvDir
}

$venvPip = Join-Path $venvDir "Scripts\pip.exe"
$requirementsFile = Join-Path $BackendDir "requirements.txt"
& $venvPip install -q -r $requirementsFile
Write-Host "  - Backend dependencies installed"

Write-Host ""
Write-Host "Setup complete. Next steps:" -ForegroundColor Green
Write-Host ""
Write-Host "  1. (Optional but recommended) Connect Supabase for auth/history/reports:"
Write-Host "     - Create a free project at https://supabase.com"
Write-Host "     - Run truthlens-backend\supabase_schema.sql in the SQL Editor"
Write-Host "     - Fill in the Supabase values in both .env files"
Write-Host ""
Write-Host "  2. (Optional) Enable LLM-backed analysis instead of the built-in"
Write-Host "     heuristic engine - add ANTHROPIC_API_KEY or GROQ_API_KEY to"
Write-Host "     truthlens-backend\.env. Works fine without this too."
Write-Host ""
Write-Host "  3. Start the backend:"
Write-Host "     cd truthlens-backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"
Write-Host ""
Write-Host "  4. In a second terminal, start the frontend:"
Write-Host "     cd truthlens-frontend; npm run dev"
Write-Host ""
Write-Host "  5. Open http://localhost:5173"
Write-Host ""
