from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.apps.organizations.repository import PaginationResult
from backend.apps.organizations.schemas import (
    Organization as OrganizationSchema,
    OrganizationCreate,
    OrganizationUpdate,
)
from backend.apps.organizations.service import OrganizationsService, OrganizationServiceError
from backend.apps.roles.permission_checker import require_permission
from backend.core.dependencies import get_async_session


router = APIRouter(prefix="/organizations", tags=["organizations"])


def get_org_service(session=Depends(get_async_session)) -> OrganizationsService:
    return OrganizationsService(session)


@router.post(
    "",
    response_model=OrganizationSchema,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("organization.create"))],
)
async def create_organization(
    payload: OrganizationCreate,
    service: OrganizationsService = Depends(get_org_service),
):
    try:
        created = await service.create_organization(payload)
    except OrganizationServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return created


@router.get(
    "/{id}",
    response_model=OrganizationSchema,
    dependencies=[Depends(require_permission("organization.read"))],
)
async def get_organization(
    id: Any,
    service: OrganizationsService = Depends(get_org_service),
):
    try:
        return await service.get_organization(id)
    except OrganizationServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get(
    "",
    dependencies=[Depends(require_permission("organization.read"))],
)
async def list_organizations(
    limit: int = Query(20, ge=1, le=200),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    org_type: Optional[str] = Query(default=None),
    service: OrganizationsService = Depends(get_org_service),
):
    filters: dict[str, Any] = {}
    if status is not None:
        filters["status"] = status
    if org_type is not None:
        filters["org_type"] = org_type

    try:
        if search:
            result = await service.repo.search(search, limit=limit, offset=offset)
        elif filters:
            result = await service.repo.filter(filters, limit=limit, offset=offset)
        else:
            result = await service.list_organizations(limit=limit, offset=offset)
    except OrganizationServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return {
        "items": result["items"],
        "total": result["total"],
        "limit": result["limit"],
        "offset": result["offset"],
    }


@router.put(
    "/{id}",
    response_model=OrganizationSchema,
    dependencies=[Depends(require_permission("organization.update"))],
)
async def update_organization(
    id: Any,
    payload: OrganizationUpdate,
    service: OrganizationsService = Depends(get_org_service),
):
    try:
        return await service.update_organization(id, payload)
    except OrganizationServiceError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("organization.delete"))],
)
async def delete_organization(
    id: Any,
    service: OrganizationsService = Depends(get_org_service),
):
    try:
        await service.deactivate_organization(id)
    except OrganizationServiceError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return None

