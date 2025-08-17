import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  Package,
  Building2,
  Car,
  Smartphone,
  Home,
  GraduationCap,
  Heart,
  ShoppingCart,
  CheckCircle,
  Clock,
  Calculator,
  Users,
  TrendingUp,
  Shield
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Programs() {
  const navigate = useNavigate()
  const [selectedProgram, setSelectedProgram] = useState(null)

  const loanPrograms = [
    {
      id: 'business-loans',
      title: 'Business Loans',
      subtitle: 'Grow your business with flexible financing',
      icon: Building2,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      amount: '₱10,000 - ₱500,000',
      term: '6 - 60 months',
      rate: '2.5% monthly',
      features: [
        'Working capital financing',
        'Equipment purchase',
        'Inventory funding',
        'Business expansion',
        'No collateral required up to ₱100k'
      ],
      requirements: [
        'Valid government ID',
        'Business permit or registration',
        'Bank statements (3 months)',
        'Proof of business income'
      ],
      eligibility: [
        'Filipino citizen, 21-65 years old',
        'Operating business for at least 6 months',
        'Monthly business income of ₱15,000+',
        'Good credit standing'
      ]
    },
    {
      id: 'motorcycle-loans',
      title: 'Motorcycle Loans',
      subtitle: 'Own a motorcycle for personal or business use',
      icon: Car,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      amount: '₱25,000 - ₱200,000',
      term: '12 - 36 months',
      rate: '1.8% monthly',
      features: [
        'Brand new and used motorcycles',
        'For delivery riders and commuters',
        'Motorcycle as collateral',
        'Fast approval process',
        'Flexible payment terms'
      ],
      requirements: [
        'Valid driver\'s license',
        'Government-issued ID',
        'Proof of income',
        'Certificate of registration (for used)'
      ],
      eligibility: [
        'Filipino citizen, 21-60 years old',
        'Valid driver\'s license',
        'Stable source of income',
        'No bad credit history'
      ]
    },
    {
      id: 'gadget-loans',
      title: 'Gadget Loans',
      subtitle: 'Get the latest smartphones and gadgets',
      icon: Smartphone,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      amount: '₱5,000 - ₱100,000',
      term: '6 - 24 months',
      rate: '2.0% monthly',
      features: [
        'Latest smartphones and tablets',
        'Laptops and computers',
        'Gaming consoles',
        'Home appliances',
        'Zero down payment options'
      ],
      requirements: [
        'Valid government ID',
        'Proof of income',
        'Billing statement (address proof)',
        'Employment certificate'
      ],
      eligibility: [
        'Filipino citizen, 18-65 years old',
        'Regular source of income',
        'Good payment history',
        'Verified contact information'
      ]
    },
    {
      id: 'home-improvement',
      title: 'Home Improvement Loans',
      subtitle: 'Upgrade and renovate your home',
      icon: Home,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      amount: '₱15,000 - ₱300,000',
      term: '12 - 48 months',
      rate: '2.2% monthly',
      features: [
        'Home renovation and repairs',
        'Appliance purchases',
        'Furniture and fixtures',
        'Solar panel installation',
        'Flexible use of funds'
      ],
      requirements: [
        'Property ownership documents',
        'Valid government ID',
        'Proof of income',
        'Renovation quotations'
      ],
      eligibility: [
        'Filipino citizen, homeowner',
        'Stable monthly income',
        '21-65 years old',
        'Property as collateral'
      ]
    },
    {
      id: 'education-loans',
      title: 'Education Loans',
      subtitle: 'Invest in your future through education',
      icon: GraduationCap,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      amount: '₱20,000 - ₱250,000',
      term: '12 - 60 months',
      rate: '1.5% monthly',
      features: [
        'Tuition fee financing',
        'Vocational training courses',
        'Professional certifications',
        'Online learning programs',
        'Grace period available'
      ],
      requirements: [
        'School enrollment proof',
        'Academic transcripts',
        'Valid government ID',
        'Co-maker (if required)'
      ],
      eligibility: [
        'Filipino citizen student or parent',
        'Enrolled in accredited institution',
        'Good academic standing',
        'Co-maker with stable income'
      ]
    },
    {
      id: 'emergency-loans',
      title: 'Emergency Loans',
      subtitle: 'Quick cash for urgent needs',
      icon: Heart,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      amount: '₱5,000 - ₱50,000',
      term: '3 - 24 months',
      rate: '3.0% monthly',
      features: [
        'Medical emergencies',
        'Urgent repairs',
        'Family emergencies',
        'Same-day approval possible',
        'Minimal documentation'
      ],
      requirements: [
        'Valid government ID',
        'Proof of emergency need',
        'Contact references',
        'Source of income proof'
      ],
      eligibility: [
        'Filipino citizen, 21-65 years old',
        'Verifiable emergency need',
        'Ability to repay',
        'Clean credit record'
      ]
    }
  ]

  const handleApplyNow = (programId) => {
    // In a real app, this would navigate to application with pre-selected program
    console.log(`Applying for program: ${programId}`)
    // navigate(`/application?program=${programId}`)
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
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Loan Programs</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose from our flexible loan programs designed for Filipino micro-entrepreneurs and individuals
          </p>
        </div>

        {/* Program Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loanPrograms.map((program) => {
            const IconComponent = program.icon
            return (
              <Card 
                key={program.id} 
                className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedProgram(program)}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${program.color} rounded-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{program.title}</h3>
                      <p className="text-sm text-slate-600">{program.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
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

                  <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {program.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
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
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started?</h3>
          <p className="text-lg text-slate-600 mb-6">
            Join thousands of Filipinos who have achieved their dreams with SikAP
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white"
              onClick={() => handleApplyNow('general')}
            >
              Start Application
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={handleBackToHome}
            >
              Learn More
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

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      handleApplyNow(selectedProgram.id)
                      setSelectedProgram(null)
                    }}
                  >
                    Apply for This Program
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