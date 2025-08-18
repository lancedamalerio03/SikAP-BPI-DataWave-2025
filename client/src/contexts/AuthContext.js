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
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
        setLoading(false)
        return
      }
      
      if (session?.user) {
        console.log('AuthProvider: Found existing session', session.user.email)
        setUser(session.user)
        setIsAuthenticated(true)
        fetchUserProfile(session.user.id)
      } else {
        console.log('AuthProvider: No existing session')
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthProvider: Auth state changed', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
        setLoading(false)
      }
    )

    return () => {
      console.log('AuthProvider: Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId) => {
    try {
      console.log('AuthProvider: Fetching user profile for', userId)
      
      const { data, error } = await supabase
        .from('users_profiles')
        .select(`
          *,
          user_addresses(*),
          user_employment(*),
          user_documents(*),
          connected_accounts(*)
        `)
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('AuthProvider: No profile found for user, will create on first update')
          return
        }
        throw error
      }
      
      console.log('AuthProvider: Profile fetched successfully')
      setUser(prev => ({
        ...prev,
        profile: data,
        profileComplete: data?.profile_complete || false
      }))
    } catch (error) {
      console.error('AuthProvider: Error fetching user profile:', error)
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
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setIsAuthenticated(false)
      console.log('AuthProvider: Signout successful')
    } catch (error) {
      console.error('AuthProvider: Signout error:', error)
      throw error
    }
  }

  const createUserProfile = async (userId, userData) => {
    console.log('AuthProvider: Creating user profile for', userId)
    
    try {
      // Insert main profile
      const { data: profileData, error: profileError } = await supabase
        .from('users_profiles')
        .insert({
          id: userId,
          email: userData.email,
          first_name: userData.personalInfo.firstName,
          middle_name: userData.personalInfo.middleName,
          last_name: userData.personalInfo.lastName,
          suffix: userData.personalInfo.suffix,
          date_of_birth: userData.personalInfo.dateOfBirth,
          place_of_birth: userData.personalInfo.placeOfBirth,
          gender: userData.personalInfo.gender,
          civil_status: userData.personalInfo.civilStatus,
          citizenship: userData.personalInfo.citizenship,
          mobile_number: userData.personalInfo.mobileNumber,
          landline_number: userData.personalInfo.landlineNumber,
          tin: userData.personalInfo.tin,
          philsys_id: userData.personalInfo.philsysId,
          sss_number: userData.personalInfo.sssNumber,
          mother_maiden_name: userData.personalInfo.motherMaidenName,
          spouse_name: userData.personalInfo.spouseName,
          spouse_date_of_birth: userData.personalInfo.spouseDateOfBirth,
          profile_complete: false
        })

      if (profileError) throw profileError

      // Insert address
      const { error: addressError } = await supabase
        .from('user_addresses')
        .insert({
          user_id: userId,
          address_type: 'home',
          unit_number: userData.address.homeUnit,
          street_address: userData.address.homeStreet,
          barangay: userData.address.homeBarangay,
          city: userData.address.homeCity,
          province: userData.address.homeProvince,
          region: userData.address.homeRegion,
          zip_code: userData.address.homeZipCode,
          home_ownership: userData.address.homeOwnership,
          length_of_stay: userData.address.lengthOfStay,
          is_primary: true
        })

      if (addressError) throw addressError

      // Insert employment
      const { error: employmentError } = await supabase
        .from('user_employment')
        .insert({
          user_id: userId,
          employment_status: userData.employment.employmentStatus,
          occupation: userData.employment.occupation,
          employer_name: userData.employment.employerName,
          employer_address: userData.employment.employerAddress,
          monthly_income: userData.employment.monthlyIncome,
          years_of_employment: userData.employment.yearsOfEmployment,
          is_current: true,
          is_primary: true
        })

      if (employmentError) throw employmentError

      // Handle document uploads if needed
      if (userData.documents.uploadedFiles) {
        await handleDocumentUploads(userId, userData.documents.uploadedFiles)
      }

      console.log('AuthProvider: User profile created successfully')
      return profileData
    } catch (error) {
      console.error('AuthProvider: Error creating user profile:', error)
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