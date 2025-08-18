// client/src/components/dashboard/PortfolioPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Package, 
  TrendingUp, 
  CheckCircle, 
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  DollarSign,
  Target,
  Award,
  Bike,
  Laptop,
  Refrigerator,
  Smartphone,
  X,
  Upload
} from 'lucide-react';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Portfolio overview stats
  const portfolioStats = [
    {
      icon: Package,
      label: 'Total Asset Value',
      value: '₱120,000',
      change: '+8.2%',
      changeType: 'positive',
      color: 'blue'
    },
    {
      icon: CreditCard,
      label: 'Available Credit',
      value: '₱75,000',
      change: '+15.5%',
      changeType: 'positive',
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: 'Credit Score',
      value: '750',
      change: '+25 pts',
      changeType: 'positive',
      color: 'purple'
    },
    {
      icon: Target,
      label: 'Credit Utilization',
      value: '35%',
      change: '-5%',
      changeType: 'positive',
      color: 'amber'
    }
  ];

  // Declared assets
  const declaredAssets = [
    {
      id: 1,
      name: 'Honda TMX 155 Motorcycle',
      category: 'Vehicle',
      year: '2020',
      condition: 'Excellent',
      currentValue: 65000,
      declaredValue: 60000,
      valueChange: 8.3,
      lastUpdated: '2024-02-15',
      documents: ['OR/CR', 'Insurance', 'Photos'],
      status: 'Verified',
      icon: Bike
    },
    {
      id: 2,
      name: 'MacBook Pro 13"',
      category: 'Electronics',
      year: '2022',
      condition: 'Good',
      currentValue: 35000,
      declaredValue: 40000,
      valueChange: -12.5,
      lastUpdated: '2024-02-10',
      documents: ['Receipt', 'Photos'],
      status: 'Verified',
      icon: Laptop
    },
    {
      id: 3,
      name: 'Samsung Refrigerator',
      category: 'Appliance',
      year: '2021',
      condition: 'Good',
      currentValue: 20000,
      declaredValue: 25000,
      valueChange: -20.0,
      lastUpdated: '2024-01-20',
      documents: ['Receipt', 'Warranty'],
      status: 'Pending Review',
      icon: Refrigerator
    },
    {
      id: 4,
      name: 'iPhone 14 Pro',
      category: 'Electronics',
      year: '2023',
      condition: 'Excellent',
      currentValue: 45000,
      declaredValue: 50000,
      valueChange: -10.0,
      lastUpdated: '2024-02-01',
      documents: ['Receipt', 'Photos'],
      status: 'Verified',
      icon: Smartphone
    }
  ];

  // Payment history
  const paymentHistory = [
    {
      id: 1,
      date: '2025-02-15',
      amount: 2500,
      loanId: 'LN-2024-012',
      loanName: 'Equipment Loan',
      status: 'Paid',
      method: 'GCash',
      dueDate: '2025-02-15',
      daysEarly: 0
    },
    {
      id: 2,
      date: '2025-02-10',
      amount: 1200,
      loanId: 'LN-2024-008',
      loanName: 'Working Capital',
      status: 'Paid',
      method: 'Bank Transfer',
      dueDate: '2025-02-20',
      daysEarly: 10
    },
    {
      id: 3,
      date: '2025-01-15',
      amount: 2500,
      loanId: 'LN-2024-012',
      loanName: 'Equipment Loan',
      status: 'Paid',
      method: 'GCash',
      dueDate: '2025-01-15',
      daysEarly: 0
    },
    {
      id: 4,
      date: '2025-01-20',
      amount: 1200,
      loanId: 'LN-2024-008',
      loanName: 'Working Capital',
      status: 'Paid',
      method: 'Maya',
      dueDate: '2025-01-20',
      daysEarly: 0
    },
    {
      id: 5,
      date: '2024-12-15',
      amount: 2500,
      loanId: 'LN-2024-012',
      loanName: 'Equipment Loan',
      status: 'Paid',
      method: 'GCash',
      dueDate: '2024-12-15',
      daysEarly: 0
    }
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      label: 'Payment Reliability',
      score: 100,
      description: 'Perfect on-time payment record',
      color: 'green'
    },
    {
      label: 'Asset Coverage Ratio',
      score: 85,
      description: 'Strong collateral backing',
      color: 'blue'
    },
    {
      label: 'Credit History Length',
      score: 78,
      description: '18 months of credit history',
      color: 'purple'
    },
    {
      label: 'Financial Stability',
      score: 92,
      description: 'Consistent income patterns',
      color: 'green'
    }
  ];

  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending Review': return 'bg-amber-100 text-amber-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Portfolio Overview</h1>
        <p className="text-slate-600">Track your assets, payment history, and financial performance</p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assets and History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Declared Assets */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Declared Assets</h3>
                  <p className="text-sm text-slate-600">Your movable asset portfolio</p>
                </div>
                <Button className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {declaredAssets.map((asset) => {
                const AssetIcon = asset.icon;
                return (
                  <div key={asset.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <AssetIcon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{asset.name}</h4>
                          <p className="text-sm text-slate-600">
                            {asset.category} • {asset.year} • {asset.condition}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-slate-500">Current Value</div>
                        <div className="font-semibold">{formatCurrency(asset.currentValue)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Declared Value</div>
                        <div className="font-semibold">{formatCurrency(asset.declaredValue)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Value Change</div>
                        <div className={`font-semibold ${getChangeColor(asset.valueChange)}`}>
                          {asset.valueChange >= 0 ? '+' : ''}{asset.valueChange}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Last Updated</div>
                        <div className="font-semibold text-xs">{asset.lastUpdated}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-1">
                        {asset.documents.map((doc, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {doc}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedAsset(asset)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Payment History */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
              <p className="text-sm text-slate-600">Recent loan payment transactions</p>
            </div>
            <div className="divide-y divide-slate-100">
              {paymentHistory.slice(0, 4).map((payment) => (
                <div key={payment.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{payment.loanName}</h4>
                        <p className="text-sm text-slate-600">
                          {payment.date} • {payment.method}
                          {payment.daysEarly > 0 && (
                            <span className="text-green-600 ml-2">({payment.daysEarly} days early)</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">ID: {payment.loanId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">{formatCurrency(payment.amount)}</div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Button variant="outline" className="w-full">
                View All Payments ({paymentHistory.length} total)
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Performance */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Performance Stats</h3>
              <p className="text-sm text-slate-600">Your creditworthiness indicators</p>
            </div>
            <div className="p-4 space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">{metric.label}</span>
                    <span className="text-sm font-bold text-slate-900">{metric.score}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.color === 'green' ? 'bg-green-500' :
                        metric.color === 'blue' ? 'bg-blue-500' :
                        metric.color === 'purple' ? 'bg-purple-500' :
                        'bg-amber-500'
                      }`}
                      style={{width: `${metric.score}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600">{metric.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Credit Limit Overview */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Credit Overview</h3>
            </div>
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-red-600 mb-1">₱75,000</div>
                <div className="text-sm text-slate-600">Available Credit</div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Limit:</span>
                  <span className="font-semibold">₱115,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Used:</span>
                  <span className="font-semibold">₱40,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Available:</span>
                  <span className="font-semibold text-green-600">₱75,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Utilization:</span>
                  <span className="font-semibold">35%</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2 my-4">
                <div className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full" style={{width: '35%'}}></div>
              </div>
              
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Request Increase
              </Button>
            </div>
          </Card>

          {/* Achievement Badge */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
            <div className="p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Perfect Payer</h3>
              <p className="text-sm text-slate-600 mb-3">
                You've made all payments on time for 6 months straight!
              </p>
              <Badge className="bg-amber-100 text-amber-800">
                Achievement Unlocked
              </Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Asset Details</h3>
              <button 
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900">{selectedAsset.name}</h4>
                <p className="text-sm text-slate-600">{selectedAsset.category} • {selectedAsset.year}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500">Current Value</div>
                  <div className="font-semibold">{formatCurrency(selectedAsset.currentValue)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Condition</div>
                  <div className="font-semibold">{selectedAsset.condition}</div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-slate-500 mb-2">Documents</div>
                <div className="flex flex-wrap gap-1">
                  {selectedAsset.documents.map((doc, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Asset
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Documents
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;