import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, DollarSign, FileText, ExternalLink, AlertTriangle, Calendar } from 'lucide-react';
import { Donation } from '../../types/donation';
import { getMonthlyInflows, getUnspentForeignBalance } from '../../utils/fcraHelpers';
// @ts-ignore
import api from '../../utils/api';

interface ForeignFundsMetrics {
  totalReceived: number;
  totalUtilized: number;
  unspentBalance: number;
  complianceScore: number;
  expiringFunds: number;
  avgMonthlyInflow: number;
  growthRate: number;
}

interface ComplianceAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export function ForeignFundsWidget() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<6 | 12 | 24>(6);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const response = await api.getDonations();
      setDonations(response.results || response);
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo((): ForeignFundsMetrics => {
    const foreignDonations = donations.filter(d => d.isForeign);
    const totalReceived = foreignDonations.reduce((sum, d) => sum + (d.convertedAmount || 0), 0);
    const totalUtilized = foreignDonations.reduce((sum, d) => sum + ((d as any).utilizedAmount || 0), 0);
    const unspentBalance = getUnspentForeignBalance(foreignDonations);
    
    const monthlyInflows = getMonthlyInflows(foreignDonations, timeRange);
    const avgMonthlyInflow = monthlyInflows.reduce((sum, m) => sum + m.amount, 0) / monthlyInflows.length;
    const growthRate = monthlyInflows.length > 1 ? 
      ((monthlyInflows[0].amount - monthlyInflows[monthlyInflows.length - 1].amount) / monthlyInflows[monthlyInflows.length - 1].amount) * 100 : 0;
    
    const complianceScore = Math.min(100, Math.max(0, 
      (foreignDonations.filter(d => d.FIRC).length / Math.max(foreignDonations.length, 1)) * 100
    ));
    
    const expiringFunds = foreignDonations
      .filter(d => {
        const receivedDate = new Date((d as any).receivedDate || (d as any).date);
        const expiryDate = new Date(receivedDate.getTime() + (5 * 365 * 24 * 60 * 60 * 1000));
        const monthsToExpiry = (expiryDate.getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000);
        return monthsToExpiry <= 12 && monthsToExpiry > 0;
      })
      .reduce((sum, d) => sum + (d.convertedAmount || 0) - ((d as any).utilizedAmount || 0), 0);

    return {
      totalReceived,
      totalUtilized,
      unspentBalance,
      complianceScore,
      expiringFunds,
      avgMonthlyInflow,
      growthRate
    };
  }, [donations, timeRange]);

  const alerts = useMemo((): ComplianceAlert[] => {
    const alerts: ComplianceAlert[] = [];
    
    if (metrics.complianceScore < 80) {
      alerts.push({
        type: 'warning',
        message: 'FIRC compliance below 80%',
        priority: 'high'
      });
    }
    
    if (metrics.expiringFunds > 0) {
      alerts.push({
        type: 'error',
        message: `₹${metrics.expiringFunds.toLocaleString()} expiring within 12 months`,
        priority: 'high'
      });
    }
    
    if (metrics.unspentBalance > metrics.totalReceived * 0.8) {
      alerts.push({
        type: 'info',
        message: 'High unspent balance - consider utilization planning',
        priority: 'medium'
      });
    }
    
    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [metrics]);

  const foreignDonations = donations.filter(d => d.isForeign);
  const monthlyInflows = getMonthlyInflows(foreignDonations, timeRange);
  const recentForeign = foreignDonations.slice(0, 3);
  const maxInflow = Math.max(...monthlyInflows.map(m => m.amount), 1);

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
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-50 rounded-lg">
          <DollarSign className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Foreign Funds</h3>
          <p className="text-sm text-gray-600">FCRA compliance overview</p>
        </div>
      </div>

      {/* Compliance Alerts */}
      {alerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {alerts.slice(0, 2).map((alert, index) => (
            <div key={index} className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              alert.type === 'error' ? 'bg-red-50 text-red-800' :
              alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              <AlertTriangle className="w-4 h-4" />
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-900">
            ₹{metrics.unspentBalance.toLocaleString()}
          </div>
          <div className="text-xs text-blue-700">Unspent Balance</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-900">
            {metrics.complianceScore.toFixed(0)}%
          </div>
          <div className="text-xs text-green-700">FIRC Compliance</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-900">
            ₹{metrics.avgMonthlyInflow.toLocaleString()}
          </div>
          <div className="text-xs text-purple-700">Avg Monthly</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className={`text-lg font-bold ${
            metrics.growthRate >= 0 ? 'text-green-900' : 'text-red-900'
          }`}>
            {metrics.growthRate >= 0 ? '+' : ''}{metrics.growthRate.toFixed(1)}%
          </div>
          <div className="text-xs text-orange-700">Growth Rate</div>
        </div>
      </div>

      {/* Monthly Inflows Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Monthly Inflows
          </h4>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(Number(e.target.value) as 6 | 12 | 24)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value={6}>6M</option>
            <option value={12}>12M</option>
            <option value={24}>24M</option>
          </select>
        </div>
        <div className="space-y-2">
          {monthlyInflows.map((month, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-16 text-xs text-gray-600">{month.month}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(month.amount / maxInflow) * 100}%` }}
                />
              </div>
              <div className="w-20 text-xs text-gray-900 text-right">
                ₹{month.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics & Recent Donations */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Utilization Rate</span>
            <span className="text-sm font-bold text-gray-900">
              {((metrics.totalUtilized / Math.max(metrics.totalReceived, 1)) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(metrics.totalUtilized / Math.max(metrics.totalReceived, 1)) * 100}%` }}
            />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Recent Activity
          </h4>
          <div className="space-y-2">
            {recentForeign.length > 0 ? (
              recentForeign.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {donation.donorName}
                    </div>
                    <div className="text-xs text-gray-600">
                      {donation.donorCountry}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(donation.convertedAmount || 0).toLocaleString()}
                    </div>
                    <div className={`text-xs ${
                      donation.FIRC ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {donation.FIRC ? '✓ FIRC' : '⚠ Pending'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-gray-500 text-sm">
                No recent donations
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}