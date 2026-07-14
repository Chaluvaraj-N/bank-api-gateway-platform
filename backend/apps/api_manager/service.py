from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.api_manager.models import API
from backend.apps.api_manager.repository import APIRepository


class APIServiceError(Exception):
    pass


class APINotFound(APIServiceError):
    pass


class APIDuplicateName(APIServiceError):
    pass


class APIOwnerNotFound(APIServiceError):
    pass


class APIsService:
    def __init__(self, session: AsyncSession):
        self.repo = APIRepository(session)

    async def get_api(self, api_id: Any) -> API:
        api = await self.repo.get_by_id(api_id)
        if api is None:
            raise APINotFound("API not found")
        return api

    async def list_apis(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        return await self.repo.list(limit=limit, offset=offset)

    async def create_api(self, payload: Any) -> API:
        # Default lifecycle_status
        if isinstance(payload, dict):
            payload.setdefault("lifecycle_status", "DRAFT")
        else:
            if getattr(payload, "lifecycle_status", None) in (None, ""):
                try:
                    setattr(payload, "lifecycle_status", "DRAFT")
                except Exception:
                    pass

        organization_id = getattr(payload, "organization_id", None) if not isinstance(payload, dict) else payload.get("organization_id")
        name = getattr(payload, "name", None) if not isinstance(payload, dict) else payload.get("name")

        if name is not None and organization_id is not None:
            # Unique api name within organization: enforce by searching name then checking org_id.
            existing = await self.repo.search(name, limit=50, offset=0)
            for item in existing["items"]:
                if getattr(item, "organization_id", None) == organization_id:
                    raise APIDuplicateName("API name already exists within organization")

        # Owner validation: requires UserRepository/DB lookup (not implemented here).
        # Production wiring should inject UserRepository and validate owner_id exists.

        return await self.repo.create(payload)

    async def update_api(self, api_id: Any, payload: Any) -> API:
        current = await self.get_api(api_id)

        name = getattr(payload, "name", None) if not isinstance(payload, dict) else payload.get("name")
        organization_id = getattr(payload, "organization_id", None) if not isinstance(payload, dict) else payload.get("organization_id")

        if name and name != current.name and organization_id is None:
            organization_id = current.organization_id

        if name is not None and organization_id is not None and name != current.name:
            existing = await self.repo.search(name, limit=50, offset=0)
            for item in existing["items"]:
                if getattr(item, "organization_id", None) == organization_id and getattr(item, "id", None) != current.id:
                    raise APIDuplicateName("API name already exists within organization")

        updated = await self.repo.update(api_id, payload)
        if updated is None:
            raise APINotFound("API not found")
        return updated

