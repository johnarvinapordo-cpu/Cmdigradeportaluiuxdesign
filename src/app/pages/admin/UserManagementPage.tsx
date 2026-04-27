import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Users, UserCog, Shield, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { UserRole } from '../../types';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  department?: string;
}

export function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<UserRecord[]>([
    { id: 'S2024001', name: 'Juan Dela Cruz', email: 'juan@cmdi.edu.ph', role: 'student', status: 'active', department: 'BS Computer Science' },
    { id: 'T2024001', name: 'Prof. Maria Santos', email: 'maria@cmdi.edu.ph', role: 'teacher', status: 'active', department: 'Computer Science' },
    { id: 'R2024001', name: 'Ana Reyes', email: 'ana.reyes@cmdi.edu.ph', role: 'registrar', status: 'active', department: 'Registrar Office' },
    { id: 'F2024001', name: 'Carlos Mendoza', email: 'carlos@cmdi.edu.ph', role: 'finance', status: 'active', department: 'Finance Office' },
    { id: 'A2024001', name: 'Admin Rodriguez', email: 'admin@cmdi.edu.ph', role: 'admin', status: 'active', department: 'Administration' },
    { id: 'S2024002', name: 'Maria Garcia', email: 'maria@cmdi.edu.ph', role: 'student', status: 'active', department: 'BS Engineering' },
    { id: 'T2024002', name: 'Prof. Pedro Reyes', email: 'pedro@cmdi.edu.ph', role: 'teacher', status: 'inactive', department: 'Mathematics' },
  ]);

  const filteredUsers = users.filter((u: UserRecord) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'student':
        return <Users className="w-4 h-4" />;
      case 'teacher':
        return <UserCog className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-700';
      case 'teacher':
        return 'bg-green-100 text-green-700';
      case 'registrar':
        return 'bg-purple-100 text-purple-700';
      case 'finance':
        return 'bg-orange-100 text-orange-700';
      case 'admin':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1">Manage all system users and their roles</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              aria-label="Filter by role"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="registrar">Registrar</option>
              <option value="finance">Finance</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: UserRecord) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-mono text-sm text-gray-600">{user.id}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{user.department || '-'}</td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

