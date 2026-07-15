import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@features/auth/pages/LoginPage";

import DashboardPage from "@features/dashboard/pages/DashboardPage";
import ApiCatalogPage from "@features/apiCatalog/pages/ApiCatalogPage";
import ApiLifecyclePage from "@features/apiLifecycle/pages/ApiLifecyclePage";
import ApiVersionsPage from "@features/apiVersions/pages/ApiVersionsPage";
import GatewayRoutesPage from "@features/gatewayRoutes/pages/GatewayRoutesPage";
import AnalyticsPage from "@features/analytics/pages/AnalyticsPage";
import ApplicationsPage from "@features/applications/pages/ApplicationsPage";
import SubscriptionsPage from "@features/subscriptions/pages/SubscriptionsPage";
import OrganizationsPage from "@features/organizations/pages/OrganizationsPage";
import UsersPage from "@features/users/pages/UsersPage";
import RolesPage from "@features/roles/pages/RolesPage";


export function AppRoutes() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardPage />} />

      <Route path="/api-catalog" element={<ApiCatalogPage />} />
      <Route path="/api-lifecycle" element={<ApiLifecyclePage />} />
      <Route path="/api-versions" element={<ApiVersionsPage />} />

      <Route path="/gateway-routes" element={<GatewayRoutesPage />} />

      <Route path="/applications" element={<ApplicationsPage />} />
      <Route path="/subscriptions" element={<SubscriptionsPage />} />

      <Route path="/analytics" element={<AnalyticsPage />} />

      <Route path="/organizations" element={<OrganizationsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/roles" element={<RolesPage />} />


      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

