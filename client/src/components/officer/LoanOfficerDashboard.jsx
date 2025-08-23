// LoanOfficerDashboard.jsx - Simplified MVP for SikAP Loan Origination
import React from 'react';
import { 
  Clock, CheckCircle, AlertTriangle, FileText
} from 'lucide-react';

// Import simplified component
import LoanQueue from './LoanQueue';

const LoanOfficerDashboard = () => {
  // Simple stats focused on core MVP metrics
  const dashboardStats = [
    { title: 'Pending Review', value: '8', icon: Clock, color: 'amber' },
    { title: 'Approved Today', value: '3', icon: CheckCircle, color: 'green' },
    { title: 'Need Attention', value: '2', icon: AlertTriangle, color: 'red' },
    { title: 'Total Applications', value: '45', icon: FileText, color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Loan Officer Dashboard</h1>
              <p className="text-sm text-slate-600">Review and approve AI-processed loan applications</p>
            </div>
            
            {/* Simple Stats */}
            <div className="flex gap-6">
              {dashboardStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 ${
                      stat.color === 'amber' ? 'bg-amber-100' :
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'red' ? 'bg-red-100' :
                      'bg-green-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        stat.color === 'amber' ? 'text-amber-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'red' ? 'text-red-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="text-xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-600">{stat.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Only Loan Queue */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <LoanQueue />
      </main>
    </div>
  );
};

export default LoanOfficerDashboard;