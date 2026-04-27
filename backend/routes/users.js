const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');
const { registerValidation, updateUserValidation } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/users - List all users (admin only)
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = 'SELECT id, name, email, role, is_active, created_at FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];
    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }
    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }
    const [countRows] = await pool.execute(countQuery, countParams);

    res.json({
      users: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countRows[0].total
      }
    });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// GET /api/users/:id - Get user by ID (admin or self)
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Only admin or the user themselves can view
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
});

// POST /api/users - Create new user (admin only)
router.post('/', authorize('admin'), registerValidation, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    // Create role-specific records
    if (role === 'student') {
      const studentNumber = 'S' + (2024000 + result.insertId);
      await pool.execute(
        'INSERT INTO students (user_id, student_number, course, year_level) VALUES (?, ?, ?, ?)',
        [result.insertId, studentNumber, 'Undeclared', 1]
      );
    } else if (role === 'teacher') {
      const employeeNumber = 'T' + (2024000 + result.insertId);
      await pool.execute(
        'INSERT INTO teachers (user_id, employee_number) VALUES (?, ?)',
        [result.insertId, employeeNumber]
      );
    }

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Failed to create user.' });
  }
});

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', authorize('admin'), updateUserValidation, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, role, is_active } = req.body;

    const updates = [];
    const params = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (role !== undefined) { updates.push('role = ?'); params.push(role); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active); }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update.' });
    }

    params.push(userId);
    await pool.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ message: 'User updated successfully.' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

module.exports = router;

