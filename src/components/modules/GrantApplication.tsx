import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Calendar, IndianRupee, 
  Eye, CheckCircle, XCircle, Clock, Plus,
  BookOpen, Heart, Leaf, Shield, ArrowRight
} from 'lucide-react';
import { GrantApplication, GrantApplicationFormData } from '../../types/grantApplication';
import { formatNumber } from '../../utils/formatNumber';
import { GrantApplicationForm } from '../pages/GrantApplicationForm';
import { grantApplicationApi } from '../../utils/grantApplicationApi';

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

  const grantDomains = [
    {
      id: 'education',
      name: 'Education',
      description: 'Supporting quality education initiatives across India, focusing on digital literacy, educational infrastructure development, and capacity building programs. We work with NGOs to create sustainable impact in underserved communities through innovative learning solutions.',
      icon: BookOpen,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      description: 'Advancing healthcare and wellness initiatives across India, focusing on rural healthcare access, community health programs, and medical infrastructure development. We partner with NGOs to create sustainable impact in underserved communities through technology-enabled healthcare solutions.',
      icon: Heart,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    {
      id: 'ecology',
      name: 'Ecology',
      description: 'Promoting environmental sustainability and conservation initiatives across India, focusing on climate action, biodiversity protection, and green infrastructure development. We collaborate with NGOs to create sustainable impact in communities through eco-friendly solutions and awareness programs.',
      icon: Leaf,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'disaster-response',
      name: 'Disaster Response',
      description: 'Supporting disaster preparedness and emergency response initiatives across India, focusing on community resilience, disaster management infrastructure, and rehabilitation programs. We work with NGOs to create sustainable impact in vulnerable communities through comprehensive disaster response solutions.',
      icon: Shield,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
      buttonColor: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Grant Application</h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  window.history.pushState({}, '', '/browse-grants');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Browse Grants
              </button>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-2xl text-gray-600 font-bold">Welcome Grantseekers</p>
          </div>
        </div>

        {/* Grant Information */}
        <div className="mb-12">
          {/* Hero Image */}
          <div className="relative mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80" 
              alt="Hands holding money - grant funding concept" 
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center">
              <div className="text-white p-12 max-w-2xl">
                <h1 className="text-4xl font-bold mb-4">Grant Applications Guide</h1>
                <p className="text-xl opacity-90">Your comprehensive resource for understanding and navigating the grant application process</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                <strong>Grant applications</strong> are formal requests for funding submitted by organizations to foundations, government agencies, or other funding bodies. 
                These applications typically support projects across diverse sectors including social development, community welfare, research initiatives, and capacity building programs.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The grant application process involves detailed project proposals, comprehensive budget planning, thorough impact assessment, and strict compliance with specific eligibility criteria 
                set by funding organizations. Organizations must demonstrate their capability to execute proposed projects effectively and sustainably.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Grant funding serves as a critical resource for non-profit organizations, enabling them to implement innovative solutions, expand their reach, 
                and create meaningful impact in communities. The competitive nature of grant applications requires organizations to present compelling cases 
                that clearly articulate the problem, proposed solution, and expected outcomes.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <img 
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200&q=80" 
                alt="Application forms and documentation" 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Documentation Required</h3>
              <p className="text-blue-800 text-sm">Proper documentation is essential for successful grant applications, including project proposals, budgets, and organizational credentials.</p>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-6 mb-8">
              <img 
                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80" 
                alt="Funding categories and grant types" 
                className="w-32 h-32 object-cover rounded-full shadow-lg"
              />
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Types of Grants</h2>
                <p className="text-gray-600">Understanding different funding categories and their specific requirements</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Grant funding is available across various sectors and causes, each with distinct characteristics and requirements. Organizations can apply for grants that align with their mission, 
                project goals, and target beneficiaries. Understanding different grant types helps organizations identify the most suitable funding opportunities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Project Grants</h3>
                  <p className="text-green-800 text-sm mb-4">
                    Project grants fund specific initiatives with defined timelines, objectives, and deliverables. These grants typically support new programs, 
                    pilot projects, or expansion of existing services.
                  </p>
                  <div className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                    Most Common Type
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Capacity Building Grants</h3>
                  <p className="text-blue-800 text-sm mb-4">
                    These grants focus on strengthening organizational capabilities, improving systems, training staff, and enhancing operational efficiency. 
                    They support long-term sustainability.
                  </p>
                  <div className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
                    Long-term Impact
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Research Grants</h3>
                  <p className="text-purple-800 text-sm mb-4">
                    Research grants support systematic investigation and study of specific issues, problems, or phenomena. They fund data collection, analysis, 
                    and publication of findings.
                  </p>
                  <div className="text-xs text-purple-700 bg-purple-100 px-3 py-1 rounded-full inline-block">
                    Evidence-based
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8">
              <div className="flex items-center gap-6 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" 
                  alt="Eligibility checklist and requirements" 
                  className="w-24 h-24 object-cover rounded-full shadow-lg"
                />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Eligibility Requirements</h2>
                  <p className="text-gray-600">Essential criteria organizations must meet to qualify for grant funding</p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Grant eligibility varies significantly across funding organizations, but common requirements include legal registration status, 
                demonstrated track record, financial stability, and alignment with funder priorities. Organizations must carefully review 
                each grant's specific criteria before applying.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Organizational Requirements</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Most grants require applicants to be legally registered entities such as non-profit organizations, trusts, societies, or companies. 
                  Organizations must provide registration certificates, tax exemption documents, and governance structure details.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Required Documents:</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Registration Certificate</li>
                    <li>• Tax Exemption Certificate</li>
                    <li>• Board Resolution</li>
                    <li>• Governance Structure</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Experience and Track Record</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Funders typically require evidence of relevant experience, successful project implementation, and organizational capacity. 
                  This includes annual reports, audited financial statements, project portfolios, and references.
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Evidence Required:</h4>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• Annual Reports (3 years)</li>
                    <li>• Audited Financial Statements</li>
                    <li>• Project Portfolio</li>
                    <li>• Reference Letters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Application Process</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              The grant application process is typically multi-staged and highly competitive, requiring careful preparation and attention to detail. 
              Organizations should allow sufficient time for research, proposal development, and review before submission deadlines.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pre-Application Phase</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              This phase involves identifying suitable funding opportunities, researching funder priorities, reviewing guidelines, and assessing organizational readiness. 
              Many funders offer concept notes or letters of inquiry as preliminary screening mechanisms before full proposal submission.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Proposal Development</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Successful proposals require comprehensive planning, clear articulation of problems and solutions, realistic budgets, and robust monitoring frameworks. 
              Organizations must demonstrate innovation, sustainability, and potential for significant impact through their proposed interventions.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Review and Selection</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Applications undergo rigorous review processes including administrative screening, technical evaluation by subject matter experts, 
              due diligence checks, and final selection by grant committees. The process may include presentations, site visits, or interviews.
            </p>
          </div>
          

        </div>

      {/* Applications List */}
      {applications.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Applications</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {applications.map((app) => (
              <div key={app.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{app.projectTitle}</h3>
                    <p className="text-gray-600 mb-2">{app.organizationName || app.applicantName}</p>
                    <p className="text-sm text-gray-500 mb-3">{app.projectDescription.substring(0, 150)}...</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>₹{formatNumber(app.requestedAmount)}</span>
                      <span>{app.category}</span>
                      <span>{new Date(app.submissionDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)} flex items-center gap-1`}>
                      {getStatusIcon(app.status)}
                      {app.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      </div>
    </div>
  );
}

export function GrantApplicationModule() {
  const [showForm, setShowForm] = useState(false);
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await grantApplicationApi.getAll();
      // Transform PHP response to match frontend types
      const transformedData = data.map((app: any) => ({
        id: app.id.toString(),
        applicantName: app.applicant_name,
        applicantEmail: app.applicant_email,
        applicantPhone: app.applicant_phone,
        organizationName: app.organization_name,
        projectTitle: app.project_title,
        projectDescription: app.project_description,
        requestedAmount: parseFloat(app.requested_amount),
        projectDuration: app.project_duration,
        category: app.category,
        submissionDate: app.created_at,
        status: app.status,
        reviewNotes: app.review_notes
      }));
      setApplications(transformedData);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: GrantApplication['status'], notes?: string) => {
    try {
      await grantApplicationApi.updateStatus(id, status, notes);
      await loadApplications(); // Reload applications
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (showForm) {
    return <GrantApplicationForm onBack={() => { setShowForm(false); loadApplications(); }} onSubmit={async () => true} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <GrantApplicationList
      applications={applications}
      onViewDetails={() => {}}
      onUpdateStatus={handleUpdateStatus}
      onNewApplication={() => setShowForm(true)}
    />
  );
}