import { DollarSign, TrendingUp, TrendingDown, Users, CreditCard, Receipt, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function FinanceDashboard() {
  const stats = [
    {
      title: 'Total Collected',
      value: '₱45.2M',
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12%',
      trend: 'up' as const,
    },
    {
      title: 'Outstanding Balance',
      value: '₱8.4M',
      icon: AlertCircle,
      color: 'bg-orange-500',
      change: '-5%',
      trend: 'down' as const,
    },
    {
      title: 'Overdue Accounts',
      value: '124',
      icon: Users,
      color: 'bg-red-500',
      change: '+3%',
      trend: 'up' as const,
    },
    {
      title: 'Collection Rate',
      value: '84%',
      icon: CreditCard,
      color: 'bg-blue-500',
      change: '+2%',
      trend: 'up' as const,
    },
  ];

  const monthlyCollection = [
    { month: 'Aug', collected: 5200000, target: 5000000 },
    { month: 'Sep', collected: 5800000, target: 5500000 },
    { month: 'Oct', collected: 6500000, target: 6000000 },
    { month: 'Nov', collected: 7200000, target: 7000000 },
    { month: 'Dec', collected: 8100000, target: 8000000 },
    { month: 'Jan', collected: 8800000, target: 9000000 },
    { month: 'Feb', collected: 9200000, target: 9500000 },
    { month: 'Mar', collected: 9800000, target: 10000000 },
  ];

  const paymentStatus = [
    { name: 'Paid in Full', value: 1456, color: '#22c55e' },
    { name: 'Partial Payment', value: 678, color: '#f59e0b' },
    { name: 'Outstanding', value: 322, color: '#ef4444' },
  ];

  const recentTransactions = [
    { id: 'TXN001', student: 'Maria Garcia', studentId: 'S2024789', amount: 25000, method: 'Bank Transfer', date: '2024-03-21', status: 'completed' },
    { id: 'TXN002', student: 'Juan Santos', studentId: 'S2024790', amount: 15000, method: 'Credit Card', date: '2024-03-21', status: 'completed' },
    { id: 'TXN003', student: 'Ana Reyes', studentId: 'S2024791', amount: 30000, method: 'Cash', date: '2024-03-20', status: 'pending' },
    { id: 'TXN004', student: 'Pedro Cruz', studentId: 'S2024792', amount: 20000, method: 'Bank Transfer', date: '2024-03-20', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finance Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor tuition collections, payments, and financial reports</p>
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
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Collection */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Collection Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyCollection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value: number) => `₱${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                <Area type="monotone" dataKey="collected" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Collected" />
                <Area type="monotone" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentStatus.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{txn.student}</h4>
                    <p className="text-sm text-gray-500">{txn.studentId} • {txn.method}</p>
                    <p className="text-xs text-gray-400">{txn.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₱{txn.amount.toLocaleString()}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    txn.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Record Payment</p>
            </button>
            <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <Receipt className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Generate Receipt</p>
            </button>
            <button className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Payment History</p>
            </button>
            <button className="p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Financial Reports</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

