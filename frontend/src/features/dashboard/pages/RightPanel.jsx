import React from "react";
import { Activity, AlertTriangle, Cpu, ShieldCheck } from "lucide-react";

export function RightPanel({ analyticsOverview, systemHealth }) {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-slate-900">Analytics Overview</h3>
        </div>
        <div className="space-y-3">
          {analyticsOverview.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <div className="text-sm text-slate-600">{item.label}</div>
              <div className="text-sm font-semibold text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-slate-900">System Health</h3>
        </div>
        <div className="space-y-3">
          {systemHealth.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {item.status === "good" && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                {item.status === "warn" && <Cpu className="w-4 h-4 text-amber-600" />}
                {item.status === "bad" && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>{item.label}</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="text-sm text-slate-600">Tip</div>
        <div className="text-slate-900 font-semibold mt-1">Use the API Catalog to manage endpoints</div>
      </section>
    </div>
  );
}

