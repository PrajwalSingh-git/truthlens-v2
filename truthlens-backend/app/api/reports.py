from fastapi import APIRouter, Depends

from app.core.security import get_current_user, CurrentUser
from app.models.schemas import SaveReportRequest, ReportItem
from app.services import supabase_service

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.post("", response_model=ReportItem)
async def create_report(payload: SaveReportRequest, user: CurrentUser = Depends(get_current_user)):
    return supabase_service.save_report(user.user_id, payload.analysis_id, payload.title)


@router.get("", response_model=list[ReportItem])
async def get_reports(user: CurrentUser = Depends(get_current_user)):
    return supabase_service.list_reports(user.user_id)
