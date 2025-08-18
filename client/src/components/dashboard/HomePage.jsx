// client/src/components/dashboard/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Quick action cards
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
    },
    {
      icon: Eye,
      title: 'Check Credit Score',
      description: 'View your AI credit score',
      color: 'bg-indigo-600',
      onClick: () => navigate('/dashboard/portfolio')
    }
  ];

  // Payment reminders and messages
  const messages = [
    {
      id: 1,
      type: 'payment',
      icon: Bell,
      title: 'Payment Due Soon',
      description: 'Your equipment loan payment of ₱2,500 is due on March 15, 2025',
      urgent: true,
      action: 'Pay Now',
      actionColor: 'bg-red-600'
    },
    {
      id: 2,
      type: 'document',
      icon: FileText,
      title: 'Document Required',
      description: 'Please upload your latest bank statement for loan #LN-2024-012',
      urgent: false,
      action: 'Upload',
      actionColor: 'bg-blue-600'
    },
    {
      id: 3,
      type: 'approval',
      icon: CheckCircle,
      title: 'Loan Approved!',
      description: 'Congratulations! Your business expansion loan has been approved.',
      urgent: false,
      action: 'View Details',
      actionColor: 'bg-green-600'
    },
    {
      id: 4,
      type: 'reminder',
      icon: AlertTriangle,
      title: 'Profile Incomplete',
      description: 'Complete your profile to increase your credit score by up to 50 points',
      urgent: false,
      action: 'Complete',
      actionColor: 'bg-amber-600'
    }
  ];

  // Recent loan applications
  const recentApplications = [
    {
      id: 'APP-2025-001',
      title: 'Business Expansion Loan',
      amount: '₱50,000',
      date: '2 days ago',
      status: 'Under Review',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'LN-2024-012',
      title: 'Equipment Purchase',
      amount: '₱25,000',
      date: '1 week ago',
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'LN-2024-008',
      title: 'Working Capital',
      amount: '₱15,000',
      date: '2 weeks ago',
      status: 'Pending Documents',
      statusColor: 'bg-amber-100 text-amber-800'
    }
  ];

  // Payment status overview
  const paymentOverview = {
    nextPayment: {
      amount: '₱2,500',
      dueDate: 'March 15, 2025',
      loanName: 'Equipment Loan'
    },
    monthlyTotal: '₱3,700',
    onTimeRate: '100%',
    overdueAmount: '₱0'
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 to-amber-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="opacity-90">Here's what's happening with your financial journey today.</p>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                onClick={action.onClick}
                className="group cursor-pointer"
              >
                <div className="text-center p-4 bg-white rounded-lg border-2 border-transparent hover:border-red-200 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
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
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Messages & Updates</h3>
              <p className="text-sm text-slate-600">Important notifications and reminders</p>
            </div>
            <div className="divide-y divide-slate-100">
              {messages.map((message) => {
                const Icon = message.icon;
                return (
                  <div key={message.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        message.type === 'payment' ? 'bg-red-100' :
                        message.type === 'document' ? 'bg-blue-100' :
                        message.type === 'approval' ? 'bg-green-100' :
                        'bg-amber-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          message.type === 'payment' ? 'text-red-600' :
                          message.type === 'document' ? 'text-blue-600' :
                          message.type === 'approval' ? 'text-green-600' :
                          'text-amber-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-slate-900">{message.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{message.description}</p>
                          </div>
                          <Button
                            size="sm"
                            className={`${message.actionColor} hover:opacity-90 text-white`}
                          >
                            {message.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Applications */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Recent Applications</h3>
              <p className="text-sm text-slate-600">Track your loan application progress</p>
            </div>
            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <div key={app.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-slate-900">{app.title}</h4>
                    <p className="text-sm text-slate-600">{app.amount} • Applied {app.date}</p>
                    <p className="text-xs text-slate-500">ID: {app.id}</p>
                  </div>
                  <Badge className={app.statusColor}>
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/dashboard/loans')}
              >
                View All Applications
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Payment Status */}
        <div className="space-y-6">
          {/* Next Payment */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Next Payment</h3>
            </div>
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {paymentOverview.nextPayment.amount}
                </div>
                <div className="text-sm text-slate-600">
                  {paymentOverview.nextPayment.loanName}
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Due Date:</span>
                  <span className="font-medium">{paymentOverview.nextPayment.dueDate}</span>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90">
                <CreditCard className="w-4 h-4 mr-2" />
                Make Payment
              </Button>
            </div>
          </Card>

          {/* Payment Summary */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Payment Summary</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Total:</span>
                <span className="font-semibold">{paymentOverview.monthlyTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">On-time Rate:</span>
                <span className="font-semibold text-green-600">{paymentOverview.onTimeRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Overdue Amount:</span>
                <span className="font-semibold text-green-600">{paymentOverview.overdueAmount}</span>
              </div>
            </div>
          </Card>

          {/* Credit Score Widget */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">AI Credit Score</h3>
            </div>
            <div className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">750</div>
              <div className="text-sm text-slate-600 mb-4">Excellent</div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/dashboard/portfolio')}
              >
                View Details
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;