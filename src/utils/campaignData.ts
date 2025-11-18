// Shared campaign data management
import { getCategoryImage } from './categoryImages';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  donors: number;
  daysLeft: number;
  category: string;
  status: 'active' | 'completed' | 'draft' | 'urgent';
  createdDate: string;
  image: string;
}

const campaigns: Campaign[] = [
  {
    id: '1',
    title: 'Education for 1000 Children',
    description: 'Providing quality education and school supplies to underprivileged children in rural areas.',
    goal: 100000,
    raised: 85000,
    donors: 156,
    daysLeft: 5,
    category: 'education',
    status: 'urgent',
    createdDate: '2024-12-01',
    image: getCategoryImage('education')
  },
  {
    id: '2',
    title: 'Clean Water for Villages',
    description: 'Installing water purification systems in 10 remote villages.',
    goal: 75000,
    raised: 75000,
    donors: 89,
    daysLeft: 0,
    category: 'water',
    status: 'completed',
    createdDate: '2024-11-01',
    image: getCategoryImage('water')
  },
  {
    id: '3',
    title: 'Emergency Medical Equipment',
    description: 'Purchasing essential medical equipment for rural health centers.',
    goal: 50000,
    raised: 30000,
    donors: 67,
    daysLeft: 15,
    category: 'healthcare',
    status: 'active',
    createdDate: '2024-12-15',
    image: getCategoryImage('healthcare')
  },
  {
    id: '4',
    title: 'Food Relief Program',
    description: 'Providing nutritious meals to families affected by natural disasters.',
    goal: 25000,
    raised: 10000,
    donors: 34,
    daysLeft: 8,
    category: 'food',
    status: 'urgent',
    createdDate: '2025-01-01',
    image: getCategoryImage('food')
  },
  {
    id: '5',
    title: 'Skill Development Training',
    description: 'Vocational training programs for unemployed youth.',
    goal: 60000,
    raised: 22000,
    donors: 45,
    daysLeft: 22,
    category: 'skills',
    status: 'active',
    createdDate: '2024-12-20',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    title: 'Women Empowerment Initiative',
    description: 'Supporting women entrepreneurs with microfinance and training.',
    goal: 40000,
    raised: 18000,
    donors: 28,
    daysLeft: 18,
    category: 'empowerment',
    status: 'active',
    createdDate: '2024-12-25',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop'
  }
];

export const getCampaigns = (): Campaign[] => {
  console.log('getCampaigns called, returning:', campaigns.length, 'campaigns');
  console.log('Campaign titles:', campaigns.map(c => c.title));
  return campaigns;
};

export const addCampaign = (newCampaign: Partial<Campaign>): Campaign => {
  const campaign: Campaign = {
    ...newCampaign,
    id: Date.now().toString(),
    raised: 0,
    donors: 0,
    status: 'active',
    createdDate: new Date().toISOString().split('T')[0],
    image: newCampaign.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop'
  } as Campaign;
  campaigns.push(campaign);
  return campaign;
};

export const getCampaignById = (id: string): Campaign | undefined => {
  return campaigns.find(campaign => campaign.id === id);
};

export const updateCampaign = (id: string, updates: Partial<Campaign>): Campaign | null => {
  const index = campaigns.findIndex(campaign => campaign.id === id);
  if (index !== -1) {
    campaigns[index] = { ...campaigns[index], ...updates };
    return campaigns[index];
  }
  return null;
};

export const getStats = () => {
  return {
    totalCampaigns: campaigns.length,
    totalRaised: campaigns.reduce((sum, c) => sum + c.raised, 0),
    totalGoal: campaigns.reduce((sum, c) => sum + c.goal, 0),
    totalDonors: campaigns.reduce((sum, c) => sum + c.donors, 0),
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
    averageProgress: campaigns.length > 0 ? Math.round(campaigns.reduce((sum, c) => sum + (c.raised / c.goal * 100), 0) / campaigns.length) : 0
  };
};