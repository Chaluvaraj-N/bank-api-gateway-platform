"""Pydantic v2 schemas for roles."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RoleBase(BaseModel):
    name: str
    description: str
    is_system_role: bool = False


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    is_system_role: bool | None = None


class RoleCommon(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool


class Role(RoleBase, RoleCommon):
    model_config = ConfigDict(from_attributes=True)

