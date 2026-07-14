from __future__ import annotations

from typing import Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.organizations.models import Organization
from backend.apps.organizations.repository import OrganizationRepository


class OrganizationServiceError(Exception):
    """Base exception for organization service."""


class OrganizationNotFound(OrganizationServiceError):
    pass


class OrganizationCodeAlreadyExists(OrganizationServiceError):
    pass


class OrganizationDomainAlreadyExists(OrganizationServiceError):
    pass


class OrganizationsService:
    def __init__(self, session: AsyncSession):
        self.repo = OrganizationRepository(session)

    async def create_organization(self, payload: Any) -> Organization:
        # Unique validations
        created = payload
        code = getattr(created, "code", None) or (created.get("code") if isinstance(created, dict) else None)
        domain = getattr(created, "domain", None) or (created.get("domain") if isinstance(created, dict) else None)

        if code is not None:
            found = await self.repo.filter({"status": getattr(payload, "status", None) or payload.get("status") } if False else {})
            # Use repository-level search as a fallback: exact-match filter only supports status/org_type.
            # For production, add repository filterable fields for code/domain.
            # Here: validate via search.
            existing = await self.repo.search(code, limit=1, offset=0)
            if existing["total"] > 0:
                raise OrganizationCodeAlreadyExists("Organization code already exists")

        if domain is not None:
            existing = await self.repo.search(domain, limit=1, offset=0)
            if existing["total"] > 0:
                raise OrganizationDomainAlreadyExists("Organization domain already exists")

        return await self.repo.create(payload)

    async def get_organization(self, organization_id: Any) -> Organization:
        org = await self.repo.get_by_id(organization_id)
        if org is None:
            raise OrganizationNotFound("Organization not found")
        return org

    async def list_organizations(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        return await self.repo.list(limit=limit, offset=offset)

    async def update_organization(self, organization_id: Any, payload: Any) -> Organization:
        current = await self.get_organization(organization_id)

        code = getattr(payload, "code", None) if not isinstance(payload, dict) else payload.get("code")
        domain = getattr(payload, "domain", None) if not isinstance(payload, dict) else payload.get("domain")

        # Uniqueness checks: search then ensure it's not the same record.
        if code and code != current.code:
            existing = await self.repo.search(code, limit=10, offset=0)
            for item in existing["items"]:
                if getattr(item, "id", None) != current.id:
                    raise OrganizationCodeAlreadyExists("Organization code already exists")

        if domain and domain != current.domain:
            existing = await self.repo.search(domain, limit=10, offset=0)
            for item in existing["items"]:
                if getattr(item, "id", None) != current.id:
                    raise OrganizationDomainAlreadyExists("Organization domain already exists")

        updated = await self.repo.update(organization_id, payload)
        if updated is None:
            raise OrganizationNotFound("Organization not found")
        return updated

    async def deactivate_organization(self, organization_id: Any) -> bool:
        # soft delete + active false
        ok = await self.repo.soft_delete(organization_id)
        if not ok:
            raise OrganizationNotFound("Organization not found")
        return ok

