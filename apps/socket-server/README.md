# 🔌 WebSocket Server (The Bridge)

**Part of the [OmniRoute Sentinel](../../README.md) Ecosystem.**

A low-latency event broker ensuring sub-second synchronizations between the Control Tower (Admin Dashboard) and all active Execution Layers (Driver Apps).

## ✨ Key Features
- **Sub-Second Sync:** Instantly broadcast location updates, dispatch commands, and threat alerts.
- **Bi-directional Communication:** Handles incoming telemetry from drivers and outgoing instructions from admins.
- **Scalable Architecture:** Built on robust WebSockets to support hundreds of concurrent active vehicles.

## 🚀 Getting Started

This application is a Node.js Express server utilizing Socket.io.

### Running Locally

If you're running the entire Turborepo ecosystem, this server starts automatically on port `4000`.

To run just this server:

```bash
npm install
npm run dev
```

The WebSocket endpoint will be available at `ws://localhost:4000`.

## 🛠️ Tech Stack
- Node.js
- Express
- Socket.io
- TypeScript
