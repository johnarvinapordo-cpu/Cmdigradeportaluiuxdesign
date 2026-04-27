const express = require('express');
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

// GET /api/announcements - Get announcements for current user
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, u.name as posted_by_name
       FROM announcements a
       JOIN users u ON a.posted_by = u.id
       WHERE FIND_IN_SET(?, a.target_roles)
       ORDER BY a.created_at DESC`,
      [req.user.role]
    );

    res.json({ announcements: rows });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
});

// POST /api/announcements - Create announcement (admin, registrar, finance)
router.post('/', authorize('admin', 'registrar', 'finance'), async (req, res) => {
  try {
    const { title, content, target_roles } = req.body;

    const roles = Array.isArray(target_roles) ? target_roles.join(',') : target_roles || 'student,teacher,registrar,finance,admin';

    const [result] = await pool.execute(
      `INSERT INTO announcements (title, content, target_roles, posted_by)
       VALUES (?, ?, ?, ?)`,
      [title, content, roles, req.user.id]
    );

    res.status(201).json({ message: 'Announcement posted successfully.', announcementId: result.insertId });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Failed to post announcement.' });
  }
});

// DELETE /api/announcements/:id - Delete announcement
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const announcementId = parseInt(req.params.id);
    await pool.execute('DELETE FROM announcements WHERE announcement_id = ?', [announcementId]);
    res.json({ message: 'Announcement deleted.' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Failed to delete announcement.' });
  }
});

module.exports = router;

