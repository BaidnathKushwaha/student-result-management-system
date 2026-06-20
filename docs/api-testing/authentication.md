# Authentication API

Base URL: `http://localhost:8080/api`

Authentication uses **JWT Bearer tokens**. After login or register, copy the `token` from the response and pass it as:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Register

**POST** `/auth/register`

Creates a new user account. No token required.

**Request Body**
```json
{
  "username": "admin",
  "password": "admin123",
  "role": "ADMIN"
}
```

**Roles available:** `ADMIN` | `FACULTY` | `STUDENT`

For STUDENT or FACULTY accounts, include `referenceId` to link the login to an existing Student or Faculty record:
```json
{
  "username": "jane.doe",
  "password": "pass1234",
  "role": "STUDENT",
  "referenceId": 14
}
```

**Response `201 Created`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

**Error responses**

| Status | Reason |
|--------|--------|
| `409 Conflict` | Username already taken |
| `400 Bad Request` | Missing / invalid fields |

---

### 2. Login

**POST** `/auth/login`

Authenticates an existing user. No token required.

**Request Body**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response `200 OK`**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

**Error responses**

| Status | Reason |
|--------|--------|
| `401 Unauthorized` | Invalid username or password |
| `400 Bad Request` | Missing fields |

---

## Quick test sequence

```bash
# Step 1 — register an admin
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"ADMIN"}'

# Step 2 — login and capture token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo $TOKEN

# Step 3 — use the token in any protected request
curl -X GET http://localhost:8080/api/admin/students \
  -H "Authorization: Bearer $TOKEN"
```

---

## Token details

| Field | Value |
|-------|-------|
| Algorithm | HS256 |
| Expiry | 24 hours (86400000 ms, configured in `application.properties`) |
| Storage | `sessionStorage` in the frontend (`eg_token` key) |
| Auto-refresh | Not implemented — user must log in again after expiry |

---

## Error response shape (all endpoints)

```json
{
  "timestamp": "2026-06-17T05:29:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password",
  "path": "/api/auth/login"
}
```

Validation errors additionally include a `fieldErrors` map:
```json
{
  "timestamp": "2026-06-17T05:29:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Invalid request data",
  "path": "/api/auth/register",
  "fieldErrors": {
    "username": "Username is required",
    "password": "Password is required"
  }
}
```