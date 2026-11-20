# KT Online Campus Info System

A full-stack college management web application with role-based dashboards for Admin, Faculty, and Students.

**Tech Stack:** Spring Boot 3.2.5 · React 19 · Vite · Tailwind CSS · MySQL · JWT

---

## Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.9+ (or use `./mvnw`) |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## Database Setup

```sql
CREATE DATABASE campusinfo;
```

No manual schema creation needed — Spring Boot's `ddl-auto=update` creates all tables on first run.

---

## Backend Setup

```bash
cd backend

# Option A: use Maven wrapper (no local Maven needed)
./mvnw spring-boot:run

# Option B: use local Maven
mvn spring-boot:run
```

The server starts on **http://localhost:8080**.

### Environment Variables (optional)

Create a `.env` file in `backend/`:

```
DB_URL=jdbc:mysql://localhost:3306/campusinfo?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-at-least-32-chars
```

### Seeded Accounts (auto-created on first run)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Faculty | faculty1@campus.edu | faculty123 |
| Faculty | faculty2@campus.edu | faculty123 |
| Faculty | faculty3@campus.edu | faculty123 |
| Student | student1@campus.edu | student123 |
| Student | student2@campus.edu | student123 |
| Student | student3@campus.edu | student123 |
| Student | student4@campus.edu | student123 |
| Student | student5@campus.edu | student123 |

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173**.

---

## Running Both Together

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend && ./mvnw spring-boot:run
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## Running Tests

```bash
cd backend
./mvnw test
```

Tests require an H2 in-memory database (configured automatically for the `test` profile).

---

## API Overview

Base path: `http://localhost:8080/api`

| Endpoint group | Auth |
|----------------|------|
| `POST /api/auth/login` | Public |
| `POST /api/auth/change-password` | Any authenticated |
| `GET/POST/PUT/DELETE /api/admin/**` | ROLE_ADMIN |
| `GET/POST/PUT /api/faculty/**` | ROLE_FACULTY |
| `GET/PUT /api/student/**` | ROLE_STUDENT |
| `GET /api/search` | Any authenticated |
| `GET /api/notifications` | Any authenticated |

---

## Functional Requirements Implemented

| # | Requirement | Status |
|---|-------------|--------|
| FR-01 | Email/password login | ✅ |
| FR-02 | JWT generation and validation | ✅ |
| FR-03 | Role-based access control | ✅ |
| FR-04 | Change password | ✅ |
| FR-05 | Logout | ✅ |
| FR-06 | Student management (CRUD + deactivate) | ✅ |
| FR-07 | Faculty management (CRUD + deactivate) | ✅ |
| FR-08 | Department management + HOD | ✅ |
| FR-09 | Course management + faculty assignment | ✅ |
| FR-10 | Student enrollment | ✅ |
| FR-11 | Timetable management | ✅ |
| FR-12 | Audience-based announcements | ✅ |
| FR-13 | Campus event management | ✅ |
| FR-14 | CSV import and export | ✅ |
| FR-15 | Summary reports and analytics | ✅ |
| FR-16 | Faculty: assigned courses + enrolled students | ✅ |
| FR-17 | Faculty: mark attendance | ✅ |
| FR-18 | Faculty: enter and update marks | ✅ |
| FR-19 | Faculty: personal timetable | ✅ |
| FR-20 | Faculty: announcements and events | ✅ |
| FR-21 | Student: view and edit profile (phone/address) | ✅ |
| FR-22 | Student: course-wise attendance | ✅ |
| FR-23 | Student: view marks | ✅ |
| FR-24 | Student: weekly timetable | ✅ |
| FR-25 | Student: announcements and events | ✅ |
| FR-26 | Search students, faculty, courses | ✅ |
| FR-27 | Attendance shortage alert (<75%) | ✅ |
| FR-28 | In-app notifications with read/unread | ✅ |
| FR-29 | Dashboard analytics and charts | ✅ |

---

## Project Structure

```
CampusConnect/
├── backend/          # Spring Boot application
│   ├── pom.xml
│   ├── mvnw
│   └── src/main/java/com/bits/campusmanagement/
│       ├── config/     # Security, JWT, CORS, DataInitializer
│       ├── model/      # JPA entities
│       ├── repository/ # Spring Data repositories
│       ├── dto/        # Request/Response DTOs
│       ├── service/    # Business logic
│       ├── controller/ # REST endpoints
│       └── exception/  # Global exception handler
└── frontend/         # React + Vite application
    ├── src/
    │   ├── api/        # Axios config
    │   ├── context/    # AuthContext
    │   ├── components/ # Reusable UI components
    │   ├── layouts/    # Admin/Faculty/Student layouts
    │   └── pages/      # Role-based page components
    └── package.json
```

---

## CSV Import Format

### Students CSV (columns in order):
`Full Name, Email, Password, Roll Number, Department ID, Program, Semester, Phone`

### Faculty CSV (columns in order):
`Full Name, Email, Password, Employee Number, Department ID, Designation`
