<div align="center">
  <img src="public/logo.png" alt="Driver App Logo" width="120" />
</div>

# 🚛 Driver App (The Execution Layer)

**Part of the [OmniRoute Sentinel](../../README.md) Ecosystem.**

A minimal, map-focused UI explicitly designed for on-the-road execution. This application acts as the live driver portal that seamlessly communicates with the Control Tower.

## ✨ Key Features
- **Live Telemetry:** Streams real-time GPS coordinates directly to the Control Tower.
- **Instant Updates:** AI rerouting overrides immediately ping the driver's interface over WebSockets.
- **Focus Mode:** Minimalist design to prevent distractions while providing essential navigation data.

## 🚀 Getting Started

This application is built with Next.js (App Router).

### Running Locally

If you're running the entire Turborepo ecosystem, this app starts automatically on `http://localhost:3001`.

To run just this app:

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result. Type any vehicle ID to start driving!

## 🛠️ Tech Stack
- Next.js (App Router)
- React 19
- Tailwind CSS
- Zustand (State Management)
- Leaflet (Maps)
- Socket.io Client
