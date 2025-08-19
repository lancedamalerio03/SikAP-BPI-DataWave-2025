// client/src/components/dashboard/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile data state
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    businessType: '',
    monthlyIncome: '',
    address: '',
    civilStatus: '',
    citizenship: ''
  });
  

  // Load user data on component mount
  useEffect(() => {
    console.log('ProfilePage: Loading user data', user);
    if (user?.profile) {
      // Use actual database data instead of hardcoded values
      setEditData({
        firstName: user.profile.first_name || '',
        lastName: user.profile.last_name || '',
        email: user.profile.email || user.email || '',
        phone: user.profile.mobile_number || '',
        dateOfBirth: user.profile.date_of_birth || '',
        businessType: user.profile.business_type || '',
        monthlyIncome: user.profile.monthly_income || '',
        address: user.profile.address || '',
        civilStatus: user.profile.civil_status || '',
        citizenship: user.profile.citizenship || ''
      });
    } else if (user) {
      // Fallback to basic user data if profile isn't loaded yet
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
        dateOfBirth: '',
        businessType: '',
        monthlyIncome: '',
        address: '',
        civilStatus: '',
        citizenship: ''
      });
    }
  }, [user]);

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
          email: editData.email
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

  console.log('ProfilePage: Rendering', { user, editData, isEditing });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account information</p>
        </div>
      </div>

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
          {/* Profile Avatar Section */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(editData.firstName, editData.lastName)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">
                {editData.firstName} {editData.lastName}
              </h2>
              <p className="text-slate-600 mb-2">{editData.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified Account
              </span>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              ) : (
                <div className="py-2 text-slate-900">{editData.firstName}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              ) : (
                <div className="py-2 text-slate-900">{editData.lastName}</div>
              )}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                {isEditing ? (
                    <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                ) : (
                    <div className="py-2 text-slate-900">{editData.address}</div>
                )}
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income Range</label>
            {isEditing ? (
                <select
                value={editData.monthlyIncome}
                onChange={(e) => setEditData({...editData, monthlyIncome: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                <option value="">Select income range</option>
                <option value="₱25,000 - ₱50,000">₱25,000 - ₱50,000</option>
                <option value="₱50,000 - ₱100,000">₱50,000 - ₱100,000</option>
                <option value="₱100,000+">₱100,000+</option>
                </select>
            ) : (
                <div className="py-2 text-slate-900">{editData.monthlyIncome}</div>
            )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              ) : (
                <div className="py-2 text-slate-900">{editData.email}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+639171234567"
                />
              ) : (
                <div className="py-2 text-slate-900">{editData.phone}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editData.dateOfBirth}
                  onChange={(e) => setEditData({...editData, dateOfBirth: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <div className="py-2 text-slate-900">
                  {editData.dateOfBirth ? new Date(editData.dateOfBirth).toLocaleDateString() : ''}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Business Type</label>
              {isEditing ? (
                <select
                  value={editData.businessType}
                  onChange={(e) => setEditData({...editData, businessType: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Business Type</option>
                  <option value="Online Selling">Online Selling</option>
                  <option value="Retail/Sari-sari Store">Retail/Sari-sari Store</option>
                  <option value="Food Service">Food Service</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Services">Services</option>
                  <option value="Manufacturing">Manufacturing</option>
                </select>
              ) : (
                <div className="py-2 text-slate-900">{editData.businessType}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <button
            onClick={logout}
            className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;