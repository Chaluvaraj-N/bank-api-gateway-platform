"""Pydantic v2 schemas for Consumer management."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ConsumerBase(BaseModel):
    organization_id: uuid.UUID
    name: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=3, max_length=255)
    status: str = Field(min_length=1, max_length=64)


class ConsumerCreate(ConsumerBase):
    pass


class ConsumerUpdate(BaseModel):
    organization_id: uuid.UUID | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    email: str | None = Field(default=None, min_length=3, max_length=255)
    status: str | None = Field(default=None, min_length=1, max_length=64)


class ConsumerCommon(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool


class Consumer(ConsumerCreate, ConsumerCommon):
    model_config = ConfigDict(from_attributes=True)


class ConsumerListResponse(BaseModel):
    items: list[Consumer]
    total: int
    limit: int
    offset: int

