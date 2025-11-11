import React, { useState } from 'react';
import { ArrowLeft, Users, Crown, Star, Heart, Shield, CheckCircle, Calendar, Award, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  popular?: boolean;
  benefits: string[];
}

const membershipTiers: MembershipTier[] = [
  {
    id: 'supporter',
    name: 'Supporter Member',
    price: 500,
    duration: 'year',
    icon: Heart,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    benefits: [
      'Monthly newsletter with impact updates',
      'Invitations to public events',
      'Quarterly impact reports',
      'Digital membership certificate',
      'Access to member resources'
    ]
  },
  {
    id: 'active',
    name: 'Active Member',
    price: 2000,
    duration: 'year',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    popular: true,
    benefits: [
      'All Supporter Member benefits',
      'Priority volunteer opportunities',
      'Quarterly member meet-ups',
      'Physical membership card',
      'Member-only webinars',
      'Project visit opportunities'
    ]
  },
  {
    id: 'champion',
    name: 'Champion Member',
    price: 5000,
    duration: 'year',
    icon: Star,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    benefits: [
      'All Active Member benefits',
      'Annual recognition ceremony',
      'Direct project consultation',
      'Advisory committee participation',
      'Exclusive impact presentations',
      'Personalized thank you gifts'
    ]
  },
  {
    id: 'patron',
    name: 'Patron Member',
    price: 10000,
    duration: 'year',
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    benefits: [
      'All Champion Member benefits',
      'VIP access to all events',
      'Personal impact dashboard',
      'Direct line to leadership team',
      'Custom project naming rights',
      'Annual appreciation dinner'
    ]
  }
];

const memberStats = [
  { value: '2,500+', label: 'Total Members', icon: Users },
  { value: '450+', label: 'Active Volunteers', icon: Heart },
  { value: '85%', label: 'Member Retention', icon: TrendingUp },
  { value: '₹15L+', label: 'Member Contributions', icon: Award }
];

const memberTestimonials = [
  {
    name: 'Priya Sharma',
    role: 'Champion Member',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    quote: 'Being a member has connected me with like-minded people who share my passion for social change. The impact we create together is incredible.'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Active Member',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    quote: 'The volunteer opportunities and project visits have given me firsthand experience of the positive change we are making in communities.'
  },
  {
    name: 'Anita Desai',
    role: 'Patron Member',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    quote: 'The personalized impact reports and direct involvement in project decisions make me feel truly part of the NGO family.'
  }
];

export function MembershipPage() {
  const [selectedTier, setSelectedTier] = useState<string>('');

  const handleJoinMembership = (tierId: string) => {
    setSelectedTier(tierId);
    // Here you would typically redirect to payment or registration
    window.location.href = `/membership/join?tier=${tierId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/ngo india logo.png" alt="NGO INDIA Logo" className="w-10 h-10 rounded-lg" />
              <h1 className="text-xl font-bold text-gray-900">Membership</h1>
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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Community</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Become a member of NGO INDIA and be part of a community dedicated to creating lasting change. 
            Choose a membership tier that fits your commitment level and start making a difference today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/membership/dashboard'}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Member Login
            </button>
            <button
              onClick={() => document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-orange-500 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              View Membership Plans
            </button>
          </div>
        </div>

        {/* Member Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {memberStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Membership Benefits Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Become a Member?</h2>
            <p className="text-lg text-gray-600">Join a community of changemakers and enjoy exclusive benefits</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Community Access" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community Access</h3>
                <p className="text-gray-700">Connect with like-minded individuals and participate in exclusive member events and activities.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <img src="https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Impact Transparency" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Impact Transparency</h3>
                <p className="text-gray-700">Receive detailed reports on how your contributions are making a difference in communities.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Recognition & Rewards" className="w-full h-48 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Recognition & Rewards</h3>
                <p className="text-gray-700">Get recognized for your contributions and receive exclusive member rewards and certificates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Tiers */}
        <div id="membership-tiers" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Membership</h2>
            <p className="text-lg text-gray-600">Select the membership tier that best fits your commitment level</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative ${
                    tier.popular ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className={`${tier.bgColor} p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${tier.color}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{tier.name}</h3>
                    <div className="text-center mb-6">
                      <span className="text-3xl font-bold text-gray-900">₹{tier.price.toLocaleString()}</span>
                      <span className="text-gray-600">/{tier.duration}</span>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleJoinMembership(tier.id)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        tier.popular
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'border border-orange-500 text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      Join Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
            <p className="text-lg text-gray-600">Hear from our community members about their experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {memberTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-orange-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join our community of changemakers and be part of creating lasting impact in communities across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleJoinMembership('active')}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Join as Active Member
            </button>
            <button
              onClick={() => window.location.href = '/membership/benefits'}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}