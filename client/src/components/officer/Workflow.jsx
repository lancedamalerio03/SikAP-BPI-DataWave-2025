// components/Workflow.jsx - Workflow Monitor Component
import React from 'react';
import { 
  FileText, User, Edit, Brain, Eye, CheckCircle, Clock, TrendingUp, Target
} from 'lucide-react';

const Workflow = ({ triggerWebhook, sendToAgent }) => {
  
  const workflowStages = [
    { stage: 'Pre-Application', icon: FileText, status: 'active', count: 12 },
    { stage: 'Officer Review', icon: User, status: 'active', count: 8 },
    { stage: 'Application Form', icon: Edit, status: 'active', count: 15 },
    { stage: 'AI Processing', icon: Brain, status: 'active', count: 23 },
    { stage: 'Human Review', icon: Eye, status: 'warning', count: 5 },
    { stage: 'Decision', icon: CheckCircle, status: 'active', count: 3 }
  ];

  const workflowMetrics = [
    {
      title: 'Avg Processing Time',
      value: '5.2 days',
      change: '-1.8d',
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Automation Rate',
      value: '94.3%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'First-Pass Approval',
      value: '87.1%',
      change: '+4.2%',
      icon: Target,
      color: 'purple'
    }
  ];

  const bottlenecks = [
    { 
      stage: 'Document Verification', 
      impact: 'High', 
      delay: '2.1 days avg', 
      suggestion: 'Implement auto-verification for standard docs' 
    },
    { 
      stage: 'Human Review Queue', 
      impact: 'Medium', 
      delay: '1.3 days avg', 
      suggestion: 'Add more reviewers or refine AI accuracy' 
    },
    { 
      stage: 'ESG Assessment', 
      impact: 'Low', 
      delay: '0.8 days avg', 
      suggestion: 'Pre-populate ESG data from business profiles' 
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Loan Processing Workflow</h2>
        
        {/* Workflow Stages */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900">Current Workflow Status</h3>
            <button 
              onClick={() => triggerWebhook('customize-workflow', { action: 'open_config' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Customize Workflow
            </button>
          </div>

          {/* Workflow Visualization */}
          <div className="bg-slate-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700">Loan Processing Pipeline</span>
              <span className="text-xs text-slate-500">Processing time varies by complexity</span>
            </div>
            
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              {workflowStages.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="flex flex-col items-center min-w-[120px] relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      step.status === 'active' ? 'bg-blue-100 text-blue-600' :
                      step.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-700 mb-1 text-center">{step.stage}</span>
                    <span className="text-xs text-slate-500">{step.count} active</span>
                    {index < workflowStages.length - 1 && (
                      <div className="absolute left-full top-6 w-4 h-0.5 bg-slate-300"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workflow Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workflowMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className={`border rounded-lg p-4 ${
                  metric.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                  metric.color === 'green' ? 'bg-green-50 border-green-200' :
                  'bg-purple-50 border-purple-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-8 h-8 ${
                      metric.color === 'blue' ? 'text-blue-600' :
                      metric.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                    <div>
                      <div className={`text-2xl font-bold ${
                        metric.color === 'blue' ? 'text-blue-600' :
                        metric.color === 'green' ? 'text-green-600' :
                        'text-purple-600'
                      }`}>
                        {metric.value}
                      </div>
                      <div className={`text-sm ${
                        metric.color === 'blue' ? 'text-blue-700' :
                        metric.color === 'green' ? 'text-green-700' :
                        'text-purple-700'
                      }`}>
                        {metric.title}
                      </div>
                      <div className={`text-xs mt-1 ${
                        metric.color === 'blue' ? 'text-blue-600' :
                        metric.color === 'green' ? 'text-green-600' :
                        'text-purple-600'
                      }`}>
                        {metric.change} this week
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottleneck Analysis */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Workflow Bottlenecks</h3>
            <div className="space-y-3">
              {bottlenecks.map((bottleneck, index) => (
                <div key={index} className={`p-4 border-l-4 ${
                  bottleneck.impact === 'High' ? 'border-red-500 bg-red-50' :
                  bottleneck.impact === 'Medium' ? 'border-amber-500 bg-amber-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-slate-900">{bottleneck.stage}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      bottleneck.impact === 'High' ? 'bg-red-100 text-red-800' :
                      bottleneck.impact === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {bottleneck.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">Delay: {bottleneck.delay}</p>
                  <p className="text-sm text-slate-700">💡 {bottleneck.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Optimization */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Optimization Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">AI Agent Parallel Processing</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Run credit scoring, ESG assessment, and asset valuation simultaneously
                </p>
                <button 
                  onClick={() => triggerWebhook('enable-parallel-processing', { enable: true })}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Enable
                </button>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Auto-Approval for Low Risk</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Automatically approve loans below ₱50k with low risk scores
                </p>
                <button 
                  onClick={() => triggerWebhook('enable-auto-approval', { threshold: 50000 })}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Configure
                </button>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Smart Document Routing</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Route documents to appropriate verification agents based on type
                </p>
                <button 
                  onClick={() => triggerWebhook('enable-smart-routing', { enable: true })}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Activate
                </button>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Predictive Queue Management</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Predict and redistribute workload based on officer availability
                </p>
                <button 
                  onClick={() => triggerWebhook('enable-predictive-queue', { enable: true })}
                  className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                >
                  Setup
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Workflow Monitor */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Real-time Processing Monitor</h3>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
              <div className="text-green-400 mb-2">SikAP Workflow Monitor - Live Feed</div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>[14:32:15] LN-2025-001</span>
                  <span className="text-blue-400">→ Credit Scoring Agent</span>
                </div>
                <div className="flex justify-between">
                  <span>[14:31:48] LN-2025-002</span>
                  <span className="text-green-400">✓ ESG Assessment Complete</span>
                </div>
                <div className="flex justify-between">
                  <span>[14:31:22] LN-2025-003</span>
                  <span className="text-purple-400">→ Human Review Queue</span>
                </div>
                <div className="flex justify-between">
                  <span>[14:30:55] LN-2025-004</span>
                  <span className="text-amber-400">⚠ Document Verification Failed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflow;