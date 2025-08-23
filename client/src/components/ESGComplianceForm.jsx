// client/src/components/ESGComplianceForm.jsx 
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Leaf, Users, Shield, 
  HelpCircle, BarChart3, Award, AlertCircle, Clock, DollarSign
} from 'lucide-react';
import { esgAssessmentService } from '../services/esgAssessmentService';
import webhookService from '../services/webhookService';
import { supabase } from '../lib/supabase';

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
      Object.keys(assessmentData.questions).forEach(categoryKey => {
        initialResponses[categoryKey] = {};
        assessmentData.questions[categoryKey].questions.forEach((question, index) => {
          initialResponses[categoryKey][index] = assessmentData.questions[categoryKey].responses[index] || '';
        });
      });
      
      setResponses(initialResponses);
      
    } catch (err) {
      console.error('Error loading assessment:', err);
      setError('Failed to load ESG assessment questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (categoryKey, questionIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        [questionIndex]: value
      }
    }));
  };

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    if (!assessment) return 0;
    
    let totalQuestions = 0;
    let answeredQuestions = 0;
    
    Object.keys(assessment.questions).forEach(categoryKey => {
      const categoryQuestions = assessment.questions[categoryKey].questions;
      totalQuestions += categoryQuestions.length;
      
      categoryQuestions.forEach((question, index) => {
        if (responses[categoryKey]?.[index] && responses[categoryKey][index].trim() !== '') {
          answeredQuestions++;
        }
      });
    });
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Check if form is complete
  const isFormComplete = () => {
    if (!assessment) return false;
    
    return Object.keys(assessment.questions).every(categoryKey => {
      const categoryQuestions = assessment.questions[categoryKey].questions;
      return categoryQuestions.every((question, index) => 
        responses[categoryKey]?.[index] && responses[categoryKey][index].trim() !== ''
      );
    });
  };

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      alert('Please answer all questions before submitting.');
      return;
    }

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
      
      // Structure responses for the webhook
      const structuredResponses = {};
      Object.keys(assessment.questions).forEach(categoryKey => {
        structuredResponses[categoryKey] = {
          questions: assessment.questions[categoryKey].questions,
          responses: assessment.questions[categoryKey].questions.map((_, index) => 
            responses[categoryKey][index] || null
          )
        };
      });

      // Prepare the complete ESG data for webhook submission
      const esgSubmissionData = {
        id: assessment.id,
        application_id: assessment.application_id,
        environment: structuredResponses.environment,
        social: structuredResponses.social,
        governance: structuredResponses.governance,
        stability_1: structuredResponses.stability_1,
        stability_2: structuredResponses.stability_2,
        stability_3: structuredResponses.stability_3,
        created_at: assessment.created_at,
        updated_at: assessment.updated_at
      };

      console.log('Submitting ESG assessment to n8n webhook...');
      
      // Submit to webhook instead of direct database update
      const webhookResult = await webhookService.submitESGAssessment(
        applicationId, 
        esgSubmissionData, 
        currentUser
      );
      
      console.log('ESG webhook response:', webhookResult);

      // Navigate back to loans page with success message
      navigate('/dashboard/loans', {
        state: {
          message: 'ESG Assessment submitted successfully! Our AI will analyze your responses and update the database.',
          type: 'success'
        }
      });

    } catch (error) {
      console.error('Error submitting ESG form:', error);
      alert(`Failed to submit ESG compliance form: ${error.message}. Please try again.`);
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
      title: 'Environmental'
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
      title: `Financial Stability ${key.split('_')[1]}`
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
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Assessment</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={loadAssessment}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!assessment || !assessment.questions) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <p className="text-slate-600">No assessment questions available.</p>
        </div>
      </div>
    );
  }

  const completionPercentage = calculateCompletionPercentage();
  const completionRating = getCompletionRating(completionPercentage);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/dashboard/loans')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Loans
            </button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                ESG Compliance Assessment
              </h1>
              <p className="text-slate-600 max-w-2xl">
                Complete this assessment to help us understand your business's environmental, 
                social, and governance practices. Your responses will be analyzed by our AI system.
              </p>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${completionRating.bgColor} ${completionRating.color}`}>
                <BarChart3 size={16} />
                {completionRating.rating}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {completionPercentage}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">Assessment Progress</h3>
            <span className="text-sm font-medium text-slate-600">
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Questions by Category */}
        <div className="space-y-6">
          {Object.keys(assessment.questions).map((categoryKey) => {
            const category = assessment.questions[categoryKey];
            const config = getCategoryConfig(categoryKey);
            const IconComponent = config.icon;

            return (
              <div key={categoryKey} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                {/* Category Header */}
                <div className={`${config.bgColor} ${config.borderColor} border-b px-6 py-4`}>
                  <div className="flex items-center gap-3">
                    <IconComponent className={`${config.color}`} size={24} />
                    <h3 className="text-lg font-semibold text-slate-900">{config.title}</h3>
                    <span className="text-sm text-slate-600">
                      ({category.questions.length} question{category.questions.length > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-6 space-y-6">
                  {category.questions.map((question, questionIndex) => {
                    const isOpenEnded = questionIndex === 0;
                    const isLikertScale = questionIndex > 0;
                    
                    return (
                      <div key={questionIndex} className="border-b border-slate-100 last:border-b-0 pb-6 last:pb-0">
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-slate-900">
                              Question {questionIndex + 1}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              isOpenEnded 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {isOpenEnded ? 'Open-ended' : 'Likert Scale'}
                            </span>
                          </div>
                          <p className="text-slate-700">
                            {question}
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Your Response *
                          </label>
                          
                          {isOpenEnded ? (
                            // Open-ended question - textarea
                            <textarea
                              value={responses[categoryKey]?.[questionIndex] || ''}
                              onChange={(e) => handleResponseChange(categoryKey, questionIndex, e.target.value)}
                              placeholder="Please provide your detailed response..."
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-vertical"
                              rows={4}
                            />
                          ) : (
                            // Likert scale question - radio buttons
                            <div className="space-y-2">
                              {[
                                { value: '5', label: 'Strongly Agree', color: 'text-green-700 border-green-300' },
                                { value: '4', label: 'Agree', color: 'text-green-600 border-green-200' },
                                { value: '3', label: 'Neutral', color: 'text-yellow-600 border-yellow-200' },
                                { value: '2', label: 'Disagree', color: 'text-red-600 border-red-200' },
                                { value: '1', label: 'Strongly Disagree', color: 'text-red-700 border-red-300' }
                              ].map((option) => (
                                <label key={option.value} className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-50 ${
                                  responses[categoryKey]?.[questionIndex] === option.value
                                    ? `${option.color} bg-slate-50`
                                    : 'border-slate-200'
                                }`}>
                                  <input
                                    type="radio"
                                    name={`${categoryKey}-${questionIndex}`}
                                    value={option.value}
                                    checked={responses[categoryKey]?.[questionIndex] === option.value}
                                    onChange={(e) => handleResponseChange(categoryKey, questionIndex, e.target.value)}
                                    className="sr-only"
                                  />
                                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                    responses[categoryKey]?.[questionIndex] === option.value
                                      ? 'border-red-500 bg-red-500'
                                      : 'border-slate-300'
                                  }`}>
                                    {responses[categoryKey]?.[questionIndex] === option.value && (
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  <span className="font-medium text-slate-900">{option.label}</span>
                                  <span className="ml-auto text-sm text-slate-500">({option.value})</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                  ? `Assessment ready for AI analysis (${completionPercentage}% complete)`
                  : `Please answer all questions to proceed with submission`
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