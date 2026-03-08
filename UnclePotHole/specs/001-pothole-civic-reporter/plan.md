# Implementation Plan: Pothole & Civic Issue Reporter

**Branch**: `001-pothole-civic-reporter` | **Date**: 2026-03-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-pothole-civic-reporter/spec.md`

## Summary

A React Native mobile app (Expo Go) that lets Toronto residents report potholes and civic issues by uploading photos, which are stored in MongoDB and classified by a pre-trained TensorFlow model exported from Google Teachable Machine (pothole confidence score 0–100). Reports appear as pins on a full-screen map scoped to the user's registered MP/MPP riding. Users earn points for in-riding reports. The app features a per-riding leaderboard and personal performance profile to drive civic engagement. UI design is imported from Google Stitch.

## Technical Context

**Language/Version**: TypeScript (React Native)  
**Primary Dependencies**: React Native, Expo SDK (~52), NativeWind (Tailwind CSS for RN), React Navigation, react-native-maps, Expo ImagePicker, Expo Location, MongoDB (via Mongoose), Express.js (API server), TensorFlow.js (loading pre-trained Teachable Machine model for inference)  
**Storage**: MongoDB (documents + image binary via GridFS or Base64)  
**Testing**: Jest + React Native Testing Library (frontend), Jest + Supertest (API)  
**Target Platform**: iOS + Android via Expo Go  
**Project Type**: Mobile app + API backend  
**Performance Goals**: Map renders 50+ pins at 60fps, API responses < 500ms, TensorFlow inference < 3s per image  
**Constraints**: Expo Go compatibility (no native modules outside Expo SDK), images ≤ 10 MB  
**Scale/Scope**: City of Toronto (~25 MP ridings, ~25 MPP ridings), hundreds of users, thousands of reports

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Modularity | ✅ PASS | Mobile app split into screens/components/services, API split into routes/controllers/models. Clear boundaries. |
| II. Clean Code | ✅ PASS | ESLint + Prettier enforced. NativeWind provides consistent styling. TypeScript for type safety. |
| III. UX Consistency | ✅ PASS | NativeWind design tokens ensure unified styling. All states (loading, error, empty) handled per spec. |
| IV. Maintainability | ✅ PASS | Conventional Expo project structure. Minimal dependencies, each justified. Centralized config via env vars. |
| V. Rapid Development | ✅ PASS | Expo Go = instant dev builds, no native compilation. MongoDB = schema-flexible. NativeWind = fast styling. No security hardening. No complex deployment. |

**Gate result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-pothole-civic-reporter/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API endpoints)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # Mongoose schemas (User, Report, Riding)
│   ├── routes/          # Express route handlers
│   ├── services/        # Business logic (points, riding lookup, ML inference)
│   ├── ml/              # Teachable Machine model files + inference wrapper
│   ├── data/            # Seed data (Toronto ridings GeoJSON)
│   └── config/          # DB connection, env vars, constants
├── package.json
└── server.js            # Express entry point

mobile/
├── app/                 # Expo Router file-based routing
│   ├── (auth)/          # Registration & sign-in screens
│   ├── (tabs)/          # Main tab navigator
│   │   ├── map.tsx      # Full-screen map (primary interface)
│   │   ├── leaderboard.tsx
│   │   └── profile.tsx
│   └── report/          # Report submission flow
│       └── new.tsx
├── components/          # Reusable UI components
│   ├── MapPin.tsx
│   ├── PinPopup.tsx
│   ├── LeaderboardRow.tsx
│   ├── EmptyState.tsx
│   └── RidingPicker.tsx
├── services/            # API client, auth state, location utils
├── constants/           # Colors, categories, riding list
├── types/               # TypeScript type definitions
├── tailwind.config.js   # NativeWind config
├── app.json             # Expo config
└── package.json
```

**Structure Decision**: Mobile + API pattern (Option 3 variant). `mobile/` contains the Expo React Native app with file-based routing. `backend/` contains the Express.js API server with MongoDB. TensorFlow model runs server-side in `backend/src/ml/`.

## Complexity Tracking

> No constitution violations to justify.
