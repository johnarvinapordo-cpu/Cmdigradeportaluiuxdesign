// ============================================
// CMDI Grade Portal - Auth & Mock API
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

// Mock credentials with role detection
const MOCK_USERS = {
  'student@gmail.com': { password: 'password123', role: 'student', name: 'Juan Dela Cruz', id: 1, student: { student_id: 1, student_number: '2021-0001', course: 'BSIT', year_level: 3, section: '3A' } },
  'teacher@gmail.com': { password: 'password123', role: 'teacher', name: 'Ana Reyes', id: 2, teacher: { teacher_id: 1, employee_number: 'EMP-001', department: 'IT' } },
  'admin@gmail.com': { password: 'password123', role: 'admin', name: 'System Admin', id: 3 },
  'registrar@gmail.com': { password: 'password123', role: 'registrar', name: 'Maria Santos', id: 4 },
  'finance@gmail.com': { password: 'password123', role: 'finance', name: 'Pedro Lim', id: 5 }
};

// Mock data for dashboard
const MOCK_DATA = {
  users: [
    { id: 1, name: 'Juan Dela Cruz', email: 'student@gmail.com', role: 'student', is_active: true },
    { id: 2, name: 'Ana Reyes', email: 'teacher@gmail.com', role: 'teacher', is_active: true },
    { id: 3, name: 'System Admin', email: 'admin@gmail.com', role: 'admin', is_active: true },
    { id: 4, name: 'Maria Santos', email: 'registrar@gmail.com', role: 'registrar', is_active: true },
    { id: 5, name: 'Pedro Lim', email: 'finance@gmail.com', role: 'finance', is_active: true }
  ],
  students: [
    { student_id: 1, name: 'Juan Dela Cruz', student_number: '2021-0001', course: 'BSIT', year_level: 3, section: '3A', enrollment_status: 'enrolled' },
    { student_id: 2, name: 'Maria Garcia', student_number: '2021-0002', course: 'BSIT', year_level: 2, section: '2B', enrollment_status: 'enrolled' },
    { student_id: 3, name: 'Carlos Santos', student_number: '2021-0003', course: 'BSCS', year_level: 1, section: '1A', enrollment_status: 'enrolled' },
    { student_id: 4, name: 'Rosa Lim', student_number: '2021-0004', course: 'BSIT', year_level: 4, section: '4A', enrollment_status: 'enrolled' },
    { student_id: 5, name: 'Pedro Cruz', student_number: '2021-0005', course: 'BSCS', year_level: 3, section: '3A', enrollment_status: 'enrolled' }
  ],
  teachers: [
    { teacher_id: 1, name: 'Ana Reyes', employee_number: 'EMP-001', department: 'IT' },
    { teacher_id: 2, name: 'John Smith', employee_number: 'EMP-002', department: 'CS' },
    { teacher_id: 3, name: 'Maria Gonzalez', employee_number: 'EMP-003', department: 'IT' }
  ],
  subjects: [
    { subject_id: 1, code: 'IT101', name: 'Programming Fundamentals', units: 3, year_level: 1, semester: 1 },
    { subject_id: 2, code: 'IT102', name: 'Web Development', units: 3, year_level: 2, semester: 1 },
    { subject_id: 3, code: 'CS101', name: 'Data Structures', units: 4, year_level: 2, semester: 2 }
  ],
  grades: [
    { student_id: 1, subject_id: 1, subject_name: 'Programming Fundamentals', code: 'IT101', prelim: 85, midterm: 87, prefinal: 88, final: 90, remarks: 'passed' },
    { student_id: 1, subject_id: 2, subject_name: 'Web Development', code: 'IT102', prelim: 80, midterm: 82, prefinal: 85, final: 87, remarks: 'passed' },
    { student_id: 2, subject_id: 1, subject_name: 'Programming Fundamentals', code: 'IT101', prelim: 78, midterm: 80, prefinal: 82, final: 85, remarks: 'passed' }
  ],
  enrollments: [
    { enrollment_id: 1, student_id: 1, student_name: 'Juan Dela Cruz', subject_id: 1, subject_name: 'Programming Fundamentals', code: 'IT101', course: 'BSIT', school_year: '2023-2024', semester: 1, status: 'approved' },
    { enrollment_id: 2, student_id: 1, subject_id: 2, subject_name: 'Web Development', code: 'IT102', course: 'BSIT', school_year: '2023-2024', semester: 1, status: 'pending' },
    { enrollment_id: 3, student_id: 2, subject_id: 1, subject_name: 'Programming Fundamentals', code: 'IT101', course: 'BSIT', school_year: '2023-2024', semester: 1, status: 'pending' }
  ],
  payments: [
    { payment_id: 1, student_id: 1, student_name: 'Juan Dela Cruz', amount: 5000, payment_type: 'tuition', description: 'Tuition Fee', status: 'completed', paid_at: '2024-01-15' },
    { payment_id: 2, student_id: 1, student_name: 'Juan Dela Cruz', amount: 500, payment_type: 'laboratory', description: 'Lab Fee', status: 'completed', paid_at: '2024-01-20' },
    { payment_id: 3, student_id: 2, student_name: 'Maria Garcia', amount: 5000, payment_type: 'tuition', description: 'Tuition Fee', status: 'pending', paid_at: null }
  ],
  balances: [
    { student_id: 1, student_name: 'Juan Dela Cruz', school_year: '2023-2024', semester: 1, total_amount: 10000, paid_amount: 5500, balance_amount: 4500 },
    { student_id: 2, student_name: 'Maria Garcia', school_year: '2023-2024', semester: 1, total_amount: 10000, paid_amount: 0, balance_amount: 10000 },
    { student_id: 3, student_name: 'Carlos Santos', school_year: '2023-2024', semester: 1, total_amount: 10000, paid_amount: 10000, balance_amount: 0 }
  ],
  announcements: [
    { id: 1, title: 'Enrollment Period Extended', content: 'The enrollment period has been extended to January 31, 2024. Please proceed with your enrollment.', created_at: '2024-01-10' },
    { id: 2, title: 'Midterm Exams Schedule', content: 'Midterm exams will be held from February 12 to February 23, 2024. Check your schedule on the portal.', created_at: '2024-01-08' },
    { id: 3, title: 'System Maintenance Notice', content: 'The system will undergo maintenance on January 25, 2024 from 10 PM to 2 AM. Thank you for your patience.', created_at: '2024-01-05' }
  ]
};

