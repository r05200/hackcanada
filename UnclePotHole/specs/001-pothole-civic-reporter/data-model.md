# Data Model: Pothole & Civic Issue Reporter

**Feature**: `001-pothole-civic-reporter`  
**Date**: 2026-03-07  
**Storage**: MongoDB (Mongoose ODM)

---

## Entities

### 1. User

A registered participant who reports civic issues and earns points.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | auto-generated | Primary key |
| `displayName` | String | required, 2–30 chars, trimmed | Public display name on leaderboard and reports |
| `email` | String | required, unique, lowercase | Login identifier |
| `passwordHash` | String | required | Hashed password (bcrypt) |
| `ridingId` | ObjectId | required, ref → Riding | User's registered riding (locked after registration) |
| `totalPoints` | Number | default: 0, min: 0 | Cached sum of points from in-riding reports |
| `totalReports` | Number | default: 0, min: 0 | Cached count of all reports submitted |
| `createdAt` | Date | auto (timestamps) | Registration date |
| `updatedAt` | Date | auto (timestamps) | Last update |

**Indexes**: `{ email: 1 }` (unique), `{ ridingId: 1, totalPoints: -1 }` (leaderboard query)

**Validation rules**:
- `displayName` must be 2–30 characters, trimmed of whitespace
- `email` must be valid email format, stored lowercase
- `ridingId` must reference an existing Riding document

---

### 2. Report

A civic issue submission with an image for ML classification.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | auto-generated | Primary key |
| `userId` | ObjectId | required, ref → User | Who submitted this report |
| `description` | String | required, 10–500 chars | User-provided description of the issue |
| `category` | String | required, enum | Issue type (see categories below) |
| `location` | GeoJSON Point | required | `{ type: "Point", coordinates: [lng, lat] }` |
| `ridingId` | ObjectId | required, ref → Riding | Riding this report's location falls within |
| `image` | Buffer | required | Raw image binary (JPEG/PNG, ≤ 10 MB) |
| `imageMimeType` | String | required, enum: image/jpeg, image/png | MIME type of stored image |
| `potholeScore` | Number | 0–100, default: null | TensorFlow model confidence score (null until processed) |
| `mlProcessed` | Boolean | default: false | Whether ML inference has been completed |
| `pointsAwarded` | Number | 0 or 1 | 1 if in user's riding, 0 if out-of-riding |
| `status` | String | default: "Submitted" | Report status (only "Submitted" in initial build) |
| `createdAt` | Date | auto (timestamps) | Submission date |
| `updatedAt` | Date | auto (timestamps) | Last update |

**Indexes**: `{ location: "2dsphere" }` (geospatial queries), `{ ridingId: 1, createdAt: -1 }` (feed by riding), `{ userId: 1, createdAt: -1 }` (user's report history)

**Categories** (enum values):
- `pothole`
- `broken-streetlight`
- `damaged-sidewalk`
- `graffiti`
- `illegal-dumping`
- `other`

**Validation rules**:
- `description` must be 10–500 characters
- `category` must be one of the enum values
- `location.coordinates` must be valid [longitude, latitude] within Toronto bounding box
- `image` buffer size must not exceed 10 MB (10,485,760 bytes)
- `potholeScore` must be an integer 0–100 when set

**State transitions**:
- On creation: `status = "Submitted"`, `mlProcessed = false`, `potholeScore = null`
- After ML inference: `mlProcessed = true`, `potholeScore = <0–100>`
- No further status transitions in initial build

---

### 3. Riding

A predefined electoral district (federal MP or provincial MPP) in the City of Toronto.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | auto-generated | Primary key |
| `name` | String | required, unique | Official riding name (e.g., "Toronto Centre") |
| `type` | String | required, enum: mp, mpp | Federal (mp) or Provincial (mpp) |
| `slug` | String | required, unique | URL-safe identifier (e.g., "toronto-centre") |
| `boundary` | GeoJSON Polygon | required | Electoral district boundary polygon |
| `center` | GeoJSON Point | required | Centroid for initial map centering |

**Indexes**: `{ boundary: "2dsphere" }` (point-in-polygon queries), `{ type: 1, name: 1 }` (sorted listing)

**Validation rules**:
- `name` must be unique across all ridings
- `type` must be either "mp" or "mpp"
- `boundary` must be a valid GeoJSON Polygon
- Data is seeded from Represent API GeoJSON — not user-editable

---

## Relationships

```text
User ──┬── ridingId ──→ Riding
       │
       └── _id ←── userId ── Report ── ridingId ──→ Riding
```

- **User → Riding**: Many-to-one. Each user belongs to exactly one riding. A riding has many users.
- **Report → User**: Many-to-one. Each report belongs to exactly one user. A user has many reports.
- **Report → Riding**: Many-to-one. Each report is assigned to the riding containing its location. This may differ from the reporter's riding (out-of-riding reports).

## Computed Views

### Leaderboard (per riding)

Not a separate collection — computed via aggregation query:

```text
SELECT userId, displayName, totalPoints, totalReports, RANK
FROM users
WHERE ridingId = <selected_riding>
ORDER BY totalPoints DESC, totalReports DESC, createdAt ASC
```

Implemented as a MongoDB aggregation on the User collection filtered by `ridingId`, sorted by `totalPoints` descending. Rank is computed at query time using `$setWindowFields` or application-level indexing.

### Profile Stats (per user)

Computed via aggregation on the Report collection:

```text
SELECT category, COUNT(*) as count, SUM(pointsAwarded) as points
FROM reports
WHERE userId = <user_id>
GROUP BY category
```
