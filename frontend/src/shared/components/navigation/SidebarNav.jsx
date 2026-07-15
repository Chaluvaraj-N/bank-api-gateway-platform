import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Route,
  Shield,
  Users,
  CreditCard,
  BarChart3,
  Building2,
  KeyRound,
  Settings,
  FileText,
  Lock,
  Workflow,
  Database,
  ChevronRight,
} from "lucide-react";

const NavItem = ({ to, icon: Icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-6 py-3 rounded-r-xl transition-colors",
          isActive ? "bg-white/10 text-white" : "text-white/85 hover:text-white hover:bg-white/5",
        ].join(" ")
      }
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
};

const SectionTitle = ({ children }) => (
  <div className="px-6 pt-5 pb-2 text-[11px] uppercase tracking-wider text-white/50">
    {children}
  </div>
);

export function SidebarNav() {
  return (
    <nav className="flex-1 overflow-y-auto pb-6">
      <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

      <SectionTitle>API Management</SectionTitle>
      <NavItem to="/api/catalog" icon={BookOpen} label="API Catalog" />
      <NavItem to="/api/lifecycle" icon={Workflow} label="API Lifecycle" />
      <NavItem to="/api/versions" icon={ChevronRight} label="API Versions" />

      <SectionTitle>Gateway</SectionTitle>
      <NavItem to="/gateway/routes" icon={Route} label="Gateway Routes" />
      <NavItem to="/gateway/policies" icon={FileText} label="Policies" />
      <NavItem to="/gateway/security" icon={Shield} label="Security" />
      <NavItem to="/gateway/traffic" icon={BarChart3} label="Traffic Management" />

      <SectionTitle>Consumers</SectionTitle>
      <NavItem to="/consumers/applications" icon={Database} label="Applications" />
      <NavItem to="/consumers/subscriptions" icon={CreditCard} label="Subscriptions" />
      <NavItem to="/consumers/usage-quotas" icon={Lock} label="Usage & Quotas" />

      <SectionTitle>Analytics</SectionTitle>
      <NavItem to="/analytics/overview" icon={BarChart3} label="Analytics" />
      <NavItem to="/analytics/reports" icon={FileText} label="Reports" />
      <NavItem to="/analytics/monitoring" icon={KeyRound} label="Monitoring" />

      <SectionTitle>Settings</SectionTitle>
      <NavItem to="/settings/organizations" icon={Building2} label="Organizations" />
      <NavItem to="/settings/users-roles" icon={Users} label="Users & Roles" />
      <NavItem to="/settings/audit-logs" icon={Settings} label="Audit Logs" />
      <NavItem to="/settings/config" icon={Settings} label="Configuration" />
    </nav>
  );
}

