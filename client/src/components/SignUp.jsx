import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  UserPlus, 
  AlertCircle,
  User,
  MapPin,
  Upload,
  CheckCircle,
  Calendar,
  Phone,
  Globe,
  CreditCard

} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp, signIn } = useAuth()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState({})

  const [formData, setFormData] = useState({
    // Step 1: Account Setup
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    
    // Step 2: Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: '',
    civilStatus: '',
    citizenship: '',
    mobileNumber: '',
    landlineNumber: '',
    tin: '',
    philsysId: '',
    sssNumber: '',
    motherMaidenName: '',
    spouseName: '',
    spouseDateOfBirth: '',
    
    // Step 3: Address & Occupation
    homeUnit: '',
    homeStreet: '',
    homeBarangay: '',
    homeCity: '',
    homeProvince: '',
    homeRegion: '',
    homeZipCode: '',
    homeOwnership: '',
    lengthOfStay: '',
    employmentStatus: '',
    occupation: '',
    employerName: '',
    employerAddress: '',
    monthlyIncome: '',
    yearsOfEmployment: '',
    
    // Step 4: Document Upload - will store file references
    primaryId: null
  })

  const regions = [
    "National Capital Region (NCR)",
    "Region I (Ilocos Region)",
    "Region II (Cagayan Valley)",
    "Region III (Central Luzon)",
    "Region IV-A (CALABARZON)",
    "Region IV-B (MIMAROPA)",
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

  const employmentStatuses = [
    "Employed (Full-time)",
    "Employed (Part-time)",
    "Self-employed",
    "Business Owner",
    "Freelancer/Contractor",
    "OFW",
    "Student",
    "Unemployed",
    "Retired"
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    if (error) setError('')
  }

  const handleFileUpload = (fieldName, event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        setError('Please upload only JPG, PNG, or PDF files')
        return
      }
      
      if (file.size > maxSize) {
        setError('File size must be less than 5MB')
        return
      }
      
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: file
      }))
      
      setFormData(prev => ({
        ...prev,
        [fieldName]: file.name
      }))
    }
  }

  const validateStep = (step) => {
    setError('')
    
    switch (step) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return false
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long')
          return false
        }
        if (!formData.agreeToTerms) {
          setError('Please agree to the terms and conditions')
          return false
        }
        break
        
      case 2:
        const requiredStep2 = ['firstName', 'lastName', 'dateOfBirth', 'placeOfBirth', 'gender', 'civilStatus', 'citizenship', 'mobileNumber']
        for (let field of requiredStep2) {
          if (!formData[field]) {
            setError('Please fill in all required fields')
            return false
          }
        }
        // Validate mobile number format
        if (!/^(09|\+639)\d{9}$/.test(formData.mobileNumber)) {
          setError('Please enter a valid Philippine mobile number')
          return false
        }
        break
        
      case 3:
        const requiredStep3 = ['homeUnit', 'homeStreet', 'homeBarangay', 'homeCity', 'homeProvince', 'homeRegion', 'homeZipCode', 'employmentStatus']
        for (let field of requiredStep3) {
          if (!formData[field]) {
            setError('Please fill in all required fields')
            return false
          }
        }
        break
        
      case 4:
        if (!uploadedFiles.primaryId) {
          setError('Please upload a valid government ID')
          return false
        }
        break
        
      default:
        return true
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(4)) return
    
    setLoading(true)
    setError('')
  
    try {
      // Prepare user data for Supabase
      const userData = {
        email: formData.email,
        personalInfo: {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          suffix: formData.suffix,
          dateOfBirth: formData.dateOfBirth,
          placeOfBirth: formData.placeOfBirth,
          gender: formData.gender,
          civilStatus: formData.civilStatus,
          citizenship: formData.citizenship,
          mobileNumber: formData.mobileNumber,
          landlineNumber: formData.landlineNumber,
          tin: formData.tin,
          philsysId: formData.philsysId,
          sssNumber: formData.sssNumber,
          motherMaidenName: formData.motherMaidenName,
          spouseName: formData.spouseName,
          spouseDateOfBirth: formData.spouseDateOfBirth
        },
        address: {
          homeUnit: formData.homeUnit,
          homeStreet: formData.homeStreet,
          homeBarangay: formData.homeBarangay,
          homeCity: formData.homeCity,
          homeProvince: formData.homeProvince,
          homeRegion: formData.homeRegion,
          homeZipCode: formData.homeZipCode,
          homeOwnership: formData.homeOwnership,
          lengthOfStay: formData.lengthOfStay
        },
        employment: {
          employmentStatus: formData.employmentStatus,
          occupation: formData.occupation,
          employerName: formData.employerName,
          employerAddress: formData.employerAddress,
          monthlyIncome: formData.monthlyIncome,
          yearsOfEmployment: formData.yearsOfEmployment
        },
        documents: {
          primaryId: formData.primaryId,
          uploadedFiles: uploadedFiles
        }
      }
  
      // Sign up with Supabase
      await signUp(formData.email, formData.password, userData)
      
      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <UserPlus className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-slate-900">Account Setup</h3>
              <p className="text-slate-600">Create your secure account</p>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="juan@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mt-1"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-slate-600">
                I agree to the <button type="button" className="text-red-600 hover:text-red-700 font-medium">Terms and Conditions</button> and <button type="button" className="text-red-600 hover:text-red-700 font-medium">Privacy Policy</button>
              </label>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
              <p className="text-slate-600">Complete your personal details</p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  placeholder="Juan"
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
                  placeholder="Santos"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  placeholder="Dela Cruz"
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
                  <option value="">None</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="II">II</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
            </div>

            {/* Birth Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Place of Birth *</label>
                <input 
                  type="text" 
                  name="placeOfBirth" 
                  value={formData.placeOfBirth} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  placeholder="Manila, Philippines"
                  required 
                />
              </div>
            </div>

            {/* Gender & Civil Status */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender *</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  required
                >
                  <option value="">Select gender</option>
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
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            {/* Citizenship */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Citizenship *</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  name="citizenship" 
                  value={formData.citizenship} 
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                  placeholder="Filipino"
                  required 
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    name="mobileNumber" 
                    value={formData.mobileNumber} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="09123456789"
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Landline Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    name="landlineNumber" 
                    value={formData.landlineNumber} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="(02) 1234-5678"
                  />
                </div>
              </div>
            </div>

            {/* Government IDs */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Government IDs</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">TIN</label>
                  <input 
                    type="text" 
                    name="tin" 
                    value={formData.tin} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="123-456-789-000"
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
                    placeholder="1234-5678-9012"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SSS Number</label>
                  <input 
                    type="text" 
                    name="sssNumber" 
                    value={formData.sssNumber} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="12-3456789-0"
                  />
                </div>
              </div>
            </div>

            {/* Mother's Maiden Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mother's Maiden Name</label>
              <input 
                type="text" 
                name="motherMaidenName" 
                value={formData.motherMaidenName} 
                onChange={handleInputChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                placeholder="Complete maiden name"
              />
            </div>

            {/* Spouse Information (if married) */}
            {formData.civilStatus === 'Married' && (
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <h4 className="font-medium text-pink-900 mb-3">Spouse Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Spouse Name</label>
                    <input 
                      type="text" 
                      name="spouseName" 
                      value={formData.spouseName} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      placeholder="Full name"
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
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-slate-900">Address & Occupation</h3>
              <p className="text-slate-600">Complete address and employment details</p>
            </div>

            {/* Address Information */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">Home Address</h4>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Unit/House # *</label>
                  <input 
                    type="text" 
                    name="homeUnit" 
                    value={formData.homeUnit} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="123"
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
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="Rizal Street"
                    required 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Barangay *</label>
                  <input 
                    type="text" 
                    name="homeBarangay" 
                    value={formData.homeBarangay} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="Barangay Poblacion"
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
                    placeholder="Manila"
                    required 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Province *</label>
                  <input 
                    type="text" 
                    name="homeProvince" 
                    value={formData.homeProvince} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="Metro Manila"
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
                    <option value="">Select region</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Zip Code *</label>
                  <input 
                    type="text" 
                    name="homeZipCode" 
                    value={formData.homeZipCode} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="1000"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Home Ownership</label>
                  <select 
                    name="homeOwnership" 
                    value={formData.homeOwnership} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Select</option>
                    <option value="Owned">Owned</option>
                    <option value="Rented">Rented</option>
                    <option value="Living with relatives">Living with relatives</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Length of Stay</label>
                  <input 
                    type="text" 
                    name="lengthOfStay" 
                    value={formData.lengthOfStay} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="5 years"
                  />
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-3">Employment Information</h4>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employment Status *</label>
                  <select 
                    name="employmentStatus" 
                    value={formData.employmentStatus} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required
                  >
                    <option value="">Select status</option>
                    {employmentStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Occupation</label>
                  <input 
                    type="text" 
                    name="occupation" 
                    value={formData.occupation} 
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="Software Developer"
                  />
                </div>
              </div>

              {(formData.employmentStatus?.includes('Employed') || formData.employmentStatus === 'OFW') && (
                <>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Employer Name</label>
                      <input 
                        type="text" 
                        name="employerName" 
                        value={formData.employerName} 
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Years of Employment</label>
                      <input 
                        type="text" 
                        name="yearsOfEmployment" 
                        value={formData.yearsOfEmployment} 
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        placeholder="3 years"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Employer Address</label>
                    <input 
                      type="text" 
                      name="employerAddress" 
                      value={formData.employerAddress} 
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      placeholder="Complete employer address"
                    />
                  </div>
                </>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">â‚±</span>
                  <input 
                    type="number" 
                    name="monthlyIncome" 
                    value={formData.monthlyIncome} 
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="25000"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-slate-900">Identity Verification</h3>
              <p className="text-slate-600">Upload your government ID to verify your identity</p>
            </div>

            {/* Document Upload Instructions */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-900 mb-2">Upload Requirements</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>â€¢ Accepted formats: JPG, PNG, PDF</li>
                <li>â€¢ Maximum file size: 5MB</li>
                <li>â€¢ Ensure document is clear and readable</li>
                <li>â€¢ All information must be visible</li>
              </ul>
            </div>

            {/* Government ID Upload */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-red-400 transition-colors">
              <div className="text-center">
                <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h4 className="font-medium text-slate-900 mb-2">Government ID * (Required)</h4>
                <p className="text-sm text-slate-600 mb-6">
                  Upload any valid government-issued ID for identity verification
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Accepted IDs: Driver's License, Passport, PhilSys ID, SSS ID, TIN ID, Voter's ID, PRC License
                </p>
                
                {uploadedFiles.primaryId ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-medium">{uploadedFiles.primaryId.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setUploadedFiles(prev => ({...prev, primaryId: null}))
                          setFormData(prev => ({...prev, primaryId: null}))
                        }}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                      <input
                        type="file"
                        id="primaryIdReplace"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileUpload('primaryId', e)}
                        className="hidden"
                      />
                      <label
                        htmlFor="primaryIdReplace"
                        className="px-3 py-1 text-sm text-slate-600 hover:text-slate-700 border border-slate-300 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        Replace
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      id="primaryId"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileUpload('primaryId', e)}
                      className="hidden"
                    />
                    <label
                      htmlFor="primaryId"
                      className="inline-flex items-center px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-colors font-medium"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Data Privacy Notice */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Data Privacy Notice</h4>
              <p className="text-sm text-blue-700">
                Your uploaded ID will be securely stored and used only for identity verification. 
                We comply with the Data Privacy Act of 2012 and will not share your information with unauthorized parties.
              </p>
            </div>

            {/* Next Steps Info */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>â€¢ Your account will be created instantly</li>
                <li>â€¢ ID verification typically takes 1-2 business days</li>
                <li>â€¢ You can start applying for loans immediately</li>
                <li>â€¢ Additional documents may be requested during loan processing</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
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

      {/* Progress Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Step {currentStep} of 4</span>
            <span className="text-sm text-slate-500">{Math.round((currentStep / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-lg border-red-100">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Step Content */}
            <form onSubmit={currentStep === 4 ? handleSubmit : (e) => e.preventDefault()}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || loading}
                  className="border-slate-300 text-slate-600 hover:bg-slate-50"
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={loading}
                    className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Registration
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Step Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step <= currentStep
                      ? 'bg-red-600'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}