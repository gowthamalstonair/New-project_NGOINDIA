import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Users, Target, TrendingUp, ArrowLeft, Plus } from 'lucide-react';
import { getCampaigns, getStats, Campaign } from '../../utils/campaignData';
import { getCategoryImage } from '../../utils/categoryImages';

export function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({ totalCampaigns: 0, totalRaised: 0, totalDonors: 0, activeCampaigns: 0 });
  const [activeCampaigns, setActiveCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        // Try to fetch from backend first
        const response = await fetch('http://localhost/NGO-India/backend/get_campaigns_api.php');
        const result = await response.json();
        
        if (result.success && result.campaigns) {
          // Convert backend data to frontend format
          const backendCampaigns = result.campaigns.map((campaign: any) => ({
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            fullStory: campaign.full_story,
            goal: parseFloat(campaign.goal),
            raised: parseFloat(campaign.raised || 0),
            category: campaign.category,
            daysLeft: campaign.daysLeft,
            organizerName: campaign.organizer_name,
            organizerEmail: campaign.organizer_email,
            organizerPhone: campaign.organizer_phone,
            image: campaign.image_url,
            status: 'active',
            donors: Math.floor(parseFloat(campaign.raised || 0) / 500) // Estimate donors
          }));
          
          // Get existing campaigns from local storage
          const localCampaigns = getCampaigns();
          
          // Combine both sources
          const allCampaigns = [...backendCampaigns, ...localCampaigns];
          setActiveCampaigns(allCampaigns);
        } else {
          // Fallback to local storage only
          const localCampaigns = getCampaigns();
          setActiveCampaigns(localCampaigns);
        }
      } catch (error) {
        console.error('Error loading campaigns:', error);
        // Fallback to local storage
        const localCampaigns = getCampaigns();
        setActiveCampaigns(localCampaigns);
      } finally {
        setLoading(false);
      }
    };
    
    loadCampaigns();
  }, []);

  useEffect(() => {
    // Calculate stats from loaded campaigns
    const totalRaised = activeCampaigns.reduce((sum, c) => sum + c.raised, 0);
    const totalDonors = activeCampaigns.reduce((sum, c) => sum + c.donors, 0);
    const activeCampaignsCount = activeCampaigns.filter(c => c.status === 'active').length;
    
    setStats({
      totalCampaigns: activeCampaigns.length,
      totalRaised,
      totalDonors,
      activeCampaigns: activeCampaignsCount
    });
  }, [activeCampaigns]);

  const categories = [
    { id: 'all', name: 'All Categories'},
    { id: 'education', name: 'Education' },
    { id: 'healthcare', name: 'Healthcare'},
    { id: 'water', name: 'Clean Water' },
    { id: 'food', name: 'Food Relief' },
    { id: 'skills', name: 'Skills Training' },
    { id: 'empowerment', name: 'Empowerment' }
  ];

  const filteredCampaigns = activeCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-orange-500';
    }
  };

  const getStatusText = (status: string, daysLeft: number) => {
    if (status === 'completed') return 'Completed';
    if (status === 'urgent') return `Urgent - ${daysLeft} days left`;
    return `${daysLeft} days left`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="/ngo india logo.png" alt="NGO INDIA Logo" className="w-56 h-32 rounded-lg cursor-pointer mt-4" onClick={() => window.location.href = '/'} />
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fundraising Campaigns</h1>
          <p className="text-xl text-gray-600 mb-8">Support our ongoing campaigns and help us create lasting impact in communities across India. Every contribution brings us closer to our goals.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/campaigns/create'}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Start Your Campaign
            </button>
            <button
              onClick={() => window.location.href = '/donate'}
              className="border border-orange-500 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Make General Donation
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                     {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeCampaigns.length}</div>
            <div className="text-gray-600">Total Campaigns</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">₹{activeCampaigns.reduce((sum, c) => sum + c.raised, 0).toLocaleString()}</div>
            <div className="text-gray-600">Total Raised</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalDonors || activeCampaigns.reduce((sum, c) => sum + c.donors, 0)}</div>
            <div className="text-gray-600">Total Donors</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeCampaigns || activeCampaigns.filter(c => c.status === 'active').length}</div>
            <div className="text-gray-600">Active Campaigns</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => {
            const progressPercentage = getProgressPercentage(campaign.raised, campaign.goal);
            const fallbackImage = getCategoryImage(campaign.category);
            
            return (
              <div key={campaign.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={campaign.image || fallbackImage} 
                    alt={campaign.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(campaign.status)}`}>
                    {getStatusText(campaign.status, campaign.daysLeft)}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>₹{campaign.raised.toLocaleString()} raised</span>
                      <span>₹{campaign.goal.toLocaleString()} goal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-lg font-bold text-orange-600">{Math.round(progressPercentage)}%</span>
                      <span className="text-gray-500 text-sm ml-1">completed</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{campaign.donors} donors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Completed'}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.location.href = `/campaigns/${campaign.id}`}
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      {campaign.status === 'completed' ? 'View Results' : 'Donate Now'}
                    </button>
                    <button
                      onClick={() => window.location.href = `/campaigns/${campaign.id}`}
                      className="border border-orange-500 text-orange-600 py-2 px-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {!loading && filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

    </div>
  );
}