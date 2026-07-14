
from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.apps.roles.permission_checker import require_permission
from backend.apps.roles.schemas import Role as RoleSchema, RoleCreate, RoleUpdate
from backend.apps.roles.service import RolesService, RoleServiceError
from backend.core.dependencies import get_async_session

router = APIRouter(prefix="/roles", tags=["roles"])


def get_role_service(session=Depends(get_async_session)) -> RolesService:
    return RolesService(session)


@router.post(
    "",
    response_model=RoleSchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("roles.create"))],
)
async def create_role(
    payload: RoleCreate,
    service: RolesService = Depends(get_role_service),
):
    try:
        return await service.create_role(payload)
    except RoleServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "/{id}",
    response_model=RoleSchema,
    dependencies=[Depends(require_permission("roles.read"))],
)
async def get_role(
    id: Any,
    service: RolesService = Depends(get_role_service),
):
    try:
        return await service.get_role(id)
    except RoleServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get(
    "",
    dependencies=[Depends(require_permission("roles.read"))],
)
async def list_roles(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(default=None),
    is_system_role: Optional[bool] = Query(default=None),
    service: RolesService = Depends(get_role_service),
):
    filters: dict[str, Any] = {}
    if is_system_role is not None:
        filters["is_system_role"] = is_system_role

    try:
        if search:
            result = await service.repo.search(search, limit=limit, offset=offset)
        elif filters:
            result = await service.repo.filter(filters, limit=limit, offset=offset)
        else:
            result = await service.list_roles(limit=limit, offset=offset)
    except RoleServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "items": result["items"],
        "total": result["total"],
        "limit": result["limit"],
        "offset": result["offset"],
    }


@router.put(
    "/{id}",
    response_model=RoleSchema,
    dependencies=[Depends(require_permission("roles.update"))],
)
async def update_role(
    id: Any,
    payload: RoleUpdate,
    service: RolesService = Depends(get_role_service),
):
    try:
        return await service.update_role(id, payload)
    except RoleServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("roles.delete"))],
)
async def delete_role(
    id: Any,
    service: RolesService = Depends(get_role_service),
):
    try:
        await service.repo.soft_delete(id)
    except RoleServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return None

