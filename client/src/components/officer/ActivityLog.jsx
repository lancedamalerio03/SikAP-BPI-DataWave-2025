// components/ActivityLog.jsx - Activity Log Component
import React from 'react';
import { Activity, FileCheck, Brain, CheckCircle } from 'lucide-react';

const ActivityLog = ({ triggerWebhook, sendToAgent }) => {
  
  const activityStats = [
    { title: 'Today\'s Activities', value: '47', icon: Activity, color: 'blue' },
    { title: 'Loans Reviewed', value: '12', icon: FileCheck, color: 'green' },
    { title: 'AI Agent Calls', value: '28', icon: Brain, color: 'purple' },
    { title: 'Approvals Given', value: '8', icon: CheckCircle, color: 'green' }
  ];

  const recentActivities = [
    {
      time: '2025-03-15 14:30',
      action: 'Reviewed loan application LN-2025-001',
      details: 'Maria Santos - Business Expansion Loan',
      type: 'review',
      result: 'Sent to AI agents for processing'
    },
    {
      time: '2025-03-15 13:45',
      action: 'Approved loan LN-2025-003',
      details: 'Ana Reyes - Agricultural Loan for ₱300,000',
      type: 'approval',
      result: 'Loan approved with conditions'
    },
    {
      time: '2025-03-15 12:20',
      action: 'AI Credit Scoring completed',
      details: 'LN-2025-002 - Score: 680 (Medium Risk)',
      type: 'ai_agent',
      result: 'Forwarded to ESG assessment'
    },
    {
      time: '2025-03-15 11:15',
      action: 'Document verification failed',
      details: 'LN-2025-004 - Missing business permit',
      type: 'document',
      result: 'Requested additional documents'
    },
    {
      time: '2025-03-15 10:30',
      action: 'New loan application received',
      details: 'LN-2025-005 - Equipment Purchase',
      type: 'new_application',
      result: 'Assigned for initial review'
    },
    {
      time: '2025-03-15 09:45',
      action: 'ESG Assessment completed',
      details: 'LN-2025-003 - Score: 95/100 (Excellent)',
      type: 'ai_agent',
      result: 'Proceeding to final review'
    },
    {
      time: '2025-03-15 09:20',
      action: 'Asset valuation updated',
      details: 'LN-2025-002 - Equipment value confirmed',
      type: 'ai_agent',
      result: 'Collateral assessment complete'
    },
    {
      time: '2025-03-15 08:55',
      action: 'Document uploaded by borrower',
      details: 'LN-2025-001 - Bank statements received',
      type: 'document',
      result: 'Document verification in progress'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Activity Log</h2>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="all">All Activities</option>
              <option value="loan_review">Loan Reviews</option>
              <option value="approvals">Approvals</option>
              <option value="agent_actions">Agent Actions</option>
              <option value="system_events">System Events</option>
            </select>
            <button 
              onClick={() => triggerWebhook('export-activity-log', { timeRange: '24h' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Export Log
            </button>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {activityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'purple' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'purple' ? 'text-purple-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.title}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity Timeline */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  activity.type === 'approval' ? 'bg-green-500' :
                  activity.type === 'review' ? 'bg-blue-500' :
                  activity.type === 'ai_agent' ? 'bg-purple-500' :
                  activity.type === 'document' ? 'bg-amber-500' :
                  'bg-gray-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{activity.details}</p>
                  <p className="text-xs text-slate-500">{activity.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="font-medium text-slate-900 mb-4">Today's Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-green-700">Processing Efficiency</div>
                <div className="text-xs text-green-600 mt-1">↑ 2% from yesterday</div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.2hrs</div>
                <div className="text-sm text-blue-700">Avg Response Time</div>
                <div className="text-xs text-blue-600 mt-1">↓ 0.5hrs from yesterday</div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-purple-700">Loans Processed</div>
                <div className="text-xs text-purple-600 mt-1">↑ 3 from yesterday</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;