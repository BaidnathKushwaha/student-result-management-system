# 🎓 Student Result Management System

A full-stack Result Management System built using Spring Boot, Spring Security, JWT Authentication, MySQL, React, and Vite. The application enables secure management of students, faculty, subjects, marks, and semester-wise results with role-based access control.

---

# 📌 Project Overview

The Student Result Management System is designed to automate academic result processing in colleges and universities.

The system provides three roles:

* **Admin**
* **Faculty**
* **Student**

Each role has dedicated functionalities and access permissions.

The application follows a secure client-server architecture with JWT-based authentication and a React frontend consuming REST APIs exposed by a Spring Boot backend.

---

# 🚀 Features

## 🔐 Authentication & Authorization

* JWT Authentication
* Role-Based Access Control (RBAC)
* BCrypt Password Encryption
* Secure Login & Registration
* Protected Frontend Routes
* Stateless Session Management

---

## 👨‍💼 Admin Module

### Student Management

* Add Student
* Update Student
* Delete Student
* View Student Details
* Pagination & Sorting

### Faculty Management

* Add Faculty
* Update Faculty
* Delete Faculty
* View Faculty Details

### Subject Management

* Add Subject
* Update Subject
* Delete Subject
* View Subject Details

### Academic Management

* Manage Marks
* Generate Results
* View Reports

---

## 👨‍🏫 Faculty Module

* View Student List
* View Student Details
* Enter Internal Marks
* Enter External Marks
* Update Marks
* View Generated Results

---

## 👨‍🎓 Student Module

* View Own Profile
* View Semester-wise Results
* View GPA
* View Percentage
* Download Result Sheet

---

## 📊 Result Processing

* Automatic Result Generation
* Semester-wise GPA Calculation
* Percentage Calculation
* Grade Assignment
* Credit-Based Evaluation
* Downloadable Result Report

---

## 📄 Result Download Feature

Students can download their semester results directly from the application.

Downloaded report contains:

* Student Information
* Semester Details
* Subject-wise Marks
* Total Marks
* Percentage
* GPA
* Grade Summary

---

## ⚡ Additional Features

* Global Exception Handling
* Validation Using Jakarta Validation
* Swagger/OpenAPI Documentation
* RESTful API Design
* Pagination
* Sorting
* DTO Architecture
* Clean Layered Architecture
* Responsive User Interface

---

# 🏗️ System Architecture

```text
React Frontend
        │
        ▼
REST APIs (JSON)
        │
        ▼
Spring Boot Backend
        │
        ▼
Service Layer
        │
        ▼
Repository Layer
        │
        ▼
MySQL Database
```

Authentication Flow:

```text
User Login
     │
     ▼
JWT Token Generated
     │
     ▼
Token Stored in Browser
     │
     ▼
Axios Interceptor Adds Token
     │
     ▼
Protected API Access
```

---

# 🛠️ Technology Stack

## Backend

* Java 21
* Spring Boot
* Spring Security
* JWT (JJWT)
* Spring Data JPA
* Hibernate
* MySQL
* Maven
* Lombok
* Swagger/OpenAPI

## Frontend

* React 19
* Vite
* React Router DOM
* Axios
* React Toastify
* React Hot Toast
* React Icons
* Tailwind CSS

## Database

* MySQL

---

# 📂 Project Structure

```text
Result-Management-System
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── application.properties
│
├── docs
│   ├── screenshots
│   ├── database-design
│   └── api-testing
│
└── README.md
```

---

# 🗄️ Database Design

## User

| Field       | Type                  |
| ----------- | --------------------- |
| id          | Long                  |
| username    | String                |
| password    | String                |
| role        | ADMIN/FACULTY/STUDENT |
| referenceId | Long                  |

---

## Student

| Field      | Type    |
| ---------- | ------- |
| id         | Long    |
| usn        | String  |
| name       | String  |
| email      | String  |
| semester   | Integer |
| department | String  |

---

## Faculty

| Field | Type   |
| ----- | ------ |
| id    | Long   |
| name  | String |
| email | String |

---

## Subject

| Field       | Type    |
| ----------- | ------- |
| id          | Long    |
| subjectCode | String  |
| subjectName | String  |
| credits     | Integer |
| semester    | Integer |

---

## Marks

| Field         | Type    |
| ------------- | ------- |
| student       | Student |
| subject       | Subject |
| internalMarks | Double  |
| externalMarks | Double  |
| totalMarks    | Double  |

---

## Result

| Field      | Type    |
| ---------- | ------- |
| student    | Student |
| semester   | Integer |
| percentage | Double  |
| gpa        | Double  |

---

# 📖 Grade Scale

| Percentage | Grade Point | Grade |
| ---------- | ----------- | ----- |
| 90+        | 10          | O     |
| 80-89      | 9           | A+    |
| 70-79      | 8           | A     |
| 60-69      | 7           | B+    |
| 50-59      | 6           | B     |
| Below 50   | 0           | F     |

---

# 🔗 REST API Endpoints

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

## Students

```http
GET    /api/admin/students
POST   /api/admin/students
PUT    /api/admin/students/{id}
DELETE /api/admin/students/{id}
```

## Faculty

```http
GET    /api/admin/faculty
POST   /api/admin/faculty
PUT    /api/admin/faculty/{id}
DELETE /api/admin/faculty/{id}
```

## Subjects

```http
GET    /api/admin/subjects
POST   /api/admin/subjects
PUT    /api/admin/subjects/{id}
DELETE /api/admin/subjects/{id}
```

## Marks

```http
POST   /api/faculty/marks
PUT    /api/faculty/marks/{id}
GET    /api/faculty/marks/student/{studentId}
```

## Results

```http
POST /api/results/student/{studentId}/semester/{semester}/generate

GET  /api/results/student/{studentId}/semester/{semester}
```

---

# 📚 API Documentation

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone https://github.com/BaidnathKushwaha/student-result-management-system.git
```

---

## Backend Setup

### Configure Database

Update:

```properties
application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/result_management_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

## Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Run application:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🧪 Testing

### Backend Testing

* Swagger API Testing
* JWT Authentication Testing
* CRUD Testing
* Result Generation Testing

### Frontend Testing

* Authentication Flow
* Role-Based Routing
* CRUD Operations
* Result Download Functionality

---

# 📸 Screenshots

Add screenshots of:

* Login Page
* Admin Dashboard
* Faculty Dashboard
* Student Dashboard
* Student Management
* Faculty Management
* Subject Management
* Marks Entry
* Result Generation
* Result Download
* Swagger UI
* Database Tables

---

# 🔮 Future Enhancements

* Email Notifications
* Attendance Management
* Analytics Dashboard
* Result Comparison Charts
* Cloud Deployment
* Docker Support
* CI/CD Pipeline
* Multi-College Support
* Export Results to Excel

---

# 👨‍💻 Author

**Baidnath**

Developed as a full-stack academic management application using Spring Boot, Spring Security, JWT, MySQL, React, and Vite.

---

# ⭐ Key Learning Outcomes

* Spring Boot REST API Development
* Spring Security & JWT Authentication
* Role-Based Authorization
* Database Design with JPA/Hibernate
* React Frontend Development
* API Integration with Axios
* Exception Handling
* DTO Architecture
* Full Stack Application Development
* Secure Client-Server Communication
