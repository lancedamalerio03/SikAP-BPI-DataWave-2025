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
  const [assetStatusRefreshing, setAssetStatusRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Debug function for console testing
  const debugAssetStatus = async (applicationId) => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }
    
    console.log('=== DEBUG ASSET STATUS ===');
    const result = await checkAssetDeclarationStatus(applicationId, user.id);
    console.log('Result:', result);
    console.log('=========================');
    return result;
  };

  // Make debug function available globally for testing
  if (typeof window !== 'undefined') {
    window.debugAssetStatus = debugAssetStatus;
  }

  // Load loans on component mount and when user becomes available
  useEffect(() => {
    // Clear cache on component mount to ensure fresh data
    if (user?.id) {
      console.log('Component mounted, clearing cache for fresh data...');
      simpleCache.delete(CACHE_KEYS.USER_LOANS(user.id));
    }
    loadUserLoans();
  }, [user?.id]); // Re-run when user.id becomes available

  // Refresh asset declaration status for all loans
  const refreshAssetDeclarationStatus = async () => {
    if (!user?.id || loans.length === 0) return;

    setAssetStatusRefreshing(true);
    try {
      console.log(`Refreshing asset declaration status for ${loans.length} loans`);
      
      // Clear cache to ensure fresh data
      simpleCache.delete(CACHE_KEYS.USER_LOANS(user.id));
      
      const updatedLoans = await Promise.all(
        loans.map(async (loan) => {
          const assetResult = await checkAssetDeclarationStatus(loan.id, user.id);
          
          return {
            ...loan,
            requirements: {
              ...loan.requirements,
              assetDeclaration: assetResult.status
            },
            documents: loan.documents.map(doc => 
              doc.name === 'Asset Declaration' 
                ? { 
                    ...doc, 
                    status: assetResult.status ? 'Complete' : 'Optional',
                    details: assetResult.details
                  }
                : doc
            ),
            // Store asset details for potential display
            assetDeclarationDetails: assetResult.details
          };
        })
      );

      console.log('Asset declaration status refresh completed');
      setLoans(updatedLoans);
    } catch (error) {
      console.error('Error refreshing asset declaration status:', error);
    } finally {
      setAssetStatusRefreshing(false);
    }
  };

  // Auto-refresh asset status every 30 seconds
  useEffect(() => {
    if (loans.length > 0) {
      const interval = setInterval(refreshAssetDeclarationStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [loans.length, user?.id]);

  // Refresh status when loans are loaded
  useEffect(() => {
    if (loans.length > 0 && user?.id) {
      console.log('Loans loaded, refreshing asset declaration status...');
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        refreshAssetDeclarationStatus();
      }, 100);
    }
  }, [loans.length, user?.id]);

  // Handle success messages and refresh data when returning from asset declaration
  useEffect(() => {
    if (location.state?.message) {
      // Check if the message indicates asset declaration was completed
      if (location.state.message.includes('Asset declaration completed')) {
        console.log('Asset declaration completed, clearing cache and refreshing data...');
        
        // Clear cache to force fresh data load
        if (user?.id) {
          // Clear the cache first
          simpleCache.delete(CACHE_KEYS.USER_LOANS(user.id));
          
          // Immediately update the local state to reflect completion
          console.log('Immediately updating local state to show asset declaration as complete...');
          setLoans(prevLoans => 
            prevLoans.map(loan => ({
              ...loan,
              requirements: {
                ...loan.requirements,
                assetDeclaration: true
              },
              documents: loan.documents.map(doc => 
                doc.name === 'Asset Declaration' 
                  ? { ...doc, status: 'Complete' }
                  : doc
              )
            }))
          );
          
          // Then force reload from database for accuracy
          loadUserLoans().then(() => {
            // After loans are loaded, refresh asset status specifically
            setTimeout(() => {
              console.log('Running secondary asset status refresh...');
              refreshAssetDeclarationStatus();
            }, 1000);
          });
        }
      }
      
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 5000);
    }
  }, [location.state, user?.id]);

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
        console.log('📦 Using cached loan data, but will verify asset status...');
        // Still return cached data but we'll refresh asset status separately
        return cachedData;
      }

      // Import supabase dynamically to avoid errors
      const { supabase } = await import('../../lib/supabase');
      
      if (!supabase) {
        console.log('Supabase not configured, skipping database load');
        return [];
      }

      console.log('Querying Supabase for user:', user.id);

      // Add timeout to prevent hanging - fetch all fields and order by latest updates
      const queryPromise = supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
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
      
      // Debug asset completion status
      if (data && data.length > 0) {
        data.forEach(loan => {
          console.log(`Loan ${loan.id} assets_completed:`, loan.assets_completed);
        });
      }

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

  // Get completed requirements count
  const getCompletedRequirementsCount = (loan) => {
    let count = 0;
    if (loan.requirements?.documents) count++;
    if (loan.requirements?.esgCompliance) count++;
    if (loan.requirements?.assetDeclaration) count++;
    return count;
  };

  // Check asset declaration status from database with detailed information
  const checkAssetDeclarationStatus = async (applicationId, userId) => {
    try {
      const { supabase } = await import('../../lib/supabase');
      
      if (!supabase) {
        console.log('Supabase not configured, falling back to stored status');
        return { status: false, details: null };
      }

      console.log(`Checking asset declaration for application: ${applicationId}, user: ${userId}`);

      // First, check the preloan_applications table for assets_completed flag
      // Force a fresh query without any caching
      const { data: loanData, error: loanError } = await supabase
        .from('preloan_applications')
        .select('assets_completed, updated_at, created_at')
        .eq('id', applicationId)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .single();

      if (loanError && loanError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking loan assets status:', loanError);
      }

      // Then check the asset_declarations table for actual declarations
      const { data: assetData, error: assetError } = await supabase
        .from('assets_declarations')
        .select('id, total_assets, total_value, created_at, declared_assets')
        .eq('applicationId', applicationId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (assetError && assetError.code !== 'PGRST116') {
        console.error('Error checking asset declarations:', assetError);
      }

      // Determine status based on both sources
      const hasAssetsCompleted = loanData?.assets_completed || false;
      const hasAssetDeclarations = assetData && assetData.length > 0;
      const isComplete = hasAssetsCompleted || hasAssetDeclarations;

      const details = hasAssetDeclarations ? {
        totalAssets: assetData[0].total_assets,
        totalValue: assetData[0].total_value,
        declaredAt: assetData[0].created_at,
        source: 'asset_declarations'
      } : hasAssetsCompleted ? {
        declaredAt: loanData.assets_declared_at,
        source: 'preloan_applications'
      } : null;

      console.log(`Asset declaration status for ${applicationId}: ${isComplete}`, {
        hasAssetsCompleted,
        hasAssetDeclarations,
        loanData: loanData ? { assets_completed: loanData.assets_completed } : 'not found',
        assetData: assetData ? `${assetData.length} records` : 'not found',
        details
      });

      return { status: isComplete, details };
    } catch (error) {
      console.error('Error checking asset declaration status:', error);
      return { status: false, details: null };
    }
  };

  // Generate action required message
  const getActionRequiredMessage = (loan) => {
    const pendingItems = getPendingRequirements(loan);
    
    if (pendingItems.length === 0) {
      return "All requirements completed! Your application is being processed.";
    }
    
    const pendingText = pendingItems.map(item => `${item}`).join(', ');
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
                    
                    {/* Primary Actions */}
                    {isPendingDocuments && !loan.requirements?.documents && (
                      <Button
                        onClick={() => handleUploadDocument(loan.id)}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Documents
                      </Button>
                    )}

                    {isPendingDocuments && !loan.requirements?.esgCompliance && (
                      <Button
                        onClick={() => handleESGCompliance(loan.id)}
                        className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
                      >
                        <Leaf className="w-4 h-4 mr-2" />
                        Complete ESG Form
                      </Button>
                    )}

                    {isPendingDocuments && !loan.requirements?.assetDeclaration && (
                      <Button
                        onClick={() => handleAssetDeclaration(loan.id)}
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 shadow-sm"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Declare Assets
                      </Button>
                    )}
                    
                    {/* Secondary Actions */}
                    <Button
                      onClick={() => handleViewDetails(loan.id)}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    <Button
                      onClick={() => handleDownloadStatement(loan.id)}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Statement
                    </Button>
                    
                    <Button
                      onClick={() => handleGetHelp(loan.id)}
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                </div>


                {/* Enhanced Requirements Checklist */}
                {isPendingDocuments && (
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-lg">Application Requirements Checklist</h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Complete all requirements to proceed with your application
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            {getCompletedRequirementsCount(loan)}/3
                          </div>
                          <div className="text-xs text-slate-500">Completed</div>
                        </div>
                        <button
                          onClick={refreshAssetDeclarationStatus}
                          disabled={assetStatusRefreshing}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Refresh status"
                        >
                          {assetStatusRefreshing ? (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Requirements Checklist */}
                    <div className="space-y-4">
                      {/* Documents */}
                      <div className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                        loan.requirements?.documents 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50 hover:border-red-300'
                      }`}>
                        {/* Checkbox */}
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          loan.requirements?.documents 
                            ? 'bg-green-600 border-green-600' 
                            : 'bg-white border-red-300 hover:border-red-400'
                        }`}>
                          {loan.requirements?.documents && (
                            <CheckCircle size={16} className="text-white" />
                          )}
                        </div>
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                          <FileText size={20} className="text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className={`font-semibold ${loan.requirements?.documents ? 'text-green-900' : 'text-slate-900'}`}>
                              Required Documents
                            </h5>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              loan.requirements?.documents ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {loan.requirements?.documents ? '✓ Complete' : 'Required'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {loan.requirements?.documents 
                              ? 'All required documents have been uploaded and verified' 
                              : 'Upload identity documents, proof of income, and other required files'
                            }
                          </p>
                          {!loan.requirements?.documents && (
                            <div className="mt-2">
                              <span className="text-xs text-red-600 font-medium">⚠ Action needed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ESG Compliance */}
                      <div className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                        loan.requirements?.esgCompliance 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-amber-200 bg-amber-50 hover:border-amber-300'
                      }`}>
                        {/* Checkbox */}
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          loan.requirements?.esgCompliance 
                            ? 'bg-green-600 border-green-600' 
                            : 'bg-white border-amber-300 hover:border-amber-400'
                        }`}>
                          {loan.requirements?.esgCompliance && (
                            <CheckCircle size={16} className="text-white" />
                          )}
                        </div>
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Leaf size={20} className="text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className={`font-semibold ${loan.requirements?.esgCompliance ? 'text-green-900' : 'text-slate-900'}`}>
                              ESG Compliance Form
                            </h5>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              loan.requirements?.esgCompliance ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {loan.requirements?.esgCompliance ? '✓ Complete' : 'Required'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {loan.requirements?.esgCompliance 
                              ? 'Environmental, Social, and Governance compliance form completed' 
                              : 'Complete the ESG compliance assessment to meet sustainability requirements'
                            }
                          </p>
                          {!loan.requirements?.esgCompliance && (
                            <div className="mt-2">
                              <span className="text-xs text-amber-600 font-medium">⚠ Action needed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Asset Declaration */}
                      <div className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                        loan.requirements?.assetDeclaration 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-blue-200 bg-blue-50 hover:border-blue-300'
                      }`}>
                        {/* Checkbox */}
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                          loan.requirements?.assetDeclaration 
                            ? 'bg-green-600 border-green-600' 
                            : 'bg-white border-blue-300 hover:border-blue-400'
                        }`}>
                          {loan.requirements?.assetDeclaration && (
                            <CheckCircle size={16} className="text-white" />
                          )}
                        </div>
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Package size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className={`font-semibold ${loan.requirements?.assetDeclaration ? 'text-green-900' : 'text-slate-900'}`}>
                              Asset Declaration
                            </h5>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              loan.requirements?.assetDeclaration ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {loan.requirements?.assetDeclaration ? '✓ Complete' : 'Optional'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {loan.requirements?.assetDeclaration 
                              ? 'Assets have been declared and can be used as collateral' 
                              : 'Declare assets to potentially improve loan terms and qualify for better rates'
                            }
                          </p>
                          {loan.requirements?.assetDeclaration && loan.assetDeclarationDetails && (
                            <div className="mt-2 p-2 bg-green-100 rounded-lg">
                              <div className="text-xs text-green-800">
                                {loan.assetDeclarationDetails.totalAssets && (
                                  <span className="mr-3">📦 {loan.assetDeclarationDetails.totalAssets} assets</span>
                                )}
                                {loan.assetDeclarationDetails.totalValue && (
                                  <span className="mr-3">💰 ₱{loan.assetDeclarationDetails.totalValue.toLocaleString()}</span>
                                )}
                                {loan.assetDeclarationDetails.declaredAt && (
                                  <span>📅 {new Date(loan.assetDeclarationDetails.declaredAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          )}
                          {!loan.requirements?.assetDeclaration && (
                            <div className="mt-2">
                              <span className="text-xs text-blue-600 font-medium">💡 Recommended</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                            
                

                
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoansPage;