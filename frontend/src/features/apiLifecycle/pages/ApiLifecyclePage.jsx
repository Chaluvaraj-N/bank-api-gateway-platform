import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";
import { CheckCircle2, Clock, Shield, XCircle } from "lucide-react";

const cards = [
  { title: "Draft", desc: "APIs under design & schema review", icon: Clock, count: 24, tone: "bg-sky-50 border-sky-200" },
  { title: "Testing", desc: "Staging + contract validation", icon: Shield, count: 31, tone: "bg-amber-50 border-amber-200" },
  { title: "Published", desc: "Live endpoints available to consumers", icon: CheckCircle2, count: 92, tone: "bg-emerald-50 border-emerald-200" },
  { title: "Deprecated", desc: "Retiring endpoints with migration plan", icon: XCircle, count: 7, tone: "bg-rose-50 border-rose-200" },
];

const timeline = [
  { step: "1. Draft", to: "Review", status: "complete" },
  { step: "2. Testing", to: "Publish", status: "active" },
  { step: "3. Published", to: "Monitor", status: "upcoming" },
  { step: "4. Deprecated", to: "Archive", status: "upcoming" },
];

function MiniTable() {
  const rows = [
    { api: "Payments API", version: "v2", from: "Testing", to: "Published", actor: "API Ops", when: "Today 09:12" },
    { api: "Cards API", version: "v3", from: "Draft", to: "Testing", actor: "Cards Team", when: "Yesterday 16:34" },
    { api: "Fraud API", version: "v1", from: "Published", to: "Deprecated", actor: "Risk Ops", when: "Yesterday 11:10" },
    { api: "Accounts API", version: "v1", from: "Published", to: "Published", actor: "Core Banking", when: "Mon 08:22" },
  ];

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {[
              "API",
              "Version",
              "From",
              "To",
              "Actor",
              "When",
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
              <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.api}</td>
              <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.version}</td>
              <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.from}</td>
              <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.to}</td>
              <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.actor}</td>
              <td className="px-3 py-2 text-slate-700 whitespace-nowrap">{r.when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiLifecyclePage() {
  const analyticsOverview = [
    { label: "Lifecycle Coverage", value: "92%" },
    { label: "Contract Tests", value: "1,284" },
    { label: "Avg Approval Time", value: "3.2 days" },
    { label: "Draft Aging", value: "1.4 days" },
  ];

  const systemHealth = [
    { label: "Workflow Engine", value: "Healthy", status: "good" },
    { label: "Validator", value: "Healthy", status: "good" },
    { label: "Approval Queue", value: "Busy", status: "warn" },
    { label: "Audit Writer", value: "Healthy", status: "good" },
  ];

  return (
    <EnterpriseLayout rightPanel={<RightPanel analyticsOverview={analyticsOverview} systemHealth={systemHealth} />}>
      <div className="p-5 md:p-6">
        <div className="text-slate-900 text-xl font-bold">API Lifecycle</div>
        <div className="text-slate-500 text-sm mt-1">From draft to published: approvals, validation, and monitoring.</div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className={`rounded-xl border p-4 ${c.tone}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-slate-900 font-semibold">{c.title}</div>
                    <div className="text-sm text-slate-600 mt-1">{c.desc}</div>
                  </div>
                  <Icon className="w-5 h-5 text-slate-700" />
                </div>
                <div className="mt-3 text-2xl font-bold text-slate-900">{c.count}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-slate-900">Lifecycle Timeline</div>
                <div className="text-sm text-slate-500">Mock workflow stages</div>
              </div>
            </div>

            <div className="space-y-3">
              {timeline.map((t, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className={
                      t.status === "complete"
                        ? "w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center"
                        : t.status === "active"
                        ? "w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center"
                        : "w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center"
                    }
                  >
                    <div className="text-xs font-bold text-slate-900">{idx + 1}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{t.step}</div>
                    <div className="text-sm text-slate-500">Next: {t.to}</div>
                  </div>
                  <div className="text-xs font-semibold text-slate-600">
                    {t.status === "complete" ? "Done" : t.status === "active" ? "In Progress" : "Upcoming"}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="font-semibold text-slate-900">Governance</div>
            <div className="text-sm text-slate-500 mt-1">Enterprise controls for safe releases.</div>

            <div className="mt-4 space-y-3 text-sm">
              {[
                { k: "Contract validation", v: "Enabled" },
                { k: "Role-based approvals", v: "Required" },
                { k: "Deprecation policy", v: "Enforced" },
                { k: "Audit logging", v: "On" },
              ].map((x) => (
                <div key={x.k} className="flex items-center justify-between gap-3">
                  <div className="text-slate-600">{x.k}</div>
                  <div className="font-semibold text-slate-900">{x.v}</div>
                </div>
              ))}
            </div>

            <button className="mt-5 w-full px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
              Create Lifecycle Policy
            </button>
          </section>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="font-semibold text-slate-900">Recent Changes</div>
              <div className="text-sm text-slate-500">Mock workflow events</div>
            </div>
          </div>
          <MiniTable />
        </div>
      </div>
    </EnterpriseLayout>
  );
}

