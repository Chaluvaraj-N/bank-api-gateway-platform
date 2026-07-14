"""Pydantic v2 schemas for organizations."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class OrganizationBase(BaseModel):
    name: str
    code: str
    org_type: str
    domain: str
    timezone: str
    status: str


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    org_type: str | None = None
    domain: str | None = None
    timezone: str | None = None
    status: str | None = None


class OrganizationCommon(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool


class Organization(OrganizationBase, OrganizationCommon):
    model_config = ConfigDict(from_attributes=True)

