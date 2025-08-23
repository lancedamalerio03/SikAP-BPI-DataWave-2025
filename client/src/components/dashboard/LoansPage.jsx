// Updated LoansPage.jsx with multi-step requirements
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import simpleCache, { CACHE_KEYS, CACHE_TTL } from '../../utils/simpleCache';
import { 
  Plus, RefreshCw, Search, Filter, Calendar, AlertTriangle, CheckCircle,
  Upload, Download, Eye, HelpCircle, CreditCard, Clock, FileText,
  Leaf, Users, Shield, Package, MapPin, ArrowRight
} from 'lucide-react';

const LoansPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load loans on component mount and when user becomes available
  useEffect(() => {
    loadUserLoans();
  }, [user?.id]); // Re-run when user.id becomes available

  // Handle success messages
  useEffect(() => {
    if (location.state?.message) {
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 5000);
    }
  }, [location.state]);

  const loadUserLoans = async () => {
    setLoading(true);
    try {
      console.log('Loading user loans...');
      const [supabaseLoans, localStorageLoans] = await Promise.all([
        loadFromSupabase(),
        loadFromLocalStorage()
      ]);

      console.log('Supabase loans:', supabaseLoans);
      console.log('LocalStorage loans:', localStorageLoans);

      const allLoans = [...supabaseLoans, ...localStorageLoans];
      const uniqueLoans = deduplicateLoans(allLoans);
      
      console.log('Final loans after deduplication:', uniqueLoans);
      setLoans(uniqueLoans);
    } catch (error) {
      console.error('Error loading loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFromSupabase = async () => {
    try {
      // Check if we have supabase and user
      if (!user?.id) {
        console.log('No user ID available for Supabase query');
        return [];
      }

      // Check cache first
      const cacheKey = CACHE_KEYS.USER_LOANS(user.id);
      const cachedData = simpleCache.get(cacheKey);
      if (cachedData) {
        console.log('📦 Using cached loan data');
        return cachedData;
      }

      // Import supabase dynamically to avoid errors
      const { supabase } = await import('../../lib/supabase');
      
      if (!supabase) {
        console.log('Supabase not configured, skipping database load');
        return [];
      }

      console.log('Querying Supabase for user:', user.id);

      // Add timeout to prevent hanging - only fetch essential fields
      const queryPromise = supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20); // Limit results for faster loading

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      console.log('Supabase raw data:', data);

      const mappedLoans = (data || []).map(loan => ({
        id: loan.id,
        title: getLoanTitle(loan.loan_purpose),
        principal: loan.loan_amount,
        status: mapStatus(loan.status),
        statusColor: getStatusColor(loan.status),
        submittedAt: loan.created_at,
        loanPurpose: loan.loan_purpose,
        loanAmount: loan.loan_amount,
        loanTenor: loan.loan_tenor_months,
        repaymentFrequency: loan.repayment_frequency,
        urgency: loan.urgency,
        additionalInfo: loan.additional_information,
        aiDecision: loan.ai_decision,
        aiConfidence: loan.ai_confidence,
        aiReasoning: loan.ai_reasoning,
        estimatedTime: loan.estimated_processing_time,
        nextSteps: loan.next_steps ? JSON.parse(loan.next_steps) : [],
        message: loan.message || '',
        requirements: {
          documents: loan.documents_completed || false,
          esgCompliance: loan.esg_completed || false,
          assetDeclaration: loan.assets_completed || false
        },
        documents: [
          { name: 'Loan Agreement', status: 'Complete', date: '2024-02-01' },
          { name: 'Application Form', status: 'Complete', date: '2024-08-21' },
          { name: 'Required Documents', status: loan.documents_completed ? 'Complete' : 'Required' },
          { name: 'ESG Compliance Form', status: loan.esg_completed ? 'Complete' : 'Required' },
          { name: 'Asset Declaration', status: loan.assets_completed ? 'Complete' : 'Optional' }
        ],
        source: 'supabase'
      }));

      // Cache the mapped data
      simpleCache.set(cacheKey, mappedLoans, CACHE_TTL.USER_LOANS);
      
      return mappedLoans;
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      return [];
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const userApplications = JSON.parse(localStorage.getItem('userApplications') || '[]');
      console.log('Raw localStorage data:', userApplications);
      
      const mappedLoans = userApplications.map(app => ({
        id: app.id,
        title: getLoanTitle(app.loanData?.loan_purpose || app.loan_purpose),
        principal: app.loanData?.loan_amount || app.loan_amount || 0,
        status: mapStatus(app.status || 'pending'),
        statusColor: getStatusColor(app.status || 'pending'),
        submittedAt: app.submittedAt,
        loanPurpose: app.loanData?.loan_purpose || app.loan_purpose,
        loanAmount: app.loanData?.loan_amount || app.loan_amount,
        loanTenor: app.loanData?.loan_tenor_months || app.loan_tenor_months,
        repaymentFrequency: app.loanData?.repayment_frequency || app.repayment_frequency,
        urgency: app.loanData?.urgency || app.urgency,
        additionalInfo: app.loanData?.additional_information || app.additional_information,
        aiDecision: app.aiDecision,
        aiConfidence: app.aiConfidence,
        aiReasoning: app.aiReasoning,
        estimatedTime: app.estimatedTime,
        nextSteps: app.nextSteps || [],
        message: app.message || '',
        
        // Enhanced document tracking with new requirements (with fallbacks)
        requirements: {
          documents: app.documentsCompleted || app.requirements?.documents || false,
          esgCompliance: app.esgCompleted || app.requirements?.esgCompliance || false,
          assetDeclaration: app.assetsCompleted || app.requirements?.assetDeclaration || false
        },
        
        // Updated documents structure
        documents: [
          { name: 'Loan Agreement', status: 'Complete', date: '2024-02-01' },
          { name: 'Application Form', status: 'Complete', date: '2024-08-21' },
          { name: 'Required Documents', status: (app.documentsCompleted || app.requirements?.documents) ? 'Complete' : 'Required' },
          { name: 'ESG Compliance Form', status: (app.esgCompleted || app.requirements?.esgCompliance) ? 'Complete' : 'Required' },
          { name: 'Asset Declaration', status: (app.assetsCompleted || app.requirements?.assetDeclaration) ? 'Complete' : 'Optional' }
        ],
        source: 'localStorage'
      }));

      console.log('Mapped loans:', mappedLoans);
      return mappedLoans;

    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  };

  const deduplicateLoans = (loans) => {
    const seen = new Set();
    return loans.filter(loan => {
      if (seen.has(loan.id)) {
        return false;
      }
      seen.add(loan.id);
      return true;
    });
  };

  const refreshLoans = async () => {
    setRefreshing(true);
    // Clear cache to force fresh data
    if (user?.id) {
      simpleCache.delete(CACHE_KEYS.USER_LOANS(user.id));
    }
    await loadUserLoans();
    setRefreshing(false);
  };

  // Helper functions
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

  const mapStatus = (status) => {
    const statusMap = {
      'pending_documents': 'Pending Documents',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'processing': 'Processing',
      'pending_interview': 'Pending Interview',
      'under_review': 'Under Review',
      'pending': 'Pending Documents',
      'active': 'Active',
      'completed': 'Completed'
    };
    return statusMap[status] || status || 'Pending Documents';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending_documents': 'bg-amber-100 text-amber-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'processing': 'bg-blue-100 text-blue-800',
      'pending_interview': 'bg-purple-100 text-purple-800',
      'under_review': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-slate-100 text-slate-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const getDocumentStatusColor = (status) => {
    const colors = {
      'Complete': 'bg-green-100 text-green-800',
      'Required': 'bg-red-100 text-red-800',
      'Optional': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-amber-100 text-amber-800'
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  // Get pending requirements for a loan
  const getPendingRequirements = (loan) => {
    const pending = [];
    
    if (!loan.requirements?.documents) {
      pending.push('Documents');
    }
    if (!loan.requirements?.esgCompliance) {
      pending.push('ESG Compliance Form');
    }
    if (!loan.requirements?.assetDeclaration) {
      pending.push('Asset Declaration');
    }
    
    return pending;
  };

  // Generate action required message
  const getActionRequiredMessage = (loan) => {
    const pendingItems = getPendingRequirements(loan);
    
    if (pendingItems.length === 0) {
      return "All requirements completed! Your application is being processed.";
    }
    
    const pendingText = pendingItems.map(item => `Pending ${item}`).join(', ');
    return `Please complete: ${pendingText}`;
  };

  // Event handlers
  const handleUploadDocument = (loanId) => {
    navigate(`/loans/${loanId}/documents`); // Match existing route
  };

  const handleESGCompliance = (loanId) => {
    navigate(`/esg-compliance/${loanId}`);
  };

  const handleAssetDeclaration = (loanId) => {
    navigate(`/asset-declaration/${loanId}`);
  };

  const handleDownloadStatement = (loanId) => {
    // Implementation for downloading statement
    console.log('Downloading statement for loan:', loanId);
  };

  const handleGetHelp = (loanId) => {
    navigate('/dashboard/chatbot', { state: { loanId } });
  };

  const handleViewDetails = (loanId) => {
    navigate(`/loans/${loanId}/documents`); // Match existing route
  };

  const handleMakePayment = (loanId) => {
    // Implementation for payment
    console.log('Making payment for loan:', loanId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Loans</h1>
            <p className="text-slate-600">Manage your loan applications and active loans</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" disabled>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button disabled>
              <Plus className="w-4 h-4 mr-2" />
              New Loan Application
            </Button>
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-6 bg-slate-200 rounded w-48"></div>
                      <div className="h-5 bg-slate-200 rounded w-20"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j}>
                          <div className="h-4 bg-slate-200 rounded w-20 mb-1"></div>
                          <div className="h-5 bg-slate-200 rounded w-24"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {location.state?.message && (
        <div className={`p-4 rounded-lg border ${
          location.state.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span className="font-medium">{location.state.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Loans</h1>
          <p className="text-slate-600">Manage your loan applications and active loans</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={refreshLoans}
            variant="outline"
            className="flex items-center gap-2"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={() => navigate('/application')}
            className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Loan Application
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search loans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="mx-auto mb-4 text-slate-400" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No loans found</h3>
          <p className="text-slate-600 mb-6">
            {loans.length === 0 
              ? "You haven't applied for any loans yet." 
              : "No loans match your current filters."
            }
          </p>
          <Button
            onClick={() => navigate('/application')}
            className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Apply for a Loan
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredLoans.map((loan) => {
            const pendingRequirements = getPendingRequirements(loan);
            const isPendingDocuments = loan.status === 'Pending Documents' || loan.status.toLowerCase() === 'pending_documents';
            
            return (
              <Card key={loan.id} className="overflow-hidden">
                {/* Loan Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{loan.title}</h3>
                        <Badge className={loan.statusColor} size="sm">
                          {loan.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-slate-600">Loan Amount</div>
                          <div className="font-semibold text-slate-900">₱{loan.principal?.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Application ID</div>
                          <div className="font-mono text-slate-900">{loan.id}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Applied</div>
                          <div className="text-slate-900">{formatDate(loan.submittedAt)}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">AI Decision</div>
                          <div className={`font-medium ${
                            loan.aiDecision === 'ACCEPT' ? 'text-green-600' : 
                            loan.aiDecision === 'REJECT' ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {loan.aiDecision || 'Pending'} 
                            {loan.aiConfidence && ` (${loan.aiConfidence}% confidence)`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assessment */}
                {loan.aiReasoning && (
                  <div className="p-6 border-b border-slate-200 bg-blue-50">
                    <h4 className="font-medium text-blue-900 mb-2">AI Assessment</h4>
                    <p className="text-sm text-blue-700 mb-3">{loan.aiReasoning}</p>
                    <div className="flex items-start gap-4 text-sm">
                      {loan.estimatedTime && (
                        <p className="text-sm text-blue-600">
                          <strong>Estimated processing time:</strong> {loan.estimatedTime}
                        </p>
                      )}
                      {loan.nextSteps && loan.nextSteps.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-blue-900 mb-2">Next Steps:</p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {loan.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Required Alert */}
                {isPendingDocuments && (
                  <div className="p-4 bg-amber-50 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="font-medium text-amber-900">Action Required</h4>
                        <p className="text-sm text-amber-700">
                          {getActionRequiredMessage(loan)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Requirements Status */}
                {isPendingDocuments && (
                  <div className="p-6 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-4">Application Requirements</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Documents */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                        loan.requirements?.documents 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          loan.requirements?.documents 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white'
                        }`}>
                          {loan.requirements?.documents ? <CheckCircle size={16} /> : <FileText size={16} />}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Documents</div>
                          <div className="text-sm text-slate-600">
                            {loan.requirements?.documents ? 'Required docs uploaded' : 'Pending Documents'}
                          </div>
                        </div>
                      </div>

                      {/* ESG Compliance */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                        loan.requirements?.esgCompliance 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-amber-200 bg-amber-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          loan.requirements?.esgCompliance 
                            ? 'bg-green-600 text-white' 
                            : 'bg-amber-600 text-white'
                        }`}>
                          {loan.requirements?.esgCompliance ? <CheckCircle size={16} /> : <Leaf size={16} />}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">ESG Compliance</div>
                          <div className="text-sm text-slate-600">
                            {loan.requirements?.esgCompliance ? 'Form completed' : 'Pending ESG Compliance Form'}
                          </div>
                        </div>
                      </div>

                      {/* Asset Declaration */}
                      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                        loan.requirements?.assetDeclaration 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-blue-200 bg-blue-50'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          loan.requirements?.assetDeclaration 
                            ? 'bg-green-600 text-white' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          {loan.requirements?.assetDeclaration ? <CheckCircle size={16} /> : <Package size={16} />}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Asset Declaration</div>
                          <div className="text-sm text-slate-600">
                            {loan.requirements?.assetDeclaration ? 'Assets declared' : 'Pending Asset Declaration'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                            
                {/* Documents Section */}
                <div className="p-6 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-4">Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {loan.documents.map((doc, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 text-sm">{doc.name}</div>
                          {doc.date && (
                            <div className="text-xs text-slate-600">{formatDate(doc.date)}</div>
                          )}
                        </div>
                        <Badge className={getDocumentStatusColor(doc.status)} size="sm">
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {loan.status === 'Active' && loan.outstanding > 0 && (
                      <Button
                        onClick={() => handleMakePayment(loan.id)}
                        className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Make Payment
                      </Button>
                    )}
                    
                    {isPendingDocuments && !loan.requirements?.documents && (
                      <Button
                        onClick={() => handleUploadDocument(loan.id)}
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </Button>
                    )}

                    {isPendingDocuments && !loan.requirements?.esgCompliance && (
                      <Button
                        onClick={() => handleESGCompliance(loan.id)}
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Leaf className="w-4 h-4 mr-2" />
                        Answer ESG Compliance Form
                      </Button>
                    )}

                    {isPendingDocuments && !loan.requirements?.assetDeclaration && (
                      <Button
                        onClick={() => handleAssetDeclaration(loan.id)}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Declare Assets
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => handleDownloadStatement(loan.id)}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Statement
                    </Button>
                    
                    <Button
                      onClick={() => handleGetHelp(loan.id)}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Get Help
                    </Button>

                    <Button
                      onClick={() => handleViewDetails(loan.id)}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoansPage;