# UnclePotHole Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-07

## Active Technologies

- **Language**: TypeScript
- **Mobile Framework**: React Native (Expo SDK ~52, Expo Go)
- **Styling**: NativeWind v4.2.x (Tailwind CSS for React Native)
- **Navigation**: Expo Router (file-based routing)
- **Maps**: react-native-maps (built into Expo Go)
- **Backend**: Express.js (Node.js 18+)
- **Database**: MongoDB 7.0+ (Mongoose ODM)
- **ML**: TensorFlow.js (`@tensorflow/tfjs-node`) — Google Teachable Machine exported model (MobileNet-based)
- **Geo**: @turf/boolean-point-in-polygon
- **Auth**: JWT (jsonwebtoken + bcrypt)

## Project Structure

```text
backend/
├── src/
│   ├── models/          # Mongoose schemas (User, Report, Riding)
│   ├── routes/          # Express route handlers
│   ├── services/        # Business logic (points, riding lookup, ML)
│   ├── ml/              # TensorFlow model loading + inference
│   ├── data/            # Seed data (Toronto ridings GeoJSON)
│   └── config/          # DB connection, env vars, constants
├── package.json
└── server.js

mobile/
├── app/                 # Expo Router file-based routing
│   ├── (auth)/          # Registration & sign-in screens
│   ├── (tabs)/          # Tab navigator (map, leaderboard, profile)
│   └── report/          # Report submission flow
├── components/          # Reusable UI components
├── services/            # API client, auth state, location utils
├── constants/           # Colors, categories, riding list
├── types/               # TypeScript types
└── tailwind.config.js

specs/001-pothole-civic-reporter/
├── spec.md, plan.md, research.md, data-model.md
├── quickstart.md
└── contracts/api.md
```

## Commands

```bash
# Backend
cd backend && npm run dev          # Start Express with nodemon
node src/data/seed-ridings.js      # Seed Toronto riding boundaries
node src/data/seed-demo.js         # Seed demo users and reports

# Mobile
cd mobile && npx expo start        # Start Expo dev server
npx expo start --clear             # Start with clean Metro cache

# Testing
cd backend && npm test             # Jest + Supertest
cd mobile && npm test              # Jest + React Native Testing Library
```

## Code Style

- **TypeScript**: Strict mode, no `any` unless unavoidable
- **Formatting**: Prettier (single quotes, no semicolons, trailing commas)
- **Linting**: ESLint with `@typescript-eslint` + Expo config
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files
- **NativeWind**: Use `className` prop with Tailwind classes, avoid inline `style` objects
- **Mongoose**: Define schemas with TypeScript interfaces, use `timestamps: true`
- **Express routes**: Thin controllers, business logic in services, validation via middleware
- **File length**: SHOULD stay under 300 lines (Constitution Principle I)
- **Nesting**: Max 3 levels deep (Constitution Principle II)

## Recent Changes

- **001-pothole-civic-reporter**: Initial feature — React Native mobile app for reporting potholes/civic issues in Toronto, scoped by MP/MPP riding. Full-screen map interface, per-riding leaderboard, personal profile. Google Teachable Machine exported model for pothole classification (confidence 0–100). UI design imported from Google Stitch. Images stored in MongoDB, not displayed in UI.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
