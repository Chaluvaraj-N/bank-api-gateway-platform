import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
      <div className="font-semibold text-slate-900">
        API Throughput
      </div>
      <div className="text-sm text-slate-500 mt-1">
        Requests per hour
      </div>

      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="t" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="v"
              stroke="#2563eb"
              strokeWidth={3}
            />
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
    { name: "Errors", value: 1 },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="font-semibold text-slate-900">
        Latency Metrics
      </div>

      <div className="text-sm text-slate-500 mt-1">
        SLA monitoring
      </div>

      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#60a5fa" />
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
      <div className="font-semibold text-slate-900">
        API Usage Distribution
      </div>

      <div className="text-sm text-slate-500 mt-1">
        Requests by domain
      </div>

      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
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
    { label: "Reports", value: "27" },
    { label: "MTTR", value: "18m" },
  ];

  const systemHealth = [
    { label: "Telemetry Pipeline", value: "Healthy", status: "good" },
    { label: "Metrics Store", value: "Healthy", status: "good" },
    { label: "Logs", value: "Healthy", status: "good" },
    { label: "Alerts", value: "Monitoring", status: "warn" },
  ];

  return (
    <EnterpriseLayout
      rightPanel={
        <RightPanel
          analyticsOverview={analyticsOverview}
          systemHealth={systemHealth}
        />
      }
    >
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Analytics & Monitoring
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              API gateway performance, traffic insights and
              operational intelligence.
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
            Export Report
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              API Requests
            </p>
            <h3 className="text-3xl font-bold mt-2">
              42.8M
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Success Rate
            </p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2">
              99.82%
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Avg Latency
            </p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              128ms
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Active APIs
            </p>
            <h3 className="text-3xl font-bold text-indigo-600 mt-2">
              184
            </h3>
          </div>
        </div>

        {/* CHARTS */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
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