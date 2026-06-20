# 📚 Subject API Testing

The Subject API handles college academic subjects. Creating, updating, and deleting subjects requires the **ADMIN** role, while listing and retrieving subjects is available to both **ADMIN** and **FACULTY** roles.

## Base URL
`http://localhost:8080/api/admin/subjects`

---

## Endpoints

### 1. Create a New Subject
Creates a new subject record.

* **URL:** `/`
* **Method:** `POST`
* **Headers:** 
  * `Content-Type: application/json`
  * `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Access Level:** ADMIN only

#### Request Body
```json
{
  "subjectCode": "21CS41",
  "subjectName": "Design and Analysis of Algorithms",
  "credits": 4,
  "semester": 4
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `subjectCode` | String | Yes | Unique code representing the subject. Must not be blank. |
| `subjectName` | String | Yes | Title/Name of the subject. Must not be blank. |
| `credits` | Integer | Yes | Credit value of the course. Must be at least 1. |
| `semester` | Integer | Yes | Semester in which the course is offered. Must be between 1 and 8. |

#### Response (201 Created)
```json
{
  "id": 1,
  "subjectCode": "21CS41",
  "subjectName": "Design and Analysis of Algorithms",
  "credits": 4,
  "semester": 4
}
```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/admin/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "subjectCode": "21CS41",
    "subjectName": "Design and Analysis of Algorithms",
    "credits": 4,
    "semester": 4
  }'
```

---

### 2. Get All Subjects
Retrieves a list of all subjects.

* **URL:** `/`
* **Method:** `GET`
* **Headers:** 
  * `Authorization: Bearer <ADMIN_OR_FACULTY_JWT_TOKEN>`
* **Access Level:** ADMIN or FACULTY

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "subjectCode": "21CS41",
    "subjectName": "Design and Analysis of Algorithms",
    "credits": 4,
    "semester": 4
  },
  {
    "id": 2,
    "subjectCode": "21CS42",
    "subjectName": "Microcontrollers and Embedded Systems",
    "credits": 3,
    "semester": 4
  }
]
```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/admin/subjects \
  -H "Authorization: Bearer <FACULTY_JWT_TOKEN>"
```

---

### 3. Get Subject by ID
Retrieves details of a specific subject by database ID.

* **URL:** `/{id}`
* **Method:** `GET`
* **Headers:** 
  * `Authorization: Bearer <ADMIN_OR_FACULTY_JWT_TOKEN>`
* **Access Level:** ADMIN or FACULTY

#### Response (200 OK)
```json
{
  "id": 1,
  "subjectCode": "21CS41",
  "subjectName": "Design and Analysis of Algorithms",
  "credits": 4,
  "semester": 4
}
```

#### Response (404 Not Found - Invalid ID)
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Subject not found with id: 99",
  "path": "/api/admin/subjects/99"
}
```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/admin/subjects/1 \
  -H "Authorization: Bearer <FACULTY_JWT_TOKEN>"
```

---

### 4. Update Subject Details
Updates an existing subject's information.

* **URL:** `/{id}`
* **Method:** `PUT`
* **Headers:** 
  * `Content-Type: application/json`
  * `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Access Level:** ADMIN only

#### Request Body
```json
{
  "subjectCode": "21CS41",
  "subjectName": "Design & Analysis of Algorithms",
  "credits": 4,
  "semester": 4
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "subjectCode": "21CS41",
  "subjectName": "Design & Analysis of Algorithms",
  "credits": 4,
  "semester": 4
}
```

#### cURL Example
```bash
curl -X PUT http://localhost:8080/api/admin/subjects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>" \
  -d '{
    "subjectCode": "21CS41",
    "subjectName": "Design & Analysis of Algorithms",
    "credits": 4,
    "semester": 4
  }'
```

---

### 5. Delete Subject
Deletes a subject by database ID.

* **URL:** `/{id}`
* **Method:** `DELETE`
* **Headers:** 
  * `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Access Level:** ADMIN only

#### Response (204 No Content)
*No body returned.*

#### cURL Example
```bash
curl -X DELETE http://localhost:8080/api/admin/subjects/1 \
  -H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```
