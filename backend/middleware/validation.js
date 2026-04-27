const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Auth validations
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'teacher', 'admin', 'registrar', 'finance']).withMessage('Invalid role'),
  handleValidationErrors
];

// User validations
const updateUserValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid user ID is required'),
  body('name').optional().trim().isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['student', 'teacher', 'admin', 'registrar', 'finance']).withMessage('Invalid role'),
  body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
  handleValidationErrors
];

// Grade validations
const gradeValidation = [
  body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
  body('subject_id').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
  body('prelim').optional().isFloat({ min: 0, max: 100 }).withMessage('Prelim must be 0-100'),
  body('midterm').optional().isFloat({ min: 0, max: 100 }).withMessage('Midterm must be 0-100'),
  body('prefinal').optional().isFloat({ min: 0, max: 100 }).withMessage('Prefinal must be 0-100'),
  body('final').optional().isFloat({ min: 0, max: 100 }).withMessage('Final must be 0-100'),
  handleValidationErrors
];

// Payment validations
const paymentValidation = [
  body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('payment_type').isIn(['tuition', 'miscellaneous', 'laboratory', 'other']).withMessage('Invalid payment type'),
  body('description').optional().trim().isLength({ max: 255 }).withMessage('Description max 255 characters'),
  handleValidationErrors
];

// Enrollment validations
const enrollmentValidation = [
  body('student_id').isInt({ min: 1 }).withMessage('Valid student ID is required'),
  body('subject_id').isInt({ min: 1 }).withMessage('Valid subject ID is required'),
  body('school_year').trim().notEmpty().withMessage('School year is required'),
  body('semester').isIn(['1st', '2nd', 'summer']).withMessage('Semester must be 1st, 2nd, or summer'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  loginValidation,
  registerValidation,
  updateUserValidation,
  gradeValidation,
  paymentValidation,
  enrollmentValidation
};

