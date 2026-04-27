const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/subjects - List all subjects
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM subjects ORDER BY code');
    res.json({ subjects: rows });
  } catch (error) {
    console.error('List subjects error:', error);
    res.status(500).json({ message: 'Failed to fetch subjects.' });
  }
});

// POST /api/subjects - Create subject (admin/registrar)
router.post('/', authorize('admin', 'registrar'), async (req, res) => {
  try {
    const { code, name, description, units, year_level, semester } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO subjects (code, name, description, units, year_level, semester) VALUES (?, ?, ?, ?, ?, ?)',
      [code, name, description || null, units || 3, year_level || null, semester || '1st']
    );

    res.status(201).json({ message: 'Subject created successfully.', subject_id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Subject code already exists.' });
    }
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Failed to create subject.' });
  }
});

// PUT /api/subjects/:id - Update subject
router.put('/:id', authorize('admin', 'registrar'), async (req, res) => {
  try {
    const subjectId = parseInt(req.params.id);
    const { code, name, description, units, year_level, semester } = req.body;

    await pool.execute(
      'UPDATE subjects SET code = ?, name = ?, description = ?, units = ?, year_level = ?, semester = ? WHERE subject_id = ?',
      [code, name, description || null, units || 3, year_level || null, semester || '1st', subjectId]
    );

    res.json({ message: 'Subject updated successfully.' });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Failed to update subject.' });
  }
});

// DELETE /api/subjects/:id - Delete subject
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const subjectId = parseInt(req.params.id);
    await pool.execute('DELETE FROM subjects WHERE subject_id = ?', [subjectId]);
    res.json({ message: 'Subject deleted successfully.' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Failed to delete subject.' });
  }
});

module.exports = router;

