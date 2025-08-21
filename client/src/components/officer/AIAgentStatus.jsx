// AIAgentStatus.jsx - Simplified AI Agent Monitoring for SikAP MVP
import React, { useState } from 'react';
import { 
  Brain, CheckCircle, AlertCircle, Clock, BarChart3, 
  Leaf, Shield, FileCheck, Activity, RefreshCw
} from 'lucide-react';

const AIAgentStatus = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Simplified AI agents focused on core SikAP functionality
  const aiAgents = [
    {
      id: 'credit-scoring',
      name: 'Credit Scoring Agent',
      description: 'Analyzes mobile wallet data and alternative credit signals',
      status: 'active',
      icon: BarChart3,
      color: 'blue',
      processed: 156,
      successRate: '94.2%',
      avgTime: '2.1s',
      queueSize: 8,
      capabilities: [
        'Mobile wallet behavior analysis',
        'Gig worker income pattern recognition',
        'Alternative data credit scoring',
        'Payment history assessment'
      ]
    },
    {
      id: 'esg-assessment',
      name: 'ESG Impact Agent',
      description: 'Evaluates environmental and social impact of loan purposes',
      status: 'active',
      icon: Leaf,
      color: 'green',
      processed: 124,
      successRate: '91.7%',
      avgTime: '3.2s',
      queueSize: 5,
      capabilities: [
        'Sustainable business practice evaluation',
        'Environmental impact scoring',
        'Social responsibility assessment',
        'Community benefit analysis'
      ]
    },
    {
      id: 'asset-valuation',
      name: 'Movable Asset Valuation Agent',
      description: 'Assesses value of motorcycles, equipment, and other movable collateral',
      status: 'active',
      icon: Shield,
      color: 'purple',
      processed: 89,
      successRate: '88.9%',
      avgTime: '4.5s',
      queueSize: 12,
      capabilities: [
        'Motorcycle and vehicle valuation',
        'Equipment and machinery assessment',
        'Market price comparison',
        'Depreciation calculation'
      ]
    },
    {
      id: 'risk-assessment',
      name: 'Dynamic Risk Assessment Agent',
      description: 'Combines all data points for comprehensive risk evaluation',
      status: 'active',
      icon: FileCheck,
      color: 'amber',
      processed: 203,
      successRate: '96.1%',
      avgTime: '1.8s',
      queueSize: 3,
      capabilities: [
        'Multi-factor risk analysis',
        'Underserved borrower risk modeling',
        'Repayment capacity assessment',
        'Final loan recommendation'
      ]
    }
  ];

  const systemMetrics = {
    totalProcessed: 572,
    avgProcessingTime: '2.9s',
    systemUptime: '99.2%',
    successRate: '92.7%'
  };

  const recentActivity = [
    {
      timestamp: '2025-03-15 14:32:15',
      agent: 'Credit Scoring Agent',
      action: 'Analyzed GrabFood driver income patterns',
      loanId: 'LN-2025-001',
      result: 'Score: 680 - Stable gig income detected'
    },
    {
      timestamp: '2025-03-15 14:31:48',
      agent: 'ESG Impact Agent',
      action: 'Assessed motorcycle purchase sustainability',
      loanId: 'LN-2025-001',
      result: 'ESG Score: 78 - Supports livelihood improvement'
    },
    {
      timestamp: '2025-03-15 14:31:22',
      agent: 'Asset Valuation Agent',
      action: 'Valued 2020 Honda Click motorcycle',
      loanId: 'LN-2025-001',
      result: 'Market value: ₱65,000 - Good condition'
    },
    {
      timestamp: '2025-03-15 14:30:55',
      agent: 'Risk Assessment Agent',
      action: 'Final risk evaluation completed',
      loanId: 'LN-2025-002',
      result: 'Low risk - Recommended for approval'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-amber-100 text-amber-800',
      error: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircle,
      maintenance: Clock,
      error: AlertCircle,
      inactive: Clock
    };
    return icons[status] || Clock;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">AI Agent System Status</h2>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemMetrics.totalProcessed}</div>
              <div className="text-sm text-blue-700">Total Processed Today</div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemMetrics.successRate}</div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{systemMetrics.avgProcessingTime}</div>
              <div className="text-sm text-purple-700">Avg Processing Time</div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{systemMetrics.systemUptime}</div>
              <div className="text-sm text-amber-700">System Uptime</div>
            </div>
          </div>
        </div>

        {/* AI Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {aiAgents.map((agent) => {
            const Icon = agent.icon;
            const StatusIcon = getStatusIcon(agent.status);
            
            return (
              <div key={agent.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${
                      agent.color === 'blue' ? 'bg-blue-100' :
                      agent.color === 'green' ? 'bg-green-100' :
                      agent.color === 'purple' ? 'bg-purple-100' :
                      'bg-amber-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        agent.color === 'blue' ? 'text-blue-600' :
                        agent.color === 'green' ? 'text-green-600' :
                        agent.color === 'purple' ? 'text-purple-600' :
                        'text-amber-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{agent.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                        <StatusIcon className="w-3 h-3 inline mr-1" />
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4">{agent.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-slate-600">Processed:</span>
                    <div className="font-medium">{agent.processed}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Success Rate:</span>
                    <div className="font-medium text-green-600">{agent.successRate}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Avg Time:</span>
                    <div className="font-medium">{agent.avgTime}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Queue:</span>
                    <div className="font-medium">{agent.queueSize}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Key Capabilities:</h4>
                  <div className="space-y-1">
                    {agent.capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity Feed */}
        <div>
          <h3 className="font-medium text-slate-900 mb-4">Recent AI Activity</h3>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              SikAP AI Agents - Live Activity Feed
            </div>
            <div className="space-y-2 text-slate-300 max-h-60 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <div key={index} className="border-l-2 border-slate-700 pl-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-slate-400">[{activity.timestamp}]</div>
                      <div className="text-sm text-white">{activity.agent}</div>
                      <div className="text-xs text-slate-300">{activity.action}</div>
                      <div className="text-xs text-green-400">→ {activity.result}</div>
                    </div>
                    <div className="text-xs text-blue-400">{activity.loanId}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Live feed updates automatically every 10 seconds
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Panel */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg p-6">
        <h3 className="font-medium text-red-900 mb-3">SikAP AI System Overview</h3>
        <div className="text-sm text-red-800 space-y-2">
          <p>
            <strong>Mission:</strong> Empowering underserved Filipinos through AI-powered loan origination that leverages alternative data and supports movable asset collateral.
          </p>
          <p>
            <strong>Focus:</strong> Gig workers, freelancers, and SEMEs (Small Entrepreneurs and Micro Enterprises) who lack traditional credit history but demonstrate financial responsibility through mobile wallet activity and sustainable business practices.
          </p>
          <p>
            <strong>Innovation:</strong> Dynamic risk assessment combining mobile wallet behavior, ESG impact scoring, and movable asset valuation for inclusive lending decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAgentStatus;
