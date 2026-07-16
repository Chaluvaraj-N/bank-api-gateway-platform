import React, { useEffect, useMemo, useState } from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";
import { apiClient } from "@app/api/client";

<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
    <p className="text-sm text-slate-500">Active Routes</p>
    <h3 className="text-3xl font-bold text-slate-900 mt-2">148</h3>
  </div>

  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
    <p className="text-sm text-slate-500">Requests / Min</p>
    <h3 className="text-3xl font-bold text-blue-600 mt-2">84K</h3>
  </div>

  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
    <p className="text-sm text-slate-500">Avg Latency</p>
    <h3 className="text-3xl font-bold text-emerald-600 mt-2">128ms</h3>
  </div>

  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
    <p className="text-sm text-slate-500">Success Rate</p>
    <h3 className="text-3xl font-bold text-indigo-600 mt-2">99.8%</h3>
  </div>
</div>


function RoutePill({ tone, children }) {
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

function LoadingTable() {
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Route Path",
              "Environment",
              "Authentication Type",
              "Status",
              "API Name",
              "Created Date",
            ].map((h) => (
              <th
                key={h}
                className="text-left font-semibold text-slate-700 px-3 py-2 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-t border-slate-100">
              {[...Array(6)].map((__, j) => (
                <td key={j} className="px-3 py-2">
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto w-fit rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700 font-semibold">
        {title}
      </div>
      <div className="text-sm text-slate-500 mt-2">{subtitle}</div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
      <div className="font-semibold">Unable to load gateway routes</div>
      <div className="text-sm mt-1">{message}</div>
    </div>
  );
}

function DataTable({ rows }) {
  const columns = useMemo(
    () => [
      { key: "routePath", label: "Route Path" },
      { key: "environment", label: "Environment" },
      { key: "authenticationType", label: "Authentication Type" },
      { key: "status", label: "Status" },
      { key: "apiName", label: "API Name" },
      { key: "createdDate", label: "Created Date" },
    ],
    []
  );

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className="text-left font-semibold text-slate-700 px-3 py-2 whitespace-nowrap"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.routePath + r.apiName + i} className="border-t border-slate-100">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2 text-slate-700 whitespace-nowrap">
                  {c.key === "status" ? (
                    <RoutePill tone={r.status === "Active" ? "good" : "warn"}>
                      {r.status || "—"}
                    </RoutePill>
                  ) : (
                    r[c.key] || "—"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GatewayRoutesPage() {
  const analyticsOverview = [
    { label: "Active Routes", value: "148" },
    { label: "Avg Policy Match", value: "3.2 ms" },
    { label: "Last Deploy", value: "14:22" },
    { label: "Shadow Traffic", value: "12%" },
  ];

  const systemHealth = [
    { label: "Router", value: "Healthy", status: "good" },
    { label: "Upstream Connectivity", value: "Healthy", status: "good" },
    { label: "Rate Limit", value: "Stable", status: "good" },
    { label: "Config Sync", value: "Degraded", status: "warn" },
  ];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/gateway/routes", {
          params: { page, page_size: pageSize },
        });

        const data = res?.data;
        const normalized = Array.isArray(data) ? { items: data, total: data.length } : data || {};
        const rawItems = Array.isArray(normalized.items) ? normalized.items : [];
        const rawTotal = typeof normalized.total === "number" ? normalized.total : rawItems.length;

        const safe = rawItems.map((r) => {
          const routePath = r?.routePath ?? r?.path ?? r?.route_path ?? r?.name ?? "—";
          const environment = r?.environment ?? r?.env ?? r?.environmentName ?? "—";
          const authenticationType =
            r?.authenticationType ?? r?.authType ?? r?.authentication_type ?? r?.auth ?? "—";
          const status = r?.status ?? r?.routeStatus ?? "—";
          const apiName = r?.apiName ?? r?.api_name ?? r?.serviceName ?? r?.service_name ?? "—";
          const createdDateRaw = r?.createdDate ?? r?.created_at ?? r?.createdDateTime ?? r?.createdAt;
          const createdDate =
            createdDateRaw == null
              ? "—"
              : typeof createdDateRaw === "string"
                ? createdDateRaw
                : new Date(createdDateRaw).toLocaleDateString();

          return {
            routePath,
            environment,
            authenticationType,
            status,
            apiName,
            createdDate,
          };
        });

        if (!cancelled) {
          setItems(safe);
          setTotal(rawTotal);
          setError(null);
        }
      } catch (e) {
        if (cancelled) return;
        const message = e?.response?.data?.message || e?.message || "Unexpected error.";
        setError(message);
        setItems([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

  const canPrev = page > 1;
  const canNext = total == null ? false : page * pageSize < total;

  return (
    <EnterpriseLayout rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}>
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-slate-900 text-xl font-bold">Gateway Routes</div>
            <div className="text-slate-500 text-sm mt-1">Traffic routing, policies, and upstream mapping.</div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
            Add Route
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="font-semibold text-slate-900">Routing Rules</div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  placeholder="Search routes..."
                  className="w-full sm:w-64 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Degraded</option>
                </select>
              </div>
            </div>

            {loading ? (
              <LoadingTable />
            ) : error ? (
              <ErrorState message={error} />
            ) : items.length === 0 ? (
              <EmptyState title="No routes found" subtitle="Try adjusting filters or reload the page." />
            ) : (
              <DataTable rows={items} />
            )}

            {!loading && !error && items.length > 0 && (
              <div className="flex items-center justify-between gap-4 mt-4">
                <div className="text-xs text-slate-500">
                  Showing page <span className="font-semibold">{page}</span>
                  {total != null ? (
                    <>
                      {" "}of <span className="font-semibold">{Math.max(1, Math.ceil(total / pageSize))}</span>
                    </>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 disabled:opacity-50"
                    disabled={!canPrev}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8] disabled:opacity-50"
                    disabled={!canNext}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="font-semibold text-slate-900">Policy Preview</div>
            <div className="text-sm text-slate-500 mt-1">Mock routing policy summary</div>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {[
                { k: "Request Rewrite", v: "enabled" },
                { k: "Rate Limiting", v: "enabled (200 rps)" },
                { k: "WAF Checks", v: "enabled" },
                { k: "Circuit Breaker", v: "enabled" },
              ].map((x) => (
                <div key={x.k} className="flex items-center justify-between gap-3">
                  <div className="text-slate-600">{x.k}</div>
                  <div className="font-semibold text-slate-900">{x.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Last evaluation</div>
              <div className="text-sm font-semibold text-slate-900">32 ms</div>
              <div className="text-xs text-slate-500 mt-1">Matched policies: 4</div>
            </div>
          </section>
        </div>
      </div>
    </EnterpriseLayout>
  );
}


