// client/src/components/dashboard/LoansPage.jsx
// Enhanced LoansPage with database integration, search, and filtering

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom'; // NEW: Added useNavigate
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  Upload, 
  Download,
  FileText, 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Eye,
  Send,
  Bot,
  User,
  X,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Loader2,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Brain
} from 'lucide-react';

const LoansPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // NEW: Navigation hook
  const location = useLocation(); // NEW: For success messages
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // State for loans data
  const [allLoans, setAllLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Chatbot state
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hi! I'm here to help you with your loans. You can ask me about payments, documents, or any loan-related questions.",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Status options for filtering
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending_documents', label: 'Pending Documents' },
    { value: 'processing', label: 'Processing' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'pending_interview', label: 'Pending Interview' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];  

  const amountOptions = [
    { value: 'all', label: 'All Amounts' },
    { value: '0-25000', label: '₱0 - ₱25,000' },
    { value: '25000-50000', label: '₱25,000 - ₱50,000' },
    { value: '50000-100000', label: '₱50,000 - ₱100,000' },
    { value: '100000+', label: '₱100,000+' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '3m', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
    { value: '1y', label: 'Last year' }
  ];

  // Load loans data on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserLoans();
    }
  }, [user]);

  // Apply filters when search term or filters change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, statusFilter, amountFilter, dateFilter, allLoans]);

  // NEW: Check for success message from document upload
  useEffect(() => {
    if (location.state?.message) {
      // You can show a toast notification here
      console.log('Success message:', location.state.message);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadUserLoans = async () => {
    try {
      setLoading(true);
      setError('');

      // First, try to load from Supabase if properly configured
      const supabaseLoans = await loadFromSupabase();
      
      // Also load from localStorage as fallback/additional data
      const localStorageLoans = loadFromLocalStorage();
      
      // Combine and deduplicate loans
      const combinedLoans = [...supabaseLoans, ...localStorageLoans];
      const uniqueLoans = deduplicateLoans(combinedLoans);
      
      setAllLoans(uniqueLoans);
      
      console.log(`Loaded ${uniqueLoans.length} loans for user ${user.id}`);
      
    } catch (error) {
      console.error('Error loading loans:', error);
      setError('Failed to load loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadFromSupabase = async () => {
    try {
      if (!supabase) {
        console.log('Supabase not configured, skipping database load');
        return [];
      }

      const { data, error } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

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
        documents: [
          { name: 'Loan Agreement', status: 'Complete', date: '2024-02-01' },
          { name: 'Application Form', status: 'Complete', date: '2024-08-21' },
          { name: 'Bank Statement', status: loan.status === 'pending_documents' ? 'Required' : 'Complete' }
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
      
      return userApplications.map(app => ({
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
        documents: [
          { name: 'Loan Agreement', status: 'Complete', date: '2024-02-01' },
          { name: 'Application Form', status: 'Complete', date: '2024-08-21' },
          { name: 'Bank Statement', status: (app.status === 'pending_documents' || app.status === 'pending') ? 'Required' : 'Complete' }
        ],
        source: 'localStorage'
      }));

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
      
      // Legacy mappings for backward compatibility
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
      'under_review': 'bg-orange-100 text-orange-800',
      
      // Legacy status colors for backward compatibility
      'pending': 'bg-amber-100 text-amber-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getDocumentStatusColor = (status) => {
    const colors = {
      'Complete': 'bg-green-100 text-green-800',
      'Required': 'bg-red-100 text-red-800',
      'Expired': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0;
    }
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Filter functions
  const applyFilters = () => {
    let filtered = [...allLoans];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(loan => 
        loan.status.toLowerCase().replace(' ', '_') === statusFilter ||
        loan.status.toLowerCase() === statusFilter
      );
    }

    // Amount filter
    if (amountFilter !== 'all') {
      filtered = filtered.filter(loan => {
        const amount = loan.principal || 0;
        switch (amountFilter) {
          case '0-25000':
            return amount >= 0 && amount <= 25000;
          case '25000-50000':
            return amount > 25000 && amount <= 50000;
          case '50000-100000':
            return amount > 50000 && amount <= 100000;
          case '100000+':
            return amount > 100000;
          default:
            return true;
        }
      });
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(loan => {
        if (!loan.submittedAt) return false;
        const loanDate = new Date(loan.submittedAt);
        const diffTime = Math.abs(now - loanDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case '7d':
            return diffDays <= 7;
          case '30d':
            return diffDays <= 30;
          case '3m':
            return diffDays <= 90;
          case '6m':
            return diffDays <= 180;
          case '1y':
            return diffDays <= 365;
          default:
            return true;
        }
      });
    }

    setFilteredLoans(filtered);
  };

  // Action handlers
  const handleMakePayment = (loanId) => {
    console.log('Make payment for loan:', loanId);
    // TODO: Implement payment flow
  };

  // NEW: Updated Upload Document Handler
  const handleUploadDocument = (loanId) => {
    console.log('Upload documents for loan:', loanId);
    // Navigate to document upload page
    navigate(`/loans/${loanId}/documents`);
  };

  const handleDownloadStatement = (loanId) => {
    console.log('Download statement for loan:', loanId);
    // TODO: Implement statement download
  };

  const handleGetHelp = (loanId) => {
    console.log('Get help for loan:', loanId);
    setShowChatbot(true);
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      message: `How can I help you with loan ${loanId}? You can ask about payments, documents, or application status.`,
      timestamp: new Date()
    }]);
  };

  // Chatbot functions
  const sendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        message: newMessage.trim(),
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, userMessage]);

      // Simple bot response
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: "I understand you're asking about your loan. For detailed assistance, please contact our support team at (02) 8123-4567 or visit your nearest BanKo branch.",
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, botMessage]);
      }, 1000);

      setNewMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Loans</h1>
          <p className="text-slate-600">Manage your loan applications and active loans</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={refreshLoans}
            variant="outline"
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Button 
            onClick={() => navigate('/application')}
            className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by loan ID, type, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Filter Summary */}
            <div className="text-sm text-slate-600">
              Showing {filteredLoans.length} of {allLoans.length} loans
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                <select
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {amountOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date Applied</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <Button
              onClick={loadUserLoans}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {allLoans.length === 0 ? 'No loan applications yet' : 'No loans match your filters'}
          </h3>
          <p className="text-slate-600 mb-4">
            {allLoans.length === 0 
              ? 'Get started by applying for your first loan with our quick and easy process.'
              : 'Try adjusting your search criteria or filters to find what you\'re looking for.'
            }
          </p>
          {allLoans.length === 0 && (
            <Button 
              onClick={() => navigate('/application')}
              className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Apply for Loan
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredLoans.map((loan) => (
            <Card key={loan.id} className="overflow-hidden">
              {/* Loan Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{loan.title}</h3>
                      <Badge className={loan.statusColor} size="sm">
                        {loan.status}
                      </Badge>
                      {loan.source === 'localStorage' && (
                        <Badge variant="outline" size="sm" className="text-blue-600 border-blue-200">
                          Recent
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600">Loan ID: {loan.id}</p>
                    <p className="text-sm text-slate-500">
                      Applied: {formatDate(loan.submittedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(loan.principal)}
                    </div>
                    <p className="text-sm text-slate-600">Loan Amount</p>
                  </div>
                </div>
              </div>

              {/* Loan Details for Active Loans */}
              {loan.status === 'Active' && (
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-900">
                        {formatCurrency(loan.outstanding)}
                      </div>
                      <div className="text-sm text-slate-600">Outstanding</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-900">
                        {formatCurrency(loan.monthlyPayment)}
                      </div>
                      <div className="text-sm text-slate-600">Monthly Payment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-900">
                        {loan.nextDueDate ? formatDate(loan.nextDueDate) : 'N/A'}
                      </div>
                      <div className="text-sm text-slate-600">Next Due Date</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-900">
                        {loan.remainingPayments || 'N/A'}
                      </div>
                      <div className="text-sm text-slate-600">Payments Left</div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Decision Display */}
              {loan.aiDecision && (
                <div className="p-6 bg-blue-50 border-b border-slate-200">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-blue-900">AI Assessment: {loan.aiDecision?.toUpperCase()}</h4>
                        {loan.aiConfidence && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            {Math.round(loan.aiConfidence * 100)}% confidence
                          </Badge>
                        )}
                      </div>
                      {loan.aiReasoning && (
                        <p className={`text-sm ${
                          loan.aiDecision === 'approved' ? 'text-green-700' : 
                          loan.aiDecision === 'rejected' ? 'text-red-700' : 'text-blue-700'
                        }`}>
                          <strong>AI Analysis:</strong> {loan.aiReasoning}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Status for Pending Loans */}
              {['pending', 'processing', 'under_review'].includes(loan.status.toLowerCase()) && (
                <div className="p-6 bg-blue-50 border-b border-slate-200">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-1">Application in Progress</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        {loan.message || 'Your application is being reviewed by our AI system.'}
                      </p>
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
                </div>
              )}

              {/* Action Required Alert */}
              {(loan.status === 'Pending Documents' || loan.status.toLowerCase() === 'pending_documents') && (
                <div className="p-4 bg-amber-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="font-medium text-amber-900">Action Required</h4>
                      <p className="text-sm text-amber-700">
                        Please upload your required documents to continue loan processing.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Interview Scheduling Alert */}
              {(loan.status === 'Pending Interview' || loan.status.toLowerCase() === 'pending_interview') && (
                <div className="p-4 bg-purple-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-purple-900">Interview Required</h4>
                      <p className="text-sm text-purple-700">
                        Please schedule an interview with our loan officer to proceed with your application.
                      </p>
                      <button className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium">
                        Schedule Interview →
                      </button>
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
                  
                  {(loan.status === 'Pending Documents' || loan.status.toLowerCase() === 'pending_documents' || loan.documents.some(doc => doc.status === 'Required')) && (
                    <Button
                      onClick={() => handleUploadDocument(loan.id)}
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Documents
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
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Get Help
                  </Button>

                  <Button
                    onClick={() => console.log('View details for loan:', loan.id)}
                    variant="outline"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Loan Assistant Chatbot */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Loan Assistant</h3>
            </div>
            <Button
              onClick={() => setShowChatbot(false)}
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <Bot className="w-3 h-3" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      message.type === 'user'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your loans..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;