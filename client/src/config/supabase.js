const config = {
    development: {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      buckets: {
        userDocuments: 'user-documents-dev',
        profilePictures: 'profile-pictures-dev'
      }
    },
    production: {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      buckets: {
        userDocuments: 'user-documents',
        profilePictures: 'profile-pictures'
      }
    }
  }
  
  const env = import.meta.env.MODE || 'development'
  export default config[env]