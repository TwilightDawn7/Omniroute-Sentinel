# OmniRoute Sentinel — Complete Project Context

## What We Are Building

AI-powered logistics intelligence system that:

* Detects disruptions (weather, traffic, accidents, geopolitical events)
* Verifies them using real-world APIs
* Maps risks to active shipments (trucks + ships)
* Suggests optimized rerouting decisions
* Goal: predict problems BEFORE they happen, not after

---

## Monorepo Structure

omniroute-sentinel/
├── apps/
│   ├── driver-app/ (PORT 3001 - COMPLETE)
│   └── admin-dashboard/ (PORT 3000 - IN PROGRESS)
├── packages/
│   ├── types/
│   ├── api/
│   └── ui/
├── services/
│   ├── backend/
│   └── ai-engine/
└── docs/
└── context.md

---

## Tech Stack

Frontend (Driver App):

* Next.js 15
* TypeScript
* Tailwind CSS v3
* Leaflet + react-leaflet
* lucide-react
* date-fns

Frontend (Admin Dashboard):

* Next.js 15
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Leaflet + react-leaflet

Backend (Phase 2):

* Node.js + Express
* MongoDB
* Redis (optional)

AI Layer (Phase 2):

* OpenAI / Gemini API
* NLP-based threat detection
* Verification engine

---

## DRIVER APP — COMPLETE

Port: 3001
Path: apps/driver-app/

Features:

* Interactive map with routes
* Blocked zones (red)
* Rerouted paths (green)
* Alerts panel
* Auto-refresh every 30 seconds
* No authentication required

APIs:

* /api/route-data
* /api/alerts
* /api/cities
* /api/reroute (placeholder)

---

## ADMIN DASHBOARD — IN PROGRESS

Port: 3000
Path: apps/admin-dashboard/

Must-have features:

* Global map showing all shipments
* Alerts panel
* Manual reroute button
* Sidebar navigation

Pages:

* Dashboard
* Shipments
* Alerts

---

## Data Flow

Phase 1 (Current):
Time-based logic → API Routes → Hooks → UI → Auto-refresh

Phase 2 (Future):
External APIs → AI Engine → Verification → Database → Backend → Frontend

---

## Environment Variables (Phase 2)

OPENAI_API_KEY=
MONGODB_URI=
WEATHER_API_KEY=
NEWS_API_KEY=

---

## Team Rules

* Do not push directly to main
* Use dev branch
* Create feature branches
* Use pull requests
* Keep data dynamic (no static hardcoding)

---

## Key Decisions

1. Using Next.js fullstack for faster development
2. Using OpenStreetMap (no API key required)
3. Manual reroute controlled by admin
4. No login for driver (use truck_id instead)
5. Using mock time-based data for predictability
