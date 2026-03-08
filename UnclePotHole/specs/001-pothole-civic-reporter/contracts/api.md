# API Contracts: Pothole & Civic Issue Reporter

**Feature**: `001-pothole-civic-reporter`  
**Date**: 2026-03-07  
**Base URL**: `http://localhost:3000/api`  
**Content-Type**: `application/json` (except file uploads: `multipart/form-data`)

---

## Authentication

### POST /api/auth/register

Create a new user account.

**Request** (`application/json`):
```json
{
  "displayName": "Jane Doe",
  "email": "jane@example.com",
  "password": "mypassword",
  "ridingId": "660a1f2b3c4d5e6f7a8b9c0d"
}
```

**Response** `201 Created`:
```json
{
  "user": {
    "_id": "660a1f2b3c4d5e6f7a8b9c0e",
    "displayName": "Jane Doe",
    "email": "jane@example.com",
    "ridingId": "660a1f2b3c4d5e6f7a8b9c0d",
    "totalPoints": 0,
    "totalReports": 0,
    "createdAt": "2026-03-07T12:00:00.000Z"
  },
  "token": "eyJhbGciOi..."
}
```

**Errors**:
- `400` — Validation error (missing fields, invalid email, display name too short/long)
- `409` — Email already registered

---

### POST /api/auth/login

Sign in an existing user.

**Request** (`application/json`):
```json
{
  "email": "jane@example.com",
  "password": "mypassword"
}
```

**Response** `200 OK`:
```json
{
  "user": {
    "_id": "660a1f2b3c4d5e6f7a8b9c0e",
    "displayName": "Jane Doe",
    "email": "jane@example.com",
    "ridingId": "660a1f2b3c4d5e6f7a8b9c0d",
    "totalPoints": 5,
    "totalReports": 7,
    "createdAt": "2026-03-07T12:00:00.000Z"
  },
  "token": "eyJhbGciOi..."
}
```

**Errors**:
- `401` — Invalid email or password

---

## Reports

All report endpoints require `Authorization: Bearer <token>` header.

### POST /api/reports

Submit a new report with an image.

**Request** (`multipart/form-data`):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | yes | JPEG or PNG, max 10 MB |
| `description` | String | yes | 10–500 characters |
| `category` | String | yes | One of: `pothole`, `broken-streetlight`, `damaged-sidewalk`, `graffiti`, `illegal-dumping`, `other` |
| `latitude` | Number | yes | Location latitude |
| `longitude` | Number | yes | Location longitude |

**Response** `201 Created`:
```json
{
  "_id": "660a1f2b3c4d5e6f7a8b9c0f",
  "userId": "660a1f2b3c4d5e6f7a8b9c0e",
  "description": "Large pothole on Queen St W near Bathurst",
  "category": "pothole",
  "location": {
    "type": "Point",
    "coordinates": [-79.4000, 43.6480]
  },
  "ridingId": "660a1f2b3c4d5e6f7a8b9c0d",
  "potholeScore": null,
  "mlProcessed": false,
  "pointsAwarded": 1,
  "status": "Submitted",
  "createdAt": "2026-03-07T12:30:00.000Z",
  "message": "Report submitted! You earned 1 point."
}
```

**Response** (out-of-riding) `201 Created`:
```json
{
  "_id": "...",
  "pointsAwarded": 0,
  "message": "Report submitted. This location is outside your riding — no points awarded, but the city has been alerted."
}
```

**Errors**:
- `400` — Validation error (missing fields, invalid category, file too large, unsupported format)
- `401` — Not authenticated

**Side effects**:
- Image stored as Buffer in report document
- ML inference queued (async): updates `potholeScore` and `mlProcessed` after processing
- If `pointsAwarded = 1`: user's `totalPoints` and `totalReports` incremented
- If `pointsAwarded = 0`: only user's `totalReports` incremented

---

### GET /api/reports?ridingId={ridingId}&page={page}&limit={limit}

Get reports for a riding (map pins).

**Query params**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `ridingId` | ObjectId | required | Filter by riding |
| `page` | Number | 1 | Page number |
| `limit` | Number | 50 | Results per page (max 100) |

**Response** `200 OK`:
```json
{
  "reports": [
    {
      "_id": "660a1f2b3c4d5e6f7a8b9c0f",
      "userId": {
        "_id": "660a1f2b3c4d5e6f7a8b9c0e",
        "displayName": "Jane Doe"
      },
      "description": "Large pothole on Queen St W near Bathurst",
      "category": "pothole",
      "location": {
        "type": "Point",
        "coordinates": [-79.4000, 43.6480]
      },
      "potholeScore": 87,
      "pointsAwarded": 1,
      "status": "Submitted",
      "createdAt": "2026-03-07T12:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 127,
    "pages": 3
  }
}
```

