// client/src/components/dashboard/LoansPage.jsx
// Enhanced LoansPage with database integration, search, and filtering

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
      
      // Fallback to localStorage only
      const localStorageLoans = loadFromLocalStorage();
      setAllLoans(localStorageLoans);
      
    } finally {
      setLoading(false);
    }
  };

  const loadFromSupabase = async () => {
    try {
      if (!supabase || !user?.id) return [];

      console.log('Loading preloan applications for user:', user.id);

      // Query preloan_applications table
      const { data: loans, error } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
        return [];
      }

      console.log('Loaded loans from Supabase:', loans);

      // Transform Supabase data to our format
      return (loans || []).map(loan => ({
        id: loan.id,
        title: getLoanTitle(loan.loan_purpose),
        principal: parseFloat(loan.loan_amount) || 0,
        outstanding: parseFloat(loan.loan_amount) || 0, // For preloan applications, this equals loan amount
        monthlyPayment: calculateMonthlyPayment(loan.loan_amount, loan.loan_tenor_months),
        nextDueDate: loan.status === 'approved' ? calculateNextDueDate() : null,
        interestRate: 12, // Default rate for preloan applications
        status: mapStatus(loan.status),
        statusColor: getStatusColor(loan.status),
        paymentsRemaining: loan.loan_tenor_months || 12,
        totalPayments: loan.loan_tenor_months || 12,
        lastPayment: null, // Preloan applications don't have payments yet
        paymentMethod: 'GCash', // Default
        submittedAt: loan.created_at,
        purpose: loan.loan_purpose,
        tenor: loan.loan_tenor_months,
        repaymentFrequency: loan.repayment_frequency,
        additionalInfo: loan.additional_information,
        urgency: loan.urgency,
        aiDecision: loan.ai_decision,
        aiConfidence: loan.ai_confidence,
        aiReasoning: loan.ai_reasoning,
        source: 'supabase',
        documents: generateDocuments(loan)
      }));

    } catch (error) {
      console.error('Error loading from Supabase:', error);
      return [];
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const storedApplications = localStorage.getItem('loan_applications');
      if (!storedApplications) return [];

      const applications = JSON.parse(storedApplications);
      
      // Filter for current user and transform to our format
      return applications
        .filter(app => app.applicantId === user.id)
        .map(app => ({
          id: app.applicationId,
          title: getLoanTitle(app.loanPurpose),
          principal: parseFloat(app.loanAmount),
          outstanding: parseFloat(app.loanAmount), // Assume full amount outstanding for new applications
          monthlyPayment: calculateMonthlyPayment(parseFloat(app.loanAmount), parseInt(app.loanTenor)),
          nextDueDate: null, // Not applicable for pending applications
          interestRate: 12, // Default rate
          status: mapStatus(app.status),
          statusColor: getStatusColor(app.status),
          paymentsRemaining: parseInt(app.loanTenor),
          totalPayments: parseInt(app.loanTenor),
          lastPayment: null,
          paymentMethod: 'GCash',
          submittedAt: app.submittedAt,
          purpose: app.loanPurpose,
          tenor: parseInt(app.loanTenor),
          repaymentFrequency: app.repaymentFrequency,
          additionalInfo: app.additionalInfo,
          source: 'localStorage',
          estimatedTime: app.estimatedProcessingTime,
          message: app.message,
          nextSteps: app.nextSteps || [],
          documents: generateDocuments({ loan_purpose: app.loanPurpose, status: app.status })
        }));

    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  };

  const deduplicateLoans = (loans) => {
    const loanMap = new Map();
    
    loans.forEach(loan => {
      const existingLoan = loanMap.get(loan.id);
      
      // If no existing loan OR current loan has more recent date, keep this one
      if (!existingLoan || 
          (loan.submittedAt && existingLoan.submittedAt && 
           new Date(loan.submittedAt) > new Date(existingLoan.submittedAt))) {
        loanMap.set(loan.id, loan);
      }
    });
    
    return Array.from(loanMap.values());
  };
  
  // Alternative: If you prefer the original structure, just modify the key:
  const deduplicateLoansSimple = (loans) => {
    const seen = new Set();
    const result = [];
    
    // Sort by date first (most recent first)
    const sortedLoans = [...loans].sort((a, b) => {
      if (!a.submittedAt && !b.submittedAt) return 0;
      if (!a.submittedAt) return 1;
      if (!b.submittedAt) return -1;
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });
    
    sortedLoans.forEach(loan => {
      // Use only loan.id as key (remove source from deduplication)
      if (!seen.has(loan.id)) {
        seen.add(loan.id);
        result.push(loan);
      }
    });
    
    return result;
  };

  const applyFilters = () => {
    let filtered = [...allLoans];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(loan => 
        loan.title.toLowerCase().includes(searchLower) ||
        loan.id.toLowerCase().includes(searchLower) ||
        loan.purpose?.toLowerCase().includes(searchLower) ||
        loan.status.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(loan => loan.status.toLowerCase() === statusFilter);
    }

    // Apply amount filter
    if (amountFilter !== 'all') {
      filtered = filtered.filter(loan => {
        const amount = loan.principal;
        switch (amountFilter) {
          case '0-25000': return amount <= 25000;
          case '25000-50000': return amount > 25000 && amount <= 50000;
          case '50000-100000': return amount > 50000 && amount <= 100000;
          case '100000+': return amount > 100000;
          default: return true;
        }
      });
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(loan => {
        if (!loan.submittedAt) return true;
        
        const loanDate = new Date(loan.submittedAt);
        const daysDiff = Math.floor((now - loanDate) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case '7d': return daysDiff <= 7;
          case '30d': return daysDiff <= 30;
          case '3m': return daysDiff <= 90;
          case '6m': return daysDiff <= 180;
          case '1y': return daysDiff <= 365;
          default: return true;
        }
      });
    }

    setFilteredLoans(filtered);
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

  const calculateMonthlyPayment = (amount, months) => {
    const rate = 0.01; // 1% monthly rate as example
    const payment = (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return Math.round(payment);
  };

  const calculateNextDueDate = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(15); // 15th of next month
    return nextMonth.toISOString().split('T')[0];
  };

  const generateDocuments = (loan) => {
    const baseDocs = [
      { name: 'Loan Agreement', status: 'Complete', date: '2024-02-01' },
      { name: 'Application Form', status: 'Complete', date: new Date(loan.created_at || Date.now()).toISOString().split('T')[0] }
    ];

    if (loan.status === 'pending_documents') {
      baseDocs.push({ name: 'Bank Statement', status: 'Required', date: null });
      baseDocs.push({ name: 'Business Permit', status: 'Expired', date: '2024-01-15' });
    }

    return baseDocs;
  };

  const getDocumentStatusColor = (status) => {
    const colors = {
      'Complete': 'bg-green-100 text-green-800',
      'Required': 'bg-red-100 text-red-800',
      'Expired': 'bg-orange-100 text-orange-800',
      'Under Review': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Event handlers
  const handleMakePayment = (loanId) => {
    console.log('Make payment for loan:', loanId);
    alert('Payment feature coming soon!');
  };

  const handleUploadDocument = (loanId) => {
    console.log('Upload document for loan:', loanId);
    alert('Document upload feature coming soon!');
  };

  const handleDownloadStatement = (loanId) => {
    console.log('Download statement for loan:', loanId);
    alert('Statement download feature coming soon!');
  };

  const handleGetHelp = (loanId) => {
    setShowChatbot(true);
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      message: `I can help you with loan ${loanId}. What would you like to know?`,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: "Thank you for your message. Our team will assist you shortly. For immediate help, please call our customer service at (02) 8-888-SIKAP.",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setNewMessage('');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAmountFilter('all');
    setDateFilter('all');
  };

  const getFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (amountFilter !== 'all') count++;
    if (dateFilter !== 'all') count++;
    return count;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading your loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Summary Stats */}
      <div className="bg-gradient-to-r from-red-600 to-amber-500 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Loan Management</h1>
            <p className="opacity-90">Manage payments, documents, and track your loan progress</p>
          </div>
          <Button 
            onClick={refreshLoans}
            disabled={refreshing}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            {refreshing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">{allLoans.length}</div>
            <div className="text-sm opacity-90">Total Applications</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">
              {allLoans.filter(loan => loan.status === 'Active').length}
            </div>
            <div className="text-sm opacity-90">Active Loans</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">
              {formatCurrency(allLoans.reduce((sum, loan) => sum + (loan.principal || 0), 0))}
            </div>
            <div className="text-sm opacity-90">Total Amount</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold">
              {allLoans.filter(loan => ['pending_documents', 'processing', 'under_review', 'pending_interview'].includes(loan.status.toLowerCase())).length}
            </div>
            <div className="text-sm opacity-90">Pending</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search loans by ID, type, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-3">
            {getFilterCount() > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                size="sm"
                className="text-slate-600"
              >
                Clear Filters
              </Button>
            )}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {getFilterCount() > 0 && (
                <Badge className="bg-red-600 text-white ml-1">
                  {getFilterCount()}
                </Badge>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
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

              {/* Amount Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount Range</label>
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

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
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
          </div>
        )}
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Showing {filteredLoans.length} of {allLoans.length} loan applications
        </p>
        <Button 
          onClick={() => window.location.href = '/application'}
          className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
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
              onClick={() => window.location.href = '/application'}
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
                      <div className="text-sm text-slate-600">Next Due</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-900">
                        {loan.interestRate}%
                      </div>
                      <div className="text-sm text-slate-600">Interest Rate</div>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Payment Progress</span>
                      <span className="text-sm text-slate-600">
                        {loan.totalPayments - loan.paymentsRemaining} of {loan.totalPayments} payments
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{width: `${((loan.totalPayments - loan.paymentsRemaining) / loan.totalPayments) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Decision Section for processed applications */}
              {loan.aiDecision && (
                <div className={`p-6 border-b border-slate-200 ${
                  loan.aiDecision === 'approved' ? 'bg-green-50' : 
                  loan.aiDecision === 'rejected' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      loan.aiDecision === 'approved' ? 'bg-green-100' : 
                      loan.aiDecision === 'rejected' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {loan.aiDecision === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : loan.aiDecision === 'rejected' ? (
                        <X className="w-5 h-5 text-red-600" />
                      ) : (
                        <Brain className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium mb-1 ${
                        loan.aiDecision === 'approved' ? 'text-green-900' : 
                        loan.aiDecision === 'rejected' ? 'text-red-900' : 'text-blue-900'
                      }`}>
                        AI Assessment: {loan.aiDecision.charAt(0).toUpperCase() + loan.aiDecision.slice(1)}
                      </h4>
                      {loan.aiConfidence && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-slate-600">Confidence Score:</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    loan.aiConfidence >= 0.8 ? 'bg-green-500' :
                                    loan.aiConfidence >= 0.6 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{width: `${loan.aiConfidence * 100}%`}}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-slate-700">
                                {Math.round(loan.aiConfidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
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
                        Please upload your latest bank statement to continue loan processing.
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
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {message.message}
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
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