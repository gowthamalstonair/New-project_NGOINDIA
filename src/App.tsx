import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { DonatePage } from './components/pages/DonatePage';
import { EnquiryPage } from './components/pages/EnquiryPage';
import { JoinPage } from './components/pages/JoinPage';
import { NGOListPage } from './components/pages/NGOListpage';
import { NGODetailsPage } from './components/pages/NGODetailspage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { Chatbot } from './components/Chatbot';
import { useChatbot } from './hooks/useChatbot';
import { VolunteerPage } from './components/pages/Volunteer';
import { WhatsAppChat } from './components/pages/WhatsAppChat';
import { AddDonation } from './components/pages/AddDonation';
import { RecordExpense } from './components/pages/RecordExpense';
import { UpdateProject } from './components/pages/UpdateProject';
import { DonorDetails } from './components/pages/DonorDetails';
import { AddNGO } from './components/pages/AddNGO';
import { WhatsAppCommunication } from './components/pages/WhatsAppCommunication';
import { JoinNetwork } from './components/pages/JoinNetwork';
import { CampaignsPage } from './components/pages/CampaignsPage';
import { CampaignDetailsPage } from './components/pages/CampaignDetailsPage';
import { CreateCampaignPage } from './components/pages/CreateCampaignPage';
import { RecurringDonationsPage } from './components/pages/RecurringDonationsPage';
import { JointProjectsPage } from './components/pages/JointProjectsPage';
import { JointProjectDetailsPage } from './components/pages/JointProjectDetailsPage';
import { CreateJointProjectPage } from './components/pages/CreateJointProjectPage';
import { PartnerOrganizationsPage } from './components/pages/PartnerOrganizationsPage';
import { MembershipPage } from './components/pages/MembershipPage';
import { MembershipDashboard } from './components/pages/MembershipDashboard';
import { JoinMembershipPage } from './components/pages/JoinMembershipPage';
import { PartnerNetwork } from './components/modules/PartnerNetwork';
import { BrowseGrants } from './components/pages/BrowseGrants';
import { GrantPages } from './components/pages/GrantPages';
import { CSRLandingPage } from './components/CSRLandingPage';
import { AddEmployee } from './components/pages/AddEmployee';
import StaffProfile from './components/pages/StaffProfile';
import PerformanceReviewDetails from './components/pages/PerformanceReviewDetails';



function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(window.location.pathname);
  const { isOpen, toggleChatbot } = useChatbot();

  // Handle browser back/forward and navigation
  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname);
    };
    
    // Also update on initial load
    setCurrentPage(window.location.pathname);
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update current page when location changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (window.location.pathname !== currentPage) {
        setCurrentPage(window.location.pathname);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentPage]);

  // ---------- Routing ----------
  if (currentPage === '/donate') {
    return <DonatePage />;
  }

  if (currentPage === '/join') {
    return <JoinPage />;
  }

  if (currentPage === '/enquiry') {
    return <EnquiryPage />;
  }

  // ✅ New NGO List Page
  if (currentPage === '/ngos' || currentPage === '/registered-ngos') {
    return (
      <DashboardProvider>
        <NGOListPage />
      </DashboardProvider>
    );
  }

  // ✅ New NGO Details Page (/ngos/1, /ngos/2, etc.)
  if (currentPage.startsWith('/ngos/')) {
    const id = currentPage.split('/')[2]; // e.g., /ngos/2 → "2"
    return <NGODetailsPage id={id} />;
  }

  if (currentPage === '/volunteers') {
  return <VolunteerPage />;
}
if (currentPage === '/whatsappchat') {
  return <WhatsAppChat />;
}
if (currentPage === '/add-donation') {
  return (
    <DashboardProvider>
      <AddDonation />
    </DashboardProvider>
  );
}
if (currentPage === '/record-expense') {
  return (
    <DashboardProvider>
      <RecordExpense />
    </DashboardProvider>
  );
}
if (currentPage === '/update-project') {
  return (
    <DashboardProvider>
      <UpdateProject />
    </DashboardProvider>
  );
}
if (currentPage === '/donor-details') {
  return (
    <DashboardProvider>
      <DonorDetails />
    </DashboardProvider>
  );
}
if (currentPage === '/add-ngo') {
  return (
    <DashboardProvider>
      <AddNGO />
    </DashboardProvider>
  );
}
if (currentPage === '/whatsapp-communication') {
  return <WhatsAppCommunication />;
}
if (currentPage === '/join-network') {
  return <JoinNetwork />;
}

if (currentPage === '/campaigns') {
  return <CampaignsPage />;
}
if (currentPage.startsWith('/campaigns/') && currentPage !== '/campaigns/create') {
  const id = currentPage.split('/')[2];
  return <CampaignDetailsPage id={id} />;
}
if (currentPage === '/campaigns/create') {
  return <CreateCampaignPage />;
}
if (currentPage === '/recurring-donations') {
  return <RecurringDonationsPage />;
}
if (currentPage === '/joint-projects') {
  return <JointProjectsPage />;
}
if (currentPage.startsWith('/joint-projects/') && currentPage !== '/joint-projects/create') {
  const id = currentPage.split('/')[2];
  return <JointProjectDetailsPage id={id} />;
}
if (currentPage === '/joint-projects/create') {
  return <CreateJointProjectPage />;
}
if (currentPage === '/joint-projects/partners') {
  return <PartnerOrganizationsPage />;
}
if (currentPage === '/membership') {
  return <MembershipPage />;
}
if (currentPage === '/membership/dashboard') {
  return <MembershipDashboard />;
}
if (currentPage === '/membership/join') {
  return <JoinMembershipPage />;
}
if (currentPage === '/add-employee') {
  return <AddEmployee />;
}
if (currentPage === '/staff-profile') {
  return <StaffProfile />;
}
if (currentPage === '/performance-review-details') {
  return <PerformanceReviewDetails />;
}
if (currentPage === '/partner-network') {
  return <PartnerNetwork />;
}

if (currentPage === '/browse-grants') {
  return (
    <DashboardProvider>
      <BrowseGrants onApplyToGrant={() => {}} />
    </DashboardProvider>
  );
}
if (currentPage.startsWith('/grant/details/')) {
  return (
    <DashboardProvider>
      <GrantPages type="details" />
    </DashboardProvider>
  );
}
if (currentPage.startsWith('/grant/matches/')) {
  return (
    <DashboardProvider>
      <GrantPages type="matches" />
    </DashboardProvider>
  );
}

if (currentPage === '/csr-partnership') {
  return <CSRLandingPage />;
}



  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Main app content
  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <DashboardProvider>
          <Dashboard />
          <Chatbot isOpen={isOpen} onToggle={toggleChatbot} />
        </DashboardProvider>
      ) : (
        <>
          <LandingPage />
          <Chatbot isOpen={isOpen} onToggle={toggleChatbot} />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


export default App;

