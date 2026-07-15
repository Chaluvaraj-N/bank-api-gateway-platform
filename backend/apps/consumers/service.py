"""Service layer for Consumer management."""

from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.consumers.models import Consumer
from backend.apps.consumers.repository import ConsumerRepository


class ConsumerServiceError(Exception):
    pass


class ConsumerNotFound(ConsumerServiceError):
    pass


class ConsumerDuplicateEmail(ConsumerServiceError):
    pass


class ConsumersService:
    def __init__(self, session: AsyncSession):
        self.repo = ConsumerRepository(session)

    async def _validate_unique_email_on_create(self, *, email: str) -> None:
        existing = await self.repo.get_by_email(email)
        if existing is not None:
            raise ConsumerDuplicateEmail("email already exists")

    async def _validate_unique_email_on_update(self, *, email: str, exclude_id: Any) -> None:
        existing = await self.repo.get_by_email_excluding_id(email=email, exclude_id=exclude_id)
        if existing is not None:
            raise ConsumerDuplicateEmail("email already exists")

    async def create_consumer(self, payload: Any) -> Consumer:
        email = getattr(payload, "email", None) if not isinstance(payload, dict) else payload.get("email")
        if not email:
            raise ConsumerServiceError("email is required")

        await self._validate_unique_email_on_create(email=email)

        return await self.repo.create(payload)

    async def update_consumer(self, consumer_id: Any, payload: Any) -> Consumer:
        current = await self.repo.get_by_id(consumer_id)
        if current is None:
            raise ConsumerNotFound("Consumer not found")

        new_email = getattr(payload, "email", None) if not isinstance(payload, dict) else payload.get("email")
        if new_email is not None and new_email != getattr(current, "email"):
            await self._validate_unique_email_on_update(email=new_email, exclude_id=current.id)

        updated = await self.repo.update(consumer_id, payload)
        if updated is None:
            raise ConsumerNotFound("Consumer not found")
        return updated

    async def delete_consumer(self, consumer_id: Any) -> None:
        ok = await self.repo.soft_delete(consumer_id)
        if not ok:
            raise ConsumerNotFound("Consumer not found")

    async def get_consumer(self, consumer_id: Any) -> Consumer:
        consumer = await self.repo.get_by_id(consumer_id)
        if consumer is None:
            raise ConsumerNotFound("Consumer not found")
        return consumer

    async def list_consumers(
        self,
        *,
        limit: int = 20,
        offset: int = 0,
        search: str | None = None,
        filters: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        if search:
            return await self.repo.search(search, limit=limit, offset=offset)
        if filters:
            return await self.repo.filter(filters, limit=limit, offset=offset)
        return await self.repo.list(limit=limit, offset=offset)

