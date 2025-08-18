// client/src/components/dashboard/ProfilePage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Edit, 
  Save,
  X,
  Phone, 
  Mail,
  Calendar, 
  MapPin, 
  Briefcase, 
  Clock,
  Shield,
  Download,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  Smartphone,
  CreditCard,
  Building,
  User,
  Camera,
  TrendingUp
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+63 917 123 4567',
    dateOfBirth: '1985-01-15',
    address: '123 Main St, Pasig City, Metro Manila',
    businessType: 'Online Selling',
    monthlyIncome: '₱25,000 - ₱50,000'
  });

  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      name: 'GCash',
      type: 'E-wallet',
      account: '****1234',
      status: 'Connected',
      lastSync: '2025-03-10',
      logo: 'GC',
      bgColor: 'bg-blue-600',
      transactions: 1250
    },
    {
      id: 2,
      name: 'Maya',
      type: 'E-wallet', 
      account: '****5678',
      status: 'Connected',
      lastSync: '2025-03-09',
      logo: 'MY',
      bgColor: 'bg-cyan-600',
      transactions: 832
    },
    {
      id: 3,
      name: 'BPI Savings Account',
      type: 'Bank Account',
      account: '****9012',
      status: 'Connected',
      lastSync: '2025-03-10',
      logo: 'BPI',
      bgColor: 'bg-red-600',
      transactions: 45
    },
    {
      id: 4,
      name: 'Facebook Business',
      type: 'Social Media',
      account: '@juansbusiness',
      status: 'Connected',
      lastSync: '2025-03-08',
      logo: 'FB',
      bgColor: 'bg-blue-500',
      transactions: 0
    }
  ]);

  const [notifications, setNotifications] = useState({
    paymentReminders: true,
    loanUpdates: true,
    creditScoreChanges: true,
    marketingEmails: false,
    smsNotifications: true,
    appNotifications: true
  });

  const profileStats = [
    { label: 'Member Since', value: 'March 2023', icon: Calendar },
    { label: 'Credit Score', value: '750', icon: TrendingUp, highlight: true },
    { label: 'Active Loans', value: '2', icon: CreditCard },
    { label: 'Total Assets', value: '₱120K', icon: Briefcase }
  ];

  const handleSaveProfile = () => {
    updateUserProfile(editData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '+63 917 123 4567',
      dateOfBirth: '1985-01-15',
      address: '123 Main St, Pasig City, Metro Manila',
      businessType: 'Online Selling',
      monthlyIncome: '₱25,000 - ₱50,000'
    });
    setIsEditing(false);
  };

  const handleDisconnectAccount = (accountId) => {
    if (window.confirm('Are you sure you want to disconnect this account? This may affect your credit scoring.')) {
      setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you absolutely sure? This will permanently delete your account and all data. This action cannot be undone.')) {
      console.log('Deleting account...');
      logout();
    }
    setShowDeleteModal(false);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const downloadData = () => {
    const data = {
      profile: editData,
      connectedAccounts: connectedAccounts,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sikap-profile-data.json';
    a.click();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const getAccountStatusColor = (status) => {
    switch (status) {
      case 'Connected': return 'bg-green-100 text-green-800';
      case 'Disconnected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile Settings</h1>
          <p className="text-slate-600">Manage your account information and connected services</p>
        </div>
        <Button 
          onClick={downloadData}
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {/* Profile Avatar Section */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(editData.firstName, editData.lastName)}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50">
                    <Camera className="w-3 h-3 text-slate-600" />
                  </button>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-1">
                    {editData.firstName} {editData.lastName}
                  </h2>
                  <p className="text-slate-600 mb-2">{editData.email}</p>
                  <Badge className="bg-green-100 text-green-800">Verified Account</Badge>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <div className="py-2 text-slate-900">{editData.firstName}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <div className="py-2 text-slate-900">{editData.lastName}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    <div className="py-2 text-slate-900">{new Date(editData.dateOfBirth).toLocaleDateString()}</div>
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
                      <option>Online Selling</option>
                      <option>Retail/Sari-sari Store</option>
                      <option>Food Service</option>
                      <option>Transportation</option>
                      <option>Services</option>
                      <option>Manufacturing</option>
                    </select>
                  ) : (
                    <div className="py-2 text-slate-900">{editData.businessType}</div>
                  )}
                </div>

                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Income Range</label>
                  {isEditing ? (
                    <select
                      value={editData.monthlyIncome}
                      onChange={(e) => setEditData({...editData, monthlyIncome: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option>₱10,000 - ₱25,000</option>
                      <option>₱25,000 - ₱50,000</option>
                      <option>₱50,000 - ₱100,000</option>
                      <option>₱100,000+</option>
                    </select>
                  ) : (
                    <div className="py-2 text-slate-900">{editData.monthlyIncome}</div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Connected Accounts */}
          <Card>
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Connected Accounts</h3>
              <p className="text-sm text-slate-600">Manage your linked accounts for better credit scoring</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {connectedAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${account.bgColor} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                        {account.logo}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{account.name}</div>
                        <div className="text-sm text-slate-600">
                          {account.account} • {account.type}
                        </div>
                        <div className="text-xs text-slate-500">
                          Last sync: {account.lastSync} • {account.transactions} transactions
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getAccountStatusColor(account.status)}>
                        {account.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnectAccount(account.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ))}
                
                {/* Add Account */}
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-700">Connect New Account</div>
                      <div className="text-sm text-slate-500">Link another e-wallet, bank, or social media account</div>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Stats and Settings */}
        <div className="space-y-6">
          {/* Profile Stats */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Account Overview</h3>
            </div>
            <div className="p-4 space-y-4">
              {profileStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-600">{stat.label}</span>
                    </div>
                    <span className={`font-semibold ${stat.highlight ? 'text-green-600' : 'text-slate-900'}`}>
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Notification Settings */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Notification Preferences</h3>
            </div>
            <div className="p-4 space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-slate-700">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-red-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Security Settings */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Security & Privacy</h3>
            </div>
            <div className="p-4 space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={downloadData}>
                <Download className="w-4 h-4 mr-2" />
                Download My Data
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </Card>

          {/* Sign Out */}
          <Button 
            variant="outline" 
            onClick={logout}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Account</h3>
            <p className="text-slate-600 mb-6">
              Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-600 mb-6 space-y-1">
              <li>All your personal information</li>
              <li>Loan history and applications</li>
              <li>Connected accounts and data</li>
              <li>Credit score history</li>
              <li>Asset declarations</li>
            </ul>
            <div className="flex gap-3">
              <Button 
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Delete Account
              </Button>
              <Button 
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;