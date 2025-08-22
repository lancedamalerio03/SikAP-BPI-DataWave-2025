// Updated DocumentUploadPortal.jsx with separate forms

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  CheckCircle, ArrowLeft, Clock, AlertCircle, FileText, 
  Leaf, Users, Shield, Package, MapPin, Trash2, 
  HelpCircle, Download, Eye, AlertTriangle, Heart
} from 'lucide-react';

const DocumentUploadPortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { applicationId } = useParams();
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Document management states
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [esgCompleted, setEsgCompleted] = useState(false);
  
  // UI states
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [finalSubmitting, setFinalSubmitting] = useState(false);

  // Handle success messages from other forms
  useEffect(() => {
    if (location.state?.message) {
      setUploadStatus(location.state.message);
      
      // Check what was completed based on the message
      if (location.state.message.includes('ESG')) {
        setEsgCompleted(true);
      }

      // Clear the message after showing it
      setTimeout(() => setUploadStatus(''), 5000);
    }
  }, [location.state]);

  // Document type configurations
  const formalDocumentTypes = [
    { value: 'government_id', label: 'Government ID', icon: Shield, required: true },
    { value: 'proof_of_address', label: 'Proof of Address', icon: MapPin, required: true },
    { value: 'business_permit', label: 'Business Permit', icon: FileText },
    { value: 'financial_statements', label: 'Financial Statements', icon: FileText },
    { value: 'bank_statements', label: 'Bank Statements', icon: FileText },
    { value: 'tax_returns', label: 'Tax Returns', icon: FileText },
    { value: 'audited_financials', label: 'Audited Financial Statements', icon: FileText }
  ];

  const supportingDocumentTypes = [
    { value: 'utility_bills', label: 'Utility Bills', icon: FileText },
    { value: 'ewallet_transactions', label: 'E-wallet Transaction History', icon: FileText },
    { value: 'social_media_business', label: 'Social Media Business Pages', icon: FileText },
    { value: 'online_store_screenshots', label: 'Online Store Screenshots', icon: FileText },
    { value: 'rental_receipts', label: 'Rental/Housing Receipts', icon: FileText },
    { value: 'credit_card_statements', label: 'Credit Card Statements', icon: FileText },
    { value: 'loan_records', label: 'Existing Loan Records', icon: FileText },
    { value: 'remittance_records', label: 'Remittance Records', icon: FileText },
    { value: 'insurance_documents', label: 'Insurance Documents', icon: FileText }
  ];

  // Check if required documents are uploaded
  const hasRequiredDocuments = () => {
    return uploadedDocs.some(doc => doc.type === 'government_id') && 
           uploadedDocs.some(doc => doc.type === 'proof_of_address');
  };

  // Check completion status for each section
  const getCompletionStatus = () => {
    return {
      documents: hasRequiredDocuments(),
      esg: esgCompleted
    };
  };

  // Generate status summary
  const getStatusSummary = () => {
    const status = getCompletionStatus();
    const pending = [];
    
    if (!status.documents) pending.push('Documents');
    if (!status.esg) pending.push('ESG Compliance Form');

    return {
      allComplete: pending.length === 0,
      pendingItems: pending,
      completedCount: Object.values(status).filter(Boolean).length,
      totalCount: 2
    };
  };

  // Handle document upload
  const handleDocumentUpload = async (files, documentType, pageType) => {
    setUploading(true);
    setUploadStatus(`Uploading ${documentType.replace('_', ' ')}...`);
    
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('documentType', documentType);
      formData.append('applicationId', applicationData?.id);
      formData.append('pageType', pageType);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDoc = {
        id: Date.now(),
        type: documentType,
        files: Array.from(files).map(file => ({
          name: file.name,
          size: file.size,
          status: 'uploaded'
        })),
        uploadedAt: new Date().toISOString()
      };

      if (pageType === 'formal') {
        setUploadedDocs(prev => [...prev, newDoc]);
      } else {
        setSupportingDocs(prev => [...prev, newDoc]);
      }
      
      setUploadStatus(`${documentType.replace('_', ' ')} uploaded successfully!`);
      
    } catch (error) {
      setUploadStatus(`Failed to upload ${documentType.replace('_', ' ')}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  // Remove document
  const removeDocument = (docId, pageType) => {
    if (pageType === 'formal') {
      setUploadedDocs(prev => prev.filter(doc => doc.id !== docId));
    } else {
      setSupportingDocs(prev => prev.filter(doc => doc.id !== docId));
    }
  };

  // Handle final submission
  const handleFinalSubmission = async () => {
    const statusSummary = getStatusSummary();
    
    if (!statusSummary.allComplete) {
      const pendingText = statusSummary.pendingItems.join(', ');
      const proceed = window.confirm(
        `You have pending items: ${pendingText}. Do you want to submit anyway? This may affect your application processing.`
      );
      if (!proceed) return;
    }

    setFinalSubmitting(true);
    setUploadStatus('Submitting complete application...');

    try {
      const submissionData = {
        applicationId: applicationData?.id,
        userId: applicationData?.userId,
        formalDocuments: uploadedDocs.map(doc => ({
          type: doc.type,
          files: doc.files.map(file => ({
            name: file.name,
            size: file.size
          })),
          uploadedAt: doc.uploadedAt
        })),
        supportingDocuments: supportingDocs.map(doc => ({
          type: doc.type,
          files: doc.files.map(file => ({
            name: file.name,
            size: file.size
          })),
          uploadedAt: doc.uploadedAt
        })),
        completionStatus: getCompletionStatus(),
        submittedAt: new Date().toISOString(),
        workflow_type: 'final_application_submission'
      };

      console.log('Submitting final application:', submissionData);

      // Submit to n8n webhook
      const response = await fetch('https://sikap-2025.app.n8n.cloud/webhook/final-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Final submission response:', result);

      setUploadStatus('Application submitted successfully! Processing has begun.');
      
      // Redirect to loans dashboard after success
      setTimeout(() => {
        navigate('/dashboard/loans', { 
          state: { 
            message: 'Application submitted successfully! You will receive updates via SMS and email.',
            type: 'success'
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Error submitting final application:', error);
      setUploadStatus('Failed to submit application. Please try again.');
    } finally {
      setFinalSubmitting(false);
    }
  };

  // Load mock application data
  useEffect(() => {
    setApplicationData({
      id: applicationId,
      userId: 'user123',
      amount: 100000,
      purpose: 'Equipment Purchase'
    });
    setLoading(false);
  }, [applicationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="animate-spin mx-auto mb-4 text-red-600" size={48} />
          <p className="text-slate-600">Loading application...</p>
        </div>
      </div>
    );
  }

  const statusSummary = getStatusSummary();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/loans')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Loans
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Equipment Purchase Loan</h1>
                  <p className="text-slate-600">
                    Loan ID: {applicationId} • ₱{applicationData?.amount?.toLocaleString()} • Applied: Aug 22, 2025
                  </p>
                </div>
                <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  Pending Documents
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Status Banner */}
        <div className="mb-8 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Application Status</h2>
              <div className="text-sm text-slate-600">
                {statusSummary.completedCount} of {statusSummary.totalCount} completed
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Progress</span>
                <span>{Math.round((statusSummary.completedCount / statusSummary.totalCount) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(statusSummary.completedCount / statusSummary.totalCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Status Items */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                hasRequiredDocuments() 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-amber-200 bg-amber-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  hasRequiredDocuments() 
                    ? 'bg-green-600 text-white' 
                    : 'bg-amber-600 text-white'
                }`}>
                  {hasRequiredDocuments() ? <CheckCircle size={16} /> : <FileText size={16} />}
                </div>
                <div>
                  <div className="font-medium text-slate-900">Documents</div>
                  <div className="text-sm text-slate-600">
                    {hasRequiredDocuments() ? 'Required docs uploaded' : 'Pending required documents'}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                esgCompleted 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-amber-200 bg-amber-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  esgCompleted 
                    ? 'bg-green-600 text-white' 
                    : 'bg-amber-600 text-white'
                }`}>
                  {esgCompleted ? <CheckCircle size={16} /> : <Leaf size={16} />}
                </div>
                <div>
                  <div className="font-medium text-slate-900">ESG Compliance</div>
                  <div className="text-sm text-slate-600">
                    {esgCompleted ? 'Questionnaire completed' : 'Pending ESG form'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Required Alert */}
          {statusSummary.pendingItems.length > 0 && (
            <div className="bg-amber-50 border-t border-amber-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-900">Action Required</h4>
                  <p className="text-sm text-amber-700">
                    Please complete: {statusSummary.pendingItems.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div className={`mb-6 p-4 rounded-lg border ${
            uploadStatus.includes('successfully') ? 'bg-green-50 text-green-800 border-green-200' : 
            uploadStatus.includes('Failed') ? 'bg-red-50 text-red-800 border-red-200' : 
            'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              {uploading || finalSubmitting ? (
                <Clock className="animate-spin" size={20} />
              ) : uploadStatus.includes('successfully') ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-medium">{uploadStatus}</span>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Document Upload Section */}
          <div className="space-y-6">
            {/* Formal Documents */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-red-50 border-b border-red-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-red-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Formal Documents</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    hasRequiredDocuments() 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {hasRequiredDocuments() ? 'Complete' : 'Required'}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-slate-600 mb-4">
                  Upload your formal documents. Government ID and Proof of Address are required.
                </p>

                {/* Required Documents Status */}
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <div className="text-sm font-medium text-slate-900 mb-2">Required Documents:</div>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-sm ${
                      uploadedDocs.some(doc => doc.type === 'government_id') 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {uploadedDocs.some(doc => doc.type === 'government_id') ? 
                        <CheckCircle size={16} /> : <AlertCircle size={16} />
                      }
                      Government ID
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${
                      uploadedDocs.some(doc => doc.type === 'proof_of_address') 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {uploadedDocs.some(doc => doc.type === 'proof_of_address') ? 
                        <CheckCircle size={16} /> : <AlertCircle size={16} />
                      }
                      Proof of Address
                    </div>
                  </div>
                </div>

                {/* Document Upload Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {formalDocumentTypes.map((docType) => (
                    <div key={docType.value} className="relative">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload(e.target.files, docType.value, 'formal')}
                        className="hidden"
                        id={`formal-${docType.value}`}
                      />
                      <label
                        htmlFor={`formal-${docType.value}`}
                        className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                          uploadedDocs.some(doc => doc.type === docType.value)
                            ? 'border-green-300 bg-green-50'
                            : docType.required
                              ? 'border-red-300 bg-red-50 hover:border-red-400'
                              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <docType.icon size={24} className={`${
                          uploadedDocs.some(doc => doc.type === docType.value)
                            ? 'text-green-600'
                            : docType.required
                              ? 'text-red-600'
                              : 'text-slate-600'
                        }`} />
                        <span className="text-xs text-center font-medium">
                          {docType.label}
                          {docType.required && <span className="text-red-500"> *</span>}
                        </span>
                        {uploadedDocs.some(doc => doc.type === docType.value) && (
                          <CheckCircle size={16} className="text-green-600" />
                        )}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Uploaded Documents List */}
                {uploadedDocs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Uploaded Documents:</h4>
                    <div className="space-y-2">
                      {uploadedDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-600" />
                            <span className="text-sm">
                              {formalDocumentTypes.find(type => type.value === doc.type)?.label}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({doc.files.length} file{doc.files.length > 1 ? 's' : ''})
                            </span>
                          </div>
                          <button
                            onClick={() => removeDocument(doc.id, 'formal')}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supporting Documents */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">Supporting Documents</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Optional
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-slate-600 mb-4">
                  Alternative data sources that can strengthen your application (optional but recommended).
                </p>

                {/* Supporting Document Upload Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {supportingDocumentTypes.slice(0, 6).map((docType) => (
                    <div key={docType.value} className="relative">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleDocumentUpload(e.target.files, docType.value, 'supporting')}
                        className="hidden"
                        id={`supporting-${docType.value}`}
                      />
                      <label
                        htmlFor={`supporting-${docType.value}`}
                        className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                          supportingDocs.some(doc => doc.type === docType.value)
                            ? 'border-green-300 bg-green-50'
                            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        <docType.icon size={24} className={`${
                          supportingDocs.some(doc => doc.type === docType.value)
                            ? 'text-green-600'
                            : 'text-slate-600'
                        }`} />
                        <span className="text-xs text-center font-medium">
                          {docType.label}
                        </span>
                        {supportingDocs.some(doc => doc.type === docType.value) && (
                          <CheckCircle size={16} className="text-green-600" />
                        )}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Uploaded Supporting Documents List */}
                {supportingDocs.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Uploaded Supporting Documents:</h4>
                    <div className="space-y-2">
                      {supportingDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-600" />
                            <span className="text-sm">
                              {supportingDocumentTypes.find(type => type.value === doc.type)?.label}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({doc.files.length} file{doc.files.length > 1 ? 's' : ''})
                            </span>
                          </div>
                          <button
                            onClick={() => removeDocument(doc.id, 'supporting')}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Forms Section */}
          <div className="space-y-6">
            {/* ESG Compliance Form */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-green-50 border-b border-green-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Leaf className="text-green-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">ESG Compliance</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    esgCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {esgCompleted ? 'Complete' : 'Required'}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-slate-600 mb-4">
                  Complete our Environmental, Social & Governance questionnaire to improve your loan terms.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Users className="text-slate-600" size={20} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">Social Responsibility</div>
                      <div className="text-xs text-slate-600">Employee welfare, community impact</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Leaf className="text-slate-600" size={20} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">Environmental Impact</div>
                      <div className="text-xs text-slate-600">Waste management, energy usage</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Shield className="text-slate-600" size={20} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">Governance & Ethics</div>
                      <div className="text-xs text-slate-600">Business ethics, transparency</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/esg-compliance/${applicationId}`)}
                  className={`w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    esgCompleted
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg'
                  }`}
                >
                  {esgCompleted ? (
                    <>
                      <CheckCircle size={20} />
                      ESG Form Completed
                    </>
                  ) : (
                    <>
                      <Leaf size={20} />
                      Answer ESG Compliance Form
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">
              {statusSummary.allComplete ? 'Ready to Submit' : 'Complete Your Application'}
            </h3>
            <p className="text-sm text-slate-600">
              {statusSummary.allComplete 
                ? 'All sections completed. Submit your application for processing.'
                : `${statusSummary.pendingItems.length} item${statusSummary.pendingItems.length > 1 ? 's' : ''} remaining: ${statusSummary.pendingItems.join(', ')}`
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.open('#', '_blank')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download size={16} />
              Download Statement
            </button>

            <button
              onClick={() => navigate('/dashboard/chatbot')}
              className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <HelpCircle size={16} />
              Get Help
            </button>

            <button
              onClick={() => navigate('/dashboard/loans')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Eye size={16} />
              View Details
            </button>

            <button
              onClick={handleFinalSubmission}
              disabled={finalSubmitting}
              className={`flex items-center gap-2 px-8 py-2 rounded-lg font-semibold transition-all shadow-lg ${
                finalSubmitting 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : statusSummary.allComplete
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white hover:from-red-700 hover:to-amber-600'
                    : 'bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-700 hover:to-red-700'
              }`}
            >
              {finalSubmitting ? (
                <>
                  <Clock className="animate-spin" size={16} />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="text-blue-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
              <p className="text-sm text-blue-700 mb-2">
                Having trouble with your application? Our AI assistant can help guide you through the process.
              </p>
              <button
                onClick={() => navigate('/dashboard/chatbot')}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Chat with our Finance Coach →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPortal;