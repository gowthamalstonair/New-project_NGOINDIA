import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, FileText, 
  TrendingUp, Search, Plus, BookOpen, 
  Handshake, Target, BarChart3,
  ThumbsUp, Reply, User,
  Pin, Globe, ArrowUp, ArrowRight, CheckCircle, X,
  Zap, HelpCircle, UserCheck, MessageCircle
} from 'lucide-react';


interface Sector {
  id: string;
  name: string;
  description: string;
  ngoCount: number;
  activeDiscussions: number;
  resources: number;
  color: string;
  icon: React.ComponentType<any>;
}

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  sector: string;
  timestamp: string;
  likes: number;
  replies: number;
  isPinned: boolean;
}

type DiscussionReplies = Record<string, Reply[]>;

const sectors: Sector[] = [
  {
    id: 'education',
    name: 'Education',
    description: 'Empowering communities through quality education and skill development',
    ngoCount: 10,
    activeDiscussions: 23,
    resources: 45,
    color: 'bg-blue-500',
    icon: BookOpen
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Providing accessible healthcare services and medical support',
    ngoCount: 10,
    activeDiscussions: 18,
    resources: 32,
    color: 'bg-green-500',
    icon: Target
  },
  {
    id: 'environment',
    name: 'Environment',
    description: 'Protecting nature and promoting sustainable development',
    ngoCount: 10,
    activeDiscussions: 15,
    resources: 28,
    color: 'bg-emerald-500',
    icon: Globe
  },
  {
    id: 'women-empowerment',
    name: 'Women Empowerment',
    description: 'Supporting women through skill development and leadership programs',
    ngoCount: 10,
    activeDiscussions: 21,
    resources: 38,
    color: 'bg-pink-500',
    icon: Users
  }
];

const initialDiscussions = [
  {
    id: '1',
    title: 'Best Practices for Digital Education in Rural Areas',
    author: 'Kavita Mehta',
    sector: 'Education',
    timestamp: '2 hours ago',
    likes: 15,
    replies: 8,
    isPinned: true
  },
  {
    id: '2',
    title: 'Healthcare Mobile Unit Collaboration',
    author: 'Dr. Arjun Singh',
    sector: 'Healthcare',
    timestamp: '4 hours ago',
    likes: 23,
    replies: 12,
    isPinned: false
  }
];

const initialQuickInteractions = [
  {
    id: '1',
    title: 'Need Digital Marketing Expert for Education Campaign',
    author: 'Neha Agarwal',
    sector: 'Education',
    type: 'Need Help',
    urgency: 'Immediate',
    timestamp: '2 hours ago',
    responses: 5,
    status: 'Active'
  },
  {
    id: '2',
    title: 'Offering Free Accounting Services to Small NGOs',
    author: 'Vikram Joshi',
    sector: 'Healthcare',
    type: 'Can Help',
    urgency: 'This Week',
    timestamp: '4 hours ago',
    responses: 8,
    status: 'Active'
  }
];

const initialRepliesData: DiscussionReplies = {
  '1': [
    {
      id: 'r1',
      author: 'Arjun Gupta',
      content: 'Great topic! We\'ve implemented tablet-based learning in 15 villages. Key challenge is internet connectivity. We use offline content and sync when possible.',
      timestamp: '1 hour ago',
      likes: 8
    },
    {
      id: 'r2', 
      author: 'Meera Singh',
      content: 'Solar charging stations have been game-changers for us. Students can charge devices and access digital content even in remote areas without electricity.',
      timestamp: '45 minutes ago',
      likes: 12
    },
    {
      id: 'r3',
      author: 'Dr. Amit Patel',
      content: 'Teacher training is crucial. We conduct monthly workshops on digital pedagogy. Happy to share our curriculum with interested organizations.',
      timestamp: '30 minutes ago', 
      likes: 6
    }
  ],
  '2': [
    {
      id: 'r4',
      author: 'Dr. Sunita Rao',
      content: 'Mobile units are excellent but maintenance costs are high. We partner with local mechanics and train them on medical equipment basics.',
      timestamp: '2 hours ago',
      likes: 15
    },
    {
      id: 'r5',
      author: 'Ankit Verma',
      content: 'Telemedicine integration has helped us reach specialists. We use WhatsApp for initial consultations and refer serious cases to district hospitals.',
      timestamp: '1 hour ago',
      likes: 9
    }
  ]
};

