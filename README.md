Evolver

A robust online examination platform built with Node.js, Express, React, TypeScript, and PostgreSQL. It features role-based access control for Controller, Teacher, and Student users, complete with an Admin panel, exam management, result handling, and user profile functionality.

### Database Model:

<img src="./backend/prisma/prismaliser.png" />

---

## 📂 Features

### Common
- JWT-based authentication and secure, role-based access control.
- User profiles with editable details and secure login/signup.
- Support for light/dark themes using Chakra UI.

### Controller (Admin)
- Manage Teachers & Students: add, view, edit users.
- Manage Subjects & Exams.
- View & export student exam results.

### Teacher
- Create, edit, and manage exams for their subjects.
- Review student exam results.
- Update their own profile information.

### Student
- View list of available exams.
- Take exams through intuitive exam portal.
- View scores and attempt history.
- Edit personal profile details.


---

## 🔧 Tech Stack

- **Backend**: Node.js, Express, Prisma ORM
- **Frontend**: React (via Vite), Chakra UI
- **Database**: PostgreSQL (hosted on Neon)
- **Authentication**: JSON Web Tokens (JWT)
- **Hosting**:
  - Frontend: Vercel or Netlify
  - Backend: Render
  - Database: Neon DB
 
---

## 🔧 Setup & Run

### Prerequisites
- Node.js (>=14), npm/yarn
- PostgreSQL database (e.g. a Neon DB)

### Backend
```bash
cd backend
npm install
cp .env.example .env      # configure DATABASE_URL, JWT_SECRET, etc.
npx prisma migrate dev    # setup database schema
npm run dev               # start server (e.g. http://localhost:4000)
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env      # configure REACT_APP_API_URL, others
npm run dev               # start app (e.g. http://localhost:3000)
```

---

## 📊 Database Schema

Built with Prisma ORM. Key models include:
- **User** (controller, teacher, student)
- **Subject**
- **Exam**
- **Question & Option**
- **Result / Score**

Relationships enforce ownership and data consistency—e.g., only teachers/controllers can manage their own exams; students only have access to their permissible exams.

---

## ✅ To‑Do / Planned Enhancements

- Fix sign‑up/login flow consistency.
- Roll number authentication for students (instead of email).
- Random password generation and automated emailing for new users.
- Bulk student uploads via CSV.
- Expand student-specific features (e.g. dashboards, analytics).
- Add admission-year and branch fields in student profiles.
- Use refined routing to secure user access per role.

These are already listed as open issues in the repo.

---


### ✅ Summary

**Evolver** offers a comprehensive, role-driven examination workflow:
- Admin controllers can manage all entities.
- Teachers can design exams and review student performance.
- Students can take exams and track results.

With its modular architecture, Chakra-based UI, and PostgreSQL + Prisma backend, it’s well-suited for educational institutions wanting to deploy a customizable online testing platform.
