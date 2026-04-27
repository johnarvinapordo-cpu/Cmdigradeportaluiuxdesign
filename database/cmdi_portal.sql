-- CMDI Grade Portal Database Schema
-- MySQL (phpMyAdmin compatible)

CREATE DATABASE IF NOT EXISTS cmdi_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cmdi_portal;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','teacher','admin','registrar','finance') NOT NULL DEFAULT 'student',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  student_number VARCHAR(50) NOT NULL UNIQUE,
  course VARCHAR(100) NOT NULL,
  year_level INT NOT NULL DEFAULT 1,
  section VARCHAR(50) DEFAULT NULL,
  enrollment_status ENUM('not_enrolled','pending','enrolled','dropped') NOT NULL DEFAULT 'not_enrolled',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TEACHERS TABLE
-- ============================================
CREATE TABLE teachers (
  teacher_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  employee_number VARCHAR(50) NOT NULL UNIQUE,
  department VARCHAR(100) DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- SUBJECTS TABLE
-- ============================================
CREATE TABLE subjects (
  subject_id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  units INT NOT NULL DEFAULT 3,
  year_level INT DEFAULT NULL,
  semester ENUM('1st','2nd','summer') DEFAULT '1st'
) ENGINE=InnoDB;

-- ============================================
-- TEACHER SUBJECTS (ASSIGNMENT)
-- ============================================
CREATE TABLE teacher_subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT NOT NULL,
  subject_id INT NOT NULL,
  school_year VARCHAR(20) NOT NULL,
  semester ENUM('1st','2nd','summer') NOT NULL DEFAULT '1st',
  section VARCHAR(50) DEFAULT NULL,
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
  UNIQUE KEY unique_teacher_subject (teacher_id, subject_id, school_year, semester, section)
) ENGINE=InnoDB;

