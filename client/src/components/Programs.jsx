import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  Building2,
  Smartphone,
  CheckCircle,
  Clock,
  Calculator,
  Users,
  Shield
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Programs() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [selectedProgram, setSelectedProgram] = useState(null)

  const loanPrograms = [
    {
      id: 'negosyoko-loan',
      title: 'NegosyoKo Loan',
      subtitle: 'Pandagdag kapital sa negosyo',
      icon: Building2,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      amount: '₱15,000 - ₱500,000',
      term: '1-5 banking days approval',
      rate: 'Abot-kayang interest',
      features: [
        'Abot-kayang loan para sa Self-Employed Micro Entrepreneurs (SEME)',
        'Mabilis na approval - 1-5 banking days',
        'Flexible payment terms (weekly, twice a month, monthly)',
        'Sakto ang loan amount para sa negosyo',
        'BIDA Program rewards for referrals'
      ],
      requirements: [
        'Valid ID',
        'Utility Bill',
        'Barangay or Mayor\'s Permit'
      ],
      eligibility: [
        'Self-Employed Micro Entrepreneurs (SEME)',
        'May maliit na negosyo',
        'Filipino citizen'
      ],
      paymentMethods: [
        'BanKo Mobile App (Self-repayment)',
        'BanKo Cash Agents',
        'Automatic Debit Arrangement',
        'Cash Pick-Up via Motorized Collector'
      ]
    },
    {
      id: 'instacashko-loan',
      title: 'InstaCashKo Loan',
      subtitle: 'Online Salary Loan - Mabilis at madali',
      icon: Smartphone,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      amount: '₱2,000 - ₱250,000',
      term: '7 days - 36 months',
      rate: 'Max ACR: 90.95%',
      features: [
        'Multi-purpose unsecured online personal cash loan',
        'Fast and easy purely digital loan application',
        'Instant cash for immediate needs',
        'Use for bills payment, Instapay transfers, mobile load',
        'Send money to other BanKo users'
      ],
      requirements: [
        '1 Government-Issued ID',
        '1 Month Latest Payslip, ITR, or COE with compensation details'
      ],
      eligibility: [
        '18-60 years old',
        'Gross Monthly Income of ₱12,000',
        'At least 6 months work tenure',
        'Salaried Filipinos'
      ],
      applicationProcess: [
        'Download the BanKo Mobile App',
        'Select Apply for a Loan, then InstaCashKo Loan',
        'Input Loan Terms and Required Details',
        'Scan ID and Face for KYC Verification',
        'Complete Necessary Information',
        'Wait for Approval and Loan Release'
      ]
    }
  ]

  const handleApplyNow = (programId) => {
    // Check authentication status and redirect accordingly
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/signin')
    }
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="text-slate-600 hover:text-red-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-red-600">SikAP</h1>
            <Badge variant="secondary" className="bg-amber-500 text-white">
              Powered by BPI BanKo
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">BanKo Loan Products</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover BanKo's proven loan products designed for Filipino entrepreneurs and employees
          </p>
        </div>

        {/* Program Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {loanPrograms.map((program) => {
            const IconComponent = program.icon
            return (
              <Card 
                key={program.id} 
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col h-full"
                onClick={() => setSelectedProgram(program)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 ${program.color} rounded-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{program.title}</h3>
                      <p className="text-sm text-slate-600">{program.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Amount:</span>
                      <span className="text-sm font-medium text-slate-900">{program.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Term:</span>
                      <span className="text-sm font-medium text-slate-900">{program.term}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Rate:</span>
                      <span className="text-sm font-medium text-red-600">{program.rate}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mb-4 flex-grow">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {program.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white mt-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleApplyNow(program.id)
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* General Information Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Fast Processing</h3>
            <p className="text-sm text-slate-600">
              AI-powered evaluation for quick loan approval, typically within 24-48 hours
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Calculator className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Flexible Terms</h3>
            <p className="text-sm text-slate-600">
              Choose repayment terms that fit your cash flow and business cycle
            </p>
          </Card>

          <Card className="p-6 text-center">
            <Shield className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure & Regulated</h3>
            <p className="text-sm text-slate-600">
              BSP-regulated institution with bank-level security for your protection
            </p>
          </Card>
        </div>

        {/* Application Process */}
        <Card className="p-8 mb-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">How to Apply</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Create Account</h4>
              <p className="text-sm text-slate-600">Sign up and complete your profile with required information</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Choose Program</h4>
              <p className="text-sm text-slate-600">Select the loan program that best fits your needs</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Submit Application</h4>
              <p className="text-sm text-slate-600">Complete the application form and upload required documents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                4
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Get Approved</h4>
              <p className="text-sm text-slate-600">Receive approval and funds in your account</p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Apply for a BanKo Loan?</h3>
          <p className="text-lg text-slate-600 mb-6">
            Join thousands of Filipinos who trust BanKo for their financial needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white"
              onClick={() => handleApplyNow('general')}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Apply'}
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={handleBackToHome}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Program Details Modal/Overlay */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${selectedProgram.color} rounded-lg`}>
                    <selectedProgram.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedProgram.title}</h3>
                    <p className="text-slate-600">{selectedProgram.subtitle}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedProgram(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                {/* Loan Details */}
                <div className={`p-4 ${selectedProgram.lightColor} rounded-lg`}>
                  <h4 className="font-semibold text-slate-900 mb-3">Loan Details</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Amount</span>
                      <div className="font-medium text-slate-900">{selectedProgram.amount}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Term</span>
                      <div className="font-medium text-slate-900">{selectedProgram.term}</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Interest Rate</span>
                      <div className="font-medium text-red-600">{selectedProgram.rate}</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Features & Benefits</h4>
                  <ul className="space-y-2">
                    {selectedProgram.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Required Documents</h4>
                  <ul className="space-y-2">
                    {selectedProgram.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Eligibility */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Eligibility Criteria</h4>
                  <ul className="space-y-2">
                    {selectedProgram.eligibility.map((criteria, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payment Methods (for NegosyoKo) */}
                {selectedProgram.paymentMethods && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Payment Methods</h4>
                    <ul className="space-y-2">
                      {selectedProgram.paymentMethods.map((method, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <Calculator className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{method}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Application Process (for InstaCashKo) */}
                {selectedProgram.applicationProcess && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Application Process</h4>
                    <ul className="space-y-2">
                      {selectedProgram.applicationProcess.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      handleApplyNow(selectedProgram.id)
                      setSelectedProgram(null)
                    }}
                  >
                    Apply Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedProgram(null)}
                    className="border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}