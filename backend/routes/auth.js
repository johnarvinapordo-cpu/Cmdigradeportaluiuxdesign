const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { authenticate, JWT_SECRET } = require('../middleware/auth');
const { loginValidation } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/login - Login with email and password
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute(
      'SELECT id, name, email, password, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is deactivated.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let profile = rows[0];

    // Fetch role-specific profile data
    if (profile.role === 'student') {
      const [studentRows] = await pool.execute(
        `SELECT s.* FROM students s WHERE s.user_id = ?`,
        [userId]
      );
      if (studentRows.length > 0) {
        profile.student = studentRows[0];
      }
    } else if (profile.role === 'teacher') {
      const [teacherRows] = await pool.execute(
        `SELECT t.* FROM teachers t WHERE t.user_id = ?`,
        [userId]
      );
      if (teacherRows.length > 0) {
        profile.teacher = teacherRows[0];
      }
    }

    res.json({ user: profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

// POST /api/auth/change-password - Change password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [rows] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const validPassword = await bcrypt.compare(currentPassword, rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password.' });
  }
});

module.exports = router;

