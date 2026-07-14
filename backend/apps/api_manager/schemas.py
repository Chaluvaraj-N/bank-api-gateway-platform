"""Pydantic v2 schemas for APIs."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class APICreate(BaseModel):
    organization_id: uuid.UUID
    owner_id: uuid.UUID
    name: str
    description: str
    base_path: str
    category: str
    lifecycle_status: str
    visibility: str


class APIUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    base_path: str | None = None
    category: str | None = None
    lifecycle_status: str | None = None
    visibility: str | None = None


class APICommon(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool


class API(APICreate, APICommon):
    model_config = ConfigDict(from_attributes=True)

