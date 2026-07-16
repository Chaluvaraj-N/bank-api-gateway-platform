import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";

const rows = [
  {
    name: "Ava Johnson",
    email: "ava.johnson@corebanking.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2 mins ago",
  },
  {
    name: "Noah Smith",
    email: "noah.smith@partnerapi.com",
    role: "Operator",
    status: "Active",
    lastLogin: "15 mins ago",
  },
  {
    name: "Mia Chen",
    email: "mia.chen@riskops.com",
    role: "Auditor",
    status: "Suspended",
    lastLogin: "2 days ago",
  },
  {
    name: "Liam Patel",
    email: "liam.patel@corebanking.com",
    role: "Approver",
    status: "Active",
    lastLogin: "5 mins ago",
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

export default function UsersPage() {
  const analyticsOverview = [
    { label: "Total Users", value: "1,148" },
    { label: "Active", value: "1,022" },
    { label: "Suspended", value: "24" },
    { label: "Avg Login", value: "2.7m" },
  ];

  const systemHealth = [
    { label: "Identity Provider", value: "Healthy", status: "good" },
    { label: "Authz Cache", value: "Healthy", status: "good" },
    { label: "Audit Events", value: "Healthy", status: "good" },
    { label: "Role Assignments", value: "Stable", status: "good" },
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
              Users Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage administrators, operators, auditors and approvers across
              the platform.
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
            + Add User
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Total Users</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-2">1,148</h3>
            <p className="text-xs text-emerald-600 mt-2">
              +8% from last month
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Active Users</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2">1,022</h3>
            <p className="text-xs text-slate-500 mt-2">
              Currently signed in
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Suspended</p>
            <h3 className="text-3xl font-bold text-amber-600 mt-2">24</h3>
            <p className="text-xs text-slate-500 mt-2">
              Security review required
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <p className="text-sm text-slate-500">Login Success Rate</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">99.8%</h3>
            <p className="text-xs text-slate-500 mt-2">
              Last 24 hours
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">User Directory</h2>
              <p className="text-sm text-slate-500">
                Search and manage platform users.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                placeholder="Search users..."
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm">
                <option>All Roles</option>
                <option>Admin</option>
                <option>Operator</option>
                <option>Auditor</option>
                <option>Approver</option>
              </select>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Role
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">
                    Last Login
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
                      No users found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {r.name}
                      </td>

                      <td className="px-4 py-3">{r.email}</td>

                      <td className="px-4 py-3">
                        <Badge>{r.role}</Badge>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          tone={
                            r.status === "Active" ? "good" : "warn"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">{r.lastLogin}</td>

                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            View
                          </button>

                          <button className="text-slate-600 hover:text-slate-900 font-medium">
                            Edit
                          </button>

                          <button className="text-red-600 hover:text-red-800 font-medium">
                            Disable
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