// client/src/components/dashboard/LoansPage.jsx
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CreditCard, 
  Upload, 
  Download,
  FileText, 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Eye,
  Send,
  Bot,
  User,
  X
} from 'lucide-react';

const LoansPage = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hi! I'm here to help you with your loans. You can ask me about payments, documents, or any loan-related questions.",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Active loans data
  const loans = [
    {
      id: 'LN-2024-012',
      title: 'Equipment Purchase Loan',
      principal: 25000,
      outstanding: 18750,
      monthlyPayment: 2500,
      nextDueDate: '2025-03-15',
      interestRate: 12,
      status: 'Active',
      statusColor: 'bg-green-100 text-green-800',
      paymentsRemaining: 8,
      totalPayments: 12,
      lastPayment: '2025-02-15',
      paymentMethod: 'GCash',
      documents: [
        { name: 'Loan Agreement', status: 'Complete', date: '2024-02-01' },
        { name: 'Insurance Policy', status: 'Complete', date: '2024-02-01' },
        { name: 'Collateral Docs', status: 'Complete', date: '2024-02-01' }
      ]
    },
    {
      id: 'LN-2024-008',
      title: 'Working Capital Loan',
      principal: 15000,
      outstanding: 12000,
      monthlyPayment: 1200,
      nextDueDate: '2025-03-20',
      interestRate: 10,
      status: 'Pending Documents',
      statusColor: 'bg-amber-100 text-amber-800',
      paymentsRemaining: 10,
      totalPayments: 15,
      lastPayment: '2025-02-20',
      paymentMethod: 'Bank Transfer',
      requiredDocuments: ['Updated Bank Statement', 'Business Permit Renewal'],
      alert: 'Please upload your latest bank statement to continue loan processing.',
      documents: [
        { name: 'Loan Agreement', status: 'Complete', date: '2024-01-15' },
        { name: 'Bank Statement', status: 'Required', date: null },
        { name: 'Business Permit', status: 'Expired', date: '2024-01-15' }
      ]
    },
    {
      id: 'APP-2025-001',
      title: 'Business Expansion Loan',
      principal: 50000,
      status: 'Under Review',
      statusColor: 'bg-blue-100 text-blue-800',
      applicationDate: '2025-02-10',
      expectedDecision: '2025-03-01',
      documents: [
        { name: 'Application Form', status: 'Complete', date: '2025-02-10' },
        { name: 'Financial Statements', status: 'Under Review', date: '2025-02-10' },
        { name: 'Business Plan', status: 'Complete', date: '2025-02-10' }
      ]
    }
  ];

  const handleMakePayment = (loanId) => {
    console.log('Make payment for loan:', loanId);
    // Implement payment logic
  };

  const handleUploadDocument = (loanId) => {
    console.log('Upload document for loan:', loanId);
    // Implement document upload logic
  };

  const handleDownloadStatement = (loanId) => {
    console.log('Download statement for loan:', loanId);
    // Implement download logic
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message: newMessage,
      timestamp: new Date()
    };

    setChatMessages([...chatMessages, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: chatMessages.length + 2,
        type: 'bot',
        message: getBotResponse(newMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('payment') || msg.includes('pay')) {
      return "For payments, you can use GCash, Maya, or bank transfer. Your next payment is ₱2,500 due on March 15. Would you like me to guide you through making a payment?";
    } else if (msg.includes('document') || msg.includes('upload')) {
      return "I can help you with document uploads. For loan LN-2024-008, you need to upload an updated bank statement. Click the upload button and select your PDF file.";
    } else if (msg.includes('status') || msg.includes('application')) {
      return "Your loan LN-2024-012 is active with ₱18,750 remaining. Your business expansion application is under review with a decision expected by March 1.";
    } else {
      return "I can help you with loan payments, document uploads, payment schedules, and loan status questions. What would you like to know?";
    }
  };

  const formatCurrency = (amount) => {
    return `₱${amount.toLocaleString()}`;
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Required': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Expired': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Loan Management</h1>
          <p className="text-slate-600">Manage payments, documents, and track your loan progress</p>
        </div>
        <Button 
          onClick={() => setShowChatbot(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Loan Assistant
        </Button>
      </div>

      {/* Loans List */}
      <div className="space-y-6">
        {loans.map((loan) => (
          <Card key={loan.id} className="overflow-hidden">
            {/* Loan Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">{loan.title}</h3>
                  <p className="text-sm text-slate-600">Loan ID: {loan.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-red-600 mb-1">
                    {formatCurrency(loan.principal)}
                  </div>
                  <Badge className={loan.statusColor}>
                    {loan.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Alert Messages */}
            {loan.alert && (
              <div className="p-4 bg-amber-50 border-l-4 border-amber-400">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-amber-900">Action Required</div>
                    <div className="text-sm text-amber-700">{loan.alert}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Loan Details Grid */}
            {loan.outstanding && (
              <div className="p-6 border-b border-slate-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-600 uppercase font-medium mb-1">Outstanding</div>
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(loan.outstanding)}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-600 uppercase font-medium mb-1">Monthly Payment</div>
                    <div className="text-lg font-bold text-slate-900">{formatCurrency(loan.monthlyPayment)}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-600 uppercase font-medium mb-1">Next Due</div>
                    <div className="text-lg font-bold text-slate-900">{loan.nextDueDate}</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-600 uppercase font-medium mb-1">Interest Rate</div>
                    <div className="text-lg font-bold text-slate-900">{loan.interestRate}%</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Payment Progress</span>
                    <span>{loan.totalPayments - loan.paymentsRemaining} of {loan.totalPayments} payments</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full"
                      style={{width: `${((loan.totalPayments - loan.paymentsRemaining) / loan.totalPayments) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div className="p-6 border-b border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loan.documents.map((doc, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{doc.name}</div>
                      {doc.date && (
                        <div className="text-xs text-slate-600">{doc.date}</div>
                      )}
                    </div>
                    <Badge className={getDocumentStatusColor(doc.status)} size="sm">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {loan.outstanding && (
                  <Button
                    onClick={() => handleMakePayment(loan.id)}
                    className="bg-gradient-to-r from-red-600 to-amber-500 hover:opacity-90"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Make Payment
                  </Button>
                )}
                
                {(loan.status === 'Pending Documents' || loan.requiredDocuments) && (
                  <Button
                    onClick={() => handleUploadDocument(loan.id)}
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Button>
                )}
                
                {loan.outstanding && (
                  <Button
                    onClick={() => handleDownloadStatement(loan.id)}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Statement
                  </Button>
                )}
                
                <Button
                  onClick={() => setShowChatbot(true)}
                  variant="outline"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get Help
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Integrated Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Loan Assistant</div>
                    <div className="text-sm opacity-90">Here to help with your loans</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChatbot(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <div className="text-sm">{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Ask about payments, documents, or loan status..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={sendChatMessage} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;