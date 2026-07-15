import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";

const rows = [
  { role: "Admin", permissions: "Full access", members: 18, status: "Active" },
  { role: "Operator", permissions: "Route & policy management", members: 44, status: "Active" },
  { role: "Approver", permissions: "Lifecycle approvals", members: 22, status: "Active" },
  { role: "Auditor", permissions: "Read-only audit", members: 12, status: "Active" },
];

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
    <EnterpriseLayout rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}>
      <div className="p-5 md:p-6">
        <div className="text-slate-900 text-xl font-bold">Roles</div>
        <div className="text-slate-500 text-sm mt-1">Role-based access control for enterprise governance.</div>

        <div className="mt-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="font-semibold text-slate-900">RBAC Roles</div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                placeholder="Search roles..."
                className="w-full sm:w-64 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
                Create Role
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Role",
                    "Permissions",
                    "Members",
                    "Status",
                  ].map((h) => (
                    <th key={h} className="text-left font-semibold text-slate-700 px-3 py-2 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-semibold">{r.role}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.permissions}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.members}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                      <Badge tone={r.status === "Active" ? "good" : "warn"}>{r.status}</Badge>
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

