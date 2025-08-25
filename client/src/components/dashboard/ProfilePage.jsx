// client/src/components/dashboard/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile data state - matching the reference design
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    monthlyIncomeRange: '',
    businessType: ''
  });

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    payment: true,
    loan: true,
    credit: true,
    marketing: false,
    sms: true,
    app: true
  });

  // Load user data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;
      
      console.log('ProfilePage: Loading user data', user);
      
      try {
        // Fetch data from multiple tables in parallel
        const [profileResult, addressResult, employmentResult] = await Promise.all([
          // 1. Fetch user profile
          supabase
            .from('users_profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
          
          // 2. Fetch address information
          supabase
            .from('user_addresses')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .limit(1),
          
          // 3. Fetch employment information
          supabase
            .from('user_employment')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_primary', true)
            .limit(1)
        ]);

        const profile = profileResult.data;
        const address = addressResult.data?.[0];
        const employment = employmentResult.data?.[0];

        // Handle errors
        if (profileResult.error) {
          console.error('Error fetching user profile:', profileResult.error);
        }
        if (addressResult.error) {
          console.error('Error fetching user address:', addressResult.error);
        }
        if (employmentResult.error) {
          console.error('Error fetching user employment:', employmentResult.error);
        }

        // Construct address string
        let addressString = '';
        if (address) {
          const parts = [
            address.unit_number,
            address.street_address,
            address.barangay,
            address.city,
            address.province
          ].filter(Boolean);
          addressString = parts.join(', ');
        }

        // Format monthly income as range
        let monthlyIncomeRange = '';
        if (employment?.monthly_income) {
          const income = employment.monthly_income;
          if (income < 25000) {
            monthlyIncomeRange = '₱10,000 - ₱25,000';
          } else if (income < 50000) {
            monthlyIncomeRange = '₱25,000 - ₱50,000';
          } else if (income < 100000) {
            monthlyIncomeRange = '₱50,000 - ₱100,000';
          } else if (income < 250000) {
            monthlyIncomeRange = '₱100,000 - ₱250,000';
          } else {
            monthlyIncomeRange = '₱250,000+';
          }
        }
        
        // Set the complete user data
        setEditData({
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          email: profile?.email || user.email || '',
          phone: profile?.mobile_number || '',
          address: addressString,
          dateOfBirth: profile?.date_of_birth || '',
          monthlyIncomeRange: monthlyIncomeRange,
          businessType: employment?.occupation || ''
        });

      } catch (error) {
        console.error('Error loading user profile:', error);
        // Fallback to basic user data
        setEditData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: '',
          address: '',
          dateOfBirth: '',
          monthlyIncomeRange: '',
          businessType: ''
        });
      }
    };
    
    loadUserProfile();
  }, [user?.id]); // Depend on user ID

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simple validation
      if (!editData.firstName || !editData.lastName || !editData.email) {
        throw new Error('Please fill in required fields');
      }

      // Update the user profile in users_profiles table
      const { error: profileError } = await supabase
        .from('users_profiles')
        .update({
          first_name: editData.firstName,
          last_name: editData.lastName,
          email: editData.email,
          mobile_number: editData.phone,
          date_of_birth: editData.dateOfBirth,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update employment information if businessType is provided
      if (editData.businessType) {
        // Convert monthly income range back to a number for storage
        let monthlyIncome = null;
        if (editData.monthlyIncomeRange) {
          switch (editData.monthlyIncomeRange) {
            case '₱10,000 - ₱25,000':
              monthlyIncome = 17500; // midpoint
              break;
            case '₱25,000 - ₱50,000':
              monthlyIncome = 37500;
              break;
            case '₱50,000 - ₱100,000':
              monthlyIncome = 75000;
              break;
            case '₱100,000 - ₱250,000':
              monthlyIncome = 175000;
              break;
            case '₱250,000+':
              monthlyIncome = 250000;
              break;
          }
        }

        // Check if employment record exists
        const { data: existingEmployment } = await supabase
          .from('user_employment')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_primary', true)
          .limit(1);

        if (existingEmployment && existingEmployment.length > 0) {
          // Update existing employment record
          const { error: employmentError } = await supabase
            .from('user_employment')
            .update({
              occupation: editData.businessType,
              monthly_income: monthlyIncome,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('is_primary', true);

          if (employmentError) throw employmentError;
        } else {
          // Create new employment record
          const { error: employmentError } = await supabase
            .from('user_employment')
            .insert({
              user_id: user.id,
              occupation: editData.businessType,
              monthly_income: monthlyIncome,
              employment_status: 'Self-employed', // Default assumption
              is_primary: true,
              created_at: new Date().toISOString()
            });

          if (employmentError) throw employmentError;
        }
      }

      setSuccess('Profile updated successfully!');
      setIsEditing(false);

    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const handleToggleNotification = (key) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };



  const handleTwoFactorAuth = () => {
    console.log('Setting up two-factor authentication...');
    alert('Opening two-factor authentication setup...');
  };

  const handleChangePassword = () => {
    console.log('Changing password...');
    alert('Opening password change form...');
  };

  const handleDownloadData = () => {
    console.log('Downloading user data...');
    alert('Preparing data download...');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      console.log('Deleting account...');
      alert('Account deletion would be processed here...');
    }
  };



  // Notification items based on state
  const notificationItems = [
    { key: 'payment', label: 'Payment Reminders', enabled: notificationPrefs.payment },
    { key: 'loan', label: 'Loan Updates', enabled: notificationPrefs.loan },
    { key: 'credit', label: 'Credit Score Changes', enabled: notificationPrefs.credit },
    { key: 'marketing', label: 'Marketing Emails', enabled: notificationPrefs.marketing },
    { key: 'sms', label: 'SMS Notifications', enabled: notificationPrefs.sms },
    { key: 'app', label: 'App Notifications', enabled: notificationPrefs.app }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account information and connected services</p>
        </div>
        <button 
          onClick={handleDownloadData}
          className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <span className="text-green-700">{success}</span>
            </div>
          )}

          {/* Profile Information Card */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    disabled={loading}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {getInitials(editData.firstName, editData.lastName)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {editData.firstName} {editData.lastName}
                  </h2>
                  <p className="text-slate-600">{editData.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Verified Account
                  </span>
                </div>
              </div>

              {/* Editable Fields Grid - Essential info only */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-slate-900 py-3">{editData.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-slate-900 py-3">{editData.lastName}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-slate-900 py-3">{editData.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-slate-900 py-3">{editData.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <p className="text-slate-900 py-3">{editData.address || 'Not specified'}</p>
                  {isEditing && (
                    <p className="text-xs text-slate-500 mt-1">
                      Address information is managed through your complete profile setup. Contact support to update your address.
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={loading}
                    />
                  ) : (
                    <p className="text-slate-900 py-3">{editData.dateOfBirth}</p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Type</label>
                  {isEditing ? (
                    <select
                      name="businessType"
                      value={editData.businessType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={loading}
                    >
                      <option value="Online Selling">Online Selling</option>
                      <option value="Retail">Retail</option>
                      <option value="Services">Services</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-slate-900 py-3">{editData.businessType}</p>
                  )}
                </div>

                {/* Monthly Income Range */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income Range</label>
                  {isEditing ? (
                    <select
                      name="monthlyIncomeRange"
                      value={editData.monthlyIncomeRange}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      disabled={loading}
                    >
                      <option value="₱10,000 - ₱25,000">₱10,000 - ₱25,000</option>
                      <option value="₱25,000 - ₱50,000">₱25,000 - ₱50,000</option>
                      <option value="₱50,000 - ₱100,000">₱50,000 - ₱100,000</option>
                      <option value="₱100,000 - ₱250,000">₱100,000 - ₱250,000</option>
                      <option value="₱250,000+">₱250,000+</option>
                    </select>
                  ) : (
                    <p className="text-slate-900 py-3">{editData.monthlyIncomeRange}</p>
                  )}
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Right Column - Account Overview & Settings */}
        <div className="space-y-6">
          {/* Account Overview */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Overview</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-400 rounded"></div>
                  <span className="text-sm text-slate-600">Profile Status</span>
                </div>
                <span className="font-medium text-green-600">
                  {user?.profileComplete ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-slate-600">Business Type</span>
                </div>
                <span className="font-medium">{editData.businessType || 'Not specified'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm text-slate-600">Income Range</span>
                </div>
                <span className="font-medium">{editData.monthlyIncomeRange || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-3">
              {notificationItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <button
                    onClick={() => handleToggleNotification(item.key)}
                    className={`w-10 h-6 ${item.enabled ? 'bg-red-600' : 'bg-slate-300'} rounded-full relative cursor-pointer transition-colors`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Security & Privacy</h3>
            
            <div className="space-y-3">
              <button 
                onClick={handleTwoFactorAuth}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-400 rounded"></div>
                  <span className="text-sm text-slate-700">Enable Two-Factor Authentication</span>
                </div>
              </button>
              
              <button 
                onClick={handleChangePassword}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-400 rounded"></div>
                  <span className="text-sm text-slate-700">Change Password</span>
                </div>
              </button>
              
              <button 
                onClick={handleDownloadData}
                className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-400 rounded"></div>
                  <span className="text-sm text-slate-700">Download My Data</span>
                </div>
              </button>
              
              <button 
                onClick={handleDeleteAccount}
                className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600"
              >
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Delete Account</span>
                </div>
              </button>
            </div>
          </div>

          {/* Sign Out Button */}
          <button 
            onClick={logout}
            className="w-full p-3 text-center bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;