// Token management
function getToken() {
  return localStorage.getItem('cmdi_token');
}

function setToken(token) {
  localStorage.setItem('cmdi_token', token);
}

function removeToken() {
  localStorage.removeItem('cmdi_token');
  localStorage.removeItem('cmdi_user');
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('cmdi_user'));
  } catch { return null; }
}

function setUser(user) {
  localStorage.setItem('cmdi_user', JSON.stringify(user));
}

// Generic API request with fallback
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({ message: 'Unknown error' }));

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        window.location.href = '../index.html';
      }
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    // If network error, throw OFFLINE so caller can use mock fallback
    if (error instanceof TypeError || error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      throw new Error('OFFLINE');
    }
    throw error;
  }
}

// Auth functions
async function login(email, password) {
  // Input validation
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  // Try backend first
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    }
    return { success: false, message: data.message || 'Login failed' };
  } catch (error) {
    // Fallback to mock login on any error (network, API, etc)
    console.log('Backend API unavailable, using mock login:', error.message);
    return mockLogin(email, password);
  }
}

function mockLogin(email, password) {
  const mock = MOCK_USERS[email.toLowerCase()];
  if (!mock) {
    return { success: false, message: 'Invalid email or password.' };
  }
  if (mock.password !== password) {
    return { success: false, message: 'Invalid email or password.' };
  }

  const user = {
    id: mock.id,
    name: mock.name,
    email: email.toLowerCase(),
    role: mock.role,
    student: mock.student || null,
    teacher: mock.teacher || null
  };

  setToken('mock-jwt-token-' + Date.now());
  setUser(user);
  return { success: true, user };
}

async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (e) {
    // ignore
  }
  removeToken();
  window.location.href = '../index.html';
}

async function fetchCurrentUser() {
  try {
    const data = await apiRequest('/auth/me');
    if (data.user) {
      setUser(data.user);
      return data.user;
    }
    return null;
  } catch (error) {
    // Always return mock user from localStorage on error
    console.log('Could not fetch user from backend, using localStorage');
    return getUser();
  }
}

