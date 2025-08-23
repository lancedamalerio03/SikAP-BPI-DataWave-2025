// client/src/services/webhookService.js
// Secure webhook service with environment variables

// Get webhook configuration from environment variables
const WEBHOOK_BASE_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || 'https://sikap-2025.app.n8n.cloud/webhook'
const WEBHOOK_AUTH_TOKEN = process.env.REACT_APP_N8N_AUTH_TOKEN // Optional authentication token
const WEBHOOK_TIMEOUT = parseInt(process.env.REACT_APP_WEBHOOK_TIMEOUT) || 30000 // 30 seconds default

// Configuration for different webhook endpoints
const WEBHOOK_ENDPOINTS = {
  PRELOAN_APPLICATION: 'preloan-application',
  LOAN_APPLICATION: 'loan-application',
  DOCUMENT_UPLOAD: 'document-upload',
  USER_REGISTRATION: 'user-registration',
  ASSET_DECLARATION: 'asset-declaration'
}

class WebhookService {
  constructor() {
    this.baseUrl = WEBHOOK_BASE_URL
    this.authToken = WEBHOOK_AUTH_TOKEN
    this.timeout = WEBHOOK_TIMEOUT
    
    // Validate configuration
    this.validateConfig()
  }

  /**
   * Validate webhook configuration
   */
  validateConfig() {
    if (!this.baseUrl) {
      console.error('Webhook service: REACT_APP_N8N_WEBHOOK_URL is not configured')
      throw new Error('Webhook URL is not configured')
    }

    // Check if it's a relative URL (proxy mode) or full URL
    const isRelativeUrl = this.baseUrl.startsWith('/')
    const isValidFullUrl = this.baseUrl.startsWith('http')

    if (!isRelativeUrl && !isValidFullUrl) {
      console.error('Webhook service: Invalid webhook URL format:', this.baseUrl)
      throw new Error('Invalid webhook URL format')
    }

    console.log('Webhook service initialized:', {
      baseUrl: this.baseUrl,
      isProxyMode: isRelativeUrl,
      hasAuthToken: !!this.authToken,
      timeout: this.timeout
    })
  }

