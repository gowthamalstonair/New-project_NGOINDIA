import React, { useState } from 'react';
import { Heart, Shield, Users, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'executive' | 'employee' | 'director'>('admin');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email.trim(), password, selectedRole);
    if (!success) {
      setError('Invalid email, password, or role combination. Please check your credentials.');
    }
  };

  const demoAccounts = [
    { role: 'admin', email: 'admin@ngoindia.org', name: 'NGO India - Administrator' },
    { role: 'executive', email: 'executive@ngoindia.org', name: 'NGO India - Executive Director' },
    { role: 'employee', email: 'employee@ngoindia.org', name: 'NGO India - Employee' },
    { role: 'director', email: 'director@ngoindia.org', name: 'NGO India - Director' }
  ];

  const handleDemoLogin = (demoEmail: string, demoPassword: string = 'ngoindia123') => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/ngo india logo.png" alt="NGO INDIA Logo" className="w-16 h-16 rounded-lg" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Impact Portal</h1>
          <p className="text-gray-600">Empowering communities through transparency and collaboration</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Demo Accounts</h3>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(account.email)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {account.role === 'admin' && <Users className="w-4 h-4 text-blue-600" />}
                      {account.role === 'executive' && <Shield className="w-4 h-4 text-blue-600" />}
                      {account.role === 'employee' && <Heart className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{account.name}</div>
                      <div className="text-xs text-gray-400">Click to login</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 NGO Impact Portal. All rights reserved.</p>
          <p className="mt-2">Secure • Transparent • Collaborative</p>
        </div>
      </div>
    </div>
  );
}