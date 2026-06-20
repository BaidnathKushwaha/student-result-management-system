# 📝 Marks API Testing

The Marks API allows faculty members to enter, update, delete, and view student marks. These endpoints require users to have the **FACULTY** or **ADMIN** role.

## Base URL
`http://localhost:8080/api/faculty/marks`

---

## Endpoints

### 1. Add Marks for a Student
Records internal and external marks for a specific student in a particular subject.

* **URL:** `/`
* **Method:** `POST`
* **Headers:** 
  * `Content-Type: application/json`
  * `Authorization: Bearer <FACULTY_JWT_TOKEN>`
* **Access Level:** FACULTY or ADMIN

#### Request Body
```json
{
  "studentId": 1,
  "subjectId": 1,
  "internalMarks": 42.5,
  "externalMarks": 45.0
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | Long | Yes | Database ID of the student. |
| `subjectId` | Long | Yes | Database ID of the subject. |
| `internalMarks` | Double | Yes | Score in internals. Must be between 0.0 and 50.0. |
| `externalMarks` | Double | Yes | Score in externals. Must be between 0.0 and 50.0. |

#### Response (201 Created)
```json
{
  "id": 1,
  "studentId": 1,
  "studentName": "Jane Doe Smith",
  "subjectId": 1,
  "subjectName": "Design and Analysis of Algorithms",
  "subjectCode": "21CS41",
  "internalMarks": 42.5,
  "externalMarks": 45.0,
  "totalMarks": 87.5
}
```

#### Response (400 Bad Request - Validation Failure)
```json
{
  "message": "Validation failed",
  "errors": {
    "internalMarks": "Internal marks cannot exceed 50",
    "externalMarks": "External marks cannot be negative"
  }
}
```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/faculty/marks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <FACULTY_JWT_TOKEN>" \
  -d '{
    "studentId": 1,
    "subjectId": 1,
    "internalMarks": 42.5,
    "externalMarks": 45.0
  }'
```

---

### 2. Update Student Marks
Updates internal and/or external marks for an existing marks entry by ID.

* **URL:** `/{id}`
* **Method:** `PUT`
* **Headers:** 
  * `Content-Type: application/json`
  * `Authorization: Bearer <FACULTY_JWT_TOKEN>`
* **Access Level:** FACULTY or ADMIN

#### Request Body
```json
{
  "studentId": 1,
  "subjectId": 1,
  "internalMarks": 45.0,
  "externalMarks": 47.0
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "studentId": 1,
  "studentName": "Jane Doe Smith",
  "subjectId": 1,
  "subjectName": "Design and Analysis of Algorithms",
  "subjectCode": "21CS41",
  "internalMarks": 45.0,
  "externalMarks": 47.0,
  "totalMarks": 92.0
}
```

#### cURL Example
```bash
curl -X PUT http://localhost:8080/api/faculty/marks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <FACULTY_JWT_TOKEN>" \
  -d '{
    "studentId": 1,
    "subjectId": 1,
    "internalMarks": 45.0,
    "externalMarks": 47.0
  }'
```

---

### 3. Get Marks Record by ID
Retrieves details of a specific marks record by database ID.

* **URL:** `/{id}`
* **Method:** `GET`
* **Headers:** 
  * `Authorization: Bearer <FACULTY_JWT_TOKEN>`
* **Access Level:** FACULTY or ADMIN

#### Response (200 OK)
```json
{
  "id": 1,
  "studentId": 1,
  "studentName": "Jane Doe Smith",
  "subjectId": 1,
  "subjectName": "Design and Analysis of Algorithms",
  "subjectCode": "21CS41",
  "internalMarks": 45.0,
  "externalMarks": 47.0,
  "totalMarks": 92.0
}
```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/faculty/marks/1 \
  -H "Authorization: Bearer <FACULTY_JWT_TOKEN>"
```

---

### 4. Get Marks Records for a Student
Retrieves all recorded marks for a specific student.

* **URL:** `/student/{studentId}`
* **Method:** `GET`
* **Headers:** 
  * `Authorization: Bearer <FACULTY_JWT_TOKEN>`
* **Access Level:** FACULTY or ADMIN

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "studentId": 1,
    "studentName": "Jane Doe Smith",
    "subjectId": 1,
    "subjectName": "Design and Analysis of Algorithms",
    "subjectCode": "21CS41",
    "internalMarks": 45.0,
    "externalMarks": 47.0,
    "totalMarks": 92.0
  }
]
```

#### cURL Example
```bash
curl -X GET http://localhost:8080/api/faculty/marks/student/1 \
  -H "Authorization: Bearer <FACULTY_JWT_TOKEN>"
```

---

### 5. Delete Marks Record
Deletes a recorded marks entry.

* **URL:** `/{id}`
* **Method:** `DELETE`
* **Headers:** 
  * `Authorization: Bearer <FACULTY_JWT_TOKEN>`
* **Access Level:** FACULTY or ADMIN

#### Response (204 No Content)
*No body returned.*

#### cURL Example
```bash
curl -X DELETE http://localhost:8080/api/faculty/marks/1 \
  -H "Authorization: Bearer <FACULTY_JWT_TOKEN>"
```
