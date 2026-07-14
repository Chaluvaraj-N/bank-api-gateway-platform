from __future__ import annotations

"""RBAC permission checker dependencies.

This module provides FastAPI dependency factories:
- require_role(allowed_roles)
- require_permission(required_permission)

It implements:
- Role hierarchy enforcement
- Permission matrix enforcement (static mapping based on requested Phase 6 requirements)

Important:
- Does NOT modify the authentication module.
- Uses the existing AuthenticationService JWT validation logic by instantiating it.
"""

from dataclasses import dataclass
from typing import Iterable, FrozenSet

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.authentication.schemas import CurrentUserResponse
from backend.apps.authentication.service import (
    AuthenticationService,
    TokenValidationError,
)
from backend.core.config import JWT_AUDIENCE, JWT_ISSUER
from backend.db.session import AsyncSession as _AsyncSession  # type: ignore  # noqa: F401

from backend.core.dependencies import get_async_session

from backend.core.constants import API_VERSION  # noqa: F401
from backend.apps.roles.repository import RoleRepository
from backend.apps.roles.service import RolesService

from backend.apps.roles.models import Role

from backend.apps.users.models import User
from backend.apps.users.repository import UserRepository


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# --- Domain model ---

RoleName = str
PermissionCode = str


ROLE_HIERARCHY: tuple[RoleName, ...] = (
    "Platform Admin",
    "Bank Admin",
    "API Manager",
    "Developer",
    "Consumer",
)

ROLE_TO_LEVEL: dict[RoleName, int] = {name: i for i, name in enumerate(ROLE_HIERARCHY)}


# --- Permission matrix (Phase 6 RBAC requirement) ---

PERMISSIONS_BY_ROLE: dict[RoleName, FrozenSet[PermissionCode]] = {
    "Platform Admin": frozenset(
        {
            # organization
            "organization.create",
            "organization.read",
            "organization.update",
            "organization.delete",
            # user
            "user.create",
            "user.read",
            "user.update",
            "user.delete",
            # api
            "api.create",
            "api.read",
            "api.update",
            "api.delete",
            "api.publish",
            # gateway
            "gateway.create",
            "gateway.update",
            # consumer
            "consumer.create",
            "consumer.approve",
        }
    ),
    "Bank Admin": frozenset(
        {
            # organization
            "organization.read",
            "organization.update",
            # user
            "user.create",
            "user.read",
            "user.update",
            "user.delete",
            # api
            "api.create",
            "api.read",
            "api.update",
            "api.delete",
            "api.publish",
            # gateway
            "gateway.create",
            "gateway.update",
            # consumer
            "consumer.create",
            "consumer.approve",
        }
    ),
    "API Manager": frozenset(
        {
            # api
            "api.create",
            "api.read",
            "api.update",
            "api.delete",
            "api.publish",
            # gateway
            "gateway.create",
            "gateway.update",
            # consumer
            "consumer.create",
            "consumer.approve",
        }
    ),
    "Developer": frozenset(
        {
            # api
            "api.read",
            "api.create",
            "api.update",
        }
    ),
    "Consumer": frozenset(
        {
            "api.read",
            "consumer.create",
        }
    ),
}


def _role_level(role_name: RoleName) -> int | None:
    return ROLE_TO_LEVEL.get(role_name)


def _is_role_at_least(requester_role: RoleName, required_role: RoleName) -> bool:
    """Check hierarchy: higher in ROLE_HIERARCHY can access lower ones."""

    r_level = _role_level(requester_role)
    req_level = _role_level(required_role)

    if r_level is None or req_level is None:
        return False

    # Lower index == higher authority
    return r_level <= req_level


def _expand_roles_with_hierarchy(allowed_roles: Iterable[RoleName]) -> FrozenSet[RoleName]:
    allowed_set = {r for r in allowed_roles}
    # Any role higher than an allowed role should also be accepted.
    # Since checks are directional (requester can access required), we can keep
    # the logic in require_role() using _is_role_at_least.
    return frozenset(allowed_set)


@dataclass(frozen=True)
class AuthContext:
    current_user: CurrentUserResponse
    current_role_name: RoleName


async def _get_auth_context(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_async_session),
) -> AuthContext:
    """Validate JWT and resolve the user's role name.

    Uses AuthenticationService.get_current_user for JWT validation.
    Then uses RolesService to resolve role_id -> role.name.

    Raises:
    - 401 for invalid tokens
    - 403 if user's role cannot be resolved
    """

    auth_service = AuthenticationService(session)
    try:
        current_user = await auth_service.get_current_user(token)
    except TokenValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e

    roles_service = RolesService(session)
    try:
        role = await roles_service.get_role(current_user.role_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User role is not recognized",
        ) from e

    role_name = role.name
    return AuthContext(current_user=current_user, current_role_name=role_name)


def require_role(*allowed_roles: RoleName):
    """Dependency: require the caller's role to be within allowed roles.

    Hierarchy support:
    - If a required role is e.g. "Bank Admin", then "Platform Admin" passes.

    Usage:
        Depends(require_role("Bank Admin"))
    """

    if not allowed_roles:
        raise ValueError("At least one allowed role must be provided")

    expanded_allowed = _expand_roles_with_hierarchy(allowed_roles)

    async def _dependency(ctx: AuthContext = Depends(_get_auth_context)) -> AuthContext:
        requester_role = ctx.current_role_name

        # Pass if requester_role is at least as high as any allowed role.
        for allowed_role in expanded_allowed:
            if _is_role_at_least(requester_role, allowed_role):
                return ctx

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient role",
        )

    return _dependency


def require_permission(required_permission: PermissionCode):
    """Dependency: require a permission code.

    Role hierarchy support:
    - A higher role inherits permissions from lower roles (via matrix union).

    Usage:
        Depends(require_permission("api.publish"))
    """

    if not required_permission:
        raise ValueError("required_permission must be a non-empty string")

    async def _dependency(ctx: AuthContext = Depends(_get_auth_context)) -> AuthContext:
        requester_role = ctx.current_role_name

        r_level = _role_level(requester_role)
        if r_level is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        # Requester can access permissions for any role at or below its level.
        # Example: Platform Admin (level 0) can access everything.
        allowed_permissions: set[PermissionCode] = set()
        for role_name, level in ROLE_TO_LEVEL.items():
            if level >= r_level:
                allowed_permissions.update(PERMISSIONS_BY_ROLE.get(role_name, frozenset()))

        if required_permission not in allowed_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return ctx

    return _dependency

