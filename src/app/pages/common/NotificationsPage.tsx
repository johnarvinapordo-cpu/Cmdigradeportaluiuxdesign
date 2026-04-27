import { useState } from 'react';
import { Bell, CheckCircle, Trash2, Filter, BookOpen, DollarSign, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'academic' | 'financial' | 'system';
  priority: 'high' | 'medium' | 'low';
  date: string;
  read: boolean;
}

export function NotificationsPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Midterm Examination Schedule Released', message: 'The midterm examination schedule has been published. Please check your enrolled courses.', category: 'academic', priority: 'high', date: '2024-03-21', read: false },
    { id: '2', title: 'Tuition Payment Due', message: 'Your tuition payment of ₱15,000 is due on April 30, 2024.', category: 'financial', priority: 'high', date: '2024-03-20', read: false },
    { id: '3', title: 'Library Hours Extended', message: 'Library hours have been extended until 10:00 PM for the exam period.', category: 'academic', priority: 'low', date: '2024-03-19', read: true },
    { id: '4', title: 'System Maintenance', message: 'The portal will be under maintenance on March 25, 2024 from 2:00 AM to 6:00 AM.', category: 'system', priority: 'medium', date: '2024-03-18', read: true },
    { id: '5', title: 'Course Evaluation Period Open', message: 'Please complete your course evaluations before April 5, 2024.', category: 'academic', priority: 'medium', date: '2024-03-17', read: false },
    { id: '6', title: 'Scholarship Application Results', message: 'Scholarship application results are now available. Check your email for details.', category: 'financial', priority: 'high', date: '2024-03-16', read: false },
  ]);

  const filteredNotifications = notifications.filter(
    (n) => categoryFilter === 'all' || n.category === categoryFilter
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return { icon: BookOpen, color: 'bg-blue-100 text-blue-600' };
      case 'financial':
        return { icon: DollarSign, color: 'bg-green-100 text-green-600' };
      case 'system':
        return { icon: Settings, color: 'bg-purple-100 text-purple-600' };
      default:
        return { icon: Bell, color: 'bg-gray-100 text-gray-600' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              {['all', 'academic', 'financial', 'system'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => {
          const { icon: Icon, color } = getCategoryIcon(notification.category);
          return (
            <Card
              key={notification.id}
              className={`transition-colors ${!notification.read ? 'border-blue-300 bg-blue-50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          <span className="text-xs text-gray-400">{notification.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
              <p className="text-gray-500">You have no notifications in this category.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

