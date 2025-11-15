import React, { useState } from 'react';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { GrantApplicationFormData } from '../../types/grantApplication';

interface GrantApplicationFormProps {
  onBack: () => void;
  onSubmit: (data: GrantApplicationFormData) => Promise<boolean>;
}

export function GrantApplicationForm({ onBack, onSubmit }: GrantApplicationFormProps) {
  const [formData, setFormData] = useState<GrantApplicationFormData>({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    organizationName: '',
    projectTitle: '',
    projectDescription: '',
    requestedAmount: 0,
    projectDuration: '',
    category: 'education'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof GrantApplicationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.applicantName || !formData.applicantEmail || !formData.projectTitle || !formData.projectDescription) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.requestedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        onBack();
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting the application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Grant Application</h1>
            <p className="text-gray-600 mt-1">Submit your project proposal for funding consideration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicant Name *
              </label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => handleInputChange('applicantName', e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.applicantEmail}
                onChange={(e) => handleInputChange('applicantEmail', e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.applicantPhone}
                onChange={(e) => handleInputChange('applicantPhone', e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter organization name"
              />
            </div>
          </div>

          {/* Project Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.projectTitle}
              onChange={(e) => handleInputChange('projectTitle', e.target.value)}
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter project title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              value={formData.projectDescription}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              rows={6}
              placeholder="Describe your project, its objectives, and expected impact"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as any)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="environment">Environment</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Amount (₹) *
              </label>
              <input
                type="number"
                value={formData.requestedAmount || ''}
                onChange={(e) => handleInputChange('requestedAmount', Number(e.target.value))}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter amount"
                min="1"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Duration
              </label>
              <input
                type="text"
                value={formData.projectDuration}
                onChange={(e) => handleInputChange('projectDuration', e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 6 months"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}