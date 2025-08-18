// components/Analytics.jsx - Data Analytics Component
import React, { useState } from 'react';
import { 
  BarChart3, FileCheck, CreditCard, DollarSign, AlertTriangle, 
  Leaf, Clock, User, PieChart, TrendingUp, Brain
} from 'lucide-react';

const Analytics = ({ triggerWebhook, sendToAgent }) => {
  const [analyticsView, setAnalyticsView] = useState('high-level');
  const [timeRange, setTimeRange] = useState('30d');
  const [searchQuery, setSearchQuery] = useState('');

  const dashboardStats = {
    highLevel: [
      { title: 'Total Applications', value: '2,847', change: '+12%', icon: FileCheck, color: 'blue' },
      { title: 'Active Loans', value: '1,234', change: '+8%', icon: CreditCard, color: 'green' },
      { title: 'Portfolio Value', value: '₱284.7M', change: '+15%', icon: DollarSign, color: 'purple' },
      { title: 'Default Rate', value: '2.3%', change: '-0.5%', icon: AlertTriangle, color: 'red' },
      { title: 'Avg ESG Score', value: '78.5', change: '+5.2%', icon: Leaf, color: 'green' },
      { title: 'Processing Time', value: '5.2 days', change: '-1.8d', icon: Clock, color: 'amber' }
    ],
    midLevel: [
      { title: 'Today\'s Applications', value: '23', change: '+3', icon: FileCheck, color: 'blue' },
      { title: 'Pending Review', value: '47', change: '+12', icon: Clock, color: 'amber' },
      { title: 'AI Processing', value: '15', change: '-2', icon: Brain, color: 'purple' },
      { title: 'Human Review', value: '8', change: '+1', icon: User, color: 'green' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Analytics Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-900">Data Analytics</h2>
            <div className="flex bg-slate-100 rounded-lg p-1">
              {[
                { id: 'high-level', label: 'High Level' },
                { id: 'mid-level', label: 'Department' },
                { id: 'individual', label: 'Individual' }
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setAnalyticsView(view.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    analyticsView === view.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {(analyticsView === 'high-level' ? dashboardStats.highLevel : dashboardStats.midLevel).map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  stat.color === 'red' ? 'bg-red-100' :
                  stat.color === 'amber' ? 'bg-amber-100' :
                  'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    stat.color === 'red' ? 'text-red-600' :
                    stat.color === 'amber' ? 'text-amber-600' :
                    'text-gray-600'
                  }`} />
                </div>
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.title}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Loan Volume Trends</h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">Integration point for Chart.js/Recharts</p>
              <p className="text-xs text-slate-400 mt-1">Data: Monthly loan volumes by type</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Distribution</h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">Risk score distribution chart</p>
              <p className="text-xs text-slate-400 mt-1">Data: Low/Medium/High risk percentages</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">ESG Performance</h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Leaf className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">ESG scoring trends</p>
              <p className="text-xs text-slate-400 mt-1">Data: ESG scores over time</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Processing Efficiency</h3>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500">Agent processing times</p>
              <p className="text-xs text-slate-400 mt-1">Data: AI agent performance metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Individual User Analytics (when individual view is selected) */}
      {analyticsView === 'individual' && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Individual User Analytics</h3>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search for a specific borrower..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-center py-12 text-slate-500">
            <User className="w-12 h-12 mx-auto mb-2" />
            <p>Select a borrower to view detailed analytics</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
