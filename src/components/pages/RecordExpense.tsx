import React, { useState } from 'react';
import { ArrowLeft, TrendingDown, Receipt } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

export function RecordExpense() {
  const { addExpense } = useDashboard();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Operations',
    description: '',
    vendor: '',
    invoiceNumber: '',
    paymentMethod: 'Online',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Try to save to backend first
      const response = await fetch('http://localhost/NGO-India/backend/add_expense_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          vendor: formData.vendor,
          invoice_number: formData.invoiceNumber,
          payment_method: formData.paymentMethod,
          notes: formData.notes,
          project: 'General'
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Expense recorded successfully in database!');
      } else {
        console.log('Backend failed, using local storage:', result.message);
      }
    } catch (error) {
      console.error('Backend error, using local storage:', error);
    }
    
    // Always add to local context as fallback
    addExpense({
      description: formData.title,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split('T')[0],
      category: formData.category,
      project: 'General',
      status: 'pending'
    });
    
    alert('Expense recorded successfully!');
    setTimeout(() => {
      localStorage.setItem('activeModule', 'finances');
      window.location.href = '/';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => window.location.href = '/'} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-orange-500" />
              Record New Expense
            </h1>
            <p className="text-gray-600">Track and manage organizational expenses</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-orange-900 mb-3">Guidelines</h2>
          <ul className="text-orange-800 space-y-2 text-sm">
            <li>• Ensure all expense details are accurate and complete</li>
            <li>• Attach receipts and invoices for verification</li>
            <li>• Categorize expenses properly for better tracking</li>
            <li>• All expenses require approval before processing</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expense Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Office supplies, Travel expenses"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
              >
                <option value="Operations">Operations</option>
                <option value="Programs">Programs</option>
                <option value="Administration">Administration</option>
                <option value="Marketing">Marketing</option>
                <option value="Travel">Travel</option>
                <option value="Equipment">Equipment</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor/Supplier</label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="Company or person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice/Receipt Number</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="INV-2025-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
              >
                <option value="Online">Online Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                rows={3}
                placeholder="Detailed description of the expense"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                rows={2}
                placeholder="Any additional information"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={() => window.location.href = '/'} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Record Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecordExpense;