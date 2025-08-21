// LoanQueue.jsx - Simplified MVP Loan Queue for SikAP
import React, { useState } from 'react';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, Clock, 
  User, DollarSign, MapPin, Smartphone, Leaf, Shield,
  AlertTriangle, TrendingUp, BarChart3, Brain, FileText, Briefcase
} from 'lucide-react';

const LoanQueue = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock loan applications focused on underserved Filipino borrowers
  const loanApplications = [
    {
      id: 'LN-2025-001',
      borrowerName: 'Maria Santos',
      borrowerType: 'Gig Worker - GrabFood Driver',
      loanAmount: 75000,
      loanType: 'Motorcycle Purchase',
      collateralType: 'Movable Asset - Motorcycle',
      status: 'ai_processing',
      priority: 'high',
      submittedDate: '2025-03-15',
      location: 'Quezon City',
      mobileWallet: 'GCash - Active 2 years',
      esgScore: 'Pending',
      aiProgress: {
        creditScoring: 'completed',
        esgAssessment: 'in_progress',
        assetValuation: 'pending',
        riskAssessment: 'pending'
      },
      riskLevel: null,
      creditScore: 680,
      notes: 'Regular GrabFood earnings, consistent mobile wallet activity',
      // Enhanced applicant details
      applicantDetails: {
        personalInfo: {
          fullName: 'Maria Elena Santos',
          age: 28,
          civilStatus: 'Single',
          dependents: 1,
          education: 'High School Graduate',
          phoneNumber: '+63 917 123 4567',
          email: 'maria.santos@email.com',
          address: '123 Kamias Road, Quezon City, Metro Manila'
        },
        employmentInfo: {
          currentJob: 'GrabFood Delivery Partner',
          duration: '2 years 3 months',
          avgMonthlyIncome: 25000,
          workingHours: '10-12 hours/day',
          workingDays: '6 days/week',
          vehicleOwned: '2019 Honda Click 125',
          licenseType: 'Professional Driver\'s License'
        },
        financialProfile: {
          bankAccount: 'BPI Savings - 5 years',
          mobileWalletDetails: {
            provider: 'GCash',
            duration: '2 years',
            monthlyVolume: 45000,
            transactionFrequency: 'Daily',
            averageBalance: 8500,
            paymentTypes: ['Bills', 'Food', 'Transportation', 'Savings']
          },
          existingLoans: 'None',
          creditHistory: 'Limited traditional credit, strong mobile wallet history'
        }
      },
      // AI Risk Assessment Details
      aiRiskAssessment: {
        overallRisk: 'Medium',
        confidence: 87,
        riskFactors: [
          {
            factor: 'Income Stability',
            score: 75,
            weight: 30,
            explanation: 'Gig work income shows consistent patterns over 2+ years with seasonal variations',
            evidence: ['Daily earnings average ₱1,200', 'Peak hours utilization 85%', 'Customer rating 4.8/5']
          },
          {
            factor: 'Mobile Wallet Behavior',
            score: 92,
            weight: 25,
            explanation: 'Excellent mobile financial management with regular savings patterns',
            evidence: ['₱45k monthly transaction volume', 'Regular bill payments', 'Consistent savings deposits']
          },
          {
            factor: 'Collateral Value',
            score: 68,
            weight: 20,
            explanation: 'Current motorcycle in good condition, market value stable',
            evidence: ['2019 Honda Click market value ₱65,000', 'Well-maintained condition', 'High demand model']
          },
          {
            factor: 'Alternative Data',
            score: 88,
            weight: 15,
            explanation: 'Strong digital footprint indicates responsible financial behavior',
            evidence: ['Social media business presence', 'Positive customer reviews', 'Active community participation']
          },
          {
            factor: 'Loan Purpose',
            score: 85,
            weight: 10,
            explanation: 'Income-generating asset purchase aligns with business growth',
            evidence: ['Newer motorcycle = more delivery opportunities', 'Fuel efficiency improvement', 'Professional advancement']
          }
        ],
        recommendations: [
          'Approve with standard terms - borrower demonstrates strong financial discipline',
          'Consider graduated payment structure during rainy season (lower gig work demand)',
          'Monitor mobile wallet activity for early warning signs',
          'Offer financial literacy program for traditional banking products'
        ],
        riskMitigation: [
          'Motorcycle insurance requirement',
          'GPS tracking device installation',
          'Monthly income verification through app data',
          'Emergency contact verification'
        ]
      }
    },
    {
      id: 'LN-2025-002',
      borrowerName: 'Juan dela Cruz',
      borrowerType: 'Freelancer - Graphic Designer',
      loanAmount: 50000,
      loanType: 'Equipment Purchase',
      collateralType: 'Clean Loan',
      status: 'ready_for_review',
      priority: 'medium',
      submittedDate: '2025-03-14',
      location: 'Manila',
      mobileWallet: 'PayMaya - Active 3 years',
      esgScore: 85,
      aiProgress: {
        creditScoring: 'completed',
        esgAssessment: 'completed',
        assetValuation: 'completed',
        riskAssessment: 'completed'
      },
      riskLevel: 'medium',
      creditScore: 720,
      notes: 'Strong freelance portfolio, sustainable business practices',
      applicantDetails: {
        personalInfo: {
          fullName: 'Juan Carlos dela Cruz',
          age: 32,
          civilStatus: 'Married',
          dependents: 2,
          education: 'Bachelor\'s Degree in Fine Arts',
          phoneNumber: '+63 918 234 5678',
          email: 'juan.delacruz@freelancer.com',
          address: '456 Taft Avenue, Manila, Metro Manila'
        },
        employmentInfo: {
          currentJob: 'Freelance Graphic Designer',
          duration: '4 years',
          avgMonthlyIncome: 35000,
          workingHours: 'Flexible, 6-8 hours/day',
          workingDays: '5-6 days/week',
          clientBase: '15 regular clients',
          specialization: 'Logo design, branding, digital marketing materials'
        },
        financialProfile: {
          bankAccount: 'BPI Family Savings - 8 years',
          mobileWalletDetails: {
            provider: 'PayMaya',
            duration: '3 years',
            monthlyVolume: 55000,
            transactionFrequency: 'Daily',
            averageBalance: 12000,
            paymentTypes: ['Business expenses', 'Client payments', 'Bills', 'Savings']
          },
          existingLoans: 'Personal loan ₱15,000 (current, good standing)',
          creditHistory: 'Good traditional credit, excellent digital payment history'
        }
      },
      aiRiskAssessment: {
        overallRisk: 'Low-Medium',
        confidence: 91,
        riskFactors: [
          {
            factor: 'Income Stability',
            score: 82,
            weight: 30,
            explanation: 'Freelance income diversified across multiple clients with consistent monthly earnings',
            evidence: ['15 regular clients', '4-year track record', 'Average ₱35k monthly income']
          },
          {
            factor: 'Mobile Wallet Behavior',
            score: 94,
            weight: 25,
            explanation: 'Excellent financial management with business-focused transactions',
            evidence: ['₱55k monthly volume', 'Business expense tracking', 'Regular client payments']
          },
          {
            factor: 'Credit History',
            score: 88,
            weight: 20,
            explanation: 'Good traditional credit history with existing loan in good standing',
            evidence: ['Existing ₱15k loan - no missed payments', '8-year banking relationship', 'Good credit bureau score']
          },
          {
            factor: 'Education & Skills',
            score: 90,
            weight: 15,
            explanation: 'Higher education and specialized skills provide income security',
            evidence: ['Bachelor\'s degree', 'Specialized design skills', 'Growing digital marketing demand']
          },
          {
            factor: 'Loan Purpose',
            score: 86,
            weight: 10,
            explanation: 'Equipment purchase will directly enhance earning capacity',
            evidence: ['Professional design equipment', 'Expand service offerings', 'Higher-value client projects']
          }
        ],
        recommendations: [
          'Approve with favorable terms - strong financial profile and income stability',
          'Consider business development loan products for future growth',
          'Offer digital banking services to streamline business operations'
        ],
        riskMitigation: [
          'Verify client contracts and payment history',
          'Monitor business income through PayMaya transactions',
          'Quarterly business performance check-ins'
        ]
      }
    },
    {
      id: 'LN-2025-003',
      borrowerName: 'Ana Reyes',
      borrowerType: 'SEME - Sari-Sari Store Owner',
      loanAmount: 100000,
      loanType: 'Business Expansion',
      collateralType: 'Movable Asset - Inventory',
      status: 'pending_documents',
      priority: 'low',
      submittedDate: '2025-03-13',
      location: 'Pasig City',
      mobileWallet: 'GCash - Active 1 year',
      esgScore: 92,
      aiProgress: {
        creditScoring: 'pending',
        esgAssessment: 'completed',
        assetValuation: 'pending',
        riskAssessment: 'pending'
      },
      riskLevel: null,
      creditScore: null,
      notes: 'Community-focused business, needs additional documentation'
    },
    {
      id: 'LN-2025-004',
      borrowerName: 'Carlos Mendoza',
      borrowerType: 'Gig Worker - Lalamove Rider',
      loanAmount: 80000,
      loanType: 'Vehicle Upgrade',
      collateralType: 'Movable Asset - Vehicle',
      status: 'approved',
      priority: 'high',
      submittedDate: '2025-03-12',
      location: 'Makati City',
      mobileWallet: 'GCash - Active 4 years',
      esgScore: 78,
      aiProgress: {
        creditScoring: 'completed',
        esgAssessment: 'completed',
        assetValuation: 'completed',
        riskAssessment: 'completed'
      },
      riskLevel: 'low',
      creditScore: 750,
      notes: 'Excellent payment history, sustainable transportation upgrade'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending_documents: 'bg-amber-100 text-amber-800',
      ai_processing: 'bg-blue-100 text-blue-800',
      ready_for_review: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending_documents: 'Pending Documents',
      ai_processing: 'AI Processing',
      ready_for_review: 'Ready for Review',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-amber-600',
      low: 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
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
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending_documents">Pending Documents</option>
              <option value="ai_processing">AI Processing</option>
              <option value="ready_for_review">Ready for Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
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
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-slate-900">{loan.borrowerName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                      {getStatusLabel(loan.status)}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(loan.priority)}`}>
                      {loan.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
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
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      <span>{loan.mobileWallet}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span><strong>Loan Type:</strong> {loan.loanType}</span>
                    <span><strong>Collateral:</strong> {loan.collateralType}</span>
                    {loan.creditScore && (
                      <span><strong>Credit Score:</strong> {loan.creditScore}</span>
                    )}
                    {loan.esgScore && (
                      <div className="flex items-center gap-1">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span><strong>ESG:</strong> {loan.esgScore}/100</span>
                      </div>
                    )}
                  </div>

                  {/* AI Progress Indicators */}
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm font-medium text-slate-700">AI Progress:</span>
                    {Object.entries(loan.aiProgress).map(([step, status]) => (
                      <div key={step} className="flex items-center gap-1">
                        {status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-xs text-slate-600 capitalize">
                          {step.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
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
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  
                  {loan.status === 'ready_for_review' && (
                    <>
                      <button
                        onClick={() => handleApprove(loan.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(loan.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loan Detail Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-900">
                  Loan Application Details - {selectedLoan.id}
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
              {/* Comprehensive Borrower Information */}
              {selectedLoan.applicantDetails && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Personal Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Full Name:</strong> {selectedLoan.applicantDetails.personalInfo.fullName}</div>
                      <div><strong>Age:</strong> {selectedLoan.applicantDetails.personalInfo.age}</div>
                      <div><strong>Civil Status:</strong> {selectedLoan.applicantDetails.personalInfo.civilStatus}</div>
                      <div><strong>Dependents:</strong> {selectedLoan.applicantDetails.personalInfo.dependents}</div>
                      <div><strong>Education:</strong> {selectedLoan.applicantDetails.personalInfo.education}</div>
                      <div><strong>Phone:</strong> {selectedLoan.applicantDetails.personalInfo.phoneNumber}</div>
                      <div><strong>Email:</strong> {selectedLoan.applicantDetails.personalInfo.email}</div>
                      <div><strong>Address:</strong> {selectedLoan.applicantDetails.personalInfo.address}</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Employment Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Current Job:</strong> {selectedLoan.applicantDetails.employmentInfo.currentJob}</div>
                      <div><strong>Duration:</strong> {selectedLoan.applicantDetails.employmentInfo.duration}</div>
                      <div><strong>Monthly Income:</strong> ₱{selectedLoan.applicantDetails.employmentInfo.avgMonthlyIncome?.toLocaleString()}</div>
                      <div><strong>Working Hours:</strong> {selectedLoan.applicantDetails.employmentInfo.workingHours}</div>
                      <div><strong>Working Days:</strong> {selectedLoan.applicantDetails.employmentInfo.workingDays}</div>
                      {selectedLoan.applicantDetails.employmentInfo.vehicleOwned && (
                        <div><strong>Vehicle:</strong> {selectedLoan.applicantDetails.employmentInfo.vehicleOwned}</div>
                      )}
                      {selectedLoan.applicantDetails.employmentInfo.clientBase && (
                        <div><strong>Client Base:</strong> {selectedLoan.applicantDetails.employmentInfo.clientBase}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Financial Profile
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Bank Account:</strong> {selectedLoan.applicantDetails.financialProfile.bankAccount}</div>
                      <div><strong>Mobile Wallet:</strong> {selectedLoan.applicantDetails.financialProfile.mobileWalletDetails.provider}</div>
                      <div><strong>Wallet Duration:</strong> {selectedLoan.applicantDetails.financialProfile.mobileWalletDetails.duration}</div>
                      <div><strong>Monthly Volume:</strong> ₱{selectedLoan.applicantDetails.financialProfile.mobileWalletDetails.monthlyVolume?.toLocaleString()}</div>
                      <div><strong>Avg Balance:</strong> ₱{selectedLoan.applicantDetails.financialProfile.mobileWalletDetails.averageBalance?.toLocaleString()}</div>
                      <div><strong>Transaction Freq:</strong> {selectedLoan.applicantDetails.financialProfile.mobileWalletDetails.transactionFrequency}</div>
                      <div><strong>Existing Loans:</strong> {selectedLoan.applicantDetails.financialProfile.existingLoans}</div>
                      <div><strong>Credit History:</strong> {selectedLoan.applicantDetails.financialProfile.creditHistory}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comprehensive AI Risk Assessment */}
              {selectedLoan.aiRiskAssessment && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Risk Assessment Analysis
                  </h4>
                  
                  {/* Overall Risk Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          selectedLoan.aiRiskAssessment.overallRisk === 'Low' ? 'text-green-600' :
                          selectedLoan.aiRiskAssessment.overallRisk === 'Low-Medium' ? 'text-blue-600' :
                          selectedLoan.aiRiskAssessment.overallRisk === 'Medium' ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {selectedLoan.aiRiskAssessment.overallRisk}
                        </div>
                        <div className="text-sm text-slate-700">Overall Risk Level</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedLoan.aiRiskAssessment.confidence}%</div>
                        <div className="text-sm text-slate-700">AI Confidence</div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedLoan.aiRiskAssessment.riskFactors.reduce((sum, factor) => sum + (factor.score * factor.weight / 100), 0).toFixed(0)}
                        </div>
                        <div className="text-sm text-slate-700">Weighted Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Risk Factor Analysis */}
                  <div className="space-y-4 mb-6">
                    <h5 className="font-medium text-slate-900">Risk Factor Breakdown:</h5>
                    {selectedLoan.aiRiskAssessment.riskFactors.map((factor, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h6 className="font-medium text-slate-900">{factor.factor}</h6>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                factor.score >= 90 ? 'bg-green-100 text-green-800' :
                                factor.score >= 80 ? 'bg-blue-100 text-blue-800' :
                                factor.score >= 70 ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                Score: {factor.score}/100
                              </div>
                              <div className="text-xs text-slate-600">Weight: {factor.weight}%</div>
                            </div>
                            <p className="text-sm text-slate-700 mb-3">{factor.explanation}</p>
                            <div>
                              <div className="text-xs font-medium text-slate-600 mb-1">Supporting Evidence:</div>
                              <ul className="text-xs text-slate-600 space-y-1">
                                {factor.evidence.map((evidence, evidenceIndex) => (
                                  <li key={evidenceIndex} className="flex items-start gap-1">
                                    <span className="text-green-600">•</span>
                                    <span>{evidence}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold ${
                              factor.score >= 90 ? 'bg-green-100 text-green-800' :
                              factor.score >= 80 ? 'bg-blue-100 text-blue-800' :
                              factor.score >= 70 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {factor.score}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        AI Recommendations
                      </h5>
                      <ul className="space-y-2 text-sm text-green-800">
                        {selectedLoan.aiRiskAssessment.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h5 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Risk Mitigation
                      </h5>
                      <ul className="space-y-2 text-sm text-amber-800">
                        {selectedLoan.aiRiskAssessment.riskMitigation.map((mitigation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-amber-600 mt-1">•</span>
                            <span>{mitigation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Traditional Assessment Results */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Assessment Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {selectedLoan.creditScore && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedLoan.creditScore}</div>
                        <div className="text-sm text-blue-700">Credit Score</div>
                      </div>
                    </div>
                  )}
                  {selectedLoan.esgScore && selectedLoan.esgScore !== 'Pending' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedLoan.esgScore}/100</div>
                        <div className="text-sm text-green-700">ESG Score</div>
                      </div>
                    </div>
                  )}
                  {selectedLoan.riskLevel && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 capitalize">{selectedLoan.riskLevel}</div>
                        <div className="text-sm text-purple-700">Risk Level</div>
                      </div>
                    </div>
                  )}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-600">₱{selectedLoan.loanAmount.toLocaleString()}</div>
                      <div className="text-sm text-slate-700">Loan Amount</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Details */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-3">Loan Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Loan ID:</strong> {selectedLoan.id}</div>
                  <div><strong>Type:</strong> {selectedLoan.loanType}</div>
                  <div><strong>Collateral:</strong> {selectedLoan.collateralType}</div>
                  <div><strong>Priority:</strong> {selectedLoan.priority.toUpperCase()}</div>
                  <div><strong>Status:</strong> {getStatusLabel(selectedLoan.status)}</div>
                  <div><strong>Submitted:</strong> {selectedLoan.submittedDate}</div>
                </div>
              </div>

              {/* Officer Notes */}
              {selectedLoan.notes && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Officer Notes</h4>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm">
                    {selectedLoan.notes}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedLoan.status === 'ready_for_review' && (
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button 
                    onClick={() => {
                      handleApprove(selectedLoan.id);
                      setSelectedLoan(null);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Loan
                  </button>
                  <button 
                    onClick={() => {
                      handleReject(selectedLoan.id);
                      setSelectedLoan(null);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Loan
                  </button>
                  <button 
                    onClick={() => setSelectedLoan(null)}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    Close
                  </button>
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
