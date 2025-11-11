import React, { useState } from 'react';
import { 
  Heart, Shield, Users, TrendingUp, Award, 
  ArrowRight, Play, CheckCircle, Star,
  Globe, Handshake, Target, BarChart3,
  Mail, Phone, MapPin, Facebook, Twitter, Instagram
} from 'lucide-react';

import { LoginModal } from './LoginModal';
import { SignUpModal } from './SignUpModal';
import { motion } from 'framer-motion';
import { getCategoryImage } from '../utils/categoryImages';

export function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Centralized image configuration
  const IMAGES = {
    EDUCATION_CAMPAIGN: getCategoryImage('education')
  };

  const stats = [
    { value: '50,000+', label: 'Lives Impacted', icon: Heart },
    { value: '150+', label: 'Villages Reached', icon: MapPin },
    { value: '₹2.5Cr+', label: 'Funds Raised', icon: TrendingUp },
    { value: '25+', label: 'Active Projects', icon: Target }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Transparent Operations',
      description: 'Complete transparency in fund utilization and project progress with real-time tracking and detailed reporting.'
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Empowering communities through education, healthcare, and sustainable development initiatives across rural India.'
    },
    {
      icon: Handshake,
      title: 'Collaborative Network',
      description: 'Building partnerships with other NGOs, government bodies, and international organizations for greater impact.'
    },
    {
      icon: BarChart3,
      title: 'Data-Driven Approach',
      description: 'Using advanced analytics and monitoring systems to measure impact and optimize program effectiveness.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Meera Gupta',
      role: 'Village Health Officer',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      quote: 'The healthcare initiative has transformed our village. Children now have access to quality medical care and nutrition programs.'
    },
    {
      name: 'Ravi Kumar',
      role: 'School Principal',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      quote: 'The education program has increased enrollment by 300%. Our students now have access to digital learning tools and qualified teachers.'
    },
    {
      name: 'Sunita Devi',
      role: 'Women\'s Group Leader',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      quote: 'The livelihood program helped us start our own business. We now have financial independence and can support our families.'
    }
  ];

  const projects = [
    {
      title: 'Education for All',
      description: 'Providing quality education to underprivileged children across rural India',
      image: getCategoryImage('education'),
      progress: 75,
      beneficiaries: '5,000+ children',
      location: 'Rajasthan, UP, Bihar'
    },
    {
      title: 'Healthcare Initiative',
      description: 'Mobile healthcare units serving remote communities with essential medical services',
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      progress: 60,
      beneficiaries: '15,000+ people',
      location: 'Maharashtra, Karnataka'
    },
    {
      title: 'Women Empowerment',
      description: 'Skill development and microfinance programs for rural women entrepreneurs',
      image: 'https://images.pexels.com/photos/8926553/pexels-photo-8926553.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
      progress: 85,
      beneficiaries: '2,500+ women',
      location: 'Gujarat, Madhya Pradesh'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between h-auto md:h-20 py-2 md:py-2">
            <div className="flex items-center md:justify-start gap-3 w-full md:w-auto mb-2 md:mb-0">
              <img 
                src="/ngo india logo.png" 
                alt="NGO INDIA Logo" 
                className="w-40 h-32 rounded-lg cursor-pointer mt-4" 
                onClick={() => window.location.href = '/'}
              />
            </div>
            <nav className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 w-full md:w-auto justify-center md:justify-start mb-2 md:mb-0">
              <a href="#about-ngo" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">About</a>
              <a href="#projects" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Projects</a>
              <a href="#campaigns" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Campaigns</a>
              <a href="#membership" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Membership</a>
              <a href="#impact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Impact</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Contact</a>
            </nav>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
              <motion.button 
                onClick={() => window.location.href = '/donate'}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium w-full md:w-auto flex items-center gap-2 relative overflow-visible"
                whileHover={{ scale: 1.08, boxShadow: '0 0 0 4px #fed7aa' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="relative flex items-center">
                  <Heart className="w-5 h-5 text-white z-10" />
                  {/* Sparkle effect */}
                  <motion.svg
                    className="absolute left-0 top-0 w-5 h-5 z-20 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1.2, 0.5],
                      rotate: [0, 45, 0]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: 'easeInOut'
                    }}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle cx="10" cy="2" r="1.5" fill="#fffbe6" />
                    <circle cx="17" cy="10" r="1" fill="#fffbe6" />
                    <circle cx="3" cy="15" r="0.8" fill="#fffbe6" />
                  </motion.svg>
                </span>
                Donate Now
              </motion.button>
              <button 
                onClick={() => {
                  window.history.pushState({}, '', '/join');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="border border-orange-500 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors font-medium w-full md:w-auto"
              >
                Join Us
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full md:w-auto"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Transforming Lives Through
                <span className="text-orange-500"> Compassionate Action</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join us in our mission to create lasting change in rural India through education, healthcare, 
                and sustainable development programs that empower communities and build brighter futures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.href = '/join'}
                  className="bg-orange-500 text-white px-8 py-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2 justify-center"
                >
                  Get Involved
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center gap-2 justify-center">
                  <Play className="w-5 h-5" />
                  Watch Our Story
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="/indian-republic-day-celebration.jpg"
                alt="Children in classroom"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">50,000+ Lives Impacted</p>
                    <p className="text-sm text-gray-600">Across 150+ villages</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-orange-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose NGO INDIA</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in transparency, accountability, and measurable impact. Our approach combines 
              traditional values with modern technology to create sustainable change.
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="overflow-hidden"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {feature.title === 'Community Impact' ? (
                    <>
                      <img src="https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Community Impact" className="w-full h-64 object-cover rounded-lg" />
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </>
                  ) : feature.title === 'Collaborative Network' ? (
                    <>
                      <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Collaborative Network" className="w-full h-64 object-cover rounded-lg" />
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </>
                  ) : feature.title === 'Data-Driven Approach' ? (
                    <>
                      <img src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Data-Driven Approach" className="w-full h-64 object-cover rounded-lg" />
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Transparent Operations" className="w-full h-64 object-cover rounded-lg" />
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* About NGO Section */}
      <section id="about-ngo" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 overflow-hidden">
            {/* Transparent Background Image */}
            <div className="absolute inset-0 opacity-10">
              <img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1" alt="" className="w-full h-full object-cover" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 text-white">
              <h2 className="text-4xl font-bold mb-4">About NGO INDIA</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                NGO INDIA is dedicated to transforming lives in rural India through education, healthcare, and sustainable development. Our mission is to empower communities, foster self-reliance, and create lasting change by combining traditional values with modern solutions. We believe in transparency, accountability, and measurable impact, ensuring every contribution makes a real difference.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="overflow-hidden">
              <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Our Vision" className="w-full h-64 object-cover rounded-lg" />
              <div className="mt-4">
                <h3 className="text-2xl font-semibold text-orange-600 mb-3">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To create a just, equitable, and sustainable society where every individual has access to quality education, healthcare, and opportunities for growth.
                </p>
              </div>
            </div>
            <div className="overflow-hidden">
              <img src="https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Our Mission" className="w-full h-64 object-cover rounded-lg" />
              <div className="mt-4">
                <h3 className="text-2xl font-semibold text-orange-600 mb-3">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To empower marginalized communities by providing resources, building capacity, and fostering partnerships that drive holistic development and social change.
                </p>
              </div>
            </div>
            <div className="overflow-hidden">
              <img src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Our Values" className="w-full h-64 object-cover rounded-lg" />
              <div className="mt-4">
                <h3 className="text-2xl font-semibold text-orange-600 mb-3">Our Values</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Transparency & Accountability</li>
                  <li>Inclusivity & Respect</li>
                  <li>Innovation & Collaboration</li>
                  <li>Community Empowerment</li>
                  <li>Sustainable Impact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section id="campaigns" className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Fundraising Campaigns</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Support our active campaigns and help us reach our goals to create lasting impact
            </p>
          </div>
          

          
          {/* Featured Campaign */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <img
                src={IMAGES.EDUCATION_CAMPAIGN}
                alt="Education Campaign"
                className="w-full h-64 lg:h-full object-cover"
              />
              <div className="p-8 lg:p-12">
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
                  🔥 Urgent - Only 5 days left!
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Education for 1000 Children</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Help us provide quality education and school supplies to 1000 underprivileged children across rural India. Every donation brings us closer to our goal.
                </p>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>₹85,000 raised</span>
                    <span>₹1,00,000 goal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-2xl font-bold text-orange-600">85%</span>
                    <span className="text-gray-500 text-sm ml-1">completed</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>156 donors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>5 days left</span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => window.location.href = '/campaigns/1'}
                    className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Donate Now
                  </button>
                  <button
                    onClick={() => window.location.href = '/campaigns/1'}
                    className="border border-orange-500 text-orange-600 py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Other Active Campaigns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Clean Water Project</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹75,000 / ₹75,000</span>
                <span className="text-green-600 font-medium">✓ Completed</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Medical Equipment</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹30,000 / ₹50,000</span>
                <span>15 days left</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Food Relief Program</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>₹10,000 / ₹25,000</span>
                <span className="text-red-600 font-medium">8 days left</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/campaigns'}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
            >
              View All Campaigns
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Active Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how we're making a difference across various sectors and communities through individual initiatives and collaborative joint projects with partner organizations
            </p>
          </div>
          
          {/* Joint Projects Highlight */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-orange-500 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Handshake className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-orange-600">25+</div>
                <div className="text-sm text-gray-600">Partner Organizations</div>
              </div>
              <div className="text-center">
                <div className="bg-blue-500 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">Joint Initiatives</div>
              </div>
              <div className="text-center">
                <div className="bg-green-500 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600">75K+</div>
                <div className="text-sm text-gray-600">Collective Impact</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Joint Project Coordination</h3>
              <p className="text-gray-700 mb-4">Collaborate with partner organizations to maximize impact through coordinated initiatives</p>
              <button
                onClick={() => window.location.href = '/joint-projects'}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
              >
                <Handshake className="w-5 h-5" />
                Explore Joint Projects
              </button>
            </div>
          </div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{project.beneficiaries}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Featured Joint Project */}
          <div className="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 text-white">
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium w-fit mb-4">
                  🤝 Joint Initiative
                </div>
                <h3 className="text-2xl font-bold mb-3">Rural Digital Literacy Initiative</h3>
                <p className="opacity-90 mb-4">
                  A collaborative effort with 4 partner organizations to bring digital literacy to 50 villages, reaching 15,000 beneficiaries.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <div className="font-semibold">Partners</div>
                    <div className="opacity-90">4 Organizations</div>
                  </div>
                  <div>
                    <div className="font-semibold">Budget</div>
                    <div className="opacity-90">₹25 Lakhs</div>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/joint-projects/1'}
                  className="bg-white text-orange-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  View Details
                </button>
              </div>
              <div className="relative">
                <img
                  src="kid-writes-book-classroom (1).jpg"
                  alt="Digital Literacy Training"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-900">
                  72% Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Become a member of NGO INDIA and be part of a community dedicated to creating lasting change. 
              Connect with like-minded individuals and make a greater impact together.
            </p>
          </div>
          
          {/* Membership Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">2,500+</div>
              <div className="text-gray-600">Total Members</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">450+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
              <div className="text-gray-600">Member Retention</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">₹15L+</div>
              <div className="text-gray-600">Member Contributions</div>
            </div>
          </div>
          
          {/* Membership Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="overflow-hidden text-center">
              <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Community Access" className="w-full h-64 object-cover rounded-lg" />
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community Access</h3>
                <p className="text-gray-700">Connect with like-minded individuals and participate in exclusive member events and activities.</p>
              </div>
            </div>
            
            <div className="overflow-hidden text-center">
              <img src="https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Impact Transparency" className="w-full h-64 object-cover rounded-lg" />
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Impact Transparency</h3>
                <p className="text-gray-700">Receive detailed reports on how your contributions are making a difference in communities.</p>
              </div>
            </div>
            
            <div className="overflow-hidden text-center">
              <img src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" alt="Recognition & Rewards" className="w-full h-64 object-cover rounded-lg" />
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Recognition & Rewards</h3>
                <p className="text-gray-700">Get recognized for your contributions and receive exclusive member rewards and certificates.</p>
              </div>
            </div>
          </div>
          
          {/* Featured Membership Tiers */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 text-white">
                <h3 className="text-3xl font-bold mb-4">Choose Your Membership</h3>
                <p className="text-lg opacity-90 mb-6">
                  From Supporter to Patron, find the membership tier that matches your commitment level and start making a difference today.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <div className="font-semibold">Starting From</div>
                    <div className="opacity-90">₹500/year</div>
                  </div>
                  <div>
                    <div className="font-semibold">Member Benefits</div>
                    <div className="opacity-90">Exclusive Access</div>
                  </div>
                  <div>
                    <div className="font-semibold">Community</div>
                    <div className="opacity-90">2,500+ Members</div>
                  </div>
                  <div>
                    <div className="font-semibold">Impact</div>
                    <div className="opacity-90">Direct Involvement</div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => window.location.href = '/membership'}
                    className="bg-white text-orange-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    View Membership Plans
                  </button>
                  <button
                    onClick={() => window.location.href = '/membership/dashboard'}
                    className="border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
                  >
                    Member Login
                  </button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1"
                  alt="Community Members"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-2 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">Join 2,500+ Members</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Member Testimonial */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="flex items-center gap-1 justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-xl text-gray-700 mb-6 italic max-w-3xl mx-auto">
              "Being a member has connected me with like-minded people who share my passion for social change. 
              The impact we create together is incredible."
            </p>
            <div className="flex items-center justify-center gap-4">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1"
                alt="Anita Desai"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Anita Desai</h4>
                <p className="text-sm text-orange-600">Champion Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="impact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Stories of Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from the communities and individuals whose lives have been transformed through our programs
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of supporters who are helping us create lasting change in communities across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button 
              onClick={() => window.location.href = '/donate'}
              className="bg-white text-orange-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Donate Now
            </motion.button>
            <motion.button 
              onClick={() => window.location.href = '/join'}
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Become a Volunteer
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/ngo india logo.png" 
                  alt="NGO INDIA Logo" 
                  className="w-48 h-32 rounded-lg cursor-pointer" 
                  onClick={() => window.location.href = '/'}
                />
                {/* Removed text logo, keep only image */}
              </div>
              <p className="text-gray-400 leading-relaxed">
                Dedicated to creating sustainable change through education, healthcare, and community development programs across rural India.
              </p>
            </div>
            
            <div className="flex flex-col items-start">
              <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#projects" className="text-gray-400 hover:text-white transition-colors">Our Projects</a></li>
                <li><a href="#impact" className="text-gray-400 hover:text-white transition-colors">Impact Stories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Annual Reports</a></li>
              </ul>
            </div>
            
            <div className="flex flex-col items-start">
              <h4 className="font-semibold text-lg mb-6">Get Involved</h4>
              <ul className="space-y-3">
                <li><a href="/donate" className="text-gray-400 hover:text-white transition-colors">Donate</a></li>
                <li><a href="/campaigns" className="text-gray-400 hover:text-white transition-colors">Campaigns</a></li>
                <li><a href="/joint-projects" className="text-gray-400 hover:text-white transition-colors">Joint Projects</a></li>
                <li><a href="/membership" className="text-gray-400 hover:text-white transition-colors">Membership</a></li>
                <li><a href="/recurring-donations" className="text-gray-400 hover:text-white transition-colors">Recurring Donations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Volunteer</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner with Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Corporate CSR</a></li>
              </ul>
            </div>
            
            <div className="flex flex-col items-start">
              <h4 className="font-semibold text-lg mb-6">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-400">grants@ngoindia.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <a href="/enquiry" className="text-gray-400 hover:text-white transition-colors">+91 8068447416</a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-400">MCECHS Layout KV Jayaram Road, Jakkur Rd, MCECHS Layout Phase 2, Bengaluru, Karnataka 560064</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 NGO INDIA. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* Sign Up Modal */}
    </div>
  );
}