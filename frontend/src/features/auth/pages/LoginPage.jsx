import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@bank.com");
  const [password, setPassword] = useState("admin123");

const handleLogin = (e) => {
  e.preventDefault();

  localStorage.setItem("token", "demo-token");
  localStorage.setItem("user", email);

  navigate("/dashboard");
};

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2">
        
        {/* Left Side */}
        <div className="bg-[#0b1f3b] text-white p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-xl bg-white text-[#0b1f3b] flex items-center justify-center">
              <Shield size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Bank API Gateway
              </h1>

              <p className="text-slate-300 text-sm">
                Enterprise Management Console
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Shield size={18} />
              </div>

              <div>
                <h3 className="font-semibold">
                  Secure Access Control
                </h3>

                <p className="text-sm text-slate-300">
                  Role based enterprise authentication.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Lock size={18} />
              </div>

              <div>
                <h3 className="font-semibold">
                  API Governance
                </h3>

                <p className="text-sm text-slate-300">
                  Manage APIs, policies and lifecycle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-bold text-slate-900">
              Sign In
            </h2>

            <p className="text-slate-500 mt-2">
              Access the Bank API Gateway platform.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@bank.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-3 rounded-lg transition"
              >
                Login
              </button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm text-slate-600">
                Demo Credentials
              </p>

              <p className="text-sm font-medium text-slate-800 mt-1">
                admin@bank.com
              </p>

              <p className="text-sm font-medium text-slate-800">
                admin123
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}