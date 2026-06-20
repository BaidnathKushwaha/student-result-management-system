# 📊 Result API Testing

The Result API handles academic evaluation, automatically computing semester percentages, GPA, and compiling subject-wise marks.

## Base URL
`http://localhost:8080/api/results`

---

## Endpoints

### 1. Generate / Refresh Student Result
Generates or refreshes the result metrics for a student in a specific semester. Typically called by ADMIN or FACULTY after all marks are submitted.

* **URL:** `/student/{studentId}/semester/{semester}/generate`
* **Method:** `POST`
* **Headers:** 
  * `Authorization: Bearer <ADMIN_OR_FACULTY_JWT_TOKEN>`
* **Access Level:** ADMIN or FACULTY (authenticated users; students are restricted by service checks)

#### Response (200 OK)
```json
{
  "id": 1,
  "studentId": 1,
  "studentName": "Jane Doe Smith",
  "usn": "1RV21CS001",
  "semester": 4,
  "percentage": 89.75,
  "gpa": 9.0,
  "subjectMarks": [
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
}
```

#### cURL Example
```bash
curl -X POST http://localhost:8080/api/results/student/1/semester/4/generate \
  -H "Authorization: Bearer <FACULTY_JWT_TOKEN>"
```

---

### 2. Retrieve Student Result
Fetches the existing semester result for a student.
- **ADMIN/FACULTY** can fetch any student's results.
- **STUDENT** can only fetch their own result (verified via linked user `referenceId`).

* **URL:** `/student/{studentId}/semester/{semester}`
* **Method:** `GET`
* **Headers:** 
  * `Authorization: Bearer <JWT_TOKEN>`
* **Access Level:** ADMIN, FACULTY, or STUDENT (self only)

#### Response (200 OK)
```json
{
  "id": 1,
  "studentId": 1,
  "studentName": "Jane Doe Smith",
  "usn": "1RV21CS001",
  "semester": 4,
  "percentage": 89.75,
  "gpa": 9.0,
  "subjectMarks": [
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
}
```

#### Response (403 Forbidden - Student trying to access another student's ID)
```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "You can only view your own result",
  "path": "/api/results/student/2/semester/4"
}
```

#### cURL Example (As Student)
```bash
curl -X GET http://localhost:8080/api/results/student/1/semester/4 \
  -H "Authorization: Bearer <STUDENT_JWT_TOKEN>"
```
