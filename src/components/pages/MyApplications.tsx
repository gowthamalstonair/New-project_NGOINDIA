import React, { useState, useEffect } from 'react';
import { 
  FileText, Calendar, IndianRupee, Eye, CheckCircle, 
  XCircle, Clock, Edit, Trash2, AlertCircle, Users, Plus, Filter
} from 'lucide-react';
import { GrantApplication } from '../../types/grantApplication';
import { formatNumber } from '../../utils/formatNumber';

interface MyApplicationsProps {
  applications: GrantApplication[];
  onViewDetails: (application: GrantApplication) => void;
  onEditApplication: (application: GrantApplication) => void;
  onDeleteApplication: (id: string) => void;
}

export function MyApplications({ 
  applications: _, 
  onViewDetails: __, 
  onEditApplication: ___, 
  onDeleteApplication: ____ 
}: MyApplicationsProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showMatchingSuggestions, setShowMatchingSuggestions] = useState(false);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [matchFilter, setMatchFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [rejectedMatches, setRejectedMatches] = useState<string[]>([]);
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    // Start with existing mock data
    const mockApplications = [
      { 
        id: '1', 
        project: 'Rural Education Program', 
        amount: 300000, 
        status: 'submitted', 
        date: '2024-01-15',
        grantTitle: 'Education Initiative Grant',
        progress: 100,
        skillsNeeded: ['Teaching', 'Curriculum Development'],
        resourcesNeeded: ['Laptops', 'Books', 'Furniture'],
        matches: { skills: 5, resources: 4 },
        matchHistory: { skills: [3, 4, 5], resources: [2, 3, 4] },
        invitations: [
          { id: '1', type: 'volunteer', name: 'Priya Sharma', status: 'sent', date: '2024-01-20' },
          { id: '2', type: 'resource', name: 'Tech Solutions', status: 'accepted', date: '2024-01-18' }
        ],
        acceptedMatches: [
          { id: '1', name: 'Priya Sharma', type: 'volunteer', status: 'Active', avatar: 'PS' },
          { id: '2', name: 'Tech Solutions', type: 'resource', status: 'Active', avatar: 'TS' }
        ],
        adminMatches: { pending: 2, accepted: 3 },
        resourceDelivery: { pending: 1, delivered: 2 }
      },
      { 
        id: '2', 
        project: 'Community Health Initiative', 
        amount: 450000, 
        status: 'under_review', 
        date: '2024-01-20',
        grantTitle: 'Healthcare Access Fund',
        progress: 100,
        skillsNeeded: ['Medical Training', 'Community Outreach'],
        resourcesNeeded: ['Medical Equipment', 'Vehicles'],
        matches: { skills: 6, resources: 3 },
        matchHistory: { skills: [5, 5, 6], resources: [1, 2, 3] },
        invitations: [
          { id: '3', type: 'volunteer', name: 'Dr. Amit Singh', status: 'viewed', date: '2024-01-22' }
        ],
        acceptedMatches: [
          { id: '3', name: 'Dr. Amit Singh', type: 'volunteer', status: 'Active', avatar: 'AS' }
        ],
        adminMatches: { pending: 4, accepted: 2 },
        resourceDelivery: { pending: 2, delivered: 1 }
      }
    ];

    try {
      // Load from database
      const response = await fetch('http://localhost/NGO-India/backend/get_grant_applications_api.php');
      const data = await response.json();
      
      let dbApplications = [];
      if (data.success) {
        // Convert database format to display format
        dbApplications = data.applications.map((app: any) => ({
          id: app.id.toString(),
          project: app.project_title,
          amount: parseFloat(app.requested_amount),
          status: app.status,
          date: new Date(app.created_at).toLocaleDateString(),
          grantTitle: `${app.category.charAt(0).toUpperCase() + app.category.slice(1)} Grant`,
          progress: 100,
          skillsNeeded: ['Teaching', 'Curriculum Development'],
          resourcesNeeded: ['Laptops', 'Books', 'Furniture'],
          matches: { skills: 5, resources: 4 },
          matchHistory: { skills: [3, 4, 5], resources: [2, 3, 4] },
          invitations: [],
          acceptedMatches: [],
          adminMatches: { pending: 2, accepted: 3 },
          resourceDelivery: { pending: 1, delivered: 2 }
        }));
      }
      
      // Load from localStorage
      const stored = localStorage.getItem('grant_applications');
      const localApplications = stored ? JSON.parse(stored) : [];
      const convertedLocalApps = localApplications.map((app: any) => ({
        id: app.id,
        project: app.projectTitle,
        amount: app.requestedAmount,
        status: app.status,
        date: new Date(app.submissionDate).toLocaleDateString(),
        grantTitle: `${app.category.charAt(0).toUpperCase() + app.category.slice(1)} Grant`,
        progress: 100,
        skillsNeeded: ['Teaching', 'Curriculum Development'],
        resourcesNeeded: ['Laptops', 'Books', 'Furniture'],
        matches: { skills: 5, resources: 4 },
        matchHistory: { skills: [3, 4, 5], resources: [2, 3, 4] },
        invitations: [],
        acceptedMatches: [],
        adminMatches: { pending: 2, accepted: 3 },
        resourceDelivery: { pending: 1, delivered: 2 }
      }));
      
      // Combine: mock data + database + localStorage
      const allApplications = [...mockApplications, ...dbApplications, ...convertedLocalApps];
      const uniqueApplications = allApplications.filter((app, index, arr) => 
        arr.findIndex(item => item.id === app.id) === index
      );
      
      setApplications(uniqueApplications);
    } catch (error) {
      console.error('Failed to load applications:', error);
      // Fallback: mock data + localStorage only
      const stored = localStorage.getItem('grant_applications');
      let localApps = [];
      if (stored) {
        const localApplications = JSON.parse(stored);
        localApps = localApplications.map((app: any) => ({
          id: app.id,
          project: app.projectTitle,
          amount: app.requestedAmount,
          status: app.status,
          date: new Date(app.submissionDate).toLocaleDateString(),
          grantTitle: `${app.category.charAt(0).toUpperCase() + app.category.slice(1)} Grant`,
          progress: 100,
          skillsNeeded: ['Teaching', 'Curriculum Development'],
          resourcesNeeded: ['Laptops', 'Books', 'Furniture'],
          matches: { skills: 5, resources: 4 },
          matchHistory: { skills: [3, 4, 5], resources: [2, 3, 4] },
          invitations: [],
          acceptedMatches: [],
          adminMatches: { pending: 2, accepted: 3 },
          resourceDelivery: { pending: 1, delivered: 2 }
        }));
      }
      const fallbackApps = [...mockApplications, ...localApps];
      const uniqueFallback = fallbackApps.filter((app, index, arr) => 
        arr.findIndex(item => item.id === app.id) === index
      );
      setApplications(uniqueFallback);
    }
  };

  const mockVolunteers = [
    {
      id: '1',
      name: 'Priya Sharma',
      location: 'Mumbai, Maharashtra',
      skills: ['Teaching', 'Curriculum Development', 'Digital Literacy'],
      matchScore: 92,
      rating: 4.8,
      bio: 'Experienced educator with 8+ years in rural education programs',
      experience: '8 years',
      pastProjects: ['Digital Literacy Initiative', 'Teacher Training Program'],
      availability: 'Available',
      matchBreakdown: { category: true, skills: true, location: false }
    },
    {
      id: '2',
      name: 'Rajesh Kumar',
      location: 'Delhi, NCR',
      skills: ['Project Management', 'Training', 'Community Outreach'],
      matchScore: 85,
      rating: 4.6,
      bio: 'Project management specialist focused on community development',
      experience: '6 years',
      pastProjects: ['Community Health Drive', 'Skill Development Program'],
      availability: 'Available',
      matchBreakdown: { category: true, skills: true, location: true }
    }
  ];

  const mockDonors = [
    {
      id: '1',
      name: 'Tech Solutions Pvt Ltd',
      location: 'Bangalore, Karnataka',
      resources: ['Laptops', 'Software Licenses', 'Technical Support'],
      matchScore: 88,
      rating: 4.7,
      bio: 'Leading technology company supporting education initiatives',
      pastDonations: ['500 Laptops to Rural Schools', 'Software Training Programs'],
      availability: 'Available',
      matchBreakdown: { category: true, resources: true, location: false }
    },
    {
      id: '2',
      name: 'Education Foundation',
      location: 'Chennai, Tamil Nadu',
      resources: ['Books', 'Stationery', 'Furniture'],
      matchScore: 76,
      rating: 4.5,
      bio: 'Non-profit foundation dedicated to educational resource support',
      pastDonations: ['10,000 Books Distribution', 'Classroom Furniture Setup'],
      availability: 'Limited',
      matchBreakdown: { category: true, resources: true, location: true }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'under_review': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatAmount = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const filteredApplications = applications.filter(app => 
    statusFilter === 'all' || app.status === statusFilter
  );

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

      {/* My Applications */}
      {!showMatchingSuggestions && !showApplicationDetails && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {filteredApplications.map(app => (
              <div key={app.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{app.project}</h3>
                    <p className="text-sm text-gray-600">{app.grantTitle}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatAmount(app.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{app.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium">{app.progress}%</span>
                  </div>
                </div>
                
                {/* Status Timeline */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className={app.status === 'submitted' || app.status === 'under_review' || app.status === 'approved' ? 'text-green-600' : 'text-gray-400'}>Submitted</span>
                    <span className={app.status === 'under_review' || app.status === 'approved' ? 'text-orange-600' : 'text-gray-400'}>Under Review</span>
                    <span className={app.status === 'approved' ? 'text-green-600' : 'text-gray-400'}>Approved</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${app.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedApplication(app);
                      setShowApplicationDetails(true);
                    }}
                    className="flex-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-sm"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => setShowMatchingSuggestions(true)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                  >
                    View Matches
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matching Suggestions */}
      {showMatchingSuggestions && (
        <div>
          <button 
            onClick={() => setShowMatchingSuggestions(false)}
            className="mb-4 text-orange-600 hover:text-orange-800 flex items-center gap-2"
          >
            ← Back
          </button>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Matching Suggestions</h2>
              
              {/* Filter Matches */}
              <div className="flex gap-3">
                <select 
                  value={matchFilter}
                  onChange={(e) => setMatchFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">All Matches</option>
                  <option value="90">90%+ Match</option>
                  <option value="75">75%+ Match</option>
                  <option value="50">50%+ Match</option>
                </select>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
                {selectedMatches.length > 0 && (
                  <button 
                    onClick={() => {
                      // Bulk invite logic
                      setSelectedMatches([]);
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                  >
                    Send Invitations to All Selected ({selectedMatches.length})
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Volunteer Matches
                </h3>
                <div className="space-y-4">
                  {mockVolunteers
                    .filter(v => !rejectedMatches.includes(v.id))
                    .filter(v => !matchFilter || v.matchScore >= parseInt(matchFilter))
                    .filter(v => !locationFilter || v.location.includes(locationFilter))
                    .map((volunteer) => (
                    <div key={volunteer.id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                      <input 
                        type="checkbox"
                        checked={selectedMatches.includes(volunteer.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMatches([...selectedMatches, volunteer.id]);
                          } else {
                            setSelectedMatches(selectedMatches.filter(id => id !== volunteer.id));
                          }
                        }}
                        className="absolute top-2 left-2 z-10"
                      />
                      {volunteer.matchScore >= 90 && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          ⭐ Best Match
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-3 ml-6">
                        <div>
                          <h4 className="font-medium text-gray-900">{volunteer.name}</h4>
                          <p className="text-sm text-gray-600">{volunteer.location}</p>
                        </div>
                        <div className="text-right">
                          <div 
                            className={`text-sm font-medium cursor-help ${
                              volunteer.matchScore >= 80 ? 'text-green-600' : 'text-orange-600'
                            }`}
                            title={`Match Breakdown:\nCategory: ${volunteer.matchBreakdown.category ? '✓' : '✗'}\nSkills: ${volunteer.matchBreakdown.skills ? '✓' : '✗'}\nLocation: ${volunteer.matchBreakdown.location ? '✓' : '✗'}`}
                          >
                            {volunteer.matchScore}% match
                          </div>
                          <div className="text-xs text-gray-500">★ {volunteer.rating}</div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedMatch({...volunteer, type: 'volunteer'});
                            setShowAvailabilityModal(true);
                          }}
                          className="flex-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                        >
                          Check Availability
                        </button>
                        <button 
                          onClick={() => setRejectedMatches([...rejectedMatches, volunteer.id])}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                      <button 
                        className="w-full mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View Full Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resource Matches
                </h3>
                <div className="space-y-4">
                  {mockDonors
                    .filter(d => !rejectedMatches.includes(d.id))
                    .filter(d => !matchFilter || d.matchScore >= parseInt(matchFilter))
                    .filter(d => !locationFilter || d.location.includes(locationFilter))
                    .map((donor) => (
                    <div key={donor.id} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                      <input 
                        type="checkbox"
                        checked={selectedMatches.includes(donor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMatches([...selectedMatches, donor.id]);
                          } else {
                            setSelectedMatches(selectedMatches.filter(id => id !== donor.id));
                          }
                        }}
                        className="absolute top-2 left-2 z-10"
                      />
                      {donor.matchScore >= 90 && (
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          ⭐ Best Match
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-3 ml-6">
                        <div>
                          <h4 className="font-medium text-gray-900">{donor.name}</h4>
                          <p className="text-sm text-gray-600">{donor.location}</p>
                        </div>
                        <div className="text-right">
                          <div 
                            className={`text-sm font-medium cursor-help ${
                              donor.matchScore >= 80 ? 'text-green-600' : 'text-orange-600'
                            }`}
                            title={`Match Breakdown:\nCategory: ${donor.matchBreakdown.category ? '✓' : '✗'}\nResources: ${donor.matchBreakdown.resources ? '✓' : '✗'}\nLocation: ${donor.matchBreakdown.location ? '✓' : '✗'}`}
                          >
                            {donor.matchScore}% match
                          </div>
                          <div className="text-xs text-gray-500">★ {donor.rating}</div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {donor.resources.map((resource, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedMatch({...donor, type: 'donor'});
                            setShowInvitationModal(true);
                          }}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                          Send Invitation
                        </button>
                        <button 
                          onClick={() => setRejectedMatches([...rejectedMatches, donor.id])}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                      <button 
                        className="w-full mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View Full Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Details */}
      {showApplicationDetails && selectedApplication && (
        <div>
          <button 
            onClick={() => setShowApplicationDetails(false)}
            className="mb-4 text-orange-600 hover:text-orange-800 flex items-center gap-2"
          >
            ← Back to My Applications
          </button>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedApplication.project}</h2>
              <p className="text-gray-600">{selectedApplication.grantTitle}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Matching Results</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Skills Matched:</span>
                      <span className="font-medium text-green-600">{selectedApplication.matches.skills}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resources Matched:</span>
                      <span className="font-medium text-blue-600">{selectedApplication.matches.resources}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitations Sent</h3>
                  <div className="space-y-3">
                    {selectedApplication.invitations?.map((inv: any) => (
                      <div key={inv.id} className="flex justify-between items-center">
                        <span className="text-gray-700">{inv.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inv.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          inv.status === 'viewed' ? 'bg-orange-100 text-orange-800' :
                          inv.status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Matches</h3>
                  <div className="space-y-3">
                    {selectedApplication.acceptedMatches?.map((match: any) => (
                      <div key={match.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {match.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{match.name}</div>
                          <div className="text-sm text-green-600">{match.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Info</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{formatAmount(selectedApplication.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium">{selectedApplication.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Availability Confirmation Modal */}
      {showAvailabilityModal && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Check Availability</h3>
                <p className="text-sm text-gray-600">{selectedMatch.name}</p>
              </div>
              <button 
                onClick={() => setShowAvailabilityModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When is the volunteer available?
                </label>
                <select 
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select availability...</option>
                  <option value="immediately">Immediately</option>
                  <option value="within_week">Within a week</option>
                  <option value="within_month">Within a month</option>
                  <option value="flexible">Flexible schedule</option>
                </select>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Volunteer Status</h4>
                <p className="text-xs text-gray-600">Currently: {selectedMatch.availability}</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowAvailabilityModal(false);
                    setSelectedMatch({...selectedMatch, type: 'volunteer'});
                    setShowInvitationModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  disabled={!selectedAvailability}
                >
                  Send Invitation
                </button>
                <button 
                  onClick={() => setShowAvailabilityModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invitation Modal */}
      {showInvitationModal && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Send Invitation</h3>
                <p className="text-sm text-gray-600">{selectedMatch.name}</p>
              </div>
              <button 
                onClick={() => setShowInvitationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Profile Summary</h4>
                <p className="text-xs text-gray-600 mb-2">{selectedMatch.bio}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Rating: ★ {selectedMatch.rating}</span>
                  <span className="text-gray-500">{selectedMatch.matchScore}% match</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invitation Message
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" 
                  rows={4}
                  placeholder={`Hi ${selectedMatch.name}, we'd love to have you join our project...`}
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    console.log(`Email sent to ${selectedMatch.name}: You've been matched with NGO India`);
                    setShowInvitationModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Send Invitation
                </button>
                <button 
                  onClick={() => setShowInvitationModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}