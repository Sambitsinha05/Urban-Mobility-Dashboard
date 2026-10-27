# 🚦 Urban Mobility Analytics Dashboard

A **premium, real-time urban mobility command centre** built with React 19 + TypeScript + Vite. It visualises traffic corridors, transit lines, incidents, and congestion patterns across a city — complete with live telemetry simulation, scenario planning, and exportable reports.

---

## ✨ Features

| Module | Description |
|---|---|
| **Overview Dashboard** | KPI cards, congestion heatmap, top-corridor rankings, live status feed |
| **GIS Map View** | Interactive Leaflet / MapLibre GL map with corridor, transit-line & incident layers |
| **Analytics & Trends** | Chart.js powered time-series charts for speed, volume, and delay index |
| **Congestion & Incidents** | Log, categorise, and resolve traffic incidents with real-time corridor impact |
| **Scenario Planner** | Model infrastructure changes and forecast congestion outcomes |
| **Reports & Export** | Generate and download corridor / incident reports |
| **Live Telemetry** | Toggle a 5 s simulation loop that updates all corridor speeds and congestion scores |
| **Auth System** | Login / sign-up modal backed by a React Context auth provider |

---

## 🛠 Tech Stack

- **React 19** with TypeScript
- **Vite 8** (lightning-fast dev server + build)
- **Leaflet 1.9** + **react-leaflet 5** – tile-based interactive maps
- **MapLibre GL 6** – vector map rendering
- **Chart.js 4** + **react-chartjs-2 5** – rich analytics charts
- **Lucide React** – icon library
- **oxlint** – fast Rust-based linter
- Vanilla CSS with a custom dark-mode design system (glassmorphism, micro-animations)

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| npm | comes with Node |

### Install & Run

```bash
# 1. Clone / navigate to the project
cd "Urban Mobility Analytics Dashboard"

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```



### Other Scripts

```bash
npm run build    # Type-check + production bundle  → dist/
npm run preview  # Serve the production build locally
npm run lint     # Run oxlint static analysis
```

---

## 📁 Project Structure

```
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                    # App entry point
    ├── App.tsx                     # Root layout, routing, live simulation loop
    ├── index.css                   # Global design tokens & utility classes
    ├── App.css
    ├── components/
    │   ├── Navbar.tsx              # Top navigation bar
    │   ├── Sidebar.tsx             # View switcher sidebar
    │   ├── AuthModal.tsx           # Login / sign-up modal
    │   ├── OverviewDashboard.tsx   # Landing KPI & summary view
    │   ├── GISMapView.tsx          # Interactive map (Leaflet + MapLibre)
    │   ├── AnalyticsTrendsView.tsx # Chart.js analytics
    │   ├── CongestionIncidentsView.tsx  # Incident management
    │   ├── ScenarioPlannerView.tsx # What-if scenario modelling
    │   └── ReportsExportView.tsx   # Report generation & export
    ├── context/
    │   └── AuthContext.tsx         # Authentication + live-simulation state
    ├── data/
    │   └── mockData.ts             # Seed data for corridors, incidents, transit lines
    ├── types/
    │   └── index.ts                # Shared TypeScript interfaces & enums
    └── utils/
        └── mobilityMath.ts         # Congestion score calculations
```

---

## 🏗 Architecture Overview

```
AuthProvider (context)
└── ErrorBoundary
    └── DashboardContent
        ├── Navbar
        ├── Sidebar  ──────────── view switcher
        └── <active view>
            ├── OverviewDashboard
            ├── GISMapView          ← Leaflet map + MapLibre layers
            ├── AnalyticsTrendsView ← Chart.js
            ├── CongestionIncidentsView
            ├── ScenarioPlannerView
            └── ReportsExportView
```

Live telemetry runs as a `setInterval` inside `DashboardContent` (every **5 s**) and re-calculates speed, delay index, and congestion level for every corridor segment using `calculateCorridorCongestionScore`.

---

## 🗺 Congestion Levels

| Level | Score | Colour |
|---|---|---|
| Free Flow | 0 – 30 | 🟢 Green |
| Moderate | 31 – 65 | 🟡 Amber |
| Severe | 66 – 84 | 🟠 Orange |
| Gridlock | 85 – 100 | 🔴 Red |

---

## 🤝 Contributing

1. Fork the repo and create a feature branch.
2. Follow the existing TypeScript patterns and component structure.
3. Run `npm run lint` before opening a PR.
4. Keep new components in `src/components/` and shared logic in `src/utils/`.

---

## 📄 License

MIT — feel free to use, modify, and distribute.

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
