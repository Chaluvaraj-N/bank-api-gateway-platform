from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Generic, Iterable, Optional, TypeVar

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import Select

from backend.apps.organizations.models import Organization


TModel = TypeVar("TModel")


def _get_attr_or_none(obj: Any, key: str) -> Any:
    if isinstance(obj, dict):
        return obj.get(key)
    return getattr(obj, key, None)


@dataclass(frozen=True)
class PaginationResult(Generic[TModel]):
    items: list[TModel]
    total: int
    limit: int
    offset: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "items": self.items,
            "total": self.total,
            "limit": self.limit,
            "offset": self.offset,
        }


class AsyncRepository(Generic[TModel]):
    """Generic async SQLAlchemy repository with soft-delete support."""

    model: type[TModel]
    search_columns: tuple[str, ...] = ()
    filterable_fields: dict[str, str] = {}

    def __init__(self, session: AsyncSession):
        self.session = session

    @property
    def _is_deleted_column(self):
        # All target models have is_deleted
        return getattr(self.model, "is_deleted")

    def _base_predicate(self):
        return self._is_deleted_column.is_(False)

    async def create(self, data: Any) -> TModel:
        payload = data.model_dump() if hasattr(data, "model_dump") else dict(data)
        obj: TModel = self.model(**payload)  # type: ignore[call-arg]
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def get_by_id(self, id: Any) -> Optional[TModel]:
        stmt = select(self.model).where(self._base_predicate(), getattr(self.model, "id") == id)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def list(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        stmt = select(self.model).where(self._base_predicate()).limit(limit).offset(offset)
        total_stmt = select(func.count()).select_from(
            select(self.model.id).where(self._base_predicate()).subquery()
        )

        items_res = await self.session.execute(stmt)
        total_res = await self.session.execute(total_stmt)

        items = list(items_res.scalars().all())
        total = int(total_res.scalar_one())
        return {"items": items, "total": total, "limit": limit, "offset": offset}

    async def update(self, id: Any, data: Any) -> Optional[TModel]:
        payload = data.model_dump(exclude_unset=True) if hasattr(data, "model_dump") else dict(data)
        if not payload:
            return await self.get_by_id(id)

        stmt = select(self.model).where(self._base_predicate(), getattr(self.model, "id") == id)
        res = await self.session.execute(stmt)
        obj = res.scalar_one_or_none()
        if obj is None:
            return None

        for k, v in payload.items():
            if hasattr(obj, k):
                setattr(obj, k, v)

        await self.session.commit()
        await self.session.refresh(obj)
        return obj

    async def soft_delete(self, id: Any) -> bool:
        stmt = select(self.model).where(self._base_predicate(), getattr(self.model, "id") == id)
        res = await self.session.execute(stmt)
        obj = res.scalar_one_or_none()
        if obj is None:
            return False

        # Only update flags
        if hasattr(obj, "is_deleted"):
            setattr(obj, "is_deleted", True)
        if hasattr(obj, "is_active"):
            setattr(obj, "is_active", False)

        await self.session.commit()
        return True

    def _build_ilike_predicate(self, query: str):
        pattern = f"%{query}%"
        predicates = []
        for col_name in self.search_columns:
            col = getattr(self.model, col_name)
            predicates.append(col.ilike(pattern))
        return and_(*predicates) if len(predicates) == 1 else func.coalesce(1, 1) & and_(*predicates)  # type: ignore

    def _search_predicate(self, query: str):
        pattern = f"%{query}%"
        cols = [getattr(self.model, c) for c in self.search_columns]
        return and_(self._base_predicate(), *[col.ilike(pattern) for col in cols]) if cols else self._base_predicate()

    def _filter_predicate(self, filters: dict[str, Any]):
        clauses = [self._base_predicate()]
        for key, value in filters.items():
            col_key = self.filterable_fields.get(key)
            if not col_key:
                continue
            col = getattr(self.model, col_key)
            clauses.append(col == value)
        return and_(*clauses)

    async def search(self, query: str, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        where_clause = self._search_predicate(query)
        stmt = select(self.model).where(where_clause).limit(limit).offset(offset)

        total_stmt = select(func.count()).select_from(select(self.model.id).where(where_clause).subquery())

        items_res = await self.session.execute(stmt)
        total_res = await self.session.execute(total_stmt)

        items = list(items_res.scalars().all())
        total = int(total_res.scalar_one())
        return {"items": items, "total": total, "limit": limit, "offset": offset}

    async def filter(
        self, filters: dict[str, Any], *, limit: int = 20, offset: int = 0
    ) -> dict[str, Any]:
        where_clause = self._filter_predicate(filters)
        stmt = select(self.model).where(where_clause).limit(limit).offset(offset)
        total_stmt = select(func.count()).select_from(select(self.model.id).where(where_clause).subquery())

        items_res = await self.session.execute(stmt)
        total_res = await self.session.execute(total_stmt)

        items = list(items_res.scalars().all())
        total = int(total_res.scalar_one())
        return {"items": items, "total": total, "limit": limit, "offset": offset}


class OrganizationRepository(AsyncRepository[Organization]):
    model = Organization
    search_columns = ("name", "code", "domain")
    filterable_fields = {
        "status": "status",
        "org_type": "org_type",
    }

