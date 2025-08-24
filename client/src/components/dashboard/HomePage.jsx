// client/src/components/dashboard/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Package,
  Bell,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Upload,
  MapPin,
  MessageCircle,
  Calendar,
  DollarSign,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for dynamic data
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [userStats, setUserStats] = useState({
    totalApplications: 0,
    activeLoans: 0,
    completedPayments: 0,
    totalBorrowed: 0
  });

  // Quick action cards (keeping these static as they're navigation items)
  const quickActions = [
    {
      icon: PlusCircle,
      title: 'New Loan Application',
      description: 'Apply for a new loan',
      color: 'bg-red-600',
      onClick: () => navigate('/application')
    },
    {
      icon: Upload,
      title: 'Upload Documents',
      description: 'Submit required documents',
      color: 'bg-blue-600',
      onClick: () => navigate('/dashboard/loans')
    },
    {
      icon: Package,
      title: 'Declare Assets',
      description: 'Add movable assets',
      color: 'bg-green-600',
      onClick: () => navigate('/dashboard/portfolio')
    },
    {
      icon: MapPin,
      title: 'Find Branch',
      description: 'Locate nearby branches',
      color: 'bg-amber-600',
      onClick: () => navigate('/dashboard/agents')
    },
    {
      icon: MessageCircle,
      title: 'Finance Coach',
      description: 'Get financial advice',
      color: 'bg-purple-600',
      onClick: () => navigate('/dashboard/chatbot')
    }
  ];

  // Fetch user data on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load data in parallel
      await Promise.all([
        loadRecentApplications(),
        loadUserStats(),
        generateNotifications(),
        loadUpcomingPayments()
      ]);
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;

      setRecentApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      setRecentApplications([]);
    }
  };

  const loadUserStats = async () => {
    try {
      // Get application count
      const { data: applications, error: appError } = await supabase
        .from('preloan_applications')
        .select('id, loan_amount, status')
        .eq('user_id', user.id);

      if (appError) throw appError;

      const totalApplications = applications?.length || 0;
      const activeLoans = applications?.filter(app => app.status === 'approved').length || 0;
      const totalBorrowed = applications
        ?.filter(app => app.status === 'approved')
        ?.reduce((sum, app) => sum + (parseFloat(app.loan_amount) || 0), 0) || 0;

      setUserStats({
        totalApplications,
        activeLoans,
        completedPayments: 0, // This would come from a payments table
        totalBorrowed
      });

    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const generateNotifications = async () => {
    try {
      const { data: applications, error } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const notifications = [];

      // Generate notifications based on application status
      applications?.forEach(app => {
        // Payment due notifications (simulated - would be real from payments table)
        if (app.status === 'approved') {
          notifications.push({
            id: `payment-${app.id}`,
            type: 'payment',
            icon: Bell,
            title: 'Payment Due Soon',
            description: `Your ${getLoanTitle(app.loan_purpose).toLowerCase()} payment is due soon`,
            urgent: true,
            action: 'Pay Now',
            actionColor: 'bg-red-600',
            actionClick: () => navigate('/dashboard/loans')
          });
        }

        // Document requirements
        if (!app.documents_completed) {
          notifications.push({
            id: `docs-${app.id}`,
            type: 'document',
            icon: FileText,
            title: 'Document Required',
            description: `Please upload required documents for ${getLoanTitle(app.loan_purpose)}`,
            urgent: false,
            action: 'Upload',
            actionColor: 'bg-blue-600',
            actionClick: () => navigate('/dashboard/loans')
          });
        }

        // ESG compliance
        if (!app.esg_completed) {
          notifications.push({
            id: `esg-${app.id}`,
            type: 'document',
            icon: FileText,
            title: 'ESG Assessment Pending',
            description: `Complete your ESG assessment for ${getLoanTitle(app.loan_purpose)}`,
            urgent: false,
            action: 'Complete',
            actionColor: 'bg-green-600',
            actionClick: () => navigate('/dashboard/loans')
          });
        }

        // Approval notifications
        if (app.status === 'approved' && app.ai_decision) {
          notifications.push({
            id: `approved-${app.id}`,
            type: 'approval',
            icon: CheckCircle,
            title: 'Loan Approved!',
            description: `Congratulations! Your ${getLoanTitle(app.loan_purpose).toLowerCase()} has been approved.`,
            urgent: false,
            action: 'View Details',
            actionColor: 'bg-green-600',
            actionClick: () => navigate('/dashboard/loans')
          });
        }

        // Profile completion reminder
        if (!user.profileComplete) {
          notifications.push({
            id: 'profile-incomplete',
            type: 'profile',
            icon: AlertTriangle,
            title: 'Profile Incomplete',
            description: 'Complete your profile to improve your credit score by up to 50 points',
            urgent: false,
            action: 'Complete',
            actionColor: 'bg-amber-600',
            actionClick: () => navigate('/dashboard/profile')
          });
        }
      });

      // Limit to most recent/important notifications
      setNotifications(notifications.slice(0, 4));

    } catch (error) {
      console.error('Error generating notifications:', error);
      setNotifications([]);
    }
  };

  const loadUpcomingPayments = async () => {
    // This would typically come from a payments or schedules table
    // For now, simulate based on approved loans
    try {
      const { data: approvedLoans, error } = await supabase
        .from('preloan_applications')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      if (error) throw error;

      const payments = approvedLoans?.map(loan => ({
        id: loan.id,
        amount: calculateMonthlyPayment(loan.loan_amount, loan.loan_tenor_months),
        loanType: getLoanTitle(loan.loan_purpose),
        dueDate: getNextPaymentDate(loan.created_at, loan.repayment_frequency),
        status: 'upcoming'
      })) || [];

      setUpcomingPayments(payments.slice(0, 1)); // Show only next payment

    } catch (error) {
      console.error('Error loading payments:', error);
      setUpcomingPayments([]);
    }
  };

  // Helper functions
  const getLoanTitle = (purpose) => {
    const titles = {
      'working_capital': 'Working Capital Loan',
      'business_expansion': 'Business Expansion Loan',
      'purchase_equipment_vehicle': 'Equipment Purchase Loan',
      'purchase_inventory': 'Inventory Financing',
      'emergency_expenses': 'Emergency Loan',
      'home_improvement': 'Home Improvement Loan',
      'education': 'Education Loan',
      'medical_expenses': 'Medical Loan',
      'debt_consolidation': 'Debt Consolidation',
      'others': 'Personal Loan'
    };
    return titles[purpose] || 'Loan Application';
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-amber-100 text-amber-800',
      'under_review': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'completed': 'bg-slate-100 text-slate-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateMonthlyPayment = (principal, months) => {
    // Simple calculation - in real app would include interest rates
    const rate = 0.10 / 12; // 10% annual rate
    const payment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return Math.round(payment);
  };

  const getNextPaymentDate = (startDate, frequency) => {
    const start = new Date(startDate);
    const next = new Date(start);
    
    if (frequency === 'monthly') {
      next.setMonth(next.getMonth() + 1);
    } else if (frequency === 'weekly') {
      next.setDate(next.getDate() + 7);
    }
    
    return next.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <span className="ml-2 text-slate-600">Loading your dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-amber-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.profile?.first_name || 'User'}!</h1>
        <p className="opacity-90 mt-1">
          Here's what's happening with your financial journey today.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={action.onClick}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-slate-900 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-slate-600">{action.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Messages and Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Messages and Updates */}
          {notifications.length > 0 && (
            <Card>
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Messages & Updates</h3>
                <p className="text-sm text-slate-600">Important notifications and reminders</p>
              </div>
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div key={notification.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'payment' ? 'bg-red-100' :
                          notification.type === 'document' ? 'bg-blue-100' :
                          notification.type === 'approval' ? 'bg-green-100' :
                          'bg-amber-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            notification.type === 'payment' ? 'text-red-600' :
                            notification.type === 'document' ? 'text-blue-600' :
                            notification.type === 'approval' ? 'text-green-600' :
                            'text-amber-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-slate-900">{notification.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">{notification.description}</p>
                            </div>
                            {notification.urgent && (
                              <Badge variant="destructive" className="ml-2">Urgent</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              className={notification.actionColor}
                              onClick={notification.actionClick}
                            >
                              {notification.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Recent Applications */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Recent Applications</h3>
                  <p className="text-sm text-slate-600">Track your loan application progress</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/dashboard/loans')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {recentApplications.length > 0 ? recentApplications.map((application) => (
                <div key={application.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-slate-900">
                        {getLoanTitle(application.loan_purpose)}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {formatCurrency(application.loan_amount)} • 
                        Applied {new Date(application.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-slate-600">
                        ID: {application.id}
                      </p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status?.replace('_', ' ')?.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {application.ai_decision && (
                    <div className="bg-slate-50 rounded p-3 mt-2">
                      <p className="text-sm font-medium">AI Assessment: {application.ai_decision}</p>
                      {application.ai_confidence && (
                        <p className="text-xs text-slate-600">
                          Confidence: {Math.round(application.ai_confidence * 100)}%
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No applications yet</p>
                  <Button 
                    className="mt-3"
                    onClick={() => navigate('/application')}
                  >
                    Apply for Your First Loan
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Payments and Summary */}
        <div className="space-y-6">
          {/* Next Payment */}
          {upcomingPayments.length > 0 && (
            <Card>
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Next Payment</h3>
              </div>
              <div className="p-4">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id}>
                    <div className="text-right mb-2">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-sm text-slate-600">{payment.loanType}</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Due Date:</span>
                        <span className="font-medium">{payment.dueDate}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Make Payment
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Payment Summary */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Your Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Applications:</span>
                <span className="font-medium">{userStats.totalApplications}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Active Loans:</span>
                <span className="font-medium text-green-600">{userStats.activeLoans}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Borrowed:</span>
                <span className="font-medium">{formatCurrency(userStats.totalBorrowed)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">On-time Rate:</span>
                <span className="font-medium text-green-600">100%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;