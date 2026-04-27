import { useState } from 'react';
import { Receipt, Search, Printer, Download, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface PaymentRecord {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: string;
  date: string;
  description: string;
}

export function GenerateReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  const payments: PaymentRecord[] = [
    { id: 'PAY001', receiptNo: 'RCP-2024-001', studentId: 'S2024001', studentName: 'Juan Dela Cruz', amount: 25000, method: 'Bank Transfer', date: '2024-03-21', description: 'Tuition - First Installment' },
    { id: 'PAY002', receiptNo: 'RCP-2024-002', studentId: 'S2024002', studentName: 'Maria Garcia', amount: 15000, method: 'Credit Card', date: '2024-03-21', description: 'Tuition - Partial Payment' },
    { id: 'PAY003', receiptNo: 'RCP-2024-003', studentId: 'S2024003', studentName: 'Pedro Santos', amount: 30000, method: 'Cash', date: '2024-03-20', description: 'Tuition - Full Payment' },
    { id: 'PAY004', receiptNo: 'RCP-2024-004', studentId: 'S2024001', studentName: 'Juan Dela Cruz', amount: 20000, method: 'Bank Transfer', date: '2024-02-15', description: 'Tuition - Second Installment' },
  ];

  const filteredPayments = payments.filter(
    (p: PaymentRecord) =>
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Receipts</h1>
        <p className="text-gray-500 mt-1">Generate and print payment receipts for students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Payment Records
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by student name, ID, or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                {filteredPayments.map((payment: PaymentRecord) => (
                  <button
                    key={payment.id}
                    onClick={() => setSelectedPayment(payment)}
                    className={`w-full text-left p-4 border rounded-lg transition-colors ${
                      selectedPayment?.id === payment.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {payment.receiptNo}
                          </span>
                          <span className="text-xs text-gray-500">{payment.date}</span>
                        </div>
                        <p className="font-medium text-gray-900">{payment.studentName}</p>
                        <p className="text-sm text-gray-500">{payment.studentId} • {payment.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₱{payment.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{payment.method}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receipt Preview */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Receipt Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPayment ? (
                <div className="space-y-6">
                  {/* Receipt Template */}
                  <div className="border-2 border-gray-300 rounded-lg p-6 bg-white">
                    <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
                      <h2 className="text-xl font-bold text-gray-900">CMDI</h2>
                      <p className="text-sm text-gray-600">CARD-MRI Development Institute Inc.</p>
                      <p className="text-xs text-gray-500">Official Receipt</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Receipt No:</span>
                        <span className="font-medium">{selectedPayment.receiptNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium">{selectedPayment.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Student ID:</span>
                        <span className="font-medium">{selectedPayment.studentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Student Name:</span>
                        <span className="font-medium">{selectedPayment.studentName}</span>
                      </div>
                      <div className="border-t border-gray-200 my-3 pt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Description:</span>
                          <span className="font-medium">{selectedPayment.description}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-gray-500">Payment Method:</span>
                          <span className="font-medium">{selectedPayment.method}</span>
                        </div>
                      </div>
                      <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                        <span className="font-bold text-gray-900">Total Amount:</span>
                        <span className="font-bold text-xl text-blue-600">₱{selectedPayment.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                      <p className="text-xs text-gray-500">Thank you for your payment!</p>
                      <p className="text-xs text-gray-400">This is a computer-generated receipt.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a payment record to preview the receipt</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

