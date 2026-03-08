# Feature Specification: Pothole & Civic Issue Reporter

**Feature Branch**: `001-pothole-civic-reporter`  
**Created**: 2026-03-07  
**Status**: Draft  
**Input**: User description: "Build an application that will let users report potholes in their city and other environment issues that the city can fix and be reported too. Users will report by uploading an image onto the website, which will then record and report the information. Users should be able to see a leaderboard of the people in their neighbourhood and their contributions, and they should have a way of recording their performance."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Report an Issue with a Photo (Priority: P1)

A registered, signed-in resident notices a pothole (or other civic issue such as a broken streetlight, damaged sidewalk, or graffiti). They open the website, upload a photo of the issue, provide a brief description, and pin the location on the map (or allow the system to detect it from the photo's geolocation data). If the pinned location falls within their registered riding, the report earns them points and appears on their riding's map. If the location is outside their riding, the report is still submitted and alerts the city, but the user does not earn points.

**Why this priority**: This is the core value proposition of the entire application. Without the ability to submit reports, nothing else (leaderboards, profiles) has purpose.

**Independent Test**: Can be fully tested by a single registered user uploading a photo, filling in minimal details, and confirming the report appears as a pin on the map. Delivers immediate value — an issue is now recorded.

**Acceptance Scenarios**:

1. **Given** a signed-in user is on the report page, **When** they upload a valid image (JPEG/PNG, ≤ 10 MB), enter a description, and select a location within their riding, **Then** a new report is created with status "Submitted", the user earns points, and sees a confirmation message with points awarded.
2. **Given** a signed-in user is on the report page, **When** they upload a valid report but pin the location outside their registered riding, **Then** the report is created, the city is alerted, but the user does NOT earn points and sees a message explaining why ("This location is outside your riding").
3. **Given** a user is on the report page, **When** they upload a file that is not a supported image format, **Then** the system displays a clear error message and does not create a report.
4. **Given** a user is on the report page, **When** they attempt to submit without selecting a location, **Then** the system prompts them to provide a location before allowing submission.
5. **Given** a user uploads a photo that contains geolocation metadata, **When** they reach the location step, **Then** the map auto-populates with the photo's coordinates and the user can confirm or adjust.

---

### User Story 2 - Browse and View Reported Issues (Priority: P2)

A resident wants to see what issues have been reported in their neighbourhood (defined by their MP/MPP riding in Toronto). They open the website and see a full-screen interactive map as the primary interface, with pins marking every reported issue in their riding. Clicking a pin reveals who uploaded it and how many points they earned for the report.

**Why this priority**: Visibility of reports is what turns individual submissions into a community-wide awareness tool. The map-first interface makes civic issues tangible and geographic.

**Independent Test**: Can be tested by seeding a few reports in a riding and verifying they appear as clickable pins on the map with correct details. Delivers value even without the leaderboard — users can see neighbourhood issues spatially.

**Acceptance Scenarios**:

1. **Given** a signed-in user visits the main page, **When** the page loads, **Then** they see a full-screen map centered on their registered riding with pins for all reports in that riding.
2. **Given** a user sees pins on the map, **When** they click a pin, **Then** a popup displays: the reporter's display name, the number of points earned, the pothole confidence score, description snippet, category, and date.
3. **Given** a user clicks a pin popup, **When** they select "View Details", **Then** they see the full report: complete description, pothole confidence score, map location, report date, status, and reporter's display name. (Note: uploaded images are NOT displayed — they are used only for ML classification.)
4. **Given** a user views the map, **When** no reports exist in their riding, **Then** the map displays a friendly overlay encouraging them to submit the first report.
5. **Given** a user views the map, **When** they pan or zoom outside their riding boundary, **Then** they can see pins from adjacent ridings in a muted/read-only style but cannot interact with them beyond viewing.

---

### User Story 3 - Neighbourhood Leaderboard (Priority: P3)

A resident wants to see how they compare to other residents in their MP/MPP riding in terms of civic contributions. They navigate to the leaderboard page and see a ranked list of users in their riding, ordered by total points earned from reports submitted within their riding.

**Why this priority**: The leaderboard is the gamification layer that drives repeat engagement and friendly competition. It depends on reports (P1) and visible user identities already existing.

**Independent Test**: Can be tested by creating multiple users in the same riding with varying point totals and verifying the leaderboard ranks them correctly. Delivers standalone value — users can see community participation.

**Acceptance Scenarios**:

1. **Given** multiple users have submitted reports in a riding, **When** a user visits the leaderboard page, **Then** they see a ranked list showing each user's display name, total points, report count, and rank — scoped to their riding only.
2. **Given** a user is on the leaderboard, **When** they look for their own entry, **Then** their entry is visually highlighted.
3. **Given** a user has just submitted a new report within their riding, **When** they visit the leaderboard, **Then** their points, report count, and rank reflect the new submission.
4. **Given** a user submitted a report outside their riding, **When** they visit the leaderboard, **Then** that report does NOT contribute to their points or rank on this leaderboard.

---

### User Story 4 - Personal Performance Profile (Priority: P4)

A user wants to track their own civic engagement over time. They visit their profile page and see their total points, total report count, a timeline or history of their submissions, and stats (e.g., reports this month, most-reported issue type, in-riding vs. out-of-riding breakdown).

**Why this priority**: Personal performance tracking reinforces individual motivation and gives users a sense of accomplishment. It builds on P1 data and complements the P3 leaderboard.

**Independent Test**: Can be tested by submitting several reports as one user (some in-riding, some out-of-riding) and verifying the profile page shows accurate totals, points, and history.

**Acceptance Scenarios**:

1. **Given** a user has submitted reports, **When** they visit their profile page, **Then** they see their total points, total report count, a list of their past reports with points earned per report, and the date of each.
2. **Given** a user has submitted reports across different issue categories, **When** they view their profile, **Then** they see a breakdown of reports by category (e.g., potholes, streetlights, sidewalks).
3. **Given** a user has submitted both in-riding and out-of-riding reports, **When** they view their profile, **Then** each report clearly indicates whether points were awarded.
4. **Given** a user has no reports yet, **When** they visit their profile page, **Then** they see an encouraging empty state prompting them to submit their first report.

---

### User Story 5 - User Registration and Riding Selection (Priority: P0 — Prerequisite)

A new visitor opens the website and must register before they can do anything. They sign up with a display name and select their MP/MPP riding in the City of Toronto from a predefined dropdown list. Registration must be quick and frictionless to avoid discouraging participation. Once registered, the user is immediately signed in and the map centers on their riding.

**Why this priority**: Registration is a prerequisite for all other flows — reporting, leaderboards, and profiles all require an identified user with a riding assignment. Elevated to P0 to reflect this dependency.

**Independent Test**: Can be tested by registering a new user, selecting a riding, and confirming the map centers on that riding and the user can submit reports.

**Acceptance Scenarios**:

1. **Given** a visitor is not signed in, **When** they visit any page, **Then** they are redirected to the registration/sign-in page.
2. **Given** a visitor is on the registration page, **When** they enter a display name and select a riding from the predefined Toronto ridings dropdown, **Then** their account is created and they are immediately signed in.
3. **Given** a user has just registered, **When** they land on the main page, **Then** the map is centered on their selected riding with its boundary visible.
4. **Given** a returning user, **When** they visit the site, **Then** they can sign in with their existing credentials and are taken to their riding's map.

---

### Edge Cases

- What happens when a user uploads an image larger than the size limit (10 MB)? → System rejects the upload with a clear file-size error and does not create a report.
- What happens when two users report the same issue at the same location? → Both reports are kept; duplicate detection is out of scope for the initial build.
- How does the system handle a photo with no geolocation metadata? → The user must manually select the location on the map; the location step is not skippable.
- What happens when a user's riding has zero other users? → The leaderboard shows only that user at rank 1 with an encouraging message to invite neighbours.
- What if the uploaded image is corrupt or unreadable? → System displays an error asking the user to upload a different file.
- How is "neighbourhood" defined? → Predefined list of federal MP ridings and provincial MPP ridings in the City of Toronto. Users select their riding during registration.
- What happens when a user reports an issue outside their riding? → The report is created and the city is alerted, but the user earns zero points. A clear message explains why no points were awarded.
- Can a user change their riding after registration? → Out of scope for initial build; they are locked to their selected riding.
- What if a report location falls exactly on a riding boundary? → The system assigns it to the riding whose polygon contains the pin coordinates; if ambiguous, it defaults to the reporter's registered riding.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST require user registration and sign-in before allowing access to any feature (reporting, browsing, leaderboard, profile).
- **FR-002**: System MUST provide a predefined list of Toronto federal MP ridings and provincial MPP ridings for users to select during registration.
- **FR-003**: System MUST allow signed-in users to create a report by uploading at least one image (JPEG or PNG, max 10 MB) with a text description, issue category, and a map-pinned location.
- **FR-004**: System MUST award points to a user when they submit a report with a location inside their registered riding.
- **FR-005**: System MUST NOT award points when a report's location falls outside the user's registered riding, and MUST display a clear explanation to the user.
- **FR-006**: System MUST still submit reports outside the user's riding and alert the city, even though no points are awarded.
- **FR-007**: System MUST present a full-screen interactive map as the primary interface, centered on the user's registered riding with riding boundary visible.
- **FR-008**: System MUST display report pins on the map; clicking a pin MUST show: reporter's display name, points earned, pothole confidence score (0–100), description snippet, issue category, and date.
- **FR-009**: System MUST provide a detail view accessible from the pin popup showing: complete description, pothole confidence score, map location, report date, status, and reporter's display name. Images MUST NOT be displayed in the UI — they are stored and processed for ML classification only.
- **FR-010**: System MUST maintain a per-riding leaderboard ranking users by total points earned from in-riding reports, displaying rank, display name, total points, and report count.
- **FR-011**: System MUST provide a personal profile page for each user showing their total points, total report count, list of their past reports, and a breakdown by issue category.
- **FR-012**: System MUST support the following issue categories for reports: Pothole, Broken Streetlight, Damaged Sidewalk, Graffiti, Illegal Dumping, and Other.
- **FR-013**: System MUST auto-populate the location on the map when the uploaded photo contains geolocation metadata, while allowing the user to adjust.
- **FR-014**: System MUST assign every new report a status of "Submitted" upon creation.
- **FR-015**: System MUST associate each report with the user who submitted it, linking to their leaderboard and profile data.
- **FR-016**: System MUST display a user's own leaderboard entry with a visual highlight (e.g., different background colour) so they can quickly find themselves.
- **FR-017**: System MUST show a friendly, encouraging empty state whenever a view has no content (no reports in riding, no personal reports, empty leaderboard).
- **FR-018**: System MUST validate uploaded files and reject non-image files or files exceeding the size limit with a clear error message.
- **FR-019**: System MUST allow users to see adjacent ridings' pins on the map in a muted/read-only style when panning outside their riding boundary.

### Key Entities

- **Report**: A civic issue submission. Key attributes: image (stored in MongoDB, not displayed), pothole confidence score (0–100 from TensorFlow model), description, issue category, map location (latitude/longitude), status (Submitted), date created, reporting user, points awarded (positive if in-riding, zero if out-of-riding), associated riding.
- **User**: A registered participant. Key attributes: display name, registered riding, date joined, total points, total report count.
- **Riding**: A predefined electoral district (federal MP or provincial MPP) in the City of Toronto used to scope the map view and leaderboard. Key attributes: riding name, riding type (MP or MPP), geographic boundary polygon.
- **Leaderboard Entry**: A computed view per riding. Key attributes: user reference, riding, total points, report count, rank.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can go from opening the website to submitting their first report (with photo, description, and location) in under 2 minutes.
- **SC-002**: 90% of first-time users successfully submit a report without encountering a confusing error or dead end.
- **SC-003**: The reports feed loads and displays at least 20 reports within 3 seconds on a standard broadband connection.
- **SC-004**: The leaderboard accurately reflects all in-riding reports — a newly submitted report updates the user's points and rank within 30 seconds.
- **SC-005**: Users can view their personal profile with full report history, total points, and category breakdown within 2 seconds of navigating to the page.
- **SC-006**: The application supports all Toronto MP and MPP ridings with independent leaderboards, each scoped correctly so users only see their riding's contributors.
- **SC-007**: At least 3 issue categories are used across reports within the first week of deployment, indicating the category system is discoverable and useful.
- **SC-008**: Out-of-riding reports are clearly distinguished — the user sees a message explaining zero points, and the report is still persisted and visible on the correct riding's map.

## Assumptions

- **Toronto-first scope**: The initial build targets only the City of Toronto. Ridings are limited to Toronto's federal MP and provincial MPP electoral districts.
- **Predefined riding list**: Riding names and boundaries are sourced from official electoral district data and hardcoded/seeded into the system. Users select from this list — no free-form input.
- **Registration is required**: All features are gated behind registration. There is no anonymous or guest access.
- **Points are riding-scoped**: Users earn points only for reports pinned within their registered riding. Out-of-riding reports still get submitted (city is alerted) but award zero points.
- **Riding is locked after registration**: Users cannot change their riding in the initial build.
- **Duplicate detection is out of scope**: Multiple reports of the same issue at the same location are allowed. De-duplication can be addressed in a future iteration.
- **Report status is static for initial build**: Reports are created with status "Submitted" and there is no status workflow (e.g., "In Progress", "Resolved") in the initial build.
- **City alerting mechanism is undefined**: Out-of-riding reports "alert the city" — the specific mechanism (email, dashboard, API) is an implementation decision.
- **No moderation system**: All reports are published immediately upon submission. Content moderation is a future concern.
- **Images are for ML only**: Uploaded images are stored in MongoDB and processed by a TensorFlow model to produce a pothole confidence score (0–100). Images are NOT displayed anywhere in the UI.
- **Platform is mobile**: The application is a React Native mobile app built with Expo Go, not a traditional website.
- **Security is explicitly deferred**: Per the project constitution, authentication hardening, input sanitization, and authorization guardrails are not addressed in this specification.
- **Points value per report is fixed**: Each valid in-riding report awards a fixed number of points (e.g., 1 point per report). Variable point values by category are a future enhancement.
