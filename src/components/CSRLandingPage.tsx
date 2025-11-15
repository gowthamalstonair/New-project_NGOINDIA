import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Target, TrendingUp, Award, 
  ArrowRight, CheckCircle, Star, Download, 
  Mail, Phone, Globe, MapPin, Calendar,
  FileText, BarChart3, Handshake, Send,
  Eye, ExternalLink, Shield, Heart, ArrowLeft
} from 'lucide-react';

interface CSRPartnerInfo {
  id: string;
  name: string;
  logo: string;
  description: string;
  partnership: string;
  experience: string;
  focusAreas: string[];
  impact: {
    funding: string;
    projects: number;
    beneficiaries: string;
  };
}

interface CSRProject {
  id: string;
  title: string;
  partner: string;
  amount: string;
  beneficiaries: string;
  duration: string;
  status: 'completed' | 'ongoing' | 'planned';
  image: string;
  description: string;
  outcomes: string[];
}

interface CompanyPartner {
  name: string;
  description: string;
  image: string;
}

function CompanyPartnerCard({ company }: { company: CompanyPartner }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const shortDescription = company.description.length > 150 
    ? company.description.substring(0, 150) + '...' 
    : company.description;

  return (
    <div className="text-center p-4">
      {/* Company Photo */}
      <div className="w-24 h-24 mx-auto mb-4">
        <img 
          src={company.image} 
          alt={company.name}
          className="w-full h-full object-cover rounded-lg shadow-md"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1';
          }}
        />
      </div>
      
      {/* Bold Partner Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-3">{company.name}</h3>
      
      {/* Short Description */}
      <p className="text-gray-500 text-sm leading-relaxed mb-4 min-h-[60px]">
        {isExpanded ? company.description : shortDescription}
      </p>
      
      {/* Read More Link */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
}

