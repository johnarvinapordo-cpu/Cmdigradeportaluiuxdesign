import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Eye, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface EnrollmentRequest {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  program: string;
  yearLevel: string;
}

export function ManageEnrollmentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requests, setRequests] = useState<EnrollmentRequest[]>([
    { id: 'ENR001', studentId: 'S2024789', studentName: 'Maria Garcia', courseCode: 'CS101', courseName: 'Introduction to Computer Science', date: '2024-03-21', status: 'pending', program: 'BS Computer Science', yearLevel: '1st Year' },
    { id: 'ENR002', studentId: 'S2024790', studentName: 'Juan Santos', courseCode: 'MATH201', courseName: 'Calculus II', date: '2024-03-21', status: 'pending', program: 'BS Engineering', yearLevel: '2nd Year' },
    { id: 'ENR003', studentId: 'S2024791', studentName: 'Ana Reyes', courseCode: 'ENG102', courseName: 'English Composition', date: '2024-03-20', status: 'approved', program: 'BA Communication', yearLevel: '1st Year' },
    { id: 'ENR004', studentId: 'S2024792', studentName: 'Pedro Cruz', courseCode: 'PHY101', courseName: 'Physics I', date: '2024-03-20', status: 'rejected', program: 'BS Engineering', yearLevel: '1st Year' },
    { id: 'ENR005', studentId: 'S2024793', studentName: 'Liza Tan', courseCode: 'CS201', courseName: 'Data Structures', date: '2024-03-19', status: 'pending', program: 'BS Computer Science', yearLevel: '2nd Year' },
    { id: 'ENR006', studentId: 'S2024794', studentName: 'Mark Lim', courseCode: 'CS101', courseName: 'Introduction to Computer Science', date: '2024-03-18', status: 'approved', program: 'BS IT', yearLevel: '1st Year' },
  ]);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r)));
  };

  const handleReject = (id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const } : r)));
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Enrollment</h1>
        <p className="text-gray-500 mt-1">Review and process student enrollment requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold text-orange-600">{pendingCount}</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ClipboardCheck className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <h3 className="text-2xl font-bold text-green-600">{approvedCount}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <h3 className="text-2xl font-bold text-red-600">{rejectedCount}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, or course code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Program / Year</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-mono text-sm text-gray-600">{req.id}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{req.studentName}</p>
                      <p className="text-xs text-gray-500">{req.studentId}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">{req.courseCode}</span>
                      <p className="text-sm text-gray-600 mt-1">{req.courseName}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {req.program}
                      <br />
                      <span className="text-xs text-gray-400">{req.yearLevel}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{req.date}</td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          req.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : req.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
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

