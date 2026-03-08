# Tasks: Pothole & Civic Issue Reporter

**Input**: Design documents from `/specs/001-pothole-civic-reporter/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Not explicitly requested — test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Includes exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize both projects, install dependencies, configure tooling

- [x] T001 Create backend project structure with `npm init` and install dependencies (express, mongoose, cors, dotenv, jsonwebtoken, bcrypt, multer, sharp, @tensorflow/tfjs-node, @turf/boolean-point-in-polygon) in `backend/package.json`
- [x] T002 Create mobile project with `npx create-expo-app` (Expo SDK ~52, TypeScript template) and install dependencies (nativewind, tailwindcss, react-native-maps, expo-image-picker, expo-location, expo-secure-store, axios) in `mobile/package.json`
- [x] T003 [P] Configure ESLint + Prettier for backend in `backend/.eslintrc.js` and `backend/.prettierrc`
- [x] T004 [P] Configure NativeWind v4.2.x: create `mobile/tailwind.config.js`, `mobile/global.css`, update `mobile/babel.config.js` with nativewind/babel plugin, wrap Metro config with `withNativeWind` in `mobile/metro.config.js`
- [x] T005 [P] Create environment configuration files: `backend/.env` (MONGODB_URI, JWT_SECRET, PORT, ML_MODEL_PATH) and `mobile/.env` (API_URL) with `.env.example` templates for both
- [x] T006 [P] Create TypeScript type definitions in `mobile/types/index.ts` (User, Report, Riding, LeaderboardEntry, CategoryBreakdown, PaginatedResponse, AuthResponse)
- [x] T007 [P] Create shared constants in `mobile/constants/categories.ts` (issue category enum) and `mobile/constants/colors.ts` (design tokens from Google Stitch)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Set up MongoDB connection with Mongoose in `backend/src/config/db.ts` and create Express app entry point in `backend/server.ts` with CORS, JSON parsing, and error handling middleware
- [x] T009 Create Riding Mongoose schema in `backend/src/models/riding.ts` (name, type, slug, boundary GeoJSON Polygon, center GeoJSON Point) with indexes `{ boundary: "2dsphere" }` and `{ type: 1, name: 1 }`
- [x] T010 Create User Mongoose schema in `backend/src/models/user.ts` (displayName, email, passwordHash, ridingId ref, totalPoints, totalReports, timestamps) with indexes `{ email: 1 }` unique and `{ ridingId: 1, totalPoints: -1 }`
- [x] T011 Create Report Mongoose schema in `backend/src/models/report.ts` (userId, description, category enum, location GeoJSON Point, ridingId, image Buffer, imageMimeType, potholeScore, mlProcessed, pointsAwarded, status, timestamps) with indexes `{ location: "2dsphere" }`, `{ ridingId: 1, createdAt: -1 }`, `{ userId: 1, createdAt: -1 }`
- [x] T012 [P] Implement JWT auth middleware in `backend/src/middleware/auth.ts` — extract Bearer token, verify with jsonwebtoken, attach user to request
- [x] T013 [P] Implement file upload middleware using multer (memory storage, 10MB limit, JPEG/PNG filter) in `backend/src/middleware/upload.ts`
- [x] T014 [P] Create riding seed script in `backend/src/data/seed-ridings.ts` — load Toronto MP/MPP riding GeoJSON data from bundled files in `backend/src/data/ridings/` and upsert into MongoDB
- [x] T015 [P] Bundle Toronto riding GeoJSON data files (from Represent API) into `backend/src/data/ridings/` as static JSON (federal-ridings.json, provincial-ridings.json)
- [x] T016 [P] Set up Teachable Machine model: place exported model files (model.json, weights.bin, metadata.json) in `backend/src/ml/model/` and create model loader in `backend/src/ml/model-loader.ts` that loads with `tf.loadLayersModel`
- [x] T017 [P] Implement ML inference service in `backend/src/ml/classifier.ts` — accept image Buffer, preprocess (decode, resize 224×224, normalize [0,1], expandDims), run prediction, read metadata.json for class labels, return potholeScore 0–100
- [x] T018 [P] Implement riding lookup service in `backend/src/services/riding-service.ts` — given [lng, lat], use `@turf/boolean-point-in-polygon` to find which riding contains the point; fallback to MongoDB `$geoWithin` query
- [x] T019 [P] Create API client service in `mobile/services/api.ts` — Axios instance with base URL from env, interceptor to attach JWT from secure storage, typed request/response methods for all endpoints
- [x] T020 [P] Create auth state management in `mobile/services/auth.ts` — store/retrieve JWT via expo-secure-store, provide login/logout/register functions, expose auth context via React Context
- [x] T021 [P] Set up Expo Router file-based routing structure: create `mobile/app/_layout.tsx` (root layout importing global.css, wrapping with AuthProvider), `mobile/app/(auth)/_layout.tsx`, `mobile/app/(tabs)/_layout.tsx` (tab navigator with map, leaderboard, profile tabs)
- [x] T022 Create demo seed script in `backend/src/data/seed-demo.ts` — create sample users and reports across different ridings for development testing

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — User Registration & Riding Selection (Priority: P0) 🎯 MVP

**Goal**: New visitors can register with a display name, email, password, and select their Toronto MP/MPP riding. Returning users can sign in. App gates all features behind auth.

**Independent Test**: Register a new user, select a riding, confirm the app redirects to the map centered on that riding. Sign out and sign back in.

### Implementation for User Story 1

- [x] T023 [US1] Implement auth routes in `backend/src/routes/auth.ts` — POST /api/auth/register (validate inputs, hash password with bcrypt, create User with ridingId, return JWT + user) and POST /api/auth/login (verify email/password, return JWT + user)
- [x] T024 [US1] Implement ridings route in `backend/src/routes/ridings.ts` — GET /api/ridings (list all, exclude boundary polygon) and GET /api/ridings/:id (include boundary polygon)
- [x] T025 [US1] Register auth and ridings routes in `backend/server.ts` and verify endpoints work via manual curl testing
- [x] T026 [P] [US1] Create RidingPicker component in `mobile/components/riding-picker.tsx` — fetch ridings from API, searchable dropdown grouped by type (MP/MPP), returns selected ridingId
- [x] T027 [P] [US1] Create EmptyState component in `mobile/components/empty-state.tsx` — reusable encouraging message with icon and optional CTA button (used across all empty views)
- [x] T028 [US1] Create registration screen in `mobile/app/(auth)/register.tsx` — form with display name, email, password fields + RidingPicker, calls register API, stores JWT, navigates to (tabs)
- [x] T029 [US1] Create sign-in screen in `mobile/app/(auth)/sign-in.tsx` — email + password form, calls login API, stores JWT, navigates to (tabs)
- [x] T030 [US1] Implement auth gate in `mobile/app/_layout.tsx` — check for stored JWT on launch, redirect to (auth) if not authenticated, redirect to (tabs) if authenticated

**Checkpoint**: User Story 1 complete — users can register, select riding, sign in, and are gated behind auth

---

## Phase 4: User Story 2 — Report an Issue with Photo (Priority: P1) 🎯 MVP

**Goal**: Signed-in users can upload a photo, describe the issue, select a category, pin a location on the map, and submit a report. In-riding reports earn points; out-of-riding reports still submit but earn zero points. ML model classifies the image asynchronously.

**Independent Test**: Submit a report with a photo inside the user's riding — confirm points awarded, pin appears on map. Submit another outside riding — confirm zero points message.

### Implementation for User Story 2

- [x] T031 [US2] Implement points service in `backend/src/services/points-service.ts` — determine if report location is in user's riding (via riding-service), calculate pointsAwarded (1 or 0), update User.totalPoints and User.totalReports atomically
- [x] T032 [US2] Implement report creation route in `backend/src/routes/reports.ts` — POST /api/reports (multipart/form-data: accept image via upload middleware, validate fields, determine ridingId via riding-service, calculate points, save report with image Buffer, trigger async ML inference, return report with message)
- [x] T033 [US2] Implement async ML processing in report creation flow — after saving report, call classifier.ts to get potholeScore, update report with `mlProcessed: true` and `potholeScore` (fire-and-forget, don't block response)
- [x] T034 [P] [US2] Create location picker component in `mobile/components/location-picker.tsx` — embedded MapView for selecting report location, auto-populate from photo EXIF geolocation if available, draggable marker, confirm button
- [x] T035 [P] [US2] Create category picker component in `mobile/components/category-picker.tsx` — horizontal scrollable list of issue categories (Pothole, Broken Streetlight, Damaged Sidewalk, Graffiti, Illegal Dumping, Other) with icons
- [x] T036 [US2] Create report submission screen in `mobile/app/report/new.tsx` — step flow: (1) pick/take photo via expo-image-picker, (2) enter description + select category, (3) confirm location on map, (4) submit to API, (5) show confirmation with points earned or out-of-riding message
- [x] T037 [US2] Add FAB (floating action button) or "+" button to map screen in `mobile/app/(tabs)/map.tsx` to navigate to report/new.tsx

**Checkpoint**: User Story 2 complete — users can submit reports with photos, earn points for in-riding reports, ML classifies images

---

## Phase 5: User Story 3 — Browse and View Reported Issues (Priority: P2)

**Goal**: Full-screen interactive map as primary interface, centered on user's riding with boundary visible. Pins mark reported issues; clicking shows reporter name, points, pothole score, description, category, date. Detail view accessible from popup.

**Independent Test**: Seed reports in a riding, verify pins appear on map, click pin shows popup with correct data, tap detail shows full report.

### Implementation for User Story 3

- [x] T038 [US3] Implement GET /api/reports route in `backend/src/routes/reports.ts` — query by ridingId with pagination (page, limit), populate userId with displayName, exclude image binary from response
- [x] T039 [US3] Implement GET /api/reports/:id route in `backend/src/routes/reports.ts` — return full report detail (excluding image binary), populate userId with displayName
- [x] T040 [P] [US3] Create MapPin component in `mobile/components/map-pin.tsx` — custom marker for react-native-maps, visual differentiation by category (color-coded), muted style for adjacent riding pins
- [x] T041 [P] [US3] Create PinPopup component in `mobile/components/pin-popup.tsx` — callout displaying reporter displayName, points earned, potholeScore, description snippet, category badge, date, "View Details" link
- [x] T042 [US3] Build full-screen map screen in `mobile/app/(tabs)/map.tsx` — MapView centered on user's riding, draw riding boundary polygon, fetch reports for riding on load, render MapPin + PinPopup for each report, show adjacent riding pins in muted style when panning, EmptyState overlay when no reports
- [x] T043 [US3] Create report detail screen in `mobile/app/report/[id].tsx` — fetch single report by ID, display full description, pothole confidence score, map with location pin, date, status, reporter displayName (no image display per spec)

**Checkpoint**: User Story 3 complete — map shows all riding reports as interactive pins with detail view

---

## Phase 6: User Story 4 — Neighbourhood Leaderboard (Priority: P3)

**Goal**: Per-riding leaderboard ranking users by total points from in-riding reports. User's own entry is highlighted.

**Independent Test**: Create multiple users in same riding with different point totals, verify leaderboard ranks them correctly with highlighted current user.

### Implementation for User Story 4

- [x] T044 [US4] Implement leaderboard route in `backend/src/routes/leaderboard.ts` — GET /api/leaderboard/:ridingId with limit param, aggregate User collection by ridingId sorted by totalPoints desc, compute rank, populate riding name/type
- [x] T045 [US4] Register leaderboard route in `backend/server.ts`
- [x] T046 [P] [US4] Create LeaderboardRow component in `mobile/components/leaderboard-row.tsx` — rank badge, displayName, totalPoints, report count, highlighted style for current user
- [x] T047 [US4] Build leaderboard screen in `mobile/app/(tabs)/leaderboard.tsx` — fetch leaderboard for user's riding, render ranked list using LeaderboardRow, highlight current user's entry, show EmptyState when riding has no contributors

**Checkpoint**: User Story 4 complete — leaderboard shows per-riding rankings with user highlight

---

## Phase 7: User Story 5 — Personal Performance Profile (Priority: P4)

**Goal**: Users see their total points, report count, report history with per-report points, and category breakdown on their profile page.

**Independent Test**: Submit reports across categories (some in-riding, some out), verify profile shows accurate totals, history, and breakdown.

### Implementation for User Story 5

- [x] T048 [US5] Implement profile routes in `backend/src/routes/profile.ts` — GET /api/users/me (return user with populated riding + category breakdown aggregation) and GET /api/users/me/reports (paginated report history for authenticated user)
- [x] T049 [US5] Register profile routes in `backend/server.ts`
- [x] T050 [P] [US5] Create ProfileStats component in `mobile/components/profile-stats.tsx` — display total points, total reports, and category breakdown chart/list
- [x] T051 [P] [US5] Create ReportHistoryItem component in `mobile/components/report-history-item.tsx` — single report row: description snippet, category, date, points awarded indicator (earned vs. not earned)
- [x] T052 [US5] Build profile screen in `mobile/app/(tabs)/profile.tsx` — fetch user profile + report history, render ProfileStats at top, scrollable ReportHistoryItem list below, EmptyState for new users, sign-out button

**Checkpoint**: User Story 5 complete — users can view their full performance profile

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T053 [P] Import and apply Google Stitch design system: extract colors, typography, spacing, component styles into `mobile/constants/colors.ts` and NativeWind theme in `mobile/tailwind.config.js`
- [x] T054 [P] Add loading states (skeleton/spinner) to all data-fetching screens: map.tsx, leaderboard.tsx, profile.tsx, report/[id].tsx
- [x] T055 [P] Add error handling UI (toast/alert) for API failures across all screens in `mobile/components/error-toast.tsx`
- [x] T056 [P] Implement pull-to-refresh on leaderboard and profile screens
- [x] T057 Validate all EmptyState scenarios: empty map, empty leaderboard, empty profile, no reports in riding
- [x] T058 Code cleanup: ensure all files are under 300 lines (Constitution Principle I), max 3 levels nesting (Principle II)
- [ ] T059 Run quickstart.md end-to-end validation: register → report → browse map → leaderboard → profile

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 Registration (Phase 3)**: Depends on Foundational — BLOCKS US2, US3, US4, US5 (auth required)
- **US2 Report (Phase 4)**: Depends on US1 (needs authenticated user) — can start after Phase 3
- **US3 Browse Map (Phase 5)**: Depends on US1 (needs auth) — can start after Phase 3; benefits from US2 data but can use seed data
- **US4 Leaderboard (Phase 6)**: Depends on US1 (needs auth) — can start after Phase 3; benefits from US2 data
- **US5 Profile (Phase 7)**: Depends on US1 (needs auth) — can start after Phase 3; benefits from US2 data
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P0 Registration)**: Foundation only — prerequisite for all other stories
- **US2 (P1 Report)**: Depends on US1 — can run parallel with US3/US4/US5 after US1
- **US3 (P2 Browse Map)**: Depends on US1 — can run parallel with US2/US4/US5 (use seed data)
- **US4 (P3 Leaderboard)**: Depends on US1 — can run parallel with US2/US3/US5 (use seed data)
- **US5 (P4 Profile)**: Depends on US1 — can run parallel with US2/US3/US4 (use seed data)

### Within Each User Story

- Backend routes before mobile screens (API must exist for UI to consume)
- Models before services (already in Foundational phase)
- Services before routes
- Reusable components (marked [P]) before screens that compose them
- Core implementation before integration

### Parallel Opportunities

Within Phase 1 (Setup):
- T003, T004, T005, T006, T007 can all run in parallel

Within Phase 2 (Foundational):
- T012, T013, T014, T015, T016, T017, T018 can run in parallel (backend)
- T019, T020, T021 can run in parallel (mobile)

Within Phase 3 (US1):
- T026, T027 can run in parallel (components)

Within Phase 4 (US2):
- T034, T035 can run in parallel (components)

Within Phase 5 (US3):
- T040, T041 can run in parallel (components)

Within Phase 6 (US4):
- T046 can run parallel with T044 (component while backend route is built)

Within Phase 7 (US5):
- T050, T051 can run in parallel (components)

After Phase 3 completes:
- **US2, US3, US4, US5 can all proceed in parallel** (different files, independent features)

---

## Parallel Example: Foundation Phase

```bash
# Backend models (after T008 DB setup):
T009: "Create Riding schema in backend/src/models/riding.ts"
T010: "Create User schema in backend/src/models/user.ts"
T011: "Create Report schema in backend/src/models/report.ts"

