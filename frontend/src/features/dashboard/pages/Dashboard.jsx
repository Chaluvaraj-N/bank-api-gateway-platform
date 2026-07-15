import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Activity, AlertCircle, TrendingUp, DollarSign, Cpu, Users } from "lucide-react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "./RightPanel";
import { apiClient } from "@app/api/client";

const COLORS = ["#2563eb", "#60a5fa", "#1d4ed8", "#38bdf8", "#93c5fd", "#1e40af"];


function DonutChart({ data }) {
  const total = data.reduce((s, x) => s + x.value, 0);
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={58} outerRadius={85} stroke="none">
            {data.map((d, idx) => (
              <Cell key={d.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="-mt-20 ml-2">
        <div className="text-xs text-slate-500">Top APIs Usage</div>
        <div className="text-2xl font-bold text-slate-900">{total.toLocaleString()}</div>
      </div>
    </div>
  );
}

function SimpleLineChart({ points }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="calls" name="API Calls" stroke="#2563eb" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <div className="text-slate-900 text-xl font-bold">{title}</div>
      {subtitle ? <div className="text-slate-500 text-sm mt-1">{subtitle}</div> : null}
    </div>
  );
}


function Table({ title, columns, rows }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-slate-900 font-semibold">{title}</div>
          <div className="text-slate-500 text-sm">Last 24 hours</div>
        </div>
      </div>
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
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t border-slate-100">
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 text-slate-700 whitespace-nowrap">
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function Dashboard() {
  const analyticsOverview = [
    { label: "Avg Latency", value: "128 ms" },
    { label: "Throughput", value: "4,920 req/s" },
    { label: "Active Clients", value: "1,204" },
    { label: "Cache Hit Ratio", value: "92.4%" },
  ];

  const systemHealth = [
    { label: "Gateway Cluster", value: "Healthy", status: "good" },
    { label: "Policy Engine", value: "Healthy", status: "good" },
    { label: "Auth Service", value: "Degraded", status: "warn" },
    { label: "DB Replication", value: "Healthy", status: "good" },
  ];

  const linePoints = [
    { day: "Mon", calls: 120000 },
    { day: "Tue", calls: 152000 },
    { day: "Wed", calls: 138000 },
    { day: "Thu", calls: 166000 },
    { day: "Fri", calls: 189000 },
    { day: "Sat", calls: 174000 },
    { day: "Sun", calls: 160000 },
  ];

  const donut = [
    { name: "Payments API", value: 482000 },
    { name: "Accounts API", value: 318000 },
    { name: "Cards API", value: 214000 },
    { name: "Fraud API", value: 156000 },
  ];

  const lifecycle = [
    { name: "Draft", value: 24 },
    { name: "Testing", value: 31 },
    { name: "Published", value: 92 },
    { name: "Deprecated", value: 7 },
  ];

  const performance = [
    { name: "P95 Latency", value: 210 },
    { name: "Error %,", value: 0.21 },
    { name: "Success Rate", value: 99.79 },
    { name: "Timeout Rate", value: 0.03 },
  ];

  const recentApiActivity = [
    { time: "10:22", api: "Payments / Transfer", status: "Success", consumer: "CoreBanking" },
    { time: "10:18", api: "Accounts / Balance", status: "Success", consumer: "MobileBank" },
    { time: "10:07", api: "Cards / Freeze", status: "Success", consumer: "FraudGuard" },
    { time: "09:54", api: "Payments / Refund", status: "Success", consumer: "LedgerSync" },
    { time: "09:42", api: "Auth / Token", status: "Warning", consumer: "PartnerAPI" },
  ];

  const apiCatalogRows = [
    { name: "Payments API", version: "v2", owner: "Payments Team", status: "Published" },
    { name: "Accounts API", version: "v1", owner: "Core Banking", status: "Published" },
    { name: "Cards API", version: "v3", owner: "Cards Team", status: "Testing" },
    { name: "Fraud API", version: "v1", owner: "Risk Ops", status: "Published" },
  ];

  const topConsumersRows = [
    { consumer: "CoreBanking", calls: "412K", error: "0.11%" },
    { consumer: "MobileBank", calls: "301K", error: "0.18%" },
    { consumer: "PartnerAPI", calls: "218K", error: "0.29%" },
    { consumer: "LedgerSync", calls: "186K", error: "0.08%" },
  ];

  const [kpiCounts, setKpiCounts] = useState({
    organizations: 0,
    users: 0,
    roles: 0,
    apiManager: 0,
    gatewayRoutes: 0,
  });
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [kpisError, setKpisError] = useState(null);

  const getCountFromResponse = (data) => {
    if (!data) return 0;
    if (Array.isArray(data)) return data.length;
    if (typeof data === "object") {
      const maybeTotal = data.total ?? data.count ?? data.totalCount;
      if (typeof maybeTotal === "number") return maybeTotal;

      const items = data.items ?? data.results ?? data.data;
      if (Array.isArray(items)) return items.length;

      // Last resort: if it's an object but not shaped as an array/collection
      return Object.keys(data).length;
    }
    return 0;
  };

  useEffect(() => {
    let mounted = true;

    const fetchKpis = async () => {
      setLoadingKpis(true);
      setKpisError(null);
      try {
        const [orgRes, userRes, roleRes, apiManagerRes, gatewayRoutesRes] = await Promise.all([
          apiClient.get("/organizations"),
          apiClient.get("/users"),
          apiClient.get("/roles"),
          apiClient.get("/api-manager"),
          apiClient.get("/gateway/routes"),
        ]);

        if (!mounted) return;

        setKpiCounts({
          organizations: getCountFromResponse(orgRes?.data),
          users: getCountFromResponse(userRes?.data),
          roles: getCountFromResponse(roleRes?.data),
          apiManager: getCountFromResponse(apiManagerRes?.data),
          gatewayRoutes: getCountFromResponse(gatewayRoutesRes?.data),
        });
      } catch (err) {
        if (!mounted) return;
        setKpisError(err);
        setKpiCounts({
          organizations: 0,
          users: 0,
          roles: 0,
          apiManager: 0,
          gatewayRoutes: 0,
        });
      } finally {
        if (!mounted) return;
        setLoadingKpis(false);
      }
    };

    fetchKpis();

    return () => {
      mounted = false;
    };
  }, []);

  const kpi = [
    {
      label: "Total Organizations",
      value: loadingKpis ? "..." : kpiCounts.organizations,
      icon: Activity,
      trend: "",
    },
    {
      label: "Total Users",
      value: loadingKpis ? "..." : kpiCounts.users,
      icon: Users,
      trend: "",
    },
    {
      label: "Total Roles",
      value: loadingKpis ? "..." : kpiCounts.roles,
      icon: TrendingUp,
      trend: "",
    },
    {
      label: "Total APIs",
      value: loadingKpis ? "..." : kpiCounts.apiManager,
      icon: Activity,
      trend: "",
    },
    {
      label: "Total Gateway Routes",
      value: loadingKpis ? "..." : kpiCounts.gatewayRoutes,
      icon: DollarSign,
      trend: "",
    },
  ];

  return (
    <EnterpriseLayout
      rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}
    >
      <div className="p-5 md:p-6">
        <SectionTitle title="Dashboard" subtitle="Enterprise banking insights for your API gateway platform." />

        {kpisError ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            Failed to load dashboard KPIs. Showing fallback values (0).
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {kpi.map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">{item.label}</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{item.value}</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-slate-700" />
                </div>
              </div>
              <div className="mt-3 text-sm font-semibold text-emerald-700">{item.trend || " "}</div>
            </div>
          ))}
        </div>


        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-slate-900">API Calls Trend</div>
                <div className="text-sm text-slate-500">Weekly activity</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Cpu className="w-4 h-4" />
                Real-time mock
              </div>
            </div>
            <SimpleLineChart points={linePoints} />
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-slate-900">Top APIs Usage</div>
                <div className="text-sm text-slate-500">Share by API</div>
              </div>
            </div>
            <DonutChart data={donut} />
          </section>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-slate-900">API Lifecycle Distribution</div>
                <div className="text-sm text-slate-500">Draft → Published</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {lifecycle.map((x, idx) => (
                <div key={x.name} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">{x.name}</div>
                    <div className="text-sm font-bold text-slate-900">{x.value}</div>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-[#2563eb]"
                      style={{ width: `${Math.min(100, (x.value / 120) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold text-slate-900">API Performance</div>
                <div className="text-sm text-slate-500">SLO snapshot</div>
              </div>
            </div>
            <div className="space-y-3">
              {performance.map((x) => (
                <div key={x.name} className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">{x.name}</div>
                  <div className="text-sm font-semibold text-slate-900">{x.value}</div>
                </div>
              ))}
              <div className="mt-2 rounded-lg bg-slate-50 border border-slate-200 p-3">
                <div className="text-sm text-slate-600">SLA status</div>
                <div className="text-slate-900 font-bold">99.9% monthly availability</div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Table
            title="Recent API Activity"
            columns={[
              { key: "time", label: "Time" },
              { key: "api", label: "API" },
              { key: "status", label: "Status" },
              { key: "consumer", label: "Consumer" },
            ]}
            rows={recentApiActivity}
          />
          <div className="space-y-6">
            <Table
              title="Top Consumers"
              columns={[
                { key: "consumer", label: "Consumer" },
                { key: "calls", label: "Calls" },
                { key: "error", label: "Error" },
              ]}
              rows={topConsumersRows}
            />
          </div>
        </div>

        <div className="mt-6">
          <Table
            title="API Catalog"
            columns={[
              { key: "name", label: "API" },
              { key: "version", label: "Version" },
              { key: "owner", label: "Owner" },
              { key: "status", label: "Status" },
            ]}
            rows={apiCatalogRows}
          />
        </div>
      </div>
    </EnterpriseLayout>
  );
}

