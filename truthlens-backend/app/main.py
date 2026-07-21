from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api import analyze, history, reports

settings = get_settings()

app = FastAPI(
    title="TruthLens AI API",
    description="AI-powered content credibility analysis backend.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(history.router)
app.include_router(reports.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "TruthLens AI API", "version": "2.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
