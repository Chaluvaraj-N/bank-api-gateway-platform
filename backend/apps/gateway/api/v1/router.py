from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.apps.gateway.schemas import (
    GatewayRoute as GatewayRouteSchema,
    GatewayRouteCreate,
    GatewayRouteUpdate,
)
from backend.apps.gateway.service import (
    GatewayRouteAPIInvalid,
    GatewayRouteDuplicatePath,
    GatewayRouteNotFound,
    GatewayRoutesService,
    GatewayRouteServiceError,
)
from backend.apps.roles.permission_checker import require_permission
from backend.core.dependencies import get_async_session


router = APIRouter(prefix="/gateway", tags=["gateway"])


def get_gateway_service(session=Depends(get_async_session)) -> GatewayRoutesService:
    return GatewayRoutesService(session)


@router.post(
    "/routes",
    response_model=GatewayRouteSchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("gateway.update"))],
)
async def create_route(
    payload: GatewayRouteCreate,
    service: GatewayRoutesService = Depends(get_gateway_service),
):
    try:
        return await service.create_route(payload)
    except (GatewayRouteAPIInvalid, GatewayRouteDuplicatePath, GatewayRouteServiceError) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "/routes/{id}",
    response_model=GatewayRouteSchema,
    dependencies=[Depends(require_permission("api.read"))],
)
async def get_route(
    id: Any,
    service: GatewayRoutesService = Depends(get_gateway_service),
):
    try:
        return await service.get_route(id)
    except GatewayRouteNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get(
    "/routes",
    dependencies=[Depends(require_permission("api.read"))],
    response_model=list[GatewayRouteSchema] | dict,
)
async def list_routes(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(default=None),
    api_id: Optional[str] = Query(default=None),
    environment: Optional[str] = Query(default=None),
    status_: Optional[str] = Query(default=None, alias="status"),
    authentication_type: Optional[str] = Query(default=None),
    service: GatewayRoutesService = Depends(get_gateway_service),
):
    filters: dict[str, Any] = {}
    if api_id is not None:
        filters["api_id"] = api_id
    if environment is not None:
        filters["environment"] = environment
    if status_ is not None:
        filters["status"] = status_
    if authentication_type is not None:
        filters["authentication_type"] = authentication_type

    try:
        if search is not None and search != "":
            result = await service.repo.search(search, limit=limit, offset=offset)
        elif filters:
            result = await service.repo.filter(filters, limit=limit, offset=offset)
        else:
            result = await service.list_routes(limit=limit, offset=offset)
    except GatewayRouteServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "items": result["items"],
        "total": result["total"],
        "limit": result["limit"],
        "offset": result["offset"],
    }


@router.put(
    "/routes/{id}",
    response_model=GatewayRouteSchema,
    dependencies=[Depends(require_permission("gateway.update"))],
)
async def update_route(
    id: Any,
    payload: GatewayRouteUpdate,
    service: GatewayRoutesService = Depends(get_gateway_service),
):
    try:
        return await service.update_route(id, payload)
    except (GatewayRouteNotFound, GatewayRouteAPIInvalid, GatewayRouteDuplicatePath, GatewayRouteServiceError) as e:
        code = status.HTTP_404_NOT_FOUND if isinstance(e, GatewayRouteNotFound) else status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=code, detail=str(e))


@router.delete(
    "/routes/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("gateway.update"))],
)
async def delete_route(
    id: Any,
    service: GatewayRoutesService = Depends(get_gateway_service),
):
    try:
        await service.delete_route(id)
    except GatewayRouteNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return None

