// client/src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

console.log('Loading Supabase client...')

// Get environment variables with better error handling
let supabaseUrl = 'https://placeholder.supabase.co'
let supabaseAnonKey = 'placeholder-key'

try {
  // Use process.env for better compatibility
  if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY) {
    console.log('Using REACT_APP environment variables')
    supabaseUrl = process.env.REACT_APP_SUPABASE_URL
    supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY
  } 
  // Fallback to Vite style
  else if (import.meta?.env?.VITE_SUPABASE_URL && import.meta?.env?.VITE_SUPABASE_ANON_KEY) {
    console.log('Using VITE environment variables')
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  } else {
    console.warn('Environment variables not found, using fallback values')
  }
} catch (error) {
  console.error('Error accessing environment variables:', error)
}

console.log('Environment check:')
console.log('- Supabase URL:', supabaseUrl)
console.log('- Using real credentials:', supabaseUrl !== 'https://placeholder.supabase.co')

// Check if Supabase is properly configured
export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'

// Create mock client for fallback
const createMockClient = () => ({
  auth: {
    getSession: () => {
      console.log('Mock: getSession called')
      return Promise.resolve({ data: { session: null }, error: null })
    },
    onAuthStateChange: (callback) => {
      console.log('Mock: onAuthStateChange called')
      return { data: { subscription: { unsubscribe: () => console.log('Mock: unsubscribed') } } }
    },
    signUp: (data) => {
      console.log('Mock: signUp called', data.email)
      return Promise.resolve({ data: null, error: new Error('Supabase not configured - using mock') })
    },
    signInWithPassword: (data) => {
      console.log('Mock: signInWithPassword called', data.email)
      return Promise.resolve({ data: null, error: new Error('Supabase not configured - using mock') })
    },
    signOut: () => {
      console.log('Mock: signOut called')
      return Promise.resolve({ error: null })
    }
  },
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        single: () => {
          console.log(`Mock: querying ${table} where ${column} = ${value}`)
          return Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        }
      })
    }),
    insert: (data) => {
      console.log(`Mock: inserting into ${table}`, data)
      return Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    },
    update: (data) => ({
      eq: (column, value) => {
        console.log(`Mock: updating ${table} where ${column} = ${value}`, data)
        return Promise.resolve({ error: new Error('Supabase not configured') })
      }
    })
  }),
  storage: {
    from: (bucket) => ({
      upload: (path, file) => {
        console.log(`Mock: uploading to ${bucket}/${path}`)
        return Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      },
      createSignedUrl: (path, expires) => {
        console.log(`Mock: creating signed URL for ${path}`)
        return Promise.resolve({ data: { signedUrl: '#' }, error: new Error('Supabase not configured') })
      }
    })
  }
})

// Create the client
let supabaseClient

if (isSupabaseConfigured) {
  console.log('✅ Creating real Supabase client')
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase client created successfully')
  } catch (error) {
    console.error('❌ Error creating Supabase client:', error)
    supabaseClient = createMockClient()
  }
} else {
  console.log('⚠️ Using mock Supabase client (credentials not found)')
  supabaseClient = createMockClient()
}

export const supabase = supabaseClient