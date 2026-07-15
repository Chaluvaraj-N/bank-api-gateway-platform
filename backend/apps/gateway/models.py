"""SQLAlchemy models for Gateway management."""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.db.base import Base  # type: ignore


class GatewayRoute(Base):  # type: ignore[misc]
    __tablename__ = "gateway_routes"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    api_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("apis.id"), nullable=False, index=True)

    route_path: Mapped[str] = mapped_column(String(512), nullable=False)
    upstream_url: Mapped[str] = mapped_column(String(1024), nullable=False)

    authentication_type: Mapped[str] = mapped_column(String(64), nullable=False)
    rate_limit: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    environment: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(64), nullable=False)

    # NOTE: Keep audit fields (created_at/updated_at) populated via app/migrations.
    # Many modules in this repo use explicit DateTime columns without defaults.

