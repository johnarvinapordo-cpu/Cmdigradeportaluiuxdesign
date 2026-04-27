const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/teachers - List all teachers
router.get('/', authorize('admin', 'registrar'), async (req, res) => {
  try {
    const { search, department, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = `
      SELECT t.*, u.name, u.email
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ? OR t.employee_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (department) {
      query += ' AND t.department = ?';
      params.push(department);
    }

    query += ' ORDER BY t.teacher_id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);
    res.json({ teachers: rows });
  } catch (error) {
    console.error('List teachers error:', error);
    res.status(500).json({ message: 'Failed to fetch teachers.' });
  }
});

// GET /api/teachers/:id - Get teacher with assigned subjects
router.get('/:id', async (req, res) => {
  try {
    const teacherId = parseInt(req.params.id);

    const [rows] = await pool.execute(
      `SELECT t.*, u.name, u.email FROM teachers t JOIN users u ON t.user_id = u.id WHERE t.teacher_id = ?`,
      [teacherId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    const teacher = rows[0];

    // Get assigned subjects
    const [subjects] = await pool.execute(
      `SELECT ts.*, s.code, s.name, s.units
       FROM teacher_subjects ts
       JOIN subjects s ON ts.subject_id = s.subject_id
       WHERE ts.teacher_id = ?`,
      [teacherId]
    );

    res.json({ teacher, subjects });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ message: 'Failed to fetch teacher details.' });
  }
});

// POST /api/teachers/:id/assign-subject - Assign subject to teacher
router.post('/:id/assign-subject', authorize('admin', 'registrar'), async (req, res) => {
  try {
    const teacherId = parseInt(req.params.id);
    const { subject_id, school_year, semester, section } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO teacher_subjects (teacher_id, subject_id, school_year, semester, section) VALUES (?, ?, ?, ?, ?)',
      [teacherId, subject_id, school_year, semester, section]
    );

    res.status(201).json({ message: 'Subject assigned successfully.', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Subject already assigned for this period.' });
    }
    console.error('Assign subject error:', error);
    res.status(500).json({ message: 'Failed to assign subject.' });
  }
});

module.exports = router;

