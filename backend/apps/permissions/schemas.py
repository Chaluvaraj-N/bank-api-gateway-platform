"""Pydantic v2 schemas for permissions."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PermissionBase(BaseModel):
    code: str
    name: str
    description: str


class PermissionCreate(PermissionBase):
    pass


class PermissionUpdate(BaseModel):
    code: str | None = None
    name: str | None = None
    description: str | None = None


class PermissionCommon(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool


class Permission(PermissionBase, PermissionCommon):
    model_config = ConfigDict(from_attributes=True)