export function CSRLandingPage() {
  const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'reports' | 'partners' | 'contact'>('overview');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedPartners, setExpandedPartners] = useState<Set<string>>(new Set());
  
  const handleViewDetails = (projectId: string) => {
    alert(`Viewing detailed information for Project ID: ${projectId}\n\nThis would typically open a detailed project page or modal with comprehensive project information, timeline, photos, and impact metrics.`);
  };
  
  const handleDownloadReport = (projectTitle: string) => {
    alert(`Downloading CSR Impact Report for: ${projectTitle}\n\nThis would typically download a PDF report containing:\n- Project overview and objectives\n- Financial utilization details\n- Impact measurement data\n- Beneficiary testimonials\n- Photo documentation`);
  };
  
  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };
  
  const togglePartnerExpansion = (partnerId: string) => {
    const newExpanded = new Set(expandedPartners);
    if (newExpanded.has(partnerId)) {
      newExpanded.delete(partnerId);
    } else {
      newExpanded.add(partnerId);
    }
    setExpandedPartners(newExpanded);
  };
  
  const companyPartners: CompanyPartner[] = [
    {
      name: '3I',
      description: '3i is an investment company with two complementary businesses, Private Equity and Infrastructure, specialising in core investment markets in northern Europe and North America. They have a diverse investment portfolio and disciplined investment processes. This, together with their clear and consistent strategy, underpins their competitive advantage. They have operations in eight offices across Europe, Asia and North America. 3i is partnered with Akshaya Patra since FY 16-17. 3i sponsored Akshaya Patra mid day meals for government school children there by uplifting the noble cause.',
      image: 'https://www.akshayapatra.org/includefiles/partners/3i.png'
    },
    {
      name: '42Gears',
      description: '42Gears is a leading Unified Endpoint Management solution provider, offering SaaS and on premise solutions to secure, monitor and manage all business endpoints, such as tablets, phones, desktops, and wearables. 42Gears products support company-owned as well as employee-owned devices built on Android, iOS, Windows, Mac OS, Wear OS, VR and Linux platforms. 42Gears products are used in various verticals, such as healthcare, manufacturing, logistics, education, and retail. 42Gears products are trusted by over 10000 customers in more than 115 countries. They have supported our foundation since June 2012 and have helped us serve mid-day meals to 2683 government school children in FY 19-20.',
      image: 'https://www.akshayapatra.org/includefiles/partners/42-Gears-Mobility-logo.jpg'
    },
    {
      name: 'Acentra Health',
      description: 'Acentra Health is a leading healthcare technology company focused on improving health outcomes through innovative solutions and data-driven insights. They partner with healthcare organizations to deliver comprehensive managed care services and technology solutions.',
      image: 'https://www.akshayapatra.org/includefiles/partners/Acentra-Health-Logo.png'
    },
    {
      name: 'CII Foundation',
      description: 'The CII Foundation undertakes a wide range of social development and charitable initiatives across India.',
      image: 'https://www.akshayapatra.org/includefiles/institutionandorganization/CII-1-1.jpg'
    },
    {
      name: 'INFOSYS FOUNDATION',
      description: 'Akshaya Patra and the Infosys Foundation\'s journey together began several years ago. During this time the Infosys Foundation has been a staunch supporter of Akshaya Patra\'s work to end classroom hunger in India. Today N.R. Narayana Murthy, Founder of Infosys Limited, is on the Advisory Board of Akshaya Patra\'s US chapter, while his wife Sudha Murty, Chairperson of the Infosys Foundation actively facilitates the organisation\'s mid-day meal programme. By generously lending its voice to the programme, and providing constant expertise and financial support, the Infosys Foundation has been a driving force in taking Akshaya Patra\'s mid-day meal programme to new heights. The Infosys Foundation, launched in 1996, operates as a not-for-profit organisation that works to create opportunity and an equitable society. The Foundation currently supports programmes across education, healthcare, rural development, arts and culture and destitute care.',
      image: 'https://www.akshayapatra.org/includefiles/institutionandorganization/institution-icon-two.png'
    },
    {
      name: 'Tech Solutions Ltd',
      description: 'Tech Solutions Ltd is a leading technology company focused on digital transformation and innovation. They have been supporting various educational initiatives and digital literacy programs across rural India. Their CSR initiatives focus on bridging the digital divide and empowering communities through technology access and training.',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      name: 'Green Energy Corp',
      description: 'Green Energy Corp is committed to sustainable development and environmental conservation. They have been partnering with NGOs to implement clean energy solutions and environmental awareness programs. Their CSR focus includes renewable energy projects, tree plantation drives, and sustainable development initiatives in rural communities.',
      image: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    }
  ];
  const [showContactForm, setShowContactForm] = useState(false);
  const [partners, setPartners] = useState<CSRPartnerInfo[]>([]);
  const [statistics, setStatistics] = useState({
    totalPartners: 15,
    totalFunding: '₹3.2 Crore',
    totalProjects: 48,
    totalBeneficiaries: '12,500+'
  });
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    csrArea: '',
    budget: '',
    message: ''
  });

  // Load CSR partners data from backend
  React.useEffect(() => {
    const loadCSRData = async () => {
      try {
        const response = await fetch('http://localhost/NGO-India/backend/get_csr_partners_public_api.php');
        const result = await response.json();
        
        if (result.success) {
          setPartners(result.partners);
          setStatistics({
            totalPartners: result.statistics.totalPartners,
            totalFunding: result.statistics.totalFunding,
            totalProjects: result.statistics.totalProjects,
            totalBeneficiaries: result.statistics.totalBeneficiaries
          });
        }
      } catch (error) {
        console.error('Error loading CSR data:', error);
        // Keep default mock data if API fails
        setPartners(csrPartners);
      }
    };
    
    loadCSRData();
  }, []);

  const csrPartners: CSRPartnerInfo[] = [
    {
      id: '1',
      name: 'Tech Innovations Ltd',
      logo: '/company-logos/tech-innovations.png',
      description: 'Tech Innovations Ltd strongly believes in creating valuable relations and partnerships as they help in knowledge interaction, improving expertise, and increasing resources to reach a wider audience. We understand that the right business partnerships enhance the ethos of our organisation and our corporate partners are consistent with their contributions to the digital education programme.',
      partnership: 'Since FY 2020-21',
      experience: '4+ years of partnership',
      focusAreas: ['Digital Education', 'Technology Access', 'Skill Development'],
      impact: {
        funding: '₹15 Lakhs',
        projects: 8,
        beneficiaries: '2,500+'
      }
    },
    {
      id: '2',
      name: 'Green Energy Corp',
      logo: '/company-logos/green-energy.png',
      description: 'Green Energy Corp is a leading renewable energy company with expertise in solar and wind power solutions. They have a diverse investment portfolio and disciplined sustainability processes. This, together with their clear and consistent environmental strategy, underpins their competitive advantage. They have operations across India and are partnered with NGO India since FY 2019-20.',
      partnership: 'Since FY 2019-20',
      experience: '5+ years of partnership',
      focusAreas: ['Environment', 'Clean Energy', 'Rural Development'],
      impact: {
        funding: '₹25 Lakhs',
        projects: 12,
        beneficiaries: '5,000+'
      }
    },
    {
      id: '3',
      name: 'Healthcare Solutions Pvt Ltd',
      logo: '/company-logos/healthcare-solutions.png',
      description: 'Healthcare Solutions brings together a deep collective of expertise across all healthcare facets with 15+ years of public health knowledge and experience. Our goal is to help communities access better healthcare services and improve health outcomes. We enhance healthcare delivery to millions of patients, hospitals, and healthcare providers. Healthcare Solutions modernizes the healthcare experience for rural communities.',
      partnership: 'Since FY 2021-22',
      experience: '3+ years of partnership',
      focusAreas: ['Healthcare', 'Medical Camps', 'Health Awareness'],
      impact: {
        funding: '₹30 Lakhs',
        projects: 15,
        beneficiaries: '8,000+'
      }
    }
  ];

  const csrProjects: CSRProject[] = [
    {
      id: '1',
      title: 'Digital Literacy Program for Rural Youth',
      partner: 'Tech Innovations Ltd',
      amount: '₹8.5 Lakhs',
      beneficiaries: '650 students',
      duration: '6 months',
      status: 'completed',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      description: 'A CSR-funded digital education project providing computer training, soft skills workshops, and employment support.',
      outcomes: ['650 students trained in digital skills', '85% job placement rate', '15 computer labs established']
    },
    {
      id: '2',
      title: 'Clean Water Initiative',
      partner: 'Green Energy Corp',
      amount: '₹12 Lakhs',
      beneficiaries: '3,000 villagers',
      duration: '8 months',
      status: 'completed',
      image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      description: 'Installation of solar-powered water purification systems in remote villages.',
      outcomes: ['10 water purification systems installed', '3,000 people with clean water access', '90% reduction in waterborne diseases']
    },
    {
      id: '3',
      title: 'Mobile Healthcare Units',
      partner: 'Healthcare Solutions Pvt Ltd',
      amount: '₹15 Lakhs',
      beneficiaries: '5,500 patients',
      duration: '12 months',
      status: 'ongoing',
      image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
      description: 'Mobile medical units providing healthcare services to remote communities.',
      outcomes: ['5,500 patients treated', '25 medical camps conducted', '100% vaccination coverage achieved']
    }
  ];

  const impactStats = [
    { label: 'Total CSR Beneficiaries', value: statistics.totalBeneficiaries, icon: Users, color: 'text-orange-600' },
    { label: 'CSR Projects Completed', value: statistics.totalProjects.toString(), icon: Target, color: 'text-blue-600' },
    { label: 'Active CSR Partners', value: statistics.totalPartners.toString(), icon: Building2, color: 'text-green-600' },
    { label: 'CSR Funds Utilized', value: statistics.totalFunding, icon: TrendingUp, color: 'text-purple-600' }
  ];

  const complianceDocs = [
    { name: 'CSR-1 Certificate', status: 'Valid', color: 'text-green-600' },
    { name: '12A & 80G Certificates', status: 'Valid', color: 'text-green-600' },
    { name: 'NGO Registration Certificate', status: 'Valid', color: 'text-green-600' },
    { name: 'Audited Financial Statements', status: 'Updated', color: 'text-blue-600' },
    { name: 'Annual Activity Report', status: 'Latest', color: 'text-orange-600' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost/NGO-India/backend/add_csr_inquiry_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('CSR partnership inquiry submitted successfully! We will contact you within 24 hours.');
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          csrArea: '',
          budget: '',
          message: ''
        });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="/ngo india logo.png" alt="NGO INDIA Logo" className="w-56 h-32 rounded-lg cursor-pointer mt-4 hover:scale-105 transition-transform" onClick={() => window.location.href = '/'} />
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </header>
      
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">CSR Partnership Hub</h1>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Partner with NGO India for impactful Corporate Social Responsibility initiatives. 
              Transform communities through strategic CSR investments with complete transparency and measurable outcomes.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {impactStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg mb-2">
                    <stat.icon className="w-8 h-8 mx-auto text-white" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-orange-100 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-1 py-4">
            {[
              { key: 'overview', label: 'Partnership Overview', icon: Handshake },
              { key: 'projects', label: 'CSR Projects Portfolio', icon: Target },
              { key: 'reports', label: 'Impact Reports', icon: BarChart3 },
              { key: 'partners', label: 'Trusted Partners', icon: Building2 },
              { key: 'contact', label: 'Partner With Us', icon: Send }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeSection === tab.key
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {activeSection === 'overview' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Partner With NGO India?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Registered NGO with CSR-1 Certification</h3>
                  <p className="text-gray-600">Eligible under Section 135 of the Companies Act, 2013 with all necessary legal compliance.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparent Financial Utilization</h3>
                  <p className="text-gray-600">Complete transparency in fund utilization with detailed reporting and real-time tracking.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Impact-Focused Programs</h3>
                  <p className="text-gray-600">Measurable outcomes with dedicated CSR partnership team and regular documentation.</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our CSR Partners</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {companyPartners.map((company, index) => (
                  <CompanyPartnerCard key={index} company={company} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">CSR Projects Portfolio</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Showcase of our current and past CSR-funded projects with complete transparency and impact measurement.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {csrProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <div className="mb-4">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-40 object-cover rounded border mb-2"
                      />
                      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'ongoing' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-orange-600 mb-2">{project.title}</h3>
                    <p className="text-gray-600 font-medium mb-3 text-sm">Partner: {project.partner}</p>
                    <p className="text-gray-700 mb-2 text-sm text-justify">
                      {expandedProjects.has(project.id) 
                        ? project.description 
                        : `${project.description.substring(0, 100)}...`
                      }
                    </p>
                    <button 
                      onClick={() => toggleProjectExpansion(project.id)}
                      className="text-orange-600 hover:text-orange-700 font-medium text-xs underline mb-4"
                    >
                      {expandedProjects.has(project.id) ? 'Read Less' : 'Read More'}
                    </button>
                    
                    {expandedProjects.has(project.id) && (
                      <>
                        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                          <div>
                            <div className="text-gray-500">Amount Funded</div>
                            <div className="font-semibold text-green-600">{project.amount}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Beneficiaries</div>
                            <div className="font-semibold text-blue-600">{project.beneficiaries}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Duration</div>
                            <div className="font-semibold text-purple-600">{project.duration}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Status</div>
                            <div className={`font-semibold ${
                              project.status === 'completed' ? 'text-green-600' :
                              project.status === 'ongoing' ? 'text-orange-600' :
                              'text-blue-600'
                            }`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Outcomes:</h4>
                          <ul className="space-y-1 text-xs">
                            {project.outcomes.map((outcome, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleViewDetails(project.id)}
                            className="text-orange-600 hover:text-orange-700 font-medium text-xs underline"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => handleDownloadReport(project.title)}
                            className="text-orange-600 hover:text-orange-700 font-medium text-xs underline"
                          >
                            Download Report
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">CSR Impact Reports</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Downloadable annual CSR impact reports and project-wise summaries for transparency and compliance.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Annual CSR Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['2023-24', '2022-23', '2021-22'].map((year) => (
                  <div key={year} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-8 h-8 text-orange-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">CSR Impact Report</h4>
                        <p className="text-sm text-gray-600">{year}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Comprehensive annual report covering all CSR activities, fund utilization, and impact measurement.
                    </p>
                    <button className="flex items-center gap-2 w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">CSR Compliance Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complianceDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{doc.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${doc.color} bg-opacity-10`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">CSR Fund Utilization Dashboard</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">₹3.2Cr</div>
                  <div className="text-sm text-gray-600">Total CSR Funds Received</div>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">₹2.8Cr</div>
                  <div className="text-sm text-gray-600">Total CSR Funds Used</div>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">48</div>
                  <div className="text-sm text-gray-600">Ongoing Projects</div>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">12,500+</div>
                  <div className="text-sm text-gray-600">Beneficiaries Count</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'partners' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Trusted CSR Partners</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                NGO India strongly believes in creating valuable relations and partnerships as they help in knowledge interaction, 
                improving expertise, and increasing resources to reach a wider audience. We understand that the right business 
                partnerships enhance the ethos of our organisation and our corporate partners are consistent with their contributions 
                to our social impact programs.
              </p>
            </div>

            <div className="space-y-8">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4">
                        <img 
                          src={companyPartners.find(cp => cp.name === partner.name)?.image || 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'} 
                          alt={partner.name}
                          className="w-full h-full object-contain rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1';
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{partner.name}</h3>
                      <p className="text-orange-600 font-medium mb-1">{partner.partnership}</p>
                      <p className="text-gray-600 text-sm">{partner.experience}</p>
                    </div>

                    <div className="lg:col-span-2">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {expandedPartners.has(partner.id) 
                          ? partner.description 
                          : `${partner.description.substring(0, 200)}...`
                        }
                      </p>
                      
                      {expandedPartners.has(partner.id) && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Focus Areas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {partner.focusAreas.map((area, index) => (
                              <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => togglePartnerExpansion(partner.id)}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                      >
                        {expandedPartners.has(partner.id) ? 'Read Less' : 'Read More'} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Partnership Impact</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-600">Total Funding</div>
                          <div className="text-lg font-bold text-green-600">{partner.impact.funding}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Projects Supported</div>
                          <div className="text-lg font-bold text-blue-600">{partner.impact.projects}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Lives Impacted</div>
                          <div className="text-lg font-bold text-purple-600">{partner.impact.beneficiaries}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">All CSR Partners</h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {companyPartners.map((partner, i) => (
                  <div key={i} className="w-20 h-20 opacity-60 hover:opacity-100 transition-opacity">
                    <img 
                      src={partner.image} 
                      alt={partner.name}
                      className="w-full h-full object-contain rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Partner With Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ready to make a meaningful impact through CSR partnership? Contact us to discuss how we can collaborate 
                for sustainable social change.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">CSR Collaboration Form</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                      <input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CSR Interest Area *</label>
                      <select
                        name="csrArea"
                        value={formData.csrArea}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select Area</option>
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="environment">Environment</option>
                        <option value="women-empowerment">Women Empowerment</option>
                        <option value="rural-development">Rural Development</option>
                        <option value="skill-development">Skill Development</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Budget</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select Budget Range</option>
                        <option value="1-5-lakhs">₹1-5 Lakhs</option>
                        <option value="5-10-lakhs">₹5-10 Lakhs</option>
                        <option value="10-25-lakhs">₹10-25 Lakhs</option>
                        <option value="25-50-lakhs">₹25-50 Lakhs</option>
                        <option value="50-lakhs-plus">₹50 Lakhs+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message / Requirement *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Please describe your CSR requirements and how you'd like to partner with us..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Submit CSR Proposal
                  </button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-8">
                  <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      <span>csr@ngoindia.org</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <span>+91 8068447416</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1" />
                      <span>MCECHS Layout KV Jayaram Road, Jakkur Rd, MCECHS Layout Phase 2, Bengaluru, Karnataka 560064</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Our CSR Partnership?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Legal Compliance</div>
                        <div className="text-sm text-gray-600">All necessary certifications and legal documentation</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Transparent Reporting</div>
                        <div className="text-sm text-gray-600">Regular updates and detailed impact reports</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Measurable Impact</div>
                        <div className="text-sm text-gray-600">Clear metrics and outcome measurement</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900">Dedicated Support</div>
                        <div className="text-sm text-gray-600">Dedicated CSR partnership team</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}