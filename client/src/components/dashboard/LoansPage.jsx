// client/src/components/dashboard/LoansPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  FileText, 
  Clock, 
  CheckCircle, 
  Upload, 
  Leaf, 
  Package, 
  Download, 
  HelpCircle, 
  Eye,
  CreditCard,
  AlertTriangle
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

  useEffect(() => {
    loadUserLoans();
  }, [user]);

  const loadUserLoans = async () => {
    try {
      setLoading(true);
      
      // Try loading from Supabase first
      const supabaseLoans = await loadFromSupabase();
      
      // Fallback to localStorage if needed
      const localStorageLoans = loadFromLocalStorage();
      
      // Combine and deduplicate
      const allLoans = [...supabaseLoans, ...localStorageLoans];
      const uniqueLoans = deduplicateLoans(allLoans);
      
      console.log('Final loans list:', uniqueLoans);
      setLoans(uniqueLoans);
      
    } catch (error) {
      console.error('Error loading loans:', error);
      // Fallback to localStorage only
      const localStorageLoans = loadFromLocalStorage();
      setLoans(localStorageLoans);
    } finally {
      setLoading(false);
    }
  };

  const loadFromSupabase = async () => {
    try {
      if (!user?.id) {
        console.log('No user ID available for Supabase query - skipping database load');
        return [];
      }

      console.log('Querying Supabase for user:', user.id);

      const { data, error } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      console.log('Supabase raw data:', data);

      return (data || []).map(loan => ({
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
    navigate(`/loans/${loanId}/documents`);
  };

  const handleESGCompliance = (loanId) => {
    navigate(`/esg-compliance/${loanId}`);
  };

  const handleAssetDeclaration = (loanId) => {
    navigate(`/asset-declaration/${loanId}`);
  };

  const handleDownloadStatement = (loanId) => {
    console.log('Downloading statement for loan:', loanId);
    // Implementation for downloading statement would go here
    alert('Statement download feature coming soon!');
  };

  const handleGetHelp = (loanId) => {
    navigate('/dashboard/chatbot', { state: { loanId } });
  };

  // FIXED: Updated handleViewDetails function to navigate to the new loan offer details page
  const handleViewDetails = (loanId) => {
    console.log('Viewing details for loan:', loanId);
    navigate(`/dashboard/loans/${loanId}/details`);
  };

  const handleMakePayment = (loanId) => {
    console.log('Making payment for loan:', loanId);
    // Implementation for payment would go here
    alert('Payment feature coming soon!');
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
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Clock className="animate-spin mx-auto mb-4 text-red-600" size={48} />
          <p className="text-slate-600">Loading your loans...</p>
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
          {loans.length === 0 && (
            <Button
              onClick={() => navigate('/application')}
              className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply for Your First Loan
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredLoans.map((loan) => {
            const isPendingDocuments = loan.status === 'Pending Documents';
            const isApproved = loan.status === 'Approved';
            const isActive = loan.status === 'Active';
            
            return (
              <Card key={loan.id} className="overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{loan.title}</h3>
                        <Badge className={loan.statusColor}>{loan.status}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Amount:</span>
                          <div className="font-medium">₱{loan.principal?.toLocaleString() || 0}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Applied:</span>
                          <div className="font-medium">{formatDate(loan.submittedAt)}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Term:</span>
                          <div className="font-medium">{loan.loanTenor || 12} months</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>



                {/* Requirements Section */}
                {isPendingDocuments && (
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">Action Required</h4>
                        <p className="text-sm text-slate-600 mb-4">
                          {getActionRequiredMessage(loan)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          loan.requirements?.documents 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white'
                        }`}>
                          {loan.requirements?.documents ? <CheckCircle size={16} /> : <Upload size={16} />}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">Documents</div>
                          <div className="text-sm text-slate-600">
                            {loan.requirements?.documents ? 'Documents uploaded' : 'Upload required documents'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          loan.requirements?.esgCompliance 
                            ? 'bg-green-600 text-white' 
                            : 'bg-blue-600 text-white'
                        }`}>
                          {loan.requirements?.esgCompliance ? <CheckCircle size={16} /> : <Leaf size={16} />}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">ESG Compliance</div>
                          <div className="text-sm text-slate-600">
                            {loan.requirements?.esgCompliance ? 'ESG form completed' : 'Complete ESG assessment'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
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
                    {isActive && loan.outstanding > 0 && (
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
                        Complete ESG Form
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