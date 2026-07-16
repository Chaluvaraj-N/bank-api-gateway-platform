import React from "react";
import { useNavigate } from "react-router-dom";
import { SidebarNav } from "@shared/components/navigation/SidebarNav";

export function EnterpriseLayout({ children, rightPanel }) {
  const navigate = useNavigate();

  const userEmail =
    localStorage.getItem("user") || "admin@bank.com";

  const initials = userEmail
    .charAt(0)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col bg-[#0b1f3b] text-white">
          <div className="h-16 px-6 flex items-center font-semibold tracking-wide border-b border-white/10">
            Bank API Gateway
          </div>

          <SidebarNav />
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0b1f3b] text-white flex items-center justify-center font-bold">
                B
              </div>

              <div>
                <div className="text-slate-900 font-semibold">
                  Admin Console
                </div>

                <div className="text-slate-500 text-sm">
                  Enterprise Banking API Gateway
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500" />
                System Online
              </div>

              <div className="hidden md:block text-right">
                <div className="text-sm font-semibold text-slate-900">
                  {userEmail}
                </div>

                <div className="text-xs text-slate-500">
                  Administrator
                </div>
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold">
                {initials}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-4 md:p-6">
            <div className="max-w-[1400px] mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
                <main className="bg-white rounded-xl border border-slate-200 shadow-sm">
                  {children}
                </main>

                <aside className="hidden xl:block">
                  {rightPanel}
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}