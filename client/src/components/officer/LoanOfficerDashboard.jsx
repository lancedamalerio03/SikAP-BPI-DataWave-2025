// LoanOfficerDashboard.jsx - Simplified MVP for SikAP Loan Origination
import React, { useState } from 'react';
import { 
  FileText, Brain, CheckCircle, Clock, Leaf
} from 'lucide-react';

// Import simplified components
import LoanQueue from './LoanQueue';
import AIAgentStatus from './AIAgentStatus';
import ESGPortfolio from './ESGPortfolio';

const LoanOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('queue');

  const navigationTabs = [
    { id: 'queue', label: 'Loan Queue', icon: FileText },
    { id: 'esg_portfolio', label: 'ESG Portfolio', icon: Leaf },
    { id: 'ai_status', label: 'AI Agents', icon: Brain }
  ];

  // Quick stats for the dashboard header
  const dashboardStats = [
    { title: 'Pending Applications', value: '23', icon: Clock, color: 'amber' },
    { title: 'AI Processing', value: '8', icon: Brain, color: 'blue' },
    { title: 'Ready for Review', value: '12', icon: FileText, color: 'purple' },
    { title: 'Approved Today', value: '5', icon: CheckCircle, color: 'green' }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'queue':
        return <LoanQueue />;
      case 'esg_portfolio':
        return <ESGPortfolio />;
      case 'ai_status':
        return <AIAgentStatus />;
      default:
        return <LoanQueue />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">SikAP Loan Officer</h1>
              <p className="text-sm text-slate-600">AI-Powered Loan Origination for Underserved Filipinos</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-1 ${
                      stat.color === 'amber' ? 'bg-amber-100' :
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'purple' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        stat.color === 'amber' ? 'text-amber-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'purple' ? 'text-purple-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-600">{stat.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default LoanOfficerDashboard;