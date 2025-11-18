import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, Calendar, DollarSign, Eye, Edit, Trash2, Plus, Filter } from 'lucide-react';
import { getCampaigns, getStats, Campaign } from '../../utils/campaignData';

export function FundraisingModule() {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'analytics'>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalRaised: 0,
    totalGoal: 0,
    totalDonors: 0,
    activeCampaigns: 0,
    completedCampaigns: 0,
    averageProgress: 0
  });

  useEffect(() => {
    // Load campaigns and stats
    const loadedCampaigns = getCampaigns();
    const loadedStats = getStats();
    setCampaigns(loadedCampaigns);
    setStats(loadedStats);
  }, []);

  // Keep original mock data as fallback
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      title: 'Education for 1000 Children',
      description: 'Providing quality education and school supplies to underprivileged children.',
      goal: 100000,
      raised: 85000,
      donors: 156,
      daysLeft: 5,
      status: 'active',
      category: 'education',
      createdDate: '2024-12-01',
      image: 'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg'
    },
    {
      id: '2',
      title: 'Clean Water for Villages',
      description: 'Installing water purification systems in remote villages.',
      goal: 75000,
      raised: 75000,
      donors: 89,
      daysLeft: 0,
      status: 'completed',
      category: 'water',
      createdDate: '2024-11-01',
      image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg'
    },
    {
      id: '3',
      title: 'Emergency Medical Equipment',
      description: 'Purchasing essential medical equipment for rural health centers.',
      goal: 50000,
      raised: 30000,
      donors: 67,
      daysLeft: 15,
      status: 'active',
      category: 'healthcare',
      createdDate: '2024-12-15',
      image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg'
    },
    {
      id: '4',
      title: 'Food Relief Program',
      description: 'Providing nutritious meals to families affected by disasters.',
      goal: 25000,
      raised: 10000,
      donors: 34,
      daysLeft: 8,
      status: 'active',
      category: 'food',
      createdDate: '2025-01-01',
      image: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg'
    }
  ];

  // Use loaded campaigns or fallback to mock data
  const activeCampaigns = campaigns.length > 0 ? campaigns : mockCampaigns;

  // Analytics data
  const monthlyData = [
    { month: 'Aug', raised: 45000, donors: 89 },
    { month: 'Sep', raised: 52000, donors: 102 },
    { month: 'Oct', raised: 48000, donors: 95 },
    { month: 'Nov', raised: 65000, donors: 134 },
    { month: 'Dec', raised: 78000, donors: 156 },
    { month: 'Jan', raised: 85000, donors: 178 }
  ];

  const categoryData = [
    { name: 'Education', value: 35, color: '#f97316' },
    { name: 'Healthcare', value: 25, color: '#3b82f6' },
    { name: 'Water', value: 20, color: '#10b981' },
    { name: 'Food Relief', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 5, color: '#8b5cf6' }
  ];

  const campaignPerformanceData = activeCampaigns.map(campaign => ({
    name: campaign.title.substring(0, 20) + '...',
    progress: Math.round((campaign.raised / campaign.goal) * 100),
    raised: campaign.raised,
    goal: campaign.goal
  }));

  const filteredCampaigns = activeCampaigns.filter(campaign => 
    filterStatus === 'all' || campaign.status === filterStatus
  );

  // Use loaded stats or calculate from campaigns
  const totalStats = campaigns.length > 0 ? stats : {
    totalRaised: activeCampaigns.reduce((sum, c) => sum + c.raised, 0),
    totalGoal: activeCampaigns.reduce((sum, c) => sum + c.goal, 0),
    totalDonors: activeCampaigns.reduce((sum, c) => sum + c.donors, 0),
    activeCampaigns: activeCampaigns.filter(c => c.status === 'active').length,
    completedCampaigns: activeCampaigns.filter(c => c.status === 'completed').length,
    averageProgress: Math.round(activeCampaigns.reduce((sum, c) => sum + (c.raised / c.goal * 100), 0) / activeCampaigns.length)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCategoryImage = (category: string) => {
    const images = {
      education: 'https://picsum.photos/100/100?random=1',
      water: 'https://picsum.photos/100/100?random=2',
      healthcare: 'https://picsum.photos/100/100?random=3',
      food: 'https://picsum.photos/100/100?random=4',
      skills: 'https://picsum.photos/100/100?random=5',
      empowerment: 'https://picsum.photos/100/100?random=6'
    };
    return images[category as keyof typeof images] || 'https://picsum.photos/100/100?random=7';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fundraising Management</h1>
          <p className="text-gray-600 mt-2">Manage campaigns and track fundraising performance</p>
        </div>
        <button
          onClick={() => window.location.href = '/campaigns/create'}
          className="mt-4 sm:mt-0 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: TrendingUp },
            { id: 'campaigns', name: 'Campaigns', icon: Target },
            { id: 'analytics', name: 'Analytics', icon: BarChart }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Raised</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalStats.totalRaised.toLocaleString()}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-green-600 font-medium">
                    {Math.round((totalStats.totalRaised / totalStats.totalGoal) * 100)}%
                  </span>
                  <span className="text-gray-600 ml-2">of total goal</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStats.totalDonors}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-blue-600 font-medium">+12%</span>
                  <span className="text-gray-600 ml-2">from last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStats.activeCampaigns}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <span className="text-green-600 font-medium">{totalStats.completedCampaigns}</span>
                  <span className="text-gray-600 ml-2">completed</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStats.averageProgress}%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${totalStats.averageProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Campaigns</h2>
            <div className="space-y-4">
              {activeCampaigns.slice(0, 3).map((campaign) => {
                const progress = Math.round((campaign.raised / campaign.goal) * 100);
                return (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center flex-1">
                      <img 
                        className="h-12 w-12 rounded-lg mr-4 object-cover" 
                        src={campaign.image} 
                        alt={campaign.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/48x48/f97316/ffffff?text=' + campaign.category.charAt(0).toUpperCase();
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>₹{campaign.raised.toLocaleString()} / ₹{campaign.goal.toLocaleString()}</span>
                          <span>{campaign.donors} donors</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600">{progress}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(progress)}`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Filter */}
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Campaigns</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Campaigns Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Raised / Goal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => {
                    const progress = Math.round((campaign.raised / campaign.goal) * 100);
                    return (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              className="h-10 w-10 rounded-full mr-3 object-cover" 
                              src={campaign.image} 
                              alt={campaign.title}
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/40x40/f97316/ffffff?text=' + campaign.category.charAt(0).toUpperCase();
                              }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                              <div className="text-sm text-gray-500">{campaign.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className={`h-2 rounded-full ${getProgressColor(progress)}`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{campaign.raised.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">₹{campaign.goal.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {campaign.donors}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Monthly Fundraising Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Fundraising Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'raised' ? `₹${value.toLocaleString()}` : value,
                      name === 'raised' ? 'Amount Raised' : 'Donors'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="raised" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Campaign Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Performance</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value}%`,
                        'Progress'
                      ]}
                    />
                    <Bar 
                      dataKey="progress" 
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Fundraising by Category</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Donor Growth */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Donor Growth</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Donors']} />
                  <Bar 
                    dataKey="donors" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}