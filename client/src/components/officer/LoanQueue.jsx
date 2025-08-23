// LoanQueue.jsx - Simplified MVP Loan Queue for SikAP
import React, { useState } from 'react';
import { 
  Search, Eye, CheckCircle, XCircle, Clock, 
  User, DollarSign, MapPin, AlertTriangle, FileText
} from 'lucide-react';

const LoanQueue = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Simplified loan applications for MVP
  const loanApplications = [
    {
      id: 'LN-2025-001',
      borrowerName: 'Maria Santos',
      borrowerType: 'Gig Worker - GrabFood Driver',
      loanAmount: 75000,
      loanPurpose: 'Motorcycle Purchase',
      status: 'ready_for_review',
      submittedDate: '2025-03-15',
      location: 'Quezon City',
      aiRecommendation: 'Approve',
      riskLevel: 'Medium',
      creditScore: 680,
      monthlyIncome: 25000,
      notes: 'AI Analysis: Stable gig income, consistent mobile wallet activity. Recommended for approval.',
      paymentTerms: '24 months, ₱3,500/month',
      collateral: '2019 Honda Click 125 (₱65,000 estimated value)'
    },
    {
      id: 'LN-2025-002',
      borrowerName: 'Juan dela Cruz',
      borrowerType: 'Freelancer - Graphic Designer',
      loanAmount: 50000,
      loanPurpose: 'Equipment Purchase',
      status: 'ready_for_review',
      submittedDate: '2025-03-14',
      location: 'Manila',
      aiRecommendation: 'Approve',
      riskLevel: 'Low',
      creditScore: 720,
      monthlyIncome: 35000,
      notes: 'AI Analysis: Strong freelance portfolio, diversified income, excellent payment history.',
      paymentTerms: '18 months, ₱3,100/month',
      collateral: 'Clean loan - no collateral required'
    },
    {
      id: 'LN-2025-003',
      borrowerName: 'Ana Reyes',
      borrowerType: 'SEME - Sari-Sari Store Owner',
      loanAmount: 100000,
      loanPurpose: 'Business Expansion',
      status: 'needs_review',
      submittedDate: '2025-03-13',
      location: 'Pasig City',
      aiRecommendation: 'Manual Review',
      riskLevel: 'Medium',
      creditScore: 650,
      monthlyIncome: 18000,
      notes: 'AI Analysis: Limited credit history. Requires human assessment for community business impact.',
      paymentTerms: 'Pending review',
      collateral: 'Store inventory (₱80,000 estimated value)'
    },
    {
      id: 'LN-2025-004',
      borrowerName: 'Carlos Mendoza',
      borrowerType: 'Gig Worker - Lalamove Rider',
      loanAmount: 80000,
      loanPurpose: 'Vehicle Upgrade',
      status: 'approved',
      submittedDate: '2025-03-12',
      location: 'Makati City',
      aiRecommendation: 'Approved',
      riskLevel: 'Low',
      creditScore: 750,
      monthlyIncome: 30000,
      notes: 'AI Analysis: Excellent payment history, stable gig income, sustainable upgrade.',
      paymentTerms: '30 months, ₱3,200/month',
      collateral: '2018 Toyota Vios (₱450,000 estimated value)'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      ready_for_review: 'bg-blue-100 text-blue-800',
      needs_review: 'bg-amber-100 text-amber-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      ready_for_review: 'Ready for Review',
      needs_review: 'Needs Review',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    return labels[status] || status;
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Low': 'text-green-600',
      'Medium': 'text-amber-600',
      'High': 'text-red-600'
    };
    return colors[risk] || 'text-gray-600';
  };

  const handleApprove = (loanId) => {
    console.log(`Approving loan ${loanId}`);
    // Here would be the API call to approve the loan
    alert(`Loan ${loanId} approved successfully!`);
  };

  const handleReject = (loanId) => {
    console.log(`Rejecting loan ${loanId}`);
    // Here would be the API call to reject the loan
    alert(`Loan ${loanId} rejected.`);
  };

  const filteredLoans = loanApplications.filter(loan => {
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    const matchesSearch = loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.borrowerType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, ID, or borrower type..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Applications</option>
              <option value="ready_for_review">Ready for Review</option>
              <option value="needs_review">Needs Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loan Applications List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Loan Applications ({filteredLoans.length})
          </h2>
        </div>
        
        <div className="divide-y divide-slate-200">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-medium text-slate-900">{loan.borrowerName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                      {getStatusLabel(loan.status)}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getRiskColor(loan.riskLevel)}`}>
                      {loan.riskLevel} Risk
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{loan.borrowerType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>₱{loan.loanAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{loan.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                    <div><strong>Purpose:</strong> {loan.loanPurpose}</div>
                    <div><strong>Monthly Income:</strong> ₱{loan.monthlyIncome.toLocaleString()}</div>
                    <div><strong>Credit Score:</strong> {loan.creditScore}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div><strong>AI Recommendation:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        loan.aiRecommendation === 'Approve' ? 'bg-green-100 text-green-800' :
                        loan.aiRecommendation === 'Manual Review' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {loan.aiRecommendation}
                        </span>
                      </div>
                    <div><strong>Payment Terms:</strong> {loan.paymentTerms}</div>
                  </div>

                  {loan.notes && (
                    <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                      <strong>Notes:</strong> {loan.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => setSelectedLoan(loan)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Review
                  </button>
                  
                  {(loan.status === 'ready_for_review' || loan.status === 'needs_review') && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(loan.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(loan.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simplified Loan Review Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                <h3 className="text-xl font-semibold text-slate-900">
                    Loan Review - {selectedLoan.id}
                </h3>
                  <p className="text-slate-600">{selectedLoan.borrowerName} - {selectedLoan.borrowerType}</p>
                </div>
                <button 
                  onClick={() => setSelectedLoan(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Key Information Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-3">Loan Details</h4>
                    <div className="space-y-2 text-sm">
                    <div><strong>Amount:</strong> ₱{selectedLoan.loanAmount.toLocaleString()}</div>
                    <div><strong>Purpose:</strong> {selectedLoan.loanPurpose}</div>
                    <div><strong>Payment Terms:</strong> {selectedLoan.paymentTerms}</div>
                    <div><strong>Submitted:</strong> {selectedLoan.submittedDate}</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-3">Financial Profile</h4>
                    <div className="space-y-2 text-sm">
                    <div><strong>Monthly Income:</strong> ₱{selectedLoan.monthlyIncome.toLocaleString()}</div>
                    <div><strong>Credit Score:</strong> {selectedLoan.creditScore}</div>
                    <div><strong>Risk Level:</strong> <span className={getRiskColor(selectedLoan.riskLevel)}>{selectedLoan.riskLevel}</span></div>
                    <div><strong>Location:</strong> {selectedLoan.location}</div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-3">AI Assessment</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Recommendation:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        selectedLoan.aiRecommendation === 'Approve' ? 'bg-green-100 text-green-800' :
                        selectedLoan.aiRecommendation === 'Manual Review' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedLoan.aiRecommendation}
                      </span>
                    </div>
                    <div><strong>Status:</strong> {getStatusLabel(selectedLoan.status)}</div>
                    <div><strong>Collateral:</strong> {selectedLoan.collateral}</div>
                  </div>
                </div>
              </div>

              {/* AI Notes */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-3">AI Analysis Notes</h4>
                <p className="text-sm text-slate-700">{selectedLoan.notes}</p>
              </div>

              {/* Decision Actions */}
              {(selectedLoan.status === 'ready_for_review' || selectedLoan.status === 'needs_review') && (
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Loan Decision</h4>
                  <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      handleApprove(selectedLoan.id);
                      setSelectedLoan(null);
                    }}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                  >
                      <CheckCircle className="w-5 h-5" />
                    Approve Loan
                  </button>
                  <button 
                    onClick={() => {
                      handleReject(selectedLoan.id);
                      setSelectedLoan(null);
                    }}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 font-medium"
                  >
                      <XCircle className="w-5 h-5" />
                    Reject Loan
                  </button>
                  <button 
                    onClick={() => setSelectedLoan(null)}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                  >
                      Close Review
                  </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanQueue;
