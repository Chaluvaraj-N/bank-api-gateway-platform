import React from "react";
import { EnterpriseLayout } from "@shared/components/layout/EnterpriseLayout";

export function LoginPage() {
  return (
    <EnterpriseLayout
      rightPanel={
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="font-semibold text-slate-900">Security</div>
            <div className="text-sm text-slate-500 mt-1">Mock sign-in for UI preview.</div>
          </div>
        </div>
      }
    >
      <div className="p-5 md:p-6">
        <div className="max-w-md mx-auto">
          <div className="text-slate-900 text-2xl font-bold">Welcome back</div>
          <div className="text-slate-500 text-sm mt-1">Sign in to your banking admin console.</div>

          <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@bank.com"
            />

            <label className="text-sm font-semibold text-slate-700 mt-4 block">Password</label>
            <input
              type="password"
              className="mt-2 w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />

            <button className="mt-5 w-full px-4 py-2 rounded-lg bg-[#2563eb] text-white font-semibold hover:bg-[#1d4ed8]">
              Sign in
            </button>

            <div className="text-xs text-slate-500 mt-3">UI only — no backend integration yet.</div>
          </div>
        </div>
      </div>
    </EnterpriseLayout>
  );
}


