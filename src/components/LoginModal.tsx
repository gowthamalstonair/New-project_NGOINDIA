import React, { useState } from 'react';
import {
  X, ChevronRight, ArrowLeft, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Captcha } from './Captcha';
import { motion, AnimatePresence } from 'framer-motion';
 
interface LoginModalProps {
  onClose: () => void;
}
 
const roles = [
  { name: 'Director', color: 'from-orange-500 to-orange-600', dashboard: '/' },
  { name: 'Executive', color: 'from-orange-400 to-orange-500', dashboard: '/executive-dashboard' },
  { name: 'Employee', color: 'from-orange-300 to-orange-400', dashboard: '/employee-dashboard' },
  { name: 'Admin', color: 'from-orange-600 to-orange-700', dashboard: '/admin-dashboard' },
];
 
export function LoginModal({ onClose }: LoginModalProps) {
  const [step, setStep] = useState<'select' | 'login'>('select');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const { login, isLoading } = useAuth();
 
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep('login');
  };
 
  const handleBack = () => {
    setStep('select');
    setSelectedRole(null);
    setError('');
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
 
    if (!captchaValid) {
      setError('Please complete the captcha verification.');
      return;
    }
 
    if (!selectedRole) {
      setError('Please select a role first.');
      return;
    }

    const success = await login(email.trim(), password, selectedRole.toLowerCase());
    if (!success) {
      setError(`Invalid credentials for ${selectedRole} role. Please check your email and password.`);
    } else {
      // Close modal and redirect to dashboard
      onClose();
      if (selectedRole === 'Director') {
        // Director stays on main page for now
        window.location.href = '/';
      } else {
        window.location.href = roles.find(r => r.name === selectedRole)?.dashboard || '/';
      }
    }
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
 
        {/* Header */}
        <div className="text-center p-6 border-b border-gray-100">
          <img
            src="/ngo india logo.png"
            alt="NGO INDIA Logo"
            className="w-56 h-64 mx-auto mb-0 rounded-lg"
          />
          <h2 className="text-2xl font-bold text-gray-900 -mt-6">NGO INDIA Portal</h2>
          <p className="text-gray-600 text-sm">Empowering NGOs through digital innovation</p>
        </div>
 
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'select' ? (
              // 🟠 Role Selection Screen
              <motion.div
                key="role-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-6">
                  Select your Login Type
                </h3>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role.name}
                      onClick={() => handleRoleSelect(role.name)}
                      className={`flex items-center justify-between px-5 py-4 rounded-xl text-white font-semibold bg-gradient-to-r ${role.color} shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform`}
                    >
                      {role.name}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  ))}
                </div>
 
                <p className="text-center text-sm text-gray-500 mt-6">
                  Choose your respective role to continue login.
                </p>
              </motion.div>
            ) : (
              
              <motion.div
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    {selectedRole} Login
                  </span>
                </div>
 
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
 
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors pr-12 text-gray-900 placeholder-gray-500"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
 
                  <Captcha onVerify={setCaptchaValid} />
 
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
 
                  <button
                    type="submit"
                    disabled={isLoading || !captchaValid}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}