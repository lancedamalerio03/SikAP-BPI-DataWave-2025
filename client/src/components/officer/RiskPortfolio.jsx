// components/RiskPortfolio.jsx - Risk Assessment Component
import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const RiskPortfolio = ({ triggerWebhook, sendToAgent }) => {
  
  const riskIndicators = [
    { factor: 'Credit History', impact: 'High', status: 'stable', weight: '35%' },
    { factor: 'Debt-to-Income Ratio', impact: 'High', status: 'improving', weight: '25%' },
    { factor: 'Business Stability', impact: 'Medium', status: 'stable', weight: '20%' },
    { factor: 'Collateral Value', impact: 'Medium', status: 'declining', weight: '15%' },
    { factor: 'Market Conditions', impact: 'Low', status: 'volatile', weight: '5%' }
  ];

  const aiPredictions = [
    { prediction: 'Default risk may increase by 0.3% next quarter', confidence: '87%', type: 'warning' },
    { prediction: 'ESG-compliant loans show 15% lower default rates', confidence: '94%', type: 'positive' },
    { prediction: 'Agricultural sector risk trending upward', confidence: '76%', type: 'alert' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Risk Assessment Portfolio</h2>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
            <button 
              onClick={() => triggerWebhook('risk-analysis', { action: 'run_analysis' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Run Risk Analysis
            </button>
          </div>
        </div>

        {/* Risk Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">28</div>
                <div className="text-sm text-red-700">High Risk Loans</div>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">154</div>
                <div className="text-sm text-amber-700">Medium Risk Loans</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">1,052</div>
                <div className="text-sm text-green-700">Low Risk Loans</div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Factors Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700">Key Risk Indicators</h4>
            {riskIndicators.map((indicator, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    indicator.status === 'stable' ? 'bg-green-500' :
                    indicator.status === 'improving' ? 'bg-blue-500' :
                    indicator.status === 'declining' ? 'bg-red-500' :
                    'bg-amber-500'
                  }`}></div>
                  <span className="text-sm font-medium text-slate-700">{indicator.factor}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">{indicator.weight}</div>
                  <div className="text-xs text-slate-500 capitalize">{indicator.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-700">AI Risk Predictions</h4>
            <div className="space-y-3">
              {aiPredictions.map((pred, index) => (
                <div key={index} className={`p-3 border-l-4 ${
                  pred.type === 'warning' ? 'border-amber-500 bg-amber-50' :
                  pred.type === 'positive' ? 'border-green-500 bg-green-50' :
                  'border-red-500 bg-red-50'
                }`}>
                  <p className="text-sm text-slate-700">{pred.prediction}</p>
                  <div className="text-xs text-slate-500 mt-1">Confidence: {pred.confidence}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskPortfolio;