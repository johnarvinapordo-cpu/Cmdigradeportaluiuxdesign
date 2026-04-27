const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/grades/student/:id - Get grades for a student
router.get('/student/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    // Students can only view their own grades; teachers/admins can view any
    if (req.user.role === 'student') {
      const [studentCheck] = await pool.execute(
        'SELECT student_id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (studentCheck.length === 0 || studentCheck[0].student_id !== studentId) {
        return res.status(403).json({ message: 'Access denied.' });
      }
    }

    const [grades] = await pool.execute(
      `SELECT g.*, s.code, s.name as subject_name, s.units, u.name as teacher_name
       FROM grades g
       JOIN subjects s ON g.subject_id = s.subject_id
       JOIN teachers t ON g.teacher_id = t.teacher_id
       JOIN users u ON t.user_id = u.id
       WHERE g.student_id = ?`,
      [studentId]
    );

    res.json({ grades });
  } catch (error) {
    console.error('Get student grades error:', error);
    res.status(500).json({ message: 'Failed to fetch grades.' });
  }
});

// GET /api/grades/teacher/subjects - Get subjects assigned to current teacher
router.get('/teacher/subjects', authorize('teacher'), async (req, res) => {
  try {
    const [teacherRows] = await pool.execute(
      'SELECT teacher_id FROM teachers WHERE user_id = ?',
      [req.user.id]
    );

    if (teacherRows.length === 0) {
      return res.status(404).json({ message: 'Teacher record not found.' });
    }

    const teacherId = teacherRows[0].teacher_id;

    const [subjects] = await pool.execute(
      `SELECT ts.*, s.code, s.name, s.units, s.year_level
       FROM teacher_subjects ts
       JOIN subjects s ON ts.subject_id = s.subject_id
       WHERE ts.teacher_id = ?`,
      [teacherId]
    );

    res.json({ subjects });
  } catch (error) {
    console.error('Get teacher subjects error:', error);
    res.status(500).json({ message: 'Failed to fetch subjects.' });
  }
});

// GET /api/grades/teacher/students/:subjectId - Get students for a subject
router.get('/teacher/students/:subjectId', authorize('teacher'), async (req, res) => {
  try {
    const subjectId = parseInt(req.params.subjectId);

    const [teacherRows] = await pool.execute(
      'SELECT teacher_id FROM teachers WHERE user_id = ?',
      [req.user.id]
    );

    if (teacherRows.length === 0) {
      return res.status(404).json({ message: 'Teacher record not found.' });
    }

    const teacherId = teacherRows[0].teacher_id;

    const [students] = await pool.execute(
      `SELECT s.student_id, s.student_number, u.name, s.course, s.year_level, s.section,
              g.prelim, g.midterm, g.prefinal, g.final, g.remarks, g.grade_id
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN grades g ON s.student_id = g.student_id AND g.subject_id = ? AND g.teacher_id = ?
       JOIN enrollments e ON s.student_id = e.student_id AND e.subject_id = ? AND e.status = 'approved'
       WHERE s.enrollment_status = 'enrolled'`,
      [subjectId, teacherId, subjectId]
    );

    res.json({ students });
  } catch (error) {
    console.error('Get students for subject error:', error);
    res.status(500).json({ message: 'Failed to fetch students.' });
  }
});

// POST /api/grades - Submit or update grades
router.post('/', authorize('teacher', 'admin'), async (req, res) => {
  try {
    const { student_id, subject_id, prelim, midterm, prefinal, final } = req.body;

    const [teacherRows] = await pool.execute(
      'SELECT teacher_id FROM teachers WHERE user_id = ?',
      [req.user.id]
    );

    const teacherId = teacherRows.length > 0 ? teacherRows[0].teacher_id : null;

    // Calculate final average and remarks
    const grades = [prelim, midterm, prefinal, final].filter(g => g !== null && g !== undefined);
    const average = grades.length > 0 ? grades.reduce((a, b) => a + parseFloat(b), 0) / grades.length : null;
    const remarks = average !== null ? (average >= 75 ? 'passed' : 'failed') : null;

    // Check if grade record exists
    const [existing] = await pool.execute(
      'SELECT grade_id FROM grades WHERE student_id = ? AND subject_id = ?',
      [student_id, subject_id]
    );

    if (existing.length > 0) {
      await pool.execute(
        `UPDATE grades SET prelim = ?, midterm = ?, prefinal = ?, final = ?, remarks = ?
         WHERE grade_id = ?`,
        [prelim || null, midterm || null, prefinal || null, final || null, remarks, existing[0].grade_id]
      );
    } else {
      await pool.execute(
        `INSERT INTO grades (student_id, subject_id, teacher_id, prelim, midterm, prefinal, final, remarks)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [student_id, subject_id, teacherId, prelim || null, midterm || null, prefinal || null, final || null, remarks]
      );
    }

    res.json({ message: 'Grades saved successfully.' });
  } catch (error) {
    console.error('Save grades error:', error);
    res.status(500).json({ message: 'Failed to save grades.' });
  }
});

// GET /api/grades/all - Get all grades (admin only)
router.get('/all', authorize('admin'), async (req, res) => {
  try {
    const [grades] = await pool.execute(
      `SELECT g.*, s.code, s.name as subject_name, st.student_number, u.name as student_name
       FROM grades g
       JOIN subjects s ON g.subject_id = s.subject_id
       JOIN students st ON g.student_id = st.student_id
       JOIN users u ON st.user_id = u.id
       ORDER BY g.updated_at DESC`
    );

    res.json({ grades });
  } catch (error) {
    console.error('Get all grades error:', error);
    res.status(500).json({ message: 'Failed to fetch grades.' });
  }
});

module.exports = router;

