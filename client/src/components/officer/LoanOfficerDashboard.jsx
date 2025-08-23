// LoanOfficerDashboard.jsx - Enhanced UI for SikAP Loan Origination
import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, AlertTriangle, FileText, Users, TrendingUp, RefreshCw
} from 'lucide-react';

// Import enhanced components
import LoanQueue from './LoanQueue';
import LoanOfficerService from '../../services/loanOfficerService';

const LoanOfficerDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    pendingReview: 0,
    approvedToday: 0,
    needsAttention: 0,
    totalApplications: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Load dashboard statistics
  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await LoanOfficerService.getDashboardStats();
      setDashboardStats(stats);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardStats();
  };

  // Enhanced stats with real data
  const statsCards = [
    { 
      title: 'Pending Review', 
      value: loading ? '...' : dashboardStats.pendingReview.toString(), 
      icon: Clock, 
      color: 'amber',
      description: 'Applications ready for review',
      trend: '+12%'
    },
    { 
      title: 'Approved Today', 
      value: loading ? '...' : dashboardStats.approvedToday.toString(), 
      icon: CheckCircle, 
      color: 'green',
      description: 'Loans approved today',
      trend: '+8%'
    },
    { 
      title: 'Need Attention', 
      value: loading ? '...' : dashboardStats.needsAttention.toString(), 
      icon: AlertTriangle, 
      color: 'red',
      description: 'Require manual review',
      trend: '-5%'
    },
    { 
      title: 'Total Applications', 
      value: loading ? '...' : dashboardStats.totalApplications.toString(), 
      icon: FileText, 
      color: 'blue',
      description: 'All time applications',
      trend: '+23%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Loan Officer Dashboard</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Review and approve AI-processed loan applications • Last updated: {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              amber: {
                bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
                icon: 'text-amber-600',
                cardBg: 'bg-amber-50',
                trend: 'text-amber-700'
              },
              green: {
                bg: 'bg-gradient-to-r from-green-500 to-green-600',
                icon: 'text-green-600',
                cardBg: 'bg-green-50',
                trend: 'text-green-700'
              },
              red: {
                bg: 'bg-gradient-to-r from-red-500 to-red-600',
                icon: 'text-red-600',
                cardBg: 'bg-red-50',
                trend: 'text-red-700'
              },
              blue: {
                bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
                icon: 'text-blue-600',
                cardBg: 'bg-blue-50',
                trend: 'text-blue-700'
              }
            };
            
            return (
              <div key={index} className={`${colorClasses[stat.color].cardBg} rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-lg ${colorClasses[stat.color].bg} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-3 h-3 text-slate-400 mr-1" />
                  <span className={`text-xs font-medium ${colorClasses[stat.color].trend}`}>
                    {stat.trend} from last week
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

             {/* Main Content - Enhanced Loan Queue */}
       <main className="max-w-7xl mx-auto px-6 pb-6">
         <LoanQueue onStatsUpdate={loadDashboardStats} />
       </main>
    </div>
  );
};

export default LoanOfficerDashboard;