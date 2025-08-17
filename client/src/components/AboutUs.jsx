import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  Building2,
  Users,
  Target,
  Heart,
  Shield,
  Award,
  Brain,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle,
  Bot,
  Database,
  Lock
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function About() {
  const navigate = useNavigate()
  const handleBackToHome = () => {
    navigate('/')
  }

  const teamMembers = [
    {
      name: "Maria Santos",
      role: "Chief Executive Officer",
      description: "Former BPI executive with 15+ years in financial services and fintech innovation",
      expertise: "Strategic Leadership, Financial Inclusion"
    },
    {
      name: "Juan Dela Cruz",
      role: "Chief Technology Officer", 
      description: "AI/ML expert with background in Microsoft and local fintech startups",
      expertise: "Artificial Intelligence, System Architecture"
    },
    {
      name: "Anna Reyes",
      role: "Head of Risk Management",
      description: "Risk assessment specialist with expertise in alternative credit scoring",
      expertise: "Credit Risk, Regulatory Compliance"
    },
    {
      name: "Carlos Lopez",
      role: "Head of Product",
      description: "Product strategist focused on user experience and financial accessibility",
      expertise: "Product Strategy, UX Design"
    }
  ]

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "SikAP was established as a partnership between fintech innovators and BPI BanKo"
    },
    {
      year: "2024",
      title: "AI Platform Launch",
      description: "Deployed Microsoft Copilot Studio-powered lending agents for automated loan processing"
    },
    {
      year: "2024",
      title: "First 1,000 Borrowers",
      description: "Successfully served first thousand micro-entrepreneurs across Metro Manila"
    },
    {
      year: "2025",
      title: "Nationwide Expansion",
      description: "Extended services to all regions in the Philippines with digital-first approach"
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "Kapamilya Spirit",
      description: "We treat every borrower as family, understanding their dreams and challenges"
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Bank-level security and BSP compliance ensure your data and funds are protected"
    },
    {
      icon: Target,
      title: "Financial Inclusion",
      description: "Making loans accessible to underserved Filipinos who lack traditional credit history"
    },
    {
      icon: Brain,
      title: "Innovation",
      description: "Leveraging AI and technology to create fairer, faster financial solutions"
    }
  ]

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
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Empowering Filipino Dreams Through AI-Powered Lending
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 mb-8">
              SikAP (Sistema ng Kredito para sa Aming Pamilya) democratizes access to credit for 
              micro-entrepreneurs and underserved communities across the Philippines.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10,000+ Borrowers Served</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>₱50M+ Loans Disbursed</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>BSP Regulated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-lg">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              To provide accessible, fair, and technology-driven financial services that empower 
              Filipino micro-entrepreneurs and individuals to achieve their dreams, regardless of 
              their traditional credit history.
            </p>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Globe className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">
              To become the leading AI-powered lending platform in Southeast Asia, creating a 
              financially inclusive ecosystem where every Filipino has equal access to credit 
              and financial opportunities.
            </p>
          </Card>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h3>
              <p className="text-lg text-slate-600">
                Born from the need to bridge the financial inclusion gap in the Philippines
              </p>
            </div>

            <div className="prose prose-lg mx-auto text-slate-600">
              <p>
                SikAP was founded in 2023 when our team recognized a critical gap in the Philippine 
                financial landscape. Millions of micro-entrepreneurs, gig workers, and individuals 
                were being excluded from traditional lending due to lack of formal credit history, 
                despite having viable businesses and steady income streams.
              </p>
              
              <p>
                Partnering with BPI BanKo, we set out to create a solution that would leverage 
                artificial intelligence and alternative data sources to fairly assess creditworthiness. 
                Our platform analyzes digital footprints, transaction patterns, and behavioral data 
                to provide loans to those who need them most.
              </p>

              <p>
                Today, SikAP serves thousands of Filipino families, helping them grow their businesses, 
                purchase essential assets, improve their homes, and invest in education. Every loan 
                we approve represents a dream made possible and a step towards greater financial inclusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h3>
          <p className="text-lg text-slate-600">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto mb-4">
                <value.icon className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-3">{value.title}</h4>
              <p className="text-sm text-slate-600">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Technology Stack */}
      <section className="bg-slate-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Powered by Advanced Technology</h3>
            <p className="text-lg text-slate-600">
              Our AI-first approach ensures fair, fast, and secure lending decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Microsoft Copilot Studio</h4>
              <p className="text-sm text-slate-600">AI agents for intelligent loan processing and customer support</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                <Database className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Alternative Data Analysis</h4>
              <p className="text-sm text-slate-600">GCash, Maya, and utility bill analysis for credit assessment</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Real-time Processing</h4>
              <p className="text-sm text-slate-600">Lightning-fast loan decisions with automated workflows</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="p-3 bg-orange-100 rounded-lg w-fit mx-auto mb-4">
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Bank-level Security</h4>
              <p className="text-sm text-slate-600">Enterprise-grade security with BSP compliance</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Leadership Team</h3>
          <p className="text-lg text-slate-600">
            Experienced leaders passionate about financial inclusion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h4>
              <p className="text-sm font-medium text-red-600 mb-3">{member.role}</p>
              <p className="text-sm text-slate-600 mb-3">{member.description}</p>
              <div className="text-xs text-slate-500">
                <strong>Expertise:</strong> {member.expertise}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Journey</h3>
            <p className="text-lg text-slate-600">
              Key milestones in our mission to democratize credit access
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-16 bg-slate-300 mt-4"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="text-xl font-semibold text-slate-900 mb-2">{milestone.title}</h4>
                    <p className="text-slate-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-3xl font-bold text-red-400">SikAP</div>
              <div className="text-2xl text-slate-400">×</div>
              <div className="flex items-center gap-2">
                <Building2 className="w-8 h-8 text-amber-400" />
                <span className="text-2xl font-bold text-amber-400">BPI BanKo</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">Trusted Partnership</h3>
            <p className="text-lg text-slate-300 mb-8">
              Our partnership with BPI BanKo, a subsidiary of the Bank of the Philippine Islands, 
              ensures that our services are backed by one of the country's most trusted financial institutions. 
              This collaboration brings together fintech innovation and established banking expertise.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">BSP Regulated</h4>
                <p className="text-slate-400">Licensed and supervised by the Bangko Sentral ng Pilipinas</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Proven Track Record</h4>
                <p className="text-slate-400">Backed by BPI's 170+ years of banking excellence</p>
              </div>
              <div>
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Customer Focus</h4>
                <p className="text-slate-400">Committed to serving underbanked Filipino communities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Join Our Mission</h3>
          <p className="text-lg text-slate-600 mb-8">
            Be part of the financial inclusion revolution. Whether you're looking for a loan or 
            want to learn more about our technology, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white"
              onClick={() => console.log('Navigate to application')}
            >
              Apply for a Loan
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => console.log('Navigate to contact')}
            >
              Contact Us
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
              onClick={() => console.log('Navigate to programs')}
            >
              View Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Contact Info */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>📍 Makati Business District, Metro Manila</p>
                <p>📞 (02) 8-888-SIKAP (74527)</p>
                <p>📧 support@sikap.ph</p>
                <p>🌐 www.sikap.ph</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 3:00 PM</p>
                <p>Sunday: Closed</p>
                <p className="text-green-400">24/7 Online Application Processing</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Regulatory Information</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>Licensed by BSP</p>
                <p>Certificate of Authority No. 1234</p>
                <p>Member of PDIC</p>
                <p>ISO 27001 Certified</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>© 2025 SikAP. All rights reserved. Powered by BPI BanKo, a subsidiary of Bank of the Philippine Islands.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}