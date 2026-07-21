from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_optional_user, CurrentUser
from app.core.rate_limit import rate_limit
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services import llm_engine
from app.services import supabase_service
from app.services.url_fetcher import extract_article_text

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeResponse, dependencies=[Depends(rate_limit)])
async def analyze_content(
    payload: AnalyzeRequest,
    user: CurrentUser | None = Depends(get_optional_user),
):
    text_to_analyze = payload.input

    if payload.input_type == "url":
        try:
            text_to_analyze = extract_article_text(payload.input)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))

    # llm_engine.analyze() tries an LLM (Anthropic/Groq) if configured,
    # and transparently falls back to the offline heuristic engine
    # otherwise or on any failure — this call never raises.
    result = llm_engine.analyze(payload.input_type, text_to_analyze)

    # For URL inputs, keep the original URL as the display title rather
    # than the extracted article's opening sentence.
    if payload.input_type == "url":
        result["title"] = payload.input

    # Guests can analyze without an account; only persist history for
    # signed-in users, matching the PRD (history/dashboard require auth).
    if user is not None:
        try:
            supabase_service.save_analysis(user.user_id, result)
        except RuntimeError:
            # Supabase not configured yet in this environment — analysis
            # still returns successfully, it just won't be saved.
            pass

    return result
