// client/src/components/ESGComplianceForm.jsx 

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, CheckCircle, Leaf, Users, Shield, 
  HelpCircle, BarChart3, Award, AlertCircle, Clock
} from 'lucide-react';

const ESGComplianceForm = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  // ESG questionnaire data
  const esgCategories = [
    {
      id: 'environmental',
      title: 'Environmental Impact',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      questions: [
        {
          id: 'waste_management',
          question: 'How does your business manage waste?',
          description: 'Consider waste segregation, disposal methods, and reduction efforts.',
          options: [
            { value: 'proper_disposal', label: 'Proper waste segregation and disposal', points: 3 },
            { value: 'recycling', label: 'Active recycling and waste reduction programs', points: 4 },
            { value: 'minimal_management', label: 'Basic waste disposal only', points: 2 },
            { value: 'no_policy', label: 'No specific waste management policy', points: 1 }
          ]
        },
        {
          id: 'energy_usage',
          question: 'What type of energy sources does your business primarily use?',
          description: 'Consider electricity, fuel, and renewable energy adoption.',
          options: [
            { value: 'renewable', label: 'Renewable energy sources (solar, wind, etc.)', points: 4 },
            { value: 'mixed', label: 'Mix of traditional and renewable sources', points: 3 },
            { value: 'efficient_traditional', label: 'Energy-efficient traditional sources', points: 2 },
            { value: 'traditional', label: 'Traditional energy sources only', points: 1 }
          ]
        },
        {
          id: 'environmental_policies',
          question: 'Does your business have environmental policies?',
          description: 'Written policies, training, or initiatives for environmental protection.',
          options: [
            { value: 'comprehensive', label: 'Comprehensive environmental policies and training', points: 4 },
            { value: 'basic_policies', label: 'Basic environmental guidelines', points: 3 },
            { value: 'informal_practices', label: 'Informal environmental practices', points: 2 },
            { value: 'none', label: 'No specific environmental policies', points: 1 }
          ]
        }
      ]
    },
    {
      id: 'social',
      title: 'Social Responsibility',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      questions: [
        {
          id: 'employee_welfare',
          question: 'How does your business support employee welfare?',
          description: 'Consider benefits, training, work-life balance, and development opportunities.',
          options: [
            { value: 'comprehensive', label: 'Comprehensive benefits and development programs', points: 4 },
            { value: 'basic_benefits', label: 'Basic benefits and fair compensation', points: 3 },
            { value: 'compliance_only', label: 'Legal compliance requirements only', points: 2 },
            { value: 'minimal', label: 'Minimal employee support', points: 1 }
          ]
        },
        {
          id: 'community_impact',
          question: 'How does your business contribute to the local community?',
          description: 'Consider local hiring, community programs, and social initiatives.',
          options: [
            { value: 'active_programs', label: 'Active community programs and partnerships', points: 4 },
            { value: 'local_hiring', label: 'Local hiring and sourcing preferences', points: 3 },
            { value: 'basic_participation', label: 'Basic community participation', points: 2 },
            { value: 'no_programs', label: 'No specific community programs', points: 1 }
          ]
        },
        {
          id: 'diversity_inclusion',
          question: 'How does your business promote diversity and inclusion?',
          description: 'Consider equal opportunities, non-discrimination, and inclusive practices.',
          options: [
            { value: 'formal_policies', label: 'Formal diversity policies and inclusive hiring', points: 4 },
            { value: 'equal_opportunity', label: 'Equal opportunity practices', points: 3 },
            { value: 'basic_fairness', label: 'Basic fairness in employment', points: 2 },
            { value: 'no_policies', label: 'No specific diversity policies', points: 1 }
          ]
        }
      ]
    },
    {
      id: 'governance',
      title: 'Governance & Ethics',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      questions: [
        {
          id: 'business_ethics',
          question: 'How does your business ensure ethical practices?',
          description: 'Consider ethics policies, training, and compliance measures.',
          options: [
            { value: 'written_policies', label: 'Written ethics policies and regular training', points: 4 },
            { value: 'clear_guidelines', label: 'Clear ethical guidelines for all staff', points: 3 },
            { value: 'basic_standards', label: 'Basic ethical standards followed', points: 2 },
            { value: 'informal', label: 'Informal ethical practices only', points: 1 }
          ]
        },
        {
          id: 'transparency',
          question: 'How transparent is your business with stakeholders?',
          description: 'Consider financial reporting, communication, and disclosure practices.',
          options: [
            { value: 'regular_reporting', label: 'Regular reporting and open communication', points: 4 },
            { value: 'stakeholder_updates', label: 'Regular stakeholder updates', points: 3 },
            { value: 'basic_disclosure', label: 'Basic disclosure when required', points: 2 },
            { value: 'minimal', label: 'Minimal transparency', points: 1 }
          ]
        },
        {
          id: 'compliance',
          question: 'How does your business handle regulatory compliance?',
          description: 'Consider permits, licenses, tax compliance, and regulatory adherence.',
          options: [
            { value: 'proactive', label: 'Proactive compliance management and monitoring', points: 4 },
            { value: 'systematic', label: 'Systematic compliance tracking', points: 3 },
            { value: 'reactive', label: 'Reactive compliance when required', points: 2 },
            { value: 'minimal', label: 'Minimal compliance efforts', points: 1 }
          ]
        }
      ]
    }
  ];

  // Calculate ESG score
  const calculateEsgScore = () => {
    let totalPoints = 0;
    let maxPoints = 0;
    
    esgCategories.forEach(category => {
      category.questions.forEach(q => {
        maxPoints += 4; // Maximum points per question
        const response = responses[q.id];
        if (response) {
          const option = q.options.find(opt => opt.value === response);
          if (option) totalPoints += option.points;
        }
      });
    });

    return maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  };

  // Check if form is complete
  const isFormComplete = () => {
    const totalQuestions = esgCategories.reduce((count, cat) => count + cat.questions.length, 0);
    return Object.keys(responses).length === totalQuestions;
  };

  // Handle response change
  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormComplete()) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const esgScore = calculateEsgScore();
      
      // Calculate category scores
      const categoryScores = {};
      esgCategories.forEach(category => {
        let categoryPoints = 0;
        let categoryMaxPoints = 0;
        
        category.questions.forEach(q => {
          categoryMaxPoints += 4;
          const response = responses[q.id];
          if (response) {
            const option = q.options.find(opt => opt.value === response);
            if (option) categoryPoints += option.points;
          }
        });
        
        categoryScores[category.id] = Math.round((categoryPoints / categoryMaxPoints) * 100);
      });

      const submissionData = {
        applicationId,
        userId: applicationData?.userId,
        esgResponses: responses,
        esgScore,
        categoryScores,
        submittedAt: new Date().toISOString(),
        workflow_type: 'esg_compliance'
      };

      // Submit to n8n webhook
      const response = await fetch('https://sikap-2025.app.n8n.cloud/webhook/esg-compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Redirect back to loans page with success message
      navigate('/dashboard/loans', {
        state: {
          message: `ESG Compliance completed! Your ESG Score: ${esgScore}%`,
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

  // Get ESG rating based on score
  const getEsgRating = (score) => {
    if (score >= 90) return { rating: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 80) return { rating: 'Very Good', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 70) return { rating: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 60) return { rating: 'Fair', color: 'text-amber-600', bgColor: 'bg-amber-100' };
    return { rating: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const currentScore = calculateEsgScore();
  const scoreRating = getEsgRating(currentScore);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
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
        {/* Score Display */}
        {Object.keys(responses).length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Current ESG Score</h2>
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">{currentScore}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${currentScore}%` }}
                ></div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${scoreRating.bgColor} ${scoreRating.color}`}>
                {scoreRating.rating}
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Complete all questions to get your final ESG compliance score
            </p>
          </div>
        )}

        {/* ESG Categories */}
        <div className="space-y-8">
          {esgCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className={`${category.bgColor} ${category.borderColor} border-b px-6 py-4`}>
                <div className="flex items-center gap-3">
                  <category.icon className={`${category.color}`} size={24} />
                  <h3 className="text-lg font-semibold text-slate-900">{category.title}</h3>
                </div>
              </div>

              {/* Questions */}
              <div className="p-6 space-y-6">
                {category.questions.map((question, qIndex) => (
                  <div key={question.id} className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">
                        {qIndex + 1}. {question.question}
                      </h4>
                      <p className="text-sm text-slate-600">{question.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            responses[question.id] === option.value
                              ? 'border-red-300 bg-red-50'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.value}
                            checked={responses[question.id] === option.value}
                            onChange={(e) => handleResponseChange(question.id, e.target.value)}
                            className="mt-1 text-red-600 focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-slate-900">{option.label}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              Impact Score: {option.points}/4
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
                  ? `Your ESG compliance score: ${currentScore}% (${scoreRating.rating})`
                  : `${Object.keys(responses).length} of ${esgCategories.reduce((count, cat) => count + cat.questions.length, 0)} questions answered`
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
                  Submit ESG Compliance
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