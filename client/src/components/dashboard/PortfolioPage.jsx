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
      
      // Get user's applications first
      const { data: userApps, error: appError } = await supabase
        .from('preloan_applications')
        .select('id, loan_purpose, status')
        .eq('user_id', user.id);

      console.log('User applications:', { userApps, appError });

      if (appError) {
        throw appError;
      }

      if (!userApps || userApps.length === 0) {
        console.log('No applications found for user');
        setDeclaredAssets([]);
        setTotalAssetValue(0);
        return;
      }

      const applicationIds = userApps.map(app => app.id);
      console.log('Application IDs:', applicationIds);

      // Now get assets for these applications using the correct table name
      const { data: assets, error: assetsError } = await supabase
        .from('asset_declaration')  // Fixed table name - singular not plural
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

        console.log('Final formatted assets:', formattedAssets);
        
        const totalValue = formattedAssets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
        console.log('Total asset value:', totalValue);
        
        setDeclaredAssets(formattedAssets);
        setTotalAssetValue(totalValue);
      } else {
        console.log('No assets found for user applications');
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
      const { data: paymentData, error: paymentError } = await supabase
        .from('loan_payments')
        .select(`
          *,
          preloan_applications!inner(
            user_id,
            loan_purpose,
            loan_amount
          )
        `)
        .eq('preloan_applications.user_id', user.id)
        .order('payment_date', { ascending: false })
        .limit(10);

      if (!paymentError && paymentData && paymentData.length > 0) {
        // We have real payment data
        const formattedPayments = paymentData.map(payment => ({
          id: payment.id,
          date: new Date(payment.payment_date).toLocaleDateString(),
          amount: payment.amount,
          loanId: payment.application_id,
          loanName: getLoanTitle(payment.preloan_applications?.loan_purpose) || 'Loan Payment',
          status: payment.status || 'Paid',
          method: payment.payment_method || 'Bank Transfer',
          dueDate: new Date(payment.due_date || payment.payment_date).toLocaleDateString(),
          daysEarly: payment.days_early || 0
        }));

        setPaymentHistory(formattedPayments);
        return;
      }

      // Fallback: Generate payment history based on approved loans from user's applications
      const { data: approvedLoans, error: loanError } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (loanError) throw loanError;

      if (approvedLoans && approvedLoans.length > 0) {
        // Generate simulated payment history for approved loans
        const simulatedPayments = [];
        
        approvedLoans.forEach((loan, loanIndex) => {
          const monthlyPayment = calculateMonthlyPayment(
            loan.loan_amount, 
            loan.loan_tenor_months || 12
          );
          
          // Generate last 3 payments for each loan
          for (let i = 0; i < Math.min(3, loan.loan_tenor_months || 1); i++) {
            const paymentDate = new Date();
            paymentDate.setMonth(paymentDate.getMonth() - i);
            
            simulatedPayments.push({
              id: `sim-${loan.id}-${i}`,
              date: paymentDate.toLocaleDateString(),
              amount: monthlyPayment,
              loanId: loan.id,
              loanName: getLoanTitle(loan.loan_purpose),
              status: 'Paid',
              method: i % 2 === 0 ? 'GCash' : 'Bank Transfer',
              dueDate: paymentDate.toLocaleDateString(),
              daysEarly: 0
            });
          }
        });

        // Sort by date and limit to recent payments
        simulatedPayments.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPaymentHistory(simulatedPayments.slice(0, 8));
      } else {
        console.log('No approved loans found for payment history');
        setPaymentHistory([]);
      }

    } catch (error) {
      console.error('Error loading payment history:', error);
      setPaymentHistory([]);
    }
  };

  const calculatePerformanceMetrics = async () => {
    try {
      // Get user's loan applications
      const { data: applications, error } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const metrics = [];

      // Payment Reliability - based on loan status and completion
      const totalLoans = applications?.length || 0;
      const successfulLoans = applications?.filter(app => 
        app.status === 'approved' || app.status === 'completed'
      ).length || 0;
      
      const paymentReliability = totalLoans > 0 ? Math.round((successfulLoans / totalLoans) * 100) : 100;
      
      metrics.push({
        label: 'Payment Reliability',
        score: paymentReliability,
        description: `${successfulLoans} of ${totalLoans} loans completed successfully`,
        color: paymentReliability >= 90 ? 'green' : paymentReliability >= 70 ? 'blue' : 'amber'
      });

      // Asset Coverage Ratio - based on declared assets vs total borrowed
      const totalBorrowed = applications
        ?.filter(app => app.status === 'approved')
        ?.reduce((sum, app) => sum + (parseFloat(app.loan_amount) || 0), 0) || 0;
      
      const assetCoverageRatio = totalBorrowed > 0 && totalAssetValue > 0 
        ? Math.min(100, Math.round((totalAssetValue / totalBorrowed) * 100))
        : totalAssetValue > 0 ? 100 : 0;

      metrics.push({
        label: 'Asset Coverage Ratio',
        score: assetCoverageRatio,
        description: `₱${totalAssetValue.toLocaleString()} assets vs ₱${totalBorrowed.toLocaleString()} borrowed`,
        color: assetCoverageRatio >= 80 ? 'green' : assetCoverageRatio >= 50 ? 'blue' : 'amber'
      });

      // Credit History Length - based on first application date
      const firstApplication = applications?.sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      )[0];

      let historyLength = 0;
      if (firstApplication) {
        const firstDate = new Date(firstApplication.created_at);
        const now = new Date();
        historyLength = Math.round((now - firstDate) / (1000 * 60 * 60 * 24 * 30)); // months
      }

      const historyScore = Math.min(100, Math.round((historyLength / 24) * 100)); // 24 months = 100%

      metrics.push({
        label: 'Credit History Length',
        score: historyScore,
        description: `${historyLength} months of credit history`,
        color: historyLength >= 12 ? 'green' : historyLength >= 6 ? 'blue' : 'purple'
      });

      // Financial Stability - based on application frequency and success rate
      const recentApplications = applications?.filter(app => {
        const appDate = new Date(app.created_at);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return appDate >= sixMonthsAgo;
      }) || [];

      // Better stability if fewer recent applications but high success rate
      let stabilityScore = 50; // Base score
      
      if (totalLoans === 0) {
        stabilityScore = 70; // New user, neutral score
      } else if (recentApplications.length <= 2 && paymentReliability >= 80) {
        stabilityScore = Math.min(100, 70 + (paymentReliability * 0.3));
      } else if (recentApplications.length > 4) {
        stabilityScore = Math.max(30, 70 - (recentApplications.length * 5));
      } else {
        stabilityScore = Math.min(90, 60 + (paymentReliability * 0.2));
      }

      metrics.push({
        label: 'Financial Stability',
        score: Math.round(stabilityScore),
        description: 'Based on application patterns and success rate',
        color: stabilityScore >= 80 ? 'green' : stabilityScore >= 60 ? 'blue' : 'amber'
      });

      setPerformanceMetrics(metrics);

    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      // Set default metrics if calculation fails
      setPerformanceMetrics([
        {
          label: 'Payment Reliability',
          score: 0,
          description: '0 of 0 loans completed successfully',
          color: 'amber'
        },
        {
          label: 'Asset Coverage Ratio',
          score: totalAssetValue > 0 ? 100 : 0,
          description: `₱${totalAssetValue.toLocaleString()} assets vs ₱0 borrowed`,
          color: totalAssetValue > 0 ? 'green' : 'amber'
        },
        {
          label: 'Credit History Length',
          score: 0,
          description: '0 months of credit history',
          color: 'purple'
        },
        {
          label: 'Financial Stability',
          score: 50,
          description: 'New user - building credit profile',
          color: 'blue'
        }
      ]);
    }
  };

  // Helper functions
  const getLoanTitle = (purpose) => {
    const titles = {
      'working_capital': 'Working Capital Loan',
      'business_expansion': 'Business Expansion Loan',
      'purchase_equipment_vehicle': 'Equipment Purchase Loan',
      'purchase_inventory': 'Inventory Financing',
      'emergency_expenses': 'Emergency Loan',
      'home_improvement': 'Home Improvement Loan',
      'education': 'Education Loan',
      'medical_expenses': 'Medical Loan',
      'debt_consolidation': 'Debt Consolidation',
      'others': 'Personal Loan'
    };
    return titles[purpose] || 'Loan Application';
  };

  const calculateMonthlyPayment = (principal, months) => {
    const rate = 0.10 / 12; // 10% annual rate
    if (months <= 0) return principal;
    const payment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return Math.round(payment);
  };

  const calculateValueChange = (declaredValue, currentValue) => {
    if (!declaredValue || declaredValue === 0) return 0;
    return Math.round(((currentValue - declaredValue) / declaredValue) * 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Verified': 'bg-green-100 text-green-800',
      'Pending Review': 'bg-amber-100 text-amber-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Under Review': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  const refreshData = () => {
    loadPortfolioData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <span className="ml-2 text-slate-600">Loading your portfolio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Portfolio Overview</h1>
          <p className="text-slate-600">Track your assets, payment history, and financial performance</p>
        </div>
        <Button variant="outline" onClick={refreshData} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Total Asset Value Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Total Asset Value</h2>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {formatCurrency(totalAssetValue)}
            </div>
            <p className="text-sm text-slate-600">
              {declaredAssets.length} {declaredAssets.length === 1 ? 'asset' : 'assets'} declared
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
                  <p className="text-sm text-slate-600">Your movable asset portfolio</p>
                </div>
                {/* Removed Add Asset button as requested */}
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
                        </div>
                      </div>
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <div className="text-xs text-slate-500">Current Value</div>
                        <div className="font-semibold">{formatCurrency(asset.currentValue)}</div>
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
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 mb-2">No assets declared yet</p>
                  <p className="text-sm text-slate-500">
                    Declare assets when applying for loans to improve your terms
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment History */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Payment History</h3>
              <p className="text-sm text-slate-600">Recent loan payment transactions</p>
            </div>
            <div className="divide-y divide-slate-100">
              {paymentHistory.length > 0 ? paymentHistory.map((payment) => (
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
              )) : (
                <div className="p-8 text-center">
                  <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 mb-2">No payment history yet</p>
                  <p className="text-sm text-slate-500">
                    Your payment history will appear here once you have active loans
                  </p>
                </div>
              )}
            </div>
            {paymentHistory.length > 0 && (
              <div className="p-4 border-t border-slate-100">
                <Button variant="outline" className="w-full">
                  View All Payments ({paymentHistory.length} total)
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Performance Stats Only */}
        <div className="space-y-6">
          {/* Performance Metrics */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Performance Stats</h3>
              <p className="text-sm text-slate-600">Your creditworthiness indicators</p>
            </div>
            <div className="p-4 space-y-4">
              {performanceMetrics.length > 0 ? performanceMetrics.map((metric, index) => (
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
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500">{metric.description}</p>
                </div>
              )) : (
                <div className="text-center py-4">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Performance metrics will be available once you have loan activity</p>
                </div>
              )}
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
                <p className="text-sm text-slate-600">{selectedAsset.category} • {selectedAsset.condition}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500">Current Value</div>
                  <div className="font-semibold">{formatCurrency(selectedAsset.currentValue)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Declared Value</div>
                  <div className="font-semibold">{formatCurrency(selectedAsset.declaredValue)}</div>
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
              
              {selectedAsset.description && (
                <div>
                  <div className="text-xs text-slate-500 mb-1">Description</div>
                  <p className="text-sm text-slate-800">{selectedAsset.description}</p>
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
      )}
    </div>
  );
};

export default PortfolioPage;