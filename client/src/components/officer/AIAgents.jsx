// components/AIAgents.jsx - AI Agents Management (Complete)
import React, { useState } from 'react';
import { 
  RefreshCw, AlertCircle, CheckCircle, Clock, Play, Pause, 
  Settings, BarChart3, Zap, Brain, Shield, Leaf, FileCheck,
  TrendingUp, TrendingDown, Activity, Download, XCircle
} from 'lucide-react';

const AIAgents = ({ triggerWebhook, sendToAgent }) => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);
  
  const aiAgents = [
    {
      id: 'credit-scoring',
      name: 'Credit Scoring Agent',
      status: 'active',
      processed: 234,
      avgTime: '2.3s',
      accuracy: '94.2%',
      uptime: '99.8%',
      webhook: '/webhook/credit-scoring-agent',
      description: 'Analyzes borrower creditworthiness using alternative data sources',
      icon: BarChart3,
      color: 'blue',
      lastProcessed: '2025-03-15 14:30:22',
      queueSize: 12,
      successRate: '96.8%',
      errorRate: '0.8%',
      avgConfidence: '89.2%',
      capabilities: [
        'Alternative credit scoring',
        'E-wallet transaction analysis', 
        'Social media business verification',
        'Payment history assessment'
      ],
      configOptions: {
        confidenceThreshold: 85,
        dataWeighting: {
          transactionHistory: 40,
          socialMediaVerification: 25,
          traditionalCredit: 35
        },
        riskCategories: ['low', 'medium', 'high']
      }
    },
    {
      id: 'esg-assessment',
      name: 'ESG Assessment Agent',
      status: 'active',
      processed: 189,
      avgTime: '4.1s',
      accuracy: '91.7%',
      uptime: '98.5%',
      webhook: '/webhook/esg-assessment-agent',
      description: 'Evaluates environmental, social, and governance impact',
      icon: Leaf,
      color: 'green',
      lastProcessed: '2025-03-15 14:28:15',
      queueSize: 8,
      successRate: '94.2%',
      errorRate: '1.2%',
      avgConfidence: '87.5%',
      capabilities: [
        'Environmental impact scoring',
        'Social responsibility assessment',
        'Governance compliance check',
        'Sustainability metrics analysis'
      ],
      configOptions: {
        minimumESGScore: 60,
        categoryWeights: {
          environmental: 40,
          social: 35,
          governance: 25
        },
        sustainabilityFactors: ['renewable_energy', 'waste_reduction', 'community_impact']
      }
    },
    {
      id: 'asset-valuation',
      name: 'Asset Valuation Agent',
      status: 'active',
      processed: 156,
      avgTime: '3.8s',
      accuracy: '88.9%',
      uptime: '99.2%',
      webhook: '/webhook/asset-valuation-agent',
      description: 'Assesses collateral value and market conditions',
      icon: Shield,
      color: 'purple',
      lastProcessed: '2025-03-15 14:25:45',
      queueSize: 5,
      successRate: '92.1%',
      errorRate: '2.1%',
      avgConfidence: '85.7%',
      capabilities: [
        'Real-time asset valuation',
        'Market price comparison',
        'Depreciation analysis',
        'Collateral risk assessment'
      ],
      configOptions: {
        valuationMethods: ['market', 'depreciation', 'replacement'],
        marketDataSources: ['local', 'online', 'dealer'],
        depreciationRates: {
          vehicles: 15,
          equipment: 10,
          electronics: 20
        }
      }
    },
    {
      id: 'document-verification',
      name: 'Document Verification Agent',
      status: 'maintenance',
      processed: 298,
      avgTime: '1.9s',
      accuracy: '96.5%',
      uptime: '97.8%',
      webhook: '/webhook/document-verification-agent',
      description: 'Verifies document authenticity and extracts key information',
      icon: FileCheck,
      color: 'amber',
      lastProcessed: '2025-03-15 13:45:12',
      queueSize: 0,
      successRate: '98.1%',
      errorRate: '0.5%',
      avgConfidence: '93.8%',
      capabilities: [
        'OCR text extraction',
        'Document authenticity verification',
        'Data validation',
        'Fraud detection'
      ],
      configOptions: {
        ocrAccuracy: 95,
        supportedFormats: ['PDF', 'JPG', 'PNG'],
        verificationMethods: ['watermark', 'signature', 'metadata'],
        fraudDetectionSensitivity: 'high'
      }
    }
  ];

  const systemMetrics = {
    totalProcessed: 877,
    avgProcessingTime: '2.8s',
    systemUptime: '99.1%',
    totalErrors: 12,
    activeQueues: 25,
    successRate: '95.2%'
  };

  const recentLogs = [
    {
      timestamp: '2025-03-15 14:32:15',
      agent: 'Credit Scoring Agent',
      action: 'Processing loan LN-2025-001',
      status: 'in_progress',
      details: 'Alternative credit analysis initiated'
    },
    {
      timestamp: '2025-03-15 14:31:48',
      agent: 'ESG Assessment Agent',
      action: 'Completed assessment LN-2025-002',
      status: 'completed',
      details: 'ESG score: 72/100 - Good sustainability practices'
    },
    {
      timestamp: '2025-03-15 14:31:22',
      agent: 'Asset Valuation Agent',
      action: 'Valuating collateral LN-2025-003',
      status: 'completed',
      details: 'Equipment value confirmed: ₱180,000'
    },
    {
      timestamp: '2025-03-15 14:30:55',
      agent: 'Document Verification Agent',
      action: 'Document verification failed LN-2025-004',
      status: 'error',
      details: 'Invalid business permit - signature mismatch'
    },
    {
      timestamp: '2025-03-15 14:30:22',
      agent: 'Credit Scoring Agent',
      action: 'Credit score calculated LN-2025-005',
      status: 'completed',
      details: 'Credit score: 680 - Medium risk classification'
    }
  ];

  const integrationGuide = {
    webhooks: [
      { 
        endpoint: 'POST /webhook/credit-scoring-agent', 
        description: 'Trigger credit analysis',
        expectedResponse: '{ "creditScore": 680, "riskLevel": "medium", "confidence": 0.89 }'
      },
      { 
        endpoint: 'POST /webhook/esg-assessment-agent', 
        description: 'Start ESG evaluation',
        expectedResponse: '{ "esgScore": 72, "breakdown": { "E": 75, "S": 70, "G": 71 } }'
      },
      { 
        endpoint: 'POST /webhook/asset-valuation-agent', 
        description: 'Initiate asset assessment',
        expectedResponse: '{ "assetValue": 180000, "marketPrice": 200000, "depreciation": 10 }'
      },
      { 
        endpoint: 'POST /webhook/document-verification-agent', 
        description: 'Begin document verification',
        expectedResponse: '{ "isValid": true, "extractedData": {...}, "confidence": 0.95 }'
      }
    ],
    payloadExample: `{
  "loanId": "LN-2025-001",
  "action": "process",
  "priority": "high",
  "data": {
    "borrowerData": {
      "name": "Maria Santos",
      "business": "Maria's Bakery",
      "income": 45000,
      "businessAge": "3 years"
    },
    "documents": [
      {
        "type": "bank_statement",
        "url": "https://storage.com/bank_statements.pdf",
        "uploadDate": "2025-03-15"
      },
      {
        "type": "business_permit", 
        "url": "https://storage.com/business_permit.pdf",
        "uploadDate": "2025-03-15"
      }
    ],
    "assets": [
      {
        "type": "equipment",
        "description": "Commercial oven",
        "purchasePrice": 50000,
        "purchaseDate": "2023-01-15"
      }
    ],
    "metadata": {
      "officer": "john.reyes@sikap.com",
      "branch": "Pasig",
      "submissionTime": "2025-03-15T14:30:00Z"
    }
  }
}`,
    responseExample: `{
  "loanId": "LN-2025-001",
  "agentType": "credit-scoring",
  "status": "completed",
  "timestamp": "2025-03-15T14:32:15Z",
  "results": {
    "creditScore": 680,
    "riskLevel": "medium",
    "confidence": 0.89,
    "breakdown": {
      "transactionHistory": 0.85,
      "socialMediaVerification": 0.92,
      "traditionalCredit": 0.75
    },
    "recommendations": [
      "Request additional income verification",
      "Monitor payment behavior for 6 months"
    ]
  },
  "processingTime": "2.3s",
  "nextSteps": ["esg-assessment", "asset-valuation"]
}`
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      maintenance: 'bg-amber-100 text-amber-800',
      error: 'bg-red-100 text-red-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircle,
      maintenance: Clock,
      error: AlertCircle,
      inactive: Pause
    };
    return icons[status] || Pause;
  };

  const handleAgentAction = (action, agent) => {
    switch (action) {
      case 'start':
        triggerWebhook('agent-control', { agentId: agent.id, action: 'start' });
        break;
      case 'stop':
        triggerWebhook('agent-control', { agentId: agent.id, action: 'stop' });
        break;
      case 'restart':
        triggerWebhook('agent-control', { agentId: agent.id, action: 'restart' });
        break;
      case 'configure':
        setSelectedAgent(agent);
        setShowConfig(true);
        break;
      case 'logs':
        triggerWebhook('agent-logs', { agentId: agent.id });
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    const activeAgents = aiAgents.filter(agent => agent.status === 'active').map(agent => agent.id);
    triggerWebhook('bulk-agent-action', { action, agentIds: activeAgents });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">AI Agents Management</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => handleBulkAction('health_check')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Health Check All
            </button>
            <button 
              onClick={() => triggerWebhook('configure-agents', { action: 'open_config' })}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Global Settings
            </button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemMetrics.totalProcessed}</div>
              <div className="text-sm text-blue-700">Total Processed</div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemMetrics.successRate}</div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{systemMetrics.avgProcessingTime}</div>
              <div className="text-sm text-purple-700">Avg Processing</div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{systemMetrics.systemUptime}</div>
              <div className="text-sm text-amber-700">System Uptime</div>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">{systemMetrics.activeQueues}</div>
              <div className="text-sm text-slate-700">Active Queues</div>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{systemMetrics.totalErrors}</div>
              <div className="text-sm text-red-700">Total Errors</div>
            </div>
          </div>
        </div>

        {/* Agent Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {aiAgents.map((agent, index) => {
            const Icon = agent.icon;
            const StatusIcon = getStatusIcon(agent.status);
            
            return (
              <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      agent.color === 'blue' ? 'bg-blue-100' :
                      agent.color === 'green' ? 'bg-green-100' :
                      agent.color === 'purple' ? 'bg-purple-100' :
                      'bg-amber-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        agent.color === 'blue' ? 'text-blue-600' :
                        agent.color === 'green' ? 'text-green-600' :
                        agent.color === 'purple' ? 'text-purple-600' :
                        'text-amber-600'
                      }`} />
                    </div>
                    <h3 className="font-medium text-slate-900 text-sm">{agent.name}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusIcon className="w-4 h-4 text-slate-400" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{agent.description}</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Processed:</span>
                    <span className="font-medium">{agent.processed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Avg Time:</span>
                    <span className="font-medium">{agent.avgTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Accuracy:</span>
                    <span className="font-medium text-green-600">{agent.accuracy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Queue:</span>
                    <span className="font-medium">{agent.queueSize}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <button 
                      onClick={() => triggerWebhook(agent.webhook, { test: true })}
                      className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Test
                    </button>
                    <button 
                      onClick={() => handleAgentAction('configure', agent)}
                      className="flex-1 px-2 py-1 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50"
                    >
                      Config
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {agent.status === 'active' ? (
                      <button 
                        onClick={() => handleAgentAction('stop', agent)}
                        className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 flex items-center justify-center gap-1"
                      >
                        <Pause className="w-3 h-3" />
                        Stop
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAgentAction('start', agent)}
                        className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        Start
                      </button>
                    )}
                    <button 
                      onClick={() => handleAgentAction('restart', agent)}
                      className="flex-1 px-2 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700 flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Restart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Agent Activity Monitor */}
        <div className="mb-8">
          <h3 className="font-medium text-slate-900 mb-4">Real-time Agent Activity</h3>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              SikAP AI Agents - Live Monitor
            </div>
            <div className="space-y-1 text-slate-300 max-h-40 overflow-y-auto">
              {recentLogs.map((log, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-xs">[{log.timestamp}] {log.agent}</span>
                  <span className={`text-xs ${
                    log.status === 'completed' ? 'text-green-400' :
                    log.status === 'in_progress' ? 'text-blue-400' :
                    log.status === 'error' ? 'text-red-400' :
                    'text-amber-400'
                  }`}>
                    {log.status === 'completed' ? '✓' : 
                     log.status === 'in_progress' ? '→' :
                     log.status === 'error' ? '✗' : '⚠'}
                    {log.action}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Live feed refreshes every 5 seconds
            </div>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="mb-8">
          <h3 className="font-medium text-slate-900 mb-4">Agent Performance Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">92.8%</div>
                <div className="text-sm text-green-700">Overall Success Rate</div>
                <div className="text-xs text-green-600 mt-1">↑ 1.2% this week</div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">2.8s</div>
                <div className="text-sm text-blue-700">Avg Processing Time</div>
                <div className="text-xs text-blue-600 mt-1">↓ 0.2s this week</div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">877</div>
                <div className="text-sm text-purple-700">Total Processed Today</div>
                <div className="text-xs text-purple-600 mt-1">↑ 23% from yesterday</div>
              </div>
            </div>
          </div>
        </div>

        {/* Webhook Integration Guide */}
        <div className="bg-slate-50 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-slate-900 mb-4">n8n Webhook Integration Guide</h3>
          <div className="space-y-6">
            {/* Available Webhooks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Available Webhooks:</h4>
                <div className="space-y-2 text-sm">
                  {integrationGuide.webhooks.map((webhook, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="font-mono text-xs text-blue-600 mb-1">{webhook.endpoint}</div>
                      <div className="text-slate-600 text-xs mb-2">{webhook.description}</div>
                      <div className="text-slate-500 text-xs font-mono bg-slate-50 p-2 rounded">
                        Response: {webhook.expectedResponse}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Example Payloads */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Request Payload Example:</h4>
                <div className="bg-white p-4 rounded border font-mono text-xs overflow-x-auto max-h-60">
                  <pre className="whitespace-pre-wrap">{integrationGuide.payloadExample}</pre>
                </div>
              </div>
            </div>
            
            {/* Response Example */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Response Example:</h4>
              <div className="bg-white p-4 rounded border font-mono text-xs overflow-x-auto max-h-60">
                <pre className="whitespace-pre-wrap">{integrationGuide.responseExample}</pre>
              </div>
            </div>
            
            {/* Integration Steps */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Quick Integration Steps:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    step: 1,
                    title: "Configure n8n Workflow",
                    description: "Set up HTTP Request nodes for each AI agent endpoint"
                  },
                  {
                    step: 2,
                    title: "Add Authentication",
                    description: "Include API keys and authentication headers"
                  },
                  {
                    step: 3,
                    title: "Set Webhook URLs",
                    description: "Configure webhook URLs in dashboard settings"
                  },
                  {
                    step: 4,
                    title: "Test Integration",
                    description: "Use Test buttons above to verify connectivity"
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-3 p-3 bg-white rounded border">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-900 text-sm">{item.title}</h5>
                      <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-slate-200">
          <h3 className="font-medium text-slate-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => triggerWebhook('batch-process', { action: 'process_all_pending' })}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Process All Pending
            </button>
            <button 
              onClick={() => handleBulkAction('health_check')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Health Check All
            </button>
            <button 
              onClick={() => handleBulkAction('restart_maintenance')}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
            >
              Restart Maintenance Agents
            </button>
            <button 
              onClick={() => triggerWebhook('clear-queues', { action: 'clear_all' })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Clear All Queues
            </button>
            <button 
              onClick={() => triggerWebhook('export-agent-logs', { timeRange: '24h' })}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Logs
            </button>
            <button 
              onClick={() => triggerWebhook('agent-diagnostics', { action: 'full_diagnostic' })}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm"
            >
              Run Diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* Agent Configuration Modal */}
      {showConfig && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  Configure {selectedAgent.name}
                </h3>
                <button 
                  onClick={() => setShowConfig(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Agent Info */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    selectedAgent.color === 'blue' ? 'bg-blue-100' :
                    selectedAgent.color === 'green' ? 'bg-green-100' :
                    selectedAgent.color === 'purple' ? 'bg-purple-100' :
                    'bg-amber-100'
                  }`}>
                    <selectedAgent.icon className={`w-5 h-5 ${
                      selectedAgent.color === 'blue' ? 'text-blue-600' :
                      selectedAgent.color === 'green' ? 'text-green-600' :
                      selectedAgent.color === 'purple' ? 'text-purple-600' :
                      'text-amber-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{selectedAgent.name}</h4>
                    <p className="text-sm text-slate-600">{selectedAgent.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Processed:</span>
                    <div className="font-medium">{selectedAgent.processed}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Accuracy:</span>
                    <div className="font-medium text-green-600">{selectedAgent.accuracy}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Uptime:</span>
                    <div className="font-medium">{selectedAgent.uptime}</div>
                  </div>
                  <div>
                    <span className="text-slate-600">Queue Size:</span>
                    <div className="font-medium">{selectedAgent.queueSize}</div>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Capabilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedAgent.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-700">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration Options */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Configuration Settings</h4>
                <div className="space-y-4">
                  {Object.entries(selectedAgent.configOptions).map(([key, value]) => (
                    <div key={key} className="border border-slate-200 rounded-lg p-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      {typeof value === 'number' ? (
                        <input
                          type="number"
                          defaultValue={value}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      ) : typeof value === 'object' ? (
                        <div className="space-y-2">
                          {Object.entries(value).map(([subKey, subValue]) => (
                            <div key={subKey} className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 capitalize">
                                {subKey.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <input
                                type="number"
                                defaultValue={subValue}
                                className="w-20 px-2 py-1 border border-slate-300 rounded text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      ) : Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-2">
                          {value.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          defaultValue={value}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => {
                    triggerWebhook('save-agent-config', { 
                      agentId: selectedAgent.id, 
                      config: selectedAgent.configOptions 
                    });
                    setShowConfig(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Configuration
                </button>
                <button 
                  onClick={() => triggerWebhook('reset-agent-config', { agentId: selectedAgent.id })}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Reset to Defaults
                </button>
                <button 
                  onClick={() => triggerWebhook('test-agent-config', { agentId: selectedAgent.id })}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Test Configuration
                </button>
                <button 
                  onClick={() => setShowConfig(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgents;