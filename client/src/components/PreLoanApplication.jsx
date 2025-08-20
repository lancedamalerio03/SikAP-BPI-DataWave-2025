import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  DollarSign,
  CheckCircle,
  Calculator
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase" // Add this import

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
    { value: "working_capital", label: "Working capital" },
    { value: "business_expansion", label: "Business expansion" },
    { value: "purchase_equipment_vehicle", label: "Purchase of equipment/motor vehicles" },
    { value: "purchase_inventory", label: "Purchase of inventory" },
    { value: "emergency_expenses", label: "Emergency expenses" },
    { value: "home_improvement", label: "Home improvement" },
    { value: "education", label: "Education" },
    { value: "medical_expenses", label: "Medical expenses" },
    { value: "debt_consolidation", label: "Debt consolidation" },
    { value: "others", label: "Others" }
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
      // Get the current authenticated user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw new Error('User authentication error: ' + userError.message)
      }
      
      if (!currentUser) {
        throw new Error('User not authenticated')
      }

      // Prepare the data for Supabase insertion
      const applicationData = {
        user_id: currentUser.id, // This references auth.users.id
        loan_amount: parseFloat(loanData.loanAmount),
        loan_purpose: loanData.loanPurpose,
        loan_tenor_months: parseInt(loanData.loanTenor),
        repayment_frequency: loanData.repaymentFrequency,
        urgency: loanData.urgency,
        additional_information: loanData.additionalInfo || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('preloan_applications')
        .insert([applicationData])
        .select()

      if (error) {
        throw new Error('Database error: ' + error.message)
      }

      console.log('Loan application saved to database:', data)
      
      // Keep the existing localStorage logic for compatibility
      const legacyApplicationData = {
        ...loanData,
        applicantId: user.id,
        applicantName: `${user.firstName} ${user.lastName}`,
        applicationId: `SLN-${Date.now()}`,
        status: 'pending_review',
        submittedAt: new Date().toISOString(),
        estimatedProcessingTime: '24-48 hours',
        databaseId: data[0].id // Store the database ID for reference
      }
      
      // Store in localStorage for demo/backup
      const existingApplications = JSON.parse(localStorage.getItem('loan_applications') || '[]')
      existingApplications.push(legacyApplicationData)
      localStorage.setItem('loan_applications', JSON.stringify(existingApplications))
      
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting loan application:', error)
      alert(`Failed to submit application: ${error.message}. Please try again.`)
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
              onClick={() => navigate('/dashboard')} 
              className="text-slate-600 hover:text-red-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
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
              
              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-slate-900 mb-2">What's Next?</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>✓ AI-powered initial review (5-15 minutes)</p>
                  <p>✓ Email notification with pre-approval status</p>
                  <p>✓ Document submission portal access (if approved)</p>
                  <p>✓ Final approval within 24-48 hours</p>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')} className="bg-red-600 hover:bg-red-700">
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard/loans')}>
                  View Applications
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
            onClick={() => navigate('/dashboard')} 
            className="text-slate-600 hover:text-red-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
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
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Loan Application</h1>
            <p className="text-slate-600">Tell us what you need funding for</p>
          </div>

          {/* Applicant Info Card */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
            <h3 className="font-medium text-green-800 mb-2">Applicant Information</h3>
            <div className="text-sm text-green-700">
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Profile Status:</strong> 
                <Badge variant="secondary" className="ml-2 bg-green-500 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </p>
            </div>
          </div>

          <Card className="p-6 shadow-lg">
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
                    <option key={purpose.value} value={purpose.value}>{purpose.label}</option>
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
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
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
                  <option value="low">Not urgent (flexible timing)</option>
                  <option value="medium">Moderate (within 1 month)</option>
                  <option value="high">Urgent (within 1 week)</option>
                  <option value="emergency">Very urgent (within 24 hours)</option>
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
                  <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Calculator className="w-4 h-4 mr-2" />
                    Loan Summary
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Loan Amount:</span>
                      <div className="font-medium text-blue-900">
                        ₱{parseInt(loanData.loanAmount).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Tenor:</span>
                      <div className="font-medium text-blue-900">{loanData.loanTenor} months</div>
                    </div>
                    <div>
                      <span className="text-blue-700">Purpose:</span>
                      <div className="font-medium text-blue-900">
                        {loanPurposes.find(p => p.value === loanData.loanPurpose)?.label}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Repayment:</span>
                      <div className="font-medium text-blue-900">{loanData.repaymentFrequency}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-600">
                    * Interest rates and final terms subject to approval.
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