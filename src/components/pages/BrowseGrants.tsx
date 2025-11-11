import React, { useState } from 'react';
import { 
  Award, Plus, Search, Filter, Eye, Calendar, DollarSign, CheckCircle, Upload, Users, FileText, Clock, AlertCircle 
} from 'lucide-react';

interface Grant {
  id: string;
  title: string;
  amount: number;
  deadline: string;
  category: string;
  status: 'active' | 'closed' | 'upcoming';
  description: string;
  eligibility: string[];
  requirements: string[];
}

interface BrowseGrantsProps {
  onApplyToGrant: (grant: Grant) => void;
}

export function BrowseGrants({ onApplyToGrant }: BrowseGrantsProps) {
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [showEligibilityChecker, setShowEligibilityChecker] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const mockGrants: Grant[] = [
    { 
      id: '1', 
      title: 'Education Initiative Grant', 
      amount: 500000, 
      deadline: '2024-06-30', 
      category: 'Education', 
      status: 'active',
      description: 'Supporting educational programs for underprivileged children',
      eligibility: ['Registered NGO', 'Education focus', 'Minimum 2 years experience'],
      requirements: ['Project proposal', 'Budget breakdown', 'Impact assessment']
    },
    { 
      id: '2', 
      title: 'Healthcare Access Fund', 
      amount: 750000, 
      deadline: '2024-07-15', 
      category: 'Healthcare', 
      status: 'active',
      description: 'Improving healthcare access in rural communities',
      eligibility: ['Healthcare focus', 'Rural area operations', 'Medical partnerships'],
      requirements: ['Medical credentials', 'Community impact plan', 'Sustainability plan']
    }
  ];

  const eligibilityQuestions = [
    { id: 1, question: 'Is your organization a registered NGO?', type: 'boolean' },
    { id: 2, question: 'How many years has your organization been operational?', type: 'number' },
    { id: 3, question: 'What is your primary focus area?', type: 'select', options: ['Education', 'Healthcare', 'Environment'] }
  ];

  const formatAmount = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const filteredGrants = mockGrants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || grant.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const simulateAutoSave = () => {
    // Auto-save functionality placeholder
  };

  const handleBackToGrantApplication = () => {
    localStorage.setItem('activeModule', 'grant-applications');
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="p-6">
      <button 
        onClick={handleBackToGrantApplication}
        className="mb-4 text-orange-600 hover:text-orange-800 flex items-center gap-2"
      >
        ← Back to Grant Application
      </button>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Grants Management</h1>
        <p className="text-gray-600">Manage grant applications and funding opportunities</p>
      </div>

      {/* Browse Grants */}
      {!selectedGrant && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search grants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Categories</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGrants.map(grant => (
              <div key={grant.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{grant.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grant.status)}`}>
                    {grant.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{grant.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {formatAmount(grant.amount)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Deadline: {grant.deadline}
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedGrant(grant)}
                  className="w-full px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grant Details */}
      {selectedGrant && !showEligibilityChecker && !showApplicationForm && (
        <div>
          <button 
            onClick={() => setSelectedGrant(null)}
            className="mb-4 text-orange-600 hover:text-orange-800 flex items-center gap-2"
          >
            ← Back to Grants
          </button>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedGrant.title}</h2>
                <p className="text-gray-600">{selectedGrant.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedGrant.status)}`}>
                {selectedGrant.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Grant Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatAmount(selectedGrant.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium">{selectedGrant.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{selectedGrant.category}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h3>
                <ul className="space-y-2">
                  {selectedGrant.eligibility.map((criteria: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedGrant.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span className="text-sm text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowEligibilityChecker(true)}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Check Eligibility
              </button>
              <button 
                onClick={() => setShowApplicationForm(true)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Apply Directly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Checker */}
      {showEligibilityChecker && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <button 
            onClick={() => setShowEligibilityChecker(false)}
            className="mb-4 text-orange-600 hover:text-orange-800 flex items-center gap-2"
          >
            ← Back to Grant Details
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Check</h2>
          
          <div className="space-y-6">
            {eligibilityQuestions.map((q, index) => (
              <div key={q.id} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{q.question}</h3>
                {q.type === 'boolean' && (
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" name={`q${q.id}`} className="mr-2" />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name={`q${q.id}`} className="mr-2" />
                      No
                    </label>
                  </div>
                )}
                {q.type === 'number' && (
                  <input type="number" className="px-3 py-2 border border-gray-300 rounded-lg" />
                )}
                {q.type === 'select' && (
                  <select className="px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Select...</option>
                    {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Check Eligibility
            </button>
            <button 
              onClick={() => setShowApplicationForm(true)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Proceed to Application
            </button>
          </div>
        </div>
      )}

      {/* Multi-step Application Form */}
      {showApplicationForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <button 
            onClick={() => setShowApplicationForm(false)}
            className="mb-4 text-orange-600 hover:text-orange-800 flex items-center gap-2"
          >
            ← Back
          </button>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= applicationStep ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600 text-center">
              Step {applicationStep} of 5: {['Organization Info', 'Project Details', 'Budget', 'Skills & Resources', 'Documents'][applicationStep - 1]}
            </div>
          </div>
          
          {/* Form Steps */}
          {applicationStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Organization Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Organization Name" className="px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="email" placeholder="Contact Email" className="px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="tel" placeholder="Phone Number" className="px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Registration Number" className="px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <textarea placeholder="Organization Description" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
            </div>
          )}
          
          {applicationStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
              <input type="text" placeholder="Project Title" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <textarea placeholder="Project Description" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4} />
              <textarea placeholder="Expected Outcomes" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
            </div>
          )}
          
          {applicationStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Budget Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" placeholder="Total Amount Requested" className="px-3 py-2 border border-gray-300 rounded-lg" />
                <input type="number" placeholder="Project Duration (months)" className="px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
              <textarea placeholder="Budget Breakdown" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4} />
            </div>
          )}
          
          {applicationStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Skills & Resources Needed</h3>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Volunteer Skills Required
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input type="text" placeholder="Skill (e.g., Teaching)" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    <input type="number" placeholder="Count" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
                    <button className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Resources Required
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input type="text" placeholder="Resource (e.g., Laptops)" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" />
                    <input type="number" placeholder="Quantity" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Donation</option>
                      <option>Loan</option>
                      <option>Rental</option>
                    </select>
                    <button className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {applicationStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  Choose Files
                </button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Required Documents:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Organization Registration Certificate</li>
                  <li>• Project Proposal (detailed)</li>
                  <li>• Budget Breakdown</li>
                  <li>• Previous Work Portfolio</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button 
              onClick={() => setApplicationStep(Math.max(1, applicationStep - 1))}
              disabled={applicationStep === 1}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            
            {applicationStep < 5 ? (
              <button 
                onClick={() => {
                  setApplicationStep(applicationStep + 1);
                  simulateAutoSave();
                }}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Next
              </button>
            ) : (
              <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Submit Application
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}