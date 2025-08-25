// client/src/components/dashboard/ChatbotPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Bot, 
  User,
  Lightbulb,
  DollarSign,
  TrendingUp,
  FileText,
  CreditCard,
  MessageCircle,
  RotateCcw
} from 'lucide-react';

const ChatbotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${user?.firstName || 'there'}! I'm your SikAP Finance Coach, powered by Microsoft Copilot Studio. I'm here to help you with:

🎯 **Loan Guidance** - Application tips, requirements, and process
💰 **Credit Score Improvement** - Strategies to boost your score
📊 **Financial Planning** - Budgeting and saving advice
🏢 **Business Growth** - Tips for micro-entrepreneurs
📋 **App Navigation** - Help using SikAP features

What would you like to explore today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick topic suggestions
  const quickTopics = [
    {
      icon: CreditCard,
      title: 'Improve Credit Score',
      description: 'How to boost my credit rating',
      message: 'How can I improve my credit score to get better loan terms?'
    },
    {
      icon: FileText,
      title: 'Loan Requirements',
      description: 'What documents do I need',
      message: 'What documents do I need for a loan application?'
    },
    {
      icon: DollarSign,
      title: 'Loan Calculator',
      description: 'Calculate monthly payments',
      message: 'Help me calculate loan payments and understand interest rates'
    },
    {
      icon: TrendingUp,
      title: 'Business Growth',
      description: 'Tips for entrepreneurs',
      message: 'What are some tips for growing my small business?'
    },
    {
      icon: Lightbulb,
      title: 'Financial Tips',
      description: 'Money management advice',
      message: 'Give me some financial planning tips for better money management'
    },
    {
      icon: MessageCircle,
      title: 'App Help',
      description: 'Navigate SikAP features',
      message: 'How do I use the SikAP app features like portfolio and loan management?'
    }
  ];

  // Pre-defined responses for common questions
  const botResponses = {
    'credit score': {
      keywords: ['credit', 'score', 'rating', 'improve', 'boost'],
      response: `Great question! Here's how to improve your credit score:

🎯 **Immediate Actions:**
• Make all loan payments on time (35% of your score)
• Keep credit utilization below 30%
• Connect more e-wallets (GCash, Maya) for transaction history
• Complete your SikAP profile fully

📈 **Long-term Strategies:**
• Maintain consistent income patterns
• Add more valuable assets to your portfolio
• Build a longer credit history (be patient!)
• Diversify your income sources

💡 **SikAP Specific Tips:**
• Your current score: 750 (Excellent!)
• Upload bank statements regularly
• Keep asset declarations updated
• Use our Finance Coach regularly 😊

Would you like specific advice for your business type or current financial situation?`
    },
    'documents': {
      keywords: ['document', 'requirement', 'need', 'submit', 'upload'],
      response: `Here are the documents typically needed for SikAP loans:

📋 **Essential Documents:**
• 2 Valid Government IDs (Driver's License, Passport, etc.)
• Proof of Income (Bank statements, e-wallet history)
• Barangay Certificate or Utility Bill (address proof)

🏢 **For Business Loans:**
• Business Registration (DTI, SEC, or Barangay permit)
• Business Financial Records (3-6 months)
• Business Tax Returns (if applicable)

📱 **Alternative Data (SikAP Special!):**
• E-wallet transaction history (GCash, Maya)
• Social media business profiles
• Customer testimonials or reviews

📦 **For Asset-backed Loans:**
• Asset documents (OR/CR for vehicles, receipts for equipment)
• Asset photos and condition reports
• Insurance documents (if applicable)

💡 **Pro Tip:** Don't have all traditional documents? No problem! SikAP specializes in alternative data. Our AI can assess your creditworthiness using your digital footprint.

Need help uploading documents? I can guide you through the process!`
    },
    'loan calculator': {
      keywords: ['calculate', 'payment', 'interest', 'monthly', 'amount'],
      response: `Let me help you understand loan calculations:

🧮 **Basic Loan Formula:**
Monthly Payment = [Principal × Rate × (1+Rate)^Months] / [(1+Rate)^Months - 1]

💰 **Example Calculations:**
**₱50,000 at 12% annual for 12 months:**
• Monthly Payment: ≈ ₱4,442
• Total Interest: ≈ ₱3,304
• Total Amount: ≈ ₱53,304

**₱25,000 at 10% annual for 18 months:**
• Monthly Payment: ≈ ₱1,551
• Total Interest: ≈ ₱2,918
• Total Amount: ≈ ₱27,918

📊 **Factors Affecting Your Rate:**
• Credit Score (yours is excellent at 750!)
• Asset coverage ratio
• Business income stability
• Payment history

💡 **SikAP Advantage:**
• Rates typically 8-15% annually
• No hidden fees
• Flexible payment options
• Early payment discounts available

Want me to calculate payments for a specific amount you're considering?`
    },
    'business growth': {
      keywords: ['business', 'grow', 'entrepreneur', 'income', 'sales'],
      response: `Here are proven strategies for Filipino micro-entrepreneurs:

🚀 **Digital Transformation:**
• Set up Facebook/Instagram business pages
• Join Shopee, Lazada as a seller
• Use GCash/Maya for digital payments
• Create simple website or Google My Business

💰 **Financial Management:**
• Separate business and personal finances
• Track daily sales and expenses
• Build emergency fund (3-6 months expenses)
• Reinvest profits strategically

🤝 **Customer Growth:**
• Focus on excellent customer service
• Ask for reviews and testimonials
• Implement referral rewards
• Join local business groups/cooperatives

📈 **Expansion Ideas:**
• Add complementary products/services
• Partner with other local businesses
• Consider franchising successful models
• Explore B2B opportunities

💡 **SikAP Support:**
• Use business growth loans wisely
• Leverage your good credit score (750!)
• Consider equipment financing
• Track ROI on borrowed funds

What type of business do you run? I can give more specific advice!`
    },
    'financial tips': {
      keywords: ['financial', 'money', 'budget', 'save', 'plan'],
      response: `Here's my financial wisdom for you:

💰 **Budgeting Basics (50/30/20 Rule):**
• 50% - Needs (rent, food, utilities)
• 30% - Wants (entertainment, dining out)
• 20% - Savings & debt payments

📊 **Building Wealth:**
• Pay yourself first (save before spending)
• Automate savings (₱500-1000/month minimum)
• Invest in your business growth
• Build multiple income streams

🎯 **Debt Management:**
• Pay high-interest debts first
• Never miss loan payments (ruins credit score)
• Consider debt consolidation if needed
• Use loans for income-generating purposes

🏢 **For Entrepreneurs:**
• Keep 6 months of expenses as emergency fund
• Separate business and personal accounts
• Track all business expenses for tax purposes
• Reinvest profits to grow faster

💡 **SikAP Features to Help:**
• Use Portfolio page to track assets
• Monitor credit score monthly
• Set payment reminders
• Use our financial coaching regularly

Would you like help creating a specific budget or savings plan?`
    },
    'app help': {
      keywords: ['app', 'navigate', 'feature', 'use', 'portfolio', 'loan'],
      response: `Let me guide you through SikAP's powerful features:

🏠 **Dashboard Home:**
• View quick stats and notifications
• Access payment reminders
• See recent loan applications
• Quick actions for common tasks

💼 **Portfolio Section:**
• Track all your declared assets
• Monitor asset values over time
• View payment history
• Check performance metrics

💳 **Loans Management:**
• Manage active loans
• Make payments securely
• Upload required documents
• Track payment schedules

📍 **BanKo Agents:**
• Find nearby branches
• Get directions and contact info
• Check operating hours
• See available services

🤖 **Finance Coach (that's me!):**
• Get personalized financial advice
• Ask about loans and credit
• Learn about financial planning
• Get help navigating the app

💡 **Pro Tips:**
• Complete your profile for better credit scoring
• Connect all your e-wallets for comprehensive analysis
• Upload asset photos for faster processing
• Use the chat feature for instant help

What specific feature would you like help with?`
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.parentElement;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let bestMatch = null;
    let maxMatches = 0;

    for (const [category, data] of Object.entries(botResponses)) {
      const matches = data.keywords.filter(keyword => message.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = data.response;
      }
    }

    return bestMatch || `I understand you're asking about "${userMessage}". 

Here are some ways I can help you:

💡 **Popular Topics:**
• Credit score improvement strategies
• Loan application requirements and tips
• Business growth advice for entrepreneurs
• Financial planning and budgeting
• How to use SikAP app features

🎯 **Quick Actions:**
• Ask about specific loan amounts or terms
• Get help with document requirements
• Learn about improving your credit score
• Discuss business growth strategies

Could you be more specific about what you'd like to know? I'm here to help! 😊`;
  };

  const sendMessage = (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: findBestResponse(messageText),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const resetChat = () => {
    setMessages([messages[0]]); // Keep only the initial welcome message
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">AI Finance Coach</h1>
          <p className="text-slate-600">Your personal financial advisor powered by Microsoft Copilot Studio</p>
        </div>
        <Button 
          onClick={resetChat}
          variant="outline"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">SikAP Finance Coach</div>
                  <div className="text-sm opacity-90">Online • Ready to help with your financial goals</div>
                </div>
                <Badge className="bg-white/20 text-white ml-auto">
                  AI Powered
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-slate-500' 
                        : 'bg-gradient-to-r from-purple-600 to-blue-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <div className={`text-sm prose prose-sm max-w-none ${
                        message.type === 'user'
                          ? 'prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-ul:text-white/90 prose-li:text-white/90'
                          : 'prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-li:text-slate-700'
                      }`}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-white/70' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 rounded-lg bg-slate-100">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about loans, credit scores, financial planning, or app features..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={isTyping}
                />
                <Button 
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Topics Sidebar */}
        <div className="space-y-4">
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Quick Topics</h3>
              <p className="text-sm text-slate-600">Click to start a conversation</p>
            </div>
            <div className="p-4 space-y-3">
              {quickTopics.map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <button
                    key={index}
                    onClick={() => sendMessage(topic.message)}
                    className="w-full text-left p-3 border border-slate-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <Icon className="w-4 h-4 text-slate-600 group-hover:text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{topic.title}</div>
                        <div className="text-xs text-slate-600">{topic.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* User Stats */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Your Financial Profile</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Credit Score</span>
                <span className="font-semibold text-green-600">750</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Active Loans</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Assets</span>
                <span className="font-semibold">₱120,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Payment History</span>
                <span className="font-semibold text-green-600">100%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;