import React, { useState, useEffect } from 'react';
import { 
  Network, Plus, Search, Filter, Mail, Phone, 
  MapPin, Globe, Building, Users, Star, Edit, Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollReset } from '../../hooks/useScrollReset';
import { formatNumber } from '../../utils/formatNumber';
import { Partner } from '../../types/partner';
import { PartnerRecommendation } from './PartnerRecommendation';

export function PartnerNetwork() {
  useScrollReset();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Mumbai Community Foundation',
      level: 'local',
      location: {
        address: 'Bandra West, Mumbai',
        country: 'India',
        region: 'Maharashtra'
      },
      contact: {
        email: 'contact@mumbaicommunityfoundation.org',
        phone: '+91 22 2640 1234'
      },
      description: 'Supporting local communities in Mumbai through education and healthcare initiatives.',
      website: 'www.mumbaicommunityfoundation.org',
      established: '2018',
      status: 'active',
      projects: ['Education for All', 'Healthcare Initiative']
    },
    {
      id: '2',
      name: 'Western India Development Alliance',
      level: 'regional',
      location: {
        address: 'Pune, Maharashtra',
        country: 'India',
        region: 'Western India'
      },
      contact: {
        email: 'info@wida.org',
        phone: '+91 20 2567 8901'
      },
      description: 'Regional partnership focusing on sustainable development across Western India.',
      website: 'www.wida.org',
      established: '2015',
      status: 'active',
      projects: ['Rural Development', 'Water Conservation']
    },
    {
      id: '3',
      name: 'National Education Alliance',
      level: 'national',
      location: {
        address: 'New Delhi',
        country: 'India',
        region: 'National'
      },
      contact: {
        email: 'partnerships@nea.gov.in',
        phone: '+91 11 2301 4567'
      },
      description: 'National-level partnership for educational reform and development.',
      website: 'www.nea.gov.in',
      established: '2012',
      status: 'active',
      projects: ['Education for All', 'Digital Literacy']
    }
  ]);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/get_partners_api.php');
      const data = await response.json();
      if (data.success) {
        const existingPartners = partners.slice(0, 3); // Keep first 3 mock partners
        setPartners([...existingPartners, ...data.partners]);
      }
    } catch (error) {
      console.error('Failed to load partners:', error);
    }
  };

  const stats = [
    {
      label: 'Total Partners',
      value: formatNumber(partners.length),
      change: '+12%',
      icon: Network,
      color: 'text-blue-600'
    },
    {
      label: 'Active Partnerships',
      value: formatNumber(partners.filter(p => p.status === 'active').length),
      change: '+8%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: 'International',
      value: formatNumber(partners.filter(p => p.level === 'international').length),
      change: '+25%',
      icon: Globe,
      color: 'text-purple-600'
    },
    {
      label: 'Joint Projects',
      value: formatNumber(partners.reduce((sum, p) => sum + (p.projects?.length || 0), 0)),
      change: '+15%',
      icon: Building,
      color: 'text-orange-600'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'local': return 'bg-blue-100 text-blue-800';
      case 'regional': return 'bg-green-100 text-green-800';
      case 'national': return 'bg-purple-100 text-purple-800';
      case 'international': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.location?.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || partner.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleCreatePartner = async (partnerData: Omit<Partner, 'id'>) => {
    try {
      const response = await fetch('http://localhost/NGO-India/backend/add_partner_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerData),
      });
      const result = await response.json();
      if (result.success) {
        loadPartners();
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Failed to create partner:', error);
      const newPartner: Partner = {
        ...partnerData,
        id: Date.now().toString()
      };
      setPartners([...partners, newPartner]);
      setShowCreateForm(false);
    }
  };

  const handleUpdatePartner = (partner: Partner | Omit<Partner, 'id'>) => {
    if ('id' in partner) {
      setPartners(partners.map(p => p.id === partner.id ? partner as Partner : p));
    }
    setEditingPartner(null);
  };

  const handleDeletePartner = (id: string) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      setPartners(partners.filter(p => p.id !== id));
    }
  };

  if (showCreateForm || editingPartner) {
    return (
      <PartnerForm
        partner={editingPartner}
        onSave={editingPartner ? handleUpdatePartner : handleCreatePartner}
        onCancel={() => {
          setShowCreateForm(false);
          setEditingPartner(null);
        }}
      />
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Network</h1>
            <p className="text-gray-600">Manage partnerships and collaborations</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              AI Recommendations
            </button>
            {(user?.role === 'admin' || user?.role === 'executive') && (
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Partner
              </button>
            )}
          </div>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="local">Local</option>
              <option value="regional">Regional</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>
        </div>
      </div>

      {showRecommendations && (
        <div className="mb-8">
          <PartnerRecommendation 
            partners={partners}
            currentProjects={['Education for All', 'Healthcare Initiative', 'Rural Development']}
            onPartnerSelect={(partner) => {
              console.log('Selected partner:', partner);
              setShowRecommendations(false);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Partners ({filteredPartners.length})</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <div key={partner.id} className="flex items-center gap-6 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <Network className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(partner.level)}`}>
                        {partner.level}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(partner.status)}`}>
                        {partner.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{partner.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {partner.location?.region}, {partner.location?.country}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        Est. {partner.established}
                      </div>
                      {partner.projects && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {partner.projects.length} projects
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    {(user?.role === 'admin' || user?.role === 'executive') && (
                      <>
                        <button 
                          onClick={() => setEditingPartner(partner)}
                          className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeletePartner(partner.id)}
                          className="p-2 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No partners found</p>
                {(user?.role === 'admin' || user?.role === 'executive') && (
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Add First Partner
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PartnerFormProps {
  partner?: Partner | null;
  onSave: (partner: Partner | Omit<Partner, 'id'>) => void;
  onCancel: () => void;
}

function PartnerForm({ partner, onSave, onCancel }: PartnerFormProps) {
  const [formData, setFormData] = useState<Omit<Partner, 'id'>>(
    partner ? {
      name: partner.name,
      level: partner.level,
      location: partner.location,
      contact: partner.contact,
      description: partner.description,
      website: partner.website,
      established: partner.established,
      status: partner.status,
      projects: partner.projects
    } : {
      name: '',
      level: 'local',
      location: {
        address: '',
        country: 'India',
        region: ''
      },
      contact: {
        email: '',
        phone: ''
      },
      description: '',
      website: '',
      established: '',
      status: 'pending',
      projects: []
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (partner) {
      onSave({ ...formData, id: partner.id });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {partner ? 'Edit Partner' : 'Add New Partner'}
        </h1>
        <p className="text-gray-600">Fill in the partner details below</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Partner Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Level</label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as Partner['level'] })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="local">Local</option>
              <option value="regional">Regional</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.contact?.email}
              onChange={(e) => setFormData({ 
                ...formData, 
                contact: { ...formData.contact!, email: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.contact?.phone}
              onChange={(e) => setFormData({ 
                ...formData, 
                contact: { ...formData.contact!, phone: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={formData.location?.address}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { ...formData.location!, address: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <input
              type="text"
              value={formData.location?.region}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { ...formData.location!, region: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
            <input
              type="text"
              value={formData.established}
              onChange={(e) => setFormData({ ...formData, established: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            {partner ? 'Update Partner' : 'Add Partner'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}