from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.roles.models import Role
from backend.apps.roles.repository import RoleRepository


class RoleServiceError(Exception):
    pass


class RoleNotFound(RoleServiceError):
    pass


class RoleNameAlreadyExists(RoleServiceError):
    pass


class RolesService:
    def __init__(self, session: AsyncSession):
        self.repo = RoleRepository(session)

    async def get_role(self, role_id: Any) -> Role:
        role = await self.repo.get_by_id(role_id)
        if role is None:
            raise RoleNotFound("Role not found")
        return role

    async def list_roles(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        return await self.repo.list(limit=limit, offset=offset)

    async def create_role(self, payload: Any) -> Role:
        name = getattr(payload, "name", None) if not isinstance(payload, dict) else payload.get("name")
        if name:
            existing = await self.repo.search(name, limit=10, offset=0)
            if existing["total"] > 0:
                raise RoleNameAlreadyExists("Role name already exists")
        return await self.repo.create(payload)

    async def update_role(self, role_id: Any, payload: Any) -> Role:
        current = await self.get_role(role_id)
        name = getattr(payload, "name", None) if not isinstance(payload, dict) else payload.get("name")

        if name and name != current.name:
            existing = await self.repo.search(name, limit=10, offset=0)
            for item in existing["items"]:
                if getattr(item, "id", None) != current.id:
                    raise RoleNameAlreadyExists("Role name already exists")

        updated = await self.repo.update(role_id, payload)
        if updated is None:
            raise RoleNotFound("Role not found")
        return updated

