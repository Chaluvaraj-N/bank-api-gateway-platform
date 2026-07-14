"""Pydantic v2 schemas for API versions."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class APIVersionCreate(BaseModel):
    api_id: uuid.UUID
    version: str
    changelog: str
    openapi_spec: str
    status: str


class APIVersionUpdate(BaseModel):
    version: str | None = None
    changelog: str | None = None
    openapi_spec: str | None = None
    status: str | None = None


class APIVersionCommon(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool


class APIVersion(APIVersionCreate, APIVersionCommon):
    model_config = ConfigDict(from_attributes=True)

