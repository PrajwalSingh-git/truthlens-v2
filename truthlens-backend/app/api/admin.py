from fastapi import APIRouter, Depends, HTTPException

from app.core.admin_auth import (
    verify_admin_password, create_admin_token, create_impersonation_token, get_current_admin,
)
from app.core.rate_limit import rate_limit
from app.models.schemas import (
    AdminLoginRequest, AdminLoginResponse, AdminStatsResponse, AdminUserItem, ImpersonateResponse,
)
from app.services import supabase_service

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=AdminLoginResponse, dependencies=[Depends(rate_limit)])
async def admin_login(payload: AdminLoginRequest):
    if not verify_admin_password(payload.password):
        raise HTTPException(status_code=401, detail="Incorrect password.")
    return {"token": create_admin_token()}


@router.get("/stats", response_model=AdminStatsResponse)
async def admin_stats(_admin: dict = Depends(get_current_admin)):
    try:
        return supabase_service.get_admin_stats()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Supabase isn't configured on the server.")


@router.get("/users", response_model=list[AdminUserItem])
async def admin_list_users(_admin: dict = Depends(get_current_admin)):
    try:
        return supabase_service.list_all_users()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Supabase isn't configured on the server.")


@router.delete("/users/{user_id}")
async def admin_delete_user(user_id: str, _admin: dict = Depends(get_current_admin)):
    try:
        return supabase_service.delete_account(user_id)
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Supabase isn't configured on the server.")


@router.post("/users/{user_id}/impersonate", response_model=ImpersonateResponse)
async def admin_impersonate(user_id: str, _admin: dict = Depends(get_current_admin)):
    try:
        users = supabase_service.list_all_users()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Supabase isn't configured on the server.")

    target = next((u for u in users if u["id"] == user_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="User not found.")

    token = create_impersonation_token(user_id, target["email"])
    return {"token": token, "email": target["email"], "user_id": user_id}
