// client/src/components/DashboardLayout.jsx - Updated to redirect Apply to existing PreLoanApplication
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Home, 
  Briefcase, 
  CreditCard, 
  PlusCircle, 
  MapPin, 
  MessageCircle,
  User
} from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [hasNotifications] = useState(true);

  const navigationTabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard/home' },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase, path: '/dashboard/portfolio' },
    { id: 'loans', label: 'Loans', icon: CreditCard, path: '/dashboard/loans' },
    { id: 'apply', label: 'Apply', icon: PlusCircle, path: '/application' }, // Redirects to existing PreLoanApplication
    { id: 'agents', label: 'BanKo Agents', icon: MapPin, path: '/dashboard/agents' },
    { id: 'chatbot', label: 'Finance Coach', icon: MessageCircle, path: '/dashboard/chatbot' },
  ];

  const isActiveTab = (path) => {
    if (path === '/dashboard/home' && location.pathname === '/dashboard') return true;
    if (path === '/application' && location.pathname === '/application') return true;
    return location.pathname === path;
  };

  const handleTabClick = (path) => {
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 py-4">
              <h1 className="text-2xl font-bold text-red-600">SikAP</h1>
              <Badge className="bg-amber-500 text-white">
                Powered by BPI BanKo
              </Badge>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = isActiveTab(tab.path);
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.path)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
            
            {/* User Menu */}
            <div className="flex items-center gap-4">
              <span className="hidden md:block font-medium text-slate-700">
                {user?.firstName} {user?.lastName}
              </span>
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="w-10 h-10 bg-gradient-to-r from-red-600 to-amber-500 rounded-full flex items-center justify-center text-white font-bold hover:opacity-90 transition-opacity"
                >
                  {getInitials(`${user?.firstName} ${user?.lastName}`)}
                </button>
                {hasNotifications && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="lg:hidden border-t border-slate-200 py-2">
            <div className="flex overflow-x-auto gap-2 pb-2">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = isActiveTab(tab.path);
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.path)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;