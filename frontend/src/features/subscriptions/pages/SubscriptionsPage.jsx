import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";

const rows = [
  { sub: "sub_1042", application: "MobileBank", api: "Payments API", plan: "Premium", status: "Active", quota: "5M calls/mo" },
  { sub: "sub_8831", application: "CoreBanking", api: "Accounts API", plan: "Enterprise", status: "Active", quota: "12M calls/mo" },
  { sub: "sub_2210", application: "PartnerAPI", api: "Fraud API", plan: "Standard", status: "Active", quota: "2M calls/mo" },
  { sub: "sub_9911", application: "LedgerSync", api: "Cards API", plan: "Standard", status: "Paused", quota: "1M calls/mo" },
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

export default function SubscriptionsPage() {
  const analyticsOverview = [
    { label: "Total Subscriptions", value: "612" },
    { label: "Active", value: "538" },
    { label: "Paused", value: "74" },
    { label: "Quota Utilization", value: "61.2%" },
  ];

  const systemHealth = [
    { label: "Subscription Engine", value: "Healthy", status: "good" },
    { label: "Quota Enforcer", value: "Healthy", status: "good" },
    { label: "Billing", value: "Stable", status: "good" },
    { label: "Notifications", value: "Healthy", status: "good" },
  ];

  return (
    <EnterpriseLayout rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}>
      <div className="p-5 md:p-6">
        <div className="text-slate-900 text-xl font-bold">Subscriptions</div>
        <div className="text-slate-500 text-sm mt-1">API subscription entitlements, plans, and quota controls.</div>

        <div className="mt-5 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="font-semibold text-slate-900">Entitlement Ledger</div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                placeholder="Search subscriptions..."
                className="w-full sm:w-64 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
                Create Subscription
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Subscription",
                    "Application",
                    "API",
                    "Plan",
                    "Status",
                    "Quota",
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
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.sub}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap font-semibold">{r.application}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.api}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.plan}</td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">
                      <Badge tone={r.status === "Active" ? "good" : "warn"}>{r.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.quota}</td>
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

