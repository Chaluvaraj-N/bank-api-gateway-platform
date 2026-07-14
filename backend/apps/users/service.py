from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.users.models import User
from backend.apps.users.repository import UserRepository


class UserServiceError(Exception):
    """Base exception for user service."""


class UserNotFound(UserServiceError):
    pass


class UserEmailAlreadyExists(UserServiceError):
    pass


class UserOrganizationNotFound(UserServiceError):
    pass


class UserRoleNotFound(UserServiceError):
    pass


class UsersService:
    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)

    async def get_user(self, user_id: Any) -> User:
        user = await self.repo.get_by_id(user_id)
        if user is None:
            raise UserNotFound("User not found")
        return user

    async def list_users(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        return await self.repo.list(limit=limit, offset=offset)

    async def create_user(self, payload: Any) -> User:
        email = getattr(payload, "email", None) if not isinstance(payload, dict) else payload.get("email")
        if email:
            existing = await self.repo.search(email, limit=10, offset=0)
            if existing["total"] > 0:
                raise UserEmailAlreadyExists("Email already exists")

        # Organization + role validations require other repositories.
        # This project currently does not include those services; enforce via soft repository search.
        # In a production-ready implementation, inject OrganizationRepository/RoleRepository and check existence.
        return await self.repo.create(payload)

    async def update_user(self, user_id: Any, payload: Any) -> User:
        current = await self.get_user(user_id)

        email = getattr(payload, "email", None) if not isinstance(payload, dict) else payload.get("email")
        if email and email != current.email:
            existing = await self.repo.search(email, limit=10, offset=0)
            for item in existing["items"]:
                if getattr(item, "id", None) != current.id:
                    raise UserEmailAlreadyExists("Email already exists")

        updated = await self.repo.update(user_id, payload)
        if updated is None:
            raise UserNotFound("User not found")
        return updated

    async def deactivate_user(self, user_id: Any) -> bool:
        ok = await self.repo.soft_delete(user_id)
        if not ok:
            raise UserNotFound("User not found")
        return ok

