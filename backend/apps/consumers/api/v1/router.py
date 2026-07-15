"""FastAPI router for Consumer management."""

from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.apps.consumers.schemas import Consumer as ConsumerSchema
from backend.apps.consumers.schemas import ConsumerCreate, ConsumerListResponse, ConsumerUpdate
from backend.apps.consumers.service import (
    ConsumerDuplicateEmail,
    ConsumerNotFound,
    ConsumerServiceError,
    ConsumersService,
)
from backend.apps.roles.permission_checker import require_permission
from backend.core.dependencies import get_async_session


router = APIRouter(prefix="/consumers", tags=["consumers"])


def get_consumers_service(session=Depends(get_async_session)) -> ConsumersService:
    return ConsumersService(session)


@router.post(
    "",
    response_model=ConsumerSchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("consumer.create"))],
)
async def create_consumer(
    payload: ConsumerCreate,
    service: ConsumersService = Depends(get_consumers_service),
):
    try:
        return await service.create_consumer(payload)
    except (ConsumerDuplicateEmail, ConsumerServiceError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "",
    response_model=ConsumerListResponse,
    dependencies=[Depends(require_permission("consumer.create"))],
)
async def list_consumers(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(default=None),
    organization_id: Optional[str] = Query(default=None),
    status_: Optional[str] = Query(default=None, alias="status"),
    service: ConsumersService = Depends(get_consumers_service),
):
    filters: dict[str, Any] = {}
    if organization_id is not None:
        filters["organization_id"] = organization_id
    if status_ is not None:
        filters["status"] = status_

    try:
        result = await service.list_consumers(limit=limit, offset=offset, search=search, filters=filters or None)
    except ConsumerServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "items": result["items"],
        "total": result["total"],
        "limit": result["limit"],
        "offset": result["offset"],
    }


@router.get(
    "/{id}",
    response_model=ConsumerSchema,
    dependencies=[Depends(require_permission("consumer.create"))],
)
async def get_consumer(
    id: Any,
    service: ConsumersService = Depends(get_consumers_service),
):
    try:
        return await service.get_consumer(id)
    except ConsumerNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put(
    "/{id}",
    response_model=ConsumerSchema,
    dependencies=[Depends(require_permission("consumer.create"))],
)
async def update_consumer(
    id: Any,
    payload: ConsumerUpdate,
    service: ConsumersService = Depends(get_consumers_service),
):
    try:
        return await service.update_consumer(id, payload)
    except ConsumerNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except (ConsumerDuplicateEmail, ConsumerServiceError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("consumer.create"))],
)
async def delete_consumer(
    id: Any,
    service: ConsumersService = Depends(get_consumers_service),
):
    try:
        await service.delete_consumer(id)
    except ConsumerNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return None

