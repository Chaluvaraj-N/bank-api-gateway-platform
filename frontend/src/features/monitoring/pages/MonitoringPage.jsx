import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";

function StatusBadge({ status }) {
  const cls =
    status === "Healthy"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Warning"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

const services = [
  {
    name: "Gateway Cluster",
    status: "Healthy",
    uptime: "99.99%",
    latency: "124ms",
  },
  {
    name: "Authentication Service",
    status: "Healthy",
    uptime: "99.97%",
    latency: "87ms",
  },
  {
    name: "API Registry",
    status: "Warning",
    uptime: "99.42%",
    latency: "210ms",
  },
  {
    name: "Analytics Engine",
    status: "Healthy",
    uptime: "99.95%",
    latency: "118ms",
  },
];

export default function MonitoringPage() {
  const analyticsOverview = [
    { label: "Active Services", value: "24" },
    { label: "Healthy", value: "22" },
    { label: "Warnings", value: "2" },
    { label: "Incidents", value: "0" },
  ];

  const systemHealth = [
    { label: "Gateway Nodes", value: "Healthy", status: "good" },
    { label: "Database", value: "Healthy", status: "good" },
    { label: "Cache Layer", value: "Healthy", status: "good" },
    { label: "Registry", value: "Warning", status: "warn" },
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
              Monitoring
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Real-time operational visibility across gateway services.
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
            Refresh Metrics
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-sm text-slate-500">
              Requests / Minute
            </div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              84K
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-sm text-slate-500">
              Error Rate
            </div>
            <div className="text-3xl font-bold text-emerald-600 mt-2">
              0.12%
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-sm text-slate-500">
              Avg Latency
            </div>
            <div className="text-3xl font-bold text-indigo-600 mt-2">
              128ms
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-sm text-slate-500">
              Uptime
            </div>
            <div className="text-3xl font-bold text-emerald-600 mt-2">
              99.99%
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">
              Service Health
            </h2>

            <input
              placeholder="Search service..."
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Uptime
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Latency
                  </th>
                  <th className="text-left px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {services.map((service, index) => (
                  <tr
                    key={index}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3 font-medium">
                      {service.name}
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={service.status} />
                    </td>

                    <td className="px-4 py-3">
                      {service.uptime}
                    </td>

                    <td className="px-4 py-3">
                      {service.latency}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button className="text-blue-600 hover:text-blue-800">
                          View
                        </button>

                        <button className="text-slate-600 hover:text-slate-900">
                          Logs
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
}