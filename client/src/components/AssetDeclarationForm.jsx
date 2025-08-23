// client/src/components/AssetDeclarationForm.jsx - Separate Asset Declaration Form

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import webhookService from '../services/webhookService';
import { 
  ArrowLeft, Plus, Camera, Trash2, Package, Car, Laptop, 
  Home, Gem, Music, Trophy, CheckCircle, X, Upload, Clock,
  DollarSign, AlertCircle, Eye, Edit
} from 'lucide-react';

const AssetDeclarationForm = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [assets, setAssets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  // Load application data on component mount
  useEffect(() => {
    const loadApplicationData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          return;
        }

        // Try to get application data from database
        const { data, error } = await supabase
          .from('preloan_applications')
          .select('id, user_id, loan_amount, loan_purpose, assets_completed')
          .eq('id', applicationId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error loading application data:', error);
        } else {
          setApplicationData(data);
          console.log('Loaded application data:', data);
        }
      } catch (error) {
        console.error('Error in loadApplicationData:', error);
      }
    };

    if (applicationId) {
      loadApplicationData();
    }
  }, [applicationId]);

  const [assetForm, setAssetForm] = useState({
    name: '',
    category: '',
    estimatedValue: '',
    condition: '',
    description: '',
    photos: []
  });

  // Asset categories with icons
  const assetCategories = [
    { value: 'vehicle', label: 'Vehicles', icon: Car, examples: 'Cars, motorcycles, trucks, boats' },
    { value: 'equipment', label: 'Business Equipment', icon: Package, examples: 'Machinery, tools, industrial equipment' },
    { value: 'electronics', label: 'Electronics', icon: Laptop, examples: 'Computers, phones, tablets, TVs' },
    { value: 'appliances', label: 'Home Appliances', icon: Home, examples: 'Refrigerators, washing machines, AC units' },
    { value: 'furniture', label: 'Furniture', icon: Home, examples: 'Tables, chairs, beds, cabinets' },
    { value: 'jewelry', label: 'Jewelry & Accessories', icon: Gem, examples: 'Gold, watches, precious stones' },
    { value: 'musical', label: 'Musical Instruments', icon: Music, examples: 'Guitars, pianos, drums, sound equipment' },
    { value: 'sports', label: 'Sports Equipment', icon: Trophy, examples: 'Fitness equipment, sports gear' },
    { value: 'other', label: 'Other Assets', icon: Package, examples: 'Art, collectibles, other valuables' }
  ];

  // Condition options
  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, minimal wear', multiplier: 1.0 },
    { value: 'good', label: 'Good', description: 'Minor signs of use, fully functional', multiplier: 0.85 },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear but still functional', multiplier: 0.65 },
    { value: 'poor', label: 'Poor', description: 'Significant wear, may need repairs', multiplier: 0.45 }
  ];

  // Handle photo upload
  const handlePhotoUpload = (files) => {
    const photoFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setAssetForm(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoFiles]
    }));
  };

  // Remove photo
  const removePhoto = (index) => {
    setAssetForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssetForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add asset
  const handleAddAsset = () => {
    if (!assetForm.name || !assetForm.category || !assetForm.estimatedValue || !assetForm.condition) {
      alert('Please fill in all required fields');
      return;
    }

    const newAsset = {
      id: Date.now(),
      ...assetForm,
      estimatedValue: Number(assetForm.estimatedValue),
      addedAt: new Date().toISOString()
    };

    setAssets(prev => [...prev, newAsset]);
    setAssetForm({
      name: '',
      category: '',
      estimatedValue: '',
      condition: '',
      description: '',
      photos: []
    });
    setShowAddForm(false);
  };

  // Remove asset
  const removeAsset = (assetId) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  // Get category info
  const getCategoryInfo = (categoryValue) => {
    return assetCategories.find(cat => cat.value === categoryValue);
  };

  // Calculate total value
  const calculateTotalValue = () => {
    return assets.reduce((total, asset) => total + Number(asset.estimatedValue || 0), 0);
  };



  // Handle form submission
  const handleSubmit = async () => {
    if (assets.length === 0) {
      const proceed = window.confirm(
        'You haven\'t declared any assets. Assets can improve your loan terms and serve as collateral. Do you want to continue without declaring assets?'
      );
      if (!proceed) return;
    }

    setSubmitting(true);

    try {
      // Get the current authenticated user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('User authentication error: ' + userError.message);
      }
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Ensure we have application data
      if (!applicationData && !applicationId) {
        throw new Error('Application data not found. Please try again.');
      }

      const assetData = {
        applicationId,
        userId: applicationData?.user_id || currentUser.id,
        declaredAssets: assets.map(asset => ({
          name: asset.name,
          category: asset.category,
          estimatedValue: Number(asset.estimatedValue),

          condition: asset.condition,
          description: asset.description,
          photosCount: asset.photos?.length || 0,
          addedAt: asset.addedAt
        })),
        summary: {
          totalAssets: assets.length,
          totalValue: calculateTotalValue(),

          categoryBreakdown: assetCategories.map(category => ({
            category: category.value,
            count: assets.filter(asset => asset.category === category.value).length,
            value: assets
              .filter(asset => asset.category === category.value)
              .reduce((sum, asset) => sum + Number(asset.estimatedValue), 0)
          })).filter(cat => cat.count > 0)
        }
      };

      // Update preloan_applications table to mark assets as completed
      const updatePreloanApplicationStatus = async () => {
        try {
          console.log('Updating preloan_applications assets_completed status...');
          
          const { error: updateError } = await supabase
            .from('preloan_applications')
            .update({
              assets_completed: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', applicationId)
            .eq('user_id', currentUser.id);

          if (updateError) {
            console.error('Error updating preloan_applications:', updateError);
            throw new Error(`Database update failed: ${updateError.message}`);
          } else {
            console.log('Successfully updated preloan_applications assets_completed status');
          }
        } catch (dbError) {
          console.error('Database update error:', dbError);
          throw dbError;
        }
      };

      if (assets.length > 0) {
        // Submit assets via webhook service if assets are declared
        console.log('Submitting asset declaration via webhook service...');
        
        const result = await webhookService.submitAssetDeclaration(currentUser, assetData);
        console.log('Asset declaration webhook response:', result);
        
        // Update database status
        await updatePreloanApplicationStatus();
      } else {
        // No assets declared, just update the completion status
        console.log('No assets declared, updating completion status only...');
        await updatePreloanApplicationStatus();
      }

      // Redirect back to loans page with success message
      const successMessage = assets.length > 0 
        ? `Asset declaration completed! ${assets.length} assets declared with total value: ₱${calculateTotalValue().toLocaleString()}`
        : 'Asset declaration completed! No assets declared at this time.';
        
      navigate('/dashboard/loans', {
        state: {
          message: successMessage,
          type: 'success'
        }
      });

    } catch (error) {
      console.error('Error submitting asset declaration:', error);
      alert(`Failed to submit asset declaration: ${error.message}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/loans/${applicationId}/documents`)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Application
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">Asset Declaration</h1>
              <p className="text-slate-600">Declare movable assets for improved loan terms</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Total Value</div>
              <div className="text-2xl font-bold text-green-600">
                ₱{calculateTotalValue().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Status Banner - if already completed */}
        {applicationData?.assets_completed && (
          <div className="mb-6 bg-green-50 rounded-lg border border-green-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-green-900 mb-1">Asset Declaration Already Completed</h3>
                <p className="text-sm text-green-700">
                  You have already completed the asset declaration for this application. 
                  You can still update or add more assets if needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <Package className="text-blue-600 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Why Declare Assets?</h3>
              <p className="text-sm text-blue-700">
                Declaring assets can improve your loan terms, serve as collateral for Movable Asset Financing (MAF), 
                and demonstrate your financial stability. All information is confidential and secure.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mb-6 bg-amber-50 rounded-lg border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-amber-900 mb-1">Important Notice</h3>
              <p className="text-sm text-amber-700">
                All asset values you provide are estimates and will be subject to evaluation and verification during the loan processing. 
                Please provide your best estimate of the current market value.
              </p>
            </div>
          </div>
        </div>

        {/* Assets Summary */}
        {assets.length > 0 && (
          <div className="mb-6 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Declared Assets Summary</h2>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>{assets.length} assets</span>
                <span>₱{calculateTotalValue().toLocaleString()} total value</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assetCategories.map(category => {
                const categoryAssets = assets.filter(asset => asset.category === category.value);
                const categoryValue = categoryAssets.reduce((sum, asset) => sum + Number(asset.estimatedValue), 0);
                
                if (categoryAssets.length === 0) return null;
                
                return (
                  <div key={category.value} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <category.icon size={16} className="text-slate-600" />
                      <span className="font-medium text-slate-900">{category.label}</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      {categoryAssets.length} items • ₱{categoryValue.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Asset List */}
        <div className="space-y-4 mb-6">
          {assets.map((asset) => {
            const categoryInfo = getCategoryInfo(asset.category);
            const conditionInfo = conditionOptions.find(opt => opt.value === asset.condition);

            
            return (
              <div key={asset.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {categoryInfo && <categoryInfo.icon className="text-slate-600 mt-1" size={24} />}
                      <div>
                        <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                        <p className="text-sm text-slate-600">{categoryInfo?.label}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-slate-600">Estimated Value</div>
                      <div className="font-semibold text-slate-900">₱{Number(asset.estimatedValue).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Condition</div>
                      <div className="font-medium text-slate-900">{conditionInfo?.label}</div>
                    </div>
                  </div>

                  {asset.description && (
                    <div className="mb-4">
                      <div className="text-sm text-slate-600 mb-1">Description</div>
                      <p className="text-sm text-slate-700">{asset.description}</p>
                    </div>
                  )}

                  {asset.photos && asset.photos.length > 0 && (
                    <div>
                      <div className="text-sm text-slate-600 mb-2">Photos ({asset.photos.length})</div>
                      <div className="flex gap-2 overflow-x-auto">
                        {asset.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo.url}
                            alt={`${asset.name} photo ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Asset Button */}
        {!showAddForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              <Plus size={20} />
              Add Asset
            </button>
          </div>
        )}

        {/* Add Asset Form */}
        {showAddForm && (
          <div className="mb-6 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Add New Asset</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-slate-600 hover:text-slate-900 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asset Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={assetForm.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Toyota Vios 2020, MacBook Pro, etc."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={assetForm.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select a category</option>
                  {assetCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {assetForm.category && (
                  <p className="text-xs text-slate-500 mt-1">
                    Examples: {getCategoryInfo(assetForm.category)?.examples}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estimated Value (₱) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={assetForm.estimatedValue}
                  onChange={handleInputChange}
                  placeholder="Enter estimated market value"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={assetForm.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label} - {condition.description}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={assetForm.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional details about the asset (model, year, specifications, etc.)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Photo Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Photos (Optional but recommended)
              </label>
              
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e.target.files)}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Camera className="mx-auto mb-4 text-slate-400" size={48} />
                  <p className="text-slate-600 mb-2">Click to upload photos</p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB each</p>
                </label>
              </div>

              {assetForm.photos.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-4">
                    {assetForm.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo.url}
                          alt={`Asset photo ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAsset}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Asset
              </button>
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {assets.length > 0 ? 'Submit Asset Declaration' : 'No Assets to Declare'}
              </h3>
              <p className="text-sm text-slate-600">
                {assets.length > 0 
                  ? `${assets.length} assets declared with total value of ₱${calculateTotalValue().toLocaleString()}`
                  : 'You can continue without declaring assets, but it may affect your loan terms'
                }
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                submitting 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-amber-500 text-white hover:from-red-700 hover:to-amber-600'
              }`}
            >
              {submitting ? (
                <>
                  <Clock className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  {assets.length > 0 ? 'Submit Declaration' : 'Continue Without Assets'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-amber-50 rounded-lg border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-amber-600 mt-0.5" size={20} />
            <div>
              <h4 className="font-medium text-amber-900 mb-1">Asset Declaration Tips</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Be honest about asset values - they may be verified during processing</li>
                <li>• Include photos to speed up verification and improve credibility</li>
                <li>• Assets in good condition have higher collateral value</li>
                <li>• Business equipment and vehicles typically have the highest loan impact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AssetDeclarationForm;