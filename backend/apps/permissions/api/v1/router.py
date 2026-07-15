from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.apps.roles.permission_checker import require_permission  # type: ignore

from backend.apps.roles.permission_checker import require_permission as rbac_require_permission
from backend.apps.permissions.schemas import (
    Permission as PermissionSchema,
    PermissionCreate,
    PermissionUpdate,
)
from backend.apps.permissions.service import PermissionsService, PermissionServiceError
from backend.core.dependencies import get_async_session

router = APIRouter(prefix="/permissions", tags=["permissions"])


def get_permission_service(session=Depends(get_async_session)) -> PermissionsService:
    return PermissionsService(session)


@router.post(
    "",
    response_model=PermissionSchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(rbac_require_permission("permissions.create"))],
)
async def create_permission(
    payload: PermissionCreate,
    service: PermissionsService = Depends(get_permission_service),
):
    try:
        return await service.create_permission(payload)
    except PermissionServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "/{id}",
    response_model=PermissionSchema,
    dependencies=[Depends(rbac_require_permission("permissions.read"))],
)
async def get_permission(
    id: Any,
    service: PermissionsService = Depends(get_permission_service),
):
    try:
        return await service.get_permission(id)
    except PermissionServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get(
    "",
    dependencies=[Depends(rbac_require_permission("permissions.read"))],
)
async def list_permissions(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(default=None),
    code: Optional[str] = Query(default=None),
    service: PermissionsService = Depends(get_permission_service),
):
    filters: dict[str, Any] = {}
    if code is not None:
        filters["code"] = code

    try:
        if search:
            result = await service.repo.search(search, limit=limit, offset=offset)
        elif filters:
            result = await service.repo.filter(filters, limit=limit, offset=offset)
        else:
            result = await service.repo.list(limit=limit, offset=offset)
    except PermissionServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "items": result["items"],
        "total": result["total"],
        "limit": result["limit"],
        "offset": result["offset"],
    }


@router.put(
    "/{id}",
    response_model=PermissionSchema,
    dependencies=[Depends(rbac_require_permission("permissions.update"))],
)
async def update_permission(
    id: Any,
    payload: PermissionUpdate,
    service: PermissionsService = Depends(get_permission_service),
):
    try:
        return await service.update_permission(id, payload)
    except PermissionServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(rbac_require_permission("permissions.delete"))],
)
async def delete_permission(
    id: Any,
    service: PermissionsService = Depends(get_permission_service),
):
    try:
        await service.repo.soft_delete(id)
    except PermissionServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return None

