$ErrorActionPreference = "Stop"

# Create frontend/ React enterprise structure (idempotent)
$base = "frontend"

$dirs = @(
  "$base",
  "$base/.github",
  "$base/public",
  "$base/src",
  "$base/src/app",
  "$base/src/app/api",
  "$base/src/app/components",
  "$base/src/app/layouts",
  "$base/src/app/routes",
  "$base/src/app/security",
  "$base/src/app/state",
  "$base/src/app/styles",
  "$base/src/app/types",
  "$base/src/app/utils",
  "$base/src/domain",
  "$base/src/domain/models",
  "$base/src/domain/services",
  "$base/src/domain/repositories",
  "$base/src/domain/events",
  "$base/src/features",
  "$base/src/features/auth",
  "$base/src/features/auth/components",
  "$base/src/features/auth/pages",
  "$base/src/features/auth/hooks",
  "$base/src/features/auth/state",
  "$base/src/features/auth/services",
  "$base/src/features/auth/types",
  "$base/src/features/audit",
  "$base/src/features/audit/components",
  "$base/src/features/audit/pages",
  "$base/src/features/audit/state",
  "$base/src/features/gateway",
  "$base/src/features/gateway/components",
  "$base/src/features/gateway/pages",
  "$base/src/features/gateway/state",
  "$base/src/features/gateway/services",
  "$base/src/features/identity",
  "$base/src/features/identity/components",
  "$base/src/features/identity/pages",
  "$base/src/features/identity/state",
  "$base/src/features/monitoring",
  "$base/src/features/monitoring/components",
  "$base/src/features/monitoring/pages",
  "$base/src/features/monitoring/state",
  "$base/src/features/orgs",
  "$base/src/features/orgs/components",
  "$base/src/features/orgs/pages",
  "$base/src/features/orgs/state",
  "$base/src/features/policies",
  "$base/src/features/policies/components",
  "$base/src/features/policies/pages",
  "$base/src/features/policies/state",
  "$base/src/features/policies/services",
  "$base/src/features/roles",
  "$base/src/features/roles/components",
  "$base/src/features/roles/pages",
  "$base/src/features/roles/state",
  "$base/src/features/users",
  "$base/src/features/users/components",
  "$base/src/features/users/pages",
  "$base/src/features/users/state",
  "$base/src/features/workflows",
  "$base/src/features/workflows/components",
  "$base/src/features/workflows/pages",
  "$base/src/features/workflows/state",
  "$base/src/shared",
  "$base/src/shared/components",
  "$base/src/shared/components/forms",
  "$base/src/shared/components/layout",
  "$base/src/shared/components/table",
  "$base/src/shared/components/navigation",
  "$base/src/shared/components/feedback",
  "$base/src/shared/hooks",
  "$base/src/shared/lib",
  "$base/src/shared/lib/http",
  "$base/src/shared/lib/storage",
  "$base/src/shared/lib/telemetry",
  "$base/src/shared/lib/validators",
  "$base/src/shared/models",
  "$base/src/shared/state",
  "$base/src/shared/state/middleware",
  "$base/src/shared/state/slices",
  "$base/src/shared/styles",
  "$base/src/shared/types",
  "$base/src/shared/utils",
  "$base/src/styles",
  "$base/src/styles/theme",
  "$base/src/widgets",
  "$base/src/widgets/admin",
  "$base/src/widgets/admin/components",
  "$base/src/widgets/admin/pages",
  "$base/src/widgets/dashboard",
  "$base/src/widgets/dashboard/components",
  "$base/src/widgets/dashboard/pages",
  "$base/src/widgets/settings",
  "$base/src/widgets/settings/components",
  "$base/src/widgets/settings/pages",
  "$base/src/tests",
  "$base/src/tests/unit",
  "$base/src/tests/integration",
  "$base/src/tests/e2e"
)

foreach ($d in $dirs) {
  if (-not (Test-Path -LiteralPath $d)) {
    New-Item -ItemType Directory -Path $d | Out-Null
  }
}

# Root-level scaffolding files
$files = @{}

$files["$base/package.json"] = @'
{
  "name": "bank-api-gateway-frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "typecheck": "tsc -b --pretty false"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.55.0",
    "@tanstack/react-table": "^8.19.3",
    "@reduxjs/toolkit": "^2.5.1",
    "axios": "^1.7.9",
    "clsx": "^2.1.1",
    "dayjs": "^1.11.13",
    "formik": "^2.4.6",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "react-router-dom": "^6.26.2",
    "react-toastify": "^10.0.6",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@eslint/js": "^9.8.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.8.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.8.0",
    "typescript": "^5.6.3",
    "typescript-eslint": "^8.7.0",
    "vite": "^5.4.2",
    "vitest": "^2.0.5"
  }
}
'@

$files["$base/tsconfig.json"] = @'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
'@

