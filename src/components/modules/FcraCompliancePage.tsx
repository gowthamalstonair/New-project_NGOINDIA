import React, { useState, useEffect } from 'react';
import { Download, AlertTriangle, CheckCircle, Calendar, FileText, Plus } from 'lucide-react';
import { Donation, FcraRegistration } from '../../types/donation';
import { exportDonationsCsv } from '../../utils/exports';
import { FcraDonationForm } from '../pages/FcraDonationForm';
import api from '../../utils/api';

export function FcraCompliancePage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Mock FCRA registration data - in real app, this would come from settings/config
  const fcraRegistration: FcraRegistration = {
    registrationNumber: 'FCRA/2023/NGO/12345',
    expiryDate: '2028-03-15',
    status: 'active'
  };

  useEffect(() => {
    loadDonations();
    
    // Update time every hour to refresh days remaining
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 3600000); // Update every hour
    
    return () => clearInterval(timer);
  }, []);

  const loadDonations = async () => {
    try {
      const response = await api.getDonations();
      const fcraDonations = (response.results || []).map(donation => ({
        ...donation,
        id: donation.id || Date.now().toString(),
        status: donation.status || 'completed' as const,
        type: donation.type || 'one-time' as const
      }));
      
      setDonations(fcraDonations);
    } catch (error) {
      console.error('Failed to load donations:', error);
      setDonations([]);
    }
  };

  const foreignDonations = donations.filter(d => d.isForeign);
  const missingFIRC = foreignDonations.filter(d => !d.FIRC);
  
  const daysUntilExpiry = Math.ceil(
    (new Date(fcraRegistration.expiryDate).getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleExportCsv = () => {
    exportDonationsCsv(foreignDonations);
  };

  const handleEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDonation(null);
    loadDonations();
  };

  if (showForm) {
    return <FcraDonationForm onBack={handleFormClose} editingDonation={editingDonation} />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">FCRA Compliance</h1>
            <p className="text-gray-600">Foreign Contribution Regulation Act compliance dashboard</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Donation
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Registration Status */}
        <div className={`p-6 rounded-xl border ${
          daysUntilExpiry > 90 
            ? 'bg-green-50 border-green-200' 
            : daysUntilExpiry > 30 
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {daysUntilExpiry > 90 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">FCRA Registration</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Registration: <span className="font-medium">{fcraRegistration.registrationNumber}</span>
            </p>
            <p className="text-sm text-gray-600">
              Expires: <span className="font-medium">{new Date(fcraRegistration.expiryDate).toLocaleDateString()}</span>
            </p>
            <p className={`text-sm font-medium ${
              daysUntilExpiry > 90 ? 'text-green-700' : 
              daysUntilExpiry > 30 ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}
            </p>
          </div>
        </div>

        {/* Missing FIRC Alert */}
        <div className={`p-6 rounded-xl border ${
          missingFIRC.length === 0 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {missingFIRC.length === 0 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">FIRC Compliance</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Foreign donations: <span className="font-medium">{foreignDonations.length}</span>
            </p>
            <p className="text-sm text-gray-600">
              Missing FIRC: <span className="font-medium">{missingFIRC.length}</span>
            </p>
            <p className={`text-sm font-medium ${
              missingFIRC.length === 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              {missingFIRC.length === 0 ? 'All compliant' : 'Action required'}
            </p>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Statutory Reports</h3>
            <p className="text-gray-600">Export foreign donation data for MHA compliance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCsv}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button
              onClick={() => alert('PDF export feature coming soon')}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Foreign Donations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Foreign Donations ({foreignDonations.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Donor</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Country</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Purpose</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">FIRC</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {donation.donorName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      {donation.donorCountry || 'Unknown'}
                      {donation.isForeign && (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Foreign
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>₹{donation.convertedAmount?.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {donation.currency} {donation.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {donation.purposeTag}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {donation.FIRC ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        {donation.FIRC}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3" />
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(donation)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {donations.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
              <p className="text-gray-600">Start by adding your first donation record.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}