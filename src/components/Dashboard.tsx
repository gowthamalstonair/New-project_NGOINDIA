import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { LeadershipDashboard } from './dashboards/ExecutiveDashboard';
import { EmployeeDashboard } from './dashboards/EmployeeDashboard';
import { DonorManagement } from './modules/DonorManagement';
import { FinancialTracking } from './modules/FinancialTracking';
import { ProjectMonitoring } from './modules/ProjectMonitoring';
import { CollaborationHub } from './modules/CollaborationHub';
import { GovernmentHub } from './modules/GovernmentHub';
import { HRManagement } from './modules/HRManagement';
import { Settings } from './modules/Settings';
import { Reports } from './modules/Reports';
import { BeneficiaryImpactTracking } from './modules/BeneficiaryImpactTracking';
import { FcraCompliance } from './modules/FcraCompliance';
import { ComplianceModule } from './modules/ComplianceModule';
import { useAuth } from '../contexts/AuthContext';
import RegisterNGO from './modules/RegisterNGO';
import { KnowledgeHub } from './KnowledgeHub';
import { MOUTemplates } from './modules/MOUTemplates';
import { PartnerNetwork } from './modules/PartnerNetwork';
import { GrantApplicationPage } from '../pages/GrantApplicationPage';
import { CSRModule } from './modules/CSRModule';
import { SectorNetworks } from './modules/SectorNetworks';


 

export type ActiveModule = 
  | 'dashboard' 
  | 'donors' 
  | 'finances' 
  | 'projects' 
  | 'beneficiaryImpact'
  | 'fcraCompliance'
  | 'collaboration' 
  | 'government'
  | 'hr' 
  | 'reports' 
  | 'settings'
  | 'compliance'
  | 'register'
  | 'RegisterNGO'
  | 'knowledge'
  | 'mou-templates'
  | 'partner-network'
  | 'grant-applications'
  | 'csr'
  | 'sector-networks';

export function Dashboard() {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const savedModule = localStorage.getItem('activeModule');
    if (savedModule) {
      setActiveModule(savedModule as ActiveModule);
      localStorage.removeItem('activeModule');
    }
    
    // Prevent body scroll to avoid double scrollbars
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Reset scroll position when module changes
  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeModule]);

  const handleModuleChange = (module: ActiveModule) => {
    setActiveModule(module);
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        switch (user?.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'executive':
            return <LeadershipDashboard />;
          case 'employee':
            return <EmployeeDashboard />;
          default:
            return <AdminDashboard />;
        }
      case 'donors':
        return <DonorManagement />;
      case 'finances':
        return <FinancialTracking />;
      case 'projects':
        return <ProjectMonitoring />;
      case 'beneficiaryImpact':
        return <BeneficiaryImpactTracking />;
      case 'fcraCompliance':
        return <FcraCompliance />;
      case 'collaboration':
        return <CollaborationHub />;
      case 'government':
        return <GovernmentHub />;
      case 'hr':
        return <HRManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'compliance':
        return <ComplianceModule />;

      case 'register':
      case 'RegisterNGO':
        return <RegisterNGO />;
      case 'knowledge':
        return <KnowledgeHub />;
      case 'mou-templates':
        return <MOUTemplates />;
      case 'partner-network':
        return <PartnerNetwork />;
      case 'grant-applications':
        return <GrantApplicationPage />;
      case 'csr':
        return <CSRModule />;
      case 'sector-networks':
        return <SectorNetworks />;
      default:
        return <div className="p-8 text-center text-gray-500">Module under development</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeModule={activeModule} setActiveModule={handleModuleChange} />
      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        {renderContent()}
      </main>
    </div>
  );
}