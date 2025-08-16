import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  User, 
  Briefcase,
  Smartphone,
  Package,
  CheckCircle,
  Plus,
  Trash2
} from "lucide-react"

export default function LoanApplication() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    sex: '',
    mobileNumber: '',
    email: '',
    homeAddress: '',
    
    // Business Information
    registeredBusinessName: '',
    businessType: '',
    businessActivity: '',
    principalBusinessAddress: '',
    yearsInBusiness: '',
    
    // Financial Information
    monthlyRevenue: '',
    monthlyExpenses: '',
    monthlyNetIncome: '',
    ewalletProvider: '',
    ewalletNumber: '',
    
    // Movable Assets
    movableAssets: [],
    
    // Consent
    consent: false,
    dataPrivacyConsent: false
  })

  const [newAsset, setNewAsset] = useState({
    type: '',
    description: '',
    estimatedValue: '',
    condition: ''
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    alert('Application submitted! AI-powered pre-approval processing in 5 minutes.')
    navigate('/')
  }

  const addAsset = () => {
    if (newAsset.type && newAsset.estimatedValue) {
      setFormData({
        ...formData,
        movableAssets: [...formData.movableAssets, { ...newAsset, id: Date.now() }]
      })
      setNewAsset({ type: '', description: '', estimatedValue: '', condition: '' })
    }
  }

  const removeAsset = (id) => {
    setFormData({
      ...formData,
      movableAssets: formData.movableAssets.filter(asset => asset.id !== id)
    })
  }

  const businessTypes = [
    "Agriculture & Forestry",
    "Fishing", 
    "Manufacturing",
    "Construction",
    "Wholesale and Retail",
    "Hotels and Restaurants", 
    "Transport, Storage, and Communication",
    "Others"
  ]

  const movableAssetTypes = [
    "Motorcycle",
    "Tricycle", 
    "Motor Vehicle",
    "Professional Tools",
    "Kitchen Equipment",
    "Sound System/Equipment",
    "Sewing Machine",
    "Computer/Laptop",
    "Appliances",
    "Others"
  ]

  const stepTitles = {
    1: "Personal Information",
    2: "Business Information", 
    3: "Financial & E-wallet Details",
    4: "Movable Asset Financing (MAF)",
    5: "Review & Consent"
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

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < totalSteps && (
                  <div className={`w-12 h-1 mx-2 ${step < currentStep ? 'bg-red-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Step {currentStep} of {totalSteps}: {stepTitles[currentStep]}
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-lg">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
                  <p className="text-slate-600">Basic personal details</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth
                    </label>
                    <input 
                      type="date" 
                      name="dateOfBirth" 
                      value={formData.dateOfBirth} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sex
                    </label>
                    <select 
                      name="sex" 
                      value={formData.sex} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mobile Number
                  </label>
                  <input 
                    type="tel" 
                    name="mobileNumber" 
                    value={formData.mobileNumber} 
                    onChange={handleInputChange}
                    placeholder="+63 917 123 4567" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Complete Address
                  </label>
                  <input 
                    type="text" 
                    name="homeAddress" 
                    value={formData.homeAddress} 
                    onChange={handleInputChange}
                    placeholder="Unit/House #, Street, Barangay, City, Province" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required 
                  />
                </div>
              </div>
            )}

            {/* Step 2: Business Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Briefcase className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Business Information</h3>
                  <p className="text-slate-600">Tell us about your business</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name (if applicable)
                  </label>
                  <input 
                    type="text" 
                    name="registeredBusinessName" 
                    value={formData.registeredBusinessName} 
                    onChange={handleInputChange}
                    placeholder="Your business name" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nature of Business
                  </label>
                  <select 
                    name="businessType" 
                    value={formData.businessType} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Specific Business Activity
                  </label>
                  <input 
                    type="text" 
                    name="businessActivity" 
                    value={formData.businessActivity} 
                    onChange={handleInputChange}
                    placeholder="e.g., Sari-sari store, Tricycle driving, Online selling" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Years in Business
                  </label>
                  <select 
                    name="yearsInBusiness" 
                    value={formData.yearsInBusiness} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required
                  >
                    <option value="">Select years</option>
                    <option value="less-than-1">Less than 1 year</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="more-than-5">More than 5 years</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Financial Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Smartphone className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Financial & E-wallet Information</h3>
                  <p className="text-slate-600">Income and digital wallet details</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Monthly Revenue (₱)
                    </label>
                    <input 
                      type="number" 
                      name="monthlyRevenue" 
                      value={formData.monthlyRevenue} 
                      onChange={handleInputChange}
                      placeholder="25000" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Monthly Expenses (₱)
                    </label>
                    <input 
                      type="number" 
                      name="monthlyExpenses" 
                      value={formData.monthlyExpenses} 
                      onChange={handleInputChange}
                      placeholder="15000" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      E-wallet Provider
                    </label>
                    <select 
                      name="ewalletProvider" 
                      value={formData.ewalletProvider} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required
                    >
                      <option value="">Select e-wallet</option>
                      <option value="GCash">GCash</option>
                      <option value="Maya">Maya (PayMaya)</option>
                      <option value="Both">Both GCash and Maya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      E-wallet Number
                    </label>
                    <input 
                      type="tel" 
                      name="ewalletNumber" 
                      value={formData.ewalletNumber} 
                      onChange={handleInputChange}
                      placeholder="Same as mobile number" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">E-wallet Data Consent</h4>
                  <p className="text-sm text-blue-700">
                    By providing your e-wallet information, you consent to SikAP analyzing your transaction patterns 
                    for fair credit assessment. Your data is secure and protected.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Movable Asset Financing */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Package className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Movable Asset Financing (MAF)</h3>
                  <p className="text-slate-600">Add assets to improve loan terms</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h4 className="font-medium text-amber-900 mb-2">About Movable Asset Financing</h4>
                  <p className="text-sm text-amber-700">
                    Use movable properties (motorcycles, tools, equipment) as collateral to improve your loan terms.
                  </p>
                </div>

                {/* Add Asset Form */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-4">Add Asset</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Asset Type</label>
                      <select 
                        value={newAsset.type} 
                        onChange={(e) => setNewAsset({...newAsset, type: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg"
                      >
                        <option value="">Select type</option>
                        {movableAssetTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Value (₱)</label>
                      <input 
                        type="number" 
                        value={newAsset.estimatedValue} 
                        onChange={(e) => setNewAsset({...newAsset, estimatedValue: e.target.value})}
                        placeholder="50000" 
                        className="w-full p-3 border border-slate-300 rounded-lg" 
                      />
                    </div>
                  </div>
                  <Button onClick={addAsset} className="bg-red-600 hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                  </Button>
                </div>

                {/* Asset List */}
                {formData.movableAssets.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Your Assets</h4>
                    <div className="space-y-3">
                      {formData.movableAssets.map((asset) => (
                        <div key={asset.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <div>
                            <span className="font-medium">{asset.type}</span>
                            <div className="text-sm text-slate-600">₱{Number(asset.estimatedValue).toLocaleString()}</div>
                          </div>
                          <Button 
                            variant="ghost" 
                            onClick={() => removeAsset(asset.id)} 
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Review & Consent */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Review & Submit</h3>
                  <p className="text-slate-600">Review and consent to submit</p>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Personal Info</h4>
                    <p className="text-sm text-slate-600">
                      {formData.firstName} {formData.lastName} • {formData.mobileNumber}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Business</h4>
                    <p className="text-sm text-slate-600">
                      {formData.businessActivity} • {formData.yearsInBusiness}
                    </p>
                  </div>
                </div>

                {/* Consent */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.dataPrivacyConsent}
                      onChange={(e) => setFormData({...formData, dataPrivacyConsent: e.target.checked})}
                      className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mt-1"
                    />
                    <span className="text-sm text-slate-600">
                      I consent to data processing for loan evaluation
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                      className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mt-1"
                    />
                    <span className="text-sm text-slate-600">
                      I agree to terms and conditions
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious} 
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  className="bg-red-600 hover:bg-red-700 text-white ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.consent || !formData.dataPrivacyConsent}
                  className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white ml-auto disabled:opacity-50"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}