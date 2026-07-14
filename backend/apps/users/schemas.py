"""Pydantic v2 schemas for users."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    organization_id: uuid.UUID
    role_id: uuid.UUID
    email: EmailStr
    first_name: str
    last_name: str
    designation: str
    status: str


class UserCreate(UserBase):
    hashed_password: str


class UserUpdate(BaseModel):
    organization_id: uuid.UUID | None = None
    role_id: uuid.UUID | None = None
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    designation: str | None = None
    status: str | None = None


class UserCommon(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
    is_deleted: bool


class User(UserBase, UserCommon):
    model_config = ConfigDict(from_attributes=True)

