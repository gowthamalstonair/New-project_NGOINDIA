import React, { useState } from 'react';
import { 
  Network, Users, MessageSquare, Calendar, 
  Star, Award, MapPin, ExternalLink,
  Plus, Search, Filter, Heart, Share2
} from 'lucide-react';
import { useScrollReset } from '../../hooks/useScrollReset';

export function CollaborationHub() {
  useScrollReset();
  const [activeTab, setActiveTab] = useState('network');
  const [searchTerm, setSearchTerm] = useState('');

  // Load saved networks from localStorage
  const savedNetworks = JSON.parse(localStorage.getItem('partnerNGOs') || '[]');
  
  const defaultNGOs = [
    {
      id: '1',
      name: 'Akshaya Patra Foundation',
      location: 'Bangalore, Karnataka',
      focus: 'Food Security, Education',
      rating: 4.8,
      members: 1200,
      projects: 45,
      description: 'Providing nutritious meals to school children across India',
      avatar: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      verified: true,
      whatsapp: '919876543210'
    },
    {
      id: '2',
      name: 'Pratham Education Foundation',
      location: 'Mumbai, Maharashtra',
      focus: 'Education, Literacy',
      rating: 4.9,
      members: 800,
      projects: 32,
      description: 'Improving quality of education for underprivileged children',
      avatar: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      verified: true,
      whatsapp: '919812345678'
    },
    {
      id: '3',
      name: 'Smile Foundation',
      location: 'New Delhi, Delhi',
      focus: 'Healthcare, Education',
      rating: 4.7,
      members: 950,
      projects: 28,
      description: 'Empowering underprivileged children through education and healthcare',
      avatar: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      verified: true,
      whatsapp: '919700123456'
    }
  ];
  
  const partnerNGOs = [...savedNetworks, ...defaultNGOs];

  const successStories = [
    {
      id: '1',
      title: 'Joint Clean Water Initiative',
      ngo: 'Water Aid India',
      impact: '15,000 people gained access to clean water',
      location: 'Rajasthan',
      date: '2024-12-15',
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
    },
    {
      id: '2',
      title: 'Education Technology Partnership',
      ngo: 'Teach for India',
      impact: '5,000 students received digital learning tools',
      location: 'Kerala',
      date: '2024-12-10',
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
    },
    {
      id: '3',
      title: 'Healthcare Outreach Program',
      ngo: 'Doctors Without Borders',
      impact: '3,000 people received medical care',
      location: 'West Bengal',
      date: '2024-12-05',
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1'
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'NGO Leadership Summit 2025',
      date: '2025-02-15',
      time: '10:00 AM',
      location: 'New Delhi',
      type: 'Conference',
      attendees: 150,
      organizer: 'NGO Alliance India'
    },
    {
      id: '2',
      title: 'Rural Development Workshop',
      date: '2025-02-22',
      time: '2:00 PM',
      location: 'Pune',
      type: 'Workshop',
      attendees: 80,
      organizer: 'Rural Development Network'
    },
    {
      id: '3',
      title: 'Fundraising Best Practices',
      date: '2025-03-01',
      time: '11:00 AM',
      location: 'Virtual',
      type: 'Webinar',
      attendees: 200,
      organizer: 'Fundraising India'
    }
  ];

  const resources = [
    {
      id: '1',
      title: 'Grant Application Templates',
      type: 'Template',
      downloads: 245,
      rating: 4.8,
      sharedBy: 'Tata Trusts',
      date: '2025-01-10'
    },
    {
      id: '2',
      title: 'Impact Measurement Framework',
      type: 'Guide',
      downloads: 189,
      rating: 4.9,
      sharedBy: 'Ford Foundation',
      date: '2025-01-08'
    },
    {
      id: '3',
      title: 'Volunteer Management System',
      type: 'Tool',
      downloads: 156,
      rating: 4.7,
      sharedBy: 'United Way',
      date: '2025-01-05'
    }
  ];

  const stats = [
    {
      label: 'Partner NGOs',
      value: '156',
      icon: Network,
      color: 'text-blue-600'
    },
    {
      label: 'Collaborative Projects',
      value: '42',
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: 'Resources Shared',
      value: '89',
      icon: Share2,
      color: 'text-orange-600'
    },
    {
      label: 'Success Stories',
      value: '127',
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  const openWhatsApp = (ngo: any) => {
    window.location.href = `/whatsapp-communication?ngo=${ngo.id}&name=${encodeURIComponent(ngo.name)}`;
  };

  const downloadResource = (resource: any) => {
    const pdfContent = `
${resource.title}

Type: ${resource.type}
Shared by: ${resource.sharedBy}
Date: ${resource.date}
Rating: ${resource.rating}/5
Downloads: ${resource.downloads}

Description:
This is a ${resource.type.toLowerCase()} resource shared by ${resource.sharedBy}. 
It has been downloaded ${resource.downloads} times and has a rating of ${resource.rating} out of 5.

For more information, please contact the sharing organization.

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderNetworkTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search NGOs by name, location, or focus area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partnerNGOs.map((ngo) => (
          <div key={ngo.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={ngo.avatar}
                alt={ngo.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                  {ngo.verified && (
                    <div className="bg-blue-100 p-1 rounded-full">
                      <Award className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  {ngo.location}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {ngo.rating} rating
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{ngo.description}</p>
            
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {ngo.members} members
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {ngo.projects} projects
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {ngo.focus.split(', ').map((focus: string, index: number) => (
                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {focus}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                onClick={() => openWhatsApp(ngo)}
              >
                Connect
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Collaboration Hub</h1>
            <p className="text-gray-600">Connect, collaborate, and share resources with fellow NGOs</p>
          </div>
          <button 
            onClick={() => window.location.href = '/join-network'}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Join Network
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                if (stat.label === 'Resources Shared') {
                  setActiveTab('resources');
                } else if (stat.label === 'Success Stories') {
                  setActiveTab('stories');
                }
              }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'network', label: 'Network', icon: Network },
              { id: 'stories', label: 'Success Stories', icon: Award },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'resources', label: 'Resources', icon: Share2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-orange-500 text-orange-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'network' && renderNetworkTab()}
          {activeTab === 'stories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <div key={story.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{story.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{story.impact}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {story.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {story.date}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{story.ngo}</span>
                      <button className="text-orange-500 hover:text-orange-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'events' && (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date} at {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.attendees} attendees
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.type === 'Conference' ? 'bg-blue-100 text-blue-800' :
                          event.type === 'Workshop' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {event.type}
                        </span>
                        <span className="text-sm text-gray-500">by {event.organizer}</span>
                      </div>
                    </div>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          resource.type === 'Template' ? 'bg-blue-100 text-blue-800' :
                          resource.type === 'Guide' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {resource.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {resource.rating} rating
                        </div>
                        <div>{resource.downloads} downloads</div>
                        <div>Shared by {resource.sharedBy}</div>
                      </div>
                      <div className="text-sm text-gray-500">Added on {resource.date}</div>
                    </div>
                    <button 
                      onClick={() => downloadResource(resource)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}