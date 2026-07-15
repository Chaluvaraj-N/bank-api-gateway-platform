import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";
import { ChevronRight, Clock, GitBranch, History, Shield, TerminalSquare } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const Badge = ({ children, tone }) => {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : tone === "bad"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`}> 
      {children}
    </span>
  );
};

const ChartCard = ({ title, subtitle, children, right }) => {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-semibold text-slate-900">{title}</div>
          {subtitle ? <div className="text-sm text-slate-500 mt-1">{subtitle}</div> : null}
        </div>
        {right ? <div className="text-sm text-slate-600">{right}</div> : null}
      </div>
      {children}
    </section>
  );
};

const LineArea = ({ data }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="requests"
            name="Requests"
            stroke="#2563eb"
            fill="#93c5fd"
            fillOpacity={0.35}
            strokeWidth={3}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const BarLatency = ({ data }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="version" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="p95" name="P95 (ms)" fill="#60a5fa" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const Distribution = ({ data }) => {
  const COLORS = ["#2563eb", "#60a5fa", "#38bdf8", "#1d4ed8", "#93c5fd"];
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} stroke="none">
            {data.map((d, idx) => (
              <Cell key={d.name} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const Table = ({ columns, rows }) => {
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
};

export default function ApiVersionsPage() {
  const analyticsOverview = [
    { label: "Active Versions", value: "48" },
    { label: "New Releases (7d)", value: "12" },
    { label: "Deprecations (30d)", value: "5" },
    { label: "Avg Compatibility", value: "99.2%" },
  ];

  const systemHealth = [
    { label: "Version Registry", value: "Healthy", status: "good" },
    { label: "Compatibility Checks", value: "Healthy", status: "good" },
    { label: "Migration Planner", value: "Stable", status: "good" },
    { label: "Audit Stream", value: "Healthy", status: "good" },
  ];

  const versionRequests = [
    { label: "Mon", requests: 120000 },
    { label: "Tue", requests: 138000 },
    { label: "Wed", requests: 129000 },
    { label: "Thu", requests: 151000 },
    { label: "Fri", requests: 173000 },
    { label: "Sat", requests: 160000 },
    { label: "Sun", requests: 154000 },
  ];

  const latencyByVersion = [
    { version: "v1", p95: 168 },
    { version: "v2", p95: 142 },
    { version: "v3", p95: 155 },
    { version: "v4", p95: 189 },
  ];

  const distribution = [
    { name: "v1", value: 34 },
    { name: "v2", value: 29 },
    { name: "v3", value: 21 },
    { name: "v4", value: 16 },
  ];

  const rows = [
    { api: "Payments API", version: "v2", status: "Active", maturity: "Stable", owner: "Payments Team", consumers: 124 },
    { api: "Accounts API", version: "v1", status: "Active", maturity: "Stable", owner: "Core Banking", consumers: 98 },
    { api: "Cards API", version: "v3", status: "Testing", maturity: "Candidate", owner: "Cards Team", consumers: 42 },
    { api: "Fraud API", version: "v1", status: "Published", maturity: "Stable", owner: "Risk Ops", consumers: 63 },
    { api: "Ledger Sync", version: "v4", status: "Deprecated", maturity: "Retiring", owner: "Ledger Team", consumers: 11 },
  ];

  return (
    <EnterpriseLayout rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}>
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-slate-900 text-xl font-bold">API Versions</div>
            <div className="text-slate-500 text-sm mt-1">Release cadence, compatibility health, and deprecation planning.</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
              Import Versions
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
              Create Release
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
          <ChartCard
            title="Request Velocity"
            subtitle="Mock trend (7 days)"
            right={
              <div className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Realtime mock</span>
              </div>
            }
          >
            <LineArea data={versionRequests} />
          </ChartCard>

          <ChartCard title="Latency by Version" subtitle="P95 (ms) snapshot">
            <BarLatency data={latencyByVersion} />
          </ChartCard>

          <ChartCard title="Consumer Distribution" subtitle="Traffic share by version">
            <Distribution data={distribution} />
          </ChartCard>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="font-semibold text-slate-900">Version Registry</div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  placeholder="Search versions..."
                  className="w-full sm:w-64 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Testing</option>
                  <option>Deprecated</option>
                </select>
              </div>
            </div>

            <Table
              columns={[
                { key: "api", label: "API" },
                { key: "version", label: "Version" },
                {
                  key: "status",
                  label: "Status",
                  render: (r) => (
                    <Badge tone={r.status === "Active" ? "good" : r.status === "Testing" ? "warn" : "neutral"}>
                      {r.status}
                    </Badge>
                  ),
                },
                { key: "maturity", label: "Maturity" },
                { key: "owner", label: "Owner" },
                { key: "consumers", label: "Consumers" },
              ]}
              rows={rows}
            />
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-slate-900">Release Controls</div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 text-sm">
              {[
                { icon: GitBranch, k: "Compatibility", v: "Strict schemas + contract tests" },
                { icon: Shield, k: "Deprecation", v: "Staged retirement windows" },
                { icon: History, k: "Audit", v: "Immutable release events" },
                { icon: TerminalSquare, k: "Migration", v: "Planner suggests safe routes" },
              ].map((x) => (
                <div key={x.k} className="flex items-start gap-3">
                  <x.icon className="w-4 h-4 text-slate-600 mt-0.5" />
                  <div>
                    <div className="text-slate-600 font-medium">{x.k}</div>
                    <div className="text-slate-500 mt-0.5">{x.v}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
              Create Compatibility Policy
            </button>
          </section>
        </div>
      </div>
    </EnterpriseLayout>
  );
}

