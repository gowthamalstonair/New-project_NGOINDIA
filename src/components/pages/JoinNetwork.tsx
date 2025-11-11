import React, { useState } from 'react';
import { ArrowLeft, Network } from 'lucide-react';

export function JoinNetwork() {
  const [formData, setFormData] = useState({
    ngoName: '',
    email: '',
    phone: '',
    location: '',
    focusArea: '',
    description: '',
    website: '',
    members: '',
    projects: '',
    logo: ''
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, logo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Try to save to backend first
      const response = await fetch('http://localhost/NGO-India/backend/add_network_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.ngoName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          focus_area: formData.focusArea,
          description: formData.description,
          website: formData.website,
          members: parseInt(formData.members) || 100,
          projects: parseInt(formData.projects) || 5,
          logo: formData.logo
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Successfully joined the network and saved to database!');
      } else {
        console.log('Backend failed, using local storage:', result.message);
      }
    } catch (error) {
      console.error('Backend error, using local storage:', error);
    }
    
    // Always save to localStorage as fallback
    const existingNetworks = JSON.parse(localStorage.getItem('partnerNGOs') || '[]');
    const newNetwork = {
      id: Date.now().toString(),
      name: formData.ngoName,
      location: formData.location,
      focus: formData.focusArea,
      rating: 4.5,
      members: parseInt(formData.members) || 100,
      projects: parseInt(formData.projects) || 5,
      description: formData.description,
      avatar: formData.logo || 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
      verified: false,
      whatsapp: formData.phone
    };
    
    existingNetworks.push(newNetwork);
    localStorage.setItem('partnerNGOs', JSON.stringify(existingNetworks));
    
    alert('Successfully joined the network!');
    setTimeout(() => {
      localStorage.setItem('activeModule', 'collaboration');
      window.location.href = '/';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => {
              localStorage.setItem('activeModule', 'collaboration');
              window.location.href = '/';
            }} 
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Network className="w-8 h-8 text-orange-500" />
              Join NGO Network
            </h1>
            <p className="text-gray-600">Connect with fellow NGOs and expand your impact</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-orange-900 mb-3">Network Benefits</h2>
          <ul className="text-orange-800 space-y-2 text-sm">
            <li>• Connect and collaborate with like-minded organizations</li>
            <li>• Share resources, knowledge, and best practices</li>
            <li>• Access joint funding opportunities and partnerships</li>
            <li>• Participate in collaborative projects and initiatives</li>
            <li>• Expand your reach and amplify your impact</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organization Details */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-orange-600">Organization Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NGO Name *</label>
              <input
                type="text"
                value={formData.ngoName}
                onChange={(e) => setFormData({ ...formData, ngoName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Logo</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                />
                {formData.logo && (
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.logo}
                      alt="Logo preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-200"
                    />
                    <span className="text-sm text-gray-600">Logo preview</span>
                  </div>
                )}
                <p className="text-xs text-gray-500">Upload your organization's logo (JPG, PNG, GIF)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="City, State"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area *</label>
              <select
                value={formData.focusArea}
                onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select Focus Area</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environment">Environment</option>
                <option value="Women Empowerment">Women Empowerment</option>
                <option value="Child Welfare">Child Welfare</option>
                <option value="Rural Development">Rural Development</option>
                <option value="Food Security">Food Security</option>
                <option value="Disaster Relief">Disaster Relief</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="https://www.example.org"
              />
            </div>

            {/* Organization Stats */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-orange-600">Organization Stats</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Members</label>
              <input
                type="number"
                value={formData.members}
                onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="100"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Active Projects</label>
              <input
                type="number"
                value={formData.projects}
                onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                placeholder="5"
                min="0"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500"
                rows={4}
                placeholder="Brief description of your organization's mission and activities"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => {
                localStorage.setItem('activeModule', 'collaboration');
                window.location.href = '/';
              }} 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2">
              <Network className="w-5 h-5" />
              Join Network
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinNetwork;