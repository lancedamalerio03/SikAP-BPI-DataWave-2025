// components/Settings.jsx - Settings Component
import React, { useState } from 'react';

const Settings = ({ triggerWebhook, sendToAgent }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [authToken, setAuthToken] = useState('');
  
  const notificationSettings = [
    { id: 'new_applications', label: 'New loan applications', enabled: true },
    { id: 'ai_completed', label: 'AI agent processing completed', enabled: true },
    { id: 'high_risk', label: 'High-risk applications', enabled: true },
    { id: 'system_alerts', label: 'System alerts and maintenance', enabled: false },
    { id: 'daily_summary', label: 'Daily summary reports', enabled: true }
  ];

  const handleSaveSettings = () => {
    const settings = {
      webhookUrl,
      authToken,
      notifications: notificationSettings
    };
    
    triggerWebhook('save-settings', settings);
    alert('Settings saved successfully!');
  };

  const handleTestConnection = () => {
    triggerWebhook('test-connection', { url: webhookUrl, token: authToken });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Dashboard Settings</h2>
      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Notification Preferences</h3>
          <div className="space-y-3">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-700">{setting.label}</span>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  setting.enabled ? 'bg-blue-600' : 'bg-slate-200'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    setting.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">AI Agent Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Auto-approval threshold</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                <option value="high">High confidence only (95%+)</option>
                <option value="medium">Medium confidence (85%+)</option>
                <option value="low">Low confidence (75%+)</option>
                <option value="disabled">Disabled - manual review required</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Risk assessment priority</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                <option value="balanced">Balanced approach</option>
                <option value="conservative">Conservative (lower risk tolerance)</option>
                <option value="aggressive">Aggressive (higher risk tolerance)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Webhook Configuration</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">n8n Webhook Base URL</label>
              <input
                type="url"
                placeholder="https://your-n8n-instance.com/webhook"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Authentication Token</label>
              <input
                type="password"
                placeholder="Enter your webhook authentication token"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
              />
            </div>
            <button 
              onClick={handleTestConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test Connection
            </button>
          </div>
        </div>

        {/* ESG Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">ESG Assessment Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Minimum ESG Score</label>
              <input
                type="number"
                min="0"
                max="100"
                defaultValue="60"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">ESG Weight in Decision</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                <option value="high">High (30%)</option>
                <option value="medium">Medium (20%)</option>
                <option value="low">Low (10%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Export Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Data Export & Reporting</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">Automatic daily reports</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">Include ESG metrics in reports</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">Export loan data to external systems</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-slate-200">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Security & Access Control</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Session timeout (minutes)</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Two-factor authentication</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="required">Required</option>
                  <option value="optional">Optional</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Allowed IP addresses (comma-separated)</label>
              <input
                type="text"
                placeholder="192.168.1.1, 10.0.0.1, ..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Performance & Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Data refresh interval</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Cache duration</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                <option value="300">5 minutes</option>
                <option value="900">15 minutes</option>
                <option value="1800">30 minutes</option>
                <option value="3600">1 hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">External Integrations</h3>
          <div className="space-y-3">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">Microsoft Copilot Studio</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Connected</span>
              </div>
              <p className="text-sm text-slate-600 mb-2">Integration with AI agents for loan processing</p>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Configure
              </button>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">BPI BanKo Core Banking</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Connected</span>
              </div>
              <p className="text-sm text-slate-600 mb-2">Core banking system integration</p>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Configure
              </button>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">Supabase Database</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Connected</span>
              </div>
              <p className="text-sm text-slate-600 mb-2">Application data storage and management</p>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Advanced Settings</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Custom CSS (for dashboard styling)</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg h-24 font-mono text-sm"
                placeholder="/* Custom CSS here */"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Custom JavaScript (for advanced functionality)</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg h-24 font-mono text-sm"
                placeholder="// Custom JavaScript here"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Backup & Recovery */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-900">Backup & Recovery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Automatic backup frequency</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <button 
                onClick={() => triggerWebhook('create-backup', { type: 'manual' })}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Manual Backup
              </button>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Backup retention period</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              <button 
                onClick={() => triggerWebhook('restore-backup', { action: 'list_backups' })}
                className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Restore from Backup
              </button>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex gap-3">
            <button 
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Settings
            </button>
            <button 
              onClick={() => triggerWebhook('reset-settings', { action: 'reset_to_defaults' })}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Reset to Defaults
            </button>
            <button 
              onClick={() => triggerWebhook('export-settings', { format: 'json' })}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Export Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;