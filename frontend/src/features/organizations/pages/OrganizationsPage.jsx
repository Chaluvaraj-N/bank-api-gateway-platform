import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";

const rows = [
  { org: "Core Banking", tier: "Platinum", status: "Active", regions: "NA/EU" },
  { org: "Partner Network", tier: "Gold", status: "Active", regions: "APAC" },
  { org: "Ledger Team", tier: "Silver", status: "Active", regions: "NA" },
  { org: "Risk Ops", tier: "Gold", status: "Restricted", regions: "EU" },
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

export default function OrganizationsPage() {
  const analyticsOverview = [
    { label: "Total Organizations", value: "64" },
    { label: "Active", value: "58" },
    { label: "Restricted", value: "6" },
    { label: "Compliance Score", value: "98.1%" },
  ];

  const systemHealth = [
    { label: "Org Registry", value: "Healthy", status: "good" },
    { label: "Policy Sync", value: "Healthy", status: "good" },
    { label: "Directory Lookup", value: "Healthy", status: "good" },
    { label: "Audit Export", value: "Healthy", status: "good" },
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Organizations
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage banking entities, tiers, access policies, and operational
              status.
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
            + Add Organization
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Total Organizations</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">64</h3>
            <p className="text-xs text-emerald-600 mt-2">
              +12% from last month
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Active Organizations</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2">58</h3>
            <p className="text-xs text-slate-500 mt-2">
              Currently operational
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Restricted</p>
            <h3 className="text-3xl font-bold text-amber-600 mt-2">6</h3>
            <p className="text-xs text-slate-500 mt-2">
              Requires compliance review
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Compliance Score</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">98.1%</h3>
            <p className="text-xs text-slate-500 mt-2">
              Enterprise benchmark
            </p>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Organization Directory
              </h2>
              <p className="text-sm text-slate-500">
                Search and manage all registered organizations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                placeholder="Search organizations..."
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
                <option>All Status</option>
                <option>Active</option>
                <option>Restricted</option>
              </select>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Organization
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Tier
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Regions
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-slate-500"
                    >
                      No organizations found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                        {r.org}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {r.tier}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          tone={
                            r.status === "Active" ? "good" : "warn"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {r.regions}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-3">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View
                          </button>

                          <button className="text-slate-600 hover:text-slate-900 font-medium">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
}