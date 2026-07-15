"""Service layer for Gateway management."""

from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.gateway.models import GatewayRoute
from backend.apps.gateway.repository import GatewayRouteRepository
from backend.apps.api_manager.repository import APIRepository


class GatewayRouteServiceError(Exception):
    pass


class GatewayRouteNotFound(GatewayRouteServiceError):
    pass


class GatewayRouteDuplicatePath(GatewayRouteServiceError):
    pass


class GatewayRouteAPIInvalid(GatewayRouteServiceError):
    pass


class GatewayRoutesService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = GatewayRouteRepository(session)
        self.api_repo = APIRepository(session)

    async def _validate_api_exists(self, api_id: Any) -> None:
        if api_id is None:
            return
        api = await self.api_repo.get_by_id(api_id)
        if api is None:
            raise GatewayRouteAPIInvalid("api_id does not exist")

    async def _ensure_unique_route_path(self, *, route_path: str, environment: str, current_id: Any | None = None):
        existing = await self.repo.search(route_path, limit=50, offset=0)
        for item in existing["items"]:
            if getattr(item, "environment", None) == environment and getattr(item, "id", None) != current_id:
                raise GatewayRouteDuplicatePath("route_path must be unique per environment")

    async def create_route(self, payload: Any) -> GatewayRoute:
        api_id = getattr(payload, "api_id", None) if not isinstance(payload, dict) else payload.get("api_id")
        environment = getattr(payload, "environment", None) if not isinstance(payload, dict) else payload.get("environment")
        route_path = getattr(payload, "route_path", None) if not isinstance(payload, dict) else payload.get("route_path")

        await self._validate_api_exists(api_id)
        if route_path is None or environment is None:
            raise GatewayRouteServiceError("route_path and environment are required")

        await self._ensure_unique_route_path(route_path=route_path, environment=environment, current_id=None)

        return await self.repo.create(payload)

    async def get_route(self, route_id: Any) -> GatewayRoute:
        route = await self.repo.get_by_id(route_id)
        if route is None:
            raise GatewayRouteNotFound("Gateway route not found")
        return route

    async def list_routes(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        return await self.repo.list(limit=limit, offset=offset)

    async def update_route(self, route_id: Any, payload: Any) -> GatewayRoute:
        current = await self.get_route(route_id)

        api_id = getattr(payload, "api_id", None) if not isinstance(payload, dict) else payload.get("api_id")
        if api_id is not None:
            await self._validate_api_exists(api_id)

        new_environment = (
            getattr(payload, "environment", None) if not isinstance(payload, dict) else payload.get("environment")
        )
        new_route_path = (
            getattr(payload, "route_path", None) if not isinstance(payload, dict) else payload.get("route_path")
        )

        effective_environment = new_environment if new_environment is not None else getattr(current, "environment")
        effective_route_path = new_route_path if new_route_path is not None else getattr(current, "route_path")

        # Only validate uniqueness when either value changes (or if both are present).
        if new_environment is not None or new_route_path is not None:
            await self._ensure_unique_route_path(
                route_path=effective_route_path,
                environment=effective_environment,
                current_id=current.id,
            )

        updated = await self.repo.update(route_id, payload)
        if updated is None:
            raise GatewayRouteNotFound("Gateway route not found")
        return updated

    async def delete_route(self, route_id: Any) -> None:
        ok = await self.repo.soft_delete(route_id)
        if not ok:
            raise GatewayRouteNotFound("Gateway route not found")

