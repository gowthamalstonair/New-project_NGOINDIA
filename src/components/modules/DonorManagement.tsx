import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Filter, Mail, Phone, 
  Calendar, IndianRupee, TrendingUp, Heart,
  Star, Award, Gift, Target
} from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { useScrollReset } from '../../hooks/useScrollReset';
import { formatNumber } from '../../utils/formatNumber';

export function DonorManagement() {
  useScrollReset();
  const { donations } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Use context donations directly
  const recentDonations = donations;

  const donors = [
    {
      id: '1',
      name: 'Tata Foundation',
      email: 'contact@tatafoundation.org',
      phone: '+91 22 6665 8282',
      type: 'Corporate',
      totalDonated: 5000000,
      lastDonation: '2025-01-15',
      status: 'Active',
      tier: 'Platinum',
      projects: ['Education for All', 'Healthcare Initiative'],
      avatar: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1'
    },
    {
      id: '2',
      name: 'Infosys Foundation',
      email: 'foundation@infosys.com',
      phone: '+91 80 2852 0261',
      type: 'Corporate',
      totalDonated: 3500000,
      lastDonation: '2025-01-10',
      status: 'Active',
      tier: 'Gold',
      projects: ['Healthcare Initiative', 'Rural Development'],
      avatar: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1'
    },
    {
      id: '3',
      name: 'Azim Premji Foundation',
      email: 'info@azimpremjifoundation.org',
      phone: '+91 80 6614 4900',
      type: 'Foundation',
      totalDonated: 7500000,
      lastDonation: '2025-01-08',
      status: 'Pending',
      tier: 'Platinum',
      projects: ['Education for All', 'Rural Development'],
      avatar: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1'
    },
    {
      id: '4',
      name: 'Bharti Foundation',
      email: 'contact@bhartifoundation.org',
      phone: '+91 11 4166 6100',
      type: 'Foundation',
      totalDonated: 2800000,
      lastDonation: '2024-12-20',
      status: 'Active',
      tier: 'Silver',
      projects: ['Education for All'],
      avatar: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1'
    }
  ];

  const stats = [
    {
      label: 'Total Donations',
      value: formatNumber(recentDonations.length),
      change: '+12%',
      icon: Gift,
      color: 'text-blue-600'
    },
    {
      label: 'Completed',
      value: formatNumber(recentDonations.filter(d => d.status === 'completed').length),
      change: '+8%',
      icon: Heart,
      color: 'text-green-600'
    },
    {
      label: 'Total Amount',
      value: `₹${formatNumber(recentDonations.reduce((sum, d) => sum + d.amount, 0))}`,
      change: '+15%',
      icon: IndianRupee,
      color: 'text-orange-600'
    },
    {
      label: 'Avg. Donation',
      value: `₹${recentDonations.length > 0 ? formatNumber(recentDonations.reduce((sum, d) => sum + d.amount, 0) / recentDonations.length) : '0'}`,
      change: '+3%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-gray-800 text-white';
      case 'Gold': return 'bg-yellow-500 text-white';
      case 'Silver': return 'bg-gray-400 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDonations = recentDonations.filter(donation => {
    const matchesSearch = (donation.donor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donation.project || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || donation.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique donor names for suggestions
  const donorSuggestions = [...new Set(recentDonations.map(d => d.donor))]
    .filter(donor => donor && donor.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm.length > 0)
    .slice(0, 5);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Donor Management</h1>
            <p className="text-gray-600">Manage relationships with your supporters</p>
          </div>
          <button 
            onClick={() => {
              window.history.pushState({}, '', '/add-donation');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Donation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
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
                placeholder="Search donors..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {showSuggestions && donorSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
                  {donorSuggestions.map((donor, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(donor);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Gift className="w-4 h-4 text-orange-500" />
                        </div>
                        <span className="font-medium">{donor}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
              {recentDonations.length > 0 ? (
                filteredDonations.map((donation: any) => (
                  <div key={donation.id || Math.random()} className="flex items-center gap-6 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <Gift className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{donation.donor || 'Unknown Donor'}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${donation.type === 'recurring' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {donation.type || 'one-time'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(donation.status || 'pending')}`}>
                          {donation.status || 'pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Date: {new Date(donation.date || Date.now()).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          Type: Individual
                        </div>
                        {donation.project && (
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            Purpose: {donation.project}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Amount: </span>
                          <span className="font-semibold text-gray-900 text-lg">₹{parseFloat(donation.amount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Mail className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {
                          window.history.pushState({}, '', `/donor-details?id=${donation.id || Math.random()}`);
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No donations found</p>
                  <button 
                    onClick={() => {
                      window.history.pushState({}, '', '/add-donation');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add First Donation
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Donor Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Top Donors</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentDonations
                .sort((a, b) => (b.amount || 0) - (a.amount || 0))
                .slice(0, 3)
                .map((donation, index) => (
                <div key={donation.id || index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{donation.donor || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-600">₹{formatNumber(donation.amount || 0)} donated</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500 text-white">
                        Individual
                      </span>
                      <span className="text-xs text-gray-500">{donation.type || 'one-time'}</span>
                    </div>
                  </div>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Donation Trends</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ₹{formatNumber(recentDonations.reduce((sum, d) => sum + (d.amount || 0), 0))}
                </div>
                <p className="text-gray-600">Total Donations This Year</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Corporate Donors</span>
                  <span className="font-semibold">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Foundation Donors</span>
                  <span className="font-semibold">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}