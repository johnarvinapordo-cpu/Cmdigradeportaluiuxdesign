import { useState } from 'react';
import { Search, Filter, Users, GraduationCap, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface StudentRecord {
  id: string;
  studentId: string;
  name: string;
  email: string;
  program: string;
  yearLevel: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  gpa: number;
  enrolledCourses: number;
}

export function StudentRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const students: StudentRecord[] = [
    { id: '1', studentId: 'S2024001', name: 'Juan Dela Cruz', email: 'juan@cmdi.edu.ph', program: 'BS Computer Science', yearLevel: '2nd Year', status: 'active', gpa: 3.75, enrolledCourses: 6 },
    { id: '2', studentId: 'S2024002', name: 'Maria Garcia', email: 'maria@cmdi.edu.ph', program: 'BS Engineering', yearLevel: '3rd Year', status: 'active', gpa: 3.50, enrolledCourses: 5 },
    { id: '3', studentId: 'S2024003', name: 'Pedro Santos', email: 'pedro@cmdi.edu.ph', program: 'BA Communication', yearLevel: '1st Year', status: 'active', gpa: 3.20, enrolledCourses: 6 },
    { id: '4', studentId: 'S2024004', name: 'Ana Reyes', email: 'ana@cmdi.edu.ph', program: 'BS Accountancy', yearLevel: '4th Year', status: 'active', gpa: 3.85, enrolledCourses: 5 },
    { id: '5', studentId: 'S2024005', name: 'Carlos Cruz', email: 'carlos@cmdi.edu.ph', program: 'BS Computer Science', yearLevel: '2nd Year', status: 'suspended', gpa: 2.80, enrolledCourses: 0 },
    { id: '6', studentId: 'S2024006', name: 'Liza Tan', email: 'liza@cmdi.edu.ph', program: 'BS Engineering', yearLevel: '1st Year', status: 'active', gpa: 3.60, enrolledCourses: 6 },
  ];

  const filteredStudents = students.filter((s: StudentRecord) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = programFilter === 'all' || s.program === programFilter;
    const matchesYear = yearFilter === 'all' || s.yearLevel === yearFilter;
    return matchesSearch && matchesProgram && matchesYear;
  });

  const programs = ['BS Computer Science', 'BS Engineering', 'BA Communication', 'BS Accountancy', 'BS IT'];
  const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
        <p className="text-gray-500 mt-1">View and manage all student academic records</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  aria-label="Filter by program"
                >
                  <option value="all">All Programs</option>
                  {programs.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  aria-label="Filter by year level"
                >
                  <option value="all">All Years</option>
                  {yearLevels.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Student List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Program</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Year</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">GPA</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Courses</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student: StudentRecord) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-mono text-sm text-gray-600">{student.studentId}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{student.program}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{student.yearLevel}</td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`font-bold ${
                          student.gpa >= 3.5 ? 'text-green-600' : student.gpa >= 3.0 ? 'text-blue-600' : 'text-orange-600'
                        }`}
                      >
                        {student.gpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">{student.enrolledCourses}</td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : student.status === 'suspended'
                            ? 'bg-red-100 text-red-700'
                            : student.status === 'graduated'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
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