# Backend middleware + services (parallel, different files):
T012: "JWT auth middleware in backend/src/middleware/auth.ts"
T013: "Upload middleware in backend/src/middleware/upload.ts"
T016: "ML model loader in backend/src/ml/model-loader.ts"
T017: "ML classifier in backend/src/ml/classifier.ts"
T018: "Riding lookup service in backend/src/services/riding-service.ts"

# Mobile foundation (parallel, different files):
T019: "API client in mobile/services/api.ts"
T020: "Auth state in mobile/services/auth.ts"
T021: "Router layout in mobile/app/_layout.tsx"
```

## Parallel Example: After US1 Completes

```bash
# All four stories can start simultaneously:
Developer A: US2 — T031 → T032 → T033 → T034/T035 → T036 → T037
Developer B: US3 — T038 → T039 → T040/T041 → T042 → T043
Developer C: US4 — T044 → T045 → T046 → T047
Developer D: US5 — T048 → T049 → T050/T051 → T052
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 Registration → users can register and sign in
4. Complete Phase 4: US2 Report → users can submit reports with photos
5. **STOP and VALIDATE**: Test registration → report → pin on map flow
6. Deploy/demo if ready — this is the minimum viable product

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Registration) → Test → Users can sign up ✓
3. Add US2 (Report) → Test → Reports with photos and points ✓ (MVP!)
4. Add US3 (Browse Map) → Test → Full map browsing experience ✓
5. Add US4 (Leaderboard) → Test → Gamification layer ✓
6. Add US5 (Profile) → Test → Personal engagement tracking ✓
7. Polish → Production-ready
8. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Google Teachable Machine model is pre-trained externally — no training pipeline needed, just place exported files in `backend/src/ml/model/`
- UI design comes from Google Stitch — extract design tokens in T053 (Polish phase) but can be applied incrementally during component creation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
