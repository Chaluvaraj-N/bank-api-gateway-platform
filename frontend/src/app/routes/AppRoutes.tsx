import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "@features/auth/pages/LoginPage";

import DashboardPage from "@features/dashboard/pages/DashboardPage";
import ApiCatalogPage from "@features/apiCatalog/pages/ApiCatalogPage";
import ApiLifecyclePage from "@features/apiLifecycle/pages/ApiLifecyclePage";
import ApiVersionsPage from "@features/apiVersions/pages/ApiVersionsPage";

import GatewayRoutesPage from "@features/gatewayRoutes/pages/GatewayRoutesPage";

import AnalyticsPage from "@features/analytics/pages/AnalyticsPage";
import MonitoringPage from "@features/monitoring/pages/MonitoringPage";

import ApplicationsPage from "@features/applications/pages/ApplicationsPage";
import SubscriptionsPage from "@features/subscriptions/pages/SubscriptionsPage";

import OrganizationsPage from "@features/organizations/pages/OrganizationsPage";
import UsersPage from "@features/users/pages/UsersPage";
import RolesPage from "@features/roles/pages/RolesPage";

import ProtectedRoute from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* API Management */}
      <Route
        path="/api/catalog"
        element={
          <ProtectedRoute>
            <ApiCatalogPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/api/lifecycle"
        element={
          <ProtectedRoute>
            <ApiLifecyclePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/api/versions"
        element={
          <ProtectedRoute>
            <ApiVersionsPage />
          </ProtectedRoute>
        }
      />

      {/* Gateway */}
      <Route
        path="/gateway/routes"
        element={
          <ProtectedRoute>
            <GatewayRoutesPage />
          </ProtectedRoute>
        }
      />

      {/* Consumers */}
      <Route
        path="/consumers/applications"
        element={
          <ProtectedRoute>
            <ApplicationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/consumers/subscriptions"
        element={
          <ProtectedRoute>
            <SubscriptionsPage />
          </ProtectedRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics/overview"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics/monitoring"
        element={
          <ProtectedRoute>
            <MonitoringPage />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/settings/organizations"
        element={
          <ProtectedRoute>
            <OrganizationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/users-roles"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <RolesPage />
          </ProtectedRoute>
        }
      />

      {/* Root */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}