import React, { useState } from 'react';
import { Brain, Target, MapPin, Star, TrendingUp, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Partner, MatchingCriteria } from '../../types/partner';
import { usePartnerRecommendations } from '../../hooks/usePartnerRecommendations';

interface PartnerRecommendationProps {
  partners: Partner[];
  currentProjects?: string[];
  onPartnerSelect?: (partner: Partner) => void;
}

export function PartnerRecommendation({ 
  partners, 
  currentProjects = [], 
  onPartnerSelect 
}: PartnerRecommendationProps) {
  const { user } = useAuth();
  const [criteria, setCriteria] = useState<MatchingCriteria>({
    sectors: ['education'],
    location: 'Maharashtra',
    projectType: 'education',
    budgetRange: [100000, 1000000],
    urgency: 'medium'
  });

  const { 
    recommendations, 
    topRecommendation, 
    loading, 
    error, 
    refreshRecommendations 
  } = usePartnerRecommendations(partners, criteria, currentProjects);

  const handleCriteriaChange = (updates: Partial<MatchingCriteria>) => {
    setCriteria(prev => ({ ...prev, ...updates }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Partner Matching</h3>
            <p className="text-sm text-gray-600">Intelligent partnership recommendations</p>
          </div>
        </div>
        <button
          onClick={refreshRecommendations}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Matching Criteria */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Matching Criteria</h4>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={criteria.projectType}
            onChange={(e) => handleCriteriaChange({ projectType: e.target.value })}
            className="text-sm border border-gray-300 rounded px-3 py-2"
          >
            <option value="education">Education</option>
            <option value="healthcare">Healthcare</option>
            <option value="environment">Environment</option>
            <option value="rural">Rural Development</option>
          </select>
          <select
            value={criteria.location}
            onChange={(e) => handleCriteriaChange({ location: e.target.value })}
            className="text-sm border border-gray-300 rounded px-3 py-2"
          >
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="National">National</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Top Recommendation */}
      {topRecommendation && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">Top Match</span>
            <span className={`px-2 py-1 text-xs rounded-full ${getScoreColor(topRecommendation.matchScore.score)}`}>
              {Math.round(topRecommendation.matchScore.score * 100)}% match
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{topRecommendation.partner.name}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {topRecommendation.partner.location?.region}
                </span>
                <span className="capitalize">{topRecommendation.partner.level}</span>
              </div>
              <div className="mt-2 text-xs text-gray-700">
                {topRecommendation.matchScore.reasons.slice(0, 2).map((reason, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                    {reason}
                  </div>
                ))}
              </div>
            </div>
            {(user?.role === 'admin' || user?.role === 'executive') && (
              <button
                onClick={() => onPartnerSelect?.(topRecommendation.partner)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-colors"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      )}

      {/* All Recommendations */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Recommendations ({recommendations.length})
        </h4>
        <div className="space-y-3">
          {recommendations.slice(0, 4).map((rec) => (
            <div key={rec.partner.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h5 className="font-medium text-gray-900">{rec.partner.name}</h5>
                  <span className={`px-2 py-1 text-xs rounded-full ${getScoreColor(rec.matchScore.score)}`}>
                    {Math.round(rec.matchScore.score * 100)}%
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {rec.partner.location?.region} • {rec.partner.level}
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-gray-900 font-medium">
                      {Math.round(rec.matchScore.matchingFactors.sectorMatch * 100)}%
                    </div>
                    <div className="text-gray-500">Sector</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-900 font-medium">
                      {Math.round(rec.matchScore.matchingFactors.locationRelevance * 100)}%
                    </div>
                    <div className="text-gray-500">Location</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-900 font-medium">
                      {Math.round(rec.matchScore.matchingFactors.projectAlignment * 100)}%
                    </div>
                    <div className="text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-900 font-medium">
                      {Math.round(rec.matchScore.matchingFactors.resourceFit * 100)}%
                    </div>
                    <div className="text-gray-500">Resources</div>
                  </div>
                </div>
              </div>
              {(user?.role === 'admin' || user?.role === 'executive') && (
                <button
                  onClick={() => onPartnerSelect?.(rec.partner)}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  View
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {recommendations.length === 0 && !loading && (
        <div className="text-center py-6 text-gray-500">
          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm">No matching partners found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your criteria</p>
        </div>
      )}
    </div>
  );
}