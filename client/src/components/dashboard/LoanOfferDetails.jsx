// client/src/components/dashboard/LoanOfferDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Shield, 
  FileText,
  DollarSign,
  Calendar,
  Package,
  AlertCircle,
  Download,
  Eye,
  Percent,
  Calculator,
  CreditCard,
  Info
} from 'lucide-react';

const LoanOfferDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loanOffer, setLoanOffer] = useState(null);
  const [applicationData, setApplicationData] = useState(null);
  const [assetData, setAssetData] = useState([]);

  useEffect(() => {
    if (applicationId && user) {
      loadLoanOfferDetails();
    }
  }, [applicationId, user]);

  const loadLoanOfferDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Load the preloan application data
      const { data: application, error: appError } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('id', applicationId)
        .eq('user_id', user.id) // Security check
        .single();

      if (appError) throw new Error('Failed to load application: ' + appError.message);
      if (!application) throw new Error('Application not found');

      setApplicationData(application);

      // 2. Load the loan plan (offer) data using the correct FK name
      const { data: loanPlan, error: planError } = await supabase
        .from('loan_plans')
        .select('*')
        .eq('application_id', applicationId) // Fixed: using application_id instead of applications_id
        .single();

      if (planError && planError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.warn('No loan plan found, this might be expected for some applications:', planError);
      }

      setLoanOffer(loanPlan);

      // 3. Load asset declaration data
      const { data: assets, error: assetError } = await supabase
        .from('asset_declaration')
        .select('*')
        .eq('application_id', applicationId);

      if (assetError) {
        console.warn('Error loading assets:', assetError);
      } else {
        setAssetData(assets || []);
      }

    } catch (error) {
      console.error('Error loading loan offer details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPercentage = (rate) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  const calculateMonthlyPayment = (principal, rate, months) => {
    const monthlyRate = rate / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  const getLoanStatusBadge = (status) => {
    const statusConfig = {
      'approved': { color: 'bg-green-100 text-green-800', label: 'Approved' },
      'pending': { color: 'bg-amber-100 text-amber-800', label: 'Pending' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      'processing': { color: 'bg-blue-100 text-blue-800', label: 'Processing' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getLoanTitle = (purpose) => {
    const titles = {
      'working_capital': 'Working Capital Loan',
      'business_expansion': 'Business Expansion Loan',
      'purchase_equipment_vehicle': 'Equipment Purchase Loan',
      'purchase_inventory': 'Inventory Purchase Loan',
      'emergency_expenses': 'Emergency Loan',
      'home_improvement': 'Home Improvement Loan',
      'education': 'Education Loan',
      'medical_expenses': 'Medical Loan',
      'debt_consolidation': 'Debt Consolidation Loan'
    };
    return titles[purpose] || 'Personal Loan';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading loan offer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/dashboard/loans')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Loans
            </Button>
          </div>
          
          <Card className="p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Loading Loan Details</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/dashboard/loans')}>Return to Loans</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <FileText className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Application Not Found</h3>
            <p className="text-slate-600 mb-4">The loan application you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard/loans')}>Return to Loans</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard/loans')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Loans
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {getLoanTitle(applicationData.loan_purpose)}
              </h1>
              <p className="text-slate-600">
                Application submitted on {formatDate(applicationData.created_at)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {getLoanStatusBadge(applicationData.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Loan Offer Summary (if available) */}
            {loanOffer && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Your Loan Offer</h2>
                    <p className="text-slate-600">Congratulations! Your loan has been approved.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Approved Amount</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatCurrency(loanOffer.principal_approved || applicationData.loan_amount)}
                    </div>
                    {loanOffer.principal_requested && loanOffer.principal_approved !== loanOffer.principal_requested && (
                      <div className="text-xs text-slate-600 mt-1">
                        Requested: {formatCurrency(loanOffer.principal_requested)}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Percent className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Interest Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatPercentage(loanOffer.rate_per_period || 0.10)}
                    </div>
                    <div className="text-xs text-slate-600">per period</div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Loan Term</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {applicationData.loan_tenor_months || 12}
                    </div>
                    <div className="text-xs text-slate-600">months</div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {loanOffer.periodic_payment && (
                    <div className="p-4 bg-slate-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-slate-600" />
                          <span className="font-semibold text-slate-900">Monthly Payment</span>
                        </div>
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(loanOffer.periodic_payment)}
                        </div>
                      </div>
                    </div>
                  )}

                  {loanOffer.total_payable && (
                    <div className="p-4 bg-slate-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Total Payable</span>
                        <div className="text-xl font-bold text-slate-900">
                          {formatCurrency(loanOffer.total_payable)}
                        </div>
                      </div>
                      {loanOffer.total_interest && (
                        <div className="text-sm text-slate-600 mt-1">
                          Total Interest: {formatCurrency(loanOffer.total_interest)}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bank Assessment Reasoning */}
                {loanOffer.reasoning && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      Bank Assessment
                    </h4>
                    <p className="text-sm text-slate-700">{loanOffer.reasoning}</p>
                  </div>
                )}

                {/* Loan Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Collateral Value:</span>
                    <div className="font-medium">
                      {loanOffer.collateral_total_loanable ? 
                        formatCurrency(loanOffer.collateral_total_loanable) : 'Not specified'}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-600">Product Type:</span>
                    <div className="font-medium">{loanOffer.product || 'Standard Loan'}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Payment Frequency:</span>
                    <div className="font-medium capitalize">{applicationData.repayment_frequency || 'Monthly'}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Recommended Income:</span>
                    <div className="font-medium">
                      {loanOffer.recommended_monthly_income ? 
                        formatCurrency(loanOffer.recommended_monthly_income) : 'Not specified'}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Application Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Application Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-slate-600">Loan Purpose</span>
                  <div className="font-medium text-slate-900 capitalize">
                    {applicationData.loan_purpose.replace(/_/g, ' ')}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-slate-600">Requested Amount</span>
                  <div className="font-medium text-slate-900">
                    {formatCurrency(applicationData.loan_amount)}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-slate-600">Urgency Level</span>
                  <div className="font-medium text-slate-900 capitalize">
                    {applicationData.urgency || 'Not specified'}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-slate-600">Repayment Frequency</span>
                  <div className="font-medium text-slate-900 capitalize">
                    {applicationData.repayment_frequency}
                  </div>
                </div>
              </div>

              {applicationData.additional_information && (
                <div className="mt-4">
                  <span className="text-sm text-slate-600">Additional Information</span>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                    {applicationData.additional_information}
                  </div>
                </div>
              )}
            </Card>

            {/* Asset Declaration - Show Bank Valuation */}
            {assetData.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Collateral Assets</h3>
                </div>
                
                <div className="space-y-3">
                  {assetData.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                      <div>
                        <div className="font-medium text-slate-900">{asset.asset_name}</div>
                        <div className="text-sm text-slate-600">
                          {asset.category} • {asset.condition} condition • {asset.age} years old
                        </div>
                        {asset.description && (
                          <div className="text-xs text-slate-500 mt-1">{asset.description}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600">Your Estimate</div>
                        <div className="font-medium text-slate-700">
                          {formatCurrency(asset.estimated_value)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Bank Collateral Valuation from loan_plans */}
                  {loanOffer?.collateral_total_loanable && (
                    <div className="pt-3 border-t bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            Bank's Collateral Valuation
                          </div>
                          <div className="text-sm text-slate-600">Final assessed loanable value</div>
                        </div>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(loanOffer.collateral_total_loanable)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span>Total Declared Value:</span>
                      <span>
                        {formatCurrency(assetData.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0))}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* AI Assessment */}
            {applicationData.ai_decision && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">AI Assessment</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-600">Decision</span>
                    <div className="font-medium capitalize">
                      {applicationData.ai_decision}
                      {applicationData.ai_confidence && (
                        <span className="ml-2 text-sm text-green-600">
                          ({Math.round(applicationData.ai_confidence * 100)}% confidence)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {applicationData.ai_reasoning && (
                    <div>
                      <span className="text-sm text-slate-600">AI Reasoning</span>
                      <div className="mt-1 text-sm text-slate-700 bg-blue-50 p-3 rounded-lg">
                        {applicationData.ai_reasoning}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Application Progress */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-900">Application Progress</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Application Submitted</div>
                    <div className="text-xs text-slate-500">{formatDate(applicationData.created_at)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    applicationData.ai_decision ? 'bg-green-500' : 'bg-amber-500'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium">AI Review</div>
                    <div className="text-xs text-slate-500">
                      {applicationData.ai_decision ? 'Completed' : 'In Progress'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    applicationData.status === 'approved' ? 'bg-green-500' : 
                    applicationData.status === 'rejected' ? 'bg-red-500' : 'bg-slate-300'
                  }`}></div>
                  <div>
                    <div className="text-sm font-medium">Final Decision</div>
                    <div className="text-xs text-slate-500 capitalize">{applicationData.status}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
              
              <div className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                
                {applicationData.status === 'approved' && (
                  <Button 
                    className="w-full justify-start bg-gradient-to-r from-red-600 to-amber-500 text-white" 
                    onClick={() => navigate('/dashboard/loans')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed with Loan
                  </Button>
                )}
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/dashboard/chatbot')}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Get Help
                </Button>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-amber-50">
              <h3 className="font-semibold text-slate-900 mb-3">Need Help?</h3>
              <div className="text-sm text-slate-600 space-y-2">
                <div>📞 (02) 8-888-SIKAP (74527)</div>
                <div>📧 support@sikap.ph</div>
                <div>💬 24/7 AI Assistant available</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanOfferDetails;