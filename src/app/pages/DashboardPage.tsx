import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { RegistrarDashboard } from './RegistrarDashboard';
import { FinanceDashboard } from './FinanceDashboard';
import { AdminDashboard } from './AdminDashboard';

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'registrar':
      return <RegistrarDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Invalid user role</div>;
  }
}

