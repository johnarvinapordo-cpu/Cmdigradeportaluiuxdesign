// ============================================
// CMDI Grade Portal - Auth & API Utilities
// ============================================

const API_BASE_URL = 'http://localhost:5000/api';

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

// Generic API request
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

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ message: 'Unknown error' }));

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      window.location.href = 'index.html';
    }
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

// Auth functions
async function login(email, password) {
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
    return { success: false, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (e) {
    // ignore
  }
  removeToken();
  window.location.href = 'index.html';
}

async function fetchCurrentUser() {
  try {
    const data = await apiRequest('/auth/me');
    if (data.user) {
      setUser(data.user);
    }
    return data.user;
  } catch (error) {
    console.error('Fetch user error:', error);
    return null;
  }
}

async function changePassword(currentPassword, newPassword) {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

// API helpers
const api = {
  // Users
  getUsers: (params = '') => apiRequest(`/users?${params}`),
  getUser: (id) => apiRequest(`/users/${id}`),
  createUser: (data) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),

  // Students
  getStudents: (params = '') => apiRequest(`/students?${params}`),
  getStudent: (id) => apiRequest(`/students/${id}`),
  updateStudent: (id, data) => apiRequest(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Teachers
  getTeachers: (params = '') => apiRequest(`/teachers?${params}`),
  getTeacher: (id) => apiRequest(`/teachers/${id}`),
  assignSubject: (teacherId, data) => apiRequest(`/teachers/${teacherId}/assign-subject`, { method: 'POST', body: JSON.stringify(data) }),

  // Subjects
  getSubjects: () => apiRequest('/subjects'),
  createSubject: (data) => apiRequest('/subjects', { method: 'POST', body: JSON.stringify(data) }),
  updateSubject: (id, data) => apiRequest(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSubject: (id) => apiRequest(`/subjects/${id}`, { method: 'DELETE' }),

  // Grades
  getStudentGrades: (studentId) => apiRequest(`/grades/student/${studentId}`),
  getTeacherSubjects: () => apiRequest('/grades/teacher/subjects'),
  getSubjectStudents: (subjectId) => apiRequest(`/grades/teacher/students/${subjectId}`),
  submitGrades: (data) => apiRequest('/grades', { method: 'POST', body: JSON.stringify(data) }),
  getAllGrades: () => apiRequest('/grades/all'),

  // Enrollments
  getEnrollments: () => apiRequest('/enrollments'),
  getPendingEnrollments: () => apiRequest('/enrollments/pending'),
  createEnrollment: (data) => apiRequest('/enrollments', { method: 'POST', body: JSON.stringify(data) }),
  approveEnrollment: (id) => apiRequest(`/enrollments/${id}/approve`, { method: 'POST' }),
  rejectEnrollment: (id) => apiRequest(`/enrollments/${id}/reject`, { method: 'POST' }),
  assignSection: (id, section) => apiRequest(`/enrollments/${id}/assign-section`, { method: 'PUT', body: JSON.stringify({ section }) }),

  // Payments
  getPayments: () => apiRequest('/payments'),
  getStudentPayments: (studentId) => apiRequest(`/payments/student/${studentId}`),
  recordPayment: (data) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(data) }),
  getPaymentSummary: () => apiRequest('/payments/summary/dashboard'),
  getBalances: () => apiRequest('/payments/balances/all'),

  // Announcements
  getAnnouncements: () => apiRequest('/announcements'),
  createAnnouncement: (data) => apiRequest('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  deleteAnnouncement: (id) => apiRequest(`/announcements/${id}`, { method: 'DELETE' })
};

