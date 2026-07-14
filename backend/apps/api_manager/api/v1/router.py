from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.apps.api_manager.schemas import API as APISchema, APICreate, APIUpdate
from backend.apps.api_manager.service import APIsService, APIServiceError
from backend.apps.roles.permission_checker import require_permission
from backend.core.dependencies import get_async_session

router = APIRouter(prefix="/api-manager", tags=["api_manager"])


def get_api_service(session=Depends(get_async_session)) -> APIsService:
    return APIsService(session)


@router.post(
    "",
    response_model=APISchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("api.create"))],
)
async def create_api(
    payload: APICreate,
    service: APIsService = Depends(get_api_service),
):
    try:
        return await service.create_api(payload)
    except APIServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "/{id}",
    response_model=APISchema,
    dependencies=[Depends(require_permission("api.read"))],
)
async def get_api(
    id: Any,
    service: APIsService = Depends(get_api_service),
):
    try:
        return await service.get_api(id)
    except APIServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get(
    "",
    dependencies=[Depends(require_permission("api.read"))],
)
async def list_apis(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(default=None),
    organization_id: Optional[str] = Query(default=None),
    owner_id: Optional[str] = Query(default=None),
    lifecycle_status: Optional[str] = Query(default=None),
    visibility: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    service: APIsService = Depends(get_api_service),
):
    filters: dict[str, Any] = {}
    if organization_id is not None:
        filters["organization_id"] = organization_id
    if owner_id is not None:
        filters["owner_id"] = owner_id
    if lifecycle_status is not None:
        filters["lifecycle_status"] = lifecycle_status
    if visibility is not None:
        filters["visibility"] = visibility
    if category is not None:
        filters["category"] = category

    try:
        if search:
            result = await service.repo.search(search, limit=limit, offset=offset)
        elif filters:
            result = await service.repo.filter(filters, limit=limit, offset=offset)
        else:
            result = await service.repo.list(limit=limit, offset=offset)
    except APIServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "items": result["items"],
        "total": result["total"],
        "limit": result["limit"],
        "offset": result["offset"],
    }


@router.put(
    "/{id}",
    response_model=APISchema,
    dependencies=[Depends(require_permission("api.update"))],
)
async def update_api(
    id: Any,
    payload: APIUpdate,
    service: APIsService = Depends(get_api_service),
):
    try:
        return await service.update_api(id, payload)
    except APIServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("api.delete"))],
)
async def delete_api(
    id: Any,
    service: APIsService = Depends(get_api_service),
):
    try:
        await service.repo.soft_delete(id)
    except APIServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return None

