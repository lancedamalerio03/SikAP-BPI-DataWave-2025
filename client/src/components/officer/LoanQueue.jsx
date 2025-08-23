// LoanQueue.jsx - Enhanced Loan Queue for SikAP with Real Data
import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, CheckCircle, XCircle, SortDesc,
  User, DollarSign, MapPin, AlertTriangle, FileText, Shield,
  Phone, Mail, Calendar, Briefcase, Award, Flag,
  TrendingUp, Download, MoreHorizontal, RefreshCw, Activity
} from 'lucide-react';

import LoanOfficerService from '../../services/loanOfficerService';

const LoanQueue = ({ onStatsUpdate }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('priority'); // priority, date, amount, name
  const [sortOrder, setSortOrder] = useState('desc');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    loanAmountMin: '',
    loanAmountMax: '',
    showFlagged: false
  });

  // Load loan applications on component mount
  useEffect(() => {
    loadLoanApplications();
  }, [filterStatus, searchQuery, sortBy, sortOrder, filters.riskLevel, filters.loanAmountMin, filters.loanAmountMax, filters.showFlagged]);

  const loadLoanApplications = async () => {
    try {
      setLoading(true);
      const filterOptions = {
        status: filterStatus,
        search: searchQuery,
        limit: 50
      };
      
      const fetchedLoans = await LoanOfficerService.fetchLoanApplications(filterOptions);
      
      // Apply additional filters
      let filteredLoans = fetchedLoans;
      
      if (filters.riskLevel !== 'all') {
        filteredLoans = filteredLoans.filter(loan => loan.riskLevel === filters.riskLevel);
      }
      
      if (filters.loanAmountMin) {
        filteredLoans = filteredLoans.filter(loan => loan.loanAmount >= parseFloat(filters.loanAmountMin));
      }
      
      if (filters.loanAmountMax) {
        filteredLoans = filteredLoans.filter(loan => loan.loanAmount <= parseFloat(filters.loanAmountMax));
      }
      
      if (filters.showFlagged) {
        filteredLoans = filteredLoans.filter(loan => loan.flags && loan.flags.length > 0);
      }
      
      // Apply sorting
      filteredLoans.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'priority':
            aValue = a.priorityScore || 0;
            bValue = b.priorityScore || 0;
            break;
          case 'date':
            aValue = new Date(a.submittedDate);
            bValue = new Date(b.submittedDate);
            break;
          case 'amount':
            aValue = a.loanAmount;
            bValue = b.loanAmount;
            break;
          case 'name':
            aValue = a.borrowerName.toLowerCase();
            bValue = b.borrowerName.toLowerCase();
            break;
          default:
            aValue = a.priorityScore || 0;
            bValue = b.priorityScore || 0;
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      setLoans(filteredLoans);
    } catch (error) {
      console.error('Error loading loan applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced approval and rejection handlers
  const handleApprove = async (loanId) => {
    try {
      const success = await LoanOfficerService.updateLoanStatus(loanId, 'approved', 'current-officer-id', 'Approved by loan officer');
      if (success) {
        await loadLoanApplications(); // Refresh the list
        if (onStatsUpdate) onStatsUpdate(); // Update dashboard stats
        alert(`Loan ${loanId} approved successfully!`);
      } else {
        alert('Failed to approve loan. Please try again.');
      }
    } catch (error) {
      console.error('Error approving loan:', error);
      alert('Error approving loan. Please try again.');
    }
  };

  const handleReject = async (loanId) => {
    try {
      const reason = prompt('Please provide a reason for rejection:');
      if (!reason) return;
      
      const success = await LoanOfficerService.updateLoanStatus(loanId, 'rejected', 'current-officer-id', `Rejected: ${reason}`);
      if (success) {
        await loadLoanApplications(); // Refresh the list
        if (onStatsUpdate) onStatsUpdate(); // Update dashboard stats
        alert(`Loan ${loanId} rejected.`);
      } else {
        alert('Failed to reject loan. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting loan:', error);
      alert('Error rejecting loan. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending_documents: 'bg-amber-100 text-amber-800',
      documents_submitted: 'bg-blue-100 text-blue-800',
      ready_for_review: 'bg-purple-100 text-purple-800',
      under_review: 'bg-indigo-100 text-indigo-800',
      needs_review: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending_documents: 'Pending Documents',
      documents_submitted: 'Documents Submitted',
      ready_for_review: 'Ready for Review',
      under_review: 'Under Review',
      needs_review: 'Needs Review',
      approved: 'Approved',
      rejected: 'Rejected',
      disbursed: 'Disbursed'
    };
    return labels[status] || status;
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Low': 'text-green-600 bg-green-50 border-green-200',
      'Medium': 'text-amber-600 bg-amber-50 border-amber-200',
      'High': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[risk] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getAIRecommendationColor = (recommendation) => {
    const colors = {
      'Approve': 'bg-green-100 text-green-800 border-green-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Manual Review': 'bg-amber-100 text-amber-800 border-amber-200',
      'Needs Review': 'bg-amber-100 text-amber-800 border-amber-200',
      'Reject': 'bg-red-100 text-red-800 border-red-200',
      'Pending Analysis': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[recommendation] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col space-y-4">
          {/* Top Row - Search and Quick Actions */}
          <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
                placeholder="Search by borrower name, email, ID, or occupation..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <div className="flex gap-3">
            <select 
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[160px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Applications</option>
                <option value="pending_documents">Pending Documents</option>
                <option value="documents_submitted">Documents Submitted</option>
              <option value="ready_for_review">Ready for Review</option>
              <option value="needs_review">Needs Review</option>
                <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
              
              <select 
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-w-[140px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="priority">Sort by Priority</option>
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="name">Sort by Name</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <SortDesc className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
              </button>
            </div>
          </div>
          
          {/* Advanced Filters Row */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
            <div className="flex gap-2">
              <label className="text-sm font-medium text-slate-700 self-center">Risk Level:</label>
              <select 
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={filters.riskLevel}
                onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
              >
                <option value="all">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
            
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium text-slate-700">Amount Range:</label>
              <input
                type="number"
                placeholder="Min"
                className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={filters.loanAmountMin}
                onChange={(e) => setFilters({...filters, loanAmountMin: e.target.value})}
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                placeholder="Max"
                className="w-24 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={filters.loanAmountMax}
                onChange={(e) => setFilters({...filters, loanAmountMax: e.target.value})}
              />
            </div>
            
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={filters.showFlagged}
                onChange={(e) => setFilters({...filters, showFlagged: e.target.checked})}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              Show Flagged Only
            </label>
            
            <div className="flex gap-2 ml-auto">
              <span className="text-sm text-slate-500 self-center">
                {loading ? 'Loading...' : `${loans.length} applications`}
              </span>
              <button
                onClick={loadLoanApplications}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Loan Applications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Loan Applications
          </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                {loading ? 'Loading...' : `${loans.length} applications found`}
              </span>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading loan applications...</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No loan applications found matching your criteria.</p>
          </div>
        ) : (
        <div className="divide-y divide-slate-200">
            {loans.map((loan) => (
              <div key={loan.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* Header with name, status, and priority indicators */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-semibold text-slate-900">{loan.borrowerName}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(loan.status)}`}>
                      {getStatusLabel(loan.status)}
                    </span>
                      <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getRiskColor(loan.riskLevel)}`}>
                      {loan.riskLevel} Risk
                    </span>
                      {loan.flags && loan.flags.length > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs border border-red-200">
                          <Flag className="w-3 h-3" />
                          {loan.flags.length} flags
                        </span>
                      )}
                      {loan.priorityScore > 15 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs border border-orange-200">
                          <AlertTriangle className="w-3 h-3" />
                          High Priority
                        </span>
                      )}
                    </div>
                    
                    {/* Primary Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="font-medium text-slate-900">{loan.borrowerType}</span>
                          <p className="text-xs text-slate-500">{loan.occupation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="font-medium text-slate-900">{formatCurrency(loan.loanAmount)}</span>
                          <p className="text-xs text-slate-500">{loan.loanPurpose}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="font-medium text-slate-900">{loan.location}</span>
                          <p className="text-xs text-slate-500">Location</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="font-medium text-slate-900">{loan.submittedDate}</span>
                          <p className="text-xs text-slate-500">Submitted</p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-700">Financial Profile</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Monthly Income:</span>
                            <span className="font-medium">{formatCurrency(loan.monthlyIncome)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Credit Score:</span>
                            <span className={`font-medium ${loan.creditScore >= 700 ? 'text-green-600' : loan.creditScore >= 600 ? 'text-amber-600' : 'text-red-600'}`}>
                              {loan.creditScore || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Employment:</span>
                            <span className="font-medium">{loan.yearsOfEmployment}y exp</span>
                          </div>
                    </div>
                  </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-700">AI Assessment</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">Recommendation:</span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getAIRecommendationColor(loan.aiRecommendation)}`}>
                              {loan.aiRecommendation}
                            </span>
                          </div>
                          {loan.aiConfidence > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">Confidence:</span>
                              <div className="flex items-center gap-1">
                                <div className="w-16 bg-slate-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${(loan.aiConfidence * 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-slate-600">{Math.round(loan.aiConfidence * 100)}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                  </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-700">Requirements</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loan.documentsCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {loan.documentsCompleted ? '✓' : '✗'} Documents
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loan.esgCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {loan.esgCompleted ? '✓' : '✗'} ESG
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loan.assetsCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {loan.assetsCompleted ? '✓' : '✗'} Assets
                        </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Reasoning & Payment Terms */}
                    {loan.aiReasoning && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">AI Analysis</h4>
                        <p className="text-sm text-blue-800">{loan.aiReasoning}</p>
                      </div>
                    )}
                    
                    <div className="text-sm text-slate-600">
                      <strong>Payment Terms:</strong> {loan.paymentTerms}
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col gap-3 ml-6">
                  <button
                    onClick={() => setSelectedLoan(loan)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm transition-all"
                  >
                    <Eye className="w-4 h-4" />
                      Review Details
                  </button>
                  
                    {/* Contact Actions */}
                    {loan.borrowerPhone && (
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3" />
                        Call
                      </button>
                    )}
                    
                    {/* Primary Actions for reviewable loans */}
                    {(loan.status === 'ready_for_review' || loan.status === 'needs_review' || loan.status === 'documents_submitted') && (
                      <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleApprove(loan.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm transition-all"
                      >
                          <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(loan.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 font-medium shadow-sm transition-all"
                      >
                          <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                    
                    {/* Status-specific actions */}
                    {loan.status === 'approved' && (
                      <span className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium text-center">
                        ✓ Approved
                      </span>
                    )}
                    {loan.status === 'rejected' && (
                      <span className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium text-center">
                        ✗ Rejected
                      </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Enhanced Comprehensive Loan Review Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      Loan Application Review
                </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-slate-600">
                        <span className="font-medium">{selectedLoan.borrowerName}</span> • {selectedLoan.borrowerType}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedLoan.status)}`}>
                        {getStatusLabel(selectedLoan.status)}
                      </span>
                      <span className={`px-3 py-1 rounded-md text-sm font-medium border ${getRiskColor(selectedLoan.riskLevel)}`}>
                        {selectedLoan.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Application ID: {selectedLoan.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLoan(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="p-6 space-y-8">
                {/* Quick Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-bold text-blue-900">{formatCurrency(selectedLoan.loanAmount)}</h4>
                        <p className="text-sm text-blue-700">{selectedLoan.loanPurpose}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-bold text-green-900">{formatCurrency(selectedLoan.monthlyIncome)}</h4>
                        <p className="text-sm text-green-700">Monthly Income</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8 text-purple-600" />
                      <div>
                        <h4 className={`font-bold ${selectedLoan.creditScore >= 700 ? 'text-green-900' : selectedLoan.creditScore >= 600 ? 'text-amber-900' : 'text-red-900'}`}>
                          {selectedLoan.creditScore || 'N/A'}
                        </h4>
                        <p className="text-sm text-purple-700">Credit Score</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-amber-600" />
                      <div>
                        <h4 className="font-bold text-amber-900">{selectedLoan.riskLevel}</h4>
                        <p className="text-sm text-amber-700">Risk Level</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Information Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Borrower Information */}
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Borrower Information
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Full Name</label>
                            <p className="font-medium text-slate-900">{selectedLoan.borrowerName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Email</label>
                            <p className="text-slate-900">{selectedLoan.borrowerEmail || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Phone</label>
                            <p className="text-slate-900">{selectedLoan.borrowerPhone || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Location</label>
                            <p className="text-slate-900">{selectedLoan.location}</p>
                          </div>
                        </div>
                        {selectedLoan.borrowerDetails && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-slate-600">Civil Status</label>
                              <p className="text-slate-900">{selectedLoan.borrowerDetails.civilStatus || 'Not provided'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-600">Citizenship</label>
                              <p className="text-slate-900">{selectedLoan.borrowerDetails.citizenship || 'Not provided'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Employment Information */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        Employment Details
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Employment Status</label>
                            <p className="font-medium text-slate-900">{selectedLoan.employmentStatus}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Occupation</label>
                            <p className="text-slate-900">{selectedLoan.occupation}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Employer</label>
                            <p className="text-slate-900">{selectedLoan.employer || 'Self-employed'}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Years of Experience</label>
                            <p className="text-slate-900">{selectedLoan.yearsOfEmployment} years</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Monthly Income</label>
                          <p className="font-semibold text-green-600 text-lg">{formatCurrency(selectedLoan.monthlyIncome)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loan & AI Assessment */}
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        Loan Details
                      </h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Loan Amount</label>
                            <p className="font-bold text-blue-600 text-xl">{formatCurrency(selectedLoan.loanAmount)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Purpose</label>
                            <p className="font-medium text-slate-900">{selectedLoan.loanPurpose}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Tenor</label>
                            <p className="text-slate-900">{selectedLoan.loanTenorMonths} months</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Repayment</label>
                            <p className="text-slate-900">{selectedLoan.repaymentFrequency}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Payment Terms</label>
                          <p className="font-medium text-slate-900">{selectedLoan.paymentTerms}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-600">Collateral</label>
                          <p className="text-slate-900">{selectedLoan.collateral}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Assessment */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-600" />
                        AI Assessment
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600">Recommendation:</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getAIRecommendationColor(selectedLoan.aiRecommendation)}`}>
                        {selectedLoan.aiRecommendation}
                      </span>
                        </div>
                        {selectedLoan.aiConfidence > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-600">Confidence Level:</span>
                              <span className="text-sm font-medium text-slate-900">{Math.round(selectedLoan.aiConfidence * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300" 
                                style={{ width: `${(selectedLoan.aiConfidence * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {selectedLoan.aiReasoning && (
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <h5 className="text-sm font-medium text-slate-700 mb-2">AI Analysis:</h5>
                            <p className="text-sm text-slate-600 leading-relaxed">{selectedLoan.aiReasoning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements Status */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    Requirements Status
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border-2 ${selectedLoan.documentsCompleted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedLoan.documentsCompleted ? 'bg-green-100' : 'bg-red-100'}`}>
                          {selectedLoan.documentsCompleted ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <h5 className={`font-medium ${selectedLoan.documentsCompleted ? 'text-green-900' : 'text-red-900'}`}>Documents</h5>
                          <p className={`text-sm ${selectedLoan.documentsCompleted ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedLoan.documentsCompleted ? 'Complete' : 'Incomplete'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border-2 ${selectedLoan.esgCompleted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedLoan.esgCompleted ? 'bg-green-100' : 'bg-red-100'}`}>
                          {selectedLoan.esgCompleted ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <h5 className={`font-medium ${selectedLoan.esgCompleted ? 'text-green-900' : 'text-red-900'}`}>ESG Compliance</h5>
                          <p className={`text-sm ${selectedLoan.esgCompleted ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedLoan.esgCompleted ? 'Complete' : 'Incomplete'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg border-2 ${selectedLoan.assetsCompleted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedLoan.assetsCompleted ? 'bg-green-100' : 'bg-red-100'}`}>
                            {selectedLoan.assetsCompleted ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                          </div>
                          <div>
                            <h5 className={`font-medium ${selectedLoan.assetsCompleted ? 'text-green-900' : 'text-red-900'}`}>Asset Declaration</h5>
                            <p className={`text-sm ${selectedLoan.assetsCompleted ? 'text-green-700' : 'text-red-700'}`}>
                              {selectedLoan.assetsCompleted ? 'Complete' : 'Incomplete'}
                            </p>
                          </div>
                        </div>
                        {selectedLoan.borrowerDetails.assets?.summary?.totalValue && (
                          <div className="text-right">
                            <div className="text-sm text-slate-600">Total Value</div>
                            <div className="text-lg font-semibold text-green-600">
                              ₱{selectedLoan.borrowerDetails.assets.summary.totalValue.toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedLoan.borrowerDetails.assets?.summary?.categoryBreakdown?.length > 0 && (
                        <div className="mt-4">
                          <div className="grid gap-3">
                            {selectedLoan.borrowerDetails.assets.summary.categoryBreakdown.map((category, index) => (
                              <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="font-medium text-slate-900">{category.category}</div>
                                  <div className="text-sm text-slate-600">
                                    {category.count} {category.count === 1 ? 'item' : 'items'}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {category.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="text-sm">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <span className="text-slate-900">{item.brand} {item.model}</span>
                                          <span className="text-slate-600 ml-2">({item.condition})</span>
                                        </div>
                                        <div className="font-medium text-slate-900">
                                          ₱{item.value.toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Risk Flags & Warnings */}
                {selectedLoan.flags && selectedLoan.flags.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Risk Flags & Warnings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedLoan.flags.map((flag, index) => (
                        <div key={index} className="flex items-center gap-2 text-red-800">
                          <Flag className="w-4 h-4 text-red-600" />
                          <span className="font-medium">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {selectedLoan.additionalInformation && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">Additional Information</h4>
                    <p className="text-slate-700 leading-relaxed">{selectedLoan.additionalInformation}</p>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="border-t border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">Submitted: {selectedLoan.submittedDate}</span>
                    <span className="text-sm text-slate-600">Last Updated: {selectedLoan.updatedDate}</span>
              </div>

                  <div className="flex gap-3">
                    {selectedLoan.borrowerEmail && (
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2 text-sm font-medium">
                        <Mail className="w-4 h-4" />
                        Email Borrower
                      </button>
                    )}
                    
                    {selectedLoan.borrowerPhone && (
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2 text-sm font-medium">
                        <Phone className="w-4 h-4" />
                        Call Borrower
                      </button>
                    )}
                    
                    {(selectedLoan.status === 'ready_for_review' || selectedLoan.status === 'needs_review' || selectedLoan.status === 'documents_submitted') && (
                      <>
                  <button 
                    onClick={() => {
                      handleApprove(selectedLoan.id);
                      setSelectedLoan(null);
                    }}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm transition-all"
                  >
                      <CheckCircle className="w-5 h-5" />
                    Approve Loan
                  </button>
                  <button 
                    onClick={() => {
                      handleReject(selectedLoan.id);
                      setSelectedLoan(null);
                    }}
                          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 font-medium shadow-sm transition-all"
                  >
                      <XCircle className="w-5 h-5" />
                    Reject Loan
                  </button>
                      </>
                    )}
                    
                  <button 
                    onClick={() => setSelectedLoan(null)}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                  >
                      Close Review
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanQueue;
