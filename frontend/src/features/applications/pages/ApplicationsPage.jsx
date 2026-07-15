import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";

const rows = [
  { app: "MobileBank", clientId: "cl_9a1f...", status: "Active", org: "Core Banking", plan: "Premium" },
  { app: "CoreBanking", clientId: "cl_3c2b...", status: "Active", org: "Core Banking", plan: "Enterprise" },
  { app: "PartnerAPI", clientId: "cl_12ff...", status: "Active", org: "Partner Network", plan: "Standard" },
  { app: "LedgerSync", clientId: "cl_8bb0...", status: "Paused", org: "Ledger Team", plan: "Standard" },
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

export default function ApplicationsPage() {
  const analyticsOverview = [
    { label: "Total Applications", value: "286" },
    { label: "Active Clients", value: "214" },
    { label: "Paused", value: "18" },
    { label: "Avg Provisioning", value: "2.1m" },
  ];

  const systemHealth = [
    { label: "Consumer Registry", value: "Healthy", status: "good" },
    { label: "Key Management", value: "Healthy", status: "good" },
    { label: "Provisioning", value: "Stable", status: "good" },
    { label: "Audit Writer", value: "Healthy", status: "good" },
  ];

  return (
    <EnterpriseLayout rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}>
      <div className="p-5 md:p-6">
        <div className="text-slate-900 text-xl font-bold">Applications</div>
        <div className="text-slate-500 text-sm mt-1">Clients and application identities that consume gateway APIs.</div>

        <div className="mt-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="font-semibold text-slate-900">Application Directory</div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                placeholder="Search applications..."
                className="w-full sm:w-64 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
                New Application
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Application",
                    "Client ID",
                    "Status",
                    "Organization",
                    "Plan",
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
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-semibold">{r.app}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.clientId}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                      <Badge tone={r.status === "Active" ? "good" : "warn"}>{r.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.org}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.plan}</td>
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