**Notes**: Image binary is NEVER included in list responses. `userId` is populated with `displayName` only.

---

### GET /api/reports/{id}

Get full details of a single report.

**Response** `200 OK`:
```json
{
  "_id": "660a1f2b3c4d5e6f7a8b9c0f",
  "userId": {
    "_id": "660a1f2b3c4d5e6f7a8b9c0e",
    "displayName": "Jane Doe"
  },
  "description": "Large pothole on Queen St W near Bathurst",
  "category": "pothole",
  "location": {
    "type": "Point",
    "coordinates": [-79.4000, 43.6480]
  },
  "ridingId": "660a1f2b3c4d5e6f7a8b9c0d",
  "potholeScore": 87,
  "mlProcessed": true,
  "pointsAwarded": 1,
  "status": "Submitted",
  "createdAt": "2026-03-07T12:30:00.000Z"
}
```

**Errors**:
- `404` — Report not found

---

## Leaderboard

### GET /api/leaderboard/{ridingId}?limit={limit}

Get ranked users for a riding.

**Query params**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | Number | 50 | Max users to return |

**Response** `200 OK`:
```json
{
  "riding": {
    "_id": "660a1f2b3c4d5e6f7a8b9c0d",
    "name": "Toronto Centre",
    "type": "mp"
  },
  "rankings": [
    {
      "rank": 1,
      "userId": "660a1f2b3c4d5e6f7a8b9c0e",
      "displayName": "Jane Doe",
      "totalPoints": 15,
      "totalReports": 18
    },
    {
      "rank": 2,
      "userId": "...",
      "displayName": "John Smith",
      "totalPoints": 12,
      "totalReports": 12
    }
  ]
}
```

---

## Profile

### GET /api/users/me

Get the authenticated user's profile.

**Response** `200 OK`:
```json
{
  "user": {
    "_id": "660a1f2b3c4d5e6f7a8b9c0e",
    "displayName": "Jane Doe",
    "email": "jane@example.com",
    "ridingId": {
      "_id": "660a1f2b3c4d5e6f7a8b9c0d",
      "name": "Toronto Centre",
      "type": "mp"
    },
    "totalPoints": 15,
    "totalReports": 18,
    "createdAt": "2026-03-07T12:00:00.000Z"
  },
  "categoryBreakdown": [
    { "category": "pothole", "count": 10, "points": 8 },
    { "category": "broken-streetlight", "count": 5, "points": 5 },
    { "category": "graffiti", "count": 3, "points": 2 }
  ]
}
```

---

### GET /api/users/me/reports?page={page}&limit={limit}

Get the authenticated user's report history.

**Query params**:
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | Number | 1 | Page number |
| `limit` | Number | 20 | Results per page |

**Response** `200 OK`:
```json
{
  "reports": [
    {
      "_id": "660a1f2b3c4d5e6f7a8b9c0f",
      "description": "Large pothole on Queen St W",
      "category": "pothole",
      "location": {
        "type": "Point",
        "coordinates": [-79.4000, 43.6480]
      },
      "potholeScore": 87,
      "pointsAwarded": 1,
      "status": "Submitted",
      "createdAt": "2026-03-07T12:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 18,
    "pages": 1
  }
}
```

---

## Ridings

### GET /api/ridings

Get all available Toronto ridings.

**Response** `200 OK`:
```json
{
  "ridings": [
    {
      "_id": "660a1f2b3c4d5e6f7a8b9c0d",
      "name": "Toronto Centre",
      "type": "mp",
      "slug": "toronto-centre",
      "center": {
        "type": "Point",
        "coordinates": [-79.3832, 43.6532]
      }
    }
  ]
}
```

**Notes**: Boundary polygon is NOT included in the list response (too large). Use the detail endpoint for boundaries.

---

### GET /api/ridings/{id}

Get a single riding with its boundary polygon.

**Response** `200 OK`:
```json
{
  "_id": "660a1f2b3c4d5e6f7a8b9c0d",
  "name": "Toronto Centre",
  "type": "mp",
  "slug": "toronto-centre",
  "center": {
    "type": "Point",
    "coordinates": [-79.3832, 43.6532]
  },
  "boundary": {
    "type": "Polygon",
    "coordinates": [[[...], [...], ...]]
  }
}
```
