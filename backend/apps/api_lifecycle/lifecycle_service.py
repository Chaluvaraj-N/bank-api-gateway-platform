from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Literal

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.api_manager.models import API
from backend.apps.api_manager.repository import APIRepository
from backend.core.dependencies import get_async_session


LifecycleStatus = Literal["DRAFT", "REVIEW", "APPROVED", "PUBLISHED", "RETIRED"]


class LifecycleTransitionError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)


@dataclass(frozen=True)
class LifecycleTransitionResult:
    previous_state: LifecycleStatus
    new_state: LifecycleStatus
    api: API | None = None


ALLOWED_TRANSITIONS: dict[LifecycleStatus, set[LifecycleStatus]] = {
    "DRAFT": {"REVIEW"},
    "REVIEW": {"APPROVED"},
    "APPROVED": {"PUBLISHED"},
    "PUBLISHED": {"RETIRED"},
    "RETIRED": set(),
}


def _validate_target_state(target_state: str) -> LifecycleStatus:
    valid: set[str] = {"DRAFT", "REVIEW", "APPROVED", "PUBLISHED", "RETIRED"}
    if target_state not in valid:
        raise LifecycleTransitionError(f"Invalid lifecycle target_state: {target_state}")
    return target_state  # type: ignore[return-value]


async def _get_api_or_404(session: AsyncSession, api_id: Any) -> API:
    repo = APIRepository(session)
    api = await repo.get_by_id(api_id)
    if api is None:
        # Requirement says reject invalid transitions with 400. Not-found is still a 404.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API not found")
    return api


async def transition_lifecycle(
    api_id: Any,
    *,
    target_state: str,
    session: AsyncSession,
) -> LifecycleTransitionResult:
    target: LifecycleStatus = _validate_target_state(target_state)

    api = await _get_api_or_404(session, api_id)

    previous_raw = api.lifecycle_status
    previous: LifecycleStatus = _validate_target_state(previous_raw)

    allowed = ALLOWED_TRANSITIONS.get(previous, set())
    if target not in allowed:
        allowed_str = ", ".join(sorted(allowed)) if allowed else "none"
        raise LifecycleTransitionError(
            f"Invalid lifecycle transition: {previous} -> {target}. Allowed next state(s): {allowed_str}"
        )

    api.lifecycle_status = target
    # audit-friendly: update timestamps if model has updated_at
    if hasattr(api, "updated_at"):
        # Let DB/model default handle it if triggers exist; otherwise keep it simple.
        # Not importing datetime to avoid unused warnings if column doesn't exist.
        pass

    await session.commit()
    await session.refresh(api)

    return LifecycleTransitionResult(previous_state=previous, new_state=target, api=api)


async def get_api_lifecycle(api_id: Any, *, session: AsyncSession) -> API:
    api = await _get_api_or_404(session, api_id)
    return api