$files["$base/tsconfig.app.json"] = @'
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "types": ["vitest/globals"],
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@domain/*": ["src/domain/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"],
      "@widgets/*": ["src/widgets/*"]
    }
  },
  "include": ["src"]
}
'@

$files["$base/tsconfig.node.json"] = @'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.*", "vitest.config.*"]
}
'@

$files["$base/vite.config.ts"] = @'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  }
});
'@

$files["$base/index.html"] = @'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bank API Gateway - Admin Console</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@

$files["$base/src/main.tsx"] = @'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@app/layouts/AppProviders";
import { AppRoutes } from "@app/routes/AppRoutes";
import "@styles/theme/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);
'@

$files["$base/src/app/layouts/AppProviders.tsx"] = @'
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@shared/lib/telemetry/toastProvider";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } }
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider />
      {children}
    </QueryClientProvider>
  );
}
'@

$files["$base/src/app/routes/AppRoutes.tsx"] = @'
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@features/auth/pages/LoginPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
'@

$files["$base/src/app/api/client.ts"] = @'
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  timeout: 30000
});
'@

$files["$base/src/app/security/Authz.ts"] = @'
export type Permission =
  | "org:read"
  | "user:read"
  | "role:read"
  | "policy:read"
  | "policy:write"
  | "audit:read";

export function hasPermission(perms: Permission[], p: Permission) {
  return perms.includes(p);
}
'@

$files["$base/src/app/components/AppShell.tsx"] = @'
import React from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        Bank API Gateway Admin Console
      </header>
      <main style={{ flex: 1, padding: 16 }}>{children}</main>
      <footer style={{ padding: 16, borderTop: "1px solid #eee" }}>
        © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
'@

$files["$base/src/features/auth/pages/LoginPage.tsx"] = @'
import React from "react";
import { AppShell } from "@app/components/AppShell";

export function LoginPage() {
  return (
    <AppShell>
      <h1>Login</h1>
      <p>Enterprise Auth flow placeholder.</p>
    </AppShell>
  );
}
'@

$files["$base/src/shared/lib/telemetry/toastProvider.tsx"] = @'
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ToastProvider() {
  return <ToastContainer position="top-right" autoClose={3500} hideProgressBar />;
}
'@

$files["$base/src/styles/theme/global.css"] = @'
:root {
  --bg: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --brand: #2563eb;
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
}
'@

$files["$base/.eslintrc.cjs"] = @'
/* eslint-env node */
module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 2024, sourceType: "module" },
  plugins: ["react-hooks", "react-refresh"],
  extends: ["eslint:recommended"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-refresh/only-export-components": "warn"
  },
  settings: { react: { version: "detect" } }
};
'@

$files["$base/vitest.config.ts"] = @'
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: []
  }
});
'@

$files["$base/.github/workflows/ci.yml"] = @'
name: frontend-ci

on:
  push:
    branches: ["**"]
  pull_request:

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
        working-directory: frontend
      - run: npm run typecheck
        working-directory: frontend
      - run: npm run test -- --run
        working-directory: frontend
'@

foreach ($path in $files.Keys) {
  $content = $files[$path]
  $dir = Split-Path -Parent $path
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
  if (-not (Test-Path -LiteralPath $path)) {
    $content | Out-File -Encoding utf8 $path
  }
}

# Additional enterprise-style placeholders
$placeholders = @(
  "$base/src/app/state/README.md",
  "$base/src/app/utils/README.md",
  "$base/src/domain/README.md",
  "$base/src/shared/README.md",
  "$base/src/features/README.md",
  "$base/src/widgets/README.md",
  "$base/src/tests/README.md",
  "$base/src/app/routes/README.md",
  "$base/src/shared/state/README.md",
  "$base/src/shared/lib/http/README.md",
  "$base/src/shared/lib/storage/README.md",
  "$base/src/shared/lib/telemetry/README.md"
)

$phContent = @'
# Placeholder

This directory is reserved for production-ready enterprise patterns:
- boundaries (app/domain/shared)
- reusable UI and hooks
- state management and middleware
- typed HTTP client, caching, and telemetry
'@

foreach ($f in $placeholders) {
  if (-not (Test-Path -LiteralPath $f)) {
    $phContent | Out-File -Encoding utf8 $f
  }
}

# Frontend README
$frontReadme = @'
# Frontend (React Enterprise)

This folder contains the Admin Console frontend for Bank API Gateway.

## Architecture (suggested)
- **app/**: application composition (routing, providers, shell)
- **domain/**: business logic contracts (models, services, repositories)
- **features/**: feature slices (auth, gateway, policies, etc.)
- **widgets/**: higher-level page constructs (dashboard, admin area)
- **shared/**: reusable cross-cutting UI, hooks, http client, telemetry

## Conventions
- TypeScript strict mode
- React Router v6
- TanStack Query for server state
- Redux Toolkit reserved for complex client state (optional extension)

'@

$readmePath = Join-Path $base "README.md"
if (-not (Test-Path -LiteralPath $readmePath)) {
  $frontReadme | Out-File -Encoding utf8 $readmePath
}

Write-Host "frontend/ enterprise React structure created (idempotent)."
Write-Host "Next: cd frontend && npm ci && npm run dev"

