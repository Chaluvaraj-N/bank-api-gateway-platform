# bank-api-gateway-platform
 Bank API Gateway
Enterprise API Management & Gateway Platform

A full-stack enterprise-grade API Gateway and API Management platform built with FastAPI, React, MySQL, SQLAlchemy, JWT Authentication, and RBAC.

The platform enables organizations to publish, secure, monitor, and govern APIs while providing centralized access control, lifecycle management, analytics, and consumer onboarding.

Overview

Modern banking systems expose hundreds of APIs for payments, accounts, cards, fraud detection, customer onboarding, and third-party integrations.

This project provides a centralized platform to:

Manage API catalogs
Control API lifecycle
Configure gateway routes
Manage consumers and subscriptions
Enforce RBAC security
Monitor traffic and performance
Manage organizations and users
Generate analytics and operational insights
Features
Authentication & Authorization
Login & Logout
JWT-based authentication
Protected routes
Role-Based Access Control (RBAC)
Secure session management
API Management
API Catalog
API Version Management
API Lifecycle Management
API Publishing Workflow
API Governance Controls
Gateway Management
Route Configuration
Traffic Management
Security Policies
Request Routing
API Exposure Controls
Consumer Management
Application Registration
Subscription Management
Consumer Access Tracking
Usage Monitoring
Organization Management
Organization Directory
Multi-tenant Support
Organizational Access Controls
User Management
User Administration
Role Assignment
Access Control
Account Management
Analytics & Monitoring
API Usage Analytics
Traffic Insights
Gateway Health Monitoring
Operational Metrics
System Status Dashboard
System Architecture
┌──────────────────────────┐
│       React Frontend     │
│  Enterprise Admin Portal │
└────────────┬─────────────┘
             │ REST API
             ▼
┌──────────────────────────┐
│       FastAPI Backend    │
│ Authentication & RBAC    │
│ API Management Services  │
│ Gateway Services         │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│         MySQL DB         │
│ Users, Roles, APIs,      │
│ Organizations, Routes    │
└──────────────────────────┘
Technology Stack
Frontend
React
React Router
Axios
Tailwind CSS
Recharts
Lucide React
Vite
Backend
FastAPI
SQLAlchemy
Pydantic
Uvicorn
JWT Authentication
Database
MySQL
DevOps
GitHub Actions
Docker Ready
CI/CD Ready
Project Structure
bank-api-gateway
│
├── backend
│   ├── api
│   ├── apps
│   ├── db
│   ├── services
│   ├── schemas
│   └── main.py
│
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── features
│   │   ├── shared
│   │   └── routes
│   │
│   └── package.json
│
├── docs
├── .github
└── README.md
Core Modules
Dashboard

Enterprise operational overview including:

Total APIs
Organizations
Users
Roles
Gateway Routes
System Health
API Catalog

Manage:

Published APIs
Draft APIs
API Metadata
Ownership
Version History
API Lifecycle

Track:

Draft
Testing
Published
Deprecated
Gateway Routes

Manage:

Routing Rules
Endpoint Mapping
Traffic Flow
Applications

Manage:

Client Applications
Consumer Credentials
Access Plans
Organizations

Manage:

Banking Organizations
Tenant Isolation
Enterprise Access
Users & Roles

Manage:

Administrators
Operators
Auditors
Approvers
Analytics

Track:

API Usage
Traffic Volume
Latency
Error Rates
Throughput
Monitoring

Monitor:

Service Health
Gateway Nodes
System Availability
Uptime
Installation
Backend
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn main:app --reload

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs

Frontend
cd frontend

npm install

npm run dev

Frontend:

http://localhost:5173
Demo Credentials
Email:
admin@bank.com

Password:
admin123
Security Features
JWT Authentication
RBAC Authorization
Protected Routes
Secure API Access
Session Management
Audit-Ready Design
Future Enhancements
OAuth2 Integration
OpenAPI Import/Export
API Rate Limiting
API Monetization
Webhooks
Audit Logging
Multi-Factor Authentication
Kubernetes Deployment
Service Mesh Integration
Real-Time Monitoring
Learning Outcomes

This project demonstrates:

React Application Development
FastAPI Backend Development
REST API Design
JWT Authentication
RBAC Implementation
SQL Database Design
Enterprise UI Architecture
API Gateway Concepts
Full Stack Integration
Software Architecture Principles
Author

Chaluva Shetty

Full Stack Developer

Project Status
Frontend     █████████░ 90%
Backend      ██████░░░░ 60%
Database     ███████░░░ 70%
Overall      ████████░░ 80%

Current Status: Functional Enterprise API Gateway Prototype with Authentication, Dashboard, API Management, Consumer Management, Analytics, Monitoring, and Administrative Modules.
