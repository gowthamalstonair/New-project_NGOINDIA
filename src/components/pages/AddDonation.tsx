import React, { useState } from 'react';
import { ArrowLeft, IndianRupee } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';

export function AddDonation() {
  const { addDonation } = useDashboard();
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    amount: '',
    donationType: 'Individual',
    purpose: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Try to add donor to backend first
      const response = await fetch('http://localhost/NGO-India/backend/add_donor_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.donorName,
          email: formData.donorEmail,
          amount: parseFloat(formData.amount),
          donor_type: formData.donationType,
          purpose: formData.purpose,
          notes: formData.notes
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Donor added successfully to database!');
      } else {
        console.log('Backend failed, using local storage:', result.message);
      }
    } catch (error) {
      console.error('Backend error, using local storage:', error);
    }
    
    // Always add to local context as fallback
    addDonation({
      donor: formData.donorName,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split('T')[0],
      type: formData.donationType === 'Grant' ? 'recurring' : 'one-time'
    });
    
    alert('Donation added successfully!');
    setTimeout(() => {
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
            <h1 className="text-3xl font-bold text-orange-600 flex items-center gap-3">
              <IndianRupee className="w-8 h-8 text-orange-500" />
              Add New Donation
            </h1>
            <p className="text-orange-500">Record a new donation with complete details</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-orange-900 mb-3">Instructions</h2>
          <ul className="text-orange-800 space-y-2 text-sm">
            <li>• Fill in all required fields marked with asterisk (*)</li>
            <li>• For corporate donations, please provide company details</li>
            <li>• All donations will be acknowledged with a receipt</li>
            <li>• Tax exemption certificates will be issued as per 80G guidelines</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">Donor Name *</label>
              <input
                type="text"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 hover:border-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.donorEmail}
                onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 hover:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">Amount (₹) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 hover:border-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">Donor Type</label>
              <select
                value={formData.donationType}
                onChange={(e) => setFormData({ ...formData, donationType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 hover:border-orange-400"
              >
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="Grant">Grant/Foundation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 hover:border-orange-400"
              >
                <option value="">General Fund</option>
                <option value="Education">Education Programs</option>
                <option value="Healthcare">Healthcare Initiatives</option>
                <option value="Rural Development">Rural Development</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-600 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 hover:border-orange-400"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={() => window.location.href = '/'} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Add Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDonation;