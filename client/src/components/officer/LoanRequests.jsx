// components/LoanRequests.jsx - Loan Requests Management (Complete)
import React, { useState } from 'react';
import { 
  Search, Filter, Eye, Brain, MoreVertical, XCircle, CheckCircle, 
  RefreshCw, Download, Upload, Send, Edit, Trash2, Flag
} from 'lucide-react';

const LoanRequests = ({ triggerWebhook, sendToAgent }) => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedLoans, setSelectedLoans] = useState([]);

  // Mock data for loan applications
  const loanRequests = [
    {
      id: 'LN-2025-001',
      borrowerName: 'Maria Santos',
      businessName: 'Maria\'s Bakery',
      amount: 150000,
      type: 'Business Expansion',
      status: 'pending_review',
      stage: 'pre_application',
      priority: 'high',
      creditScore: null,
      aiRiskScore: 'PENDING',
      submittedDate: '2025-03-15',
      dueDate: '2025-03-22',
      documents: ['Pre-Application Form'],
      esgScore: null,
      agentAssignments: {
        creditScoring: 'pending',
        esgAssessment: 'not_started',
        assetValuation: 'not_started',
        documentVerification: 'pending'
      },
      webhookStatus: {
        preApplication: 'completed',
        applicationForm: 'pending',
        aiProcessing: 'not_started',
        humanReview: 'not_started'
      },
      timeline: [
        { date: '2025-03-15 10:30', action: 'Pre-application submitted', status: 'completed', agent: 'user' },
        { date: '2025-03-15 11:00', action: 'Initial review started', status: 'in_progress', agent: 'system' }
      ],
      borrowerInfo: {
        email: 'maria.santos@email.com',
        phone: '+63 917 123 4567',
        address: '123 Main St, Pasig City',
        businessAge: '3 years',
        employees: '5-10',
        monthlyRevenue: '₱85,000'
      }
    },
    {
      id: 'LN-2025-002',
      borrowerName: 'Juan Dela Cruz',
      businessName: 'Tech Solutions Inc',
      amount: 500000,
      type: 'Equipment Purchase',
      status: 'ai_processing',
      stage: 'application_review',
      priority: 'medium',
      creditScore: 680,
      aiRiskScore: 'MEDIUM',
      submittedDate: '2025-03-10',
      dueDate: '2025-03-17',
      documents: ['Application Form', 'Bank Statements', 'Business Permit'],
      esgScore: 72,
      agentAssignments: {
        creditScoring: 'completed',
        esgAssessment: 'in_progress',
        assetValuation: 'completed',
        documentVerification: 'completed'
      },
      webhookStatus: {
        preApplication: 'completed',
        applicationForm: 'completed',
        aiProcessing: 'in_progress',
        humanReview: 'pending'
      },
      timeline: [
        { date: '2025-03-10 09:00', action: 'Pre-application submitted', status: 'completed', agent: 'user' },
        { date: '2025-03-10 14:30', action: 'Application form sent', status: 'completed', agent: 'loan_officer' },
        { date: '2025-03-12 16:45', action: 'Documents uploaded', status: 'completed', agent: 'user' },
        { date: '2025-03-13 10:00', action: 'Credit scoring completed', status: 'completed', agent: 'credit_agent' },
        { date: '2025-03-13 14:20', action: 'Asset valuation completed', status: 'completed', agent: 'asset_agent' },
        { date: '2025-03-14 11:30', action: 'ESG assessment started', status: 'in_progress', agent: 'esg_agent' }
      ],
      borrowerInfo: {
        email: 'juan.delacruz@techsolutions.com',
        phone: '+63 917 987 6543',
        address: '456 Tech Ave, Makati City',
        businessAge: '5 years',
        employees: '15-25',
        monthlyRevenue: '₱180,000'
      }
    },
    {
      id: 'LN-2025-003',
      borrowerName: 'Ana Reyes',
      businessName: 'Green Harvest Farm',
      amount: 300000,
      type: 'Agricultural Loan',
      status: 'human_review',
      stage: 'final_review',
      priority: 'high',
      creditScore: 720,
      aiRiskScore: 'LOW',
      submittedDate: '2025-03-08',
      dueDate: 'Completed',
      documents: ['Complete'],
      esgScore: 95,
      agentAssignments: {
        creditScoring: 'completed',
        esgAssessment: 'completed',
        assetValuation: 'completed',
        documentVerification: 'completed'
      },
      webhookStatus: {
        preApplication: 'completed',
        applicationForm: 'completed',
        aiProcessing: 'completed',
        humanReview: 'in_progress'
      },
      aiRecommendation: {
        decision: 'approve',
        confidence: 0.92,
        reasoning: 'Strong credit history, excellent ESG score, sustainable business model',
        conditions: ['Monthly financial reporting', 'Annual ESG impact assessment']
      },
      borrowerInfo: {
        email: 'ana.reyes@greenharvest.com',
        phone: '+63 917 555 0123',
        address: '789 Farm Road, Nueva Ecija',
        businessAge: '7 years',
        employees: '20-30',
        monthlyRevenue: '₱120,000'
      }
    },
    {
      id: 'LN-2025-004',
      borrowerName: 'Carlos Martinez',
      businessName: 'Martinez Auto Repair',
      amount: 75000,
      type: 'Working Capital',
      status: 'approved',
      stage: 'completed',
      priority: 'low',
      creditScore: 650,
      aiRiskScore: 'MEDIUM',
      submittedDate: '2025-03-05',
      dueDate: 'Completed',
      documents: ['Complete'],
      esgScore: 68,
      agentAssignments: {
        creditScoring: 'completed',
        esgAssessment: 'completed',
        assetValuation: 'completed',
        documentVerification: 'completed'
      },
      borrowerInfo: {
        email: 'carlos@martinezauto.com',
        phone: '+63 917 444 5555',
        address: '321 Repair St, Quezon City',
        businessAge: '10 years',
        employees: '5-10',
        monthlyRevenue: '₱60,000'
      }
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending_review: 'bg-amber-100 text-amber-800',
      ai_processing: 'bg-blue-100 text-blue-800',
      human_review: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      on_hold: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getAgentStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      in_progress: 'text-blue-600 bg-blue-100',
      pending: 'text-amber-600 bg-amber-100',
      not_started: 'text-gray-600 bg-gray-100',
      failed: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-amber-500',
      low: 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const filteredApplications = loanRequests.filter(loan => {
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    const matchesSearch = loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleLoanSelection = (loanId) => {
    setSelectedLoans(prev => 
      prev.includes(loanId) 
        ? prev.filter(id => id !== loanId)
        : [...prev, loanId]
    );
  };

  const handleBulkAction = (action) => {
    triggerWebhook('bulk-action', { action, loanIds: selectedLoans });
    setSelectedLoans([]);
    setShowBulkActions(false);
  };

  const handleLoanAction = (action, loan) => {
    triggerWebhook('loan-action', { action, loanId: loan.id, loan });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search loan requests..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Stages</option>
              <option value="pending_review">Pending Review</option>
              <option value="ai_processing">AI Processing</option>
              <option value="human_review">Human Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button 
              onClick={() => setShowBulkActions(!showBulkActions)}
              className={`px-4 py-2 border rounded-lg hover:bg-slate-50 ${
                showBulkActions ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
            <button 
              onClick={() => triggerWebhook('export-loans', { filters: { status: filterStatus, search: searchQuery } })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && selectedLoans.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedLoans.length} loan(s) selected
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkAction('approve')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Bulk Approve
                </button>
                <button 
                  onClick={() => handleBulkAction('send_to_ai')}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Send to AI
                </button>
                <button 
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Export Selected
                </button>
                <button 
                  onClick={() => setSelectedLoans([])}
                  className="px-3 py-1 border border-slate-300 text-slate-700 rounded text-sm hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loan Requests Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {showBulkActions && (
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedLoans.length === filteredApplications.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLoans(filteredApplications.map(loan => loan.id));
                        } else {
                          setSelectedLoans([]);
                        }
                      }}
                      className="rounded border-slate-300"
                    />
                  </th>
                )}
                <th className="text-left py-3 px-4 font-medium text-slate-700">Borrower</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Stage</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">AI Agents</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Risk Score</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Timeline</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-50">
                  {showBulkActions && (
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedLoans.includes(loan.id)}
                        onChange={() => handleLoanSelection(loan.id)}
                        className="rounded border-slate-300"
                      />
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {loan.borrowerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{loan.borrowerName}</div>
                        <div className="text-sm text-slate-600">{loan.businessName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">{formatCurrency(loan.amount)}</td>
                  <td className="py-3 px-4 text-slate-600">{loan.type}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {loan.stage.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(loan.priority)}`} title={`${loan.priority} priority`}></div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {Object.entries(loan.agentAssignments).map(([agent, status]) => (
                        <div
                          key={agent}
                          className={`w-3 h-3 rounded-full ${
                            status === 'completed' ? 'bg-green-500' :
                            status === 'in_progress' ? 'bg-blue-500' :
                            status === 'pending' ? 'bg-amber-500' :
                            'bg-gray-300'
                          }`}
                          title={`${agent.replace(/([A-Z])/g, ' $1').trim()}: ${status}`}
                        ></div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {loan.aiRiskScore !== 'PENDING' ? (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        loan.aiRiskScore === 'LOW' ? 'bg-green-100 text-green-800' :
                        loan.aiRiskScore === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {loan.aiRiskScore}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{loan.submittedDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setSelectedLoan(loan)}
                        className="p-1 hover:bg-slate-100 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      <button 
                        onClick={() => sendToAgent('credit-scoring', loan.id, { action: 'analyze' })}
                        className="p-1 hover:bg-slate-100 rounded"
                        title="Send to AI Agent"
                      >
                        <Brain className="w-4 h-4 text-slate-600" />
                      </button>
                      <button 
                        onClick={() => triggerWebhook('download-documents', { loanId: loan.id })}
                        className="p-1 hover:bg-slate-100 rounded"
                        title="Download Documents"
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                      <div className="relative group">
                        <button className="p-1 hover:bg-slate-100 rounded">
                          <MoreVertical className="w-4 h-4 text-slate-600" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <div className="py-1 min-w-[140px]">
                            <button 
                              onClick={() => handleLoanAction('flag', loan)}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                            >
                              <Flag className="w-3 h-3" />
                              Flag for Review
                            </button>
                            <button 
                              onClick={() => handleLoanAction('edit', loan)}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                            >
                              <Edit className="w-3 h-3" />
                              Edit Details
                            </button>
                            <button 
                              onClick={() => handleLoanAction('message', loan)}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                            >
                              <Send className="w-3 h-3" />
                              Send Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing {filteredApplications.length} of {loanRequests.length} applications
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {/* Loan Detail Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  Loan Request Details - {selectedLoan.id}
                </h3>
                <button 
                  onClick={() => setSelectedLoan(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Borrower Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Borrower Information</h4>
                      <div className="space-y-2">
                        <div><span className="text-sm text-slate-600">Name:</span> <span className="font-medium">{selectedLoan.borrowerName}</span></div>
                        <div><span className="text-sm text-slate-600">Business:</span> <span className="font-medium">{selectedLoan.businessName}</span></div>
                        <div><span className="text-sm text-slate-600">Email:</span> <span className="font-medium">{selectedLoan.borrowerInfo.email}</span></div>
                        <div><span className="text-sm text-slate-600">Phone:</span> <span className="font-medium">{selectedLoan.borrowerInfo.phone}</span></div>
                        <div><span className="text-sm text-slate-600">Address:</span> <span className="font-medium">{selectedLoan.borrowerInfo.address}</span></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Business Details</h4>
                      <div className="space-y-2">
                        <div><span className="text-sm text-slate-600">Business Age:</span> <span className="font-medium">{selectedLoan.borrowerInfo.businessAge}</span></div>
                        <div><span className="text-sm text-slate-600">Employees:</span> <span className="font-medium">{selectedLoan.borrowerInfo.employees}</span></div>
                        <div><span className="text-sm text-slate-600">Monthly Revenue:</span> <span className="font-medium">{selectedLoan.borrowerInfo.monthlyRevenue}</span></div>
                        <div><span className="text-sm text-slate-600">Loan Type:</span> <span className="font-medium">{selectedLoan.type}</span></div>
                        <div><span className="text-sm text-slate-600">Amount:</span> <span className="font-medium">{formatCurrency(selectedLoan.amount)}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* AI Assessment */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">AI Assessment Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="text-sm text-slate-600 mb-1">Risk Score</div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedLoan.aiRiskScore === 'LOW' ? 'bg-green-100 text-green-800' :
                          selectedLoan.aiRiskScore === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                          selectedLoan.aiRiskScore === 'HIGH' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedLoan.aiRiskScore}
                        </span>
                      </div>
                      {selectedLoan.creditScore && (
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="text-sm text-slate-600 mb-1">Credit Score</div>
                          <div className="text-xl font-bold text-slate-900">{selectedLoan.creditScore}</div>
                        </div>
                      )}
                      {selectedLoan.esgScore && (
                        <div className="bg-slate-50 rounded-lg p-4">
                          <div className="text-sm text-slate-600 mb-1">ESG Score</div>
                          <div className="text-xl font-bold text-green-600">{selectedLoan.esgScore}/100</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Agent Status Sidebar */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">AI Agent Processing Status</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedLoan.agentAssignments).map(([agent, status]) => (
                      <div key={agent} className="border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 capitalize">
                            {agent.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getAgentStatusColor(status)}`}>
                            {status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => sendToAgent(agent, selectedLoan.id, { action: 'process' })}
                            className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            disabled={status === 'completed'}
                          >
                            {status === 'completed' ? 'Completed' : 'Trigger'}
                          </button>
                          {status === 'in_progress' && (
                            <button 
                              onClick={() => sendToAgent(agent, selectedLoan.id, { action: 'refresh' })}
                              className="px-2 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Processing Timeline</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedLoan.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        event.status === 'completed' ? 'bg-green-500' :
                        event.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{event.action}</p>
                            <p className="text-xs text-slate-600">{event.agent} • {event.date}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            event.status === 'completed' ? 'bg-green-100 text-green-800' :
                            event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedLoan.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                      <span className="text-sm text-slate-700">{doc}</span>
                      <button 
                        onClick={() => triggerWebhook('download-document', { loanId: selectedLoan.id, document: doc })}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => triggerWebhook('upload-document', { loanId: selectedLoan.id })}
                    className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Document</span>
                  </button>
                </div>
              </div>

              {/* AI Recommendation (if available) */}
              {selectedLoan.aiRecommendation && (
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">AI Recommendation</h4>
                  <div className={`border-l-4 p-4 ${
                    selectedLoan.aiRecommendation.decision === 'approve' ? 'border-green-500 bg-green-50' :
                    selectedLoan.aiRecommendation.decision === 'reject' ? 'border-red-500 bg-red-50' :
                    'border-amber-500 bg-amber-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-medium ${
                        selectedLoan.aiRecommendation.decision === 'approve' ? 'text-green-800' :
                        selectedLoan.aiRecommendation.decision === 'reject' ? 'text-red-800' :
                        'text-amber-800'
                      }`}>
                        {selectedLoan.aiRecommendation.decision.toUpperCase()}
                      </span>
                      <span className="text-sm text-slate-600">
                        (Confidence: {Math.round(selectedLoan.aiRecommendation.confidence * 100)}%)
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-3">{selectedLoan.aiRecommendation.reasoning}</p>
                    {selectedLoan.aiRecommendation.conditions && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Recommended Conditions:</p>
                        <ul className="text-sm text-slate-600 list-disc list-inside">
                          {selectedLoan.aiRecommendation.conditions.map((condition, index) => (
                            <li key={index}>{condition}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Communication Log */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900">Communication Log</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Send className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-slate-900">Application form sent</span>
                        <span className="text-xs text-slate-500">2025-03-10 14:30</span>
                      </div>
                      <p className="text-sm text-slate-600">Sent complete loan application form to borrower via email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-slate-900">Documents received</span>
                        <span className="text-xs text-slate-500">2025-03-12 16:45</span>
                      </div>
                      <p className="text-sm text-slate-600">Borrower uploaded bank statements and business permit</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => triggerWebhook('send-message', { loanId: selectedLoan.id })}
                  className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message to Borrower
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => handleLoanAction('approve', selectedLoan)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Loan
                </button>
                <button 
                  onClick={() => handleLoanAction('reject', selectedLoan)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Loan
                </button>
                <button 
                  onClick={() => handleLoanAction('request_info', selectedLoan)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Request More Info
                </button>
                <button 
                  onClick={() => handleLoanAction('hold', selectedLoan)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Hold for Review
                </button>
                <button 
                  onClick={() => triggerWebhook('generate-report', { loanId: selectedLoan.id })}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanRequests;