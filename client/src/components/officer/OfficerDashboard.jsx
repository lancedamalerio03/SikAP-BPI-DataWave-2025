// components/officer/OfficerDashboard.jsx
import React, { useState } from 'react';
import { FileText, Shield, BarChart3 } from 'lucide-react';
import LoanRequests from './LoanRequests';
import RiskPortfolio from './RiskPortfolio';
import Analytics from './Analytics';

const OfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('loan-requests');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SikAP Officer Dashboard</h1>
              <p className="text-sm text-gray-600">Manage loan applications and risk assessments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-900 font-medium">Officer Portal</p>
                <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                OD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('loan-requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'loan-requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Loan Requests
              </div>
            </button>
            <button
              onClick={() => setActiveTab('risk-portfolio')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'risk-portfolio'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Risk Portfolio
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {activeTab === 'loan-requests' && <LoanRequests />}
        {activeTab === 'risk-portfolio' && <RiskPortfolio />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
};

export default OfficerDashboard;