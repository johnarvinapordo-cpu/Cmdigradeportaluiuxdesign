import { createBrowserRouter, Navigate } from 'react-router';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EnrollmentPage } from './pages/EnrollmentPage';
import { GradesPage } from './pages/GradesPage';
import { TuitionPage } from './pages/TuitionPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { EnterGradesPage } from './pages/EnterGradesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { IndexRedirect } from './pages/IndexRedirect';

// Registrar pages
import { ManageEnrollmentPage } from './pages/registrar/ManageEnrollmentPage';
import { ManageCoursesPage } from './pages/registrar/ManageCoursesPage';
import { StudentRecordsPage } from './pages/registrar/StudentRecordsPage';

// Finance pages
import { RecordPaymentsPage } from './pages/finance/RecordPaymentsPage';
import { GenerateReceiptsPage } from './pages/finance/GenerateReceiptsPage';
import { PaymentHistoryPage } from './pages/finance/PaymentHistoryPage';

// Admin pages
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';

// Common pages
import { NotificationsPage } from './pages/common/NotificationsPage';
import { ProfilePage } from './pages/common/ProfilePage';

/**
 * Role-based route protection component
 * Redirects to dashboard if user doesn't have the required role
 */
function RoleRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  // In a real app, this would check the user role from auth context
  // For now, we allow all authenticated users through the DashboardLayout
  // and just render the pages. The sidebar will control navigation visibility.
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <IndexRedirect />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Student routes
      {
        path: 'enrollment',
        element: (
          <RoleRoute allowedRoles={['student']}>
            <EnrollmentPage />
          </RoleRoute>
        ),
      },
      {
        path: 'grades',
        element: (
          <RoleRoute allowedRoles={['student']}>
            <GradesPage />
          </RoleRoute>
        ),
      },
      {
        path: 'tuition',
        element: (
          <RoleRoute allowedRoles={['student']}>
            <TuitionPage />
          </RoleRoute>
        ),
      },
      {
        path: 'evaluations',
        element: (
          <RoleRoute allowedRoles={['student']}>
            <EvaluationPage />
          </RoleRoute>
        ),
      },
      // Teacher routes
      {
        path: 'my-courses',
        element: (
          <RoleRoute allowedRoles={['teacher']}>
            <PlaceholderPage title="My Courses" />
          </RoleRoute>
        ),
      },
      {
        path: 'enter-grades',
        element: (
          <RoleRoute allowedRoles={['teacher']}>
            <EnterGradesPage />
          </RoleRoute>
        ),
      },
      {
        path: 'student-list',
        element: (
          <RoleRoute allowedRoles={['teacher']}>
            <PlaceholderPage title="Student List" />
          </RoleRoute>
        ),
      },
      // Registrar routes
      {
        path: 'manage-enrollment',
        element: (
          <RoleRoute allowedRoles={['registrar']}>
            <ManageEnrollmentPage />
          </RoleRoute>
        ),
      },
      {
        path: 'manage-courses',
        element: (
          <RoleRoute allowedRoles={['registrar']}>
            <ManageCoursesPage />
          </RoleRoute>
        ),
      },
      {
        path: 'student-records',
        element: (
          <RoleRoute allowedRoles={['registrar']}>
            <StudentRecordsPage />
          </RoleRoute>
        ),
      },
      // Finance routes
      {
        path: 'record-payments',
        element: (
          <RoleRoute allowedRoles={['finance']}>
            <RecordPaymentsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'generate-receipts',
        element: (
          <RoleRoute allowedRoles={['finance']}>
            <GenerateReceiptsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'payment-history',
        element: (
          <RoleRoute allowedRoles={['finance']}>
            <PaymentHistoryPage />
          </RoleRoute>
        ),
      },
      // Admin routes
      {
        path: 'student-management',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <PlaceholderPage title="Student Management" />
          </RoleRoute>
        ),
      },
      {
        path: 'teacher-management',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <PlaceholderPage title="Teacher Management" />
          </RoleRoute>
        ),
      },
      {
        path: 'course-management',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <PlaceholderPage title="Course Management" />
          </RoleRoute>
        ),
      },
      {
        path: 'enrollment-management',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <PlaceholderPage title="Enrollment Management" />
          </RoleRoute>
        ),
      },
      {
        path: 'grades-management',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <PlaceholderPage title="Grades Management" />
          </RoleRoute>
        ),
      },
      {
        path: 'financial-services',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <PlaceholderPage title="Financial Services" />
          </RoleRoute>
        ),
      },
      {
        path: 'user-management',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </RoleRoute>
        ),
      },
      {
        path: 'analytics',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <AnalyticsPage />
          </RoleRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <PlaceholderPage title="Reports" />
          </RoleRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <RoleRoute allowedRoles={['admin']}>
            <SystemSettingsPage />
          </RoleRoute>
        ),
      },
      // Common routes (all roles)
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

