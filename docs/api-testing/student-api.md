# Student API

Base URL: `http://localhost:8080/api`

All endpoints require `Authorization: Bearer <token>`.

---

## Role access

| Endpoint group | Allowed roles |
|---|---|
| `/admin/students/**` | `ADMIN` only |
| `/faculty/students/**` | `FACULTY`, `ADMIN` |
| `/student/profile/me` | `STUDENT` only |

---

## Admin endpoints

### 1. Create student

**POST** `/admin/students`

**Request Body**
```json
{
  "usn": "1XX21CS001",
  "name": "Jane Doe",
  "email": "jane.doe@college.edu",
  "semester": 3,
  "department": "Computer Science"
}
```

**Response `201 Created`**
```json
{
  "id": 1,
  "usn": "1XX21CS001",
  "name": "Jane Doe",
  "email": "jane.doe@college.edu",
  "semester": 3,
  "department": "Computer Science"
}
```

**Errors**

| Status | Reason |
|--------|--------|
| `409 Conflict` | USN already exists |
| `400 Bad Request` | Validation failure |
| `403 Forbidden` | Not ADMIN |

---

### 2. Get all students (paginated)

**GET** `/admin/students`

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | `0` | Zero-based page number |
| `size` | int | `10` | Results per page |
| `sortBy` | string | `name` | Field to sort by (`name`, `usn`, `semester`) |

**Example**
```
GET /admin/students?page=0&size=10&sortBy=name
```

**Response `200 OK`** — Spring `Page<StudentResponse>` shape
```json
{
  "content": [
    {
      "id": 1,
      "usn": "1XX21CS001",
      "name": "Jane Doe",
      "email": "jane.doe@college.edu",
      "semester": 3,
      "department": "Computer Science"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 10,
  "first": true,
  "last": true
}
```

---

### 3. Get student by ID

**GET** `/admin/students/{id}`

**Example**
```
GET /admin/students/1
```

**Response `200 OK`**
```json
{
  "id": 1,
  "usn": "1XX21CS001",
  "name": "Jane Doe",
  "email": "jane.doe@college.edu",
  "semester": 3,
  "department": "Computer Science"
}
```

**Errors**

| Status | Reason |
|--------|--------|
| `404 Not Found` | Student not found |

---

### 4. Update student

**PUT** `/admin/students/{id}`

**Request Body** — same shape as create
```json
{
  "usn": "1XX21CS001",
  "name": "Jane Doe Updated",
  "email": "jane.updated@college.edu",
  "semester": 4,
  "department": "Computer Science"
}
```

**Response `200 OK`** — updated student object

---

### 5. Delete student

**DELETE** `/admin/students/{id}`

**Response `204 No Content`**

**Errors**

| Status | Reason |
|--------|--------|
| `404 Not Found` | Student not found |

---

## Faculty endpoints (read-only)

### 6. Get all students (faculty view)

**GET** `/faculty/students`

Same pagination params as `/admin/students`. Returns same `Page<StudentResponse>` shape.
Faculty can view all students but cannot create, update, or delete.

---

### 7. Get student by ID (faculty view)

**GET** `/faculty/students/{id}`

Returns same `StudentResponse` shape as the admin endpoint.

---

## Student endpoint

### 8. Get own profile

**GET** `/student/profile/me`

No path params. Returns the student linked to the authenticated user via `referenceId`.

**Response `200 OK`**
```json
{
  "id": 1,
  "usn": "1XX21CS001",
  "name": "Jane Doe",
  "email": "jane.doe@college.edu",
  "semester": 3,
  "department": "Computer Science"
}
```

**Errors**

| Status | Reason |
|--------|--------|
| `403 Forbidden` | User account has no linked student profile (`referenceId` not set) |

---

## curl examples

```bash
# Create student (admin token)
curl -X POST http://localhost:8080/api/admin/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "usn": "1XX21CS001",
    "name": "Jane Doe",
    "email": "jane.doe@college.edu",
    "semester": 3,
    "department": "Computer Science"
  }'

# Get all students — page 0, 10 per page, sort by name
curl -X GET "http://localhost:8080/api/admin/students?page=0&size=10&sortBy=name" \
  -H "Authorization: Bearer $TOKEN"

# Get student by ID
curl -X GET http://localhost:8080/api/admin/students/1 \
  -H "Authorization: Bearer $TOKEN"

# Update student
curl -X PUT http://localhost:8080/api/admin/students/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "usn": "1XX21CS001",
    "name": "Jane Doe Updated",
    "email": "jane.updated@college.edu",
    "semester": 4,
    "department": "Computer Science"
  }'

# Delete student
curl -X DELETE http://localhost:8080/api/admin/students/1 \
  -H "Authorization: Bearer $TOKEN"

# Get own profile (student token)
curl -X GET http://localhost:8080/api/student/profile/me \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

---

## Validation rules

| Field | Rule |
|-------|------|
| `usn` | Required, unique |
| `name` | Required |
| `email` | Required, valid email format |
| `semester` | Required, 1–8 |
| `department` | Required |