async function changePassword(currentPassword, newPassword) {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

// API helpers with mock fallback
const api = {
  // Users
  getUsers: (params = '') => apiRequest(`/users?${params}`).catch(() => ({ users: MOCK_DATA.users })),
  getUser: (id) => apiRequest(`/users/${id}`).catch(() => ({ user: MOCK_DATA.users.find(u => u.id === id) })),
  createUser: (data) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),

  // Students
  getStudents: (params = '') => apiRequest(`/students?${params}`).catch(() => ({ students: MOCK_DATA.students })),
  getStudent: (id) => apiRequest(`/students/${id}`).catch(() => ({ student: MOCK_DATA.students.find(s => s.student_id === id) })),
  updateStudent: (id, data) => apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Teachers
  getTeachers: (params = '') => apiRequest(`/teachers?${params}`).catch(() => ({ teachers: MOCK_DATA.teachers })),
  getTeacher: (id) => apiRequest(`/teachers/${id}`).catch(() => ({ teacher: MOCK_DATA.teachers.find(t => t.teacher_id === id) })),
  assignSubject: (teacherId, data) => apiRequest(`/teachers/${teacherId}/assign-subject`, { method: 'POST', body: JSON.stringify(data) }),

  // Subjects
  getSubjects: () => apiRequest('/subjects').catch(() => ({ subjects: MOCK_DATA.subjects })),
  createSubject: (data) => apiRequest('/subjects', { method: 'POST', body: JSON.stringify(data) }),
  updateSubject: (id, data) => apiRequest(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubject: (id) => apiRequest(`/subjects/${id}`, { method: 'DELETE' }),

  // Grades
  getStudentGrades: (studentId) => apiRequest(`/grades/student/${studentId}`).catch(() => ({ grades: MOCK_DATA.grades.filter(g => g.student_id === studentId) })),
  getTeacherSubjects: () => apiRequest('/grades/teacher/subjects').catch(() => ({ subjects: MOCK_DATA.subjects.slice(0, 3) })),
  getSubjectStudents: (subjectId) => apiRequest(`/grades/teacher/students/${subjectId}`).catch(() => ({ students: MOCK_DATA.students.slice(0, 5).map(s => ({ ...s, prelim: 85, midterm: 87, prefinal: 88, final: 90 })) })),
  submitGrades: (data) => apiRequest('/grades', { method: 'POST', body: JSON.stringify(data) }),
  getAllGrades: () => apiRequest('/grades/all').catch(() => ({ grades: MOCK_DATA.grades })),

  // Enrollments
  getEnrollments: () => apiRequest('/enrollments').catch(() => ({ enrollments: MOCK_DATA.enrollments })),
  getPendingEnrollments: () => apiRequest('/enrollments/pending').catch(() => ({ enrollments: MOCK_DATA.enrollments.filter(e => e.status === 'pending') })),
  createEnrollment: (data) => apiRequest('/enrollments', { method: 'POST', body: JSON.stringify(data) }),
  approveEnrollment: (id) => apiRequest(`/enrollments/${id}/approve`, { method: 'POST' }),
  rejectEnrollment: (id) => apiRequest(`/enrollments/${id}/reject`, { method: 'POST' }),
  assignSection: (id, section) => apiRequest(`/enrollments/${id}/assign-section`, { method: 'PUT', body: JSON.stringify({ section }) }),

  // Payments
  getPayments: () => apiRequest('/payments').catch(() => ({ payments: MOCK_DATA.payments })),
  getStudentPayments: (studentId) => apiRequest(`/payments/student/${studentId}`).catch(() => ({ payments: MOCK_DATA.payments.filter(p => p.student_id === studentId), balances: MOCK_DATA.balances.filter(b => b.student_id === studentId) })),
  recordPayment: (data) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(data) }),
  getPaymentSummary: () => apiRequest('/payments/summary/dashboard').catch(() => ({ totalCollected: 125000, totalOutstanding: 45000, enrolledStudents: 42, recentPayments: MOCK_DATA.payments.slice(0, 5) })),
  getBalances: () => apiRequest('/payments/balances/all').catch(() => ({ balances: MOCK_DATA.balances })),

  // Announcements
  getAnnouncements: () => apiRequest('/announcements').catch(() => ({ announcements: MOCK_DATA.announcements })),
  createAnnouncement: (data) => apiRequest('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => apiRequest(`/announcements/${id}`, { method: 'DELETE' })
};

