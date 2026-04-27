const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/enrollments - List all enrollments
router.get('/', async (req, res) => {
  try {
    let query = `
      SELECT e.*, s.student_number, u.name as student_name, s.course, s.year_level,
             sub.code, sub.name as subject_name, sub.units
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN users u ON s.user_id = u.id
      JOIN subjects sub ON e.subject_id = sub.subject_id
    `;
    const params = [];

    // Students see only their own
    if (req.user.role === 'student') {
      query += ' WHERE s.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY e.enrolled_at DESC';

    const [rows] = await pool.execute(query, params);
    res.json({ enrollments: rows });
  } catch (error) {
    console.error('List enrollments error:', error);
    res.status(500).json({ message: 'Failed to fetch enrollments.' });
  }
});

// GET /api/enrollments/pending - Get pending enrollments
router.get('/pending', authorize('registrar', 'admin'), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT e.*, s.student_number, u.name as student_name, s.course, s.year_level,
              sub.code, sub.name as subject_name
       FROM enrollments e
       JOIN students s ON e.student_id = s.student_id
       JOIN users u ON s.user_id = u.id
       JOIN subjects sub ON e.subject_id = sub.subject_id
       WHERE e.status = 'pending'
       ORDER BY e.enrolled_at DESC`
    );
    res.json({ enrollments: rows });
  } catch (error) {
    console.error('Get pending enrollments error:', error);
    res.status(500).json({ message: 'Failed to fetch pending enrollments.' });
  }
});

// POST /api/enrollments - Create enrollment
router.post('/', authorize('student', 'registrar', 'admin'), async (req, res) => {
  try {
    let { student_id, subject_id, school_year, semester } = req.body;

    // If student is enrolling themselves
    if (req.user.role === 'student') {
      const [studentRows] = await pool.execute(
        'SELECT student_id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (studentRows.length === 0) {
        return res.status(404).json({ message: 'Student record not found.' });
      }
      student_id = studentRows[0].student_id;
    }

    // Check for duplicate enrollment
    const [existing] = await pool.execute(
      'SELECT enrollment_id FROM enrollments WHERE student_id = ? AND subject_id = ? AND school_year = ? AND semester = ?',
      [student_id, subject_id, school_year, semester]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Already enrolled in this subject for the selected term.' });
    }

    const [result] = await pool.execute(
      `INSERT INTO enrollments (student_id, subject_id, school_year, semester, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [student_id, subject_id, school_year, semester]
    );

    res.status(201).json({ message: 'Enrollment submitted successfully.', enrollmentId: result.insertId });
  } catch (error) {
    console.error('Create enrollment error:', error);
    res.status(500).json({ message: 'Failed to create enrollment.' });
  }
});

// POST /api/enrollments/:id/approve - Approve enrollment
router.post('/:id/approve', authorize('registrar', 'admin'), async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id);

    await pool.execute(
      "UPDATE enrollments SET status = 'approved' WHERE enrollment_id = ?",
      [enrollmentId]
    );

    // Update student enrollment status to enrolled
    await pool.execute(
      `UPDATE students SET enrollment_status = 'enrolled'
       WHERE student_id = (SELECT student_id FROM enrollments WHERE enrollment_id = ?)`,
      [enrollmentId]
    );

    res.json({ message: 'Enrollment approved.' });
  } catch (error) {
    console.error('Approve enrollment error:', error);
    res.status(500).json({ message: 'Failed to approve enrollment.' });
  }
});

// POST /api/enrollments/:id/reject - Reject enrollment
router.post('/:id/reject', authorize('registrar', 'admin'), async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id);

    await pool.execute(
      "UPDATE enrollments SET status = 'rejected' WHERE enrollment_id = ?",
      [enrollmentId]
    );

    res.json({ message: 'Enrollment rejected.' });
  } catch (error) {
    console.error('Reject enrollment error:', error);
    res.status(500).json({ message: 'Failed to reject enrollment.' });
  }
});

// PUT /api/enrollments/:id/assign-section - Assign section to student
router.put('/:id/assign-section', authorize('registrar', 'admin'), async (req, res) => {
  try {
    const enrollmentId = parseInt(req.params.id);
    const { section } = req.body;

    const [enrollmentRows] = await pool.execute(
      'SELECT student_id FROM enrollments WHERE enrollment_id = ?',
      [enrollmentId]
    );

    if (enrollmentRows.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    await pool.execute(
      'UPDATE students SET section = ? WHERE student_id = ?',
      [section, enrollmentRows[0].student_id]
    );

    res.json({ message: 'Section assigned successfully.' });
  } catch (error) {
    console.error('Assign section error:', error);
    res.status(500).json({ message: 'Failed to assign section.' });
  }
});

module.exports = router;

