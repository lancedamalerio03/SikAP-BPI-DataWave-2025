// client/src/utils/validation.js
export const validation = {
    // Philippine mobile number validation
    validatePhilippineMobile(number) {
      const philippinePattern = /^(09|\+639)\d{9}$/
      return philippinePattern.test(number)
    },
  
    // Email validation
    validateEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(email)
    },
  
    // Age validation (must be 18+)
    validateAge(dateOfBirth) {
      const today = new Date()
      const birthDate = new Date(dateOfBirth)
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age >= 18
    },
  
    // File validation
    validateFile(file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']) {
      const maxSize = maxSizeMB * 1024 * 1024 // Convert to bytes
      
      if (file.size > maxSize) {
        throw new Error(`File size must be less than ${maxSizeMB}MB`)
      }
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload only JPG, PNG, or PDF files')
      }
      
      return true
    },
  
    // Required fields validation
    validateRequiredFields(data, requiredFields) {
      const missingFields = []
      
      requiredFields.forEach(field => {
        if (!data[field] || data[field].toString().trim() === '') {
          missingFields.push(field)
        }
      })
      
      return {
        isValid: missingFields.length === 0,
        missingFields
      }
    }
  }