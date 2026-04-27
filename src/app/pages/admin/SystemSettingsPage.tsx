import { useState } from 'react';
import { Save, RotateCcw, Settings, School, Calendar, Bell, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    schoolName: 'CARD-MRI Development Institute Inc.',
    semester: 'Second Semester 2023-2024',
    semesterStart: '2024-01-15',
    semesterEnd: '2024-05-30',
    gradingPeriodStart: '2024-03-01',
    gradingPeriodEnd: '2024-03-31',
    enrollmentDeadline: '2024-01-20',
    emailNotifications: true,
    smsNotifications: false,
    autoApproveEnrollments: false,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setSettings({
        schoolName: 'CARD-MRI Development Institute Inc.',
        semester: 'Second Semester 2023-2024',
        semesterStart: '2024-01-15',
        semesterEnd: '2024-05-30',
        gradingPeriodStart: '2024-03-01',
        gradingPeriodEnd: '2024-03-31',
        enrollmentDeadline: '2024-01-20',
        emailNotifications: true,
        smsNotifications: false,
        autoApproveEnrollments: false,
        maintenanceMode: false,
      });
      setSaved(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure portal settings and preferences</p>
      </div>

      {/* School Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="w-5 h-5" />
            School Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
            <input
              type="text"
              value={settings.schoolName}
              onChange={(e) => handleChange('schoolName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
            <input
              type="text"
              value={settings.semester}
              onChange={(e) => handleChange('semester', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Academic Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Academic Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester Start Date</label>
              <input
                type="date"
                value={settings.semesterStart}
                onChange={(e) => handleChange('semesterStart', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester End Date</label>
              <input
                type="date"
                value={settings.semesterEnd}
                onChange={(e) => handleChange('semesterEnd', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grading Period Start</label>
              <input
                type="date"
                value={settings.gradingPeriodStart}
                onChange={(e) => handleChange('gradingPeriodStart', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grading Period End</label>
              <input
                type="date"
                value={settings.gradingPeriodEnd}
                onChange={(e) => handleChange('gradingPeriodEnd', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Deadline</label>
              <input
                type="date"
                value={settings.enrollmentDeadline}
                onChange={(e) => handleChange('enrollmentDeadline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Send email alerts for important events</p>
            </div>
            <button
              onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Send SMS alerts for urgent updates</p>
            </div>
            <button
              onClick={() => handleChange('smsNotifications', !settings.smsNotifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.smsNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Auto-Approve Enrollments</p>
              <p className="text-sm text-gray-500">Automatically approve enrollment requests without review</p>
            </div>
            <button
              onClick={() => handleChange('autoApproveEnrollments', !settings.autoApproveEnrollments)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.autoApproveEnrollments ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.autoApproveEnrollments ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Temporarily disable access for non-admin users</p>
            </div>
            <button
              onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg">
            <Settings className="w-4 h-4" />
            Settings saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}

