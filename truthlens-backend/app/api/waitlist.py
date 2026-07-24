from fastapi import APIRouter, Depends, HTTPException

from app.core.rate_limit import rate_limit
from app.models.schemas import WaitlistJoinRequest, WaitlistJoinResponse
from app.services import supabase_service

router = APIRouter(prefix="/api/waitlist", tags=["waitlist"])


@router.post("", response_model=WaitlistJoinResponse, dependencies=[Depends(rate_limit)])
async def join_waitlist(payload: WaitlistJoinRequest):
    try:
        result = supabase_service.join_waitlist(payload.email)
    except RuntimeError:
        raise HTTPException(
            status_code=503,
            detail="Waitlist isn't configured yet — Supabase credentials are missing on the server.",
        )
    return result
