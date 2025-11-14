import React from 'react';
import { 
  Home, Users, DollarSign, FolderOpen, Network, 
  UserCheck, FileText, Settings, LogOut, Bell,
  ChevronRight, Heart, Shield, BookOpen,
  IndianRupee, TrendingUp, Scale, FileCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ActiveModule } from './Dashboard';

interface SidebarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
}

export function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  const { user, logout, updateUser } = useAuth();

  const handleProfileUpload = () => {
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
          // Update the user profile image in auth context
          updateUser({ profileImage: imageUrl });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, available: true },
      { id: 'beneficiaryImpact', label: 'Beneficiary Impact Tracking', icon: TrendingUp, available: ['admin', 'executive'].includes(user?.role || '') },
      { id: 'fcraCompliance', label: 'FCRA Compliance', icon: Scale, available: ['admin', 'finance'].includes(user?.role || '') },
      { id: 'donors', label: 'Donor Management', icon: Users, available: ['admin', 'executive'].includes(user?.role || '') },
      { id: 'finances', label: 'Financial Tracking', icon: IndianRupee, available: ['admin', 'executive'].includes(user?.role || '') },
      { id: 'projects', label: 'Project Monitoring', icon: FolderOpen, available: true },
      { id: 'collaboration', label: 'Collaboration Hub', icon: Network, available: true },
      { id: 'partner-network', label: 'Partner Network', icon: Users, available: true },
      { id: 'government', label: 'Government Hub', icon: Shield, available: ['admin', 'executive'].includes(user?.role || '') },
      { id: 'compliance', label: 'Compliance & Legal', icon: Scale, available: ['admin', 'executive'].includes(user?.role || '') },
      { id: 'grant-applications', label: 'Grant Application', icon: FileCheck, available: true },
      { id: 'hr', label: 'HR Management', icon: UserCheck, available: user?.role === 'executive' },
      { id: 'reports', label: 'Reports', icon: FileText, available: ['admin', 'executive'].includes(user?.role || '') },
      { id: 'mou-templates', label: 'MOU Templates', icon: BookOpen, available: true },
      { id: 'csr', label: 'CSR Management', icon: Heart, available: true },
      { id: 'sector-networks', label: 'Sector Networks', icon: Network, available: true },
      { id: 'RegisterNGO', label: 'Register NGO', icon: Users, available: ['admin', 'executive'].includes(user?.role || '') },
      { id: 'settings', label: 'Settings', icon: Settings, available: true },
    ];

    return baseItems.filter(item => item.available);
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <img src="/ngo india logo.png" alt="NGO INDIA Logo" className="w-40 h-20 rounded-lg" />
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleProfileUpload}
            className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-orange-600 transition-colors cursor-pointer overflow-hidden"
            title="Click to upload profile picture"
          >
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : user?.name ? (
              user.name === 'NGO India' ? 'NI' : user.name.split(' ').map(n => n[0]).join('').toUpperCase()
            ) : (
              'NI'
            )}
          </button>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500">{user?.role === 'admin' && user?.position === 'Director' ? 'Administrator' : user?.position || user?.role || 'Position'}</p>
          </div>
          <Bell className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item: any) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as ActiveModule)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}