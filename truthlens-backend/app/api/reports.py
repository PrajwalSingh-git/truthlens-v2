from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user, CurrentUser
from app.models.schemas import SaveReportRequest, ReportItem
from app.services import supabase_service

router = APIRouter(prefix="/api/reports", tags=["reports"])


def _service_unavailable():
    return HTTPException(status_code=503, detail="Supabase isn't configured on the server.")


@router.post("", response_model=ReportItem)
async def create_report(payload: SaveReportRequest, user: CurrentUser = Depends(get_current_user)):
    try:
        return supabase_service.save_report(user.user_id, payload.analysis_id, payload.title)
    except RuntimeError:
        raise _service_unavailable()


@router.get("", response_model=list[ReportItem])
async def get_reports(user: CurrentUser = Depends(get_current_user)):
    try:
        return supabase_service.list_reports(user.user_id)
    except RuntimeError:
        raise _service_unavailable()
