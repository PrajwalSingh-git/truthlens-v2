from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user, CurrentUser
from app.models.schemas import HistoryItem, AnalyzeResponse
from app.services import supabase_service

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=list[HistoryItem])
async def get_history(user: CurrentUser = Depends(get_current_user)):
    return supabase_service.list_history(user.user_id)


@router.get("/{analysis_id}", response_model=AnalyzeResponse)
async def get_analysis(analysis_id: str, user: CurrentUser = Depends(get_current_user)):
    result = supabase_service.get_analysis(user.user_id, analysis_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return result


@router.delete("/{analysis_id}", status_code=204)
async def delete_analysis(analysis_id: str, user: CurrentUser = Depends(get_current_user)):
    supabase_service.delete_analysis(user.user_id, analysis_id)
    return None
