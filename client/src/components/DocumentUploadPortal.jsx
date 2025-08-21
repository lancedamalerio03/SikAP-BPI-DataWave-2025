// client/src/components/DocumentUploadPortal.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Camera,
  CreditCard,
  Home,
  Briefcase,
  Smartphone,
  Receipt,
  Shield,
  Building,
  Clock,
  ArrowLeft,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Package,
  Star,
  Image
} from 'lucide-react';

const DocumentUploadPortal = ({ applicationData }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [declaredAssets, setDeclaredAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [assetForm, setAssetForm] = useState({
    name: '',
    category: '',
    estimatedValue: '',
    condition: '',
    description: '',
    photos: []
  });

  // Document types for dropdowns
  const formalDocumentTypes = [
    { value: 'government_id', label: 'Government ID', icon: CreditCard, required: true },
    { value: 'proof_of_address', label: 'Proof of Address', icon: Home, required: true },
    { value: 'income_tax_return', label: 'Income Tax Return (ITR)', icon: FileText },
    { value: 'certificate_of_income', label: 'Certificate of Income', icon: FileText },
    { value: 'bank_statements', label: 'Bank Statements', icon: CreditCard },
    { value: 'business_registration', label: 'Business Registration (DTI/SEC)', icon: Building },
    { value: 'business_permit', label: 'Business Permit', icon: Building },
    { value: 'employment_certificate', label: 'Certificate of Employment', icon: Briefcase },
    { value: 'payslips', label: 'Payslips', icon: Receipt },
    { value: 'financial_statements', label: 'Financial Statements', icon: FileText },
    { value: 'audited_financial_statements', label: 'Audited Financial Statements', icon: FileText }
  ];

  const supportingDocumentTypes = [
    { value: 'utility_bills', label: 'Utility Bills', icon: Receipt },
    { value: 'ewallet_transactions', label: 'E-wallet Transaction History', icon: Smartphone },
    { value: 'social_media_business', label: 'Social Media Business Pages', icon: Smartphone },
    { value: 'online_store_screenshots', label: 'Online Store Screenshots', icon: Smartphone },
    { value: 'rental_receipts', label: 'Rental/Housing Receipts', icon: Home },
    { value: 'credit_card_statements', label: 'Credit Card Statements', icon: CreditCard },
    { value: 'loan_records', label: 'Existing Loan Records', icon: Shield },
    { value: 'remittance_records', label: 'Remittance Records', icon: Receipt },
    { value: 'insurance_documents', label: 'Insurance Documents', icon: Shield }
  ];

  const assetCategories = [
    { value: 'vehicle', label: 'Vehicles' },
    { value: 'equipment', label: 'Business Equipment' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'appliances', label: 'Home Appliances' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'jewelry', label: 'Jewelry/Accessories' },
    { value: 'musical', label: 'Musical Instruments' },
    { value: 'sports', label: 'Sports Equipment' },
    { value: 'other', label: 'Other Assets' }
  ];

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, minimal wear' },
    { value: 'good', label: 'Good', description: 'Minor signs of use, fully functional' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear but still functional' },
    { value: 'poor', label: 'Poor', description: 'Significant wear, may need repairs' }
  ];

  const pages = [
    { id: 1, title: 'Formal Documents', subtitle: 'Required and official documents' },
    { id: 2, title: 'Supporting Documents', subtitle: 'Alternative data (Optional but recommended)' },
    { id: 3, title: 'Asset Declaration', subtitle: 'Movable assets for collateral (MAF)' }
  ];

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
      
      // Mock API call to n8n webhook
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

  const removeDocument = (docId, pageType) => {
    if (pageType === 'formal') {
      setUploadedDocs(prev => prev.filter(doc => doc.id !== docId));
    } else {
      setSupportingDocs(prev => prev.filter(doc => doc.id !== docId));
    }
  };

  const handleAssetPhotoUpload = (files) => {
    const photoFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    }));
    
    setAssetForm(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoFiles]
    }));
  };

  const removeAssetPhoto = (index) => {
    setAssetForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Handle back navigation
  const handleBackToApplication = () => {
    navigate('/dashboard/loans');
  };

  // Handle final submission to n8n webhook
  const handleFinalSubmission = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    setUploadStatus('Submitting documents to processing system...');

    try {
      // Prepare submission data
      const submissionData = {
        applicationId: applicationData?.id,
        userId: applicationData?.userId,

        // Document submissions
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

        // Asset declarations
        declaredAssets: declaredAssets.map(asset => ({
          name: asset.name,
          category: asset.category,
          estimatedValue: Number(asset.estimatedValue),
          condition: asset.condition,
          description: asset.description,
          photosCount: asset.photos?.length || 0
        })),

        // Summary statistics
        summary: {
          totalFormalDocs: uploadedDocs.length,
          totalSupportingDocs: supportingDocs.length,
          totalAssets: declaredAssets.length,
          totalAssetValue: declaredAssets.reduce((sum, asset) => sum + Number(asset.estimatedValue || 0), 0),
          hasRequiredDocuments: uploadedDocs.some(doc => doc.type === 'government_id') && 
                               uploadedDocs.some(doc => doc.type === 'proof_of_address')
        },

        submittedAt: new Date().toISOString(),
        workflow_type: 'document_submission'
      };

      console.log('Submitting to n8n webhook:', submissionData);

      // Call n8n webhook (use the same pattern as PreLoanApplication)
      const response = await fetch('https://sikap-2025.app.n8n.cloud/webhook/document-submission', {
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
      console.log('n8n webhook response:', result);

      setUploadStatus('Documents submitted successfully! Processing has begun.');
      
      // Wait a moment then redirect
      setTimeout(() => {
        navigate('/dashboard/loans', { 
          state: { 
            message: 'Documents submitted successfully! You will receive updates via SMS and email.',
            type: 'success'
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Error submitting to n8n:', error);
      setUploadStatus('Failed to submit documents. Please try again.');
      setSubmitting(false);
    }
  };
  
  const testWebhookConnection = async () => {
    console.log('🧪 Testing webhook connection...');
    
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Test webhook connection from DocumentUploadPortal'
    };
  
    try {
      const response = await fetch('https://sikap-2025.app.n8n.cloud/webhook/document-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
  
      console.log('🧪 Test response status:', response.status);
      
      if (response.ok) {
        const result = await response.text();
        console.log('✅ Webhook test successful:', result);
        alert('✅ Webhook is working! Check console for details.');
      } else {
        console.error('❌ Webhook test failed:', response.status, response.statusText);
        alert(`❌ Webhook test failed: HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('💥 Webhook test error:', error);
      alert(`💥 Webhook test error: ${error.message}`);
    }
  };

  const handleAssetSubmit = (e) => {
    e.preventDefault();
    
    if (editingAsset !== null) {
      setDeclaredAssets(prev => 
        prev.map((asset, index) => 
          index === editingAsset ? { ...assetForm, id: Date.now() } : asset
        )
      );
      setEditingAsset(null);
    } else {
      setDeclaredAssets(prev => [...prev, { ...assetForm, id: Date.now() }]);
    }
    
    setAssetForm({
      name: '',
      category: '',
      estimatedValue: '',
      condition: '',
      description: '',
      photos: []
    });
    setShowAssetForm(false);
  };

  const editAsset = (index) => {
    const asset = declaredAssets[index];
    setAssetForm(asset);
    setEditingAsset(index);
    setShowAssetForm(true);
  };

  const deleteAsset = (index) => {
    setDeclaredAssets(prev => prev.filter((_, i) => i !== index));
  };

  const hasRequiredDocuments = () => {
    const hasGovId = uploadedDocs.some(doc => doc.type === 'government_id');
    const hasAddress = uploadedDocs.some(doc => doc.type === 'proof_of_address');
    return hasGovId && hasAddress;
  };

  const DocumentUploadSection = ({ documentTypes, uploadedDocuments, pageType, isRequired = false }) => {
    const [selectedType, setSelectedType] = useState('');

    return (
      <div className="space-y-6">
        {/* Upload New Document */}
        <div className="border border-slate-200 rounded-lg p-6 bg-white">
          <h4 className="font-medium text-slate-900 mb-4">Add Document</h4>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Document Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select document type</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} {type.required ? '(Required)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Files
              </label>
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    if (selectedType && e.target.files.length > 0) {
                      handleDocumentUpload(e.target.files, selectedType, pageType);
                      setSelectedType('');
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                  disabled={!selectedType || uploading}
                />
                <div className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors ${
                  !selectedType || uploading ? 'bg-slate-100 cursor-not-allowed border-slate-300' : 
                  'hover:bg-slate-50 border-slate-300 hover:border-red-400'
                }`}>
                  <Upload className="mx-auto mb-1 text-slate-400" size={20} />
                  <span className="text-sm text-slate-600">
                    {!selectedType ? 'Select document type first' : 'Click to upload files'}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Uploaded Documents List */}
        {uploadedDocuments.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Uploaded Documents ({uploadedDocuments.length})</h4>
            <div className="space-y-3">
              {uploadedDocuments.map(doc => {
                const docType = documentTypes.find(type => type.value === doc.type);
                const Icon = docType?.icon || FileText;
                
                return (
                  <div key={doc.id} className="border border-slate-200 rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Icon className="text-slate-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900 mb-1">
                            {docType?.label || doc.type.replace('_', ' ')}
                          </h5>
                          <div className="space-y-1">
                            {doc.files.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                                <FileText size={14} />
                                <span>{file.name}</span>
                                <span className="text-xs">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDocument(doc.id, pageType)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const AssetDeclarationPage = () => (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <h2 className="font-semibold text-amber-900 mb-3">🏠 Movable Asset Framework (MAF)</h2>
        <p className="text-amber-800 text-sm mb-3">
          Declare your movable assets that can serve as collateral. Upload photos and provide details 
          about each asset to help us assess their value.
        </p>
        <div className="text-xs text-amber-700">
          💡 <strong>Tip:</strong> Adding valuable assets can improve your loan terms and increase approval chances.
        </div>
      </div>

      {/* Asset List */}
      {declaredAssets.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Declared Assets ({declaredAssets.length})</h3>
          <div className="grid gap-4">
            {declaredAssets.map((asset, index) => (
              <div key={asset.id} className="border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="text-red-600" size={20} />
                      <h4 className="font-semibold text-slate-900">{asset.name}</h4>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {assetCategories.find(cat => cat.value === asset.category)?.label}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-slate-600">Estimated Value:</span>
                        <div className="font-medium text-green-600">₱{Number(asset.estimatedValue).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Condition:</span>
                        <div className="font-medium capitalize text-slate-700">{asset.condition}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Photos:</span>
                        <div className="font-medium text-slate-700">{asset.photos?.length || 0} uploaded</div>
                      </div>
                    </div>
                    
                    {asset.description && (
                      <div className="text-sm text-slate-600 mb-3">
                        <strong>Description:</strong> {asset.description}
                      </div>
                    )}

                    {/* Asset Photos */}
                    {asset.photos && asset.photos.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {asset.photos.slice(0, 4).map((photo, photoIndex) => (
                          <div key={photoIndex} className="aspect-square bg-slate-100 rounded border overflow-hidden">
                            <img 
                              src={photo.url} 
                              alt={`${asset.name} photo ${photoIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {asset.photos.length > 4 && (
                          <div className="aspect-square bg-slate-100 rounded border flex items-center justify-center text-xs text-slate-600">
                            +{asset.photos.length - 4} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => editAsset(index)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteAsset(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Asset Button */}
      {!showAssetForm && (
        <button
          onClick={() => setShowAssetForm(true)}
          className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-red-400 hover:bg-red-50 transition-colors"
        >
          <Plus className="mx-auto mb-2 text-slate-400" size={32} />
          <div className="text-slate-600">
            <div className="font-medium">Add Asset</div>
            <div className="text-sm">Declare movable assets for collateral</div>
          </div>
        </button>
      )}

      {/* Asset Form */}
      {showAssetForm && (
        <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
          <h3 className="font-semibold text-slate-900 mb-4">
            {editingAsset !== null ? 'Edit Asset' : 'Add New Asset'}
          </h3>
          
          <form onSubmit={handleAssetSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm(prev => ({...prev, name: e.target.value}))}
                  placeholder="e.g., Honda TMX 155"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  value={assetForm.category}
                  onChange={(e) => setAssetForm(prev => ({...prev, category: e.target.value}))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select category</option>
                  {assetCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estimated Value (₱) *
                </label>
                <input
                  type="number"
                  value={assetForm.estimatedValue}
                  onChange={(e) => setAssetForm(prev => ({...prev, estimatedValue: e.target.value}))}
                  placeholder="50000"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Condition *
                </label>
                <select
                  value={assetForm.condition}
                  onChange={(e) => setAssetForm(prev => ({...prev, condition: e.target.value}))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
                {assetForm.condition && (
                  <div className="text-xs text-slate-500 mt-1">
                    {conditionOptions.find(c => c.value === assetForm.condition)?.description}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={assetForm.description}
                onChange={(e) => setAssetForm(prev => ({...prev, description: e.target.value}))}
                placeholder="Additional details about the asset..."
                rows={3}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Asset Photos
              </label>
              
              {/* Uploaded Photos */}
              {assetForm.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {assetForm.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square bg-slate-100 rounded border overflow-hidden">
                      <img 
                        src={photo.url} 
                        alt={`Asset photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeAssetPhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Photo Upload Area */}
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      handleAssetPhotoUpload(e.target.files);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors">
                  <Camera className="mx-auto mb-2 text-slate-400" size={24} />
                  <span className="text-sm text-slate-600">
                    Click to upload asset photos
                  </span>
                  <div className="text-xs text-slate-500 mt-1">
                    Multiple photos recommended • JPG, PNG
                  </div>
                </div>
              </label>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {editingAsset !== null ? 'Update Asset' : 'Add Asset'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAssetForm(false);
                  setEditingAsset(null);
                  setAssetForm({
                    name: '',
                    category: '',
                    estimatedValue: '',
                    condition: '',
                    description: '',
                    photos: []
                  });
                }}
                className="px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleBackToApplication}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Application
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">Document Submission</h1>
            <div className="px-3 py-1 bg-amber-500 text-white rounded-full text-sm font-medium">
              SikAP
            </div>
          </div>
          <p className="text-slate-600">
            Application ID: <span className="font-mono font-medium">{applicationData?.id || 'Loading...'}</span>
          </p>
          
          {/* Page Navigation */}
          <div className="mt-6 flex items-center space-x-4 overflow-x-auto">
            {pages.map((page, index) => (
              <div key={page.id} className="flex items-center flex-shrink-0">
                <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentPage === page.id 
                    ? 'bg-red-100 text-red-700' 
                    : currentPage > page.id 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentPage === page.id 
                      ? 'bg-red-600 text-white' 
                      : currentPage > page.id 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-300 text-slate-600'
                  }`}>
                    {currentPage > page.id ? <CheckCircle size={16} /> : page.id}
                  </div>
                  <div>
                    <div className="font-medium">{page.title}</div>
                    <div className="text-xs">{page.subtitle}</div>
                  </div>
                </div>
                {index < pages.length - 1 && (
                  <ArrowRight className="mx-2 text-slate-400" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div className={`mb-6 p-4 rounded-lg border ${
            uploadStatus.includes('successfully') ? 'bg-green-50 text-green-800 border-green-200' : 
            uploadStatus.includes('Failed') ? 'bg-red-50 text-red-800 border-red-200' : 
            'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              {uploading ? (
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

        {/* Page Content */}
        {currentPage === 1 && (
          <div className="space-y-8">
            {/* Page Introduction */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h2 className="font-semibold text-red-900 mb-3">📋 Formal Documents</h2>
              <p className="text-red-800 text-sm mb-3">
                Upload your formal documents. Government ID and Proof of Address are required. 
                Add any other relevant documents that can support your application.
              </p>
              <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
                💡 <strong>Required:</strong> Government ID and Proof of Address must be submitted to proceed.
              </div>
            </div>

            <DocumentUploadSection 
              documentTypes={formalDocumentTypes}
              uploadedDocuments={uploadedDocs}
              pageType="formal"
              isRequired={true}
            />
          </div>
        )}

        {currentPage === 2 && (
          <div className="space-y-8">
            {/* Page Introduction */}
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h2 className="font-semibold text-amber-900 mb-3">📱 Supporting Documents</h2>
              <p className="text-amber-800 text-sm mb-3">
                These documents are optional but highly recommended, especially if you have limited formal documents. 
                They help us better understand your financial behavior and payment history.
              </p>
              <div className="text-xs text-amber-700 bg-amber-100 p-2 rounded">
                💡 <strong>SikAP Advantage:</strong> We use alternative data to assess creditworthiness beyond traditional methods.
              </div>
            </div>

            <DocumentUploadSection 
              documentTypes={supportingDocumentTypes}
              uploadedDocuments={supportingDocs}
              pageType="supporting"
              isRequired={false}
            />
          </div>
        )}

        {currentPage === 3 && <AssetDeclarationPage />}

        {/* Navigation Buttons */}
        <div className="border-t border-slate-200 pt-6 mt-8">
          <div className="flex justify-between items-center">
            <div>
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  <ArrowLeft size={20} />
                  Previous Page
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Page Status */}
              <div className="text-sm text-slate-600">
                {currentPage === 1 ? (
                  hasRequiredDocuments() ? (
                    <span className="text-green-600 font-medium">✅ Required documents uploaded</span>
                  ) : (
                    <span className="text-red-600 font-medium">❌ Government ID and Proof of Address required</span>
                  )
                ) : currentPage === 2 ? (
                  <span className="text-amber-600 font-medium">💡 All documents optional but recommended</span>
                ) : (
                  declaredAssets.length > 0 ? (
                    <span className="text-green-600 font-medium">✅ Assets Declared ({declaredAssets.length})</span>
                  ) : (
                    <span className="text-amber-600 font-medium">💡 Add assets to improve loan terms</span>
                  )
                )}
              </div>

              {/* Next/Submit Button */}
              {currentPage < 3 ? (
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === 1 && !hasRequiredDocuments()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    (currentPage === 1 && hasRequiredDocuments()) || currentPage === 2
                      ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Next Page
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleFinalSubmission}
                  disabled={submitting}
                  className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                    submitting 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-amber-500 text-white hover:from-red-700 hover:to-amber-600'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Page Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm">
          {pages.map((page) => (
            <div key={page.id} className={`p-4 rounded-lg border ${
              currentPage === page.id 
                ? 'border-red-200 bg-red-50' 
                : currentPage > page.id 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="font-medium text-slate-900">{page.title}</div>
              <div className="text-slate-600 text-xs mt-1">{page.subtitle}</div>
              {page.id === 1 && (
                <div className="mt-2 text-xs">
                  <div className="flex justify-between">
                    <span>Documents:</span>
                    <span className="font-medium">{uploadedDocs.length} uploaded</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required:</span>
                    <span className={`font-medium ${hasRequiredDocuments() ? 'text-green-600' : 'text-red-600'}`}>
                      {hasRequiredDocuments() ? 'Complete' : 'Missing'}
                    </span>
                  </div>
                </div>
              )}
              {page.id === 2 && currentPage >= 2 && (
                <div className="mt-2 text-xs">
                  <div className="flex justify-between">
                    <span>Documents:</span>
                    <span className="font-medium">{supportingDocs.length} uploaded</span>
                  </div>
                </div>
              )}
              {page.id === 3 && currentPage >= 3 && (
                <div className="mt-2 text-xs">
                  <div className="flex justify-between">
                    <span>Assets:</span>
                    <span className="font-medium">{declaredAssets.length} declared</span>
                  </div>
                  {declaredAssets.length > 0 && (
                    <div className="text-green-600 font-medium text-xs mt-1">
                      Total Value: ₱{declaredAssets.reduce((sum, asset) => sum + Number(asset.estimatedValue || 0), 0).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            Need Help?
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600">
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Document Quality Tips:</h4>
              <ul className="space-y-1">
                <li>• Use good lighting when taking photos</li>
                <li>• Ensure all text is clearly readable</li>
                <li>• Capture the entire document</li>
                <li>• Avoid blurry or tilted images</li>
                <li>• For asset photos, show condition clearly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-900 mb-2">Technical Support:</h4>
              <ul className="space-y-1">
                <li>• <strong>Call:</strong> (02) 8123-4567</li>
                <li>• <strong>Text:</strong> 0917-123-4567</li>
                <li>• <strong>Email:</strong> support@sikap.ph</li>
                <li>• <strong>Chat:</strong> Available 8AM-6PM daily</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentUploadPortal;