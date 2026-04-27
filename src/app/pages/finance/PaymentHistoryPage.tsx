import { useState } from 'react';
import { Search, Filter, Download, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface PaymentHistoryRecord {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: string;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
  description: string;
}

export function PaymentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const payments: PaymentHistoryRecord[] = [
    { id: 'PAY001', receiptNo: 'RCP-2024-001', studentId: 'S2024001', studentName: 'Juan Dela Cruz', amount: 25000, method: 'Bank Transfer', date: '2024-03-21', status: 'completed', description: 'Tuition - First Installment' },
    { id: 'PAY002', receiptNo: 'RCP-2024-002', studentId: 'S2024002', studentName: 'Maria Garcia', amount: 15000, method: 'Credit Card', date: '2024-03-21', status: 'completed', description: 'Tuition - Partial Payment' },
    { id: 'PAY003', receiptNo: 'RCP-2024-003', studentId: 'S2024003', studentName: 'Pedro Santos', amount: 30000, method: 'Cash', date: '2024-03-20', status: 'completed', description: 'Tuition - Full Payment' },
    { id: 'PAY004', receiptNo: 'RCP-2024-004', studentId: 'S2024001', studentName: 'Juan Dela Cruz', amount: 20000, method: 'Bank Transfer', date: '2024-02-15', status: 'completed', description: 'Tuition - Second Installment' },
    { id: 'PAY005', receiptNo: 'RCP-2024-005', studentId: 'S2024004', studentName: 'Ana Reyes', amount: 15000, method: 'Check', date: '2024-02-10', status: 'pending', description: 'Tuition - Partial Payment' },
    { id: 'PAY006', receiptNo: 'RCP-2024-006', studentId: 'S2024005', studentName: 'Carlos Cruz', amount: 10000, method: 'Cash', date: '2024-01-20', status: 'refunded', description: 'Tuition - Refund' },
  ];

  const filteredPayments = payments.filter((p: PaymentHistoryRecord) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalAmount = filteredPayments.reduce((sum: number, p: PaymentHistoryRecord) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500 mt-1">View all recorded payments and transactions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <h3 className="text-2xl font-bold text-gray-900">{filteredPayments.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <h3 className="text-2xl font-bold text-green-600">₱{totalAmount.toLocaleString()}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <h3 className="text-2xl font-bold text-blue-600">₱85,000</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Search by student, ID, or receipt number..."
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
                  aria-label="Filter by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  aria-label="Filter by payment method"
                >
                  <option value="all">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Records
            </span>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Receipt No</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Method</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment: PaymentHistoryRecord) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-mono text-sm text-gray-600">{payment.receiptNo}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">{payment.studentName}</p>
                      <p className="text-xs text-gray-500">{payment.studentId}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{payment.description}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{payment.method}</td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">₱{payment.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center text-sm text-gray-600">{payment.date}</td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {payment.status}
                      </span>
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

