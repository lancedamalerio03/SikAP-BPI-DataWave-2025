// client/src/components/AssetDeclarationForm.jsx - Updated with webhook integration

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Camera, Trash2, Package, Car, Laptop, 
  Home, Gem, Music, Trophy, CheckCircle, X, Upload, Clock,
  DollarSign, AlertCircle, Eye, Edit
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import webhookService from '../services/webhookService';

const AssetDeclarationForm = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [asset, setAsset] = useState(null); // Single asset instead of array
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [assetForm, setAssetForm] = useState({
    name: '',
    category: '',
    estimatedValue: '',
    condition: '',
    age: '', // Added age field
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

  // Condition options (removed multiplier since AI will handle valuation)
  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, minimal wear' },
    { value: 'good', label: 'Good', description: 'Minor signs of use, fully functional' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear but still functional' },
    { value: 'poor', label: 'Poor', description: 'Significant wear, may need repairs' }
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

  // Add asset (replace existing if any)
  const handleAddAsset = () => {
    if (!assetForm.name || !assetForm.category || !assetForm.estimatedValue || !assetForm.condition) {
      alert('Please fill in all required fields');
      return;
    }

    const newAsset = {
      id: Date.now(),
      ...assetForm,
      estimatedValue: Number(assetForm.estimatedValue),
      age: Number(assetForm.age) || 0,
      addedAt: new Date().toISOString()
    };

    setAsset(newAsset); // Set single asset instead of adding to array
    setAssetForm({
      name: '',
      category: '',
      estimatedValue: '',
      condition: '',
      age: '',
      description: '',
      photos: []
    });
    setShowAddForm(false);
  };

  // Remove asset
  const removeAsset = () => {
    setAsset(null); // Clear the single asset
  };

  // Get category info
  const getCategoryInfo = (categoryValue) => {
    return assetCategories.find(cat => cat.value === categoryValue);
  };

  // Calculate total value (single asset)
  const calculateTotalValue = () => {
    return asset ? Number(asset.estimatedValue || 0) : 0;
  };



  // Handle form submission with webhook
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Get the current authenticated user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error('User authentication error: ' + userError.message);
      }
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      console.log('Submitting asset declaration via webhook...');

      // Submit the single asset if it exists
      if (asset) {
        const assetData = {
          application_id: applicationId,
          asset_name: asset.name,
          category: asset.category,
          estimated_value: asset.estimatedValue,
          condition: asset.condition,
          age: asset.age || 0,
          description: asset.description || ''
        };

        const webhookResult = await webhookService.submitAssetDeclaration(
          applicationId,
          assetData,
          currentUser
        );

        console.log('Asset declaration webhook response:', webhookResult);

        // Navigate back to loans page with success message
        navigate('/dashboard/loans', {
          state: {
            message: `Asset declaration submitted successfully! Your ${asset.name} valued at ₱${asset.estimatedValue.toLocaleString()} has been processed by our AI for valuation.`,
            type: 'success'
          }
        });
      } else {
        // User chose to continue without assets - still notify the system
        const emptyAssetData = {
          application_id: applicationId,
          asset_name: 'No assets declared',
          category: 'none',
          estimated_value: 0,
          condition: 'not_applicable',
          age: 0,
          description: 'Borrower chose to continue without declaring assets'
        };

        await webhookService.submitAssetDeclaration(
          applicationId,
          emptyAssetData,
          currentUser
        );

        navigate('/dashboard/loans', {
          state: {
            message: 'Application continued without asset declaration. This may affect your loan terms.',
            type: 'warning'
          }
        });
      }

    } catch (error) {
      console.error('Error submitting asset declaration:', error);
      alert(`Failed to submit asset declaration: ${error.message}. Please try again or contact support.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard/loans')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Loans
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Asset Declaration</h1>
            <p className="text-slate-600">Declare your assets to improve loan terms and use as collateral</p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Asset Summary</h3>
              <p className="text-sm text-slate-600">
                {!asset 
                  ? 'No asset declared yet' 
                  : `${asset.name} • Value: ₱${asset.estimatedValue.toLocaleString()}`
                }
              </p>
            </div>
            {!asset ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus size={20} />
                Add Asset
              </button>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={20} />
                Edit Asset
              </button>
            )}
          </div>
        </div>

        {/* Add Asset Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">
                {asset ? 'Edit Asset' : 'Add Asset'}
              </h3>
              {asset && (
                <button
                  onClick={removeAsset}
                  className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                  Remove Asset
                </button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Asset Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={assetForm.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., 2019 Toyota Camry, MacBook Pro, etc."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={assetForm.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select category</option>
                  {assetCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimated Value */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estimated Value (₱) *
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={assetForm.estimatedValue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Current market value"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  value={assetForm.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="How old is this asset?"
                />
              </div>

              {/* Condition */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Condition *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {conditionOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        assetForm.condition === option.value
                          ? 'border-red-500 bg-red-50 text-red-900'
                          : 'border-slate-300 hover:border-red-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={option.value}
                        checked={assetForm.condition === option.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-slate-600 mt-1">{option.description}</div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={assetForm.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Additional details about this asset..."
                />
              </div>

              {/* Photo Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Asset Photos (Optional)
                </label>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e.target.files)}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                      <p className="text-sm text-slate-600">
                        Click to upload photos or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG up to 10MB each
                      </p>
                    </label>
                  </div>

                  {/* Photo Preview */}
                  {assetForm.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {assetForm.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo.url}
                            alt={`Asset photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-slate-200"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                          <div className="mt-1 text-xs text-slate-500 truncate">
                            {photo.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
                {asset ? 'Update Asset' : 'Add Asset'}
              </button>
            </div>
          </div>
        )}

        {/* Asset Display */}
        {asset && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {(() => {
                    const categoryInfo = getCategoryInfo(asset.category);
                    const IconComponent = categoryInfo?.icon;
                    return IconComponent && <IconComponent className="text-slate-600 mt-1" size={24} />;
                  })()}
                  <div>
                    <h3 className="font-semibold text-slate-900">{asset.name}</h3>
                    <p className="text-sm text-slate-600">{getCategoryInfo(asset.category)?.label}</p>
                  </div>
                </div>
                <button
                  onClick={removeAsset}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-slate-600">Estimated Value</div>
                  <div className="font-medium">₱{asset.estimatedValue.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Condition</div>
                  <div className="font-medium">{conditionOptions.find(opt => opt.value === asset.condition)?.label}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Age</div>
                  <div className="font-medium">{asset.age || 'N/A'} years</div>
                </div>
              </div>

              {asset.description && (
                <div className="border-t border-slate-100 pt-4 mb-4">
                  <div className="text-sm text-slate-600 mb-1">Description</div>
                  <p className="text-sm text-slate-800">{asset.description}</p>
                </div>
              )}

              {asset.photos && asset.photos.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <div className="text-sm text-slate-600 mb-2">Photos ({asset.photos.length})</div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {asset.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo.url}
                          alt={`${asset.name} photo ${index + 1}`}
                          className="w-full h-16 object-cover rounded border border-slate-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
                          <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {asset ? 'Submit Asset Declaration' : 'No Asset to Declare'}
              </h3>
              <p className="text-sm text-slate-600">
                {asset 
                  ? `Asset declared: ${asset.name} valued at ₱${calculateTotalValue().toLocaleString()}`
                  : 'You can continue without declaring an asset, but it may affect your loan terms'
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
                  {asset ? 'Submit Declaration' : 'Continue Without Asset'}
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
                <li>• Assets in good condition provide better collateral value</li>
                <li>• Our AI will assess actual market value based on your inputs</li>
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