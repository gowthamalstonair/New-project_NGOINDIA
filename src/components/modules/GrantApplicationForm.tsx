import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, AlertCircle, Award, Eye } from 'lucide-react';
import { GrantApplicationFormData } from '../../types/grantApplication';

interface GrantApplicationFormProps {
  onBack: () => void;
  onSubmit: (data: GrantApplicationFormData) => Promise<boolean>;
  onMyApplications?: () => void;
  onBrowseGrants?: () => void;
  onRefreshApplications?: () => void;
}

export function GrantApplicationForm({ onBack, onSubmit, onMyApplications, onBrowseGrants, onRefreshApplications }: GrantApplicationFormProps) {
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
  const [showMyApplications, setShowMyApplications] = useState(false);
  const [showBrowseGrants, setShowBrowseGrants] = useState(false);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (showMyApplications) {
      loadApplications();
    }
  }, [showMyApplications]);

  const loadApplications = async () => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_grant_applications_api.php');
      const data = await response.json();
      if (data.success) {
        // Combine database data with localStorage data
        const localApps = JSON.parse(localStorage.getItem('grant_applications') || '[]');
        const combinedApps = [...data.applications, ...localApps];
        // Remove duplicates based on ID
        const uniqueApps = combinedApps.filter((app, index, arr) => 
          arr.findIndex(item => item.id === app.id) === index
        );
        setApplications(uniqueApps);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
      // Fallback to localStorage data
      const localApps = JSON.parse(localStorage.getItem('grant_applications') || '[]');
      if (localApps.length > 0) {
        setApplications(localApps);
      } else {
        // Final fallback to mock data
        setApplications([
          { 
            id: '1', 
            project_title: 'Rural Education Program', 
            requested_amount: 300000, 
            status: 'submitted', 
            created_at: '2024-01-15',
            category: 'Education'
          },
          { 
            id: '2', 
            project_title: 'Community Health Initiative', 
            requested_amount: 450000, 
            status: 'under_review', 
            created_at: '2024-01-20',
            category: 'Healthcare'
          }
        ]);
      }
    }
  };

  const mockGrants = [
    { 
      id: '1', 
      title: 'Education Initiative Grant', 
      amount: 500000, 
      deadline: '2024-06-30', 
      category: 'Education', 
      status: 'active',
      description: 'Supporting educational programs for underprivileged children'
    },
    { 
      id: '2', 
      title: 'Healthcare Access Fund', 
      amount: 750000, 
      deadline: '2024-07-15', 
      category: 'Healthcare', 
      status: 'active',
      description: 'Improving healthcare access in rural communities'
    }
  ];

  const formatAmount = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMyApplications = () => {
    setShowMyApplications(true);
    setShowBrowseGrants(false);
    if (onMyApplications) onMyApplications();
  };

  const handleBrowseGrants = () => {
    setShowBrowseGrants(true);
    setShowMyApplications(false);
    if (onBrowseGrants) onBrowseGrants();
  };

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
      // Submit to database
      const response = await fetch('http://localhost/NGO-India/backend/add_grant_application_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      
      if (result.success) {
        // Save to localStorage as backup
        const existingApps = JSON.parse(localStorage.getItem('grant_applications') || '[]');
        const newApp = {
          id: result.id || Date.now().toString(),
          project_title: formData.projectTitle,
          requested_amount: formData.requestedAmount,
          status: 'submitted',
          created_at: new Date().toISOString(),
          category: formData.category,
          applicant_name: formData.applicantName,
          applicant_email: formData.applicantEmail
        };
        existingApps.push(newApp);
        localStorage.setItem('grant_applications', JSON.stringify(existingApps));
        
        // Also call the original onSubmit for any additional handling
        await onSubmit(formData);
        // Refresh applications if modal is open
        if (showMyApplications) {
          loadApplications();
        }
        // Refresh main page applications
        if (onRefreshApplications) {
          onRefreshApplications();
        }
        onBack();
      } else {
        setError('Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      // Fallback to original onSubmit
      try {
        const success = await onSubmit(formData);
        if (success) {
          // Refresh applications if modal is open
          if (showMyApplications) {
            loadApplications();
          }
          // Refresh main page applications
          if (onRefreshApplications) {
            onRefreshApplications();
          }
          onBack();
        } else {
          setError('Failed to submit application. Please try again.');
        }
      } catch (fallbackErr) {
        setError('An error occurred while submitting the application');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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

        {/* My Applications Modal */}
        {showMyApplications && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">My Applications</h3>
                <button 
                  onClick={() => setShowMyApplications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{app.project_title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{app.category} Grant</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount: {formatAmount(app.requested_amount)}</span>
                      <span className="text-gray-600">Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No applications found. Submit your first application!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Browse Grants Modal */}
        {showBrowseGrants && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Browse Grants</h3>
                <button 
                  onClick={() => setShowBrowseGrants(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGrants.map(grant => (
                  <div key={grant.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{grant.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grant.status)}`}>
                        {grant.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{grant.description}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">{formatAmount(grant.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deadline:</span>
                        <span className="font-medium">{grant.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}