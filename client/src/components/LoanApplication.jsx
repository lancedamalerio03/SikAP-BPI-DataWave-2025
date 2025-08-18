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
  Trash2,
  MapPin,
  CreditCard,
  DollarSign,
  FileText,
  Building2
} from "lucide-react"

export default function LoanApplication() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 8

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    placeOfBirth: '',
    sex: '',
    civilStatus: '',
    citizenship: '',
    mobileNumber: '',
    landlineNumber: '',
    email: '',
    tin: '',
    philsysId: '',
    otherGovId: '',
    motherMaidenName: '',
    spouseName: '',
    spouseDateOfBirth: '',
    
    // Address Information
    homeUnit: '',
    homeStreet: '',
    homeBarangay: '',
    homeCity: '',
    homeProvince: '',
    homeRegion: '',
    homeZipCode: '',
    homeOwnership: '',
    lengthOfStay: '',
    
    // Occupation Information
    employmentStatus: '',
    occupation: '',
    employerName: '',
    employerAddress: '',
    position: '',
    monthlyIncome: '',
    yearsOfEmployment: '',
    
    // Business Information
    hasBusiness: false,
    registeredBusinessName: '',
    businessType: '',
    businessActivity: '',
    businessUnit: '',
    businessStreet: '',
    businessBarangay: '',
    businessCity: '',
    businessProvince: '',
    businessRegion: '',
    businessZipCode: '',
    businessOwnership: '',
    yearsInBusiness: '',
    businessSimilarToHome: false,
    numberOfEmployees: '',
    annualRevenue: '',
    
    // Loan Information
    loanAmount: '',
    loanPurpose: '',
    loanTenor: '',
    repaymentFrequency: '',
    sourceOfRepayment: '',
    sourceOfFunds: '',
    
    // Financial Information
    monthlyRevenue: '',
    monthlyExpenses: '',
    monthlyNetIncome: '',
    ewalletProvider: '',
    ewalletNumber: '',
    
    // Financial History
    hasExistingLoans: false,
    existingLoans: [],
    hasCreditCards: false,
    creditCards: [],
    hasBeenDelinquent: false,
    bankAccounts: [],
    
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
    condition: '',
    registrationNumber: ''
  })

  const [newLoan, setNewLoan] = useState({
    institution: '',
    loanAmount: '',
    monthlyPayment: '',
    outstandingBalance: '',
    collateral: ''
  })

  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountType: '',
    yearOpened: ''
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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

  // Helper functions for adding/removing items
  const addAsset = () => {
    if (newAsset.type && newAsset.estimatedValue) {
      setFormData(prev => ({
        ...prev,
        movableAssets: [...prev.movableAssets, { ...newAsset, id: Date.now() }]
      }))
      setNewAsset({ type: '', description: '', estimatedValue: '', condition: '', registrationNumber: '' })
    }
  }

  const removeAsset = (id) => {
    setFormData(prev => ({
      ...prev,
      movableAssets: prev.movableAssets.filter(asset => asset.id !== id)
    }))
  }

  const addLoan = () => {
    if (newLoan.institution && newLoan.loanAmount) {
      setFormData(prev => ({
        ...prev,
        existingLoans: [...prev.existingLoans, { ...newLoan, id: Date.now() }]
      }))
      setNewLoan({ institution: '', loanAmount: '', monthlyPayment: '', outstandingBalance: '', collateral: '' })
    }
  }

  const addBankAccount = () => {
    if (newBankAccount.bankName && newBankAccount.accountType) {
      setFormData(prev => ({
        ...prev,
        bankAccounts: [...prev.bankAccounts, { ...newBankAccount, id: Date.now() }]
      }))
      setNewBankAccount({ bankName: '', accountType: '', yearOpened: '' })
    }
  }

  // Data arrays
  const philippineRegions = [
    "National Capital Region (NCR)",
    "Cordillera Administrative Region (CAR)",
    "Region I (Ilocos Region)",
    "Region II (Cagayan Valley)",
    "Region III (Central Luzon)",
    "Region IV-A (CALABARZON)",
    "MIMAROPA Region",
    "Region V (Bicol Region)",
    "Region VI (Western Visayas)",
    "Region VII (Central Visayas)",
    "Region VIII (Eastern Visayas)",
    "Region IX (Zamboanga Peninsula)",
    "Region X (Northern Mindanao)",
    "Region XI (Davao Region)",
    "Region XII (SOCCSKSARGEN)",
    "Region XIII (Caraga)",
    "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)"
  ]

  const businessTypes = [
    "Agriculture & Forestry",
    "Fishing",
    "Mining",
    "Manufacturing",
    "Electricity, Gas, and Water Supply",
    "Construction",
    "Wholesale and Retail",
    "Hotels and Restaurants", 
    "Transport, Storage, and Communication",
    "Financial Intermediation",
    "Real Estate, Renting & Business Activities",
    "Private Education",
    "Health and Social Work",
    "Other Community, Social And Personal Service Activities",
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
    "Inventory",
    "Equipment",
    "Others"
  ]

  const loanPurposes = [
    "Working capital",
    "Business expansion",
    "Purchase of equipment/motor vehicles",
    "Purchase of biological asset",
    "Construction/Development of real estate",
    "Acquisition of real estate",
    "Loan takeout/refinancing",
    "Others"
  ]

  const stepTitles = {
    1: "Personal Information",
    2: "Address Information",
    3: "Occupation Details",
    4: "Business Information",
    5: "Loan Details & E-wallet",
    6: "Financial History",
    7: "Movable Asset Financing (MAF)",
    8: "Review & Consent"
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

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {Array.from({length: totalSteps}, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < totalSteps && (
                  <div className={`w-8 h-1 mx-1 ${step < currentStep ? 'bg-red-600' : 'bg-slate-200'}`} />
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
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 shadow-lg">
            
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <User className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
                  <p className="text-slate-600">Complete personal details</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Middle Name</label>
                    <input 
                      type="text" 
                      name="middleName" 
                      value={formData.middleName} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Suffix</label>
                    <select 
                      name="suffix" 
                      value={formData.suffix} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select</option>
                      <option value="Jr.">Jr.</option>
                      <option value="Sr.">Sr.</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Place of Birth *</label>
                    <input 
                      type="text" 
                      name="placeOfBirth" 
                      value={formData.placeOfBirth} 
                      onChange={handleInputChange}
                      placeholder="Municipality/City, Province"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sex *</label>
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
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Civil Status *</label>
                    <select 
                      name="civilStatus" 
                      value={formData.civilStatus} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Separated">Separated</option>
                      <option value="Widow/er">Widow/er</option>
                      <option value="Annulled">Annulled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Citizenship *</label>
                  <select 
                    name="citizenship" 
                    value={formData.citizenship} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required
                  >
                    <option value="">Select</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Non-Filipino">Non-Filipino</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Landline Number</label>
                    <input 
                      type="tel" 
                      name="landlineNumber" 
                      value={formData.landlineNumber} 
                      onChange={handleInputChange}
                      placeholder="(02) 123-4567" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="juan@example.com" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">TIN</label>
                    <input 
                      type="text" 
                      name="tin" 
                      value={formData.tin} 
                      onChange={handleInputChange}
                      placeholder="123-456-789-000" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">PhilSys ID</label>
                    <input 
                      type="text" 
                      name="philsysId" 
                      value={formData.philsysId} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Other Gov't ID</label>
                    <input 
                      type="text" 
                      name="otherGovId" 
                      value={formData.otherGovId} 
                      onChange={handleInputChange}
                      placeholder="Type/Number" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mother's Maiden Name *</label>
                  <input 
                    type="text" 
                    name="motherMaidenName" 
                    value={formData.motherMaidenName} 
                    onChange={handleInputChange}
                    placeholder="First Middle Last" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required 
                  />
                </div>

                {formData.civilStatus === 'Married' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Spouse Name</label>
                      <input 
                        type="text" 
                        name="spouseName" 
                        value={formData.spouseName} 
                        onChange={handleInputChange}
                        placeholder="First Middle Last" 
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Spouse Date of Birth</label>
                      <input 
                        type="date" 
                        name="spouseDateOfBirth" 
                        value={formData.spouseDateOfBirth} 
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <MapPin className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Address Information</h3>
                  <p className="text-slate-600">Complete address details</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Home Address</h4>
                  <p className="text-sm text-blue-700">Please provide your complete residential address</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Unit/House # *</label>
                    <input 
                      type="text" 
                      name="homeUnit" 
                      value={formData.homeUnit} 
                      onChange={handleInputChange}
                      placeholder="Unit 123, Bldg Name" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Street *</label>
                    <input 
                      type="text" 
                      name="homeStreet" 
                      value={formData.homeStreet} 
                      onChange={handleInputChange}
                      placeholder="Street Name" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Barangay *</label>
                    <input 
                      type="text" 
                      name="homeBarangay" 
                      value={formData.homeBarangay} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City/Municipality *</label>
                    <input 
                      type="text" 
                      name="homeCity" 
                      value={formData.homeCity} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Province *</label>
                    <input 
                      type="text" 
                      name="homeProvince" 
                      value={formData.homeProvince} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Region *</label>
                    <select 
                      name="homeRegion" 
                      value={formData.homeRegion} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required
                    >
                      <option value="">Select Region</option>
                      {philippineRegions.map((region) => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code *</label>
                    <input 
                      type="text" 
                      name="homeZipCode" 
                      value={formData.homeZipCode} 
                      onChange={handleInputChange}
                      placeholder="1234" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Home Ownership *</label>
                    <select 
                      name="homeOwnership" 
                      value={formData.homeOwnership} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required
                    >
                      <option value="">Select</option>
                      <option value="Owned (unencumbered)">Owned (unencumbered)</option>
                      <option value="Owned (mortgaged)">Owned (mortgaged)</option>
                      <option value="Rented">Rented</option>
                      <option value="Living with relatives">Living with relatives</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Length of Stay (years) *</label>
                    <input 
                      type="number" 
                      name="lengthOfStay" 
                      value={formData.lengthOfStay} 
                      onChange={handleInputChange}
                      placeholder="5" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Occupation Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Briefcase className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Occupation Details</h3>
                  <p className="text-slate-600">Employment and income information</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employment Status *</label>
                  <select 
                    name="employmentStatus" 
                    value={formData.employmentStatus} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required
                  >
                    <option value="">Select</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-employed">Self-employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="OFW">OFW</option>
                    <option value="Retired">Retired</option>
                    <option value="Student">Student</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Occupation/Job Title *</label>
                  <input 
                    type="text" 
                    name="occupation" 
                    value={formData.occupation} 
                    onChange={handleInputChange}
                    placeholder="Software Engineer, Store Owner, Driver, etc." 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required 
                  />
                </div>

                {['Employed', 'OFW'].includes(formData.employmentStatus) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Employer Name *</label>
                      <input 
                        type="text" 
                        name="employerName" 
                        value={formData.employerName} 
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        required 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Employer Address *</label>
                      <input 
                        type="text" 
                        name="employerAddress" 
                        value={formData.employerAddress} 
                        onChange={handleInputChange}
                        placeholder="Complete address of employer" 
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        required 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Position *</label>
                        <input 
                          type="text" 
                          name="position" 
                          value={formData.position} 
                          onChange={handleInputChange}
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Years of Employment *</label>
                        <input 
                          type="number" 
                          name="yearsOfEmployment" 
                          value={formData.yearsOfEmployment} 
                          onChange={handleInputChange}
                          placeholder="2" 
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                          required 
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income (₱) *</label>
                  <input 
                    type="number" 
                    name="monthlyIncome" 
                    value={formData.monthlyIncome} 
                    onChange={handleInputChange}
                    placeholder="25000" 
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required 
                  />
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasBusiness"
                      checked={formData.hasBusiness}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mr-3"
                    />
                    <span className="text-sm font-medium text-amber-900">
                      I also have a business or side income
                    </span>
                  </label>
                  <p className="text-sm text-amber-700 mt-2">
                    Check this if you have additional business income beyond your main employment
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Business Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Business Information</h3>
                  <p className="text-slate-600">Details about your business (if applicable)</p>
                </div>

                {!formData.hasBusiness && formData.employmentStatus !== 'Business Owner' && formData.employmentStatus !== 'Self-employed' ? (
                  <div className="text-center py-8">
                    <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No business information required</p>
                    <p className="text-sm text-slate-400">You can skip this step since you indicated no business</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Registered Business Name</label>
                      <input 
                        type="text" 
                        name="registeredBusinessName" 
                        value={formData.registeredBusinessName} 
                        onChange={handleInputChange}
                        placeholder="Leave blank if unregistered" 
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nature of Business *</label>
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">Specific Business Activity *</label>
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

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Years in Business *</label>
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
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Number of Employees</label>
                        <input 
                          type="number" 
                          name="numberOfEmployees" 
                          value={formData.numberOfEmployees} 
                          onChange={handleInputChange}
                          placeholder="0" 
                          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Annual Sales/Revenue (₱)</label>
                      <input 
                        type="number" 
                        name="annualRevenue" 
                        value={formData.annualRevenue} 
                        onChange={handleInputChange}
                        placeholder="300000" 
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      />
                    </div>

                    {/* Business Address */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Business Address</h4>
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          name="businessSimilarToHome"
                          checked={formData.businessSimilarToHome}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mr-3"
                        />
                        <span className="text-sm text-blue-700">Same as home address</span>
                      </label>
                    </div>

                    {!formData.businessSimilarToHome && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Business Unit/Address</label>
                          <input 
                            type="text" 
                            name="businessUnit" 
                            value={formData.businessUnit} 
                            onChange={handleInputChange}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Business City</label>
                          <input 
                            type="text" 
                            name="businessCity" 
                            value={formData.businessCity} 
                            onChange={handleInputChange}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Step 5: Loan Details & E-wallet */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Loan Details & E-wallet</h3>
                  <p className="text-slate-600">Loan requirements and digital wallet information</p>
                </div>

                {/* Loan Information */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-3">Loan Information</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Loan Amount (₱) *</label>
                      <select 
                        name="loanAmount" 
                        value={formData.loanAmount} 
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        required
                      >
                        <option value="">Select loan amount</option>
                        <option value="10000">₱10,000</option>
                        <option value="25000">₱25,000</option>
                        <option value="50000">₱50,000</option>
                        <option value="75000">₱75,000</option>
                        <option value="100000">₱100,000</option>
                        <option value="150000">₱150,000</option>
                        <option value="200000">₱200,000</option>
                        <option value="300000">₱300,000</option>
                        <option value="500000">₱500,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Loan Tenor (months) *</label>
                      <select 
                        name="loanTenor" 
                        value={formData.loanTenor} 
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        required
                      >
                        <option value="">Select tenor</option>
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                        <option value="18">18 months</option>
                        <option value="24">24 months</option>
                        <option value="36">36 months</option>
                        <option value="48">48 months</option>
                        <option value="60">60 months</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Loan Purpose *</label>
                    <select 
                      name="loanPurpose" 
                      value={formData.loanPurpose} 
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
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Repayment Frequency *</label>
                      <select 
                        name="repaymentFrequency" 
                        value={formData.repaymentFrequency} 
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
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Source of Repayment *</label>
                      <select 
                        name="sourceOfRepayment" 
                        value={formData.sourceOfRepayment} 
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        required
                      >
                        <option value="">Select source</option>
                        <option value="Salary">Salary</option>
                        <option value="Business Revenue">Business Revenue</option>
                        <option value="Asset Sale">Asset Sale</option>
                        <option value="Savings">Savings and/or Investment</option>
                        <option value="Remittance">Remittance</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Source of Funds *</label>
                    <select 
                      name="sourceOfFunds" 
                      value={formData.sourceOfFunds} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required
                    >
                      <option value="">Select source</option>
                      <option value="Salary/Employment Income">Salary/Employment Income</option>
                      <option value="Business Income">Business Income</option>
                      <option value="Remittance">Remittance</option>
                      <option value="Savings">Savings</option>
                      <option value="Investment">Investment</option>
                      <option value="Inheritance">Inheritance</option>
                      <option value="Donations/Contributions">Donations/Contributions</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                {/* Financial & E-wallet Information */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Financial Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Revenue (₱) *</label>
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Expenses (₱) *</label>
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
                </div>

                {/* E-wallet Information */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">E-wallet Information</h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Your e-wallet transaction history helps us provide better loan terms
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">E-wallet Provider *</label>
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">E-wallet Number *</label>
                      <input 
                        type="tel" 
                        name="ewalletNumber" 
                        value={formData.ewalletNumber} 
                        onChange={handleInputChange}
                        placeholder="Usually same as mobile number" 
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-blue-700">
                    By providing your e-wallet information, you consent to SikAP analyzing your transaction patterns 
                    for fair credit assessment. Your data is secure and protected.
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Financial History */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CreditCard className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Financial History</h3>
                  <p className="text-slate-600">Credit history and existing obligations</p>
                </div>

                {/* Existing Loans */}
                <div>
                  <label className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="hasExistingLoans"
                      checked={formData.hasExistingLoans}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mr-3"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      I have existing loans from other financial institutions
                    </span>
                  </label>

                  {formData.hasExistingLoans && (
                    <div className="space-y-4">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-4">Add Existing Loan</h4>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Financial Institution</label>
                            <input 
                              type="text" 
                              value={newLoan.institution} 
                              onChange={(e) => setNewLoan({...newLoan, institution: e.target.value})}
                              className="w-full p-3 border border-slate-300 rounded-lg" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Loan Amount (₱)</label>
                            <input 
                              type="number" 
                              value={newLoan.loanAmount} 
                              onChange={(e) => setNewLoan({...newLoan, loanAmount: e.target.value})}
                              className="w-full p-3 border border-slate-300 rounded-lg" 
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Payment (₱)</label>
                            <input 
                              type="number" 
                              value={newLoan.monthlyPayment} 
                              onChange={(e) => setNewLoan({...newLoan, monthlyPayment: e.target.value})}
                              className="w-full p-3 border border-slate-300 rounded-lg" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Outstanding Balance (₱)</label>
                            <input 
                              type="number" 
                              value={newLoan.outstandingBalance} 
                              onChange={(e) => setNewLoan({...newLoan, outstandingBalance: e.target.value})}
                              className="w-full p-3 border border-slate-300 rounded-lg" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Collateral</label>
                            <input 
                              type="text" 
                              value={newLoan.collateral} 
                              onChange={(e) => setNewLoan({...newLoan, collateral: e.target.value})}
                              placeholder="Real estate, vehicle, etc." 
                              className="w-full p-3 border border-slate-300 rounded-lg" 
                            />
                          </div>
                        </div>
                        <Button onClick={addLoan} className="bg-red-600 hover:bg-red-700 text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Loan
                        </Button>
                      </div>

                      {formData.existingLoans.length > 0 && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-4">Your Existing Loans</h4>
                          <div className="space-y-3">
                            {formData.existingLoans.map((loan) => (
                              <div key={loan.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <div>
                                  <span className="font-medium">{loan.institution}</span>
                                  <div className="text-sm text-slate-600">
                                    Loan: ₱{Number(loan.loanAmount).toLocaleString()} | 
                                    Monthly: ₱{Number(loan.monthlyPayment).toLocaleString()} | 
                                    Balance: ₱{Number(loan.outstandingBalance).toLocaleString()}
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  onClick={() => setFormData(prev => ({
                                    ...prev,
                                    existingLoans: prev.existingLoans.filter(l => l.id !== loan.id)
                                  }))} 
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
                </div>

                {/* Bank Accounts */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Bank Accounts & E-money Accounts</h4>
                  <div className="border border-slate-200 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-slate-700 mb-3">Add Bank Account</h5>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                        <input 
                          type="text" 
                          value={newBankAccount.bankName} 
                          onChange={(e) => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
                          className="w-full p-3 border border-slate-300 rounded-lg" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
                        <select 
                          value={newBankAccount.accountType} 
                          onChange={(e) => setNewBankAccount({...newBankAccount, accountType: e.target.value})}
                          className="w-full p-3 border border-slate-300 rounded-lg"
                        >
                          <option value="">Select type</option>
                          <option value="Savings">Savings</option>
                          <option value="Checking">Checking</option>
                          <option value="E-wallet">E-wallet</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Year Opened</label>
                        <input 
                          type="number" 
                          value={newBankAccount.yearOpened} 
                          onChange={(e) => setNewBankAccount({...newBankAccount, yearOpened: e.target.value})}
                          placeholder="2020" 
                          className="w-full p-3 border border-slate-300 rounded-lg" 
                        />
                      </div>
                    </div>
                    <Button onClick={addBankAccount} className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Account
                    </Button>
                  </div>

                                        {formData.bankAccounts.length > 0 && (
                    <div>
                      <h5 className="font-medium text-slate-900 mb-3">Your Bank Accounts</h5>
                      <div className="space-y-2">
                        {formData.bankAccounts.map((account) => (
                          <div key={account.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <div>
                              <span className="font-medium">{account.bankName}</span>
                              <div className="text-sm text-slate-600">{account.accountType} • Opened {account.yearOpened}</div>
                            </div>
                            <Button 
                              variant="ghost" 
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                bankAccounts: prev.bankAccounts.filter(acc => acc.id !== account.id)
                              }))} 
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

                {/* Credit History Questions */}
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="hasCreditCards"
                        checked={formData.hasCreditCards}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mr-3"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        I have credit cards
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="hasBeenDelinquent"
                        checked={formData.hasBeenDelinquent}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mr-3"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        I have been delinquent on loan payments in the past
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Movable Asset Financing */}
            {currentStep === 7 && (
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
                    Adding collateral may result in better interest rates and higher loan amounts.
                  </p>
                </div>

                {/* Add Asset Form */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-4">Add Movable Asset</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Asset Type *</label>
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Value (₱) *</label>
                      <input 
                        type="number" 
                        value={newAsset.estimatedValue} 
                        onChange={(e) => setNewAsset({...newAsset, estimatedValue: e.target.value})}
                        placeholder="50000" 
                        className="w-full p-3 border border-slate-300 rounded-lg" 
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description/Model</label>
                      <input 
                        type="text" 
                        value={newAsset.description} 
                        onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                        placeholder="Honda TMX 155, etc." 
                        className="w-full p-3 border border-slate-300 rounded-lg" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Condition</label>
                      <select 
                        value={newAsset.condition} 
                        onChange={(e) => setNewAsset({...newAsset, condition: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg"
                      >
                        <option value="">Select condition</option>
                        <option value="Brand New">Brand New</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Registration/Serial Number</label>
                    <input 
                      type="text" 
                      value={newAsset.registrationNumber} 
                      onChange={(e) => setNewAsset({...newAsset, registrationNumber: e.target.value})}
                      placeholder="For vehicles: OR/CR number" 
                      className="w-full p-3 border border-slate-300 rounded-lg" 
                    />
                  </div>
                  <Button onClick={addAsset} className="bg-red-600 hover:bg-red-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                  </Button>
                </div>

                {/* Asset List */}
                {formData.movableAssets.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-4">Your Movable Assets</h4>
                    <div className="space-y-3">
                      {formData.movableAssets.map((asset) => (
                        <div key={asset.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-medium text-slate-900">{asset.type}</span>
                              <Badge variant="outline" className="text-xs">
                                ₱{Number(asset.estimatedValue).toLocaleString()}
                              </Badge>
                              {asset.condition && (
                                <Badge variant="secondary" className="text-xs">
                                  {asset.condition}
                                </Badge>
                              )}
                            </div>
                            {asset.description && (
                              <div className="text-sm text-slate-600 mb-1">{asset.description}</div>
                            )}
                            {asset.registrationNumber && (
                              <div className="text-sm text-slate-500">Reg: {asset.registrationNumber}</div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            onClick={() => removeAsset(asset.id)} 
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-900 mb-2">Total Asset Value</h5>
                      <p className="text-2xl font-bold text-green-700">
                        ₱{formData.movableAssets.reduce((total, asset) => total + Number(asset.estimatedValue || 0), 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600">
                        This may help you qualify for better loan terms
                      </p>
                    </div>
                  </div>
                )}

                {formData.movableAssets.length === 0 && (
                  <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h4 className="font-medium text-slate-600 mb-2">No assets added yet</h4>
                    <p className="text-sm text-slate-500">
                      Adding movable assets as collateral can improve your loan terms
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 8: Review & Consent */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-slate-900">Review & Submit</h3>
                  <p className="text-slate-600">Review your information and submit application</p>
                </div>

                {/* Application Summary */}
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3">Personal Information</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Name:</span>
                        <div className="font-medium">{formData.firstName} {formData.middleName} {formData.lastName} {formData.suffix}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Mobile:</span>
                        <div className="font-medium">{formData.mobileNumber}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Date of Birth:</span>
                        <div className="font-medium">{formData.dateOfBirth}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Civil Status:</span>
                        <div className="font-medium">{formData.civilStatus}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3">Address</h4>
                    <div className="text-sm">
                      <div className="font-medium">
                        {formData.homeUnit}, {formData.homeStreet}, {formData.homeBarangay}
                      </div>
                      <div className="text-slate-600">
                        {formData.homeCity}, {formData.homeProvince}, {formData.homeRegion} {formData.homeZipCode}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3">Employment & Income</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Status:</span>
                        <div className="font-medium">{formData.employmentStatus}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Occupation:</span>
                        <div className="font-medium">{formData.occupation}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Monthly Income:</span>
                        <div className="font-medium">₱{Number(formData.monthlyIncome || 0).toLocaleString()}</div>
                      </div>
                      {formData.employerName && (
                        <div>
                          <span className="text-slate-600">Employer:</span>
                          <div className="font-medium">{formData.employerName}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {(formData.hasBusiness || formData.employmentStatus === 'Business Owner' || formData.employmentStatus === 'Self-employed') && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-3">Business Information</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Business Type:</span>
                          <div className="font-medium">{formData.businessType}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Activity:</span>
                          <div className="font-medium">{formData.businessActivity}</div>
                        </div>
                        <div>
                          <span className="text-slate-600">Years in Business:</span>
                          <div className="font-medium">{formData.yearsInBusiness}</div>
                        </div>
                        {formData.annualRevenue && (
                          <div>
                            <span className="text-slate-600">Annual Revenue:</span>
                            <div className="font-medium">₱{Number(formData.annualRevenue).toLocaleString()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-3">Loan Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Loan Amount:</span>
                        <div className="font-medium text-lg">₱{Number(formData.loanAmount || 0).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Tenor:</span>
                        <div className="font-medium">{formData.loanTenor} months</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Purpose:</span>
                        <div className="font-medium">{formData.loanPurpose}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Repayment:</span>
                        <div className="font-medium">{formData.repaymentFrequency}</div>
                      </div>
                    </div>
                  </div>

                  {formData.movableAssets.length > 0 && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-3">Collateral Assets</h4>
                      <div className="space-y-2">
                        {formData.movableAssets.map((asset, index) => (
                          <div key={asset.id} className="flex justify-between text-sm">
                            <span>{asset.type} - {asset.description}</span>
                            <span className="font-medium">₱{Number(asset.estimatedValue).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Total Asset Value:</span>
                            <span>₱{formData.movableAssets.reduce((total, asset) => total + Number(asset.estimatedValue || 0), 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Important Notices */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your application will be processed using AI-powered credit scoring</li>
                    <li>• We will analyze your e-wallet transaction history for fair assessment</li>
                    <li>• Pre-approval decision typically available within 5 minutes</li>
                    <li>• All information provided will be kept confidential and secure</li>
                  </ul>
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.dataPrivacyConsent}
                      onChange={(e) => setFormData({...formData, dataPrivacyConsent: e.target.checked})}
                      className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mt-1"
                    />
                    <span className="text-sm text-slate-600">
                      <strong>Data Privacy Consent:</strong> I authorize BPI Direct BanKo to collect, process, store, and use my personal information for loan evaluation, credit scoring, and related banking services. I understand my rights under the Data Privacy Act and consent to the sharing of my information with authorized entities for creditworthiness assessment.
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
                      <strong>Terms and Conditions:</strong> I confirm that all information provided is true, accurate, and complete. I understand that BPI Direct BanKo may withdraw any loan approval if information is found to be materially inaccurate. I agree to the applicable laws, BSP regulations, and policies of BPI Direct BanKo.
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
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  className="bg-red-600 hover:bg-red-700 text-white ml-auto"
                >
                  Next Step
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.consent || !formData.dataPrivacyConsent}
                  className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
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