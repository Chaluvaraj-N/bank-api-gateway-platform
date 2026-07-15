import React, { useEffect, useMemo, useState } from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";
import { apiClient } from "@app/api/client";

function Badge({ children, tone }) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function DataTable({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600 text-sm">
        No API entries found.
      </div>
    );
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left font-semibold text-slate-700 px-3 py-2 whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-slate-700 whitespace-nowrap">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCreatedDate(value) {
  if (!value) return "-";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return String(value);
  }
}

function normalizeApiCatalogResponse(payload) {
  // Supported:
  // - array: [ ... ]
  // - paginated: { items: [...], total: N }
  // - empty: null/undefined/{}
  if (!payload) return { items: [], total: 0 };

  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length };
  }

  // common paginated envelopes
  const maybeItems = payload.items ?? payload.data ?? payload.results ?? payload.records;
  if (Array.isArray(maybeItems)) {
    const total = payload.total ?? payload.count ?? payload.total_items ?? maybeItems.length;
    return { items: maybeItems, total: total ?? maybeItems.length };
  }

  // fallback: if it looks like a single object
  return { items: [], total: 0 };
}

export default function ApiCatalogPage() {
  const analyticsOverview = [
    { label: "Catalog Health", value: "Operational" },
    { label: "Recently Updated", value: "14" },
    { label: "Draft APIs", value: "24" },
    { label: "Published APIs", value: "92" },
  ];

  const systemHealth = [
    { label: "Catalog Service", value: "Healthy", status: "good" },
    { label: "Schema Validator", value: "Healthy", status: "good" },
    { label: "Registry", value: "Degraded", status: "warn" },
    { label: "Audit Stream", value: "Healthy", status: "good" },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/api-manager");
        if (cancelled) return;

        const { items: rawItems, total: rawTotal } = normalizeApiCatalogResponse(res?.data);
        setItems(Array.isArray(rawItems) ? rawItems : []);
        setTotal(rawTotal ?? null);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          e?.message ||
          "Failed to load API catalog.";
        setError(msg);
        setItems([]);
        setTotal(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const columns = useMemo(
    () => [
      { key: "apiName", label: "API Name" },
      { key: "description", label: "Description" },
      { key: "version", label: "Version" },
      {
        key: "status",
        label: "Status",
        render: (r) => (
          <Badge tone={r.status === "Published" ? "good" : r.status === "Testing" ? "warn" : "neutral"}>
            {r.status || "-"}
          </Badge>
        ),
      },
      { key: "owner", label: "Owner" },
      {
        key: "createdDate",
        label: "Created Date",
      },
    ],
    []
  );

  const tableRows = useMemo(() => {
    return (items || []).map((it) => {
      const apiName = it?.name ?? it?.api_name ?? it?.apiName ?? "-";
      const description = it?.description ?? it?.api_description ?? it?.apiDescription ?? "-";
      const version = it?.version ?? "-";
      const status = it?.status ?? it?.lifecycle_status ?? it?.state ?? "-";
      const owner = it?.owner ?? it?.owner_name ?? it?.ownerName ?? "-";
      const createdRaw = it?.created_date ?? it?.createdAt ?? it?.created_date_time ?? it?.createdAtDate;
      const createdDate = formatCreatedDate(createdRaw);

      return {
        apiName,
        description,
        version,
        status,
        owner,
        createdDate,
      };
    });
  }, [items]);

  return (
    <EnterpriseLayout rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}>
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-slate-900 text-xl font-bold">API Catalog</div>
            <div className="text-slate-500 text-sm mt-1">Manage APIs, versions, and lifecycle states.</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
              Import
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
              Create API
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-3 justify-between mb-3">
              <div className="text-sm font-semibold text-slate-900">Catalog Entries</div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  placeholder="Search APIs..."
                  className="w-full sm:w-64 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Testing</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Loading...</div>
                <div className="text-sm text-slate-500 mt-1">Fetching API catalog from backend.</div>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm">
                <div className="font-semibold text-rose-800">Error</div>
                <div className="text-rose-700 mt-1">{error}</div>
              </div>
            ) : (
              <>
                {typeof total === "number" ? (
                  <div className="text-xs text-slate-500 mb-2">
                    Showing {tableRows.length} of {total} APIs
                  </div>
                ) : null}
                <DataTable columns={columns} rows={tableRows} />
              </>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="text-slate-900 font-semibold">Quick Actions</div>
            <div className="text-sm text-slate-500 mt-1">Common operations for administrators.</div>

            <div className="mt-4 space-y-3">
              {[
                { title: "Publish Draft", desc: "Move APIs to Published state" },
                { title: "Manage Versions", desc: "Create and deprecate versions" },
                { title: "View Analytics", desc: "See usage and performance" },
              ].map((x) => (
                <button key={x.title} className="w-full text-left p-3 rounded-xl border border-slate-200 hover:bg-slate-50">
                  <div className="font-semibold text-slate-900">{x.title}</div>
                  <div className="text-sm text-slate-500 mt-1">{x.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
}


