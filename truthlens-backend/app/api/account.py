from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user, CurrentUser
from app.services import supabase_service

router = APIRouter(prefix="/api/account", tags=["account"])


@router.delete("")
async def delete_my_account(user: CurrentUser = Depends(get_current_user)):
    try:
        return supabase_service.delete_account(user.user_id)
    except RuntimeError:
        raise HTTPException(
            status_code=503,
            detail="Account deletion isn't available — Supabase credentials are missing on the server.",
        )
