import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Calendar, IndianRupee, 
  Eye, CheckCircle, XCircle, Clock, Plus
} from 'lucide-react';
import { GrantApplication } from '../../types/grantApplication';
import { formatNumber } from '../../utils/formatNumber';

interface GrantApplicationListProps {
  applications: GrantApplication[];
  onViewDetails: (application: GrantApplication) => void;
  onUpdateStatus: (id: string, status: GrantApplication['status'], notes?: string) => void;
  onNewApplication: () => void;
}

export function GrantApplicationList({ 
  applications, 
  onViewDetails, 
  onUpdateStatus, 
  onNewApplication 
}: GrantApplicationListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getStatusColor = (status: GrantApplication['status']) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: GrantApplication['status']) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.organizationName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = [
    {
      label: 'Total Applications',
      value: applications.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      label: 'Under Review',
      value: applications.filter(app => app.status === 'under-review').length,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      label: 'Approved',
      value: applications.filter(app => app.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Total Requested',
      value: `₹${formatNumber(applications.reduce((sum, app) => sum + app.requestedAmount, 0))}`,
      icon: IndianRupee,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Grant Applications</h1>
            <p className="text-gray-600">Review and manage grant applications</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/my-applications');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              My Applications
            </button>
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/browse-grants');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Browse Grants
            </button>
            <button 
              onClick={onNewApplication}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Application
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
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="under-review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="environment">Environment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Applications ({filteredApplications.length})</h2>
        </div>
        <div className="p-6">
          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{application.projectTitle}</h3>
                        <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status.replace('-', ' ')}
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {application.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Applicant</p>
                          <p className="font-medium">{application.applicantName}</p>
                          {application.organizationName && (
                            <p className="text-sm text-gray-500">{application.organizationName}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested Amount</p>
                          <p className="font-semibold text-lg text-orange-600">₹{formatNumber(application.requestedAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Submitted</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(application.submissionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">{application.projectDescription}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-6">
                      <button
                        onClick={() => onViewDetails(application)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No grant applications found</p>
              <button 
                onClick={onNewApplication}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create First Application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}