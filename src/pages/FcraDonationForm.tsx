import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { Donation } from '../types/donation';
import { convertToINR } from '../utils/fcraHelpers';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
// @ts-ignore
import api from '../utils/api';

interface FcraDonationFormProps {
  onBack?: () => void;
  editingDonation?: Donation | null;
}

export function FcraDonationForm({ onBack, editingDonation }: FcraDonationFormProps) {
  const { user } = useAuth();
  const { addDonation } = useDashboard();
  const [formData, setFormData] = useState({
    donorName: editingDonation?.donorName || '',
    donorCountry: editingDonation?.donorCountry || '',
    isForeign: editingDonation?.isForeign || false,
    remittanceRef: editingDonation?.remittanceRef || '',
    currency: editingDonation?.currency || 'USD',
    amount: editingDonation?.amount?.toString() || '',
    conversionRate: editingDonation?.conversionRate?.toString() || '83.5',
    FIRC: editingDonation?.FIRC || '',
    purposeTag: editingDonation?.purposeTag || '',
    usageRestriction: editingDonation?.usageRestriction || '',
    notes: editingDonation?.notes || '',
    attachments: editingDonation?.attachments || []
  });

  const [newAttachment, setNewAttachment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const convertedAmount = formData.isForeign 
      ? convertToINR(parseFloat(formData.amount), formData.currency, parseFloat(formData.conversionRate))
      : parseFloat(formData.amount);

    const donationData: Partial<Donation> = {
      donorName: formData.donorName,
      donorCountry: formData.isForeign ? formData.donorCountry : undefined,
      isForeign: formData.isForeign,
      remittanceRef: formData.isForeign ? formData.remittanceRef : undefined,
      currency: formData.isForeign ? formData.currency : 'INR',
      amount: parseFloat(formData.amount),
      convertedAmount,
      conversionRate: formData.isForeign ? parseFloat(formData.conversionRate) : 1,
      FIRC: formData.isForeign ? formData.FIRC : undefined,
      attachments: formData.attachments,
      purposeTag: formData.purposeTag,
      usageRestriction: formData.usageRestriction,
      notes: formData.notes,
      createdBy: user?.name || 'Current User',
      createdAt: editingDonation?.createdAt || new Date().toISOString(),
      status: 'completed' as const,
      type: 'one-time' as const
    };

    try {
      if (editingDonation) {
        await api.updateDonation(editingDonation.id, donationData);
      } else {
        await api.createDonation(donationData);
        
        // Also add to regular donations for dashboard integration
        addDonation({
          donor: formData.donorName,
          amount: convertedAmount,
          date: new Date().toISOString().split('T')[0],
          type: 'one-time'
        });
      }
      onBack?.();
    } catch (error) {
      console.error('Failed to save donation:', error);
    }
  };

  const addAttachment = () => {
    if (newAttachment.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment.trim()]
      }));
      setNewAttachment('');
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const canEditFIRC = user?.role === 'admin' || user?.role === 'director';

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {editingDonation ? 'Edit' : 'Add'} FCRA Donation
        </h1>
        <p className="text-gray-600">Record foreign or domestic donation with compliance details</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donor Name *
              </label>
              <input
                type="text"
                value={formData.donorName}
                onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose/Project *
              </label>
              <input
                type="text"
                value={formData.purposeTag}
                onChange={(e) => setFormData(prev => ({ ...prev, purposeTag: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isForeign"
              checked={formData.isForeign}
              onChange={(e) => setFormData(prev => ({ ...prev, isForeign: e.target.checked }))}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="isForeign" className="text-sm font-medium text-gray-700">
              This is a foreign donation (requires FCRA compliance)
            </label>
          </div>

          {formData.isForeign && (
            <div className="bg-orange-50 p-6 rounded-lg space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">FCRA Compliance Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donor Country *
                  </label>
                  <input
                    type="text"
                    value={formData.donorCountry}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorCountry: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required={formData.isForeign}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remittance Reference *
                  </label>
                  <input
                    type="text"
                    value={formData.remittanceRef}
                    onChange={(e) => setFormData(prev => ({ ...prev, remittanceRef: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required={formData.isForeign}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency *
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conversion Rate *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.conversionRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, conversionRate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required={formData.isForeign}
                  />
                </div>
              </div>

              {formData.amount && formData.conversionRate && (
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm text-gray-600">
                    Converted Amount: <span className="font-semibold text-gray-900">
                      ₹{convertToINR(parseFloat(formData.amount), formData.currency, parseFloat(formData.conversionRate)).toLocaleString()}
                    </span>
                  </p>
                </div>
              )}

              {canEditFIRC && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FIRC Number
                  </label>
                  <input
                    type="text"
                    value={formData.FIRC}
                    onChange={(e) => setFormData(prev => ({ ...prev, FIRC: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter FIRC reference number"
                  />
                </div>
              )}
            </div>
          )}

          {!formData.isForeign && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (INR) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter document URL"
                />
                <button
                  type="button"
                  onClick={addAttachment}
                  className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-blue-600 hover:underline">
                        {url}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              {editingDonation ? 'Update' : 'Save'} Donation
            </button>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}