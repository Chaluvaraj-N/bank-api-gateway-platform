from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.permissions.models import Permission
from backend.apps.permissions.repository import PermissionRepository


class PermissionServiceError(Exception):
    pass


class PermissionNotFound(PermissionServiceError):
    pass


class PermissionCodeAlreadyExists(PermissionServiceError):
    pass


class PermissionsService:
    def __init__(self, session: AsyncSession):
        self.repo = PermissionRepository(session)

    async def get_permission(self, permission_id: Any) -> Permission:
        p = await self.repo.get_by_id(permission_id)
        if p is None:
            raise PermissionNotFound("Permission not found")
        return p

    async def list_permissions(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        return await self.repo.list(limit=limit, offset=offset)

    async def create_permission(self, payload: Any) -> Permission:
        code = getattr(payload, "code", None) if not isinstance(payload, dict) else payload.get("code")
        if code:
            existing = await self.repo.search(code, limit=10, offset=0)
            if existing["total"] > 0:
                raise PermissionCodeAlreadyExists("Permission code already exists")
        return await self.repo.create(payload)

    async def update_permission(self, permission_id: Any, payload: Any) -> Permission:
        current = await self.get_permission(permission_id)
        code = getattr(payload, "code", None) if not isinstance(payload, dict) else payload.get("code")

        if code and code != current.code:
            existing = await self.repo.search(code, limit=10, offset=0)
            for item in existing["items"]:
                if getattr(item, "id", None) != current.id:
                    raise PermissionCodeAlreadyExists("Permission code already exists")

        updated = await self.repo.update(permission_id, payload)
        if updated is None:
            raise PermissionNotFound("Permission not found")
        return updated

