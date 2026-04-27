# CMDI Grade Portal - Full Stack System

A complete full-stack web application for CARD-MRI Development Institute Inc. (CMDI) that manages student grades, enrollment, payments, and user administration with role-based access control.

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Responsive, Mobile-friendly)
- **Backend:** Node.js, Express.js
- **Database:** MySQL (phpMyAdmin compatible)
- **Authentication:** JWT (JSON Web Tokens) + bcrypt password hashing
- **Security:** Role-based middleware, input validation, CORS

## Features

### Authentication
- Single login page (no role selection)
- Automatic role-based redirection after login
- Secure password hashing with bcrypt
- JWT token-based session management

### Role-Based Dashboards
- **Student:** View grades, enrollment status, schedule, financial balance
- **Teacher:** Encode/update grades, view assigned subjects, student lists
- **Registrar:** Manage enrollment, approve/deny students, assign sections, course management
- **Finance:** Record payments, track tuition balances, payment history
- **Admin:** Full user CRUD, student/teacher management, grades oversight, system settings

### Backend API
- RESTful API with Express
- CRUD operations for users, students, teachers, subjects, grades, enrollments, payments
- Role-based route protection
- Input validation with express-validator

## Project Structure

```
Cmdigradeportaluiuxdesign/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js            # MySQL connection pool
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication & role authorization
│   │   └── validation.js    # Input validation rules
│   ├── routes/
│   │   ├── auth.js          # Login, logout, profile
│   │   ├── users.js         # User CRUD (admin)
│   │   ├── students.js      # Student records
│   │   ├── teachers.js      # Teacher records & subject assignment
│   │   ├── subjects.js      # Course/subject management
│   │   ├── grades.js        # Grade encoding & viewing
│   │   ├── enrollments.js   # Enrollment management
│   │   ├── payments.js      # Payment recording & balances
│   │   └── announcements.js # Announcements/notifications
│   ├── server.js            # Main Express server
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Environment variables template
├── database/
│   └── cmdi_portal.sql      # Complete MySQL schema + demo data
├── frontend/                # HTML/CSS/JS frontend
│   ├── index.html           # Login page
│   ├── dashboard.html       # Main dashboard shell
│   ├── css/
│   │   └── styles.css       # Complete responsive styles
│   └── js/
│       ├── auth.js          # Auth utilities & API helpers
│       └── app.js           # Dashboard application logic
├── README.md                # This file
└── TODO.md                  # Development tracking
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server (or XAMPP/WAMP with phpMyAdmin)
- npm (comes with Node.js)

### 1. Database Setup

1. Open phpMyAdmin or MySQL command line
2. Create the database by importing `database/cmdi_portal.sql`:
   ```bash
   mysql -u root -p < database/cmdi_portal.sql
   ```
   Or use phpMyAdmin: Import > Choose File > `cmdi_portal.sql`

3. The database `cmdi_portal` will be created with all tables and demo data

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   copy .env.example .env
   ```
   (On Linux/Mac: `cp .env.example .env`)

4. Edit `.env` with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=cmdi_portal
   JWT_SECRET=your_secret_key_here
   PORT=5000
   CORS_ORIGIN=http://localhost:5500
   ```

5. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

   The API will run at `http://localhost:5000`

### 3. Frontend Setup

The frontend is static HTML/CSS/JS. You can serve it using any static file server:

**Option A: VS Code Live Server (Recommended)**
1. Install the "Live Server" extension in VS Code
2. Right-click on `frontend/index.html` > "Open with Live Server"
3. The frontend will open at `http://127.0.0.1:5500/frontend/`

**Option B: Python HTTP Server**
```bash
cd frontend
python -m http.server 5500
```

**Option C: Node.js npx serve**
```bash
cd frontend
npx serve -p 5500
```

### 4. Access the Application

1. Open the frontend URL in your browser
2. Login with demo credentials:

| Role      | Email                          | Password    |
|-----------|--------------------------------|-------------|
| Student   | juan.delacruz@cmdi.edu.ph      | password123 |
| Teacher   | ana.reyes@cmdi.edu.ph          | password123 |
| Registrar | registrar@cmdi.edu.ph          | password123 |
| Finance   | finance@cmdi.edu.ph            | password123 |
| Admin     | admin@cmdi.edu.ph              | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email & password
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password

### Users (Admin only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Students
- `GET /api/students` - List students
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student

### Teachers
- `GET /api/teachers` - List teachers
- `GET /api/teachers/:id` - Get teacher details
- `POST /api/teachers/:id/assign-subject` - Assign subject

### Subjects
- `GET /api/subjects` - List subjects
- `POST /api/subjects` - Create subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Grades
- `GET /api/grades/student/:id` - Get student grades
- `GET /api/grades/teacher/subjects` - Get teacher's subjects
- `GET /api/grades/teacher/students/:subjectId` - Get students for grading
- `POST /api/grades` - Submit/update grades
- `GET /api/grades/all` - Get all grades (admin)

### Enrollments
- `GET /api/enrollments` - List enrollments
- `GET /api/enrollments/pending` - Get pending enrollments
- `POST /api/enrollments` - Create enrollment
- `POST /api/enrollments/:id/approve` - Approve enrollment
- `POST /api/enrollments/:id/reject` - Reject enrollment

### Payments
- `GET /api/payments` - List payments
- `GET /api/payments/student/:id` - Get student payments
- `POST /api/payments` - Record payment
- `GET /api/payments/balances/all` - Get all balances
- `GET /api/payments/summary/dashboard` - Payment summary

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement
- `DELETE /api/announcements/:id` - Delete announcement

## Security Features

- Passwords hashed with bcrypt (cost factor 10)
- JWT tokens with configurable expiration
- Role-based route protection middleware
- Input validation on all forms
- SQL injection prevention via parameterized queries
- CORS configuration for frontend access

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - CARD-MRI Development Institute Inc.