  /**
   * Send data to n8n webhook with enhanced security
   * @param {string} endpoint - The webhook endpoint
   * @param {object} data - The data to send
   * @param {object} options - Additional options
   * @returns {Promise} Response from webhook
   */
  async sendToWebhook(endpoint, data, options = {}) {
    const url = `${this.baseUrl}/${endpoint}`
    
    try {
      console.log(`Sending to webhook: ${url}`)
      
      // Prepare headers with security considerations
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'SikAP-React-App/1.0',
        ...(options.headers || {})
      }

      // Add authentication if configured
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`
      }

      // Add custom auth token if provided in options
      if (options.authToken) {
        headers['Authorization'] = `Bearer ${options.authToken}`
      }

      // Add security headers
      if (process.env.REACT_APP_N8N_API_KEY) {
        headers['X-API-Key'] = process.env.REACT_APP_N8N_API_KEY
      }

      // Prepare payload with metadata
      const payload = {
        ...data,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'react_app',
          version: process.env.REACT_APP_VERSION || '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          requestId: this.generateRequestId()
        }
      }

      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      }

      const response = await fetch(url, requestOptions)
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Webhook error: ${response.status} ${response.statusText}. ${errorText}`)
      }

      const result = await response.json()
      console.log('Webhook response received successfully')
      
      return result
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Webhook request timed out')
        throw new Error('Request timed out. Please try again.')
      }
      
      console.error('Webhook service error:', error)
      throw error
    }
  }

  /**
   * Generate unique request ID for tracking
   */
  generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Submit preloan application with enhanced security
   * @param {object} user - User data from Supabase auth
   * @param {object} loanData - Loan application data
   * @returns {Promise} Application submission result
   */
  async submitPreLoanApplication(user, loanData) {
    const applicationId = `SLN-${Date.now()}`
    
    // Sanitize and validate input data
    const sanitizedLoanData = this.sanitizeLoanData(loanData)
    const sanitizedUser = this.sanitizeUserData(user)
    
    const payload = {
      applicationId,
      submittedAt: new Date().toISOString(),
      user: sanitizedUser,
      loanData: {
        loan_amount: parseFloat(sanitizedLoanData.loanAmount),
        loan_purpose: sanitizedLoanData.loanPurpose,
        loan_tenor_months: parseInt(sanitizedLoanData.loanTenor),
        repayment_frequency: sanitizedLoanData.repaymentFrequency,
        urgency: sanitizedLoanData.urgency,
        additional_information: sanitizedLoanData.additionalInfo || null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      workflow_type: 'preloan_application',
      legacyData: {
        applicantId: sanitizedUser.id,
        applicantName: sanitizedUser.name,
        status: 'pending_review',
        estimatedProcessingTime: '24-48 hours'
      }
    }

    return this.sendToWebhook(WEBHOOK_ENDPOINTS.PRELOAN_APPLICATION, payload)
  }

  /**
   * Sanitize loan data to prevent injection attacks
   */
  sanitizeLoanData(loanData) {
    return {
      loanAmount: this.sanitizeNumber(loanData.loanAmount),
      loanPurpose: this.sanitizeString(loanData.loanPurpose),
      loanTenor: this.sanitizeNumber(loanData.loanTenor),
      repaymentFrequency: this.sanitizeString(loanData.repaymentFrequency),
      urgency: this.sanitizeString(loanData.urgency),
      additionalInfo: this.sanitizeText(loanData.additionalInfo)
    }
  }

  /**
   * Sanitize user data
   */
  sanitizeUserData(user) {
    return {
      id: this.sanitizeString(user.id),
      email: this.sanitizeEmail(user.email),
      name: `${this.sanitizeString(user.user_metadata?.firstName || '')} ${this.sanitizeString(user.user_metadata?.lastName || '')}`.trim(),
      firstName: this.sanitizeString(user.user_metadata?.firstName),
      lastName: this.sanitizeString(user.user_metadata?.lastName)
    }
  }

  /**
   * Sanitization helper methods
   */
  sanitizeString(str) {
    if (!str || typeof str !== 'string') return ''
    return str.trim().slice(0, 255) // Limit length and trim
  }

  sanitizeNumber(num) {
    const parsed = parseFloat(num)
    return isNaN(parsed) ? 0 : parsed
  }

  sanitizeEmail(email) {
    if (!email || typeof email !== 'string') return ''
    return email.trim().toLowerCase().slice(0, 255)
  }

  sanitizeText(text) {
    if (!text || typeof text !== 'string') return null
    return text.trim().slice(0, 1000) // Limit to 1000 characters
  }

  /**
   * Submit full loan application
   * @param {object} user - User data
   * @param {object} formData - Complete loan application form data
   * @returns {Promise} Application submission result
   */
  async submitLoanApplication(user, formData) {
    const applicationId = `LON-${Date.now()}`
    
    const payload = {
      applicationId,
      submittedAt: new Date().toISOString(),
      user: this.sanitizeUserData(user),
      applicationData: formData, // Consider adding sanitization here too
      workflow_type: 'full_loan_application'
    }

    return this.sendToWebhook(WEBHOOK_ENDPOINTS.LOAN_APPLICATION, payload)
  }

  /**
   * Submit document upload
   * @param {object} user - User data
   * @param {object} documentData - Document information
   * @returns {Promise} Upload result
   */
  async submitDocumentUpload(user, documentData) {
    const payload = {
      uploadId: `DOC-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      user: this.sanitizeUserData(user),
      documentData,
      workflow_type: 'document_upload'
    }

    return this.sendToWebhook(WEBHOOK_ENDPOINTS.DOCUMENT_UPLOAD, payload)
  }

  /**
   * Submit asset declaration
   * @param {object} user - User data
   * @param {object} assetData - Asset declaration data
   * @returns {Promise} Asset declaration result
   */
  async submitAssetDeclaration(user, assetData) {
    const applicationId = `ASD-${Date.now()}`
    const payload = {
      applicationId: applicationId,
      submittedAt: new Date().toISOString(),
      user: this.sanitizeUserData(user),
      declaredAssets: assetData.declaredAssets,
      summary: assetData.summary,
      workflow_type: 'asset_declaration'
    }

    return this.sendToWebhook(WEBHOOK_ENDPOINTS.ASSET_DECLARATION, payload)
  }

  /**
   * Test webhook connectivity with security headers
   * @param {string} endpoint - Endpoint to test
   * @returns {Promise} Test result
   */
  async testWebhook(endpoint) {
    const testPayload = {
      test: true,
      message: 'Test webhook connectivity',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }

    try {
      const result = await this.sendToWebhook(endpoint, testPayload)
      return { success: true, result }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Health check method
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'SikAP-React-App/1.0'
        },
        signal: AbortSignal.timeout(5000)
      })
      
      return {
        status: response.ok ? 'healthy' : 'unhealthy',
        statusCode: response.status,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Create and export a singleton instance
const webhookService = new WebhookService()

export default webhookService
export { WEBHOOK_ENDPOINTS }