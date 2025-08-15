import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import {
  Package,
  Brain,
  Zap,
  Database,
  Building2,
  Shield,
  Lock,
  ChevronRight,
  Users,
  Clock,
  Bot,
  Target,
} from "lucide-react"

export function SikAPLanding() {
  const handleApplyNow = () => {
    // For MVP - will navigate to application form
    alert('Navigating to loan application form... (This will be implemented with React Router)')
    // Later: navigate('/application')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-red-600">SikAP</h1>
            <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">
              Powered by BPI BanKo
            </Badge>
          </div>
          <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                Pera Para sa <span className="text-red-600">Pangarap Mo</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                AI-powered loan pre-approval for Filipino micro-entrepreneurs and gig workers. No traditional credit
                history needed!
              </p>
            </div>

            {/* Key Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Package className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Movable asset financing options</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Brain className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">AI scoring & ESG alignment</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Zap className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">Lightning-fast automated loan review</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white shadow-sm">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Database className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">GCash, Maya & utility bill analysis</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={handleApplyNow}
              >
                Mag-apply Na!
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                onClick={() => alert('Learn More content coming soon!')}
              >
                Learn More
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Lock className="w-4 h-4 text-green-600" />
                <span>BSP Regulated</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Data Protected</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 className="w-4 h-4 text-red-600" />
                <span>Trusted by BPI BanKo</span>
              </div>
            </div>
          </div>

          {/* App Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-[600px] bg-slate-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Phone Status Bar */}
                  <div className="bg-slate-50 px-6 py-2 flex justify-between items-center text-xs">
                    <span className="font-medium">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-slate-300 rounded-sm"></div>
                      <div className="w-4 h-2 bg-slate-300 rounded-sm"></div>
                      <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-6 space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-slate-900">Loan Application</h3>
                      <p className="text-sm text-slate-600">Step 1 of 4</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <div className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50">
                          <span className="text-slate-900">Juan dela Cruz</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                        <div className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50">
                          <span className="text-slate-900">+63 917 123 4567</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Business Type</label>
                        <div className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 flex justify-between items-center">
                          <span className="text-slate-900">Sari-sari Store</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      Next: Business Information →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white/50 backdrop-blur-sm border-y border-slate-200">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 text-red-600" />
                <span className="text-3xl font-bold text-slate-900">Fast</span>
              </div>
              <p className="text-slate-600">AI-powered pre-approval</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="w-6 h-6 text-red-600" />
                <span className="text-3xl font-bold text-slate-900">10K+</span>
              </div>
              <p className="text-slate-600">Entrepreneurs served</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-red-600" />
                <span className="text-3xl font-bold text-slate-900">₱50M+</span>
              </div>
              <p className="text-slate-600">Total loans disbursed</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-slate-900">Powered by AI Agents</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform uses AI agents to ensure fair, fast, and ESG-aligned lending decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto">
                <Brain className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Credit Scoring Agent</h4>
                <p className="text-sm text-slate-600">Alternative data analysis for fair credit assessment</p>
              </div>
            </Card>

            <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Asset Valuation Agent</h4>
                <p className="text-sm text-slate-600">Smart collateral assessment for movable assets</p>
              </div>
            </Card>

            <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">ESG Assessment Agent</h4>
                <p className="text-sm text-slate-600">Impact scoring for sustainable lending practices</p>
              </div>
            </Card>

            <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto">
                <Bot className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Financial Chatbot</h4>
                <p className="text-sm text-slate-600">Personalized financial education and tips</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <h4 className="text-xl font-bold text-red-400">SikAP</h4>
              <Badge variant="secondary" className="bg-amber-500">
                Powered by BPI BanKo
              </Badge>
            </div>
            <p className="text-slate-400 text-sm">
              Empowering Filipino micro-entrepreneurs through AI-powered financial inclusion
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-400">
              <span>BSP Regulated</span>
              <span>•</span>
              <span>Data Protected</span>
              <span>•</span>
              <span>BPI BanKo</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}