export function SectorNetworks() {
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sectorDiscussions, setSectorDiscussions] = useState<any[]>([]);
  const [quickInteractions, setQuickInteractions] = useState<any[]>([]);
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<any>(null);
  const [joinedSectors, setJoinedSectors] = useState<string[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joiningsector, setJoiningSector] = useState<string | null>(null);
  const [showNewSectorModal, setShowNewSectorModal] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [selectedInteractionDetail, setSelectedInteractionDetail] = useState<any>(null);


  const [discussionReplies, setDiscussionReplies] = useState<DiscussionReplies>(initialRepliesData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [sectorNetworks, setSectorNetworks] = useState<any[]>([]);
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  const [dynamicSectors, setDynamicSectors] = useState<any[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(false);

  // Load data from localStorage and database on component mount
  useEffect(() => {
    loadDiscussions();
    loadOtherData();
  }, []);

  const loadDiscussions = async () => {
    // Always start with existing discussions
    setSectorDiscussions(initialDiscussions);
    
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_discussions.php');
      const data = await response.json();
      if (data.success) {
        const dbDiscussions = data.discussions.map((d: any) => ({
          id: `db_${d.id}`,
          title: d.title,
          author: d.author,
          sector: d.sector?.replace(/^0+/, '') || d.sector,
          timestamp: d.time_ago,
          likes: d.likes,
          replies: d.replies,
          isPinned: d.is_pinned
        }));
        setSectorDiscussions([...initialDiscussions, ...dbDiscussions]);
      }
    } catch (error) {
      console.error('Error loading discussions:', error);
    }
  };

  const loadRepliesFromDB = async (discussionId: string) => {
    try {
      const response = await fetch(`http://localhost/NGO-India/backend/get_replies.php?discussion_id=${discussionId}`);
      const data = await response.json();
      if (data.success) {
        const dbReplies = data.replies.map((r: any) => ({
          id: r.id.toString(),
          author: r.author,
          content: r.content,
          timestamp: r.time_ago,
          likes: r.likes
        }));
        
        setDiscussionReplies(prev => ({
          ...prev,
          [`db_${discussionId}`]: dbReplies
        }));
      }
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const loadOtherData = async () => {
    // Load quick interactions from database
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_sector_posts.php');
      const data = await response.json();
      if (data.success) {
        const dbPosts = data.posts.map((p: any) => ({
          id: `db_${p.id}`,
          title: p.title,
          author: p.author,
          sector: p.sector?.replace(/^0+/, '') || p.sector,
          type: p.type,
          urgency: p.urgency,
          timestamp: p.time_ago,
          responses: p.responses,
          status: p.status,
          description: p.description
        }));
        
        // Combine with existing initial data
        setQuickInteractions([...dbPosts, ...initialQuickInteractions]);
      } else {
        setQuickInteractions(initialQuickInteractions);
      }
    } catch (error) {
      console.error('Error loading sector posts:', error);
      setQuickInteractions(initialQuickInteractions);
    }
    
    const savedActivities = localStorage.getItem('recentActivities');
    const savedJoinedSectors = localStorage.getItem('joinedSectors');
    
    if (savedActivities) {
      setRecentActivities(JSON.parse(savedActivities));
    }
    
    if (savedJoinedSectors) {
      setJoinedSectors(JSON.parse(savedJoinedSectors));
    }
    
    const savedReplies = localStorage.getItem('discussionReplies');
    if (savedReplies) {
      const parsedReplies: DiscussionReplies = JSON.parse(savedReplies);
      const mergedReplies: DiscussionReplies = { ...initialRepliesData };
      Object.keys(parsedReplies).forEach(discussionId => {
        if (mergedReplies[discussionId]) {
          const existingIds = mergedReplies[discussionId].map((r: Reply) => r.id);
          const newReplies = parsedReplies[discussionId].filter((r: Reply) => !existingIds.includes(r.id));
          mergedReplies[discussionId] = [...mergedReplies[discussionId], ...newReplies];
        } else {
          mergedReplies[discussionId] = parsedReplies[discussionId];
        }
      });
      setDiscussionReplies(mergedReplies);
    } else {
      setDiscussionReplies(initialRepliesData);
    }
  };

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sectorDiscussions', JSON.stringify(sectorDiscussions));
  }, [sectorDiscussions]);

  useEffect(() => {
    localStorage.setItem('quickInteractions', JSON.stringify(quickInteractions));
  }, [quickInteractions]);

  useEffect(() => {
    localStorage.setItem('recentActivities', JSON.stringify(recentActivities));
  }, [recentActivities]);

  useEffect(() => {
    localStorage.setItem('joinedSectors', JSON.stringify(joinedSectors));
  }, [joinedSectors]);

  useEffect(() => {
    localStorage.setItem('discussionReplies', JSON.stringify(discussionReplies));
  }, [discussionReplies]);

  // Fetch networks from backend
  const fetchNetworks = async () => {
    setLoadingNetworks(true);
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_networks_api.php');
      const result = await response.json();
      if (result.success) {
        setSectorNetworks(result.networks);
      }
    } catch (error) {
      console.error('Error fetching networks:', error);
    } finally {
      setLoadingNetworks(false);
    }
  };

  // Fetch sectors from backend
  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_sectors_api.php');
      const result = await response.json();
      if (result.success) {
        setDynamicSectors(result.sectors);
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
    } finally {
      setLoadingSectors(false);
    }
  };

  useEffect(() => {
    fetchNetworks();
    fetchSectors();
  }, []);

  // Combine static sectors with dynamic sectors from database
  const allSectors = [
    ...sectors,
    ...dynamicSectors.map(dbSector => ({
      id: `db-${dbSector.id}`,
      name: dbSector.sector_name,
      description: dbSector.description || 'Custom sector for specialized collaboration',
      ngoCount: dbSector.ngo_count || 0,
      activeDiscussions: dbSector.active_discussions || 0,
      resources: dbSector.resources || 0,
      color: dbSector.color || 'bg-purple-500',
      icon: Target // Default icon for custom sectors
    }))
  ];

  const filteredSectors = allSectors.filter(sector =>
    sector.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStats = {
    totalNGOs: sectors.reduce((sum, sector) => sum + sector.ngoCount, 0),
    totalDiscussions: sectors.reduce((sum, sector) => sum + sector.activeDiscussions, 0),
    totalResources: sectors.reduce((sum, sector) => sum + sector.resources, 0),
    activeSectors: sectors.length
  };

  const handleNewDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const authorName = formData.get('author') as string || 'Anonymous User';
    const sectorValue = formData.get('sector') as string;
    
    // Clean the sector value to remove any unwanted prefixes
    const cleanSector = sectorValue?.replace(/^0+/, '') || sectorValue;
    
    const discussionData = {
      title: formData.get('title') as string,
      author: authorName,
      sector: cleanSector,
      content: formData.get('content') as string,
      isPinned: false
    };
    
    try {
      const response = await fetch('http://localhost/NGO-India/backend/add_discussion.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discussionData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Add to frontend immediately
        const newDiscussion = {
          id: `db_${result.id}`,
          title: discussionData.title,
          author: discussionData.author,
          sector: discussionData.sector,
          timestamp: 'Just now',
          likes: 0,
          replies: 0,
          isPinned: false
        };
        setSectorDiscussions([newDiscussion, ...sectorDiscussions]);
        
        // Add to recent activities
        const newActivity = {
          id: Date.now().toString(),
          type: 'discussion',
          title: `New Discussion in ${formData.get('sector')} Sector`,
          description: `"${formData.get('title')}" started by ${authorName}`,
          timestamp: 'Just now',
          icon: MessageSquare,
          iconColor: 'blue',
          stats: ['0 likes', '0 replies']
        };
        setRecentActivities([newActivity, ...recentActivities]);
        setShowNewPost(false);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      alert('Failed to create discussion. Please check your connection.');
    }
  };



  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Clean Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900">Sector Networks</h1>
            <p className="text-lg text-gray-600 mt-1">Connect and collaborate with NGOs in your sector</p>
          </div>
          
          {/* Simple Tab Navigation */}
          <div className="flex bg-white rounded-xl p-2 shadow-sm border border-gray-200">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'sectors', label: 'Sectors' },
              { id: 'discussions', label: 'Discussions' },
              { id: 'quick-interactions', label: 'Quick Interactions' },
              { id: 'analytics', label: 'Analytics' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeView === tab.id 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Stats Row */}
        <div className="grid grid-cols-4 gap-8">
          {[
            { label: 'Total NGOs', value: totalStats.totalNGOs, icon: Users, color: 'orange' },
            { label: 'Active Discussions', value: totalStats.totalDiscussions, icon: MessageSquare, color: 'blue' },
            { label: 'Quick Interactions', value: quickInteractions.length, icon: Zap, color: 'green' },
            { label: 'Active Sectors', value: totalStats.activeSectors, icon: Target, color: 'purple' }
          ].map((stat: any, index: number) => {
            const Icon = stat.icon;
            const bgColorClass = stat.color === 'orange' ? 'bg-orange-100' : 
                               stat.color === 'blue' ? 'bg-blue-100' : 
                               stat.color === 'green' ? 'bg-green-100' : 
                               stat.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100';
            const textColorClass = stat.color === 'orange' ? 'text-orange-600' : 
                                 stat.color === 'blue' ? 'text-blue-600' : 
                                 stat.color === 'green' ? 'text-green-600' : 
                                 stat.color === 'purple' ? 'text-purple-600' : 'text-gray-600';
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[140px] flex flex-col">
                <div className={`${bgColorClass} p-3 rounded-lg w-fit mb-3`}>
                  <Icon className={`w-6 h-6 ${textColorClass}`} />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Views */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="col-span-2 space-y-10">
            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Recent Network Activity</h2>
              <div className="space-y-6">
                {/* Dynamic Activities */}
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  const iconColorClass = activity.iconColor === 'blue' ? 'bg-blue-100' : 
                                       activity.iconColor === 'green' ? 'bg-green-100' : 
                                       activity.iconColor === 'orange' ? 'bg-orange-100' : 'bg-gray-100';
                  const textColorClass = activity.iconColor === 'blue' ? 'text-blue-600' : 
                                       activity.iconColor === 'green' ? 'text-green-600' : 
                                       activity.iconColor === 'orange' ? 'text-orange-600' : 'text-gray-600';
                  return (
                    <div key={activity.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex items-start gap-6">
                        <div className={`${iconColorClass} p-4 rounded-full`}>
                          <Icon className={`w-8 h-8 ${textColorClass}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h3>
                          <p className="text-gray-700 mb-4">{activity.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{activity.timestamp}</span>
                            {activity.stats.map((stat: string, index: number) => (
                              <span key={index}>{stat}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Default Activities */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <MessageSquare className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">New Discussion in Education Sector</h3>
                      <p className="text-gray-700 mb-4">"Best Practices for Digital Education in Rural Areas" started by Kavita Mehta</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>2 hours ago</span>
                        <span>15 likes</span>
                        <span>8 replies</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-green-100 p-4 rounded-full">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">New Resource Uploaded</h3>
                      <p className="text-gray-700 mb-4">"Healthcare Mobile Unit Setup Guide" shared in Healthcare sector</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>4 hours ago</span>
                        <span>189 downloads</span>
                        <span>4.6 rating</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-purple-100 p-4 rounded-full">
                      <Handshake className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">New Collaboration Formed</h3>
                      <p className="text-gray-700 mb-4">Environment and Rural Development sectors partnering on Sustainable Agriculture Initiative</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>6 hours ago</span>
                        <span>12 NGOs involved</span>
                        <span>2,500+ farmers impacted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => setShowNewPost(true)}
                  className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl hover:bg-orange-600 transition-colors font-semibold flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  Start Discussion
                </button>
                <button 
                  onClick={() => setShowQuickPost(true)}
                  className="w-full border-2 border-orange-500 text-orange-600 py-4 px-6 rounded-xl hover:bg-orange-50 transition-colors font-semibold flex items-center gap-3"
                >
                  <Zap className="w-5 h-5" />
                  Quick Post
                </button>
                <button className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Find Partners
                </button>
              </div>
            </div>

            {/* Network Insights */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Network Insights</h3>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Most Active Sector</span>
                  <span className="font-bold text-gray-900">Education</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Growth This Month</span>
                  <span className="font-bold text-green-600">+12.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">New Collaborations</span>
                  <span className="font-bold text-gray-900">23</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveView('analytics')}
                className="w-full bg-orange-500 text-white py-4 px-6 rounded-xl hover:bg-orange-600 transition-colors font-semibold"
              >
                View Full Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {activeView === 'sectors' && (
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="flex gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search sectors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
            </div>
            <button 
              onClick={() => setShowNewSectorModal(true)}
              className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-3 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add New Sector
            </button>
          </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-2 gap-8">
            {filteredSectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div key={sector.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`${sector.color} p-4 rounded-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">{sector.name}</h3>
                      <p className="text-gray-600">{sector.ngoCount} NGOs</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">{sector.description}</p>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="text-center bg-gray-50 p-2 rounded-md">
                      <p className="text-lg font-bold text-gray-900">{sectorNetworks.filter(network => network.focus_area === sector.name).length + 10}</p>
                      <p className="text-gray-600 text-xs">NGOs</p>
                    </div>
                    <div className="text-center bg-gray-50 p-2 rounded-md">
                      <p className="text-lg font-bold text-gray-900">{sectorDiscussions.filter(d => d.sector === sector.name).length || '-'}</p>
                      <p className="text-gray-600 text-xs">Discussions</p>
                    </div>
                    <div className="text-center bg-gray-50 p-2 rounded-md">
                      <p className="text-lg font-bold text-gray-900">{quickInteractions.filter(i => i.sector === sector.name).length || '-'}</p>
                      <p className="text-gray-600 text-xs">Interactions</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setJoiningSector(sector.id);
                        setShowJoinModal(true);
                      }}
                      className={`flex-1 py-4 px-6 rounded-xl transition-colors font-semibold ${
                        joinedSectors.includes(sector.id)
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {joinedSectors.includes(sector.id) ? '✓ Joined' : 'Join Network'}
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedSector(sector.id);
                        setActiveView('sector-detail');
                      }}
                      className="border-2 border-orange-500 text-orange-600 py-4 px-6 rounded-xl hover:bg-orange-50 transition-colors font-semibold"
                    >
                      View Networks ({sectorNetworks.filter(network => network.focus_area === sector.name).length})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'discussions' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-gray-900">Sector Discussions</h2>
            <button 
              onClick={() => setShowNewPost(true)}
              className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-3 font-semibold"
            >
              <Plus className="w-5 h-5" />
              New Discussion
            </button>
          </div>
          
          <div className="space-y-6">
            {sectorDiscussions.map((discussion) => (
              <div 
                key={discussion.id} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedDiscussion(discussion);
                  if (discussion.id.startsWith('db_')) {
                    loadRepliesFromDB(discussion.id.replace('db_', ''));
                  }
                  setActiveView('discussion-detail');
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="bg-orange-100 p-4 rounded-full">
                    <User className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      {discussion.isPinned && <Pin className="w-5 h-5 text-orange-600" />}
                      <h3 className="text-2xl font-semibold text-gray-900">{discussion.title}</h3>
                      <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
                        {discussion.sector}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-gray-600">
                        <span className="font-medium">{discussion.author}</span>
                        <span>{discussion.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <button 
                          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ThumbsUp className="w-5 h-5" />
                          <span className="font-medium">{discussion.likes}</span>
                        </button>
                        <button 
                          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Reply className="w-5 h-5" />
                          <span className="font-medium">{discussion.replies}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'quick-interactions' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-gray-900">Quick Interactions</h2>
            <button 
              onClick={() => setShowQuickPost(true)}
              className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-3 font-semibold"
            >
              <Zap className="w-5 h-5" />
              Quick Post
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {quickInteractions.map((interaction) => (
              <div 
                key={interaction.id} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedInteractionDetail(interaction);
                  setActiveView('interaction-detail');
                }}
              >
                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-xl ${
                    interaction.type === 'Need Help' ? 'bg-orange-100' : 'bg-green-100'
                  }`}>
                    {interaction.type === 'Need Help' ? 
                      <HelpCircle className={`w-8 h-8 ${
                        interaction.type === 'Need Help' ? 'text-orange-600' : 'text-green-600'
                      }`} /> :
                      <UserCheck className="w-8 h-8 text-green-600" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{interaction.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        interaction.type === 'Need Help' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {interaction.type}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        interaction.urgency === 'Immediate' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {interaction.urgency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-gray-600">
                        <span className="font-medium">{interaction.author}</span>
                        <span>{interaction.timestamp}</span>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {interaction.sector}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInteraction(interaction);
                            setShowResponseModal(true);
                          }}
                          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Respond ({interaction.responses})
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickInteractions(prev => 
                              prev.map(item => 
                                item.id === interaction.id 
                                  ? { ...item, responses: item.responses + 1 }
                                  : item
                              )
                            );
                            alert(`You've shown interest in "${interaction.title}". The author will be notified!`);
                          }}
                          className="border-2 border-orange-500 text-orange-600 px-6 py-2 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
                        >
                          {interaction.type === 'Need Help' ? 'I Can Help' : 'Interested'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-gray-900">Sector Analytics</h2>
          <div className="grid grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">Sector Performance</h3>
              <div className="space-y-6">
                {sectors.map((sector) => (
                  <div key={sector.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{sector.name}</p>
                      <p className="text-gray-600">{sector.ngoCount} NGOs</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-bold text-green-600">+12.5%</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {sectorDiscussions.filter(d => d.sector === sector.name).length || '-'} discussions • {quickInteractions.filter(i => i.sector === sector.name).length || '-'} interactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8">Trending Topics</h3>
              <div className="space-y-6">
                {['Digital Education', 'Mobile Healthcare', 'Climate Action'].map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{topic}</p>
                        <p className="text-gray-600">{145 - index * 20} mentions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-bold text-green-600">+{23.5 - index * 2}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'sector-detail' && selectedSector && (() => {
        const sector = allSectors.find(s => s.id === selectedSector);
        if (!sector) return null;
        const Icon = sector.icon;
        const sectorDiscussionsFiltered = sectorDiscussions.filter(d => d.sector === sector.name);
        const sectorInteractionsFiltered = quickInteractions.filter(i => i.sector === sector.name);
        
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-6 mb-8">
              <button 
                onClick={() => setActiveView('sectors')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowRight className="w-6 h-6 rotate-180" />
              </button>
              <div className={`${sector.color} p-4 rounded-xl`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-semibold text-gray-900">{sector.name} Network</h1>
                <p className="text-lg text-gray-600 mt-1">{sector.description}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">NGOs</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{sectorNetworks.filter(network => network.focus_area === sector.name).length + 10}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Discussions</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{sectorDiscussionsFiltered.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Interactions</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{sectorInteractionsFiltered.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Resources</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{sector.resources}</p>
              </div>
            </div>

            {/* Network Members */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Network Members</h3>
                <span className="text-sm text-gray-600">
                  {sectorNetworks.filter(network => network.focus_area === sector.name).length} organizations
                </span>
              </div>
              
              {loadingNetworks ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading network members...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectorNetworks
                    .filter(network => network.focus_area === sector.name)
                    .map((network) => (
                      <div key={network.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Users className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{network.ngo_name}</h4>
                            <p className="text-sm text-gray-600 truncate">{network.location || 'Location not specified'}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{network.members || 0} members</span>
                              <span>{network.projects || 0} projects</span>
                              {network.verified && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">✓ Verified</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {network.website && (
                          <div className="mt-3">
                            <a 
                              href={network.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1"
                            >
                              <Globe className="w-4 h-4" />
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                    ))
                  }
                  
                  {sectorNetworks.filter(network => network.focus_area === sector.name).length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No organizations have joined this sector network yet.</p>
                      <p className="text-sm text-gray-400 mt-1">Be the first to join and start building connections!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Recent Discussions */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recent Discussions</h3>
                  <button 
                    onClick={() => setActiveView('discussions')}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {sectorDiscussionsFiltered.slice(0, 3).map((discussion) => (
                    <div key={discussion.id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{discussion.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{discussion.author}</span>
                        <div className="flex items-center gap-3">
                          <span>{discussion.likes} likes</span>
                          <span>{discussion.replies} replies</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {sectorDiscussionsFiltered.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No discussions yet in this sector</p>
                  )}
                </div>
              </div>

              {/* Quick Interactions */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Quick Interactions</h3>
                  <button 
                    onClick={() => setActiveView('quick-interactions')}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {sectorInteractionsFiltered.slice(0, 3).map((interaction) => (
                    <div key={interaction.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          interaction.type === 'Need Help' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {interaction.type}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          interaction.urgency === 'Immediate' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {interaction.urgency}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{interaction.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{interaction.author}</span>
                        <span>{interaction.responses} responses</span>
                      </div>
                    </div>
                  ))}
                  {sectorInteractionsFiltered.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No interactions yet in this sector</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setJoiningSector(sector.id);
                  setShowJoinModal(true);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                  joinedSectors.includes(sector.id)
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {joinedSectors.includes(sector.id) ? '✓ Joined Network' : 'Join Network'}
              </button>
              <button 
                onClick={() => setShowNewPost(true)}
                className="border-2 border-orange-500 text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors font-semibold"
              >
                Start Discussion
              </button>
              <button 
                onClick={() => setShowQuickPost(true)}
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Quick Post
              </button>
            </div>
          </div>
        );
      })()}

      {activeView === 'discussion-detail' && selectedDiscussion && (
        <div className="space-y-8">
          <div className="flex items-center gap-6 mb-8">
            <button 
              onClick={() => setActiveView('discussions')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowRight className="w-6 h-6 rotate-180" />
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">{selectedDiscussion.title}</h1>
              <p className="text-lg text-gray-600 mt-1">Discussion in {selectedDiscussion.sector} Sector</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-6 mb-6">
              <div className="bg-orange-100 p-4 rounded-full">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedDiscussion.title}</h2>
                  <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {selectedDiscussion.sector}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-gray-600 mb-4">
                  <span className="font-medium">{selectedDiscussion.author}</span>
                  <span>{selectedDiscussion.timestamp}</span>
                </div>
                <div className="prose max-w-none text-gray-700 mb-6">
                  <p>This is a detailed discussion about {selectedDiscussion.title.toLowerCase()}. The discussion covers various aspects and best practices that can help organizations in the {selectedDiscussion.sector} sector improve their impact and reach.</p>
                </div>
                <div className="flex items-center gap-6">
                  <button 
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                    onClick={() => {
                      setSectorDiscussions(prev => 
                        prev.map(d => 
                          d.id === selectedDiscussion.id 
                            ? { ...d, likes: d.likes + 1 }
                            : d
                        )
                      );
                    }}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span className="font-medium">{selectedDiscussion.likes}</span>
                  </button>
                  <span className="flex items-center gap-2 text-gray-600">
                    <Reply className="w-5 h-5" />
                    <span className="font-medium">{discussionReplies[selectedDiscussion.id]?.length || 0} replies</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Replies ({discussionReplies[selectedDiscussion.id]?.length || 0})</h3>
            
            <form className="mb-8" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              
              if (selectedDiscussion.id.startsWith('db_')) {
                // Save to database for database discussions
                const replyData = {
                  discussion_id: selectedDiscussion.id.replace('db_', ''),
                  author: formData.get('author') as string,
                  content: formData.get('content') as string
                };
                
                try {
                  const response = await fetch('http://localhost/NGO-India/backend/add_reply.php', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(replyData)
                  });
                  
                  const result = await response.json();
                  
                  if (result.success) {
                    loadRepliesFromDB(selectedDiscussion.id.replace('db_', ''));
                    setSectorDiscussions(prev => 
                      prev.map(d => 
                        d.id === selectedDiscussion.id 
                          ? { ...d, replies: d.replies + 1 }
                          : d
                      )
                    );
                    (e.target as HTMLFormElement).reset();
                  } else {
                    alert('Error: ' + result.error);
                  }
                } catch (error) {
                  console.error('Error adding reply:', error);
                  alert('Failed to add reply. Please check your connection.');
                }
              } else {
                // Use localStorage for initial discussions
                const newReply = {
                  id: Date.now().toString(),
                  author: formData.get('author') as string,
                  content: formData.get('content') as string,
                  timestamp: 'Just now',
                  likes: 0
                };
                
                setDiscussionReplies(prev => ({
                  ...prev,
                  [selectedDiscussion.id]: [...(prev[selectedDiscussion.id] || []), newReply]
                }));
                
                setSectorDiscussions(prev => 
                  prev.map(d => 
                    d.id === selectedDiscussion.id 
                      ? { ...d, replies: d.replies + 1 }
                      : d
                  )
                );
                
                (e.target as HTMLFormElement).reset();
              }
            }}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  name="author"
                  type="text"
                  placeholder="Your name"
                  required
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <textarea
                name="content"
                rows={3}
                placeholder="Share your thoughts on this discussion..."
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
              />
              <button type="submit" className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-semibold">
                Post Reply
              </button>
            </form>

            <div className="space-y-6">
              {(discussionReplies[selectedDiscussion.id] || []).map((reply) => (
                <div key={reply.id} className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                  <div className="bg-gray-200 p-3 rounded-full">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{reply.author}</span>
                      <span className="text-gray-600 text-sm">{reply.timestamp}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{reply.content}</p>
                    <button 
                      className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors text-sm"
                      onClick={() => {
                        setDiscussionReplies(prev => ({
                          ...prev,
                          [selectedDiscussion.id]: prev[selectedDiscussion.id].map(r => 
                            r.id === reply.id ? { ...r, likes: r.likes + 1 } : r
                          )
                        }));
                      }}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{reply.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {(!discussionReplies[selectedDiscussion.id] || discussionReplies[selectedDiscussion.id].length === 0) && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No replies yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl mx-4 my-8 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowNewPost(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Start New Discussion</h2>
            <form className="space-y-6" onSubmit={handleNewDiscussion}>
              <input
                name="author"
                type="text"
                placeholder="Your name"
                required
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
              <input
                name="title"
                type="text"
                placeholder="Discussion title..."
                required
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
              <select name="sector" required className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg">
                <option value="">Select Sector</option>
                {sectors.map((sector) => <option key={sector.id} value={sector.name}>{sector.name}</option>)}
              </select>
              <textarea
                name="content"
                rows={6}
                placeholder="Share your thoughts..."
                required
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
              <button type="submit" className="w-full bg-orange-500 text-white py-4 px-8 rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg">
                Post Discussion
              </button>
            </form>
          </div>
        </div>
      )}

      {showQuickPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl mx-4 my-8 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowQuickPost(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">Quick Post</h2>
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const authorName = formData.get('author') as string || 'Anonymous User';
              const sectorValue = formData.get('sector') as string;
              
              // Clean the sector value to remove any unwanted prefixes
              const cleanSector = sectorValue?.replace(/^0+/, '') || sectorValue;
              
              const postData = {
                title: formData.get('title') as string,
                author: authorName,
                sector: cleanSector,
                type: formData.get('type') as string,
                urgency: formData.get('urgency') as string,
                description: formData.get('description') as string || ''
              };
              
              try {
                // Save to database
                const response = await fetch('http://localhost/NGO-India/backend/add_sector_post.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(postData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                  // Add to frontend immediately
                  const newInteraction = {
                    id: `db_${result.id}`,
                    title: postData.title,
                    author: postData.author,
                    sector: postData.sector,
                    type: postData.type,
                    urgency: postData.urgency,
                    timestamp: 'Just now',
                    responses: 0,
                    status: 'Active',
                    description: postData.description
                  };
                  setQuickInteractions([newInteraction, ...quickInteractions]);
                  
                  // Add to recent activities
                  const newActivity = {
                    id: Date.now().toString() + '_activity',
                    type: 'interaction',
                    title: `New ${postData.type} Post in ${postData.sector} Sector`,
                    description: `"${postData.title}" posted by ${authorName}`,
                    timestamp: 'Just now',
                    icon: postData.type === 'Need Help' ? HelpCircle : UserCheck,
                    iconColor: postData.type === 'Need Help' ? 'orange' : 'green',
                    stats: ['0 responses', `${postData.urgency} urgency`]
                  };
                  setRecentActivities([newActivity, ...recentActivities]);
                  setShowQuickPost(false);
                } else {
                  alert('Error: ' + result.error);
                }
              } catch (error) {
                console.error('Error creating sector post:', error);
                alert('Failed to create post. Please check your connection.');
              }
            }}>
              <input
                name="author"
                type="text"
                placeholder="Your name"
                required
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
              <input
                name="title"
                type="text"
                placeholder="What do you need help with or what can you offer?"
                required
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
              <div className="grid grid-cols-3 gap-6">
                <select name="sector" required className="px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg">
                  <option value="">Select Sector</option>
                  {sectors.map((sector) => <option key={sector.id} value={sector.name}>{sector.name}</option>)}
                </select>
                <select name="type" required className="px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg">
                  <option value="">Type</option>
                  <option value="Need Help">Need Help</option>
                  <option value="Can Help">Can Help</option>
                </select>
                <select name="urgency" required className="px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg">
                  <option value="">Urgency</option>
                  <option value="Immediate">Immediate</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
              </div>
              <textarea
                name="description"
                rows={4}
                placeholder="Provide more details about your request or offer..."
                className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
              <button type="submit" className="w-full bg-orange-500 text-white py-4 px-8 rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg">
                Post Quick Interaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join New Sector Modal */}
      {showNewSectorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowNewSectorModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-8">
              <div className="bg-orange-500 p-6 rounded-2xl w-fit mx-auto mb-4">
                <Plus className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Sector</h2>
              <p className="text-lg text-gray-600">Create or join a sector network that matches your organization's focus</p>
            </div>
            
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setSubmitMessage('');
              
              try {
                const formData = new FormData(e.target as HTMLFormElement);
                
                // First add the sector
                const sectorData = {
                  sectorName: formData.get('sectorName') as string,
                  description: `Custom sector for ${formData.get('sectorName')} organizations`,
                  createdBy: formData.get('ngoName') as string
                };
                
                await fetch('http://localhost/NGO-India/backend/add_sector_api.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(sectorData)
                });
                
                // Then add the organization to networks
                const joinData = {
                  ngoName: formData.get('ngoName') as string,
                  email: formData.get('email') as string,
                  phone: formData.get('phone') as string,
                  location: formData.get('location') as string,
                  focusArea: formData.get('sectorName') as string,
                  description: formData.get('description') as string,
                  website: formData.get('website') as string,
                  members: parseInt(formData.get('members') as string) || 0,
                  projects: parseInt(formData.get('projects') as string) || 0
                };
                
                const response = await fetch('http://localhost/NGO-India/backend/add_network_api.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(joinData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                  setSubmitMessage('Successfully added the new sector!');
                  fetchNetworks();
                  fetchSectors(); // Refresh sectors list
                  setTimeout(() => {
                    setShowNewSectorModal(false);
                    setSubmitMessage('');
                  }, 2000);
                } else {
                  setSubmitMessage('Error: ' + (result.error || 'Failed to add sector'));
                }
              } catch (error) {
                console.error('Network error:', error);
                setSubmitMessage('Network error. Please try again.');
              } finally {
                setIsSubmitting(false);
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector Name *</label>
                <input
                  name="sectorName"
                  type="text"
                  required
                  placeholder="e.g., Rural Development, Disaster Relief, Child Welfare"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                <input
                  name="ngoName"
                  type="text"
                  required
                  placeholder="Enter your organization name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="organization@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    name="location"
                    type="text"
                    placeholder="City, State"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                <input
                  name="website"
                  type="url"
                  placeholder="https://www.yourorganization.org"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                  <input
                    name="members"
                    type="number"
                    min="0"
                    placeholder="Number of team members"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Projects</label>
                  <input
                    name="projects"
                    type="number"
                    min="0"
                    placeholder="Number of active projects"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Description *</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Describe your organization's mission and how it relates to this sector..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              {submitMessage && (
                <div className={`p-4 rounded-xl text-center font-medium ${
                  submitMessage.includes('Successfully') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {submitMessage}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isSubmitting ? 'Adding Sector...' : 'Add New Sector'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join Network Modal */}
      {showJoinModal && joiningsector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowJoinModal(false);
                setJoiningSector(null);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {(() => {
              const sector = allSectors.find(s => s.id === joiningsector);
              if (!sector) return null;
              const Icon = sector.icon;
              
              return (
                <div>
                  <div className="text-center mb-8">
                    <div className={`${sector.color} p-6 rounded-2xl w-fit mx-auto mb-4`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Join {sector.name} Network</h2>
                    <p className="text-lg text-gray-600">{sector.description}</p>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-xl mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Network Benefits:</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Connect with {sector.ngoCount} NGOs in {sector.name}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Access to sector-specific discussions and resources</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Collaboration opportunities with partner organizations</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Priority access to sector events and training</span>
                      </li>
                    </ul>
                  </div>
                  
                  <form className="space-y-6" onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    setSubmitMessage('');
                    
                    try {
                      const formData = new FormData(e.target as HTMLFormElement);
                      const joinData = {
                        ngoName: formData.get('ngoName') as string,
                        email: formData.get('email') as string,
                        phone: formData.get('phone') as string,
                        location: formData.get('location') as string,
                        focusArea: sector.name,
                        description: formData.get('description') as string,
                        website: formData.get('website') as string,
                        members: parseInt(formData.get('members') as string) || 0,
                        projects: parseInt(formData.get('projects') as string) || 0,
                        role: formData.get('role') as string
                      };
                      
                      const response = await fetch('http://localhost/NGO-India/backend/add_network_api.php', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(joinData)
                      });
                      
                      const result = await response.json();
                      
                      if (result.success) {
                        setJoinedSectors([...joinedSectors, joiningsector]);
                        setSubmitMessage('Successfully joined the network!');
                        fetchNetworks(); // Refresh the networks list
                        setTimeout(() => {
                          setShowJoinModal(false);
                          setJoiningSector(null);
                          setSubmitMessage('');
                        }, 2000);
                      } else {
                        setSubmitMessage('Error: ' + (result.error || 'Failed to join network'));
                      }
                    } catch (error) {
                      console.error('Network error:', error);
                      setSubmitMessage('Network error. Please try again.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                      <input
                        name="ngoName"
                        type="text"
                        required
                        placeholder="Enter your organization name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="organization@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          name="location"
                          type="text"
                          placeholder="City, State"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                      <input
                        name="website"
                        type="url"
                        placeholder="https://www.yourorganization.org"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
                        <input
                          name="members"
                          type="number"
                          min="0"
                          placeholder="Number of team members"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Active Projects</label>
                        <input
                          name="projects"
                          type="number"
                          min="0"
                          placeholder="Number of active projects"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
                      <select name="role" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="">Select your role</option>
                        <option value="Director">Director/CEO</option>
                        <option value="Program Manager">Program Manager</option>
                        <option value="Project Coordinator">Project Coordinator</option>
                        <option value="Field Officer">Field Officer</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Description *</label>
                      <textarea
                        name="description"
                        rows={4}
                        required
                        placeholder="Tell us about your organization, its mission, and how you plan to contribute to this network..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="terms" required className="w-5 h-5 text-orange-600" />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the network guidelines and commit to active participation
                      </label>
                    </div>
                    
                    {submitMessage && (
                      <div className={`p-4 rounded-xl text-center font-medium ${
                        submitMessage.includes('Successfully') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {submitMessage}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-colors ${
                        isSubmitting 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isSubmitting ? 'Joining Network...' : 'Join Network'}
                    </button>
                  </form>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedInteraction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => {
                setShowResponseModal(false);
                setSelectedInteraction(null);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <div className={`p-4 rounded-xl mb-4 ${
                selectedInteraction.type === 'Need Help' ? 'bg-orange-100' : 'bg-green-100'
              }`}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedInteraction.title}</h2>
                <div className="flex items-center gap-3">
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedInteraction.sector}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedInteraction.type === 'Need Help' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedInteraction.type}
                  </span>
                  <span className="text-gray-600">{selectedInteraction.author} • {selectedInteraction.timestamp}</span>
                </div>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              
              const responseData = {
                post_name: selectedInteraction.title,
                name: formData.get('name') as string,
                organization: formData.get('organization') as string,
                email: formData.get('email') as string,
                message: formData.get('message') as string
              };
              
              try {
                // Save to database
                const response = await fetch('http://localhost/NGO-India/backend/add_post_response.php', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(responseData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                  setQuickInteractions(prev => 
                    prev.map(item => 
                      item.id === selectedInteraction.id 
                        ? { ...item, responses: item.responses + 1 }
                        : item
                    )
                  );
                  setShowResponseModal(false);
                  setSelectedInteraction(null);
                  alert(`Your response has been sent to ${selectedInteraction.author}!`);
                } else {
                  alert('Error: ' + result.error);
                }
              } catch (error) {
                console.error('Error sending response:', error);
                alert('Failed to send response. Please check your connection.');
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <input
                  name="organization"
                  type="text"
                  required
                  placeholder="Your organization name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  placeholder={selectedInteraction.type === 'Need Help' 
                    ? 'Explain how you can help with this request...' 
                    : 'Share your interest and how you can collaborate...'}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-4 px-8 rounded-xl hover:bg-orange-600 transition-colors font-semibold text-lg"
                >
                  Send Response
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedInteraction(null);
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}