/**
 * API Service Layer - Placeholder for backend integration
 * 
 * This file provides typed request/response wrappers around fetch/axios.
 * In production, replace the mock implementations with actual API calls
 * to the Python (Flask/Django) backend.
 */

import { User, Course, Grade, Payment, Evaluation, Announcement } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to get auth token from storage
function getToken(): string | null {
  return localStorage.getItem('cmdi_token');
}

// Generic request wrapper with auth header
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ==================== AUTH API ====================

export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (): Promise<void> =>
    apiRequest<void>('/auth/logout', {
      method: 'POST',
    }),

  me: (): Promise<User> =>
    apiRequest<User>('/auth/me'),
};

// ==================== USER API ====================

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  password: string;
}

export const userApi = {
  getAll: (): Promise<User[]> =>
    apiRequest<User[]>('/users'),

  getById: (id: string): Promise<User> =>
    apiRequest<User>(`/users/${id}`),

  create: (data: CreateUserRequest): Promise<User> =>
    apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateUserRequest>): Promise<User> =>
    apiRequest<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    apiRequest<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== COURSE API ====================

export const courseApi = {
  getAll: (): Promise<Course[]> =>
    apiRequest<Course[]>('/courses'),

  getById: (id: string): Promise<Course> =>
    apiRequest<Course>(`/courses/${id}`),

  create: (data: Omit<Course, 'id'>): Promise<Course> =>
    apiRequest<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Course>): Promise<Course> =>
    apiRequest<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<void> =>
    apiRequest<void>(`/courses/${id}`, {
      method: 'DELETE',
    }),
};

// ==================== GRADE API ====================

export const gradeApi = {
  getByStudent: (studentId: string): Promise<Grade[]> =>
    apiRequest<Grade[]>(`/grades/student/${studentId}`),

  getByCourse: (courseCode: string): Promise<Grade[]> =>
    apiRequest<Grade[]>(`/grades/course/${courseCode}`),

  submit: (data: Partial<Grade>[]): Promise<Grade[]> =>
    apiRequest<Grade[]>('/grades', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ==================== PAYMENT API ====================

export const paymentApi = {
  getAll: (): Promise<Payment[]> =>
    apiRequest<Payment[]>('/payments'),

  getByStudent: (studentId: string): Promise<Payment[]> =>
    apiRequest<Payment[]>(`/payments/student/${studentId}`),

  create: (data: Omit<Payment, 'id'>): Promise<Payment> =>
    apiRequest<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  generateReceipt: (paymentId: string): Promise<{ receiptUrl: string }> =>
    apiRequest<{ receiptUrl: string }>(`/payments/${paymentId}/receipt`),
};

// ==================== ENROLLMENT API ====================

export interface EnrollmentRequest {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const enrollmentApi = {
  getAll: (): Promise<EnrollmentRequest[]> =>
    apiRequest<EnrollmentRequest[]>('/enrollments'),

  approve: (id: string): Promise<EnrollmentRequest> =>
    apiRequest<EnrollmentRequest>(`/enrollments/${id}/approve`, {
      method: 'POST',
    }),

  reject: (id: string): Promise<EnrollmentRequest> =>
    apiRequest<EnrollmentRequest>(`/enrollments/${id}/reject`, {
      method: 'POST',
    }),
};

// ==================== ANNOUNCEMENT API ====================

export const announcementApi = {
  getAll: (): Promise<Announcement[]> =>
    apiRequest<Announcement[]>('/announcements'),

  create: (data: Omit<Announcement, 'id'>): Promise<Announcement> =>
    apiRequest<Announcement>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

