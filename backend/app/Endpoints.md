# Backend API Reference

Base URL: `/api`

---

## Auth (`/api/auth`)

### POST `/api/auth/register`
Register a new user.

**Request Body (JSON):**
| Field          | Type   | Required | Description              |
|----------------|--------|----------|--------------------------|
| `username`     | string | Yes      | Unique username          |
| `email`        | string | Yes      | Unique email address     |
| `password`     | string | Yes      | Plain-text password      |
| `neighborhood` | string | No       | User's neighborhood      |

**Responses:**
| Status | Body |
|--------|------|
| `201`  | `{ "message": "registered" }` |
| `400`  | `{ "message": "username, email, and password are required" }` |
| `400`  | `{ "message": "username or email already exists" }` |

---

### POST `/api/auth/login`
Log in and receive a JWT access token.

**Request Body (JSON):**
| Field      | Type   | Required |
|------------|--------|----------|
| `email`    | string | Yes      |
| `password` | string | Yes      |

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `{ "access_token": "<jwt>", "user": <User> }` |
| `401`  | `{ "message": "invalid credentials" }` |

---

### POST `/api/auth/logout`
Log out (client-side token discard).

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `{ "message": "logged out" }` |

---

## Users (`/api/users`)

### GET `/api/users/me` 🔒
Get the authenticated user's profile.

**Headers:** `Authorization: Bearer <jwt>`

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `<User>` |
| `404`  | `{ "message": "not found" }` |

---

### GET `/api/users/<user_id>`
Get a user's public profile by ID.

**Path Params:** `user_id` — MongoDB ObjectId string

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `<User>` |
| `404`  | `{ "message": "not found" }` |

---

### GET `/api/users/me/badges` 🔒
Get the authenticated user's earned badges.

**Headers:** `Authorization: Bearer <jwt>`

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `{ "badges": [ ... ] }` |
| `404`  | `{ "message": "not found" }` |

---

## Challenges (`/api/challenges`)

### GET `/api/challenges/`
List all active challenges.

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `[ <Challenge>, ... ]` |

---

### GET `/api/challenges/<challenge_id>`
Get a single challenge by ID.

**Path Params:** `challenge_id` — MongoDB ObjectId string

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `<Challenge>` |
| `404`  | `{ "message": "not found" }` |

---

### POST `/api/challenges/<challenge_id>/submit` 🔒
Submit proof of completing a challenge.

**Headers:** `Authorization: Bearer <jwt>`

**Path Params:** `challenge_id` — MongoDB ObjectId string

**Request Body (JSON):**
| Field       | Type   | Required | Description                |
|-------------|--------|----------|----------------------------|
| `proof_url` | string | No       | URL to proof of completion |

**Responses:**
| Status | Body |
|--------|------|
| `201`  | `<Submission>` |

---

### POST `/api/challenges/` 🔒
Create a new challenge (admin use).

**Headers:** `Authorization: Bearer <jwt>`

**Request Body (JSON):**
| Field         | Type     | Required | Default | Description            |
|---------------|----------|----------|---------|------------------------|
| `title`       | string   | Yes      |         | Challenge title        |
| `description` | string   | No       |         | Challenge description  |
| `category`    | string   | No       |         | e.g. voting, volunteering |
| `tags`        | string[] | No       | `[]`    | Tags for the challenge |
| `xp_reward`   | int      | No       | `100`   | XP awarded on completion |

**Responses:**
| Status | Body |
|--------|------|
| `201`  | `<Challenge>` |

---

## Events (`/api/events`)

### GET `/api/events/`
List upcoming community events, optionally filtered by neighborhood.

**Query Params:**
| Param          | Type   | Required | Description                     |
|----------------|--------|----------|---------------------------------|
| `neighborhood` | string | No       | Filter events by neighborhood   |

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `[ <Event>, ... ]` |

---

### GET `/api/events/<event_id>`
Get a single event by ID.

**Path Params:** `event_id` — MongoDB ObjectId string

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `<Event>` |
| `404`  | `{ "message": "not found" }` |

---

### GET `/api/events/<keyword>`
Search events by keyword(s) in the title (space-separated).

**Path Params:** `keyword` — space-separated search terms

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `[ <Event>, ... ]` |

---

### POST `/api/events/` 🔒
Create a new community event.

**Headers:** `Authorization: Bearer <jwt>`

**Request Body (JSON):**
| Field         | Type     | Required | Default | Description              |
|---------------|----------|----------|---------|--------------------------|
| `title`       | string   | Yes      |         | Event title              |
| `description` | string   | No       |         | Event description        |
| `location`    | string   | No       |         | Event location           |
| `starts_at`   | string   | No       |         | ISO 8601 start datetime  |
| `xp_reward`   | int      | No       | `100`   | XP awarded on check-in   |
| `tags`        | string[] | No       | `[]`    | Tags for the event       |

**Responses:**
| Status | Body |
|--------|------|
| `201`  | `<Event>` |

---

### POST `/api/events/<event_id>/checkin` 🔒
Check into a community event to earn XP.

**Headers:** `Authorization: Bearer <jwt>`

**Path Params:** `event_id` — MongoDB ObjectId string

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `{ "message": "checked in", "event_id": "<event_id>" }` |

---

## Leaderboard (`/api/leaderboard`)

### GET `/api/leaderboard/`
Global leaderboard — top users sorted by XP.

**Query Params:**
| Param   | Type | Required | Default | Description             |
|---------|------|----------|---------|-------------------------|
| `limit` | int  | No       | `20`    | Number of users to return |

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `[ <User>, ... ]` |

---

### GET `/api/leaderboard/neighborhood/<neighborhood>`
Neighborhood leaderboard — top users by XP in a specific neighborhood.

**Path Params:** `neighborhood` — neighborhood name string

**Query Params:**
| Param   | Type | Required | Default | Description             |
|---------|------|----------|---------|-------------------------|
| `limit` | int  | No       | `20`    | Number of users to return |

**Responses:**
| Status | Body |
|--------|------|
| `200`  | `[ <User>, ... ]` |

---

## AI (`/api/ai`)
Currently empty — no endpoints defined.

---

## Data Schemas

### User
```json
{
  "id": "string (ObjectId)",
  "username": "string",
  "email": "string",
  "xp": 0,
  "level": 1,
  "badges": [],
  "neighborhood": "string | null"
}