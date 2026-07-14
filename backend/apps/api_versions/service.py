from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.api_versions.models import APIVersion
from backend.apps.api_versions.repository import APIVersionRepository


class APIVersionServiceError(Exception):
    pass


class APIVersionNotFound(APIVersionServiceError):
    pass


class APIVersionDuplicateVersion(APIVersionServiceError):
    pass


class APIVersionsService:
    def __init__(self, session: AsyncSession):
        self.repo = APIVersionRepository(session)

    async def get_version(self, version_id: Any) -> APIVersion:
        v = await self.repo.get_by_id(version_id)
        if v is None:
            raise APIVersionNotFound("API version not found")
        return v

    async def list_versions(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        return await self.repo.list(limit=limit, offset=offset)

    async def create_version(self, payload: Any) -> APIVersion:
        api_id = getattr(payload, "api_id", None) if not isinstance(payload, dict) else payload.get("api_id")
        version = getattr(payload, "version", None) if not isinstance(payload, dict) else payload.get("version")

        if api_id is not None and version is not None:
            # Unique version per API: search for version then check api_id.
            existing = await self.repo.search(version, limit=50, offset=0)
            for item in existing["items"]:
                if getattr(item, "api_id", None) == api_id:
                    raise APIVersionDuplicateVersion("Version already exists for this API")

        return await self.repo.create(payload)

    async def update_version(self, version_id: Any, payload: Any) -> APIVersion:
        current = await self.get_version(version_id)

        api_id = getattr(payload, "api_id", None) if not isinstance(payload, dict) else payload.get("api_id")
        version = getattr(payload, "version", None) if not isinstance(payload, dict) else payload.get("version")

        if version is None:
            updated = await self.repo.update(version_id, payload)
            if updated is None:
                raise APIVersionNotFound("API version not found")
            return updated

        if api_id is None:
            api_id = current.api_id

        if version != current.version:
            existing = await self.repo.search(version, limit=50, offset=0)
            for item in existing["items"]:
                if getattr(item, "api_id", None) == api_id and getattr(item, "id", None) != current.id:
                    raise APIVersionDuplicateVersion("Version already exists for this API")

        updated = await self.repo.update(version_id, payload)
        if updated is None:
            raise APIVersionNotFound("API version not found")
        return updated

