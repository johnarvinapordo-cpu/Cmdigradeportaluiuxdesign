import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  DollarSign,
  ClipboardCheck,
  Bell,
  User,
  LogOut,
  Users,
  UserCog,
  BookMarked,
  FileText,
  Settings,
  BarChart3,
  PenTool,
  Search,
  CreditCard,
  Receipt,
  History,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Common
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['student', 'teacher', 'registrar', 'finance', 'admin'] },

  // Student
  { name: 'Enrollment', path: '/enrollment', icon: BookOpen, roles: ['student'] },
  { name: 'Grades', path: '/grades', icon: GraduationCap, roles: ['student'] },
  { name: 'Tuition / Payments', path: '/tuition', icon: DollarSign, roles: ['student'] },
  { name: 'Evaluations', path: '/evaluations', icon: ClipboardCheck, roles: ['student'] },

  // Teacher
  { name: 'My Courses', path: '/my-courses', icon: BookMarked, roles: ['teacher'] },
  { name: 'Enter Grades', path: '/enter-grades', icon: PenTool, roles: ['teacher'] },
  { name: 'Student List', path: '/student-list', icon: Users, roles: ['teacher'] },

  // Registrar
  { name: 'Manage Enrollment', path: '/manage-enrollment', icon: ClipboardCheck, roles: ['registrar'] },
  { name: 'Manage Courses', path: '/manage-courses', icon: BookOpen, roles: ['registrar'] },
  { name: 'Student Records', path: '/student-records', icon: Search, roles: ['registrar'] },

  // Finance
  { name: 'Record Payments', path: '/record-payments', icon: CreditCard, roles: ['finance'] },
  { name: 'Generate Receipts', path: '/generate-receipts', icon: Receipt, roles: ['finance'] },
  { name: 'Payment History', path: '/payment-history', icon: History, roles: ['finance'] },

  // Admin
  { name: 'Student Management', path: '/student-management', icon: Users, roles: ['admin'] },
  { name: 'Teacher Management', path: '/teacher-management', icon: UserCog, roles: ['admin'] },
  { name: 'Course Management', path: '/course-management', icon: BookMarked, roles: ['admin'] },
  { name: 'Enrollment Management', path: '/enrollment-management', icon: BookOpen, roles: ['admin'] },
  { name: 'Grades Management', path: '/grades-management', icon: GraduationCap, roles: ['admin'] },
  { name: 'Financial Services', path: '/financial-services', icon: DollarSign, roles: ['admin'] },
  { name: 'User Management', path: '/user-management', icon: Shield, roles: ['admin'] },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['admin'] },
  { name: 'Reports', path: '/reports', icon: FileText, roles: ['admin'] },
  { name: 'System Settings', path: '/settings', icon: Settings, roles: ['admin'] },

  // Common
  { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['student', 'teacher', 'registrar', 'finance', 'admin'] },
  { name: 'Profile', path: '/profile', icon: User, roles: ['student', 'teacher', 'registrar', 'finance', 'admin'] },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter((item) => user && item.roles.includes(user.role));

  // Group nav items by category for better organization
  const commonItems = filteredNavItems.filter((i) => i.name === 'Dashboard' || i.name === 'Notifications' || i.name === 'Profile');
  const roleSpecificItems = filteredNavItems.filter((i) => i.name !== 'Dashboard' && i.name !== 'Notifications' && i.name !== 'Profile');

  return (
    <div className="w-64 bg-[#0F172A] text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">CMDI Portal</h1>
            <p className="text-xs text-gray-400">Grade System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Dashboard + Common */}
        <ul className="space-y-1 px-3 mb-4">
          {commonItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Role-specific items */}
        {roleSpecificItems.length > 0 && (
          <div className="px-3">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {user?.role} Menu
            </p>
            <ul className="space-y-1">
              {roleSpecificItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

