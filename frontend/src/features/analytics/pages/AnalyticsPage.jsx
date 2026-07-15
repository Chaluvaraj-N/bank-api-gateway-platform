import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2563eb", "#60a5fa", "#38bdf8", "#1d4ed8", "#93c5fd"];

function LineCard() {
  const data = [
    { t: "00:00", v: 120 },
    { t: "03:00", v: 140 },
    { t: "06:00", v: 132 },
    { t: "09:00", v: 160 },
    { t: "12:00", v: 188 },
    { t: "15:00", v: 175 },
    { t: "18:00", v: 169 },
    { t: "21:00", v: 182 },
    { t: "23:00", v: 190 },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="font-semibold text-slate-900">Reports: API Throughput</div>
      <div className="text-sm text-slate-500 mt-1">Mock trend by hour</div>
      <div className="h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="t" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function BarCard() {
  const data = [
    { name: "P95", value: 210 },
    { name: "P99", value: 390 },
    { name: "Avg", value: 128 },
    { name: "Errors", value: 0.21 },
  ];
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="font-semibold text-slate-900">Monitoring: Latency & Errors</div>
      <div className="text-sm text-slate-500 mt-1">Mock SLO chart</div>
      <div className="h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function PieCard() {
  const data = [
    { name: "Payments", value: 48 },
    { name: "Accounts", value: 31 },
    { name: "Cards", value: 21 },
    { name: "Fraud", value: 16 },
    { name: "Auth", value: 11 },
  ];
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="font-semibold text-slate-900">Usage by Domain</div>
      <div className="text-sm text-slate-500 mt-1">Mock distribution</div>
      <div className="h-72 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90} stroke="none">
              {data.map((d, i) => (
                <Cell key={d.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default function AnalyticsPage() {
  const analyticsOverview = [
    { label: "Dashboards", value: "12" },
    { label: "Alerts", value: "3" },
    { label: "Exported Reports", value: "27" },
    { label: "MTTR", value: "18m" },
  ];

  const systemHealth = [
    { label: "Telemetry Pipeline", value: "Healthy", status: "good" },
    { label: "Metrics Store", value: "Healthy", status: "good" },
    { label: "Logs", value: "Healthy", status: "good" },
    { label: "Alerts", value: "Investigating", status: "warn" },
  ];

  return (
    <EnterpriseLayout rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}>
      <div className="p-5 md:p-6">
        <div className="text-slate-900 text-xl font-bold">Analytics</div>
        <div className="text-slate-500 text-sm mt-1">Reports, monitoring, and observability for API gateway traffic.</div>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineCard />
          <BarCard />
        </div>

        <div className="mt-6">
          <PieCard />
        </div>
      </div>
    </EnterpriseLayout>
  );
}

