// client/src/components/dashboard/PortfolioPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  Package,
  CheckCircle, 
  X,
  Eye, 
  Edit,
  DollarSign,
  Calendar,
  Car,
  Laptop,
  Home,
  Gem,
  Music,
  Trophy,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';

const PortfolioPage = () => {
  const { user } = useAuth();
  
  // State for dynamic data
  const [loading, setLoading] = useState(true);
  const [declaredAssets, setDeclaredAssets] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [totalAssetValue, setTotalAssetValue] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Asset category icons mapping
  const getAssetIcon = (category) => {
    const iconMap = {
      'vehicle': Car,
      'equipment': Package,
      'electronics': Laptop,
      'appliances': Home,
      'furniture': Home,
      'jewelry': Gem,
      'musical': Music,
      'sports': Trophy,
      'other': Package
    };
    return iconMap[category] || Package;
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user?.id) {
      loadPortfolioData();
    }
  }, [user?.id]);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      
      // Load data in parallel
      await Promise.all([
        loadDeclaredAssets(),
        loadPaymentHistory(),
        calculatePerformanceMetrics()
      ]);
      
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDeclaredAssets = async () => {
    try {
      console.log('Loading declared assets for user:', user.id);
      
      // UPDATED: Only get approved applications
      const { data: userApps, error: appError } = await supabase
        .from('preloan_applications')
        .select('id, loan_purpose, status')
        .eq('user_id', user.id)
        .eq('status', 'approved'); // FILTER: Only approved applications

      console.log('User applications (approved only):', { userApps, appError });

      if (appError) {
        throw appError;
      }

      if (!userApps || userApps.length === 0) {
        console.log('No approved applications found for user');
        setDeclaredAssets([]);
        setTotalAssetValue(0);
        return;
      }

      const applicationIds = userApps.map(app => app.id);
      console.log('Approved Application IDs:', applicationIds);

      // Now get assets for these approved applications only
      const { data: assets, error: assetsError } = await supabase
        .from('asset_declaration')
        .select('*')
        .in('application_id', applicationIds)
        .order('created_at', { ascending: false });

      console.log('Assets query result:', { assets, assetsError });

      if (assetsError) {
        throw assetsError;
      }

      if (assets && assets.length > 0) {
        // Create a map of applications for easy lookup
        const appsMap = {};
        userApps.forEach(app => {
          appsMap[app.id] = app;
        });

        const formattedAssets = assets.map(asset => {
          const relatedApp = appsMap[asset.application_id];
          
          return {
            id: asset.id,
            name: asset.asset_name || 'Unnamed Asset',
            category: asset.category || 'other',
            condition: asset.condition || 'good',
            currentValue: asset.valuation_price || asset.estimated_value || 0,
            declaredValue: asset.estimated_value || 0,
            valueChange: calculateValueChange(asset.estimated_value, asset.valuation_price || asset.estimated_value),
            lastUpdated: new Date(asset.created_at).toLocaleDateString(),
            documents: ['Asset Declaration Form'],
            status: 'Verified',
            icon: getAssetIcon(asset.category || 'other'),
            age: asset.age || 0,
            description: asset.description || '',
            applicationId: asset.application_id,
            loanPurpose: relatedApp?.loan_purpose
          };
        });

        console.log('Final formatted assets (approved apps only):', formattedAssets);
        
        const totalValue = formattedAssets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
        console.log('Total asset value (approved apps only):', totalValue);
        
        setDeclaredAssets(formattedAssets);
        setTotalAssetValue(totalValue);
      } else {
        console.log('No assets found for approved applications');
        setDeclaredAssets([]);
        setTotalAssetValue(0);
      }

    } catch (error) {
      console.error('Error loading declared assets:', error);
      setDeclaredAssets([]);
      setTotalAssetValue(0);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      // Try to load from a payments table if it exists, using proper joins
      // UPDATED: Only get payments for approved applications
      const { data: paymentData, error: paymentError } = await supabase
        .from('loan_payments')
        .select(`
          *,
          preloan_applications!inner(
            user_id,
            loan_purpose,
            loan_amount,
            status
          )
        `)
        .eq('preloan_applications.user_id', user.id)
        .eq('preloan_applications.status', 'approved') // FILTER: Only approved applications
        .order('payment_date', { ascending: false })
        .limit(10);

      if (!paymentError && paymentData && paymentData.length > 0) {
        // We have real payment data
        const formattedPayments = paymentData.map(payment => ({
          id: payment.id,
          type: payment.payment_type || 'Inventory Financing',
          amount: payment.amount,
          date: payment.payment_date,
          method: payment.payment_method || 'GCash',
          status: payment.status || 'Paid',
          transactionId: payment.transaction_id || `ID: ${payment.id}`,
          loanPurpose: payment.preloan_applications.loan_purpose
        }));

        setPaymentHistory(formattedPayments);
        return;
      }

      // Fallback to mock data if no payments table exists
      console.log('No payment data found, using mock data');
      setPaymentHistory([
        {
          id: 1,
          type: 'Inventory Financing',
          amount: 4614,
          date: '2025-08-25',
          method: 'GCash',
          status: 'Paid',
          transactionId: 'ID: c7442a42-afcf-4b07-8920-a6e89be5540e'
        },
        {
          id: 2,
          type: 'Inventory Financing',
          amount: 4614,
          date: '2025-07-25',
          method: 'Bank Transfer',
          status: 'Paid',
          transactionId: 'ID: c7442a42-afcf-4b07-8920-a6e89be5540e'
        },
        {
          id: 3,
          type: 'Inventory Financing',
          amount: 4614,
          date: '2025-06-25',
          method: 'GCash',
          status: 'Paid',
          transactionId: 'ID: c7442a42-afcf-4b07-8920-a6e89be5540e'
        }
      ]);

    } catch (error) {
      console.error('Error loading payment history:', error);
      setPaymentHistory([]);
    }
  };

  const calculatePerformanceMetrics = async () => {
    try {
      // UPDATED: Only calculate metrics for approved applications
      const { data: approvedApps, error } = await supabase
        .from('preloan_applications')
        .select('id, loan_amount, created_at, status')
        .eq('user_id', user.id)
        .eq('status', 'approved'); // FILTER: Only approved applications

      if (error) throw error;

      // Mock performance metrics (would be calculated from real data)
      const mockMetrics = [
        {
          label: 'Payment Reliability',
          value: 33,
          description: '1 of 3 loans completed successfully',
          color: 'text-amber-600'
        },
        {
          label: 'Asset Coverage Ratio',
          value: 0,
          description: `₱0 assets vs ₱90,000 borrowed`,
          color: 'text-red-600'
        },
        {
          label: 'Credit History Length',
          value: 0,
          description: '0 months of credit history',
          color: 'text-slate-600'
        },
        {
          label: 'Financial Stability',
          value: 67,
          description: 'Based on application patterns and success rate',
          color: 'text-green-600'
        }
      ];

      setPerformanceMetrics(mockMetrics);

    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      setPerformanceMetrics([]);
    }
  };

  // Helper functions
  const calculateValueChange = (originalValue, currentValue) => {
    if (!originalValue || originalValue === 0) return 0;
    return ((currentValue - originalValue) / originalValue) * 100;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Verified': 'bg-green-100 text-green-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Expired': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const handleRefresh = () => {
    loadPortfolioData();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-slate-600">Loading portfolio...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Overview</h1>
          <p className="text-slate-600 mt-1">
            Track your assets, payment history, and financial performance from approved loans
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Total Asset Value Card */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Total Asset Value</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {formatCurrency(totalAssetValue)}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {declaredAssets.length} {declaredAssets.length === 1 ? 'asset' : 'assets'} declared from approved loans
            </p>
          </div>
          <div className="p-4 bg-blue-100 rounded-full">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assets and Payment History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Declared Assets */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Declared Assets</h3>
                  <p className="text-sm text-slate-600">Assets from approved loan applications</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {declaredAssets.length > 0 ? declaredAssets.map((asset) => {
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
                            {asset.category} • {asset.condition} • Updated {asset.lastUpdated}
                          </p>
                          {asset.loanPurpose && (
                            <p className="text-xs text-blue-600 mt-1">
                              From: {asset.loanPurpose} loan
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-xs text-slate-500">Current Value</div>
                          <div className="font-semibold text-slate-900">
                            {formatCurrency(asset.currentValue)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Last Updated</div>
                          <div className="text-sm text-slate-700">{asset.lastUpdated}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-slate-900 mb-1">No Assets Found</h4>
                  <p className="text-slate-600 mb-4">
                    Assets will appear here once you have approved loan applications with declared assets.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment History */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
              <p className="text-sm text-slate-600">Recent loan payment transactions from approved loans</p>
            </div>
            <div className="divide-y divide-slate-100">
              {paymentHistory.length > 0 ? paymentHistory.slice(0, 3).map((payment) => (
                <div key={payment.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{payment.type}</h4>
                        <p className="text-sm text-slate-600">
                          {new Date(payment.date).toLocaleDateString()} • {payment.method}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{payment.transactionId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        {formatCurrency(payment.amount)}
                      </div>
                      <Badge className={getPaymentStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center">
                  <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-slate-900 mb-1">No Payment History</h4>
                  <p className="text-slate-600">
                    Payment history will appear here for approved loans.
                  </p>
                </div>
              )}
              
              {paymentHistory.length > 3 && (
                <div className="p-4 text-center border-t border-slate-100">
                  <Button variant="ghost" className="text-sm">
                    View All Payments ({paymentHistory.length} total)
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Performance Stats */}
        <div className="space-y-6">
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Performance Stats</h3>
              <p className="text-sm text-slate-600">Your creditworthiness indicators from approved loans</p>
            </div>
            <div className="p-4 space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-900">{metric.label}</span>
                    <span className={`text-lg font-bold ${metric.color}`}>
                      {typeof metric.value === 'number' && metric.value < 10 ? 
                        `${metric.value}%` : 
                        `${metric.value}${typeof metric.value === 'number' ? '%' : ''}`
                      }
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.color.includes('green') ? 'bg-green-600' :
                        metric.color.includes('amber') ? 'bg-amber-500' :
                        metric.color.includes('red') ? 'bg-red-500' :
                        'bg-slate-400'
                      }`}
                      style={{ width: `${Math.min(metric.value, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500">{metric.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <selectedAsset.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{selectedAsset.name}</h3>
                    <p className="text-sm text-slate-600">{selectedAsset.category} • {selectedAsset.condition}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedAsset(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Current Value</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {formatCurrency(selectedAsset.currentValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Declared Value</div>
                    <div className="text-lg font-semibold text-slate-900">
                      {formatCurrency(selectedAsset.declaredValue)}
                    </div>
                  </div>
                </div>

                {selectedAsset.age > 0 && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Age</div>
                    <div className="text-sm text-slate-800">{selectedAsset.age} years</div>
                  </div>
                )}

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
                
                {selectedAsset.description && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Description</div>
                    <p className="text-sm text-slate-800">{selectedAsset.description}</p>
                  </div>
                )}
                
                {selectedAsset.loanPurpose && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Associated Loan</div>
                    <p className="text-sm text-slate-800">{selectedAsset.loanPurpose}</p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => setSelectedAsset(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;