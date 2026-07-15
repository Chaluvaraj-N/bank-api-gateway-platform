"""Repository layer for Consumer management."""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.apps.consumers.models import Consumer


TModel = TypeVar("TModel")


class AsyncRepository(Generic[TModel]):
    """Minimal async repository (matches patterns used by other modules in this repo)."""

    model: type[TModel]
    search_columns: tuple[str, ...] = ()
    filterable_fields: dict[str, str] = {}

    def __init__(self, session: AsyncSession):
        self.session = session

    @property
    def _is_deleted_column(self):
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

    async def get_by_id(self, id: Any) -> TModel | None:
        stmt = select(self.model).where(self._base_predicate(), getattr(self.model, "id") == id)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def list(self, *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        where_clause = self._base_predicate()
        stmt = select(self.model).where(where_clause).limit(limit).offset(offset)
        total_stmt = select(func.count()).select_from(select(self.model.id).where(where_clause).subquery())

        items_res = await self.session.execute(stmt)
        total_res = await self.session.execute(total_stmt)

        items = list(items_res.scalars().all())
        total = int(total_res.scalar_one())
        return {"items": items, "total": total, "limit": limit, "offset": offset}

    async def update(self, id: Any, data: Any) -> TModel | None:
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

        setattr(obj, "is_deleted", True)
        setattr(obj, "is_active", False)
        await self.session.commit()
        return True

    def _search_predicate(self, query: str):
        where_clause = self._base_predicate()
        pattern = f"%{query}%"
        or_clauses = [getattr(self.model, c).ilike(pattern) for c in self.search_columns]
        if not or_clauses:
            return where_clause
        return and_(where_clause, or_(*or_clauses))

    def _filter_predicate(self, filters: dict[str, Any]):
        clauses = [self._base_predicate()]
        for key, value in filters.items():
            col_name = self.filterable_fields.get(key)
            if not col_name:
                continue
            clauses.append(getattr(self.model, col_name) == value)
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

    async def filter(self, filters: dict[str, Any], *, limit: int = 20, offset: int = 0) -> dict[str, Any]:
        where_clause = self._filter_predicate(filters)
        stmt = select(self.model).where(where_clause).limit(limit).offset(offset)
        total_stmt = select(func.count()).select_from(select(self.model.id).where(where_clause).subquery())

        items_res = await self.session.execute(stmt)
        total_res = await self.session.execute(total_stmt)

        items = list(items_res.scalars().all())
        total = int(total_res.scalar_one())
        return {"items": items, "total": total, "limit": limit, "offset": offset}


class ConsumerRepository(AsyncRepository[Consumer]):
    model = Consumer

    search_columns = ("name", "email")

    filterable_fields = {
        "organization_id": "organization_id",
        "status": "status",
    }

    async def get_by_email(self, email: str) -> Consumer | None:
        stmt = select(self.model).where(self._base_predicate(), self.model.email == email)
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

    async def get_by_email_excluding_id(self, *, email: str, exclude_id: Any) -> Consumer | None:
        stmt = (
            select(self.model)
            .where(
                self._base_predicate(),
                self.model.email == email,
                self.model.id != exclude_id,
            )
        )
        res = await self.session.execute(stmt)
        return res.scalar_one_or_none()

