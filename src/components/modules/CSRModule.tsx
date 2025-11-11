import React, { useState } from 'react';
import { 
  Building2, Plus, Users, DollarSign, FileText, CheckCircle, Clock, AlertCircle, 
  Upload, Download, Star, MapPin, Calendar, Target, TrendingUp, Eye, Edit,
  Send, MessageSquare, Award, BarChart3, PieChart, Filter, Search,
  Mail, Phone, Globe, Camera, Receipt, FileImage, Handshake
} from 'lucide-react';

interface CSRProject {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  duration: string;
  beneficiaries: number;
  location: string;
  sdgGoals: string[];
  status: 'open' | 'funded' | 'active' | 'completed';
  fundingReceived: number;
  fundUtilized: number;
  partnerId?: string;
  partnerName?: string;
  images: string[];
  documents: string[];
  expectedOutcomes: string[];
  progress: number;
  milestones: Milestone[];
  impactData: ImpactData;
  createdDate: string;
  startDate?: string;
  endDate?: string;
}

interface CSRPartner {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  focusAreas: string[];
  status: 'pending' | 'approved' | 'active';
  registrationDate: string;
  csrPolicy: string;
  rating: number;
  totalFunding: number;
  activeProjects: number;
  completedProjects: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  completedDate?: string;
  evidence: string[];
}

