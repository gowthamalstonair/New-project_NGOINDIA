import React, { useState } from 'react';
import { 
  Award, Plus, Search, Filter, Eye, Calendar, CheckCircle, Upload, Users, FileText, Clock, AlertCircle, ExternalLink 
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
  website: string;
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
  const [showRequirementsForm, setShowRequirementsForm] = useState(true);
  const [userRequirements, setUserRequirements] = useState({
    category: '',
    minAmount: '',
    maxAmount: '',
    location: '',
    focusArea: '',
    projectDuration: '',
    targetBeneficiaries: '',
    organizationType: '',
    experienceYears: '',
    deadline: '',
    grantStatus: [] as string[],
    fundingAgency: '',
    grantPurpose: [] as string[],
    targetPopulation: [] as string[],
    matchingFundsRequired: '',
    keywords: ''
  });

  const mockGrants: Grant[] = [
    {
      id: '1',
      title: 'Infosys Foundation',
      amount: 2500000,
      deadline: '2024-08-15',
      category: 'Healthcare',
      status: 'active',
      description: 'The Infosys Foundation supports healthcare and education initiatives across India, focusing on digital literacy, rural healthcare access, and educational infrastructure development. They work with NGOs to create sustainable impact in underserved communities through technology-enabled solutions and capacity building programs.',
      eligibility: ['Registered NGO', 'Healthcare/Education focus', 'Minimum 3 years experience'],
      requirements: ['Project proposal', 'Budget breakdown', 'Impact assessment'],
      website: 'https://www.infosys.org/infosys-foundation/initiatives.html'
    },
    {
      id: '2',
      title: 'Science and Engineering Research Board',
      amount: 1500000,
      deadline: '2024-07-30',
      category: 'Education',
      status: 'active',
      description: 'The Science and Engineering Research Board provides comprehensive research grants for innovative science and engineering projects across India. They support cutting-edge research in emerging technologies, fundamental sciences, and interdisciplinary studies. Their funding enables breakthrough discoveries and technological advancements in academic and research institutions.',
      eligibility: ['Research focus', 'Academic partnerships', 'Technical expertise'],
      requirements: ['Research proposal', 'Technical specifications', 'Academic credentials'],
      website: 'https://serb.gov.in/page/english/research_grants'
    },
    {
      id: '3',
      title: 'Wipro Foundation',
      amount: 4500000,
      deadline: '2024-09-10',
      category: 'Education',
      status: 'active',
      description: 'Wipro Foundation focuses on education, ecology, and health programs with emphasis on systemic change and sustainability. They support initiatives that improve learning outcomes, environmental conservation, and healthcare access. Their grants prioritize innovative approaches that create lasting impact in communities across India.',
      eligibility: ['Multi-sector focus', 'Sustainability approach', 'Community impact'],
      requirements: ['Comprehensive proposal', 'Environmental impact study', 'Community engagement plan'],
      website: 'https://wipro.com/sustainability/wipro-foundation'
    },
    {
      id: '4',
      title: 'HCL Foundation',
      amount: 2400000,
      deadline: '2024-08-25',
      category: 'Healthcare',
      status: 'active',
      description: 'HCL Foundation supports comprehensive education, health, and skill development programs with focus on technology integration and youth empowerment. They work on digital literacy, healthcare infrastructure, and vocational training initiatives. Their programs aim to bridge the digital divide and create sustainable livelihood opportunities.',
      eligibility: ['Skill development focus', 'Youth empowerment', 'Technology integration'],
      requirements: ['Skills assessment', 'Training curriculum', 'Technology plan'],
      website: 'https://www.hclfoundation.org/'
    },
    {
      id: '5',
      title: 'Tata Trusts',
      amount: 6000000,
      deadline: '2024-10-15',
      category: 'Healthcare',
      status: 'active',
      description: 'Tata Trusts provides comprehensive grants for education, healthcare, and rural development initiatives across India. They focus on creating sustainable impact through innovative programs that address systemic challenges. Their funding supports large-scale projects that transform communities and improve quality of life for underserved populations.',
      eligibility: ['Large scale impact', 'Rural focus', 'Sustainable model'],
      requirements: ['Detailed project plan', 'Sustainability strategy', 'Impact measurement framework'],
      website: 'https://www.tatatrusts.org/'
    },
    {
      id: '6',
      title: 'Reliance Foundation',
      amount: 9000000,
      deadline: '2024-09-30',
      category: 'Healthcare',
      status: 'active',
      description: 'Reliance Foundation supports healthcare, education, and rural transformation initiatives with focus on innovation and scalable solutions. They work on comprehensive programs that address multiple development challenges simultaneously. Their grants prioritize technology-driven approaches that create measurable impact in communities across India.',
      eligibility: ['Transformational impact', 'Innovation focus', 'Scalable solutions'],
      requirements: ['Innovation proposal', 'Scalability plan', 'Technology integration'],
      website: 'https://www.reliancefoundation.org/'
    },
    {
      id: '7',
      title: 'Azim Premji Foundation',
      amount: 3600000,
      deadline: '2024-08-20',
      category: 'Education',
      status: 'active',
      description: 'Azim Premji Foundation provides education and social equity focused grants with emphasis on systemic change and inclusive development. They support initiatives that address educational inequalities and promote social justice. Their funding prioritizes programs that create sustainable improvements in learning outcomes and social equity.',
      eligibility: ['Education focus', 'Social equity', 'Systemic change approach'],
      requirements: ['Educational methodology', 'Equity framework', 'System change strategy'],
      website: 'https://azimpremjifoundation.org/'
    },
    {
      id: '8',
      title: 'Godrej Foundation',
      amount: 1800000,
      deadline: '2024-07-25',
      category: 'Environment',
      status: 'active',
      description: 'Godrej Foundation supports education and environment focused initiatives that promote sustainability and community development. They work with organizations to create programs that address environmental challenges while improving educational access. Their grants emphasize innovative approaches to environmental conservation and educational excellence.',
      eligibility: ['Environmental focus', 'Sustainability practices', 'Community involvement'],
      requirements: ['Environmental impact study', 'Sustainability plan', 'Community engagement'],
      website: 'https://www.godrej.com/godrej-foundation'
    },
    {
      id: '9',
      title: 'Narotam Sekhsaria Foundation',
      amount: 900000,
      deadline: '2024-06-30',
      category: 'Education',
      status: 'active',
      description: 'Narotam Sekhsaria Foundation provides education scholarships and academic support programs for deserving students across India. They focus on merit-based selection and comprehensive academic assistance to help students achieve their educational goals. Their funding supports both individual scholarships and institutional development programs.',
      eligibility: ['Academic excellence', 'Merit-based selection', 'Educational institutions'],
      requirements: ['Academic records', 'Scholarship criteria', 'Selection process'],
      website: 'https://www.sekhsariafoundation.org/'
    },
    {
      id: '10',
      title: 'Michael & Susan Dell Foundation',
      amount: 5400000,
      deadline: '2024-09-15',
      category: 'Healthcare',
      status: 'active',
      description: 'Michael & Susan Dell Foundation supports education and health improvement programs with focus on technology integration and data-driven approaches. They work on innovative solutions that leverage technology to improve learning outcomes and healthcare delivery. Their grants prioritize measurable impact and sustainable program models.',
      eligibility: ['Technology integration', 'Data-driven approach', 'Measurable outcomes'],
      requirements: ['Technology plan', 'Data collection framework', 'Outcome metrics'],
      website: 'https://www.msdf.org/'
    },
    {
      id: '11',
      title: 'Rockefeller Foundation',
      amount: 12000000,
      deadline: '2024-11-30',
      category: 'Healthcare',
      status: 'active',
      description: 'Rockefeller Foundation provides health, food security, and economic opportunity grants with focus on global impact and systemic solutions. They support innovative programs that address complex challenges through collaborative approaches. Their funding prioritizes breakthrough solutions that can be scaled to create widespread positive change.',
      eligibility: ['Global impact', 'Systemic solutions', 'Innovation focus'],
      requirements: ['Global strategy', 'Innovation framework', 'Impact measurement'],
      website: 'https://www.rockefellerfoundation.org/'
    },
    {
      id: '12',
      title: 'Ford Foundation India',
      amount: 4800000,
      deadline: '2024-10-10',
      category: 'Education',
      status: 'active',
      description: 'Ford Foundation India supports social justice and human rights initiatives that promote equality and democratic values. They work with organizations to strengthen civil society and advance human rights across India. Their grants focus on advocacy, policy reform, and grassroots movements that create lasting social change.',
      eligibility: ['Human rights focus', 'Social justice', 'Advocacy experience'],
      requirements: ['Rights-based approach', 'Advocacy strategy', 'Legal framework'],
      website: 'https://www.fordfoundation.org/region/india/'
    },
    {
      id: '13',
      title: 'Jindal Foundation',
      amount: 3000000,
      deadline: '2024-08-05',
      category: 'Healthcare',
      status: 'active',
      description: 'Jindal Foundation supports education and healthcare development programs with focus on community partnerships and sustainable impact. They work on comprehensive initiatives that address multiple development challenges in underserved areas. Their funding emphasizes collaborative approaches that engage local communities in program design and implementation.',
      eligibility: ['Development focus', 'Community partnerships', 'Sustainable impact'],
      requirements: ['Development plan', 'Partnership agreements', 'Sustainability model'],
      website: 'https://www.jindalfoundation.org/'
    },
    {
      id: '14',
      title: 'Google.org Impact Challenge India',
      amount: 7500000,
      deadline: '2024-12-15',
      category: 'Education',
      status: 'upcoming',
      description: 'Google.org Impact Challenge India supports technology for social good initiatives that leverage innovation to address pressing social challenges. They fund organizations developing scalable technology solutions that can create significant positive impact. Their grants prioritize projects that demonstrate clear potential for widespread adoption and measurable outcomes.',
      eligibility: ['Technology innovation', 'Social impact', 'Scalable solutions'],
      requirements: ['Technology prototype', 'Impact metrics', 'Scaling strategy'],
      website: 'https://impactchallenge.withgoogle.com/india2025'
    },
    {
      id: '15',
      title: 'Climate Reality Project India',
      amount: 2400000,
      deadline: '2024-09-20',
      category: 'Environment',
      status: 'active',
      description: 'Climate Reality Project India supports environmental and climate change projects that promote climate action and environmental awareness. They work with organizations to develop programs that address climate challenges through community engagement and policy advocacy. Their funding focuses on initiatives that build climate resilience and promote sustainable practices.',
      eligibility: ['Climate focus', 'Environmental expertise', 'Community engagement'],
      requirements: ['Climate action plan', 'Environmental credentials', 'Community strategy'],
      website: 'https://climatereality.in/'
    },
    {
      id: '16',
      title: 'GiveIndia Foundation',
      amount: 1500000,
      deadline: '2024-07-15',
      category: 'Healthcare',
      status: 'active',
      description: 'GiveIndia Foundation provides healthcare and education support programs with focus on grassroots impact and transparent operations. They work with local organizations to deliver direct services to underserved communities. Their funding emphasizes accountability, measurable outcomes, and sustainable program models that create lasting positive change.',
      eligibility: ['Grassroots focus', 'Direct impact', 'Transparent operations'],
      requirements: ['Impact documentation', 'Financial transparency', 'Beneficiary testimonials'],
      website: 'https://www.giveindia.org/'
    },
    {
      id: '17',
      title: 'Smile Foundation',
      amount: 2100000,
      deadline: '2024-08-10',
      category: 'Education',
      status: 'active',
      description: 'Smile Foundation supports women & child welfare and education programs that focus on empowerment and protection of vulnerable populations. They work on comprehensive initiatives that address multiple challenges faced by women and children. Their grants prioritize programs that create safe environments and improve access to quality education and healthcare.',
      eligibility: ['Child welfare focus', 'Women empowerment', 'Education access'],
      requirements: ['Child protection policy', 'Gender strategy', 'Educational framework'],
      website: 'https://www.smilefoundationindia.org/'
    },
    {
      id: '18',
      title: 'UNICEF India',
      amount: 6000000,
      deadline: '2024-10-25',
      category: 'Healthcare',
      status: 'active',
      description: 'UNICEF India supports child health and education initiatives that promote child rights and well-being across the country. They work on comprehensive programs that address healthcare, education, and protection needs of children. Their funding focuses on evidence-based interventions that create sustainable improvements in child outcomes and development.',
      eligibility: ['Child rights focus', 'Health expertise', 'Educational programs'],
      requirements: ['Child rights framework', 'Health protocols', 'Educational methodology'],
      website: 'https://www.unicef.org/india/'
    },
    {
      id: '19',
      title: 'Azim Premji Philanthropic Initiatives',
      amount: 4500000,
      deadline: '2024-09-05',
      category: 'Education',
      status: 'active',
      description: 'Azim Premji Philanthropic Initiatives supports education and livelihood development programs that focus on skills development and economic empowerment. They work with organizations to create sustainable livelihood opportunities for marginalized communities. Their grants emphasize comprehensive approaches that combine education, skills training, and economic support.',
      eligibility: ['Livelihood focus', 'Skills development', 'Economic empowerment'],
      requirements: ['Livelihood strategy', 'Skills assessment', 'Economic impact plan'],
      website: 'https://azimpremjifoundation.org/our-work'
    },
    {
      id: '20',
      title: 'Reliance Foundation Health Drishti',
      amount: 3600000,
      deadline: '2024-08-30',
      category: 'Healthcare',
      status: 'active',
      description: 'Reliance Foundation Health Drishti supports healthcare access and improvement programs with focus on rural health and technology integration. They work on innovative healthcare delivery models that reach underserved populations. Their funding prioritizes programs that leverage technology to improve healthcare access, quality, and affordability in rural areas.',
      eligibility: ['Healthcare access', 'Rural health', 'Technology integration'],
      requirements: ['Health access plan', 'Rural strategy', 'Technology framework'],
      website: 'https://www.reliancefoundation.org/our-initiatives/health'
    },
    {
      id: '21',
      title: 'S M Sehgal Foundation',
      amount: 3000000,
      deadline: '2024-07-20',
      category: 'Environment',
      status: 'active',
      description: 'S M Sehgal Foundation supports water, agriculture, and livelihood programs that promote sustainable rural development and environmental conservation. They work on integrated approaches that address water management, agricultural productivity, and livelihood creation. Their grants focus on community-based solutions that create long-term environmental and economic benefits.',
      eligibility: ['Water conservation', 'Agricultural development', 'Rural livelihoods'],
      requirements: ['Water management plan', 'Agricultural strategy', 'Livelihood framework'],
      website: 'https://smsehgalfoundation.org/'
    },
    {
      id: '22',
      title: 'Bharti Foundation',
      amount: 2400000,
      deadline: '2024-08-15',
      category: 'Education',
      status: 'active',
      description: 'Bharti Foundation supports education development and support programs with focus on educational excellence and quality improvement. They work on comprehensive initiatives that enhance teaching quality, learning outcomes, and educational infrastructure. Their funding emphasizes innovative educational approaches that create sustainable improvements in academic achievement and student development.',
      eligibility: ['Educational excellence', 'Quality education', 'Teacher training'],
      requirements: ['Educational curriculum', 'Quality framework', 'Teacher development plan'],
      website: 'https://www.bhartifoundation.org/'
    },
    {
      id: '23',
      title: 'Piramal Foundation',
      amount: 4500000,
      deadline: '2024-09-25',
      category: 'Healthcare',
      status: 'active',
      description: 'Piramal Foundation supports healthcare, education, and water initiatives through integrated multi-sector approaches that address interconnected development challenges. They work on comprehensive programs that create synergies across different sectors. Their grants prioritize innovative solutions that demonstrate how integrated approaches can create greater impact than single-sector interventions.',
      eligibility: ['Multi-sector approach', 'Integrated solutions', 'Community health'],
      requirements: ['Integrated plan', 'Multi-sector strategy', 'Community health framework'],
      website: 'https://www.piramal.org/our-impact/'
    },
    {
      id: '24',
      title: 'Vedanta Resources CSR',
      amount: 3600000,
      deadline: '2024-10-05',
      category: 'Environment',
      status: 'active',
      description: 'Vedanta Resources CSR supports education, environment, and health programs with focus on corporate social responsibility and community development. They work on comprehensive initiatives that address multiple development priorities in their operational areas. Their funding emphasizes sustainable programs that create lasting positive impact while meeting CSR compliance requirements.',
      eligibility: ['CSR compliance', 'Environmental responsibility', 'Community development'],
      requirements: ['CSR framework', 'Environmental plan', 'Community development strategy'],
      website: 'https://www.vedantaresources.com/sustainability/corporate-social-responsibility'
    },
    {
      id: '25',
      title: 'Mahindra Foundation',
      amount: 3000000,
      deadline: '2024-08-25',
      category: 'Education',
      status: 'active',
      description: 'Mahindra Foundation supports education and rural development initiatives that focus on community empowerment and sustainable development. They work on programs that improve educational access while promoting rural economic development. Their grants emphasize community-driven approaches that build local capacity and create sustainable development outcomes.',
      eligibility: ['Rural development', 'Educational access', 'Community empowerment'],
      requirements: ['Rural development plan', 'Educational strategy', 'Community engagement'],
      website: 'https://www.mahindra.com/news-room/foundation'
    },
    {
      id: '26',
      title: 'Oxfam India',
      amount: 2400000,
      deadline: '2024-09-10',
      category: 'Education',
      status: 'active',
      description: 'Oxfam India supports social justice, livelihood, and gender equality initiatives that promote rights-based approaches to development. They work with organizations to address systemic inequalities and promote inclusive development. Their funding focuses on programs that empower marginalized communities and advocate for policy changes that promote social justice.',
      eligibility: ['Gender equality', 'Social justice', 'Rights-based approach'],
      requirements: ['Gender framework', 'Rights strategy', 'Social justice plan'],
      website: 'https://www.oxfamindia.org/'
    },
    {
      id: '27',
      title: 'Pratham Education Foundation',
      amount: 1800000,
      deadline: '2024-07-30',
      category: 'Education',
      status: 'active',
      description: 'Pratham Education Foundation supports education and learning improvement programs that focus on innovative teaching methodologies and child-centered approaches. They work on evidence-based educational interventions that improve learning outcomes for children. Their grants prioritize scalable programs that demonstrate measurable improvements in literacy, numeracy, and overall educational achievement.',
      eligibility: ['Learning outcomes', 'Educational innovation', 'Child-centered approach'],
      requirements: ['Learning methodology', 'Innovation framework', 'Child development plan'],
      website: 'https://pratham.org/'
    },
    {
      id: '28',
      title: 'CARE India',
      amount: 3600000,
      deadline: '2024-08-20',
      category: 'Healthcare',
      status: 'active',
      description: 'CARE India supports women empowerment and healthcare programs that focus on gender equality and comprehensive healthcare access. They work on integrated approaches that address women\'s health, economic empowerment, and social participation. Their grants emphasize programs that create sustainable improvements in women\'s status and well-being across multiple dimensions.',
      eligibility: ['Women empowerment', 'Healthcare access', 'Gender equality'],
      requirements: ['Women empowerment strategy', 'Healthcare plan', 'Gender equality framework'],
      website: 'https://www.careindia.org/'
    },
    {
      id: '29',
      title: 'Smile Foundation (Livelihood)',
      amount: 2700000,
      deadline: '2024-09-15',
      category: 'Education',
      status: 'active',
      description: 'Smile Foundation (Livelihood) supports education, healthcare, and livelihood programs with focus on comprehensive development and skills training. They work on integrated approaches that address multiple development needs of underserved communities. Their grants emphasize sustainable livelihood creation through education, healthcare support, and economic empowerment initiatives.',
      eligibility: ['Livelihood development', 'Skills training', 'Economic empowerment'],
      requirements: ['Livelihood plan', 'Skills framework', 'Economic strategy'],
      website: 'https://www.smilefoundationindia.org/'
    },
    {
      id: '30',
      title: 'ActionAid India',
      amount: 3000000,
      deadline: '2024-10-20',
      category: 'Education',
      status: 'active',
      description: 'ActionAid India supports social welfare and women rights initiatives that promote gender equality and social justice through community mobilization. They work on grassroots programs that empower women and marginalized communities. Their funding focuses on advocacy, rights-based programming, and community organizing that creates sustainable social change and policy reform.',
      eligibility: ['Women rights', 'Social welfare', 'Community mobilization'],
      requirements: ['Rights framework', 'Social welfare plan', 'Community strategy'],
      website: 'https://www.actionaidindia.org/'
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
    const matchesUserCategory = !userRequirements.category || grant.category === userRequirements.category;
    const matchesAmount = (!userRequirements.minAmount || grant.amount >= Number(userRequirements.minAmount)) &&
                         (!userRequirements.maxAmount || grant.amount <= Number(userRequirements.maxAmount));
    return matchesSearch && matchesCategory && matchesUserCategory && matchesAmount;
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

      {/* Requirements Form */}
      {showRequirementsForm && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold text-white mb-2">Find Your Perfect Grant</h2>
            <p className="text-orange-50">Tell us about your requirements to discover matching opportunities</p>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Section 1: Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select value={userRequirements.category} onChange={(e) => setUserRequirements({...userRequirements, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                    <option value="">Select category</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area</label>
                  <input type="text" value={userRequirements.focusArea} onChange={(e) => setUserRequirements({...userRequirements, focusArea: e.target.value})} placeholder="e.g., Rural education" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords / Tags</label>
                  <input type="text" value={userRequirements.keywords} onChange={(e) => setUserRequirements({...userRequirements, keywords: e.target.value})} placeholder="e.g., capacity building, digital literacy" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location/Region</label>
                  <input type="text" value={userRequirements.location} onChange={(e) => setUserRequirements({...userRequirements, location: e.target.value})} placeholder="e.g., Maharashtra" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            </div>

            {/* Section 2: Funding Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                Funding Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount (₹)</label>
                  <input type="number" value={userRequirements.minAmount} onChange={(e) => setUserRequirements({...userRequirements, minAmount: e.target.value})} placeholder="50,000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount (₹)</label>
                  <input type="number" value={userRequirements.maxAmount} onChange={(e) => setUserRequirements({...userRequirements, maxAmount: e.target.value})} placeholder="5,00,000" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            </div>

            {/* Section 3: Organization Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                Organization Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                  <select value={userRequirements.organizationType} onChange={(e) => setUserRequirements({...userRequirements, organizationType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
                    <option value="">Select type</option>
                    <option value="NGO">NGO</option>
                    <option value="Trust">Trust</option>
                    <option value="Society">Society</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Beneficiaries</label>
                  <input type="number" value={userRequirements.targetBeneficiaries} onChange={(e) => setUserRequirements({...userRequirements, targetBeneficiaries: e.target.value})} placeholder="Number of people to benefit" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
            </div>

            {/* Section 4: Target Population */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                Target Population
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Who will benefit from your project?</label>
                <div className="flex flex-wrap gap-3">
                  {['Women', 'Children', 'Rural', 'Youth'].map(population => (
                    <label key={population} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={userRequirements.targetPopulation.includes(population)} onChange={(e) => { const updated = e.target.checked ? [...userRequirements.targetPopulation, population] : userRequirements.targetPopulation.filter(p => p !== population); setUserRequirements({...userRequirements, targetPopulation: updated}); }} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm font-medium text-gray-700">{population}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-8 py-6 rounded-b-lg flex justify-between items-center">
            <p className="text-sm text-gray-600">All fields are optional except Category</p>
            <button onClick={() => setShowRequirementsForm(false)} className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold shadow-lg hover:shadow-xl transition-all">
              Find Matching Grants →
            </button>
          </div>
        </div>
      )}

      {/* Browse Grants */}
      {!selectedGrant && !showRequirementsForm && (
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
                <p className="text-sm text-gray-600 mb-6">{grant.description}</p>
                <div className="flex gap-2">
                  <a
                    href={grant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-center"
                  >
                    View Details
                  </a>
                </div>
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