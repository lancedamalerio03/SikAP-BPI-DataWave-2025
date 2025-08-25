// components/officer/ApplicantDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ApplicantDetailsModal = ({ isOpen, onClose, applicantId, applicationType = 'loan' }) => {
  const [loading, setLoading] = useState(true);
  const [applicantData, setApplicantData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && applicantId) {
      fetchApplicantDetails();
    }
  }, [isOpen, applicantId]);

  const fetchApplicantDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      let userData = {};
      
      if (applicationType === 'loan') {
        // Fetch loan application data
        const { data: loanApp, error: loanError } = await supabase
          .from('preloan_applications')
          .select('*')
          .eq('id', applicantId)
          .single();

        if (loanError) throw loanError;
        if (!loanApp) throw new Error('Loan application not found');

        // Fetch user profile data
        const { data: profile, error: profileError } = await supabase
          .from('users_profiles')
          .select('*')
          .eq('id', loanApp.user_id)
          .single();

        if (profileError) throw profileError;

        // Fetch employment data
        const { data: employment, error: empError } = await supabase
          .from('user_employment')
          .select('*')
          .eq('user_id', loanApp.user_id)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch financial info
        const { data: financial, error: finError } = await supabase
          .from('user_financial_info')
          .select('*')
          .eq('user_id', loanApp.user_id)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch address info
        const { data: address, error: addrError } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', loanApp.user_id)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch risk profile
        const { data: riskProfile, error: riskError } = await supabase
          .from('preloan_risk_profiles')
          .select('*')
          .eq('user_id', loanApp.user_id)
          .single();

        // Fetch asset declarations
        const { data: assets, error: assetError } = await supabase
          .from('asset_declaration')
          .select('*')
          .eq('user_id', loanApp.user_id);

        // Fetch ESG assessment
        const { data: esgAssessment, error: esgError } = await supabase
          .from('esg_assessments')
          .select('*')
          .eq('application_id', applicantId)
          .single();

        userData = {
          type: 'loan',
          application: loanApp,
          profile: profile || {},
          employment: employment?.[0] || {},
          financial: financial?.[0] || {},
          address: address?.[0] || {},
          riskProfile: riskProfile || {},
          assets: assets || [],
          esgAssessment: esgAssessment || {}
        };

      } else if (applicationType === 'risk') {
        // Fetch risk profile data directly
        const { data: riskProfile, error: riskError } = await supabase
          .from('preloan_risk_profiles')
          .select('*')
          .eq('user_id', applicantId)
          .single();

        if (riskError) throw riskError;
        if (!riskProfile) throw new Error('Risk profile not found');

        // Fetch user profile data
        const { data: profile, error: profileError } = await supabase
          .from('users_profiles')
          .select('*')
          .eq('id', applicantId)
          .single();

        if (profileError) throw profileError;

        // Fetch employment data
        const { data: employment, error: empError } = await supabase
          .from('user_employment')
          .select('*')
          .eq('user_id', applicantId)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch financial info
        const { data: financial, error: finError } = await supabase
          .from('user_financial_info')
          .select('*')
          .eq('user_id', applicantId)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch address info
        const { data: address, error: addrError } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', applicantId)
          .order('created_at', { ascending: false })
          .limit(1);

        userData = {
          type: 'risk',
          profile: profile || {},
          employment: employment?.[0] || {},
          financial: financial?.[0] || {},
          address: address?.[0] || {},
          riskProfile: riskProfile || {}
        };
      }

      setApplicantData(userData);
    } catch (err) {
      console.error('Error fetching applicant details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRiskColor = (grade) => {
    const colors = {
      A: 'bg-green-100 text-green-800',
      B: 'bg-blue-100 text-blue-800',
      C: 'bg-yellow-100 text-yellow-800',
      D: 'bg-orange-100 text-orange-800',
      F: 'bg-red-100 text-red-800',
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      pending_documents: 'bg-orange-100 text-orange-800',
      review: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {applicantData?.type === 'loan' ? 'Loan Applicant Details' : 'Risk Profile Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading applicant details...</span>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && applicantData && (
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">
                      {`${applicantData.profile.first_name || ''} ${applicantData.profile.last_name || ''}`.trim() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {applicantData.profile.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {applicantData.profile.mobile_number || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(applicantData.profile.date_of_birth)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Place of Birth</label>
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {applicantData.profile.place_of_birth || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900">{applicantData.profile.gender || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {applicantData.address && Object.keys(applicantData.address).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Street Address</label>
                      <p className="text-gray-900">{applicantData.address.street_address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="text-gray-900">{applicantData.address.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Province</label>
                      <p className="text-gray-900">{applicantData.address.province || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ZIP Code</label>
                      <p className="text-gray-900">{applicantData.address.zip_code || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Employment Information */}
              {applicantData.employment && Object.keys(applicantData.employment).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Employment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Occupation</label>
                      <p className="text-gray-900">{applicantData.employment.occupation || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Employment Status</label>
                      <p className="text-gray-900">{applicantData.employment.employment_status || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Monthly Income</label>
                      <p className="text-gray-900 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(applicantData.employment.monthly_income)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Name</label>
                      <p className="text-gray-900 flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {applicantData.employment.company_name || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Financial Information */}
              {applicantData.financial && Object.keys(applicantData.financial).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Financial Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Annual Income</label>
                      <p className="text-gray-900">{formatCurrency(applicantData.financial.annual_income)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Monthly Expenses</label>
                      <p className="text-gray-900">{formatCurrency(applicantData.financial.monthly_expenses)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Existing Loans</label>
                      <p className="text-gray-900">{formatCurrency(applicantData.financial.existing_loans)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit Score</label>
                      <p className="text-gray-900">{applicantData.financial.credit_score || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Profile */}
              {applicantData.riskProfile && Object.keys(applicantData.riskProfile).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Risk Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Risk Grade</label>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(applicantData.riskProfile.risk_grade)}`}>
                          {applicantData.riskProfile.risk_grade || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Credit Score</label>
                      <p className="text-gray-900">{applicantData.riskProfile.credit_score || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ID Verified</label>
                      <p className="text-gray-900 flex items-center">
                        {applicantData.riskProfile.id_verified ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        {applicantData.riskProfile.id_verified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address Verified</label>
                      <p className="text-gray-900 flex items-center">
                        {applicantData.riskProfile.address_verified ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        {applicantData.riskProfile.address_verified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">AML Status</label>
                      <p className="text-gray-900 flex items-center">
                        {applicantData.riskProfile.aml_flagged ? (
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        )}
                        {applicantData.riskProfile.aml_flagged ? 'Flagged' : 'Clean'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Member Since</label>
                      <p className="text-gray-900">{applicantData.riskProfile.membership_year || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Loan Application Details (only for loan type) */}
              {applicantData.type === 'loan' && applicantData.application && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Loan Application Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Loan Amount</label>
                      <p className="text-gray-900 text-lg font-semibold">
                        {formatCurrency(applicantData.application.loan_amount)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Loan Purpose</label>
                      <p className="text-gray-900">{applicantData.application.loan_purpose || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Loan Tenor</label>
                      <p className="text-gray-900">
                        {applicantData.application.loan_tenor_months ? `${applicantData.application.loan_tenor_months} months` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Repayment Frequency</label>
                      <p className="text-gray-900">{applicantData.application.repayment_frequency || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Application Status</label>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(applicantData.application.status)}`}>
                          {applicantData.application.status || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Urgency</label>
                      <p className="text-gray-900">{applicantData.application.urgency || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">AI Decision</label>
                      <p className="text-gray-900">{applicantData.application.ai_decision || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">AI Confidence</label>
                      <p className="text-gray-900">
                        {applicantData.application.ai_confidence ? `${Math.round(applicantData.application.ai_confidence * 100)}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  {applicantData.application.ai_reasoning && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-500">AI Reasoning</label>
                      <p className="text-gray-900 text-sm bg-white p-3 rounded border">
                        {applicantData.application.ai_reasoning}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Completion Status */}
              {applicantData.type === 'loan' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Application Completion Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      {applicantData.application.documents_completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      <span className="text-gray-900">Documents</span>
                    </div>
                    <div className="flex items-center">
                      {applicantData.application.esg_completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      <span className="text-gray-900">ESG Assessment</span>
                    </div>
                    <div className="flex items-center">
                      {applicantData.application.assets_completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                      )}
                      <span className="text-gray-900">Asset Declaration</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Assets (if available) */}
              {applicantData.assets && applicantData.assets.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Asset Declarations
                  </h3>
                  <div className="space-y-3">
                    {applicantData.assets.map((asset, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs font-medium text-gray-500">Asset Type</label>
                            <p className="text-sm text-gray-900">{asset.asset_type || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Value</label>
                            <p className="text-sm text-gray-900">{formatCurrency(asset.asset_value)}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Description</label>
                            <p className="text-sm text-gray-900">{asset.description || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailsModal;
