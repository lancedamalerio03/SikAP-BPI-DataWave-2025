// LoanOfficerDashboard.jsx - Main Dashboard Component
import React, { useState } from 'react';
import { 
  BarChart3, Shield, FileCheck, Activity, Brain, Zap, Settings, Bell
} from 'lucide-react';

// Import individual tab components
import Analytics from './Analytics';
import RiskPortfolio from './RiskPortfolio';
import LoanRequests from './LoanRequests';
import ActivityLog from './ActivityLog';
import AIAgents from './AIAgents';
import Workflow from './Workflow';
import OfficerSettings from './Settings';

const LoanOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const navigationTabs = [
    { id: 'analytics', label: 'Data Analytics', icon: BarChart3 },
    { id: 'risk_portfolio', label: 'Risk Assessment', icon: Shield },
    { id: 'loan_requests', label: 'Loan Requests', icon: FileCheck },
    { id: 'activity_log', label: 'Activity Log', icon: Activity },
    { id: 'ai_agents', label: 'AI Agents', icon: Brain },
    { id: 'workflow', label: 'Workflow Monitor', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // n8n Webhook Integration Functions
  const triggerWebhook = async (endpoint, data) => {
    console.log(`Triggering webhook: ${endpoint}`, data);
    // Example: await fetch(`/api/webhook/${endpoint}`, { method: 'POST', body: JSON.stringify(data) });
  };

  const sendToAgent = async (agentType, loanId, data) => {
    await triggerWebhook(`${agentType}-agent`, { loanId, ...data });
  };

  const renderActiveTab = () => {
    const commonProps = { triggerWebhook, sendToAgent };
    
    switch (activeTab) {
      case 'analytics':
        return <Analytics {...commonProps} />;
      case 'risk_portfolio':
        return <RiskPortfolio {...commonProps} />;
      case 'loan_requests':
        return <LoanRequests {...commonProps} />;
      case 'activity_log':
        return <ActivityLog {...commonProps} />;
      case 'ai_agents':
        return <AIAgents {...commonProps} />;
      case 'workflow':
        return <Workflow {...commonProps} />;
      case 'settings':
        return <OfficerSettings {...commonProps} />;
      default:
        return <Analytics {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-red-600">SikAP</h1>
              <div className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium">
                Loan Officer Dashboard
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-slate-100 rounded-lg">
                <Bell className="w-5 h-5 text-slate-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <div className="flex items-center gap-3">
                <span className="hidden md:block font-medium text-slate-700">John Reyes</span>
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  JR
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default LoanOfficerDashboard;