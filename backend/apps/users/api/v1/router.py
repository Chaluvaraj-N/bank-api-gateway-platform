from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.apps.roles.permission_checker import require_permission
from backend.apps.users.repository import PaginationResult
from backend.apps.users.schemas import User as UserSchema, UserCreate, UserUpdate
from backend.apps.users.service import UsersService, UserServiceError
from backend.core.dependencies import get_async_session

router = APIRouter(prefix="/users", tags=["users"])


def get_user_service(session=Depends(get_async_session)) -> UsersService:
    return UsersService(session)


@router.post(
    "",
    response_model=UserSchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("user.create"))],
)
async def create_user(
    payload: UserCreate,
    service: UsersService = Depends(get_user_service),
):
    try:
        return await service.create_user(payload)
    except UserServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "/{id}",
    response_model=UserSchema,
    dependencies=[Depends(require_permission("user.read"))],
)
async def get_user(
    id: Any,
    service: UsersService = Depends(get_user_service),
):
    try:
        return await service.get_user(id)
    except UserServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get(
    "",
    dependencies=[Depends(require_permission("user.read"))],
)
async def list_users(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(default=None),
    organization_id: Optional[str] = Query(default=None),
    role_id: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    service: UsersService = Depends(get_user_service),
):
    filters: dict[str, Any] = {}
    if organization_id is not None:
        filters["organization_id"] = organization_id
    if role_id is not None:
        filters["role_id"] = role_id
    if status is not None:
        filters["status"] = status

    try:
        if search:
            result = await service.repo.search(search, limit=limit, offset=offset)
        elif filters:
            result = await service.repo.filter(filters, limit=limit, offset=offset)
        else:
            result = await service.list_users(limit=limit, offset=offset)
    except UserServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "items": result["items"],
        "total": result["total"],
        "limit": result["limit"],
        "offset": result["offset"],
    }


@router.put(
    "/{id}",
    response_model=UserSchema,
    dependencies=[Depends(require_permission("user.update"))],
)
async def update_user(
    id: Any,
    payload: UserUpdate,
    service: UsersService = Depends(get_user_service),
):
    try:
        return await service.update_user(id, payload)
    except UserServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("user.delete"))],
)
async def delete_user(
    id: Any,
    service: UsersService = Depends(get_user_service),
):
    try:
        await service.deactivate_user(id)
    except UserServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return None

