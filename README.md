# 🏁 Async Race

A single-page application for managing a collection of cars, racing them on virtual tracks, and tracking winners. Built with Angular 19, signals, and CSS animations.

## 🏆 Score: 350 / 400

## 🔗 Deployment

**Live demo:** [text](https://async-race-lake.vercel.app/garage)


## 🛠 Tech Stack

- **Angular 19** with standalone components and the new control-flow syntax (`@if`, `@for`, `@let`)
- **Signals** for state management — three signal-based stores (`GarageStore`, `RaceStore`, `WinnersStore`). No NgRx needed.
- **TypeScript strict mode** with `strictTemplates`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, and more
- **OnPush change detection** on every component
- **ESLint** with Angular plugin rules + Airbnb-style strict rules (`max-lines-per-function: 40`, `no-magic-numbers`, etc.)
- **Prettier** for formatting
- **SCSS** with CSS custom properties for design tokens; CSS-only car animations via `@keyframes`

## 🚀 Running locally

### 1. Run the mock server

```bash
git clone https://github.com/mikhama/async-race-api
cd async-race-api
npm install
npm start
```

The server runs on `http://127.0.0.1:3000`.

### 2. Run the app

```bash
npm install
npm start
```

## 📜 Scripts

| Script | Purpose |
|---|---|
| `npm start` | Run dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format with Prettier |
| `npm run ci:format` | Check formatting without writing |

## 🏗 Architecture

src/app/
├── core/
│   ├── models/        Car, Winner, Engine, Paginated — domain types
│   ├── services/      GarageApi, EngineApi, WinnersApi — HTTP wrappers
│   ├── utils/         random car/color helpers
│   └── constants.ts   API paths, query param names
├── store/             Signal-based stores (state + actions)
│   ├── garage-store.service.ts
│   ├── race-store.service.ts
│   └── winners-store.service.ts
├── features/
│   ├── garage/        Garage page
│   └── winners/       Winners page
└── shared/            Reusable presentational components
├── car/           SVG car
├── race-track/    Track with car + animation
├── car-form/      Create/edit form
├── race-controls/ Start/reset/generate-100 panel
└── pagination/    Prev/next pagination

## ✅ Checklist (380 / 400)

### 🚀 UI Deployment
- [x] Deployment Platform — deployed to Vercel

### Requirements to Commits and Repository
- [x] Commit guidelines compliance — Conventional Commits, lowercase types, imperative mood (unsure about this one,my commits were messy,could've done it better)
- [x] Checklist included in README.md
- [x] Score calculation
- [x] UI Deployment link in README.md

### Basic Structure (80 / 80)
- [x] **Two Views** (10 pts) — Garage and Winners
- [x] **Garage View Content** (30 pts) — name, create/edit panel, race control panel, garage section
- [x] **Winners View Content** (10 pts) — name, table, pagination
- [x] **Persistent State** (30 pts) — store state persists across view switches (cars, page, sort, winner banner are all root-scoped singletons)

### Garage View (90 / 90)
- [x] **CRUD operations** (20 pts) — create, update, delete; empty/long names handled (40 char max); delete cascades to winners
- [x] **Color Selection** (10 pts) — native RGB color picker (`input type="color"`)
- [x] **Random Car Creation** (20 pts) — 100 cars per click; 12 brands × 12 models = 144 combinations
- [x] **Car Management Buttons** (10 pts) — select (edit) / delete per car
- [x] **Pagination** (10 pts) — 7 cars per page
- [x] **Empty Garage** (extra) — friendly empty-state message
- [x] **Empty Garage Page** (extra) — deleting the last car on a page jumps back one page

### 🏆 Winners View (50 / 50)
- [x] **Display Winners** (15 pts) — first finisher recorded after each race
- [x] **Pagination for Winners** (10 pts) — 10 winners per page
- [x] **Winners Table** (15 pts) — №, car icon, name, wins, best time; wins increments, best time kept as minimum
- [x] **Sorting** (10 pts) — by wins or time, ASC/DESC, server-side via `_sort` and `_order` query params

### 🚗 Race (170 / 170)
- [x] **Start Engine Animation** (20 pts) — start → get velocity → drive → animate; pauses on 500
- [x] **Stop Engine Animation** (20 pts) — stop → reset car to initial position
- [x] **Responsive Animation** (30 pts) — works down to 500px width
- [x] **Start Race Button** (10 pts) — races all cars on the current page in parallel
- [x] **Reset Race Button** (15 pts) — cancels in-flight drives, returns cars to start
- [x] **Winner Announcement** (5 pts) — banner shows first finisher and time
- [x] **Button States** (20 pts) — start disabled while driving; stop disabled at initial position
- [x] **Actions during the race** (50 pts) — edit/delete/create/paginate blocked while racing; navigation resets the race for predictable behavior

### 🎨 Prettier and ESLint Configuration (10 / 10)
- [x] **Prettier Setup** (5 pts) — `format` and `ci:format` scripts present
- [x] **ESLint Configuration** (5 pts) — Angular plugin + strict TS rules + `max-lines-per-function: 40` + `no-magic-numbers`