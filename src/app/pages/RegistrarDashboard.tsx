import { BookOpen, ClipboardCheck, Users, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function RegistrarDashboard() {
  const stats = [
    {
      title: 'Pending Enrollments',
      value: '24',
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      description: 'Awaiting approval',
    },
    {
      title: 'Active Courses',
      value: '156',
      icon: BookOpen,
      color: 'bg-blue-500',
      description: 'This semester',
    },
    {
      title: 'Total Students',
      value: '2,456',
      icon: Users,
      color: 'bg-green-500',
      description: 'Enrolled',
    },
    {
      title: 'Evaluation Period',
      value: 'Open',
      icon: FileText,
      color: 'bg-purple-500',
      description: 'Ends April 15',
    },
  ];

  const enrollmentRequests = [
    { id: 'ENR001', student: 'Maria Garcia', studentId: 'S2024789', course: 'CS101', date: '2024-03-21', status: 'pending' },
    { id: 'ENR002', student: 'Juan Santos', studentId: 'S2024790', course: 'MATH201', date: '2024-03-21', status: 'pending' },
    { id: 'ENR003', student: 'Ana Reyes', studentId: 'S2024791', course: 'ENG102', date: '2024-03-20', status: 'approved' },
    { id: 'ENR004', student: 'Pedro Cruz', studentId: 'S2024792', course: 'PHY101', date: '2024-03-20', status: 'rejected' },
    { id: 'ENR005', student: 'Liza Tan', studentId: 'S2024793', course: 'CS201', date: '2024-03-19', status: 'pending' },
  ];

  const recentActivities = [
    { action: 'Approved enrollment for S2024789 in CS101', date: '2 hours ago', type: 'approval' },
    { action: 'Updated course schedule for CS301', date: '5 hours ago', type: 'update' },
    { action: 'Rejected enrollment for S2024792 - prerequisite not met', date: '1 day ago', type: 'rejection' },
    { action: 'Added new course offering: CS501 Advanced AI', date: '2 days ago', type: 'creation' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registrar Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage enrollments, courses, and student records</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Requests */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" />
              Recent Enrollment Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enrollmentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{request.student}</h4>
                      <p className="text-sm text-gray-500">{request.studentId} • {request.course}</p>
                      <p className="text-xs text-gray-400">{request.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.status === 'pending' && (
                      <>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Manage Courses</p>
                <p className="text-xs text-gray-500">Add or update course offerings</p>
              </button>
              <button className="w-full p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-gray-900">Student Records</p>
                <p className="text-xs text-gray-500">View and manage student data</p>
              </button>
              <button className="w-full p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
                <FileText className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">Generate Reports</p>
                <p className="text-xs text-gray-500">Enrollment and academic reports</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{activity.action}</h4>
                  <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded capitalize ${
                  activity.type === 'approval' ? 'bg-green-100 text-green-700' :
                  activity.type === 'rejection' ? 'bg-red-100 text-red-700' :
                  activity.type === 'update' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

