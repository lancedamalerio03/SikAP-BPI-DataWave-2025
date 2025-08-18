// client/src/utils/errorHandler.js
export const handleSupabaseError = (error) => {
    console.error('Supabase error:', error)
    
    // Common Supabase error codes and user-friendly messages
    const errorMessages = {
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/email-already-in-use': 'An account with this email already exists',
      'PGRST116': 'Profile already exists for this user',
      'PGRST204': 'No data found',
      '23505': 'This record already exists'
    }
    
    // Check for specific error codes
    if (error.code && errorMessages[error.code]) {
      return errorMessages[error.code]
    }
    
    // Check for constraint violations
    if (error.message?.includes('duplicate key')) {
      return 'This information already exists in our system'
    }
    
    if (error.message?.includes('violates row-level security')) {
      return 'You do not have permission to perform this action'
    }
    
    // Generic error message
    return error.message || 'An unexpected error occurred. Please try again.'
  }