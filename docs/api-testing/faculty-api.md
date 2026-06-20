# Faculty API

Base URL: `http://localhost:8080/api`

All endpoints require `Authorization: Bearer <token>`.

**Allowed role:** `ADMIN` only — faculty management is admin-only.

---

## Endpoints

### 1. Create faculty

**POST** `/admin/faculty`

**Request Body**
```json
{
  "name": "Dr. Anita Rao",
  "email": "anita.rao@college.edu"
}
```

**Response `201 Created`**
```json
{
  "id": 1,
  "name": "Dr. Anita Rao",
  "email": "anita.rao@college.edu"
}
```

**Errors**

| Status | Reason |
|--------|--------|
| `400 Bad Request` | Missing or invalid fields |
| `403 Forbidden` | Not ADMIN |

---

### 2. Get all faculty

**GET** `/admin/faculty`

Returns a flat list (not paginated) of all faculty records.

**Response `200 OK`**
```json
[
  {
    "id": 1,
    "name": "Dr. Anita Rao",
    "email": "anita.rao@college.edu"
  },
  {
    "id": 2,
    "name": "Prof. Ravi Kumar",
    "email": "ravi.kumar@college.edu"
  }
]
```

---

### 3. Get faculty by ID

**GET** `/admin/faculty/{id}`

**Example**
```
GET /admin/faculty/1
```

**Response `200 OK`**
```json
{
  "id": 1,
  "name": "Dr. Anita Rao",
  "email": "anita.rao@college.edu"
}
```

**Errors**

| Status | Reason |
|--------|--------|
| `404 Not Found` | Faculty record not found |

---

### 4. Update faculty

**PUT** `/admin/faculty/{id}`

**Request Body**
```json
{
  "name": "Dr. Anita Rao",
  "email": "anita.rao.updated@college.edu"
}
```

**Response `200 OK`** — updated faculty object

---

### 5. Delete faculty

**DELETE** `/admin/faculty/{id}`

**Response `204 No Content`**

**Errors**

| Status | Reason |
|--------|--------|
| `404 Not Found` | Faculty record not found |

---

## Typical workflow

```
1. Admin creates a faculty record        POST /admin/faculty
2. Admin creates a user account          POST /auth/register  { role: "FACULTY", referenceId: <faculty.id> }
3. Faculty logs in                       POST /auth/login
4. Faculty accesses their workspace      GET  /faculty/students, POST /faculty/marks, etc.
```

The `referenceId` in step 2 is optional for FACULTY (the backend doesn't currently enforce it
for marks endpoints — FACULTY role is checked via JWT role claim, not referenceId) but is
good practice for profile linking.

---

## curl examples

```bash
# Create faculty
curl -X POST http://localhost:8080/api/admin/faculty \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Dr. Anita Rao", "email": "anita.rao@college.edu"}'

# Get all faculty
curl -X GET http://localhost:8080/api/admin/faculty \
  -H "Authorization: Bearer $TOKEN"

# Get by ID
curl -X GET http://localhost:8080/api/admin/faculty/1 \
  -H "Authorization: Bearer $TOKEN"

# Update
curl -X PUT http://localhost:8080/api/admin/faculty/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Dr. Anita Rao", "email": "anita.new@college.edu"}'

# Delete
curl -X DELETE http://localhost:8080/api/admin/faculty/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Validation rules

| Field | Rule |
|-------|------|
| `name` | Required |
| `email` | Required, valid email format, unique |