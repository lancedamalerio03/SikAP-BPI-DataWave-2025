// client/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    console.log('AuthProvider: Initializing Supabase auth...')
    
    // Safety fallback - ensure loading never stays true indefinitely
    const fallbackTimeout = setTimeout(() => {
      console.warn('AuthProvider: Fallback timeout triggered - forcing loading to false')
      setLoading(false)
    }, 10000) // 10 second fallback
    
    // Check if we just signed out
    const justSignedOut = sessionStorage.getItem('sikap-signed-out')
    if (justSignedOut) {
      console.log('AuthProvider: Recently signed out, skipping session restore')
      sessionStorage.removeItem('sikap-signed-out')
      clearTimeout(fallbackTimeout)
      setLoading(false)
      return
    }
    
    console.log('🔍 AuthContext: Checking for initial session...')
    
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      try {
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        
        console.log('🔍 Initial session check:', session?.user?.email || 'No session')
        
        if (session?.user) {
          console.log('AuthProvider: Found existing session', session.user.email)
          setUser(session.user)
          setIsAuthenticated(true)
          // Try to fetch profile, but don't let it block loading completion
          try {
            await Promise.race([
              fetchUserProfile(session.user.id),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 5000))
            ])
          } catch (profileError) {
            console.warn('Profile fetch failed or timed out:', profileError)
            // Continue with basic user info even if profile fetch fails
          }
        }
      } catch (error) {
        console.error('Unexpected error in session initialization:', error)
      } finally {
        clearTimeout(fallbackTimeout)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        console.log('AuthProvider: Auth state changed', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
          // Try to fetch profile, but don't let it block auth state updates
          try {
            await Promise.race([
              fetchUserProfile(session.user.id),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Profile fetch timeout')), 5000))
            ])
          } catch (profileError) {
            console.warn('Profile fetch failed or timed out in auth state change:', profileError)
            // Continue with basic user info
          }
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Unexpected error in auth state change:', error)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      clearTimeout(fallbackTimeout)
      subscription?.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      console.log('AuthProvider: Fetching user profile for', userId)
      
      // Add timeout to the database query
      const profileQuery = supabase
        .from('users_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      const { data, error } = await Promise.race([
        profileQuery,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 3000)
        )
      ])

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('AuthProvider: No profile found for user')
          // Still set user with basic info and no profile
          setUser(prev => prev ? ({
            ...prev,
            profile: null,
            profileComplete: false
          }) : prev)
          return
        }
        throw error
      }
      
      console.log('AuthProvider: Profile fetched successfully', data)
      setUser(prev => prev ? ({
        ...prev,
        profile: data,
        profileComplete: data?.profile_complete || false
      }) : prev)
    } catch (error) {
      console.error('AuthProvider: Error fetching user profile:', error)
      // Don't fail completely, just log the error and proceed
      setUser(prev => prev ? ({
        ...prev,
        profile: null,
        profileComplete: false
      }) : prev)
    }
  }

  const signUp = async (email, password, userData) => {
    console.log('AuthProvider: Starting signup process', email)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      console.log('AuthProvider: Signup successful', data.user?.email)

      if (data.user) {
        // Create user profile
        await createUserProfile(data.user.id, userData)
      }

      return data
    } catch (error) {
      console.error('AuthProvider: Signup error:', error)
      throw error
    }
  }

  const signIn = async (email, password) => {
    console.log('AuthProvider: Starting signin process', email)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      
      console.log('AuthProvider: Signin successful', data.user?.email)
      return data
    } catch (error) {
      console.error('AuthProvider: Signin error:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log('AuthProvider: Starting signout process')
    
    try {
      // Set a flag to prevent auto re-login on component remount
      sessionStorage.setItem('sikap-signed-out', 'true')
      
      // Clear local state immediately
      console.log('AuthProvider: Clearing local state...')
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      
      // Clear Supabase storage completely
      console.log('AuthProvider: Clearing ALL Supabase storage...')
      
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          localStorage.removeItem(key)
        }
      })
      
      // Clear sessionStorage  
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('sb-')) {
          sessionStorage.removeItem(key)
        }
      })
      
      // Force Supabase signout
      await supabase.auth.signOut({ scope: 'global' })
      
      console.log('AuthProvider: Complete signout finished')
      
    } catch (error) {
      console.error('AuthProvider: Signout error:', error)
    }
  }

  const createUserProfile = async (userId, userData) => {
    console.log('🚀 AuthProvider: Starting profile creation for', userId)
    console.log('📊 User data received:', userData)
    
    try {
      // Helper functions to ensure proper data types
      const formatDate = (dateString) => {
        if (!dateString || dateString.trim() === '') return null
        // Ensure date is in YYYY-MM-DD format for PostgreSQL
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }
      
      const formatString = (str) => {
        return str && str.trim() !== '' ? str.trim() : null
      }
      
      const formatNumber = (num) => {
        if (!num || num === '') return null
        const parsed = parseFloat(num)
        return isNaN(parsed) ? null : parsed
      }

      const formatInteger = (num) => {
        if (!num || num === '') return null
        const parsed = parseInt(num)
        return isNaN(parsed) ? null : parsed
      }

      // 1. Insert main profile
      console.log('📝 AuthProvider: Inserting main profile...')
      const startTime = Date.now()
      
      const { data: profileData, error: profileError } = await supabase
        .from('users_profiles')
        .insert({
          id: userId,
          email: userData.email,
          first_name: userData.personalInfo.firstName,
          middle_name: formatString(userData.personalInfo.middleName),
          last_name: userData.personalInfo.lastName,
          suffix: formatString(userData.personalInfo.suffix),
          date_of_birth: formatDate(userData.personalInfo.dateOfBirth),
          place_of_birth: userData.personalInfo.placeOfBirth,
          gender: userData.personalInfo.gender,
          civil_status: userData.personalInfo.civilStatus,
          citizenship: userData.personalInfo.citizenship,
          mobile_number: userData.personalInfo.mobileNumber,
          landline_number: formatString(userData.personalInfo.landlineNumber),
          tin: formatString(userData.personalInfo.tin),
          philsys_id: formatString(userData.personalInfo.philsysId),
          sss_number: formatString(userData.personalInfo.sssNumber),
          mother_maiden_name: formatString(userData.personalInfo.motherMaidenName),
          spouse_name: formatString(userData.personalInfo.spouseName),
          spouse_date_of_birth: formatDate(userData.personalInfo.spouseDateOfBirth),
          profile_complete: false
        })

      const endTime = Date.now()
      console.log(`⏱️ Profile insert took ${endTime - startTime}ms`)

      if (profileError) {
        console.error('❌ Profile insert error:', profileError)
        throw profileError
      }

      console.log('✅ Main profile inserted successfully!')

      // 2. Insert address data
      if (userData.address) {
        console.log('🏠 AuthProvider: Inserting address...')
        const { error: addressError } = await supabase
          .from('user_addresses')
          .insert({
            user_id: userId,
            address_type: 'home',
            unit_number: formatString(userData.address.homeUnit),
            street_address: userData.address.homeStreet,
            barangay: userData.address.homeBarangay,
            city: userData.address.homeCity,
            province: userData.address.homeProvince,
            region: userData.address.homeRegion,
            zip_code: userData.address.homeZipCode,
            home_ownership: userData.address.homeOwnership,
            length_of_stay: formatNumber(userData.address.lengthOfStay),
            is_primary: true
          })

        if (addressError) {
          console.error('❌ Address insert error:', addressError)
          throw addressError
        }
        console.log('✅ Address inserted successfully!')
      }

      // 3. Insert financial information (NEW)
      if (userData.financialInfo) {
        console.log('💰 AuthProvider: Inserting financial info...')
        const { error: financialError } = await supabase
          .from('user_financial_info')
          .insert({
            user_id: userId,
            source_of_funds: userData.financialInfo.sourceOfFunds,
            nature_of_work: userData.financialInfo.natureOfWork,
            account_purpose: userData.financialInfo.accountPurpose
          })

        if (financialError) {
          console.error('❌ Financial info insert error:', financialError)
          throw financialError
        }
        console.log('✅ Financial info inserted successfully!')
      }

      // 4. Insert employment data (ENHANCED)
      if (userData.employment) {
        console.log('💼 AuthProvider: Inserting employment...')
        
        // Prepare employment data based on employment status
        const employmentData = {
          user_id: userId,
          employment_status: userData.employment.employmentStatus,
          occupation: formatString(userData.employment.occupation),
          monthly_income: formatNumber(userData.employment.monthlyIncome),
          is_current: true,
          is_primary: true
        }

        // Add fields based on employment type
        const empStatus = userData.employment.employmentStatus

        if (empStatus?.includes('Employed') || empStatus === 'OFW') {
          // For employees and OFW
          employmentData.employer_name = formatString(userData.employment.employerName)
          employmentData.employer_address = formatString(userData.employment.employerAddress)
          employmentData.years_of_employment = formatNumber(userData.employment.yearsOfEmployment)
        } else if (empStatus === 'Self-employed' || empStatus === 'Freelancer/Contractor') {
          // For self-employed and freelancers
          employmentData.work_address = formatString(userData.employment.workAddress)
        } else if (empStatus === 'Business Owner') {
          // For business owners
          employmentData.nature_of_business = formatString(userData.employment.natureOfBusiness)
          employmentData.activity_of_business = formatString(userData.employment.activityOfBusiness)
          employmentData.business_age = formatInteger(userData.employment.businessAge)
          employmentData.business_address = formatString(userData.employment.businessAddress)
        } else if (['Student', 'Unemployed', 'Retired'].includes(empStatus)) {
          // For students, unemployed, retired
          employmentData.monthly_funds = formatNumber(userData.employment.monthlyFunds)
          // Set monthly_income to null for these categories
          employmentData.monthly_income = null
        }

        const { error: employmentError } = await supabase
          .from('user_employment')
          .insert(employmentData)

        if (employmentError) {
          console.error('❌ Employment insert error:', employmentError)
          console.error('Employment data that failed:', employmentData)
          throw employmentError
        }
        console.log('✅ Employment inserted successfully!')
      }

      // 5. Handle document uploads
      if (userData.documents && userData.documents.uploadedFiles) {
        console.log('📄 AuthProvider: Processing documents...')
        await handleDocumentUploads(userId, userData.documents.uploadedFiles)
        console.log('✅ Documents processed successfully!')
      }

      // 6. Update profile completion status
      await supabase
        .from('users_profiles')
        .update({ profile_complete: true })
        .eq('id', userId)

      console.log('🎉 User profile creation completed successfully!')
      return profileData

    } catch (error) {
      console.error('💥 Error creating user profile:', error)
      throw error
    }
  }

  const handleDocumentUploads = async (userId, files) => {
    console.log('AuthProvider: Uploading documents for', userId)
    
    for (const [documentType, file] of Object.entries(files)) {
      if (file) {
        try {
          // Upload file to Supabase Storage
          const fileExt = file.name.split('.').pop()
          const fileName = `${userId}/${documentType}.${fileExt}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('user-documents')
            .upload(fileName, file)

          if (uploadError) throw uploadError

          // Save document record
          const { error: docError } = await supabase
            .from('user_documents')
            .insert({
              user_id: userId,
              document_type: documentType,
              file_name: file.name,
              file_path: uploadData.path,
              file_size: file.size,
              file_type: file.type,
              verification_status: 'pending'
            })

          if (docError) throw docError
          
          console.log('AuthProvider: Document uploaded successfully', documentType)
        } catch (error) {
          console.error(`AuthProvider: Error uploading ${documentType}:`, error)
        }
      }
    }
  }

  const updateUserProfile = async (profileData) => {
    console.log('AuthProvider: Updating user profile')
    
    try {
      const { error } = await supabase
        .from('users_profiles')
        .update(profileData)
        .eq('id', user.id)

      if (error) throw error
      
      // Refresh profile data
      await fetchUserProfile(user.id)
      console.log('AuthProvider: Profile updated successfully')
    } catch (error) {
      console.error('AuthProvider: Error updating profile:', error)
      throw error
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    login: signIn, // For backward compatibility
    logout: signOut // For backward compatibility
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}