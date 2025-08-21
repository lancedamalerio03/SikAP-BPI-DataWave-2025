// ESGPortfolio.jsx - ESG-Tagged Loans Portfolio Impact Analysis
import React, { useState } from 'react';
import { 
  Leaf, TrendingUp, DollarSign, Users, Target, 
  BarChart3, PieChart, Eye, Filter, ArrowUpRight
} from 'lucide-react';

const ESGPortfolio = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState(null);

  // ESG Portfolio Overview Metrics
  const portfolioMetrics = {
    totalESGLoans: 156,
    totalValue: 12800000, // ₱12.8M
    averageESGScore: 78.5,
    impactBeneficiaries: 312,
    co2Reduction: 4.2, // tons
    jobsCreated: 89,
    womenEmpowered: 67,
    communityProjects: 23
  };

  // ESG-tagged loans with detailed impact data
  const esgLoans = [
    {
      id: 'LN-2025-001',
      borrowerName: 'Maria Santos',
      borrowerType: 'Gig Worker - GrabFood Driver',
      loanAmount: 75000,
      loanType: 'Electric Motorcycle Purchase',
      status: 'active',
      esgScore: 92,
      esgBreakdown: {
        environmental: 95,
        social: 88,
        governance: 93
      },
      impactMetrics: {
        co2ReductionPerYear: 2.1,
        fuelSavingsPerMonth: 3500,
        incomeIncreasePercent: 25,
        communityRating: 'High'
      },
      esgTags: ['Clean Transportation', 'Livelihood Enhancement', 'Carbon Reduction'],
      sustainabilityGoals: ['Reduced Emissions', 'Decent Work', 'Sustainable Cities'],
      monthlyProgress: {
        incomeGrowth: 28,
        fuelSavings: 3800,
        deliveriesCompleted: 450,
        customerRating: 4.8
      },
      communityImpact: 'Reduced air pollution in Quezon City delivery routes'
    },
    {
      id: 'LN-2025-002',
      borrowerName: 'Ana Reyes',
      borrowerType: 'SEME - Sari-Sari Store Owner',
      loanAmount: 100000,
      loanType: 'Solar Panel & Refrigeration',
      status: 'active',
      esgScore: 88,
      esgBreakdown: {
        environmental: 92,
        social: 85,
        governance: 87
      },
      impactMetrics: {
        co2ReductionPerYear: 1.8,
        energySavingsPerMonth: 2200,
        incomeIncreasePercent: 35,
        communityRating: 'Very High'
      },
      esgTags: ['Renewable Energy', 'Food Security', 'Women Empowerment'],
      sustainabilityGoals: ['Clean Energy', 'Zero Hunger', 'Gender Equality'],
      monthlyProgress: {
        incomeGrowth: 38,
        energySavings: 2400,
        customersServed: 180,
        foodWasteReduction: 15
      },
      communityImpact: 'Provides affordable fresh food storage for 180 families in Pasig'
    },
    {
      id: 'LN-2025-003',
      borrowerName: 'Juan dela Cruz',
      borrowerType: 'Freelancer - Graphic Designer',
      loanAmount: 50000,
      loanType: 'Home Office Solar Setup',
      status: 'active',
      esgScore: 85,
      esgBreakdown: {
        environmental: 90,
        social: 78,
        governance: 87
      },
      impactMetrics: {
        co2ReductionPerYear: 0.8,
        energySavingsPerMonth: 1500,
        incomeIncreasePercent: 20,
        communityRating: 'Medium'
      },
      esgTags: ['Clean Energy', 'Digital Inclusion', 'Home-based Business'],
      sustainabilityGoals: ['Affordable Clean Energy', 'Decent Work'],
      monthlyProgress: {
        incomeGrowth: 22,
        energySavings: 1650,
        projectsCompleted: 12,
        clientSatisfaction: 4.9
      },
      communityImpact: 'Mentors 5 young designers in sustainable design practices'
    },
    {
      id: 'LN-2025-004',
      borrowerName: 'Carlos Mendoza',
      borrowerType: 'SEME - Urban Farming',
      loanAmount: 80000,
      loanType: 'Hydroponic System Setup',
      status: 'active',
      esgScore: 94,
      esgBreakdown: {
        environmental: 96,
        social: 91,
        governance: 95
      },
      impactMetrics: {
        co2ReductionPerYear: 3.2,
        waterSavingsPercent: 70,
        incomeIncreasePercent: 45,
        communityRating: 'Very High'
      },
      esgTags: ['Sustainable Agriculture', 'Water Conservation', 'Food Security'],
      sustainabilityGoals: ['Zero Hunger', 'Clean Water', 'Sustainable Agriculture'],
      monthlyProgress: {
        incomeGrowth: 48,
        waterSavings: 75,
        vegetablesProduced: 250, // kg
        familiesFed: 45
      },
      communityImpact: 'Supplies fresh vegetables to 45 families, reduces food miles by 80%'
    }
  ];

  // Portfolio impact calculations
  const portfolioImpact = {
    totalCO2Reduction: esgLoans.reduce((sum, loan) => sum + loan.impactMetrics.co2ReductionPerYear, 0),
    totalIncome: esgLoans.reduce((sum, loan) => sum + loan.loanAmount, 0),
    avgIncomeIncrease: esgLoans.reduce((sum, loan) => sum + loan.impactMetrics.incomeIncreasePercent, 0) / esgLoans.length,
    highImpactLoans: esgLoans.filter(loan => loan.esgScore >= 90).length
  };

  const getESGScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getESGScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  const filteredLoans = selectedFilter === 'all' 
    ? esgLoans 
    : esgLoans.filter(loan => {
        if (selectedFilter === 'high_impact') return loan.esgScore >= 90;
        if (selectedFilter === 'renewable_energy') return loan.esgTags.some(tag => tag.includes('Energy'));
        if (selectedFilter === 'women_empowered') return loan.borrowerName.includes('Ana') || loan.borrowerName.includes('Maria');
        return true;
      });

  return (
    <div className="space-y-6">
      {/* Portfolio Impact Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">ESG Portfolio Impact</h2>
            <p className="text-slate-600">Environmental, Social & Governance lending outcomes</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
            <Leaf className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Sustainable Lending Program</span>
          </div>
        </div>

        {/* Key Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{portfolioImpact.totalCO2Reduction.toFixed(1)}</div>
                <div className="text-sm text-green-700">Tons CO₂ Reduced/Year</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{portfolioImpact.avgIncomeIncrease.toFixed(0)}%</div>
                <div className="text-sm text-blue-700">Avg Income Increase</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{portfolioMetrics.impactBeneficiaries}</div>
                <div className="text-sm text-purple-700">People Impacted</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">{portfolioImpact.highImpactLoans}</div>
                <div className="text-sm text-amber-700">High Impact Loans</div>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">Environmental Impact</h4>
            <ul className="space-y-1 text-slate-600">
              <li>• {portfolioMetrics.co2Reduction} tons CO₂ reduced annually</li>
              <li>• 70% average water savings in agricultural loans</li>
              <li>• {portfolioMetrics.communityProjects} renewable energy projects</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">Social Impact</h4>
            <ul className="space-y-1 text-slate-600">
              <li>• {portfolioMetrics.jobsCreated} jobs created/sustained</li>
              <li>• {portfolioMetrics.womenEmpowered} women entrepreneurs empowered</li>
              <li>• 180 families with improved food security</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-slate-900 mb-2">Financial Impact</h4>
            <ul className="space-y-1 text-slate-600">
              <li>• ₱{(portfolioMetrics.totalValue / 1000000).toFixed(1)}M total portfolio value</li>
              <li>• {portfolioImpact.avgIncomeIncrease.toFixed(0)}% average income increase</li>
              <li>• 96% repayment rate for ESG loans</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedFilter === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ESG Loans ({esgLoans.length})
            </button>
            <button
              onClick={() => setSelectedFilter('high_impact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedFilter === 'high_impact' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              High Impact (90+)
            </button>
            <button
              onClick={() => setSelectedFilter('renewable_energy')}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                selectedFilter === 'renewable_energy' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Renewable Energy
            </button>
          </div>
          <div className="text-sm text-slate-600">
            Showing {filteredLoans.length} of {esgLoans.length} ESG loans
          </div>
        </div>
      </div>

      {/* ESG Loans List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">ESG-Tagged Loan Portfolio</h3>
        </div>
        
        <div className="divide-y divide-slate-200">
          {filteredLoans.map((loan) => (
            <div key={loan.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-lg font-medium text-slate-900">{loan.borrowerName}</h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getESGScoreColor(loan.esgScore)}`}>
                      ESG Score: {loan.esgScore}/100 ({getESGScoreLabel(loan.esgScore)})
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                    <div><strong>Type:</strong> {loan.borrowerType}</div>
                    <div><strong>Amount:</strong> ₱{loan.loanAmount.toLocaleString()}</div>
                    <div><strong>Purpose:</strong> {loan.loanType}</div>
                    <div><strong>Status:</strong> <span className="text-green-600 capitalize">{loan.status}</span></div>
                  </div>

                  {/* ESG Breakdown */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{loan.esgBreakdown.environmental}</div>
                      <div className="text-xs text-slate-600">Environmental</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{loan.esgBreakdown.social}</div>
                      <div className="text-xs text-slate-600">Social</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{loan.esgBreakdown.governance}</div>
                      <div className="text-xs text-slate-600">Governance</div>
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="bg-green-50 p-2 rounded">
                      <div className="font-medium text-green-800">{loan.impactMetrics.co2ReductionPerYear} tons</div>
                      <div className="text-green-600 text-xs">CO₂ Reduced/Year</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <div className="font-medium text-blue-800">+{loan.impactMetrics.incomeIncreasePercent}%</div>
                      <div className="text-blue-600 text-xs">Income Increase</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-800">{loan.monthlyProgress.incomeGrowth}%</div>
                      <div className="text-purple-600 text-xs">Monthly Growth</div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded">
                      <div className="font-medium text-amber-800">{loan.impactMetrics.communityRating}</div>
                      <div className="text-amber-600 text-xs">Community Rating</div>
                    </div>
                  </div>

                  {/* ESG Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {loan.esgTags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Community Impact */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-slate-900 mb-1">Community Impact:</div>
                    <div className="text-sm text-slate-700">{loan.communityImpact}</div>
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => setSelectedLoan(loan)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed ESG Loan Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    ESG Impact Analysis - {selectedLoan.id}
                  </h3>
                  <p className="text-slate-600">{selectedLoan.borrowerName} - {selectedLoan.loanType}</p>
                </div>
                <button 
                  onClick={() => setSelectedLoan(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* ESG Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{selectedLoan.esgBreakdown.environmental}</div>
                    <div className="text-sm font-medium text-green-700 mb-3">Environmental Score</div>
                    <div className="text-xs text-green-600 space-y-1">
                      <div>• CO₂ reduction: {selectedLoan.impactMetrics.co2ReductionPerYear} tons/year</div>
                      <div>• Resource efficiency improvements</div>
                      <div>• Sustainable technology adoption</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{selectedLoan.esgBreakdown.social}</div>
                    <div className="text-sm font-medium text-blue-700 mb-3">Social Score</div>
                    <div className="text-xs text-blue-600 space-y-1">
                      <div>• Income increase: +{selectedLoan.impactMetrics.incomeIncreasePercent}%</div>
                      <div>• Community benefit rating: {selectedLoan.impactMetrics.communityRating}</div>
                      <div>• Livelihood sustainability</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{selectedLoan.esgBreakdown.governance}</div>
                    <div className="text-sm font-medium text-purple-700 mb-3">Governance Score</div>
                    <div className="text-xs text-purple-600 space-y-1">
                      <div>• Transparent business practices</div>
                      <div>• Financial accountability</div>
                      <div>• Ethical operations</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Progress Tracking */}
              <div>
                <h4 className="font-medium text-slate-900 mb-4">Monthly Progress & Impact Tracking</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedLoan.monthlyProgress).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-slate-900">
                        {typeof value === 'number' ? (key.includes('Rating') ? value.toFixed(1) : value) : value}
                        {key.includes('Growth') || key.includes('Savings') || key.includes('Reduction') ? '%' : ''}
                      </div>
                      <div className="text-sm text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* UN Sustainability Goals Alignment */}
              <div>
                <h4 className="font-medium text-slate-900 mb-4">UN Sustainable Development Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLoan.sustainabilityGoals.map((goal, index) => (
                    <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                      🎯 {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Community Impact */}
              <div>
                <h4 className="font-medium text-slate-900 mb-4">Community Impact Analysis</h4>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                  <p className="text-slate-700 mb-3">{selectedLoan.communityImpact}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Direct Benefits:</strong>
                      <ul className="mt-1 space-y-1 text-slate-600">
                        <li>• Improved income stability</li>
                        <li>• Enhanced service delivery</li>
                        <li>• Technology adoption</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Indirect Benefits:</strong>
                      <ul className="mt-1 space-y-1 text-slate-600">
                        <li>• Reduced environmental footprint</li>
                        <li>• Community development</li>
                        <li>• Knowledge transfer</li>
                      </ul>
                    </div>
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

export default ESGPortfolio;
