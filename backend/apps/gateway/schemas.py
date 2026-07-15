"""Pydantic v2 schemas for Gateway management."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GatewayRouteBase(BaseModel):
    api_id: uuid.UUID
    route_path: str = Field(min_length=1, max_length=512)
    upstream_url: str = Field(min_length=1, max_length=1024)
    authentication_type: str = Field(min_length=1, max_length=64)
    rate_limit: int = Field(ge=0)
    environment: str = Field(min_length=1, max_length=64)
    status: str = Field(min_length=1, max_length=64)


class GatewayRouteCreate(GatewayRouteBase):
    pass


class GatewayRouteUpdate(BaseModel):
    api_id: uuid.UUID | None = None
    route_path: str | None = Field(default=None, min_length=1, max_length=512)
    upstream_url: str | None = Field(default=None, min_length=1, max_length=1024)
    authentication_type: str | None = Field(default=None, min_length=1, max_length=64)
    rate_limit: int | None = Field(default=None, ge=0)
    environment: str | None = Field(default=None, min_length=1, max_length=64)
    status: str | None = Field(default=None, min_length=1, max_length=64)
    is_active: bool | None = None


class GatewayRouteCommon(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool


class GatewayRoute(GatewayRouteCreate, GatewayRouteCommon):
    model_config = ConfigDict(from_attributes=True)

