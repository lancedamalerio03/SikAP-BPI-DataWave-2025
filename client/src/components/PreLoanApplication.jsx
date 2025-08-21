// client/src/components/PreLoanApplication.jsx
// Updated for Async Processing - No More AI Decision Modal

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import webhookService from '../services/webhookService'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { 
  ArrowLeft, 
  CheckCircle, 
  DollarSign, 
  Calendar,
  Clock,
  Mail
} from 'lucide-react'

export default function PreLoanApplication() {
  const navigate = useNavigate()
  
  // State variables - Simplified for async processing
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [loanData, setLoanData] = useState({
    loanAmount: '',
    loanPurpose: '',
    loanTenor: '',
    repaymentFrequency: 'monthly',
    urgency: 'medium',
    additionalInfo: ''
  })

  // Options arrays
  const loanPurposeOptions = [
    { value: "working_capital", label: "Working Capital" },
    { value: "business_expansion", label: "Business Expansion" },
    { value: "purchase_equipment_vehicle", label: "Purchase Equipment/Vehicle" },
    { value: "purchase_inventory", label: "Purchase Inventory" },
    { value: "emergency_expenses", label: "Emergency Expenses" },
    { value: "home_improvement", label: "Home Improvement" },
    { value: "education", label: "Education" },
    { value: "medical_expenses", label: "Medical Expenses" },
    { value: "debt_consolidation", label: "Debt Consolidation" },
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

  // Event handlers
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

      console.log('Submitting preloan application via async webhook...')

      // Use the webhook service to submit the application
      const webhookResult = await webhookService.submitPreLoanApplication(currentUser, loanData)
      
      console.log('Async webhook response:', webhookResult)

      // Store the submission result
      setSubmissionResult(webhookResult)

      // Save to localStorage for tracking
      const applicationData = {
        ...loanData,
        applicantId: currentUser.id,
        applicantName: `${currentUser.user_metadata?.firstName || ''} ${currentUser.user_metadata?.lastName || ''}`.trim(),
        applicationId: webhookResult.applicationId || `SLN-${Date.now()}`,
        status: webhookResult.status || 'processing',
        submittedAt: new Date().toISOString(),
        estimatedProcessingTime: webhookResult.estimatedTime || '2-5 minutes',
        message: webhookResult.message,
        nextSteps: webhookResult.nextSteps || [],
        submissionMethod: 'async_webhook'
      }
      
      const existingApplications = JSON.parse(localStorage.getItem('loan_applications') || '[]')
      existingApplications.push(applicationData)
      localStorage.setItem('loan_applications', JSON.stringify(existingApplications))
      
      // Show success page
      setSubmitted(true)
      
    } catch (error) {
      console.error('Error submitting loan application:', error)
      alert(`Failed to submit application: ${error.message}. Please try again or contact support.`)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToHome = () => {
    navigate('/dashboard')  // Changed from navigate('/') to navigate('/dashboard')
  }

  // Test functions (unchanged)
  const testWebhookConnection = async () => {
    try {
      console.log('Testing webhook connection...')
      const result = await webhookService.testWebhook('preloan-application')
      
      if (result.success) {
        alert('Webhook connection successful!')
        console.log('Test result:', result.result)
      } else {
        alert(`Webhook test failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Webhook test error:', error)
      alert(`Webhook test error: ${error.message}`)
    }
  }

  const debugWebhook = () => {
    console.log('🔍 Environment Debug:', {
      webhookUrl: process.env.REACT_APP_N8N_WEBHOOK_URL,
      hasAuthToken: !!process.env.REACT_APP_N8N_AUTH_TOKEN,
      supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
      nodeEnv: process.env.NODE_ENV
    });
    
    alert(`Webhook URL: ${process.env.REACT_APP_N8N_WEBHOOK_URL || 'NOT SET'}`);
  }

  const testDirectFetch = async () => {
    try {
      console.log('Testing direct fetch to n8n...');
      
      const testUrl = `${process.env.REACT_APP_N8N_WEBHOOK_URL}/preloan-application`;
      console.log('Test URL:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          message: 'Direct test from React',
          user: { id: 'test-user', email: 'test@example.com' },
          loanData: { loan_amount: 10000, loan_purpose: 'test' }
        })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        alert('Direct fetch SUCCESS! Check console for details.');
      } else {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        alert(`Direct fetch failed: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('Direct fetch error:', error);
      alert(`Direct fetch error: ${error.message}`);
    }
  }

  // Enhanced Loading Component
  const ProcessingLoader = () => {
    if (!loading) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-medium text-lg mb-2">Submitting your application...</h3>
            <p className="text-sm text-slate-600 mb-4">Saving to our secure system</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success page with async processing info
  if (submitted && submissionResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Application Submitted Successfully!</h2>
              <p className="text-lg text-slate-600">
                {submissionResult.message || 'Your application is being processed by our AI system'}
              </p>
            </div>

            {/* Application Details */}
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-slate-800 mb-4">Application Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Application ID:</span>
                  <div className="font-mono font-medium">{submissionResult.applicationId}</div>
                </div>
                <div>
                  <span className="text-slate-600">Status:</span>
                  <div className="font-medium capitalize">{submissionResult.status}</div>
                </div>
                <div>
                  <span className="text-slate-600">Amount:</span>
                  <div className="font-medium">₱{Number(loanData.loanAmount || 0).toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-slate-600">Processing Time:</span>
                  <div className="font-medium">{submissionResult.estimatedTime}</div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            {submissionResult.nextSteps && submissionResult.nextSteps.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  What Happens Next?
                </h3>
                <ul className="space-y-3">
                  {submissionResult.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-amber-600" />
                <h4 className="font-medium text-amber-900">Important Notice</h4>
              </div>
              <p className="text-sm text-amber-700">
                Our AI system is now reviewing your application. You'll receive an email notification 
                with the decision within {submissionResult.estimatedTime}. Please check your email regularly 
                and ensure it's not in your spam folder.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleBackToHome} className="w-full">
                Back to Home
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  // TODO: Navigate to application status page
                  alert('Application status tracking coming soon!')
                }}
              >
                Track Application Status
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={handleBackToHome}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pre-Loan Application</h1>
            <p className="text-slate-600">Quick assessment for loan eligibility with AI-powered review</p>
          </div>
        </div>

        {/* Test buttons - only shows in development */}
        {process.env.REACT_APP_ENABLE_TEST_WEBHOOK_BUTTON === 'true' && (
          <div className="mb-4 flex gap-2 flex-wrap">
            <Button 
              onClick={testWebhookConnection}
              variant="outline"
              className="text-sm"
            >
              Test Webhook Connection
            </Button>
            <Button 
              onClick={debugWebhook}
              variant="outline"
              className="text-sm"
            >
              Check Environment
            </Button>
            <Button 
              onClick={testDirectFetch}
              variant="outline"
              className="text-sm"
            >
              Test Direct Fetch
            </Button>
          </div>
        )}

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Loan Amount (PHP) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  name="loanAmount"
                  value={loanData.loanAmount}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter loan amount"
                  min="5000"
                  max="500000"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Minimum: ₱5,000 | Maximum: ₱500,000</p>
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select loan purpose</option>
                {loanPurposeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Loan Tenor */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Loan Tenor *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <select
                  name="loanTenor"
                  value={loanData.loanTenor}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select tenor</option>
                  {tenorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Repayment Frequency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Repayment Frequency *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'bi-weekly', label: 'Bi-weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="repaymentFrequency"
                      value={option.value}
                      checked={loanData.repaymentFrequency === option.value}
                      onChange={handleInputChange}
                      className="mr-3"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                How urgent is this loan? *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'low', label: 'Low Priority', color: 'bg-green-50 border-green-200 text-green-700' },
                  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
                  { value: 'high', label: 'High Priority', color: 'bg-orange-50 border-orange-200 text-orange-700' },
                  { value: 'emergency', label: 'Emergency', color: 'bg-red-50 border-red-200 text-red-700' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      loanData.urgency === option.value
                        ? option.color
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={loanData.urgency === option.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                name="additionalInfo"
                value={loanData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Any additional information about your loan request..."
              />
            </div>

            {/* Important Notes - Updated for async processing */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-900 mb-2">What happens after submission?</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Immediate confirmation of submission</li>
                <li>• AI-powered review starts in the background (2-5 minutes)</li>
                <li>• Email notification with decision results</li>
                <li>• If approved, access to document submission portal</li>
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

        {/* Processing Loader */}
        <ProcessingLoader />
      </div>
    </div>
  )
}