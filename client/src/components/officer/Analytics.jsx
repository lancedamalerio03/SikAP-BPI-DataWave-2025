// components/officer/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Clock,
  Users,
  Activity,
  PieChart,
  RefreshCw,
  AlertCircle,
  Shield
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Utility functions for Analytics
const analyticsUtils = {
  // Calculate comprehensive analytics from real data
  async calculateAnalytics() {
    try {
      // Get all applications for analytics
      const { data: applications, error } = await supabase
        .from('preloan_applications')
        .select('*');

      if (error) throw error;

      if (!applications || applications.length === 0) {
        return {
          overview: {
            totalApplications: 0,
            approvedLoans: 0,
            rejectedLoans: 0,
            pendingReview: 0,
            totalDisbursed: 0,
            avgLoanAmount: 0,
            approvalRate: 0
          },
          riskDistribution: { low: 0, medium: 0, high: 0 },
          loanPurposes: [],
          monthlyTrends: []
        };
      }

      // Calculate overview metrics
      const totalApplications = applications.length;
      const approvedLoans = applications.filter(app => app.status === 'approved').length;
      const rejectedLoans = applications.filter(app => app.status === 'rejected').length;
      const pendingReview = applications.filter(app => 
        ['pending', 'under_review', 'pending_documents'].includes(app.status)
      ).length;
      
      const totalDisbursed = applications
        .filter(app => app.status === 'approved')
        .reduce((sum, app) => sum + (parseFloat(app.loan_amount) || 0), 0);
      
      const avgLoanAmount = totalApplications > 0 
        ? applications.reduce((sum, app) => sum + (parseFloat(app.loan_amount) || 0), 0) / totalApplications 
        : 0;
      
      const approvalRate = totalApplications > 0 ? (approvedLoans / totalApplications) * 100 : 0;

      // Calculate loan purposes
      const purposeCounts = {};
      applications.forEach(app => {
        const purpose = app.loan_purpose || 'others';
        purposeCounts[purpose] = (purposeCounts[purpose] || 0) + 1;
      });

      const loanPurposes = Object.entries(purposeCounts).map(([purpose, count]) => ({
        purpose: purpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count,
        percentage: ((count / totalApplications) * 100).toFixed(1)
      })).sort((a, b) => b.count - a.count);

      // Calculate monthly trends (last 6 months)
      const monthlyTrends = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
        
        const monthApps = applications.filter(app => {
          const appDate = new Date(app.created_at);
          return appDate.getMonth() === monthDate.getMonth() && 
                 appDate.getFullYear() === monthDate.getFullYear();
        });

        monthlyTrends.push({
          month: monthName,
          applications: monthApps.length,
          approved: monthApps.filter(app => app.status === 'approved').length,
          rejected: monthApps.filter(app => app.status === 'rejected').length
        });
      }

      // Get risk distribution
      const { data: riskData, error: riskError } = await supabase
        .from('preloan_risk_profiles')
        .select('risk_grade');

      let riskDistribution = { low: 0, medium: 0, high: 0 };
      if (!riskError && riskData) {
        riskData.forEach(profile => {
          if (profile.risk_grade === 'LOW') riskDistribution.low++;
          else if (profile.risk_grade === 'MEDIUM') riskDistribution.medium++;
          else if (profile.risk_grade === 'HIGH') riskDistribution.high++;
        });
      }

      return {
        overview: {
          totalApplications,
          approvedLoans,
          rejectedLoans,
          pendingReview,
          totalDisbursed,
          avgLoanAmount: Math.round(avgLoanAmount),
          approvalRate: Math.round(approvalRate * 10) / 10
        },
        riskDistribution,
        loanPurposes,
        monthlyTrends
      };

    } catch (error) {
      console.error('Error calculating analytics:', error);
      throw error;
    }
  },

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount || 0);
  },

  // Format large numbers
  formatLargeNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalApplications: 0,
      approvedLoans: 0,
      rejectedLoans: 0,
      pendingReview: 0,
      totalDisbursed: 0,
      avgLoanAmount: 0,
      approvalRate: 0
    },
    riskDistribution: { low: 0, medium: 0, high: 0 },
    loanPurposes: [],
    monthlyTrends: []
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const analyticsData = await analyticsUtils.calculateAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalApplications}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Loans</p>
              <p className="text-2xl font-bold text-green-600">{analytics.overview.approvedLoans}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approval Rate</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.overview.approvalRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Disbursed</p>
              <p className="text-2xl font-bold text-purple-600">
                ₱{analyticsUtils.formatLargeNumber(analytics.overview.totalDisbursed)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Loan Amount</p>
              <p className="text-2xl font-bold text-orange-600">
                ₱{analyticsUtils.formatLargeNumber(analytics.overview.avgLoanAmount)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{analytics.overview.pendingReview}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading analytics...</span>
        </div>
      ) : (
        <>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                    <span className="text-sm text-gray-600">Low Risk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {analytics.riskDistribution.low}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${
                            (analytics.riskDistribution.low + analytics.riskDistribution.medium + analytics.riskDistribution.high) > 0 
                              ? (analytics.riskDistribution.low / (analytics.riskDistribution.low + analytics.riskDistribution.medium + analytics.riskDistribution.high)) * 100 
                              : 0
                          }%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                    <span className="text-sm text-gray-600">Medium Risk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {analytics.riskDistribution.medium}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ 
                          width: `${
                            (analytics.riskDistribution.low + analytics.riskDistribution.medium + analytics.riskDistribution.high) > 0 
                              ? (analytics.riskDistribution.medium / (analytics.riskDistribution.low + analytics.riskDistribution.medium + analytics.riskDistribution.high)) * 100 
                              : 0
                          }%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                    <span className="text-sm text-gray-600">High Risk</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">
                      {analytics.riskDistribution.high}
                    </span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ 
                          width: `${
                            (analytics.riskDistribution.low + analytics.riskDistribution.medium + analytics.riskDistribution.high) > 0 
                              ? (analytics.riskDistribution.high / (analytics.riskDistribution.low + analytics.riskDistribution.medium + analytics.riskDistribution.high)) * 100 
                              : 0
                          }%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Purposes Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Purposes</h3>
              <div className="space-y-3">
                {analytics.loanPurposes.slice(0, 5).map((purpose, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{purpose.purpose}</span>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">
                        {purpose.count} ({purpose.percentage}%)
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${purpose.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Application Trends</h3>
            <div className="grid grid-cols-6 gap-4">
              {analytics.monthlyTrends.map((month, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 mb-1">{month.month}</div>
                    <div className="flex flex-col space-y-1">
                      <div 
                        className="bg-blue-500 mx-auto rounded-t"
                        style={{ 
                          height: `${Math.max(4, (month.applications / Math.max(...analytics.monthlyTrends.map(m => m.applications), 1)) * 60)}px`,
                          width: '20px'
                        }}
                      ></div>
                      <div 
                        className="bg-green-500 mx-auto"
                        style={{ 
                          height: `${Math.max(2, (month.approved / Math.max(...analytics.monthlyTrends.map(m => m.applications), 1)) * 60)}px`,
                          width: '20px'
                        }}
                      ></div>
                      <div 
                        className="bg-red-500 mx-auto rounded-b"
                        style={{ 
                          height: `${Math.max(1, (month.rejected / Math.max(...analytics.monthlyTrends.map(m => m.applications), 1)) * 60)}px`,
                          width: '20px'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="text-gray-900 font-medium">{month.applications}</div>
                    <div className="text-green-600">{month.approved}</div>
                    <div className="text-red-600">{month.rejected}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-6 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Applications</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Approved</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span>Rejected</span>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Approval Rate Performance</p>
                    <p className="text-xs text-gray-600">{analytics.overview.approvalRate}% current approval rate</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Volume</p>
                    <p className="text-xs text-gray-600">{analytics.overview.totalApplications} total applications processed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Risk Distribution</p>
                    <p className="text-xs text-gray-600">
                      {Math.round((analytics.riskDistribution.low / Math.max(analytics.riskDistribution.low + analytics.riskDistribution.medium + analytics.riskDistribution.high, 1)) * 100)}% low risk portfolio
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Activity className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Average Loan Size</p>
                    <p className="text-xs text-gray-600">{analyticsUtils.formatCurrency(analytics.overview.avgLoanAmount)} average loan amount</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Review Pending Applications</p>
                    <p className="text-xs text-gray-600">{analytics.overview.pendingReview} applications awaiting review</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Processing Time Optimization</p>
                    <p className="text-xs text-gray-600">Focus on reducing application processing time</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <PieChart className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Popular Loan Products</p>
                    <p className="text-xs text-gray-600">
                      {analytics.loanPurposes[0]?.purpose || 'Working Capital'} is the most requested loan type
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BarChart3 className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Risk Management</p>
                    <p className="text-xs text-gray-600">Monitor high-risk applications closely</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;