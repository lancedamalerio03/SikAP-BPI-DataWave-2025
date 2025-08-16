import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Calculator
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function PreLoanApplication() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [loanData, setLoanData] = useState({
    loanAmount: '',
    loanPurpose: '',
    loanTenor: '',
    repaymentFrequency: '',
    urgency: '',
    additionalInfo: ''
  })

  const loanAmounts = [
    { value: "10000", label: "₱10,000" },
    { value: "25000", label: "₱25,000" },
    { value: "50000", label: "₱50,000" },
    { value: "75000", label: "₱75,000" },
    { value: "100000", label: "₱100,000" },
    { value: "150000", label: "₱150,000" },
    { value: "200000", label: "₱200,000" },
    { value: "300000", label: "₱300,000" },
    { value: "500000", label: "₱500,000" }
  ]

  const loanPurposes = [
    "Working capital",
    "Business expansion", 
    "Purchase of equipment/motor vehicles",
    "Purchase of inventory",
    "Emergency expenses",
    "Home improvement",
    "Education",
    "Medical expenses",
    "Debt consolidation",
    "Others"
  ]

  const tenorOptions = [
    { value: "6", label: "6 months" },
    { value: "12", label: "12 months" },
    { value: "18", label: "18 months" },
    { value: "24", label: "24 months" },
    { value: "36", label: "36 months" },
    { value: "48", label: "48 months" },
    { value: "60", label: "60 months" }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLoanData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call to submit pre-loan application
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Store loan application data
      const applicationData = {
        ...loanData,
        applicantId: user.id,
        applicantName: `${user.firstName} ${user.lastName}`,
        applicationId: `SLN-${Date.now()}`,
        status: 'pending_review',
        submittedAt: new Date().toISOString(),
        estimatedProcessingTime: '24-48 hours'
      }
      
      // Store in localStorage for demo
      const existingApplications = JSON.parse(localStorage.getItem('loan_applications') || '[]')
      existingApplications.push(applicationData)
      localStorage.setItem('loan_applications', JSON.stringify(existingApplications))
      
      setSubmitted(true)
    } catch (error) {
      alert('Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="text-slate-600 hover:text-red-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-red-600">SikAP</h1>
              <Badge variant="secondary" className="bg-amber-500 text-white">
                Powered by BPI BanKo
              </Badge>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Application Submitted Successfully!</h2>
              <p className="text-slate-600 mb-6">
                Your pre-loan application has been received and is now under review by our AI-powered system.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>AI review: 5-15 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Document request: If approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    <span>Final approval: 24-48 hours</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-left mb-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Application Details</h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>Amount: ₱{Number(loanData.loanAmount).toLocaleString()}</div>
                    <div>Purpose: {loanData.loanPurpose}</div>
                    <div>Tenor: {loanData.loanTenor} months</div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">Applicant</h4>
                  <div className="text-sm text-slate-600 space-y-1">
                    <div>Name: {user.firstName} {user.lastName}</div>
                    <div>Email: {user.email}</div>
                    <div>Status: Pending Review</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Return to Home
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  View Application Status
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="text-slate-600 hover:text-red-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
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
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-lg">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Loan Application</h2>
              <p className="text-slate-600">Tell us what you need funding for</p>
            </div>

            {/* User Info Display */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
              <h3 className="font-medium text-green-900 mb-2">Applicant Information</h3>
              <div className="text-sm text-green-700">
                <div>Name: {user.firstName} {user.lastName}</div>
                <div>Email: {user.email}</div>
                <div>Profile Status: {user.accountStatus === 'verified' ? '✅ Verified' : '⏳ Pending Verification'}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loan Amount (₱) *
                </label>
                <select 
                  name="loanAmount" 
                  value={loanData.loanAmount} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  required
                >
                  <option value="">Select loan amount</option>
                  {loanAmounts.map((amount) => (
                    <option key={amount.value} value={amount.value}>{amount.label}</option>
                  ))}
                </select>
              </div>

              {/* Loan Purpose */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loan Purpose *
                </label>
                <select 
                  name="loanPurpose" 
                  value={loanData.loanPurpose} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  required
                >
                  <option value="">Select purpose</option>
                  {loanPurposes.map((purpose) => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Loan Tenor */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Loan Tenor *
                  </label>
                  <select 
                    name="loanTenor" 
                    value={loanData.loanTenor} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required
                  >
                    <option value="">Select tenor</option>
                    {tenorOptions.map((tenor) => (
                      <option key={tenor.value} value={tenor.value}>{tenor.label}</option>
                    ))}
                  </select>
                </div>

                {/* Repayment Frequency */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Repayment Frequency *
                  </label>
                  <select 
                    name="repaymentFrequency" 
                    value={loanData.repaymentFrequency} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  How urgent is this loan? *
                </label>
                <select 
                  name="urgency" 
                  value={loanData.urgency} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  required
                >
                  <option value="">Select urgency</option>
                  <option value="Low">Low - I can wait 1-2 weeks</option>
                  <option value="Medium">Medium - I need it within a week</option>
                  <option value="High">High - I need it within 2-3 days</option>
                  <option value="Emergency">Emergency - I need it ASAP</option>
                </select>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Information
                </label>
                <textarea 
                  name="additionalInfo" 
                  value={loanData.additionalInfo} 
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  placeholder="Tell us more about your loan needs, business plans, or any other relevant information..."
                />
              </div>

              {/* Loan Summary */}
              {loanData.loanAmount && loanData.loanTenor && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">Loan Summary</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>Requested Amount: ₱{Number(loanData.loanAmount).toLocaleString()}</div>
                    <div>Loan Tenor: {loanData.loanTenor} months</div>
                    <div>Estimated Monthly Payment: ₱{Math.round((Number(loanData.loanAmount) * 1.15) / Number(loanData.loanTenor)).toLocaleString()}</div>
                    <div className="text-xs text-blue-600 mt-2">
                      *Estimated with 15% annual interest rate. Final terms subject to approval.
                    </div>
                  </div>
                </div>
              )}

              {/* Important Notes */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-medium text-amber-900 mb-2">What happens after submission?</h3>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• AI-powered initial review (5-15 minutes)</li>
                  <li>• You'll receive an email with the pre-approval status</li>
                  <li>• If approved, you'll get access to document submission portal</li>
                  <li>• Final approval typically takes 24-48 hours after document submission</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white shadow-lg py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Loan Application
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}