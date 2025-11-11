import React, { useState } from 'react';
import { ArrowLeft, Upload, Target, Calendar, FileText, Image, DollarSign, Users } from 'lucide-react';

export function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullStory: '',
    goal: '',
    category: 'education',
    endDate: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    images: [] as File[],
    documents: [] as File[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'education', name: 'Education' },
    { id: 'healthcare', name: 'Healthcare'},
    { id: 'water', name: 'Clean Water'},
    { id: 'food', name: 'Food Relief'},
    { id: 'skills', name: 'Skills Training' },
    { id: 'empowerment', name: 'Women Empowerment' },
    { id: 'environment', name: 'Environment' },
    { id: 'emergency', name: 'Emergency Relief' }
  ];

  const handleInputChange = (field: string, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (files: FileList | null, type: 'images' | 'documents') => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({ 
        ...prev, 
        [type]: [...prev[type], ...fileArray] 
      }));
    }
  };

  const removeFile = (index: number, type: 'images' | 'documents') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Campaign title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Short description is required';
    }

    if (!formData.fullStory.trim()) {
      newErrors.fullStory = 'Full campaign story is required';
    }

    if (!formData.goal.trim()) {
      newErrors.goal = 'Funding goal is required';
    } else if (isNaN(Number(formData.goal)) || Number(formData.goal) <= 0) {
      newErrors.goal = 'Please enter a valid goal amount';
    } else if (Number(formData.goal) < 1000) {
      newErrors.goal = 'Minimum goal amount is ₹1,000';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Campaign end date is required';
    } else {
      const endDate = new Date(formData.endDate);
      const today = new Date();
      if (endDate <= today) {
        newErrors.endDate = 'End date must be in the future';
      }
    }

    if (!formData.organizerName.trim()) {
      newErrors.organizerName = 'Organizer name is required';
    }

    if (!formData.organizerEmail.trim()) {
      newErrors.organizerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.organizerEmail)) {
      newErrors.organizerEmail = 'Please enter a valid email address';
    }

    if (!formData.organizerPhone.trim()) {
      newErrors.organizerPhone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Save campaign to backend
      const response = await fetch('http://localhost/NGO-India/backend/add_campaign_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fullStory: formData.fullStory,
          goal: Number(formData.goal),
          category: formData.category,
          endDate: formData.endDate,
          organizerName: formData.organizerName,
          organizerEmail: formData.organizerEmail,
          organizerPhone: formData.organizerPhone
        })
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create campaign');
      }
      
      alert('Campaign created successfully! It will be reviewed and published within 24 hours.');
      window.location.href = '/campaigns';
    } catch (error) {
      console.error('Campaign creation error:', error);
      alert((error as Error).message || 'Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/ngo india logo.png" alt="NGO INDIA Logo" className="w-10 h-10 rounded-lg" />
            </div>
            <button
              onClick={() => window.location.href = '/campaigns'}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Campaigns
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create Your Campaign</h1>
          <p className="text-xl text-gray-600">Start a fundraising campaign to make a difference</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4 inline mr-2" />
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.title ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Enter a compelling campaign title"
                    maxLength={100}
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Short Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Brief description of your campaign (will appear on campaign cards)"
                    maxLength={200}
                  />
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Full Campaign Story *
                  </label>
                  <textarea
                    value={formData.fullStory}
                    onChange={(e) => handleInputChange('fullStory', e.target.value)}
                    rows={8}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.fullStory ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Tell the complete story of your campaign. Explain the problem, your solution, and how donations will be used."
                  />
                  {errors.fullStory && <p className="text-red-600 text-sm mt-1">{errors.fullStory}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Funding Goal (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.goal}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.goal ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      } focus:ring-2 focus:border-transparent`}
                      placeholder="Enter funding goal"
                      min="1000"
                    />
                    {errors.goal && <p className="text-red-600 text-sm mt-1">{errors.goal}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Campaign End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.endDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      } focus:ring-2 focus:border-transparent`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

            {/* Media Upload */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Media</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Image className="w-4 h-4 inline mr-2" />
                    Campaign Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'images')}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index, 'images')}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Supporting Documents (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e.target.files, 'documents')}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload supporting documents</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC files up to 10MB each</p>
                    </label>
                  </div>
                  
                  {formData.documents.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
                      <div className="space-y-2">
                        {formData.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index, 'documents')}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Organizer Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Organizer Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.organizerName}
                    onChange={(e) => handleInputChange('organizerName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.organizerName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Enter your full name"
                  />
                  {errors.organizerName && <p className="text-red-600 text-sm mt-1">{errors.organizerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.organizerEmail}
                    onChange={(e) => handleInputChange('organizerEmail', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.organizerEmail ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Enter your email address"
                  />
                  {errors.organizerEmail && <p className="text-red-600 text-sm mt-1">{errors.organizerEmail}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.organizerPhone}
                    onChange={(e) => handleInputChange('organizerPhone', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.organizerPhone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Enter your phone number"
                  />
                  {errors.organizerPhone && <p className="text-red-600 text-sm mt-1">{errors.organizerPhone}</p>}
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="border-t border-gray-200 pt-8">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Review Process</h3>
                <p className="text-blue-800 text-sm">
                  All campaigns are reviewed by our team before going live. This process typically takes 24-48 hours. 
                  We'll notify you via email once your campaign is approved and published.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = '/campaigns'}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}