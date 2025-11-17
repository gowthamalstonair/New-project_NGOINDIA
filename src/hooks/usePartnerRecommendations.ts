import { useState, useMemo } from 'react';
import { Partner, PartnerRecommendation, MatchingCriteria } from '../types/partner';
import { rankPartners } from '../utils/partnerMatching';

export const usePartnerRecommendations = (
  partners: Partner[],
  criteria?: MatchingCriteria,
  currentProjects: string[] = []
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recommendations = useMemo((): PartnerRecommendation[] => {
    if (!criteria || !partners.length) return [];

    try {
      setLoading(true);
      const matchScores = rankPartners(partners, criteria, currentProjects);
      
      return matchScores
        .filter(score => score.score > 0.3)
        .slice(0, 5)
        .map(matchScore => {
          const partner = partners.find(p => p.id === matchScore.partnerId)!;
          return {
            partner,
            matchScore,
            suggestedProjects: partner.projects?.filter(p => 
              p.toLowerCase().includes(criteria.projectType.toLowerCase())
            ).slice(0, 2)
          };
        });
    } catch (err) {
      setError('Failed to generate recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [partners, criteria, currentProjects]);

  const topRecommendation = recommendations[0] || null;
  
  const getRecommendationsByLevel = (level: Partner['level']) => 
    recommendations.filter(r => r.partner.level === level);

  const refreshRecommendations = () => {
    setError(null);
  };

  return {
    recommendations,
    topRecommendation,
    getRecommendationsByLevel,
    loading,
    error,
    refreshRecommendations
  };
};