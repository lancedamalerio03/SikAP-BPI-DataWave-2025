import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Clock,
  Shield,
  CreditCard,
  FileText,
  Calculator,
  Smartphone,
  Bot,
  MessageCircle
} from "lucide-react"

export default function FAQs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openFAQ, setOpenFAQ] = useState(null)

  const handleBackToHome = () => {
    // navigate('/')
    console.log('Navigating back to home')
  }

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle },
    { id: "application", name: "Application Process", icon: FileText },
    { id: "requirements", name: "Requirements", icon: CreditCard },
    { id: "approval", name: "Approval & Processing", icon: Clock },
    { id: "rates", name: "Rates & Fees", icon: Calculator },
    { id: "technology", name: "AI & Technology", icon: Bot },
    { id: "security", name: "Security & Privacy", icon: Shield }
  ]

  const faqs = [
    // Application Process
    {
      id: 1,
      category: "application",
      question: "How do I apply for a loan with SikAP?",
      answer: "You can apply in 4 simple steps: (1) Create an account on our website or mobile app, (2) Complete your profile with personal and financial information, (3) Upload required documents, and (4) Submit your loan application. Our AI system will process your application and provide a decision typically within 24-48 hours."
    },
    {
      id: 2,
      category: "application",
      question: "Can I apply even without traditional credit history?",
      answer: "Yes! SikAP specializes in serving borrowers without traditional credit history. Our AI agents analyze alternative data sources like GCash/Maya transactions, utility bill payments, and other digital footprints to assess your creditworthiness fairly."
    },
    {
      id: 3,
      category: "application",
      question: "What loan amounts can I apply for?",
      answer: "Loan amounts vary by program: Business loans (₱10,000 - ₱500,000), Motorcycle loans (₱25,000 - ₱200,000), Gadget loans (₱5,000 - ₱100,000), Home improvement (₱15,000 - ₱300,000), Education loans (₱20,000 - ₱250,000), and Emergency loans (₱5,000 - ₱50,000)."
    },
    
    // Requirements
    {
      id: 4,
      category: "requirements",
      question: "What documents do I need to submit?",
      answer: "Basic requirements include: Valid government ID, proof of income (COE, payslip, business permit, or bank statements), proof of address (utility bill or barangay certificate), and completed application form. Additional documents may be required based on your chosen loan program."
    },
    {
      id: 5,
      category: "requirements",
      question: "Do I need a co-maker or collateral?",
      answer: "It depends on the loan type and amount. Business loans up to ₱100,000 typically don't require collateral. Motorcycle loans use the vehicle as collateral. Larger amounts may require additional security or a co-maker with stable income."
    },
    {
      id: 6,
      category: "requirements",
      question: "What are the age and citizenship requirements?",
      answer: "You must be a Filipino citizen aged 18-65 years old (age limits vary by program). You must also have a stable source of income and no history of fraud or serious credit defaults."
    },

    // Approval & Processing
    {
      id: 7,
      category: "approval",
      question: "How long does the approval process take?",
      answer: "Our AI-powered system provides initial decisions within 5-15 minutes of application submission. Complete approval typically takes 24-48 hours after document verification. Emergency loans may be processed faster for urgent cases."
    },
    {
      id: 8,
      category: "approval",
      question: "How will I know if my loan is approved?",
      answer: "You'll receive notifications via SMS, email, and through your SikAP dashboard. Our system provides real-time updates on your application status, from initial review to final approval and fund disbursement."
    },
    {
      id: 9,
      category: "approval",
      question: "What happens if my application is declined?",
      answer: "If declined, you'll receive specific feedback on the reasons and suggestions for improvement. You can reapply after addressing the issues, typically after 30 days. Our AI system learns and may offer alternative loan products that better match your profile."
    },

    // Rates & Fees
    {
      id: 10,
      category: "rates",
      question: "What are your interest rates?",
      answer: "Interest rates vary by loan program: Business loans (2.5% monthly), Motorcycle loans (1.8% monthly), Gadget loans (2.0% monthly), Home improvement (2.2% monthly), Education loans (1.5% monthly), and Emergency loans (3.0% monthly). Rates may vary based on your credit assessment."
    },
    {
      id: 11,
      category: "rates",
      question: "Are there any additional fees?",
      answer: "We maintain transparency with minimal fees: Processing fee (1-2% of loan amount), Late payment penalty (5% of overdue amount), and Document processing fee (₱100-500). No hidden charges or prepayment penalties."
    },
    {
      id: 12,
      category: "rates",
      question: "Can I pay my loan early without penalty?",
      answer: "Yes! You can pay your loan early without any prepayment penalties. Early payment can also help improve your credit score in our system for future loan applications."
    },

    // AI & Technology
    {
      id: 13,
      category: "technology",
      question: "How does your AI credit scoring work?",
      answer: "Our AI agents analyze multiple data points including digital transaction history, utility payments, social media activity (with permission), employment verification, and behavioral patterns. This creates a comprehensive credit profile even without traditional banking history."
    },
    {
      id: 14,
      category: "technology",
      question: "What data do you collect and analyze?",
      answer: "With your consent, we analyze GCash/Maya transaction patterns, utility bill payment history, social media activity, employment records, and basic demographic information. All data collection complies with the Data Privacy Act of 2012."
    },
    {
      id: 15,
      category: "technology",
      question: "How accurate is your AI assessment?",
      answer: "Our AI system maintains over 90% accuracy in credit assessments, continuously learning from repayment patterns. The system is designed to be fair and unbiased, regularly audited for algorithmic fairness."
    },

    // Security & Privacy
    {
      id: 16,
      category: "security",
      question: "How secure is my personal information?",
      answer: "We use bank-level security including 256-bit SSL encryption, multi-factor authentication, and ISO 27001 certified data centers. All data is stored securely and never shared with unauthorized parties. We're fully compliant with BSP regulations and the Data Privacy Act."
    },
    {
      id: 17,
      category: "security",
      question: "Can I delete my data from your system?",
      answer: "Yes, you have the right to request data deletion under the Data Privacy Act. However, we must retain certain records for regulatory compliance (typically 5-7 years). You can update or correct your information anytime through your dashboard."
    },
    {
      id: 18,
      category: "security",
      question: "Is SikAP regulated by BSP?",
      answer: "Yes, SikAP operates under BPI BanKo's BSP license and supervision. We follow all BSP regulations for lending, data protection, and consumer rights. Your deposits and transactions are covered by PDIC insurance where applicable."
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (faqId) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId)
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-amber-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg opacity-90">
              Find answers to common questions about SikAP's AI-powered lending platform
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-slate-900 pr-4">
                        {faq.question}
                      </h3>
                      {openFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  
                  {openFAQ === faq.id && (
                    <div className="px-6 pb-6 border-t border-slate-100">
                      <p className="text-slate-600 leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-600 mb-4">
                  Try adjusting your search terms or category filter
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <MessageCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h3>
            <p className="text-lg text-slate-600 mb-8">
              Our customer support team is here to help you with any additional questions or concerns.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-4 text-center">
                <Smartphone className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium text-slate-900 mb-1">Phone Support</h4>
                <p className="text-sm text-slate-600">(02) 8-888-SIKAP</p>
                <p className="text-xs text-slate-500">Mon-Fri 8AM-6PM</p>
              </Card>
              
              <Card className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium text-slate-900 mb-1">Live Chat</h4>
                <p className="text-sm text-slate-600">24/7 AI Assistant</p>
                <p className="text-xs text-slate-500">Instant responses</p>
              </Card>
              
              <Card className="p-4 text-center">
                <FileText className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium text-slate-900 mb-1">Email Support</h4>
                <p className="text-sm text-slate-600">support@sikap.ph</p>
                <p className="text-xs text-slate-500">24-48 hour response</p>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => console.log('Open live chat')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
              <Button 
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => console.log('Navigate to contact page')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-slate-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 text-center mb-8">Popular Topics</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center border-slate-300 hover:border-red-300 hover:bg-red-50"
                onClick={() => {
                  setSelectedCategory("application")
                  setSearchTerm("")
                }}
              >
                <FileText className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium">How to Apply</span>
              </Button>
              
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center border-slate-300 hover:border-red-300 hover:bg-red-50"
                onClick={() => {
                  setSelectedCategory("requirements")
                  setSearchTerm("")
                }}
              >
                <CreditCard className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium">Requirements</span>
              </Button>
              
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center border-slate-300 hover:border-red-300 hover:bg-red-50"
                onClick={() => {
                  setSelectedCategory("rates")
                  setSearchTerm("")
                }}
              >
                <Calculator className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium">Rates & Fees</span>
              </Button>
              
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center border-slate-300 hover:border-red-300 hover:bg-red-50"
                onClick={() => {
                  setSelectedCategory("technology")
                  setSearchTerm("")
                }}
              >
                <Bot className="w-6 h-6 text-red-600 mb-2" />
                <span className="text-sm font-medium">AI Technology</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}