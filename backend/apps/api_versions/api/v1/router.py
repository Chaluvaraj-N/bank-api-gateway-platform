from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.apps.api_versions.schemas import (
    APIVersion as APIVersionSchema,
    APIVersionCreate,
    APIVersionUpdate,
)
from backend.apps.api_versions.service import APIVersionsService, APIVersionServiceError
from backend.apps.roles.permission_checker import require_permission
from backend.core.dependencies import get_async_session

router = APIRouter(prefix="/api-versions", tags=["api_versions"])


def get_api_version_service(session=Depends(get_async_session)) -> APIVersionsService:
    return APIVersionsService(session)


@router.post(
    "",
    response_model=APIVersionSchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("api_versions.create"))],
)
async def create_api_version(
    payload: APIVersionCreate,
    service: APIVersionsService = Depends(get_api_version_service),
):
    try:
        return await service.create_version(payload)
    except APIVersionServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "/{id}",
    response_model=APIVersionSchema,
    dependencies=[Depends(require_permission("api_versions.read"))],
)
async def get_api_version(
    id: Any,
    service: APIVersionsService = Depends(get_api_version_service),
):
    try:
        return await service.get_version(id)
    except APIVersionServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get(
    "",
    dependencies=[Depends(require_permission("api_versions.read"))],
)
async def list_api_versions(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(default=None),
    api_id: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None, alias="status"),
    service: APIVersionsService = Depends(get_api_version_service),
):
    filters: dict[str, Any] = {}
    if api_id is not None:
        filters["api_id"] = api_id
    if status is not None:
        filters["status"] = status

    try:
        if search:
            result = await service.repo.search(search, limit=limit, offset=offset)
        elif filters:
            result = await service.repo.filter(filters, limit=limit, offset=offset)
        else:
            result = await service.repo.list(limit=limit, offset=offset)
    except APIVersionServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "items": result["items"],
        "total": result["total"],
        "limit": result["limit"],
        "offset": result["offset"],
    }


@router.put(
    "/{id}",
    response_model=APIVersionSchema,
    dependencies=[Depends(require_permission("api_versions.update"))],
)
async def update_api_version(
    id: Any,
    payload: APIVersionUpdate,
    service: APIVersionsService = Depends(get_api_version_service),
):
    try:
        return await service.update_version(id, payload)
    except APIVersionServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("api_versions.delete"))],
)
async def delete_api_version(
    id: Any,
    service: APIVersionsService = Depends(get_api_version_service),
):
    try:
        await service.repo.soft_delete(id)
    except APIVersionServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return None

