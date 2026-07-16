import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";
import { RightPanel } from "@features/dashboard/pages/RightPanel";
import {
  CheckCircle2,
  Clock,
  Shield,
  XCircle,
} from "lucide-react";

const cards = [
  {
    title: "Draft",
    desc: "APIs under design & schema review",
    icon: Clock,
    count: 24,
    tone: "bg-sky-50 border-sky-200",
  },
  {
    title: "Testing",
    desc: "Staging + contract validation",
    icon: Shield,
    count: 31,
    tone: "bg-amber-50 border-amber-200",
  },
  {
    title: "Published",
    desc: "Live endpoints available",
    icon: CheckCircle2,
    count: 92,
    tone: "bg-emerald-50 border-emerald-200",
  },
  {
    title: "Deprecated",
    desc: "Retiring endpoints",
    icon: XCircle,
    count: 7,
    tone: "bg-rose-50 border-rose-200",
  },
];

const timeline = [
  { step: "Draft", to: "Review", status: "complete" },
  { step: "Testing", to: "Publish", status: "active" },
  { step: "Published", to: "Monitor", status: "upcoming" },
  { step: "Deprecated", to: "Archive", status: "upcoming" },
];

function MiniTable() {
  const rows = [
    {
      api: "Payments API",
      version: "v2",
      from: "Testing",
      to: "Published",
      actor: "API Ops",
      when: "Today 09:12",
    },
    {
      api: "Cards API",
      version: "v3",
      from: "Draft",
      to: "Testing",
      actor: "Cards Team",
      when: "Yesterday 16:34",
    },
    {
      api: "Fraud API",
      version: "v1",
      from: "Published",
      to: "Deprecated",
      actor: "Risk Ops",
      when: "Yesterday 11:10",
    },
    {
      api: "Accounts API",
      version: "v1",
      from: "Published",
      to: "Published",
      actor: "Core Banking",
      when: "Mon 08:22",
    },
  ];

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {["API", "Version", "From", "To", "Actor", "When"].map((h) => (
              <th
                key={h}
                className="text-left px-3 py-2 font-semibold text-slate-700"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="px-3 py-2">{r.api}</td>
              <td className="px-3 py-2">{r.version}</td>
              <td className="px-3 py-2">{r.from}</td>
              <td className="px-3 py-2">{r.to}</td>
              <td className="px-3 py-2">{r.actor}</td>
              <td className="px-3 py-2">{r.when}</td>
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
    { label: "Avg Approval", value: "3.2 Days" },
    { label: "Draft Aging", value: "1.4 Days" },
  ];

  const systemHealth = [
    { label: "Workflow Engine", value: "Healthy", status: "good" },
    { label: "Validator", value: "Healthy", status: "good" },
    { label: "Approval Queue", value: "Busy", status: "warn" },
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
        <h1 className="text-2xl font-bold text-slate-900">
          API Lifecycle Management
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Govern APIs from design through retirement with approvals,
          validations and compliance controls.
        </p>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-sm text-slate-500">
              Published APIs
            </div>
            <div className="text-3xl font-bold text-emerald-600 mt-2">
              92
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-sm text-slate-500">
              Pending Approvals
            </div>
            <div className="text-3xl font-bold text-amber-600 mt-2">
              18
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-sm text-slate-500">
              Contract Tests
            </div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              1284
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="text-sm text-slate-500">
              Compliance Score
            </div>
            <div className="text-3xl font-bold text-indigo-600 mt-2">
              98%
            </div>
          </div>
        </div>

        {/* LIFECYCLE STAGES */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className={`rounded-xl border p-5 ${card.tone}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {card.title}
                    </h3>

                    <p className="text-sm text-slate-600 mt-1">
                      {card.desc}
                    </p>
                  </div>

                  <Icon className="w-5 h-5 text-slate-700" />
                </div>

                <div className="text-3xl font-bold mt-4 text-slate-900">
                  {card.count}
                </div>
              </div>
            );
          })}
        </div>

        {/* TIMELINE */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900">
            Lifecycle Workflow
          </h2>

          <div className="mt-5 space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    {item.step}
                  </div>

                  <div className="text-sm text-slate-500">
                    Next: {item.to}
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-600">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT CHANGES */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">
              Recent Lifecycle Changes
            </h2>

            <button className="text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>

          <MiniTable />
        </div>
      </div>
    </EnterpriseLayout>
  );
}