# Eye Care Booking System - Backend

Node.js + Express + TypeScript REST API for the Eye Care appointment booking system.

## 🛠️ Tech Stack

- **Node.js >= 22.0.0** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **Jest** - Testing framework
- **ts-jest** - TypeScript preprocessor for Jest
- **ts-node-dev** - Development server with hot reload
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm (latest version)

### Installation

```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

API server runs on: **http://localhost:3001**

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Test coverage is configured to collect from all `src/**/*.{js,jsx,ts,tsx}` files and generates reports in the `coverage/` directory.

## 📁 Project Structure

```
src/
├── routes/                 # API route handlers
│   ├── index.ts           # Route aggregator
│   ├── health.routes.ts   # Health check endpoint
│   ├── appointments.routes.ts
│   ├── clinics.routes.ts
│   ├── opticians.routes.ts
│   ├── services.routes.ts
│   └── users.routes.ts
├── types/                  # TypeScript type definitions
│   └── shared.ts
├── utils/                  # Helper functions
│   ├── index.ts
│   └── logger.ts
├── seed_data/              # Initial seed data (read-only)
│   ├── seed_data_appointments.json
│   ├── seed_data_clinics.json
│   ├── seed_data_opticians.json
│   ├── seed_data_services.json
│   └── seed_data_users.json
├── app_data/               # Runtime data with updates (created/edited/deleted records)
└── index.ts                # Application entry point
```

## 🗃️ Data Storage (Important!)

This skeleton uses a file-based storage system with two key folders:

### seed_data/

Contains the **initial seed data** for development. These files should remain unchanged and serve as the default dataset.

### app_data/

Contains **runtime application data** that reflects any changes made during the application lifecycle:

- When records are **created**, **edited**, or **deleted**, the complete updated dataset is written to `app_data/`
- Files follow the naming convention: `app_data_<entity>.json` (e.g., `app_data_appointments.json`)

### How it Works

The provided utility functions in `src/utils/index.ts` implement a fallback mechanism:

1. **Reading Data** (`getFileData`):

   - First checks if an updated file exists in `app_data/`
   - If present, reads from `app_data/`
   - If not, falls back to the default `seed_data/` file

2. **Writing Data** (`addNewDataToFile`):
   - Creates or updates files in `app_data/`
   - Initializes from `seed_data/` if the `app_data/` file doesn't exist yet

This approach provides data persistence across server restarts during development without requiring a database.

## 📦 Available Scripts

| Script          | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start development server         |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start`     | Run production server            |
| `npm test`      | Run test suite with Jest         |
| `npm run clean` | Remove dist directory            |
