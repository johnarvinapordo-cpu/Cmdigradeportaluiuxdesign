const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/payments - List all payments
router.get('/', async (req, res) => {
  try {
    let query = `
      SELECT p.*, s.student_number, u.name as student_name, s.course
      FROM payments p
      JOIN students s ON p.student_id = s.student_id
      JOIN users u ON s.user_id = u.id
    `;
    const params = [];

    if (req.user.role === 'student') {
      query += ' WHERE s.user_id = ?';
      params.push(req.user.id);
    }

    query += ' ORDER BY p.paid_at DESC';

    const [rows] = await pool.execute(query, params);
    res.json({ payments: rows });
  } catch (error) {
    console.error('List payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments.' });
  }
});

// GET /api/payments/student/:id - Get payments for a student
router.get('/student/:id', async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);

    if (req.user.role === 'student') {
      const [studentCheck] = await pool.execute(
        'SELECT student_id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (studentCheck.length === 0 || studentCheck[0].student_id !== studentId) {
        return res.status(403).json({ message: 'Access denied.' });
      }
    }

    const [payments] = await pool.execute(
      `SELECT p.*, s.student_number, u.name as student_name
       FROM payments p
       JOIN students s ON p.student_id = s.student_id
       JOIN users u ON s.user_id = u.id
       WHERE p.student_id = ?
       ORDER BY p.paid_at DESC`,
      [studentId]
    );

    const [balances] = await pool.execute(
      `SELECT * FROM tuition_balances WHERE student_id = ? ORDER BY school_year DESC, semester DESC`,
      [studentId]
    );

    res.json({ payments, balances });
  } catch (error) {
    console.error('Get student payments error:', error);
    res.status(500).json({ message: 'Failed to fetch payments.' });
  }
});

// POST /api/payments - Record a payment
router.post('/', authorize('finance', 'admin'), async (req, res) => {
  try {
    const { student_id, amount, payment_type, description } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO payments (student_id, amount, payment_type, description, status, recorded_by)
       VALUES (?, ?, ?, ?, 'completed', ?)`,
      [student_id, amount, payment_type, description || null, req.user.id]
    );

    // Update tuition balance
    const [balanceRows] = await pool.execute(
      `SELECT * FROM tuition_balances
       WHERE student_id = ? AND school_year = '2024-2025' AND semester = '1st'`,
      [student_id]
    );

    if (balanceRows.length > 0) {
      const balance = balanceRows[0];
      const newPaid = parseFloat(balance.paid_amount) + parseFloat(amount);
      const newBalance = parseFloat(balance.total_amount) - newPaid;
      await pool.execute(
        `UPDATE tuition_balances SET paid_amount = ?, balance_amount = ? WHERE balance_id = ?`,
        [newPaid, newBalance, balance.balance_id]
      );
    }

    res.status(201).json({ message: 'Payment recorded successfully.', paymentId: result.insertId });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ message: 'Failed to record payment.' });
  }
});

// GET /api/payments/balances - Get all tuition balances
router.get('/balances/all', authorize('finance', 'admin'), async (req, res) => {
  try {
    const [balances] = await pool.execute(
      `SELECT tb.*, s.student_number, u.name as student_name, s.course
       FROM tuition_balances tb
       JOIN students s ON tb.student_id = s.student_id
       JOIN users u ON s.user_id = u.id
       ORDER BY tb.balance_amount DESC`
    );

    res.json({ balances });
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ message: 'Failed to fetch balances.' });
  }
});

// GET /api/payments/summary - Payment summary statistics
router.get('/summary/dashboard', authorize('finance', 'admin'), async (req, res) => {
  try {
    const [totalPayments] = await pool.execute(
      "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'completed'"
    );

    const [pendingPayments] = await pool.execute(
      "SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'pending'"
    );

    const [totalBalances] = await pool.execute(
      'SELECT COALESCE(SUM(balance_amount), 0) as total FROM tuition_balances'
    );

    const [studentCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM students WHERE enrollment_status = \'enrolled\''
    );

    const [recentPayments] = await pool.execute(
      `SELECT p.*, s.student_number, u.name as student_name
       FROM payments p
       JOIN students s ON p.student_id = s.student_id
       JOIN users u ON s.user_id = u.id
       ORDER BY p.paid_at DESC LIMIT 5`
    );

    res.json({
      totalCollected: totalPayments[0].total,
      pendingAmount: pendingPayments[0].total,
      totalOutstanding: totalBalances[0].total,
      enrolledStudents: studentCount[0].count,
      recentPayments
    });
  } catch (error) {
    console.error('Payment summary error:', error);
    res.status(500).json({ message: 'Failed to fetch summary.' });
  }
});

module.exports = router;

