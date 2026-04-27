const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/students - List all students
router.get('/', authorize('admin', 'registrar', 'teacher'), async (req, res) => {
  try {
    const { search, course, year_level, enrollment_status, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT s.*, u.name, u.email
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ? OR s.student_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (course) {
      query += ' AND s.course = ?';
      params.push(course);
    }
    if (year_level) {
      query += ' AND s.year_level = ?';
      params.push(year_level);
    }
    if (enrollment_status) {
      query += ' AND s.enrollment_status = ?';
      params.push(enrollment_status);
    }

    query += ' ORDER BY s.student_id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);

    // Count
    let countQuery = 'SELECT COUNT(*) as total FROM students s JOIN users u ON s.user_id = u.id WHERE 1=1';
    const countParams = [];
    if (search) {
      countQuery += ' AND (u.name LIKE ? OR u.email LIKE ? OR s.student_number LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (course) {
      countQuery += ' AND s.course = ?';
      countParams.push(course);
    }
    if (year_level) {
      countQuery += ' AND s.year_level = ?';
      countParams.push(year_level);
    }
    if (enrollment_status) {
      countQuery += ' AND s.enrollment_status = ?';
      countParams.push(enrollment_status);
    }
    const [countRows] = await pool.execute(countQuery, countParams);

    res.json({
      students: rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: countRows[0].total }
    });
  } catch (error) {
    console.error('List students error:', error);
    res.status(500).json({ message: 'Failed to fetch students.' });
  }
});

// GET /api/students/:id - Get student details with grades
router.get('/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    const [rows] = await pool.execute(
      `SELECT s.*, u.name, u.email FROM students s JOIN users u ON s.user_id = u.id WHERE s.student_id = ?`,
      [studentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const student = rows[0];

    // Get grades
    const [grades] = await pool.execute(
      `SELECT g.*, subj.code, subj.name as subject_name
       FROM grades g
       JOIN subjects subj ON g.subject_id = subj.subject_id
       WHERE g.student_id = ?`,
      [studentId]
    );

    // Get payments
    const [payments] = await pool.execute(
      `SELECT * FROM payments WHERE student_id = ? ORDER BY paid_at DESC`,
      [studentId]
    );

    // Get balance
    const [balances] = await pool.execute(
      `SELECT * FROM tuition_balances WHERE student_id = ?`,
      [studentId]
    );

    // Get current enrollments
    const [enrollments] = await pool.execute(
      `SELECT e.*, subj.code, subj.name as subject_name, subj.units
       FROM enrollments e
       JOIN subjects subj ON e.subject_id = subj.subject_id
       WHERE e.student_id = ?`,
      [studentId]
    );

    res.json({
      student,
      grades,
      payments,
      balances,
      enrollments
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Failed to fetch student details.' });
  }
});

// PUT /api/students/:id - Update student (admin/registrar)
router.put('/:id', authorize('admin', 'registrar'), async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const { course, year_level, section, enrollment_status } = req.body;

    const updates = [];
    const params = [];

    if (course !== undefined) { updates.push('course = ?'); params.push(course); }
    if (year_level !== undefined) { updates.push('year_level = ?'); params.push(year_level); }
    if (section !== undefined) { updates.push('section = ?'); params.push(section); }
    if (enrollment_status !== undefined) { updates.push('enrollment_status = ?'); params.push(enrollment_status); }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    params.push(studentId);
    await pool.execute(
      `UPDATE students SET ${updates.join(', ')} WHERE student_id = ?`,
      params
    );

    res.json({ message: 'Student updated successfully.' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Failed to update student.' });
  }
});

module.exports = router;

