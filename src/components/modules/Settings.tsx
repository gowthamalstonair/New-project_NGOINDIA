import React, { useState, ChangeEvent } from 'react';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Palette, 
  Globe, Database, Mail, Phone, MapPin, Save,
  Eye, EyeOff, Camera, Upload, Download, Trash2,
  Key, Lock, Smartphone, Monitor, Moon, Sun,
  ChevronRight, Check, ExternalLink, HelpCircle,
  CreditCard, Users, FileText, Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollReset } from '../../hooks/useScrollReset';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  organization: string;
  position: string;
  bio: string;
  website: string;
  linkedin: string;
  twitter: string;
  profileImage: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactor: boolean;
  backupCodes: string[];
}

interface OrganizationData {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  registrationNumber: string;
  taxId: string;
  founded: string;
  teamSize: string;
  focusAreas: string[];
}

interface Notifications {
  email: boolean;
  push: boolean;
  sms: boolean;
  donations: boolean;
  projects: boolean;
  reports: boolean;
  marketing: boolean;
  security: boolean;
}

interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function Settings() {
  useScrollReset();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [notifications, setNotifications] = useState<Notifications>({
    email: true,
    push: true,
    sms: false,
    donations: true,
    projects: true,
    reports: false,
    marketing: false,
    security: true
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    organization: user?.organization || '',
    position: user?.position || '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    profileImage: user?.profileImage || ''
  });

  // Load profile and security data from backend and sync with user changes
  React.useEffect(() => {
    const loadProfileData = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost/NGO-India/backend/get_profile_settings.php?user_id=${user.id}`);
          const result = await response.json();
          
          if (result.success && result.profile) {
            const profile = result.profile;
            setProfileData({
              name: profile.name || user.name || '',
              email: profile.email || user.email || '',
              phone: profile.phone || user.phone || '',
              address: profile.address || user.address || '',
              organization: profile.organization || user.organization || '',
              position: profile.position || user.position || '',
              bio: profile.bio || '',
              website: profile.website || '',
              linkedin: profile.linkedin || '',
              twitter: profile.twitter || '',
              profileImage: profile.profile_image || user.profileImage || ''
            });
          } else {
            // Use user data if no profile settings found
            setProfileData(prev => ({
              ...prev,
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || '',
              address: user.address || '',
              organization: user.organization || '',
              position: user.position || '',
              profileImage: user.profileImage || ''
            }));
          }
        } catch (error) {
          console.error('Error loading profile data:', error);
          // Fallback to user data
          setProfileData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            organization: user.organization || '',
            position: user.position || '',
            profileImage: user.profileImage || ''
          }));
        }
      }
    };
    
    const loadSecurityData = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`http://localhost/NGO-India/backend/get_settings_password.php?user_id=${user.id}`);
          const result = await response.json();
          
          if (result.success && result.settings) {
            const settings = result.settings;
            setSecurityData(prev => ({
              ...prev,
              twoFactor: settings.two_factor_enabled || false,
              backupCodes: settings.backup_codes || ['x1y2z3', 'a4b5c6', 'd7e8f9']
            }));
          }
        } catch (error) {
          console.error('Error loading security data:', error);
        }
      }
    };
    
    loadProfileData();
    loadSecurityData();
  }, [user]);

  const [securityData, setSecurityData] = useState<SecurityData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true,
    backupCodes: ['x1y2z3', 'a4b5c6', 'd7e8f9']
  });

  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    name: 'NGO INDIA',
    tagline: 'Empowering Communities, Transforming Lives',
    description: 'Dedicated to creating sustainable change through education, healthcare, and community development programs across rural India. We believe in empowering communities to become self-reliant.',
    address: '123 Social Justice Avenue, Bengaluru, India - 560001',
    phone: '+91 8068447416',
    email: 'grants@ngoindia.org',
    website: 'https://ngoindia.org',
    registrationNumber: 'NGO/2020/001234',
    taxId: 'AAACN1234A',
    founded: '2015',
    teamSize: '50-100',
    focusAreas: ['Education', 'Healthcare', 'Women Empowerment', 'Rural Development']
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    
    if (section === 'profile') {
      // Update the auth context user data when profile is saved
      updateUser({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        organization: profileData.organization,
        position: profileData.position,
        profileImage: profileData.profileImage
      });
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log(`${section} saved`);
  };

  const handleNotificationChange = (key: keyof Notifications, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleUploadPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setProfileData({...profileData, profileImage: imageUrl});
          // Immediately update the auth context with new profile image
          updateUser({ profileImage: imageUrl });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDownloadData = () => {
    const data = {
      profile: profileData,
      organization: organizationData,
      notifications: notifications,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'account-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      // Handle account deletion logic here
    }
  };

  const handleRevokeSession = () => {
    console.log('Session revoked');
    // Handle session revocation logic here
  };

  const handleExportData = () => {
    handleDownloadData();
  };

  const NotificationToggle: React.FC<NotificationToggleProps> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
      </label>
    </div>
  );

  const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children, action }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
      {action && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {action}
        </div>
      )}
    </div>
  );

  const ProfileTabContent = () => {
    const [localProfileData, setLocalProfileData] = useState(profileData);

    const handleLocalProfileChange = (field: keyof ProfileData, value: string) => {
      setLocalProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleProfileSave = async () => {
      setIsSaving(true);
      
      try {
        // Save to backend
        const response = await fetch('http://localhost/NGO-India/backend/add_profile_settings.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.id || '1',
            name: localProfileData.name,
            email: localProfileData.email,
            phone: localProfileData.phone,
            address: localProfileData.address,
            organization: localProfileData.organization,
            position: localProfileData.position,
            bio: localProfileData.bio,
            website: localProfileData.website,
            linkedin: localProfileData.linkedin,
            twitter: localProfileData.twitter,
            profile_image: localProfileData.profileImage
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Update the main profile data state
          setProfileData(localProfileData);
          
          // Update the auth context user data
          updateUser({
            name: localProfileData.name,
            email: localProfileData.email,
            phone: localProfileData.phone,
            address: localProfileData.address,
            organization: localProfileData.organization,
            position: localProfileData.position,
            profileImage: localProfileData.profileImage
          });
          
          alert('Profile saved successfully!');
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Failed to save profile. Please check your connection.');
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                {localProfileData.profileImage ? (
                  <img 
                    src={localProfileData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
                )}
              </div>
              <button 
                onClick={handleUploadPhoto}
                className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-gray-600">{user?.role === 'admin' && user?.position === 'Director' ? 'Administrator' : user?.position || 'Position'} • {user?.organization || 'Organization'}</p>
              <p className="text-sm text-gray-500 mt-1">Member since 2021</p>
            </div>
            <button 
              onClick={handleUploadPhoto}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <SettingsSection 
              title="Personal Information"
              action={
                <button
                  onClick={handleProfileSave}
                  disabled={isSaving}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={localProfileData.name}
                    onChange={(e) => handleLocalProfileChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={localProfileData.position}
                    onChange={(e) => handleLocalProfileChange('position', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={localProfileData.email}
                    onChange={(e) => handleLocalProfileChange('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={localProfileData.phone}
                    onChange={(e) => handleLocalProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={localProfileData.bio}
                  onChange={(e) => handleLocalProfileChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Tell us about your role and experience..."
                />
              </div>
            </SettingsSection>

            <SettingsSection title="Social Links">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    value={localProfileData.linkedin}
                    onChange={(e) => handleLocalProfileChange('linkedin', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    value={localProfileData.twitter}
                    onChange={(e) => handleLocalProfileChange('twitter', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="@username"
                  />
                </div>
              </div>
            </SettingsSection>
          </div>

          {/* Account Status */}
          <div className="space-y-6">
            <SettingsSection title="Account Status">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">Email Verified</span>
                  </div>
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">Profile Complete</span>
                  </div>
                  <div className="text-xs text-blue-600 font-medium">85%</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium text-orange-800">2FA Enabled</span>
                  </div>
                  <Check className="w-4 h-4 text-orange-500" />
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Quick Actions">
              <div className="space-y-2">
                <button 
                  onClick={handleDownloadData}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Download Data</span>
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Privacy Settings</span>
                  <Shield className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => window.open('https://help.ngoindia.org', '_blank')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Get Help</span>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </SettingsSection>
          </div>
        </div>
      </div>
    );
  };

  const SecurityTabContent = () => {
    const [localSecurityData, setLocalSecurityData] = useState(securityData);
    const [localShowPassword, setLocalShowPassword] = useState(false);

    const handleLocalSecurityChange = (field: keyof SecurityData, value: string | boolean) => {
      setLocalSecurityData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handlePasswordUpdate = async () => {
      if (localSecurityData.newPassword !== localSecurityData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      if (!localSecurityData.currentPassword || !localSecurityData.newPassword) {
        alert('Please fill in all password fields');
        return;
      }
      
      setIsSaving(true);
      
      try {
        // Save to backend
        const response = await fetch('http://localhost/NGO-India/backend/add_settings_password.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.id || '1',
            current_password: localSecurityData.currentPassword,
            new_password: localSecurityData.newPassword,
            two_factor_enabled: localSecurityData.twoFactor,
            backup_codes: localSecurityData.backupCodes
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Update the main security data state
          setSecurityData(localSecurityData);
          
          // Clear password fields after successful change
          setLocalSecurityData({
            ...localSecurityData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          
          alert('Password updated successfully!');
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Failed to update password. Please check your connection.');
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        <SettingsSection 
          title="Password & Authentication"
          action={
            <button
              onClick={handlePasswordUpdate}
              disabled={isSaving}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          }
        >
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={localShowPassword ? 'text' : 'password'}
                      value={localSecurityData.currentPassword}
                      onChange={(e) => handleLocalSecurityChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setLocalShowPassword(!localShowPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {localShowPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={localSecurityData.newPassword}
                      onChange={(e) => handleLocalSecurityChange('newPassword', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={localSecurityData.confirmPassword}
                      onChange={(e) => handleLocalSecurityChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSecurityData.twoFactor}
                    onChange={(e) => handleLocalSecurityChange('twoFactor', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
              
              {localSecurityData.twoFactor && (
                <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <h5 className="font-medium text-orange-900 mb-2">Backup Codes</h5>
                  <p className="text-sm text-orange-700 mb-3">Save these codes in a secure place:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {localSecurityData.backupCodes.map((code, index) => (
                      <div key={index} className="text-center font-mono text-sm bg-white py-2 rounded border border-orange-200">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Active Sessions">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Monitor className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Current Session</p>
                  <p className="text-sm text-gray-600">Chrome on Windows • Bengaluru, India</p>
                  <p className="text-xs text-green-600 mt-1">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mobile Device</p>
                  <p className="text-sm text-gray-600">Safari on iPhone • 2 hours ago</p>
                </div>
              </div>
              <button 
                onClick={handleRevokeSession}
                className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Revoke
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>
    );
  };

  const OrganizationTabContent = () => {
    const [localOrganizationData, setLocalOrganizationData] = useState(organizationData);

    const handleLocalOrganizationChange = (field: keyof OrganizationData, value: string) => {
      setLocalOrganizationData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleOrganizationSave = async () => {
      setIsSaving(true);
      // Update the main organization data state
      setOrganizationData(localOrganizationData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSaving(false);
      console.log('Organization saved');
    };

    return (
      <div className="space-y-6">
        <SettingsSection 
          title="Organization Profile"
          action={
            <button
              onClick={handleOrganizationSave}
              disabled={isSaving}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input
                type="text"
                value={localOrganizationData.name}
                onChange={(e) => handleLocalOrganizationChange('name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
              <input
                type="text"
                value={localOrganizationData.tagline}
                onChange={(e) => handleLocalOrganizationChange('tagline', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={localOrganizationData.email}
                onChange={(e) => handleLocalOrganizationChange('email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={localOrganizationData.phone}
                onChange={(e) => handleLocalOrganizationChange('phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
              <input
                type="text"
                value={localOrganizationData.registrationNumber}
                onChange={(e) => handleLocalOrganizationChange('registrationNumber', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
              <input
                type="text"
                value={localOrganizationData.taxId}
                onChange={(e) => handleLocalOrganizationChange('taxId', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization Description</label>
            <textarea
              value={localOrganizationData.description}
              onChange={(e) => handleLocalOrganizationChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={localOrganizationData.address}
              onChange={(e) => handleLocalOrganizationChange('address', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Team & Settings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Team Members</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">24</p>
              <p className="text-sm text-gray-600 mt-1">Active members</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <FileText className="w-8 h-8 text-green-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Active Projects</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">8</p>
              <p className="text-sm text-gray-600 mt-1">Ongoing initiatives</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <Building className="w-8 h-8 text-orange-600 mb-2" />
              <h4 className="font-semibold text-gray-900">Locations</h4>
              <p className="text-2xl font-bold text-orange-600 mt-1">12</p>
              <p className="text-sm text-gray-600 mt-1">Cities across India</p>
            </div>
          </div>
        </SettingsSection>
      </div>
    );
  };

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <SettingsSection title="Notification Preferences">
        <div className="space-y-2">
          <NotificationToggle
            label="Email Notifications"
            description="Receive updates about your projects and donations via email"
            checked={notifications.email}
            onChange={(checked) => handleNotificationChange('email', checked)}
          />
          <NotificationToggle
            label="Push Notifications"
            description="Get real-time updates in your browser"
            checked={notifications.push}
            onChange={(checked) => handleNotificationChange('push', checked)}
          />
          <NotificationToggle
            label="SMS Alerts"
            description="Important alerts via text message"
            checked={notifications.sms}
            onChange={(checked) => handleNotificationChange('sms', checked)}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Content Types">
        <div className="space-y-2">
          <NotificationToggle
            label="Donation Updates"
            description="New donations and funding milestones"
            checked={notifications.donations}
            onChange={(checked) => handleNotificationChange('donations', checked)}
          />
          <NotificationToggle
            label="Project Progress"
            description="Updates on project milestones and achievements"
            checked={notifications.projects}
            onChange={(checked) => handleNotificationChange('projects', checked)}
          />
          <NotificationToggle
            label="Weekly Reports"
            description="Summary reports and analytics"
            checked={notifications.reports}
            onChange={(checked) => handleNotificationChange('reports', checked)}
          />
          <NotificationToggle
            label="Security Alerts"
            description="Important security and privacy notifications"
            checked={notifications.security}
            onChange={(checked) => handleNotificationChange('security', checked)}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Delivery Schedule">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Digest</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="daily">Daily Summary</option>
              <option value="weekly">Weekly Digest</option>
              <option value="none">No Digest</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="none">No quiet hours</option>
              <option value="10pm-7am">10:00 PM - 7:00 AM</option>
              <option value="9pm-8am">9:00 PM - 8:00 AM</option>
            </select>
          </div>
        </div>
      </SettingsSection>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <SettingsSection title="Appearance">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Theme</p>
              <p className="text-sm text-gray-600 mt-1">Choose between light and dark mode</p>
            </div>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  !isDarkMode ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'text-gray-600'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
              <option value="UTC">Coordinated Universal Time (UTC)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Data Management">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600 mt-1">Download all your account data in JSON format</p>
            </div>
            <button 
              onClick={handleExportData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-600 mt-1">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal information' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password, 2FA, and sessions' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage your preferences' },
    { id: 'organization', label: 'Organization', icon: Building, description: 'Team and company info' },
    { id: 'preferences', label: 'Preferences', icon: Palette, description: 'Theme and language' }
  ];

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
          </div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Manage your account preferences and organization settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-sm border p-4 sticky top-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
                          : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        activeTab === tab.id ? 'bg-orange-100' : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{tab.label}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tab.description}</div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        activeTab === tab.id ? 'text-orange-600' : 'text-gray-400'
                      }`} />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && <ProfileTabContent />}
            {activeTab === 'security' && <SecurityTabContent />}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'organization' && <OrganizationTabContent />}
            {activeTab === 'preferences' && renderPreferencesTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
