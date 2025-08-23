// client/src/components/ESGComplianceForm.jsx 
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Leaf, Users, Shield, 
  HelpCircle, BarChart3, Award, AlertCircle, Clock, DollarSign
} from 'lucide-react';
import { esgAssessmentService } from '../services/esgAssessmentService';

const ESGComplianceForm = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

  // Load assessment data on component mount
  useEffect(() => {
    loadAssessment();
  }, [applicationId]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading ESG assessment for application:', applicationId);
      const assessmentData = await esgAssessmentService.getAssessmentQuestions(applicationId);
      
      setAssessment(assessmentData);
      
      // Initialize responses with existing answers
      const initialResponses = {};
      Object.keys(assessmentData.questions).forEach(key => {
        initialResponses[key] = assessmentData.questions[key].response || '';
      });
      
      setResponses(initialResponses);
      
    } catch (err) {
      console.error('Error loading assessment:', err);
      setError('Failed to load ESG assessment questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionKey, value) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: value
    }));
  };

  // Calculate completion percentage (not ESG score - that's for the AI agent)
  const calculateCompletionPercentage = () => {
    if (!assessment) return 0;
    const totalQuestions = Object.keys(assessment.questions).length;
    const answeredQuestions = Object.values(responses).filter(response => 
      response && response.trim() !== ''
    ).length;
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Check if form is complete
  const isFormComplete = () => {
    if (!assessment) return false;
    return Object.keys(assessment.questions).every(key => 
      responses[key] && responses[key].trim() !== ''
    );
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Structure responses for the service
      const structuredResponses = {};
      Object.keys(assessment.questions).forEach(key => {
        structuredResponses[key] = {
          question: assessment.questions[key].question,
          response: responses[key]
        };
      });

      await esgAssessmentService.completeAssessment(assessment.id, structuredResponses);

      // Navigate back to loans page with success message
      navigate('/dashboard/loans', {
        state: {
          message: 'ESG Assessment submitted successfully! Our AI will analyze your responses.',
          type: 'success'
        }
      });

    } catch (error) {
      console.error('Error submitting ESG form:', error);
      alert('Failed to submit ESG compliance form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get completion rating based on percentage
  const getCompletionRating = (percentage) => {
    if (percentage === 100) return { rating: 'Ready to Submit', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 80) return { rating: 'Almost Complete', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 50) return { rating: 'In Progress', color: 'text-amber-600', bgColor: 'bg-amber-100' };
    return { rating: 'Getting Started', color: 'text-slate-600', bgColor: 'bg-slate-100' };
  };

  // Get category icon and color
  const getCategoryConfig = (key) => {
    if (key === 'environment') return { 
      icon: Leaf, 
      color: 'text-green-600', 
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'Environment'
    };
    if (key === 'social') return { 
      icon: Users, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      title: 'Social'
    };
    if (key === 'governance') return { 
      icon: Shield, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      title: 'Governance'
    };
    if (key.startsWith('stability')) return { 
      icon: DollarSign, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      title: 'Financial Stability'
    };
    return { 
      icon: AlertCircle, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      title: 'Other'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading ESG Assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard/loans')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Loans
          </button>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">No assessment data found</p>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletionPercentage();
  const completionRating = getCompletionRating(completionPercentage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/loans')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Loans
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">ESG Compliance Questionnaire</h1>
              <p className="text-slate-600">Environmental, Social & Governance Assessment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Display */}
        {Object.keys(responses).length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Assessment Progress</h2>
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">{completionPercentage}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-slate-400 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${completionRating.bgColor} ${completionRating.color}`}>
                {completionRating.rating}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Complete all questions to submit for AI analysis and scoring
            </p>
          </div>
        )}

        {/* Questions from Supabase */}
        <div className="space-y-8">
          {Object.entries(assessment.questions).map(([key, question]) => {
            const config = getCategoryConfig(key);
            const IconComponent = config.icon;
            
            return (
              <div key={key} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                {/* Category Header */}
                <div className={`${config.bgColor} ${config.borderColor} border-b px-6 py-4`}>
                  <div className="flex items-center gap-3">
                    <IconComponent className={`${config.color}`} size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">{config.title}</h3>
                  </div>
                </div>

                {/* Question */}
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">
                      {question.question}
                    </h4>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Response *
                    </label>
                    <textarea
                      value={responses[key] || ''}
                      onChange={(e) => handleResponseChange(key, e.target.value)}
                      placeholder="Please provide your detailed response..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-vertical"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Section */}
        <div className="mt-8 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {isFormComplete() ? 'Ready to Submit' : 'Complete All Questions'}
              </h3>
              <p className="text-sm text-slate-600">
                {isFormComplete() 
                  ? `Assessment ready for submission (${completionPercentage}% complete)`
                  : `${Object.values(responses).filter(r => r && r.trim()).length} of ${Object.keys(assessment.questions).length} questions answered`
                }
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isFormComplete() || submitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isFormComplete() && !submitting
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
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
                  Submit for AI Analysis
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
              <h4 className="font-medium text-blue-900 mb-1">Why ESG Compliance Matters</h4>
              <p className="text-sm text-blue-700">
                ESG (Environmental, Social, and Governance) factors help us assess your business's 
                sustainability and social impact. A higher ESG score may lead to better loan terms 
                and demonstrates your commitment to responsible business practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGComplianceForm;