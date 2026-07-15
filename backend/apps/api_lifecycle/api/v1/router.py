from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from backend.apps.api_lifecycle.lifecycle_service import (
    LifecycleTransitionError,
    get_api_lifecycle,
    transition_lifecycle,
)
from backend.apps.api_manager.schemas import API as APISchema
from backend.apps.roles.permission_checker import require_permission, require_role
from backend.core.dependencies import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter(prefix="/apis", tags=["api_lifecycle"])


def get_session(session: AsyncSession = Depends(get_async_session)) -> AsyncSession:
    return session


@router.post(
    "/{id}/submit-review",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_permission("api.update"))],
    response_model=dict,
)
async def submit_review(id: Any, session: AsyncSession = Depends(get_session)):
    try:
        result = await transition_lifecycle(id, target_state="REVIEW", session=session)
    except LifecycleTransitionError as e:
        raise e
    return {"previous_state": result.previous_state, "new_state": result.new_state}


@router.post(
    "/{id}/approve",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_permission("api.publish"))],
    response_model=dict,
)
async def approve(id: Any, session: AsyncSession = Depends(get_session)):
    try:
        result = await transition_lifecycle(id, target_state="APPROVED", session=session)
    except LifecycleTransitionError as e:
        raise e
    return {"previous_state": result.previous_state, "new_state": result.new_state}


@router.post(
    "/{id}/publish",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_permission("api.publish"))],
    response_model=dict,
)
async def publish(id: Any, session: AsyncSession = Depends(get_session)):
    try:
        result = await transition_lifecycle(id, target_state="PUBLISHED", session=session)
    except LifecycleTransitionError as e:
        raise e
    return {"previous_state": result.previous_state, "new_state": result.new_state}


@router.post(
    "/{id}/retire",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_role("Bank Admin"))],
    response_model=dict,
)
async def retire(id: Any, session: AsyncSession = Depends(get_session)):
    try:
        result = await transition_lifecycle(id, target_state="RETIRED", session=session)
    except LifecycleTransitionError as e:
        raise e
    return {"previous_state": result.previous_state, "new_state": result.new_state}


@router.get(
    "/{id}/lifecycle",
    status_code=status.HTTP_200_OK,
    response_model=APISchema,
)
async def get_lifecycle(id: Any, session: AsyncSession = Depends(get_session)):
    # Returns full API resource including lifecycle_status (already in APISchema)
    return await get_api_lifecycle(id, session=session)

