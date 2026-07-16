import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";

const rows = [
  {
    app: "MobileBank",
    clientId: "cl_9a1f...",
    status: "Active",
    org: "Core Banking",
    plan: "Premium",
    requests: "12.4M",
  },
  {
    app: "CoreBanking",
    clientId: "cl_3c2b...",
    status: "Active",
    org: "Core Banking",
    plan: "Enterprise",
    requests: "28.7M",
  },
  {
    app: "PartnerAPI",
    clientId: "cl_12ff...",
    status: "Active",
    org: "Partner Network",
    plan: "Standard",
    requests: "4.1M",
  },
  {
    app: "LedgerSync",
    clientId: "cl_8bb0...",
    status: "Paused",
    org: "Ledger Team",
    plan: "Standard",
    requests: "870K",
  },
];

function Badge({ children, tone }) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

export default function ApplicationsPage() {
  const analyticsOverview = [
    { label: "Applications", value: "286" },
    { label: "Active Clients", value: "214" },
    { label: "Paused", value: "18" },
    { label: "Success Rate", value: "99.8%" },
  ];

  const systemHealth = [
    { label: "Consumer Registry", value: "Healthy", status: "good" },
    { label: "Key Management", value: "Healthy", status: "good" },
    { label: "Provisioning", value: "Stable", status: "good" },
    { label: "Audit Writer", value: "Healthy", status: "good" },
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Applications
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage consumer applications, API subscriptions, credentials and
              gateway access.
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
            + New Application
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Applications</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">286</h3>
            <p className="text-xs text-emerald-600 mt-2">
              +14 this month
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Active Clients</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2">
              214
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Connected consumers
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Paused</p>
            <h3 className="text-3xl font-bold text-amber-600 mt-2">18</h3>
            <p className="text-xs text-slate-500 mt-2">
              Awaiting review
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Gateway Success Rate</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              99.8%
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Last 24 hours
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Application Directory
              </h2>
              <p className="text-sm text-slate-500">
                Search and manage all registered applications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                placeholder="Search applications..."
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
                <option>All Plans</option>
                <option>Enterprise</option>
                <option>Premium</option>
                <option>Standard</option>
              </select>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Application
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Client ID
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Organization
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Plan
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Requests
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {r.app}
                    </td>

                    <td className="px-4 py-3">
                      {r.clientId}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          r.status === "Active"
                            ? "good"
                            : "warn"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      {r.org}
                    </td>

                    <td className="px-4 py-3">
                      {r.plan}
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-700">
                      {r.requests}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          View
                        </button>

                        <button className="text-slate-600 hover:text-slate-900 font-medium">
                          Edit
                        </button>

                        <button className="text-emerald-600 hover:text-emerald-800 font-medium">
                          Deploy
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