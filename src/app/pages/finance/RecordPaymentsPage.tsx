import { useState } from 'react';
import { Search, CreditCard, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface StudentInfo {
  studentId: string;
  name: string;
  program: string;
  balance: number;
}

export function RecordPaymentsPage() {
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [description, setDescription] = useState('');
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const mockStudents: Record<string, StudentInfo> = {
    'S2024001': { studentId: 'S2024001', name: 'Juan Dela Cruz', program: 'BS Computer Science', balance: 15000 },
    'S2024002': { studentId: 'S2024002', name: 'Maria Garcia', program: 'BS Engineering', balance: 25000 },
    'S2024003': { studentId: 'S2024003', name: 'Pedro Santos', program: 'BA Communication', balance: 0 },
  };

  const handleSearchStudent = async () => {
    setError('');
    setSuccess(false);
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const found = mockStudents[studentId];
    if (found) {
      setStudent(found);
    } else {
      setStudent(null);
      setError('Student not found. Please check the ID and try again.');
    }
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    setSuccess(true);
    setError('');
    setAmount('');
    setDescription('');
    setPaymentMethod('cash');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Record Payment</h1>
        <p className="text-gray-500 mt-1">Record new tuition payments from students</p>
      </div>

      {/* Search Student */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Student
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearchStudent}
              disabled={isSearching || !studentId}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && !student && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {student && (
        <>
          {/* Student Info */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-semibold text-gray-900">{student.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-semibold text-gray-900">{student.program}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Outstanding Balance</p>
                  <p className={`font-semibold text-xl ${student.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₱{student.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₱) *</label>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit/Debit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description / Notes</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Optional notes about this payment..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Payment recorded successfully!
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Record Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudent(null);
                      setStudentId('');
                      setAmount('');
                      setDescription('');
                      setError('');
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