-- ============================================
-- ENROLLMENTS TABLE
-- ============================================
CREATE TABLE enrollments (
  enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  teacher_subject_id INT DEFAULT NULL,
  school_year VARCHAR(20) NOT NULL,
  semester ENUM('1st','2nd','summer') NOT NULL DEFAULT '1st',
  status ENUM('pending','approved','rejected','dropped') NOT NULL DEFAULT 'pending',
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_subject_id) REFERENCES teacher_subjects(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- GRADES TABLE
-- ============================================
CREATE TABLE grades (
  grade_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject_id INT NOT NULL,
  teacher_id INT NOT NULL,
  prelim DECIMAL(5,2) DEFAULT NULL,
  midterm DECIMAL(5,2) DEFAULT NULL,
  prefinal DECIMAL(5,2) DEFAULT NULL,
  final DECIMAL(5,2) DEFAULT NULL,
  remarks ENUM('passed','failed','incomplete','dropped') DEFAULT NULL,
  encoded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(subject_id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_subject (student_id, subject_id)
) ENGINE=InnoDB;

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('tuition','miscellaneous','laboratory','other') NOT NULL DEFAULT 'tuition',
  description VARCHAR(255) DEFAULT NULL,
  status ENUM('pending','completed','refunded','cancelled') NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  recorded_by INT DEFAULT NULL,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- TUITION BALANCES TABLE
-- ============================================
CREATE TABLE tuition_balances (
  balance_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  school_year VARCHAR(20) NOT NULL,
  semester ENUM('1st','2nd','summer') NOT NULL DEFAULT '1st',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  balance_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  UNIQUE KEY unique_student_balance (student_id, school_year, semester)
) ENGINE=InnoDB;

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE announcements (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_roles SET('student','teacher','registrar','finance','admin') DEFAULT 'student,teacher,registrar,finance,admin',
  posted_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- DEMO DATA
-- ============================================

-- Insert demo users with bcrypt hashed passwords
-- All passwords are 'password123' hashed with bcrypt (cost 10)
-- $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

INSERT INTO users (name, email, password, role) VALUES
('Juan Dela Cruz', 'juan.delacruz@cmdi.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Maria Santos', 'maria.santos@cmdi.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Prof. Ana Reyes', 'ana.reyes@cmdi.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
('Prof. Carlos Mendoza', 'carlos.mendoza@cmdi.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher'),
('Admin Rodriguez', 'admin@cmdi.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Registrar Santos', 'registrar@cmdi.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'registrar'),
('Finance Garcia', 'finance@cmdi.edu.ph', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'finance');

-- Insert students
INSERT INTO students (user_id, student_number, course, year_level, section, enrollment_status) VALUES
(1, 'S2024001', 'BS Computer Science', 2, 'A', 'enrolled'),
(2, 'S2024002', 'BS Information Technology', 3, 'B', 'enrolled');

-- Insert teachers
INSERT INTO teachers (user_id, employee_number, department) VALUES
(3, 'T2024001', 'College of Computer Studies'),
(4, 'T2024002', 'College of Engineering');

-- Insert subjects
INSERT INTO subjects (code, name, description, units, year_level, semester) VALUES
('CS101', 'Introduction to Computer Science', 'Fundamentals of computing', 3, 1, '1st'),
('CS201', 'Data Structures and Algorithms', 'Advanced programming concepts', 3, 2, '1st'),
('IT301', 'Web Development', 'Full-stack web development', 3, 3, '1st'),
('CS202', 'Database Management Systems', 'SQL and NoSQL databases', 3, 2, '2nd'),
('IT302', 'Network Administration', 'Computer networks and security', 3, 3, '2nd');

-- Insert teacher subjects
INSERT INTO teacher_subjects (teacher_id, subject_id, school_year, semester, section) VALUES
(1, 1, '2024-2025', '1st', 'A'),
(1, 2, '2024-2025', '1st', 'A'),
(2, 3, '2024-2025', '1st', 'B'),
(1, 4, '2024-2025', '2nd', 'A'),
(2, 5, '2024-2025', '2nd', 'B');

-- Insert enrollments
INSERT INTO enrollments (student_id, subject_id, teacher_subject_id, school_year, semester, status) VALUES
(1, 1, 1, '2024-2025', '1st', 'approved'),
(1, 2, 2, '2024-2025', '1st', 'approved'),
(1, 4, 4, '2024-2025', '2nd', 'approved'),
(2, 2, 2, '2024-2025', '1st', 'approved'),
(2, 3, 3, '2024-2025', '1st', 'approved'),
(2, 5, 5, '2024-2025', '2nd', 'pending');

-- Insert grades
INSERT INTO grades (student_id, subject_id, teacher_id, prelim, midterm, prefinal, final, remarks) VALUES
(1, 1, 1, 85.50, 88.00, 90.00, 87.83, 'passed'),
(1, 2, 1, 78.00, 82.50, 85.00, 81.83, 'passed'),
(2, 2, 1, 92.00, 94.50, 96.00, 94.17, 'passed'),
(2, 3, 2, 88.00, 90.00, 89.50, 89.17, 'passed');

-- Insert payments
INSERT INTO payments (student_id, amount, payment_type, description, status, recorded_by) VALUES
(1, 15000.00, 'tuition', 'Tuition Fee - 1st Semester 2024-2025', 'completed', 7),
(1, 2500.00, 'miscellaneous', 'Miscellaneous Fees', 'completed', 7),
(2, 15000.00, 'tuition', 'Tuition Fee - 1st Semester 2024-2025', 'completed', 7),
(2, 3500.00, 'laboratory', 'Laboratory Fees', 'pending', 7);

-- Insert tuition balances
INSERT INTO tuition_balances (student_id, school_year, semester, total_amount, paid_amount, balance_amount) VALUES
(1, '2024-2025', '1st', 20000.00, 17500.00, 2500.00),
(2, '2024-2025', '1st', 22000.00, 15000.00, 7000.00);

-- Insert announcements
INSERT INTO announcements (title, content, target_roles, posted_by) VALUES
('Welcome to CMDI Grade Portal', 'The new grade portal is now live. Please update your passwords.', 'student,teacher,registrar,finance,admin', 5),
('Enrollment Period Open', 'Enrollment for 2nd Semester 2024-2025 is now open until January 15.', 'student,registrar,admin', 6),
('Tuition Fee Payment Deadline', 'Please settle your balances before January 31 to avoid penalties.', 'student,finance,admin', 7);

