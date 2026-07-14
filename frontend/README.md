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

