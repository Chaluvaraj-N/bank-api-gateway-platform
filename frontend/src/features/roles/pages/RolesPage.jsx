import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";

const rows = [
  {
    role: "Admin",
    permissions: "Full platform access",
    members: 18,
    status: "Active",
    risk: "High",
  },
  {
    role: "Operator",
    permissions: "Route & policy management",
    members: 44,
    status: "Active",
    risk: "Medium",
  },
  {
    role: "Approver",
    permissions: "Lifecycle approvals",
    members: 22,
    status: "Active",
    risk: "Medium",
  },
  {
    role: "Auditor",
    permissions: "Read-only audit access",
    members: 12,
    status: "Active",
    risk: "Low",
  },
];

function Badge({ children, tone }) {
  const cls =
    tone === "good"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : tone === "danger"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

export default function RolesPage() {
  const analyticsOverview = [
    { label: "Total Roles", value: "18" },
    { label: "Custom Roles", value: "4" },
    { label: "Min Privilege", value: "Enforced" },
    { label: "Last Policy Update", value: "2 days ago" },
  ];

  const systemHealth = [
    { label: "Authorization Service", value: "Healthy", status: "good" },
    { label: "Policy Cache", value: "Healthy", status: "good" },
    { label: "Role Assignments", value: "Stable", status: "good" },
    { label: "Audit Logs", value: "Healthy", status: "good" },
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
              Roles & Permissions
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage RBAC roles, permissions, governance controls and security
              policies.
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
            + Create Role
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Total Roles</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">18</h3>
            <p className="text-xs text-slate-500 mt-2">
              Across the organization
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Custom Roles</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">4</h3>
            <p className="text-xs text-slate-500 mt-2">
              Business-specific roles
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Assigned Users</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2">96</h3>
            <p className="text-xs text-slate-500 mt-2">
              Active assignments
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Compliance Score</p>
            <h3 className="text-3xl font-bold text-indigo-600 mt-2">99.4%</h3>
            <p className="text-xs text-slate-500 mt-2">
              Security governance
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">RBAC Directory</h2>
              <p className="text-sm text-slate-500">
                Review and manage system roles and permission scopes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                placeholder="Search roles..."
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
                <option>All Roles</option>
                <option>Admin</option>
                <option>Operator</option>
                <option>Approver</option>
                <option>Auditor</option>
              </select>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Permissions
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Members
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Risk Level
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Status
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
                      colSpan="6"
                      className="text-center py-12 text-slate-500"
                    >
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {r.role}
                      </td>

                      <td className="px-4 py-3">
                        {r.permissions}
                      </td>

                      <td className="px-4 py-3">
                        {r.members}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          tone={
                            r.risk === "High"
                              ? "danger"
                              : r.risk === "Medium"
                              ? "warn"
                              : "good"
                          }
                        >
                          {r.risk}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <Badge tone="good">
                          {r.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View
                          </button>

                          <button className="text-slate-600 hover:text-slate-900 font-medium">
                            Edit
                          </button>

                          <button className="text-red-600 hover:text-red-800 font-medium">
                            Revoke
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