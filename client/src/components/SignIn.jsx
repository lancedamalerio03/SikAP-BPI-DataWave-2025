import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { ArrowLeft, Eye, EyeOff, Lock, User, Shield, AlertCircle } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // Get the page user was trying to access before being redirected to sign-in
  const from = location.state?.from?.pathname || '/dashboard'

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
  
    try {
      await signIn(formData.email, formData.password)
      // Redirect handled by auth state change in AuthContext
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Sign in error:', err)
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="p-8 shadow-lg border-red-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-600">Sign in to access your loan application</p>
              
              {/* Show message if user was redirected from protected route */}
              {location.state?.from && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-700">
                    Please sign in to continue with your loan application
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="juan@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
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
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white shadow-lg py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Demo Credentials</h4>
              <p className="text-sm text-blue-700 mb-2">For testing, use any email and password combination:</p>
              <div className="text-xs text-blue-600 font-mono">
                Email: eskwelabsautomation@gmail.com<br />
                Password: sikap123
              </div>
            </div>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Don't have an account?</span>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <Button
              variant="outline"
              onClick={() => navigate('/signup')}
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
              disabled={loading}
            >
              Create Account
            </Button>

            {/* Trust Badges */}
            <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-3 h-3 text-green-600" />
                <span>BSP Regulated</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-3 h-3 text-green-600" />
                <span>Bank-Level Security</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}