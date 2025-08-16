import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
  Smartphone,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    urgent: false
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBackToHome = () => {
    // navigate('/')
    console.log('Navigating back to home')
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitted(true)
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our customer service team",
      details: "(02) 8-888-SIKAP (74527)",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
      color: "bg-blue-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      details: "support@sikap.ph",
      hours: "24-48 hour response time",
      color: "bg-green-500"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our AI assistant",
      details: "Available on website and mobile app",
      hours: "24/7 instant responses",
      color: "bg-purple-500"
    },
    {
      icon: Building2,
      title: "Office Visit",
      description: "Visit our customer service center",
      details: "Makati Business District, Metro Manila",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM",
      color: "bg-red-500"
    }
  ]

  const offices = [
    {
      name: "Makati Head Office",
      address: "25th Floor, BPI Building, Ayala Avenue, Makati City, Metro Manila 1226",
      phone: "(02) 8-888-SIKAP (74527)",
      email: "makati@sikap.ph",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM",
      services: ["Loan Applications", "Customer Service", "Document Processing"]
    },
    {
      name: "Quezon City Branch",
      address: "3rd Floor, Gateway Mall, Araneta Center, Quezon City 1109",
      phone: "(02) 8-999-SIKAP (74527)",
      email: "qc@sikap.ph",
      hours: "Monday - Saturday: 10:00 AM - 6:00 PM",
      services: ["Customer Service", "Document Submission", "Loan Consultation"]
    },
    {
      name: "Cebu Branch",
      address: "12th Floor, Cebu IT Park Tower, Lahug, Cebu City 6000",
      phone: "(032) 888-SIKAP (74527)",
      email: "cebu@sikap.ph",
      hours: "Monday - Friday: 9:00 AM - 5:00 PM",
      services: ["Regional Support", "Loan Processing", "Customer Service"]
    }
  ]

  if (submitted) {
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

        {/* Success Message */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Message Sent Successfully!</h2>
              <p className="text-slate-600 mb-6">
                Thank you for contacting SikAP. We've received your message and will respond within 24-48 hours.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Our support team will review your message</li>
                  <li>• You'll receive a confirmation email shortly</li>
                  <li>• We'll contact you within 24-48 hours with a response</li>
                  <li>• For urgent matters, please call our hotline</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleBackToHome}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Return to Home
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  Send Another Message
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
            <MessageCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-lg opacity-90">
              We're here to help with your questions, feedback, or loan application support
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className={`p-3 ${method.color} rounded-lg w-fit mx-auto mb-4`}>
                <method.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{method.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{method.description}</p>
              <p className="text-sm font-medium text-slate-900 mb-2">{method.details}</p>
              <p className="text-xs text-slate-500">{method.hours}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Form and Quick Info */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Juan Dela Cruz"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="juan@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="09123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Select a category</option>
                    <option value="loan-application">Loan Application</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="account-issues">Account Issues</option>
                    <option value="payment-concerns">Payment Concerns</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Please provide detailed information about your inquiry..."
                  required
                ></textarea>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="urgent"
                  name="urgent"
                  checked={formData.urgent}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500 mt-1"
                />
                <label htmlFor="urgent" className="text-sm text-slate-600">
                  This is an urgent matter requiring immediate attention
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Quick Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Response Times</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Live Chat</p>
                    <p className="text-sm text-slate-600">Instant AI responses, 24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Phone Support</p>
                    <p className="text-sm text-slate-600">Immediate during business hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Email & Contact Form</p>
                    <p className="text-sm text-slate-600">24-48 hours response</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Emergency Contact</h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 font-medium mb-2">For urgent loan or account issues:</p>
                <p className="text-red-700 text-lg font-bold">(02) 8-888-SIKAP</p>
                <p className="text-red-600 text-sm">Available 24/7 for emergencies</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Follow Us</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
                <Button variant="outline" className="border-blue-800 text-blue-800 hover:bg-blue-50">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-50">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Office Locations</h3>
            <p className="text-lg text-slate-600">
              Visit our offices for in-person assistance and loan consultations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">{office.name}</h4>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-600">{office.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-600">{office.phone}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-600">{office.email}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <p className="text-slate-600">{office.hours}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h5 className="font-medium text-slate-900 mb-2">Services Available:</h5>
                  <ul className="space-y-1">
                    {office.services.map((service, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="bg-slate-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Looking for Quick Answers?</h3>
            <p className="text-lg text-slate-600 mb-6">
              Check our comprehensive FAQ section for instant answers to common questions
            </p>
            <Button 
              onClick={() => console.log('Navigate to FAQs')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Browse FAQs
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}