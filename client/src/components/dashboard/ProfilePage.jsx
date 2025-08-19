// client/src/components/dashboard/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile data state - simplified to essential info only
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    monthlyIncomeRange: '',
    businessType: ''
  });

  // Load user data on component mount
  useEffect(() => {
    console.log('ProfilePage: Loading user data', user);
    if (user?.profile) {
      setEditData({
        firstName: user.profile.first_name || '',
        lastName: user.profile.last_name || '',
        email: user.profile.email || user.email || '',
        phone: user.profile.mobile_number || '',
        dateOfBirth: user.profile.date_of_birth || '',
        address: user.profile.address || '123 Main St, Pasig City, Metro Manila',
        monthlyIncomeRange: user.profile.monthly_income_range || '₱25,000 - ₱50,000',
        businessType: user.profile.business_type || 'Online Selling'
      });
    } else if (user) {
      // Fallback to basic user data
      setEditData({
        firstName: user.firstName || 'demo',
        lastName: user.lastName || 'User',
        email: user.email || 'demo@sikap.com',
        phone: '+63 917 123 4567',
        dateOfBirth: '1/15/1985',
        address: '123 Main St, Pasig City, Metro Manila',
        monthlyIncomeRange: '₱25,000 - ₱50,000',
        businessType: 'Online Selling'
      });
    }
  }, [user]);

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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update user profile
      if (updateUserProfile) {
        updateUserProfile({
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
          phone: editData.phone
        });
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

  // Connected accounts data
  const connectedAccounts = [
    {
      id: 'gcash',
      name: 'GCash',
      identifier: '****1234',
      type: 'E-wallet',
      lastSync: '2025-03-10',
      transactions: 1250,
      connected: true,
      icon: 'GC',
      color: 'bg-blue-600'
    },
    {
      id: 'maya',
      name: 'Maya',
      identifier: '****5678',
      type: 'E-wallet', 
      lastSync: '2025-04-08',
      transactions: 832,
      connected: true,
      icon: 'MY',
      color: 'bg-green-600'
    },
    {
      id: 'bpi',
      name: 'BPI Savings Account',
      identifier: '****9012',
      type: 'Bank Account',
      lastSync: '2025-03-10',
      transactions: 45,
      connected: true,
      icon: 'BPI',
      color: 'bg-red-600'
    },
    {
      id: 'facebook',
      name: 'Facebook Business',
      identifier: '@juansbusiness',
      type: 'Social Media',
      lastSync: '2025-03-08',
      transactions: 0,
      connected: true,
      icon: 'FB',
      color: 'bg-blue-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account information and connected services</p>
        </div>
        <button className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
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

              {/* Editable Fields Grid */}
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  ) : (
                    <div className="py-2 text-slate-900">{editData.firstName}</div>
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  ) : (
                    <div className="py-2 text-slate-900">{editData.lastName}</div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  ) : (
                    <div className="py-2 text-slate-900">{editData.email}</div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <div className="py-2 text-slate-900">{editData.phone}</div>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                  <div className="py-2 text-slate-900">{editData.dateOfBirth}</div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Business Type</label>
                  <div className="py-2 text-slate-900">{editData.businessType}</div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <div className="py-2 text-slate-900">{editData.address}</div>
                </div>

                {/* Monthly Income */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income Range</label>
                  <div className="py-2 text-slate-900">{editData.monthlyIncomeRange}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Connected Accounts</h3>
              <p className="text-sm text-slate-600 mt-1">Manage your linked accounts for better credit scoring</p>
            </div>
            
            <div className="p-6 space-y-4">
              {connectedAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                      {account.icon}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{account.name}</div>
                      <div className="text-sm text-slate-600">{account.identifier} • {account.type}</div>
                      <div className="text-xs text-slate-500">
                        Last sync: {account.lastSync} • {account.transactions} transactions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Connected
                    </span>
                    <button className="px-3 py-1 text-xs border border-slate-300 rounded hover:bg-slate-50">
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Connect New Account */}
              <div className="flex items-center justify-between p-4 border-2 border-dashed border-slate-300 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center">
                    <span className="text-slate-400 text-lg">+</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-700">Connect New Account</div>
                    <div className="text-sm text-slate-500">Link another e-wallet, bank, or social media account</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                  Connect
                </button>
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
                  <span className="text-sm text-slate-600">Member Since</span>
                </div>
                <span className="font-medium">March 2023</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-slate-600">Credit Score</span>
                </div>
                <span className="font-medium text-green-600">750</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-slate-600">Active Loans</span>
                </div>
                <span className="font-medium">2</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span className="text-sm text-slate-600">Total Assets</span>
                </div>
                <span className="font-medium">₱120K</span>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
            
            <div className="space-y-3">
              {[
                { label: 'Payment Reminders', enabled: true },
                { label: 'Loan Updates', enabled: true },
                { label: 'Credit Score Changes', enabled: true },
                { label: 'Marketing Emails', enabled: false },
                { label: 'SMS Notifications', enabled: true },
                { label: 'App Notifications', enabled: true }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <div className={`w-10 h-6 ${item.enabled ? 'bg-red-600' : 'bg-slate-300'} rounded-full relative cursor-pointer transition-colors`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Security & Privacy</h3>
            
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-400 rounded"></div>
                  <span className="text-sm text-slate-700">Enable Two-Factor Authentication</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-400 rounded"></div>
                  <span className="text-sm text-slate-700">Change Password</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-400 rounded"></div>
                  <span className="text-sm text-slate-700">Download My Data</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600">
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