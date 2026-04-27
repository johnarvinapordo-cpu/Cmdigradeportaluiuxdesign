import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, BookOpen, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface CourseOffering {
  id: string;
  code: string;
  title: string;
  units: number;
  instructor: string;
  schedule: string;
  room: string;
  capacity: number;
  enrolled: number;
  status: 'active' | 'inactive' | 'full';
  department: string;
}

export function ManageCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<CourseOffering[]>([
    { id: '1', code: 'CS101', title: 'Introduction to Computer Science', units: 3, instructor: 'Prof. Santos', schedule: 'MWF 9:00-10:30 AM', room: 'Room 301', capacity: 50, enrolled: 45, status: 'active', department: 'Computer Science' },
    { id: '2', code: 'CS201', title: 'Data Structures and Algorithms', units: 3, instructor: 'Prof. Reyes', schedule: 'TTh 1:00-2:30 PM', room: 'Room 305', capacity: 40, enrolled: 38, status: 'active', department: 'Computer Science' },
    { id: '3', code: 'CS301', title: 'Database Systems', units: 3, instructor: 'Prof. Garcia', schedule: 'MWF 2:00-3:30 PM', room: 'Room 402', capacity: 45, enrolled: 42, status: 'active', department: 'Computer Science' },
    { id: '4', code: 'CS401', title: 'Software Engineering', units: 3, instructor: 'Prof. Cruz', schedule: 'TTh 9:00-10:30 AM', room: 'Room 408', capacity: 35, enrolled: 35, status: 'full', department: 'Computer Science' },
    { id: '5', code: 'MATH201', title: 'Calculus II', units: 3, instructor: 'Prof. Mendoza', schedule: 'MWF 1:00-2:30 PM', room: 'Room 202', capacity: 50, enrolled: 40, status: 'active', department: 'Mathematics' },
    { id: '6', code: 'ENG102', title: 'English Composition', units: 3, instructor: 'Prof. Lim', schedule: 'MWF 10:30-12:00 PM', room: 'Room 101', capacity: 45, enrolled: 30, status: 'active', department: 'English' },
  ]);

  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Course Offerings</h1>
        <p className="text-gray-500 mt-1">Add, edit, or remove courses for the current semester</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">{course.code}</span>
                  <h3 className="font-semibold text-gray-900 mt-2">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.department}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    course.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : course.status === 'full'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {course.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{course.enrolled} / {course.capacity} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span>{course.room} • {course.units} units</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">Instructor: <span className="font-medium text-gray-700">{course.instructor}</span></p>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