interface ImpactData {
  beneficiariesReached: number;
  sdgsAchieved: string[];
  testimonials: Testimonial[];
  mediaGallery: string[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  image?: string;
}

interface FundTransaction {
  id: string;
  projectId: string;
  partnerId: string;
  amount: number;
  type: 'received' | 'utilized';
  purpose: string;
  date: string;
  receipt?: string;
  status: 'pending' | 'approved' | 'completed';
}

interface CSRAgreement {
  id: string;
  projectId: string;
  partnerId: string;
  type: 'proposal' | 'mou' | 'agreement' | 'contract' | 'nda' | 'amendment' | 'termination' | 'other';
  document: string;
  status: 'draft' | 'sent' | 'approved' | 'signed';
  createdDate: string;
  signedDate?: string;
  customProjectName?: string;
  customPartnerName?: string;
}

export function CSRModule() {
  const [activeTab, setActiveTab] = useState<'projects' | 'partners' | 'funding' | 'agreements' | 'reports' | 'compliance' | 'public'>('projects');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showPartnerRegistration, setShowPartnerRegistration] = useState(false);
  const [selectedProject, setSelectedProject] = useState<CSRProject | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<CSRPartner | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [showPartnerDetails, setShowPartnerDetails] = useState(false);
  const [showUploadAgreement, setShowUploadAgreement] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    reportType: 'impact' as 'impact' | 'financial' | 'compliance' | 'summary',
    dateRange: '2024' as string,
    includeProjects: true,
    includePartners: true,
    includeFunding: true,
    format: 'pdf' as 'pdf' | 'excel' | 'csv'
  });
  const [uploadFormData, setUploadFormData] = useState({
    projectId: '',
    partnerId: '',
    type: 'mou' as 'proposal' | 'mou' | 'agreement' | 'contract' | 'nda' | 'amendment' | 'termination' | 'other',
    customType: '',
    customProject: '',
    customPartner: '',
    file: null as File | null
  });

  const csrProjects: CSRProject[] = [
    {
      id: '1',
      title: 'Digital Education Initiative',
      description: 'Providing digital literacy training to rural students with modern technology and qualified instructors',
      category: 'Education',
      budget: 500000,
      duration: '12 months',
      beneficiaries: 1000,
      location: 'Karnataka, India',
      sdgGoals: ['SDG 4: Quality Education', 'SDG 8: Decent Work'],
      status: 'active',
      fundingReceived: 500000,
      fundUtilized: 300000,
      partnerId: '1',
      partnerName: 'Tech Corp Ltd',
      images: ['/sample-education.jpg', '/sample-students.jpg'],
      documents: ['project-proposal.pdf', 'budget-breakdown.pdf'],
      expectedOutcomes: ['1000 students trained', 'Digital literacy certification', 'Job placement assistance'],
      progress: 60,
      createdDate: '2024-01-15',
      startDate: '2024-02-01',
      milestones: [
        {
          id: '1',
          title: 'Infrastructure Setup',
          description: 'Computer lab setup in 5 schools',
          targetDate: '2024-03-01',
          status: 'completed',
          completedDate: '2024-02-28',
          evidence: ['setup-photos.jpg', 'completion-certificate.pdf']
        }
      ],
      impactData: {
        beneficiariesReached: 600,
        sdgsAchieved: ['SDG 4: Quality Education'],
        testimonials: [
          {
            id: '1',
            name: 'Priya Sharma',
            role: 'Student',
            message: 'This program changed my life. I can now use computers confidently.',
            image: '/testimonial-1.jpg'
          }
        ],
        mediaGallery: ['/impact-1.jpg', '/impact-2.jpg']
      }
    },
    {
      id: '2',
      title: 'Healthcare Access Program',
      description: 'Mobile healthcare units providing medical services to remote villages and underserved communities',
      category: 'Healthcare',
      budget: 750000,
      duration: '18 months',
      beneficiaries: 2500,
      location: 'Rajasthan, India',
      sdgGoals: ['SDG 3: Good Health', 'SDG 10: Reduced Inequalities'],
      status: 'completed',
      fundingReceived: 750000,
      fundUtilized: 750000,
      partnerId: '2',
      partnerName: 'HealthCare Foundation',
      images: ['/healthcare-mobile.jpg', '/medical-camp.jpg'],
      documents: ['healthcare-proposal.pdf', 'medical-reports.pdf'],
      expectedOutcomes: ['2500 people treated', 'Health awareness programs', 'Vaccination drives'],
      progress: 100,
      createdDate: '2023-08-01',
      startDate: '2023-09-01',
      endDate: '2024-02-29',
      milestones: [
        {
          id: '1',
          title: 'Mobile Unit Deployment',
          description: 'Deploy 3 mobile healthcare units',
          targetDate: '2023-10-01',
          status: 'completed',
          completedDate: '2023-09-28',
          evidence: ['deployment-photos.jpg', 'unit-certificates.pdf']
        }
      ],
      impactData: {
        beneficiariesReached: 2500,
        sdgsAchieved: ['SDG 3: Good Health', 'SDG 10: Reduced Inequalities'],
        testimonials: [
          {
            id: '1',
            name: 'Ramesh Kumar',
            role: 'Village Elder',
            message: 'The mobile healthcare unit saved many lives in our village. We are grateful for this service.',
            image: '/testimonial-healthcare.jpg'
          }
        ],
        mediaGallery: ['/health-impact-1.jpg', '/health-impact-2.jpg']
      }
    },
    {
      id: '3',
      title: 'Women Empowerment Initiative',
      description: 'Skill development and entrepreneurship training for rural women to achieve financial independence',
      category: 'Women Empowerment',
      budget: 400000,
      duration: '15 months',
      beneficiaries: 800,
      location: 'Uttar Pradesh, India',
      sdgGoals: ['SDG 5: Gender Equality', 'SDG 8: Decent Work'],
      status: 'active',
      fundingReceived: 400000,
      fundUtilized: 200000,
      partnerId: '3',
      partnerName: 'Green Industries',
      images: ['/women-training.jpg', '/skill-development.jpg'],
      documents: ['women-empowerment-proposal.pdf', 'training-curriculum.pdf'],
      expectedOutcomes: ['800 women trained', 'Self-help groups formed', 'Micro-enterprises established'],
      progress: 50,
      createdDate: '2024-01-01',
      startDate: '2024-02-15',
      milestones: [
        {
          id: '1',
          title: 'Training Center Setup',
          description: 'Establish training centers in 4 villages',
          targetDate: '2024-03-15',
          status: 'completed',
          completedDate: '2024-03-10',
          evidence: ['center-photos.jpg', 'setup-completion.pdf']
        }
      ],
      impactData: {
        beneficiariesReached: 400,
        sdgsAchieved: ['SDG 5: Gender Equality'],
        testimonials: [
          {
            id: '1',
            name: 'Sunita Devi',
            role: 'Trainee',
            message: 'This program gave me confidence and skills to start my own tailoring business.',
            image: '/testimonial-women.jpg'
          }
        ],
        mediaGallery: ['/women-impact-1.jpg', '/women-impact-2.jpg']
      }
    },
    {
      id: '4',
      title: 'Clean Water Access Initiative',
      description: 'Installing water purification systems and bore wells in drought-affected villages to provide clean drinking water',
      category: 'Infrastructure',
      budget: 600000,
      duration: '10 months',
      beneficiaries: 1500,
      location: 'Maharashtra, India',
      sdgGoals: ['SDG 6: Clean Water', 'SDG 3: Good Health'],
      status: 'funded',
      fundingReceived: 600000,
      fundUtilized: 0,
      partnerId: '4',
      partnerName: 'EcoSustain Corp',
      images: ['/water-project.jpg', '/village-well.jpg'],
      documents: ['water-project-proposal.pdf', 'technical-specs.pdf'],
      expectedOutcomes: ['1500 people with clean water access', '10 water purification systems installed', 'Community water management training'],
      progress: 0,
      createdDate: '2024-03-01',
      startDate: '2024-03-15',
      milestones: [
        {
          id: '1',
          title: 'Site Survey and Planning',
          description: 'Complete geological survey and water source identification',
          targetDate: '2024-04-01',
          status: 'pending',
          evidence: []
        }
      ],
      impactData: {
        beneficiariesReached: 0,
        sdgsAchieved: [],
        testimonials: [],
        mediaGallery: []
      }
    }
  ];

  const csrPartners: CSRPartner[] = [
    {
      id: '1',
      companyName: 'Tech Corp Ltd',
      contactEmail: 'csr@techcorp.com',
      contactPhone: '+91-9876543210',
      website: 'www.techcorp.com',
      focusAreas: ['Education', 'Technology', 'Skill Development'],
      status: 'active',
      registrationDate: '2024-01-10',
      csrPolicy: 'Committed to digital education and technology access for underprivileged communities',
      rating: 4.8,
      totalFunding: 1200000,
      activeProjects: 2,
      completedProjects: 3
    },
    {
      id: '3',
      companyName: 'Green Industries',
      contactEmail: 'sustainability@green.com',
      contactPhone: '+91-9876543212',
      website: 'www.greenindustries.com',
      focusAreas: ['Environment', 'Healthcare', 'Sustainability'],
      status: 'pending',
      registrationDate: '2024-01-15',
      csrPolicy: 'Environmental sustainability and community health initiatives',
      rating: 0,
      totalFunding: 0,
      activeProjects: 0,
      completedProjects: 0
    },
    {
      id: '2',
      companyName: 'HealthCare Foundation',
      contactEmail: 'partnerships@healthcare.org',
      contactPhone: '+91-9876543211',
      website: 'www.healthcarefoundation.org',
      focusAreas: ['Healthcare', 'Rural Development', 'Emergency Services'],
      status: 'active',
      registrationDate: '2023-07-20',
      csrPolicy: 'Dedicated to providing accessible healthcare services to underserved communities across India',
      rating: 4.9,
      totalFunding: 750000,
      activeProjects: 0,
      completedProjects: 1
    },
    {
      id: '4',
      companyName: 'EcoSustain Corp',
      contactEmail: 'csr@ecosustain.com',
      contactPhone: '+91-9876543213',
      website: 'www.ecosustain.com',
      focusAreas: ['Environment', 'Sustainability', 'Climate Action'],
      status: 'active',
      registrationDate: '2024-02-01',
      csrPolicy: 'Committed to environmental conservation and sustainable development initiatives',
      rating: 4.7,
      totalFunding: 600000,
      activeProjects: 1,
      completedProjects: 0
    }
  ];

  const fundTransactions: FundTransaction[] = [
    {
      id: '1',
      projectId: '1',
      partnerId: '1',
      amount: 500000,
      type: 'received',
      purpose: 'Initial project funding',
      date: '2024-02-01',
      receipt: 'receipt-001.pdf',
      status: 'completed'
    },
    {
      id: '2',
      projectId: '1',
      partnerId: '1',
      amount: 150000,
      type: 'utilized',
      purpose: 'Infrastructure setup and equipment',
      date: '2024-02-15',
      receipt: 'expense-001.pdf',
      status: 'completed'
    },
    {
      id: '3',
      projectId: '2',
      partnerId: '2',
      amount: 750000,
      type: 'received',
      purpose: 'Healthcare program funding',
      date: '2023-09-01',
      receipt: 'receipt-002.pdf',
      status: 'completed'
    },
    {
      id: '4',
      projectId: '2',
      partnerId: '2',
      amount: 300000,
      type: 'utilized',
      purpose: 'Mobile unit procurement',
      date: '2023-09-15',
      receipt: 'expense-002.pdf',
      status: 'completed'
    },
    {
      id: '5',
      projectId: '2',
      partnerId: '2',
      amount: 450000,
      type: 'utilized',
      purpose: 'Medical supplies and operations',
      date: '2023-12-01',
      receipt: 'expense-003.pdf',
      status: 'completed'
    },
    {
      id: '6',
      projectId: '3',
      partnerId: '3',
      amount: 400000,
      type: 'received',
      purpose: 'Women empowerment program funding',
      date: '2024-02-15',
      receipt: 'receipt-003.pdf',
      status: 'completed'
    },
    {
      id: '7',
      projectId: '3',
      partnerId: '3',
      amount: 200000,
      type: 'utilized',
      purpose: 'Training center setup and equipment',
      date: '2024-03-01',
      receipt: 'expense-004.pdf',
      status: 'completed'
    },
    {
      id: '8',
      projectId: '4',
      partnerId: '4',
      amount: 600000,
      type: 'received',
      purpose: 'Clean water infrastructure funding',
      date: '2024-03-15',
      receipt: 'receipt-004.pdf',
      status: 'completed'
    }
  ];

  const csrAgreements: CSRAgreement[] = [
    {
      id: '1',
      projectId: '1',
      partnerId: '1',
      type: 'mou',
      document: 'mou-techcorp-digital-education.pdf',
      status: 'signed',
      createdDate: '2024-01-20',
      signedDate: '2024-01-25'
    },
    {
      id: '2',
      projectId: '2',
      partnerId: '2',
      type: 'agreement',
      document: 'agreement-healthcare-mobile-units.pdf',
      status: 'signed',
      createdDate: '2023-08-15',
      signedDate: '2023-08-20'
    },
    {
      id: '3',
      projectId: '3',
      partnerId: '3',
      type: 'mou',
      document: 'mou-green-women-empowerment.pdf',
      status: 'signed',
      createdDate: '2024-01-30',
      signedDate: '2024-02-05'
    }
  ];

  const getStats = () => [
    { 
      label: 'Active Projects', 
      value: projects.filter(p => p.status === 'active').length, 
      icon: FileText, 
      color: 'bg-orange-500',
      trend: '+12%'
    },
    { 
      label: 'CSR Partners', 
      value: csrPartners.filter(p => p.status === 'active').length, 
      icon: Building2, 
      color: 'bg-blue-500',
      trend: '+25%'
    },
    { 
      label: 'Total Funding', 
      value: `₹${projects.reduce((sum, p) => sum + p.fundingReceived, 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-green-500',
      trend: '+18%'
    },
    { 
      label: 'Beneficiaries', 
      value: projects.reduce((sum, p) => sum + p.impactData.beneficiariesReached, 0).toLocaleString(), 
      icon: Users, 
      color: 'bg-purple-500',
      trend: '+35%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'funded': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'funded': case 'approved': case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <Award className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const categories = ['Education', 'Environment', 'Healthcare', 'Women Empowerment', 'Skill Development'];

  const [partners, setPartners] = useState(csrPartners);
  const [agreements, setAgreements] = useState(csrAgreements);
  const [projects, setProjects] = useState<CSRProject[]>(csrProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [isPartnerLoading, setIsPartnerLoading] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    csrPolicy: '',
    focusAreas: [] as string[],
    customFocusArea: ''
  });
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    category: '',
    customCategory: '',
    budget: '',
    duration: '',
    beneficiaries: '',
    location: '',
    sdgGoals: '',
    expectedOutcomes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocusAreaChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: checked 
        ? [...prev.focusAreas, area]
        : prev.focusAreas.filter(a => a !== area)
    }));
  };

  const handleCustomFocusAreaAdd = () => {
    if (formData.customFocusArea.trim() && !formData.focusAreas.includes(formData.customFocusArea.trim())) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, prev.customFocusArea.trim()],
        customFocusArea: ''
      }));
    }
  };

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProjectFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const projectCategory = projectFormData.category === 'Other' ? projectFormData.customCategory : projectFormData.category;
      const projectData = {
        title: projectFormData.title,
        description: projectFormData.description,
        category: projectCategory,
        budget: parseInt(projectFormData.budget),
        duration: projectFormData.duration,
        beneficiaries: parseInt(projectFormData.beneficiaries),
        location: projectFormData.location,
        sdgGoals: projectFormData.sdgGoals,
        expectedOutcomes: projectFormData.expectedOutcomes
      };

      const response = await fetch('http://localhost/NGO-India/backend/add_csr_project_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });

      const result = await response.json();

      if (result.success) {
        // Create frontend project object
        const newProject: CSRProject = {
          id: result.project_id.toString(),
          title: projectFormData.title,
          description: projectFormData.description,
          category: projectCategory,
          budget: parseInt(projectFormData.budget),
          duration: projectFormData.duration,
          beneficiaries: parseInt(projectFormData.beneficiaries),
          location: projectFormData.location,
          sdgGoals: projectFormData.sdgGoals.split(',').map(s => s.trim()),
          status: 'open',
          fundingReceived: 0,
          fundUtilized: 0,
          images: [],
          documents: [],
          expectedOutcomes: projectFormData.expectedOutcomes.split(',').map(s => s.trim()),
          progress: 0,
          milestones: [],
          impactData: {
            beneficiariesReached: 0,
            sdgsAchieved: [],
            testimonials: [],
            mediaGallery: []
          },
          createdDate: new Date().toISOString().split('T')[0]
        };

        setProjects(prev => [newProject, ...prev]);
        setProjectFormData({ title: '', description: '', category: '', customCategory: '', budget: '', duration: '', beneficiaries: '', location: '', sdgGoals: '', expectedOutcomes: '' });
        setShowAddProject(false);
        alert('Project created successfully!');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPartnerLoading(true);
    
    try {
      const partnerData = {
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        csrPolicy: formData.csrPolicy,
        focusAreas: formData.focusAreas
      };

      const response = await fetch('http://localhost/NGO-India/backend/add_csr_partner_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData)
      });

      const result = await response.json();

      if (result.success) {
        // Create frontend partner object
        const newPartner: CSRPartner = {
          id: result.partner_id.toString(),
          companyName: formData.companyName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          website: formData.website,
          focusAreas: formData.focusAreas,
          status: 'pending',
          registrationDate: new Date().toISOString().split('T')[0],
          csrPolicy: formData.csrPolicy,
          rating: 0,
          totalFunding: 0,
          activeProjects: 0,
          completedProjects: 0
        };

        setPartners(prev => [newPartner, ...prev]);
        setFormData({ companyName: '', contactEmail: '', contactPhone: '', website: '', csrPolicy: '', focusAreas: [], customFocusArea: '' });
        setShowPartnerRegistration(false);
        alert('Registration submitted successfully! Awaiting admin approval.');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Failed to submit registration. Please try again.');
    } finally {
      setIsPartnerLoading(false);
    }
  };

  const approvePartner = (partnerId: string) => {
    setPartners(prev => prev.map(partner => 
      partner.id === partnerId 
        ? { ...partner, status: 'active' as const }
        : partner
    ));
    alert('Partner approved successfully!');
  };

  const rejectPartner = (partnerId: string) => {
    setPartners(prev => prev.filter(partner => partner.id !== partnerId));
    alert('Partner registration rejected.');
  };

  const handleUploadInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === 'type' && value !== 'other' ? { customType: '' } : {}),
      ...(name === 'projectId' && value !== 'other' ? { customProject: '' } : {}),
      ...(name === 'partnerId' && value !== 'other' ? { customPartner: '' } : {})
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFormData(prev => ({ ...prev, file }));
  };

  const handleUploadAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.file) {
      alert('Please select a file to upload.');
      return;
    }
    if (uploadFormData.type === 'other' && !uploadFormData.customType.trim()) {
      alert('Please enter a custom agreement type.');
      return;
    }
    if (uploadFormData.projectId === 'other' && !uploadFormData.customProject.trim()) {
      alert('Please enter a custom project name.');
      return;
    }
    if (uploadFormData.partnerId === 'other' && !uploadFormData.customPartner.trim()) {
      alert('Please enter a custom partner name.');
      return;
    }

    const agreementType = uploadFormData.type === 'other' ? uploadFormData.customType : uploadFormData.type;
    const projectId = uploadFormData.projectId === 'other' ? 'custom-' + Date.now() : uploadFormData.projectId;
    const partnerId = uploadFormData.partnerId === 'other' ? 'custom-' + Date.now() : uploadFormData.partnerId;
    
    const newAgreement: CSRAgreement = {
      id: Date.now().toString(),
      projectId: projectId,
      partnerId: partnerId,
      type: agreementType as any,
      document: uploadFormData.file.name,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      ...(uploadFormData.projectId === 'other' && { customProjectName: uploadFormData.customProject }),
      ...(uploadFormData.partnerId === 'other' && { customPartnerName: uploadFormData.customPartner })
    };

    setAgreements(prev => [...prev, newAgreement]);
    setUploadFormData({ projectId: '', partnerId: '', type: 'mou', customType: '', customProject: '', customPartner: '', file: null });
    setShowUploadAgreement(false);
    alert('Agreement uploaded successfully!');
  };

  const pendingPartners = partners.filter(p => p.status === 'pending');
  const pendingCount = pendingPartners.length;

  const handleReportInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setReportFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_csr_projects_api.php');
      const result = await response.json();
      
      if (result.success) {
        // Combine existing mock data with database data
        const combinedProjects = [...csrProjects, ...result.projects];
        setProjects(combinedProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Keep existing mock data if API fails
      setProjects(csrProjects);
    }
  };

  const loadPartners = async () => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_csr_partners_api.php');
      const result = await response.json();
      
      if (result.success) {
        // Combine existing mock data with database data
        const combinedPartners = [...csrPartners, ...result.partners];
        setPartners(combinedPartners);
      }
    } catch (error) {
      console.error('Error loading partners:', error);
      // Keep existing mock data if API fails
      setPartners(csrPartners);
    }
  };

  React.useEffect(() => {
    loadProjects();
    loadPartners();
  }, []);

  const generateReport = () => {
    const reportData = {
      title: `CSR ${reportFormData.reportType.charAt(0).toUpperCase() + reportFormData.reportType.slice(1)} Report`,
      generatedDate: new Date().toLocaleDateString(),
      dateRange: reportFormData.dateRange,
      summary: {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedProjects: projects.filter(p => p.status === 'completed').length,
        totalFunding: projects.reduce((sum, p) => sum + p.fundingReceived, 0),
        totalBeneficiaries: projects.reduce((sum, p) => sum + p.impactData.beneficiariesReached, 0),
        activePartners: partners.filter(p => p.status === 'active').length
      },
      projects: reportFormData.includeProjects ? projects : [],
      partners: reportFormData.includePartners ? partners.filter(p => p.status === 'active') : [],
      funding: reportFormData.includeFunding ? fundTransactions : []
    };

    const reportContent = `
# ${reportData.title}

**Generated:** ${reportData.generatedDate}
**Period:** ${reportData.dateRange}

## Executive Summary
- Total Projects: ${reportData.summary.totalProjects}
- Active Projects: ${reportData.summary.activeProjects}
- Completed Projects: ${reportData.summary.completedProjects}
- Total Funding: ₹${reportData.summary.totalFunding.toLocaleString()}
- Lives Impacted: ${reportData.summary.totalBeneficiaries.toLocaleString()}
- Active Partners: ${reportData.summary.activePartners}

${reportFormData.includeProjects ? `## Projects\n${reportData.projects.map(p => `### ${p.title}\n- Category: ${p.category}\n- Budget: ₹${p.budget.toLocaleString()}\n- Status: ${p.status}\n- Beneficiaries: ${p.beneficiaries.toLocaleString()}\n- Progress: ${p.progress}%\n`).join('\n')}` : ''}

${reportFormData.includePartners ? `## Partners\n${reportData.partners.map(p => `### ${p.companyName}\n- Focus Areas: ${p.focusAreas.join(', ')}\n- Total Funding: ₹${p.totalFunding.toLocaleString()}\n- Active Projects: ${p.activeProjects}\n`).join('\n')}` : ''}

${reportFormData.includeFunding ? `## Financial Summary\n- Total Received: ₹${reportData.funding.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}\n- Total Utilized: ₹${reportData.funding.filter(t => t.type === 'utilized').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}\n` : ''}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CSR-${reportFormData.reportType}-Report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowReportModal(false);
    alert('Report generated and downloaded successfully!');
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CSR Management</h1>
        <p className="text-gray-600">Manage Corporate Social Responsibility projects and partnerships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {getStats().map((stat, idx) => (
          <div key={idx} className="bg-white shadow rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg text-white ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 text-xs">{stat.label}</p>
              </div>
              <div className="text-right">
                <span className="text-green-600 text-xs font-medium">{stat.trend}</span>
                <TrendingUp className="w-3 h-3 text-green-600 inline ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-4 bg-white p-1 rounded-lg shadow-sm">
        {[
          { key: 'projects', label: 'Projects', icon: FileText },
          { key: 'partners', label: 'Partners', icon: Building2 },
          { key: 'funding', label: 'Funding', icon: () => <span className="text-base font-bold">₹</span> },
          { key: 'agreements', label: 'Agreements', icon: Handshake },
          { key: 'reports', label: 'Reports', icon: BarChart3 },
          { key: 'compliance', label: 'Compliance', icon: CheckCircle },
          { key: 'public', label: 'Public', icon: Globe }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-100">
        {activeTab === 'projects' && (
          <div className="p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">CSR Projects</h2>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="funded">Funded</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                
                <button
                  onClick={() => setShowAddProject(true)}
                  className="bg-orange-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-orange-600 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {filteredProjects.map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
                          <p className="text-gray-600 mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              {project.category}
                            </span>
                            {project.sdgGoals.map((goal, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                                {goal}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>₹{project.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.beneficiaries.toLocaleString()} beneficiaries</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{project.location}</span>
                        </div>
                      </div>
                      
                      {project.status !== 'open' && (
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-700">Progress</span>
                            <span className="text-gray-600">{project.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-orange-500 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {project.partnerName && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-600">CSR Partner:</span>
                          <span className="text-gray-700">{project.partnerName}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(project.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {project.status === 'open' && (
                          <button
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Send to Partners"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">CSR Partners</h2>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPartnerRegistration(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Registered NGO Name
                </button>
                <button 
                  onClick={() => setShowPendingRequests(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2 relative"
                >
                  <Eye className="w-5 h-5" />
                  View Requests
                  {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid gap-6">
              {partners.map(partner => (
                <div key={partner.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{partner.companyName}</h3>
                          <p className="text-gray-600 mb-2">{partner.csrPolicy}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              <span>{partner.contactEmail}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{partner.contactPhone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              <span>{partner.website}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-sm text-gray-600">Focus Areas:</span>
                            {partner.focusAreas.map((area, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {area}
                              </span>
                            ))}
                          </div>
                          
                          {partner.status === 'active' && (
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Total Funding:</span>
                                <p className="text-green-600 font-semibold">₹{partner.totalFunding.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Active Projects:</span>
                                <p className="text-orange-600 font-semibold">{partner.activeProjects}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Completed:</span>
                                <p className="text-blue-600 font-semibold">{partner.completedProjects}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(partner.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(partner.status)}`}>
                              {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                            </span>
                          </div>
                          
                          {partner.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{partner.rating}</span>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedPartner(partner)}
                              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Send Message"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                            {partner.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => approvePartner(partner.id)}
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                                  title="Approve Partner"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => rejectPartner(partner.id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Reject Partner"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'funding' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Fund Tracking & Utilization</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500 rounded-full text-white">
                    <span className="text-xl font-bold">₹</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{fundTransactions.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                    </p>
                    <p className="text-green-600 text-sm">Total Received</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-500 rounded-full text-white">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-700">
                      ₹{fundTransactions.filter(t => t.type === 'utilized').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                    </p>
                    <p className="text-orange-600 text-sm">Total Utilized</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500 rounded-full text-white">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">
                      ₹{(fundTransactions.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0) - 
                         fundTransactions.filter(t => t.type === 'utilized').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}
                    </p>
                    <p className="text-blue-600 text-sm">Available Balance</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {projects.filter(p => p.fundingReceived > 0).map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600">Partner: {project.partnerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">₹{project.fundingReceived.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Funding</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Fund Utilization</span>
                      <span>{Math.round((project.fundUtilized / project.fundingReceived) * 100)}% utilized</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-orange-500 h-3 rounded-full transition-all duration-300" 
                        style={{ width: `${(project.fundUtilized / project.fundingReceived) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Received:</span>
                      <p className="font-semibold text-green-600">₹{project.fundingReceived.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Utilized:</span>
                      <p className="font-semibold text-orange-600">₹{project.fundUtilized.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Balance:</span>
                      <p className="font-semibold text-blue-600">₹{(project.fundingReceived - project.fundUtilized).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'agreements' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">CSR Agreements & MOUs</h2>
              <button 
                onClick={() => setShowUploadAgreement(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload Agreement
              </button>
            </div>
            
            <div className="space-y-4">
              {agreements.map(agreement => (
                <div key={agreement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">
                          {agreement.type.toUpperCase()} - {csrProjects.find(p => p.id === agreement.projectId)?.title || agreement.customProjectName || 'Unknown Project'}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Partner:</span>
                          <p>{partners.find(p => p.id === agreement.partnerId)?.companyName || agreement.customPartnerName || 'Unknown Partner'}</p>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>
                          <p className="capitalize">{agreement.type}</p>
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>
                          <p>{new Date(agreement.createdDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Signed:</span>
                          <p>{agreement.signedDate ? new Date(agreement.signedDate).toLocaleDateString() : 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agreement.status)}`}>
                        {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                      </span>
                      
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Impact Reports & Analytics</h2>
              <button 
                onClick={() => setShowReportModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Generate Report
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.impactData.beneficiariesReached, 0).toLocaleString()}</p>
                    <p className="text-blue-100">Lives Impacted</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold">{projects.filter(p => p.status === 'completed').length}</p>
                    <p className="text-green-100">Projects Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8" />
                  <div>
                    <p className="text-2xl font-bold">{csrPartners.filter(p => p.status === 'active').length}</p>
                    <p className="text-orange-100">Active Partners</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {projects.filter(p => p.impactData.beneficiariesReached > 0).map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">{project.title}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Impact Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Beneficiaries Reached:</span>
                          <span className="font-semibold">{project.impactData.beneficiariesReached.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">SDGs Achieved:</span>
                          <span className="font-semibold">{project.impactData.sdgsAchieved.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Testimonials:</span>
                          <span className="font-semibold">{project.impactData.testimonials.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Latest Testimonial</h4>
                      {project.impactData.testimonials.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 italic mb-2">"{project.impactData.testimonials[0].message}"</p>
                          <p className="text-sm text-gray-600">
                            - {project.impactData.testimonials[0].name}, {project.impactData.testimonials[0].role}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">CSR Compliance & Legal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Compliance Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CSR-2 Forms</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Updated</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Audit Reports</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Complete</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Legal Documentation</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Pending</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax Certificates</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Valid</span>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Document Repository</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">CSR Policy Document</span>
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Annual CSR Report</span>
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Impact Assessment</span>
                  </button>
                  <button className="w-full text-left p-2 hover:bg-gray-50 rounded flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700">Compliance Certificates</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'public' && (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Public CSR Display</h2>
            
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">CSR Impact Showcase</h3>
              <p className="text-gray-600 mb-4">Transparent display of our CSR initiatives and their impact on communities</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {projects.reduce((sum, p) => sum + p.impactData.beneficiariesReached, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Lives Transformed</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    ₹{projects.reduce((sum, p) => sum + p.fundingReceived, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">CSR Investment</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {csrPartners.filter(p => p.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Corporate Partners</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900">Success Stories</h3>
              {projects.filter(p => p.status === 'completed').map(project => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Award className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                      <p className="text-gray-600 mb-3">{project.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Beneficiaries:</span>
                          <p className="font-semibold text-green-600">{project.impactData.beneficiariesReached.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Investment:</span>
                          <p className="font-semibold text-blue-600">₹{project.fundingReceived.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <p className="font-semibold text-orange-600">{project.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Partner:</span>
                          <p className="font-semibold text-purple-600">{project.partnerName}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.impactData.sdgsAchieved.map((sdg, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            {sdg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload Agreement Modal */}
      {showUploadAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Agreement</h3>
              <button 
                onClick={() => setShowUploadAgreement(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUploadAgreement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                <select 
                  name="projectId"
                  value={uploadFormData.projectId}
                  onChange={handleUploadInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>
              
              {uploadFormData.projectId === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Project Name *</label>
                  <input 
                    type="text"
                    name="customProject"
                    value={uploadFormData.customProject}
                    onChange={handleUploadInputChange}
                    placeholder="Enter custom project name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Partner *</label>
                <select 
                  name="partnerId"
                  value={uploadFormData.partnerId}
                  onChange={handleUploadInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Partner</option>
                  {partners.filter(p => p.status === 'active').map(partner => (
                    <option key={partner.id} value={partner.id}>{partner.companyName}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>
              
              {uploadFormData.partnerId === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Partner Name *</label>
                  <input 
                    type="text"
                    name="customPartner"
                    value={uploadFormData.customPartner}
                    onChange={handleUploadInputChange}
                    placeholder="Enter custom partner name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agreement Type *</label>
                <select 
                  name="type"
                  value={uploadFormData.type}
                  onChange={handleUploadInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="proposal">Proposal</option>
                  <option value="mou">MOU</option>
                  <option value="agreement">Agreement</option>
                  <option value="contract">Contract</option>
                  <option value="nda">NDA</option>
                  <option value="amendment">Amendment</option>
                  <option value="termination">Termination</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {uploadFormData.type === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Agreement Type *</label>
                  <input 
                    type="text"
                    name="customType"
                    value={uploadFormData.customType}
                    onChange={handleUploadInputChange}
                    placeholder="Enter custom agreement type"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File *</label>
                <input 
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowUploadAgreement(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New CSR Project</h3>
              <button 
                onClick={() => setShowAddProject(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                  <input 
                    type="text" 
                    name="title"
                    value={projectFormData.title}
                    onChange={handleProjectInputChange}
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select 
                    name="category"
                    value={projectFormData.category}
                    onChange={handleProjectInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              {projectFormData.category === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Category *</label>
                  <input 
                    type="text" 
                    name="customCategory"
                    value={projectFormData.customCategory}
                    onChange={handleProjectInputChange}
                    placeholder="Enter custom category"
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  rows={3} 
                  name="description"
                  value={projectFormData.description}
                  onChange={handleProjectInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹) *</label>
                  <input 
                    type="number" 
                    name="budget"
                    value={projectFormData.budget}
                    onChange={handleProjectInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                  <input 
                    type="text" 
                    name="duration"
                    value={projectFormData.duration}
                    onChange={handleProjectInputChange}
                    placeholder="e.g., 12 months" 
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiaries *</label>
                  <input 
                    type="number" 
                    name="beneficiaries"
                    value={projectFormData.beneficiaries}
                    onChange={handleProjectInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input 
                  type="text" 
                  name="location"
                  value={projectFormData.location}
                  onChange={handleProjectInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SDG Goals</label>
                <input 
                  type="text" 
                  name="sdgGoals"
                  value={projectFormData.sdgGoals}
                  onChange={handleProjectInputChange}
                  placeholder="e.g., SDG 4: Quality Education, SDG 8: Decent Work" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Outcomes</label>
                <textarea 
                  rows={2} 
                  name="expectedOutcomes"
                  value={projectFormData.expectedOutcomes}
                  onChange={handleProjectInputChange}
                  placeholder="List expected outcomes separated by commas..." 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Project'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddProject(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Registration Modal */}
      {showPartnerRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Registered NGO Name</h3>
              <button 
                onClick={() => setShowPartnerRegistration(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input 
                    type="text" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input 
                    type="url" 
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="www.company.com" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                  <input 
                    type="email" 
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                  <input 
                    type="tel" 
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CSR Policy & Commitment *</label>
                <textarea 
                  rows={3} 
                  name="csrPolicy"
                  value={formData.csrPolicy}
                  onChange={handleInputChange}
                  required 
                  placeholder="Describe your company's CSR policy and commitment to social responsibility..." 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Focus Areas *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {['Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Skill Development', 'Technology'].map(area => (
                    <label key={area} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={formData.focusAreas.includes(area)}
                        onChange={(e) => handleFocusAreaChange(area, e.target.checked)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" 
                      />
                      <span className="text-sm text-gray-700">{area}</span>
                    </label>
                  ))}
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Custom Focus Area</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="customFocusArea"
                      value={formData.customFocusArea}
                      onChange={handleInputChange}
                      placeholder="Enter custom focus area" 
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                    <button 
                      type="button"
                      onClick={handleCustomFocusAreaAdd}
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isPartnerLoading}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPartnerLoading ? 'Submitting...' : 'Submit Registration'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowPartnerRegistration(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generate CSR Report</h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select 
                  name="reportType"
                  value={reportFormData.reportType}
                  onChange={handleReportInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="impact">Impact Report</option>
                  <option value="financial">Financial Report</option>
                  <option value="compliance">Compliance Report</option>
                  <option value="summary">Executive Summary</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select 
                  name="dateRange"
                  value={reportFormData.dateRange}
                  onChange={handleReportInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="Q4-2024">Q4 2024</option>
                  <option value="Q3-2024">Q3 2024</option>
                  <option value="All">All Time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include Sections</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox"
                      name="includeProjects"
                      checked={reportFormData.includeProjects}
                      onChange={handleReportInputChange}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 mr-2"
                    />
                    <span className="text-sm">Projects Details</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox"
                      name="includePartners"
                      checked={reportFormData.includePartners}
                      onChange={handleReportInputChange}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 mr-2"
                    />
                    <span className="text-sm">Partners Information</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox"
                      name="includeFunding"
                      checked={reportFormData.includeFunding}
                      onChange={handleReportInputChange}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 mr-2"
                    />
                    <span className="text-sm">Financial Data</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select 
                  name="format"
                  value={reportFormData.format}
                  onChange={handleReportInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={generateReport}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generate
                </button>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Requests Modal */}
      {showPendingRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pending Partner Requests ({pendingCount})</h3>
              <button 
                onClick={() => setShowPendingRequests(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {pendingPartners.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending partner requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPartners.map(partner => (
                  <div key={partner.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{partner.companyName}</h4>
                        <p className="text-sm text-gray-600 mb-2">{partner.csrPolicy}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Email:</span> {partner.contactEmail}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {partner.contactPhone}
                          </div>
                          <div>
                            <span className="font-medium">Website:</span> {partner.website}
                          </div>
                          <div>
                            <span className="font-medium">Applied:</span> {new Date(partner.registrationDate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="text-sm text-gray-600">Focus Areas:</span>
                          {partner.focusAreas.map((area, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => approvePartner(partner.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Approve Partner"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => rejectPartner(partner.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Reject Partner"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}