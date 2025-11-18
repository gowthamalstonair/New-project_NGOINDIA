import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, TrendingUp, TrendingDown, PieChart, 
  Plus, Download, Calendar, Filter, AlertCircle,
  CheckCircle, Clock, CreditCard
} from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useScrollReset } from '../../hooks/useScrollReset';
import { formatNumber } from '../../utils/formatNumber';

export function FinancialTracking() {
  useScrollReset();
  const { donations, expenses, addExpense } = useDashboard();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_expenses_api.php');
      const result = await response.json();
      if (result.success) {
        setDbExpenses(result.expenses);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const allExpenses = [...expenses, ...dbExpenses];
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = allExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const netBalance = totalDonations - totalExpenses;
  const burnRate = totalExpenses / 30; // Daily burn rate

  const stats = [
    {
      label: 'Total Donations',
      value: `₹${formatNumber(totalDonations)}`,
      change: '+12%',
      trend: 'up',
      icon: IndianRupee,
      color: 'text-green-600'
    },
    {
      label: 'Total Expenses',
      value: `₹${formatNumber(totalExpenses)}`,
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-red-600'
    },
    {
      label: 'Net Balance',
      value: `₹${formatNumber(netBalance)}`,
      change: '+15%',
      trend: 'up',
      icon: TrendingDown,
      color: 'text-blue-600'
    },
    {
      label: 'Daily Burn Rate',
      value: `₹${formatNumber(burnRate)}`,
      change: '-5%',
      trend: 'down',
      icon: PieChart,
      color: 'text-orange-600'
    }
  ];

  const expenseCategories = [
    { name: 'Program Materials', amount: 450000, percentage: 45, color: 'bg-blue-500' },
    { name: 'Staff Salaries', amount: 300000, percentage: 30, color: 'bg-green-500' },
    { name: 'Equipment', amount: 120000, percentage: 12, color: 'bg-orange-500' },
    { name: 'Travel', amount: 80000, percentage: 8, color: 'bg-purple-500' },
    { name: 'Others', amount: 50000, percentage: 5, color: 'bg-gray-500' }
  ];

  const ExpenseForm = () => {
    const [formData, setFormData] = useState({
      description: '',
      amount: '',
      category: '',
      project: '',
      date: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      addExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        project: formData.project,
        date: formData.date,
        status: 'pending'
      });
      setShowAddExpense(false);
      setFormData({ description: '', amount: '', category: '', project: '', date: '' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                <option value="Program Materials">Program Materials</option>
                <option value="Staff Salaries">Staff Salaries</option>
                <option value="Equipment">Equipment</option>
                <option value="Travel">Travel</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({...formData, project: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select project</option>
                <option value="Education for All">Education for All</option>
                <option value="Healthcare Initiative">Healthcare Initiative</option>
                <option value="Rural Development">Rural Development</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddExpense(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Tracking</h1>
            <p className="text-gray-600">Monitor income, expenses, and financial health</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => setShowAddExpense(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Custom Range
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Donations */}
                {donations.slice(0, 3).map((donation) => (
                  <div key={donation.id} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-100 p-3 rounded-full">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Donation from {donation.donor}</h3>
                      <p className="text-sm text-gray-600">{donation.project} • {donation.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">+₹{formatNumber(donation.amount)}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Expenses */}
                {expenses.slice(0, 3).map((expense) => (
                  <div key={expense.id} className="flex items-center gap-4 p-4 bg-red-50 rounded-lg">
                    <div className="bg-red-100 p-3 rounded-full">
                      <CreditCard className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                      <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-red-600">-₹{formatNumber(expense.amount)}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                        expense.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Expense Categories */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Expense Categories</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {expenseCategories.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">{category.name}</span>
                      <span className="text-gray-900 font-semibold">₹{formatNumber(category.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${category.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{category.percentage}% of total expenses</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Financial Health</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Good Cash Flow</p>
                    <p className="text-sm text-gray-600">Positive trend for 3 months</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Budget Alert</p>
                    <p className="text-sm text-gray-600">80% of Q1 budget utilized</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Diversify Income</p>
                    <p className="text-sm text-gray-600">Consider new funding sources</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddExpense && <ExpenseForm />}
    </div>
  );
}