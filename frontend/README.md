# Eye Care Booking System - Frontend

React + TypeScript application for the Eye Care appointment booking system.

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Ant Design** - UI component library
- **Tailwind CSS** - Utility-first styling
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities

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

Application runs on: **http://localhost:3000**

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🧪 Testing

Run tests in watch mode:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

Generate coverage report:

```bash
npm run test:coverage
```

## 📁 Project Structure

```
src/
├── components/
│   ├── molecules/          # Reusable UI components
│   │   ├── ActionBar.tsx
│   │   ├── Dropdown.tsx
│   │   ├── ExpandableText.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ProfileAvatar.tsx
│   │   ├── Search.tsx
│   │   └── ViewModal.tsx
│   ├── organisms/          # Complex composed components
│   │   ├── AppointmentConfirmed.tsx
│   │   ├── AppointmentTable.tsx
│   │   └── ProfilePicDescription.tsx
│   ├── Pages/              # Page-level components
│   │   ├── AppLayout.tsx
│   │   ├── Login.tsx
│   │   └── SharedComponents.tsx
│   └── Routes.tsx          # Route configuration
├── context/                # React Context providers
│   └── ConfigContext.tsx
├── services/               # API and utility services
│   ├── configService.ts
│   ├── index.ts
│   └── localstorage.ts
├── types/                  # TypeScript type definitions
│   ├── index.ts
│   └── shared.ts
├── utils/                  # Helper functions
│   └── crypto.ts
├── constants/              # Application constants
│   └── timeslots.ts
├── __tests__/              # Test utilities
│   └── test-utils.tsx
├── __mocks__/              # Mock implementations
│   ├── axios.ts
│   └── react-router-dom.tsx
├── App.tsx                 # Root component
└── main.tsx                # Application entry point
```

## 🎨 Available Components

### Molecules (Reusable UI)

- **ActionBar** - Action button container
- **Dropdown** - Custom select dropdown (Ant Design Select)
- **ExpandableText** - Text with expand/collapse functionality
- **LoadingSpinner** - Loading indicator
- **ProfileAvatar** - User avatar component
- **Search** - Search input component
- **ViewModal** - Reusable modal dialog

### Organisms (Complex Components)

- **AppointmentTable** - Display appointments in table format
- **AppointmentConfirmed** - Appointment confirmation view
- **ProfilePicDescription** - User profile with description

### Pages

- **AppLayout** - Main application layout with navigation
- **Login** - User authentication page
- **SharedComponents** - Common page-level components

## 🔧 Configuration

### Vite Config

Custom configuration in `vite.config.ts`:

- React plugin for JSX transform and Fast Refresh
- Tailwind CSS integration
- Dev server port: 3000

### TypeScript

- Strict mode enabled
- Path aliases configured
- React JSX support

### Testing

- Vitest configured with jsdom environment
- React Testing Library setup
- Mock providers in `__tests__/test-utils.tsx`

## 📝 Type Definitions

Shared types defined in `src/types/shared.ts`:

```typescript
// User roles
enum UserRole {
  Patient = 'patient',
  Optician = 'optician',
}

// Core entities
type User = { ... }
type Appointment = { ... }
type Clinic = { ... }
type Optician = { ... }
type Service = { ... }
```

## 📦 Available Scripts

| Script                  | Description                   |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Start development server      |
| `npm run build`         | Build for production          |
| `npm run preview`       | Preview production build      |
| `npm test`              | Run tests in watch mode       |
| `npm run test:ui`       | Run tests with Vitest UI      |
| `npm run test:coverage` | Generate test coverage report |

## 🌐 Backend Integration

The frontend is designed to work with the backend API running on `http://localhost:3001`.

Make sure the backend server is running before starting frontend development.

See backend documentation for available API endpoints.
