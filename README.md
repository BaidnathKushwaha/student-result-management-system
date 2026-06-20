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

## 🔐 Authentication & Security

* JWT Authentication
* Role-Based Access Control (Admin, Faculty, Student)
* BCrypt Password Encryption
* Secure Login & Registration
* Protected Frontend Routes
* Stateless Session Management
* Spring Security Integration

---

## 👨‍💼 Admin Module

### Student Management

* Add Student
* Update Student
* Delete Student
* View Student Details
* Search Students
* Pagination & Sorting
* Semester Promotion Workflow

### Faculty Management

* Add Faculty
* Update Faculty
* Delete Faculty
* View Faculty Details
* Search Faculty Records

### Subject Management

* Add Subject
* Update Subject
* Delete Subject
* View Subject Details
* Credit & Semester Assignment

### Academic Administration

* Manage Student Marks
* Generate Semester Results
* View Reports
* Export Academic Records
* Monitor System Activities

---

## 👨‍🏫 Faculty Module

* Faculty Dashboard
* View Assigned Students
* Enter Internal Marks
* Enter External Marks
* Update Existing Marks
* View Student Results
* Activity Tracking Through Audit Logs

---

## 👨‍🎓 Student Module

* Student Dashboard
* View Personal Profile
* View Semester-wise Results
* View GPA & Percentage
* Download Result Reports
* Real-Time Notifications
* Marks Update Alerts
* Result Publication Alerts

---

## 📊 Result Processing Engine

* Automatic Result Generation
* Semester-wise GPA Calculation
* Percentage Calculation
* Grade Assignment
* Credit-Based Evaluation
* Grade Summary Generation
* Academic Performance Tracking

---

## 🔔 Notification System

* Student Notification Center
* Marks Update Notifications
* Result Publication Notifications
* Read / Unread Status Tracking
* Notification History

---

## 📝 Audit Logging System

* Track Administrative Activities
* Track Faculty Actions
* Record Academic Operations
* Timestamped Activity History
* Recent Activity Dashboard

Examples:

* Student Created
* Student Updated
* Marks Modified
* Result Generated
* Semester Promotion Executed

---

## 📄 Reporting & Export

* Download Result Sheet as PDF
* Export Data as CSV
* Semester-wise Academic Reports
* GPA & Percentage Reports
* Printable Result Documents

Downloaded reports contain:

* Student Information
* Semester Details
* Subject-wise Marks
* Internal & External Scores
* Total Marks
* Percentage
* GPA
* Grade Summary

---

## ⚡ Technical Features

* Spring Boot 3
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate ORM
* MySQL Database
* RESTful API Design
* Swagger / OpenAPI Documentation
* Global Exception Handling
* Jakarta Validation
* DTO Architecture
* Clean Layered Architecture
* Responsive React Frontend
* Axios API Integration
* Pagination & Sorting Support

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
