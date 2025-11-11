import React, { useState } from 'react';
import { 
  Heart, User, Mail, Lock, Phone, MapPin, 
  Shield, Users, Briefcase, ArrowLeft, 
  CheckCircle, Award, Target, Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function JoinPage() {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'executive' | 'employee'>('admin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    organization: '',
    experience: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (selectedRole === 'executive' && !formData.organization.trim()) {
      newErrors.organization = 'Organization is required for executive role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        phone: formData.phone,
        address: formData.address,
        organization: formData.organization,
        experience: formData.experience
      });

      if (success) {
        setIsSuccess(true);
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const roleOptions = [
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Lead programs, track donations, and monitor projects',
      icon: Users,
      color: 'text-blue-600',
      benefits: ['Access to donor management', 'Financial tracking tools', 'Project monitoring dashboard']
    },
    {
      id: 'executive',
      title: 'Executive Director',
      description: 'Executive oversight, strategic planning, and organizational management',
      icon: Shield,
      color: 'text-purple-600',
      benefits: ['Full administrative access', 'Strategic analytics', 'HR management tools']
    },
    {
      id: 'employee',
      title: 'Employee',
      description: 'Operations, task management, and community engagement',
      icon: Briefcase,
      color: 'text-green-600',
      benefits: ['Task management system', 'Training modules', 'Performance tracking']
    }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
          <div className="text-center">
            <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to NGO INDIA!</h1>
            <p className="text-xl text-gray-600 mb-8">
              Your account has been created successfully. You can now access your dashboard and start making a difference.
            </p>
            
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 font-medium">Complete your profile</p>
                </div>
                <div className="text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 font-medium">Explore your dashboard</p>
                </div>
                <div className="text-center">
                  <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 font-medium">Start making impact</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center"
              >
                Access Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center"
              >
                <Home className="w-5 h-5" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-start gap-3">
              <img src="/ngo india logo.png" alt="NGO INDIA Logo" className="w-40 h-32 rounded-lg mt-4" />
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-orange-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Heart className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Mission</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Become part of a community dedicated to creating positive change across India. 
            Choose your role and start making a difference today.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          {/* Role Selection */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Choose Your Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id as any)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedRole === role.id
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`p-3 rounded-lg w-fit mb-4 ${
                      selectedRole === role.id ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        selectedRole === role.id ? 'text-orange-600' : role.color
                      }`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                    <div className="space-y-2">
                      {role.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-gray-600">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Registration Form */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Create Your Account</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Create a password"
                  />
                  {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    } focus:ring-2 focus:border-transparent`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                {selectedRole === 'executive' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Organization *
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                        errors.organization ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      } focus:ring-2 focus:border-transparent`}
                      placeholder="Your organization name"
                    />
                    {errors.organization && <p className="text-red-600 text-sm mt-1">{errors.organization}</p>}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    errors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                  } focus:ring-2 focus:border-transparent`}
                  placeholder="Enter your complete address"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience & Skills (Optional)
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Tell us about your relevant experience, skills, and what motivates you to join our mission..."
                />
              </div>

              {errors.submit && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isLoading ? 'Creating Account...' : 'Join NGO INDIA'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">NGO INDIA</h3>
                <p className="text-sm text-gray-400">Community Platform</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-400">
                © 2025 NGO INDIA. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}