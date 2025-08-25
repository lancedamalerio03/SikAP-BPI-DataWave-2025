// client/src/services/esgAssessmentService.js
import { supabase } from '../lib/supabase'

export const esgAssessmentService = {
  /**
   * Get ESG assessment questions for a specific loan application
   * @param {string} applicationId - The preloan_applications ID
   * @returns {Promise} - ESG assessment data
   */
  async getAssessmentQuestions(applicationId) {
    try {
      console.log('Fetching ESG assessment for application:', applicationId)
      
      const { data, error } = await supabase
        .from('esg_assessments')
        .select('*')
        .eq('application_id', applicationId)
        .single()

      if (error) {
        console.error('Error fetching ESG assessment:', error)
        throw error
      }

      if (!data) {
        throw new Error('No ESG assessment found for this application')
      }

      // Parse and structure the questions based on the new format
      const questions = {
        environment: {
          questions: data.environment?.questions || [],
          responses: data.environment?.responses || []
        },
        social: {
          questions: data.social?.questions || [],
          responses: data.social?.responses || []
        },
        governance: {
          questions: data.governance?.questions || [],
          responses: data.governance?.responses || []
        },
        stability_1: {
          questions: data.stability_1?.questions || [],
          responses: data.stability_1?.responses || []
        },
        stability_2: {
          questions: data.stability_2?.questions || [],
          responses: data.stability_2?.responses || []
        },
        stability_3: {
          questions: data.stability_3?.questions || [],
          responses: data.stability_3?.responses || []
        }
      }

      return {
        id: data.id,
        application_id: data.application_id,
        questions,
        esg_score: data.esg_score,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
        completed_at: data.completed_at
      }

    } catch (error) {
      console.error('Error in getAssessmentQuestions:', error)
      throw error
    }
  },

  /**
   * Update ESG assessment responses (for auto-save functionality)
   * @param {string} assessmentId - The ESG assessment ID
   * @param {Object} responses - The responses object
   * @returns {Promise} - Updated assessment data
   */
  async updateAssessmentResponses(assessmentId, responses) {
    try {
      console.log('Updating ESG assessment responses:', assessmentId, responses)

      // Structure the responses back to the JSONB format expected by the database
      const updateData = {
        environment: {
          questions: responses.environment?.questions || [],
          responses: responses.environment?.responses || []
        },
        social: {
          questions: responses.social?.questions || [],
          responses: responses.social?.responses || []
        },
        governance: {
          questions: responses.governance?.questions || [],
          responses: responses.governance?.responses || []
        },
        stability_1: {
          questions: responses.stability_1?.questions || [],
          responses: responses.stability_1?.responses || []
        },
        stability_2: {
          questions: responses.stability_2?.questions || [],
          responses: responses.stability_2?.responses || []
        },
        stability_3: {
          questions: responses.stability_3?.questions || [],
          responses: responses.stability_3?.responses || []
        },
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('esg_assessments')
        .update(updateData)
        .eq('id', assessmentId)
        .select()
        .single()

      if (error) {
        console.error('Error updating ESG assessment:', error)
        throw error
      }

      return data

    } catch (error) {
      console.error('Error in updateAssessmentResponses:', error)
      throw error
    }
  },

  /**
   * Get assessment by ID
   * @param {string} assessmentId - The ESG assessment ID
   * @returns {Promise} - Assessment data
   */
  async getAssessmentById(assessmentId) {
    try {
      const { data, error } = await supabase
        .from('esg_assessments')
        .select('*')
        .eq('id', assessmentId)
        .single()

      if (error) {
        console.error('Error fetching assessment by ID:', error)
        throw error
      }

      return data

    } catch (error) {
      console.error('Error in getAssessmentById:', error)
      throw error
    }
  },

  /**
   * Create a new ESG assessment (usually called by n8n workflow)
   * @param {string} applicationId - The preloan_applications ID
   * @param {Object} questionsData - The questions data from n8n workflow
   * @returns {Promise} - Created assessment data
   */
  async createAssessment(applicationId, questionsData) {
    try {
      console.log('Creating ESG assessment for application:', applicationId)

      const assessmentData = {
        application_id: applicationId,
        environment: questionsData.environment || { questions: [], responses: [] },
        social: questionsData.social || { questions: [], responses: [] },
        governance: questionsData.governance || { questions: [], responses: [] },
        stability_1: questionsData.stability_1 || { questions: [], responses: [] },
        stability_2: questionsData.stability_2 || { questions: [], responses: [] },
        stability_3: questionsData.stability_3 || { questions: [], responses: [] },
        esg_score: null,
        status: 'generated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('esg_assessments')
        .insert(assessmentData)
        .select()
        .single()

      if (error) {
        console.error('Error creating ESG assessment:', error)
        throw error
      }

      return data

    } catch (error) {
      console.error('Error in createAssessment:', error)
      throw error
    }
  },

  /**
   * Delete an ESG assessment
   * @param {string} assessmentId - The ESG assessment ID
   * @returns {Promise} - Deletion result
   */
  async deleteAssessment(assessmentId) {
    try {
      const { data, error } = await supabase
        .from('esg_assessments')
        .delete()
        .eq('id', assessmentId)
        .select()

      if (error) {
        console.error('Error deleting ESG assessment:', error)
        throw error
      }

      return data

    } catch (error) {
      console.error('Error in deleteAssessment:', error)
      throw error
    }
  },

  /**
   * Get all assessments for a specific application
   * @param {string} applicationId - The preloan_applications ID
   * @returns {Promise} - Array of assessments
   */
  async getAssessmentsByApplicationId(applicationId) {
    try {
      const { data, error } = await supabase
        .from('esg_assessments')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching assessments by application ID:', error)
        throw error
      }

      return data || []

    } catch (error) {
      console.error('Error in getAssessmentsByApplicationId:', error)
      throw error
    }
  },

  /**
   * Calculate basic ESG Score (for reference - actual scoring done by AI)
   * @param {Object} responses - All category responses
   * @returns {number} - ESG score (0-100)
   */
  calculateBasicESGScore(responses) {
    try {
      let totalScore = 0
      let categoryCount = 0

      // Score each category
      Object.keys(responses).forEach(categoryKey => {
        const category = responses[categoryKey]
        if (category && category.responses && category.responses.length > 0) {
          let categoryScore = 0
          let validResponses = 0

          category.responses.forEach((response, index) => {
            if (response && response.toString().trim() !== '') {
              const isOpenEnded = index === 0
              const isLikertScale = index > 0

              if (isOpenEnded) {
                // Score open-ended responses based on content quality
                const responseLength = response.length
                if (responseLength > 100) {
                  categoryScore += 90 // Excellent detailed response
                } else if (responseLength > 50) {
                  categoryScore += 80 // Good response
                } else if (responseLength > 20) {
                  categoryScore += 70 // Adequate response
                } else {
                  categoryScore += 50 // Minimal response
                }
              } else if (isLikertScale) {
                // Score Likert scale responses (1-5 scale)
                const numericValue = parseInt(response)
                if (numericValue >= 4) {
                  categoryScore += 85 // Positive responses (4-5)
                } else if (numericValue === 3) {
                  categoryScore += 65 // Neutral response
                } else if (numericValue >= 1) {
                  categoryScore += 40 // Negative responses (1-2)
                } else {
                  categoryScore += 0 // Invalid response
                }
              }
              
              validResponses++
            }
          })

          if (validResponses > 0) {
            totalScore += categoryScore / validResponses
            categoryCount++
          }
        }
      })

      // Calculate average score across categories
      const finalScore = categoryCount > 0 ? Math.round(totalScore / categoryCount) : 0
      
      // Ensure score is within 0-100 range
      return Math.max(0, Math.min(100, finalScore))

    } catch (error) {
      console.error('Error calculating ESG score:', error)
      return 0
    }
  },

  /**
   * Get ESG assessment statistics for dashboard
   * @param {string} applicationId - The preloan_applications ID
   * @returns {Promise} - Assessment statistics
   */
  async getAssessmentStats(applicationId) {
    try {
      const { data, error } = await supabase
        .from('esg_assessments')
        .select('status, esg_score, created_at, completed_at')
        .eq('application_id', applicationId)

      if (error) {
        console.error('Error fetching assessment stats:', error)
        throw error
      }

      const stats = {
        total: data.length,
        completed: data.filter(a => a.status === 'completed').length,
        pending: data.filter(a => a.status === 'generated').length,
        average_score: 0,
        latest_score: null,
        completion_rate: 0
      }

      const completedAssessments = data.filter(a => a.esg_score !== null)
      if (completedAssessments.length > 0) {
        stats.average_score = Math.round(
          completedAssessments.reduce((sum, a) => sum + a.esg_score, 0) / completedAssessments.length
        )
        stats.latest_score = completedAssessments[completedAssessments.length - 1].esg_score
      }

      if (stats.total > 0) {
        stats.completion_rate = Math.round((stats.completed / stats.total) * 100)
      }

      return stats

    } catch (error) {
      console.error('Error in getAssessmentStats:', error)
      throw error
    }
  },

  /**
   * Check if ESG assessment exists for application
   * @param {string} applicationId - The preloan_applications ID
   * @returns {Promise<boolean>} - Whether assessment exists
   */
  async hasAssessment(applicationId) {
    try {
      const { data, error } = await supabase
        .from('esg_assessments')
        .select('id')
        .eq('application_id', applicationId)
        .limit(1)

      if (error) {
        console.error('Error checking assessment existence:', error)
        return false
      }

      return data && data.length > 0

    } catch (error) {
      console.error('Error in hasAssessment:', error)
      return false
    }
  },

  /**
   * Update assessment status
   * @param {string} assessmentId - The ESG assessment ID
   * @param {string} status - New status ('generated', 'completed', 'analyzed')
   * @param {number|null} esgScore - Optional ESG score
   * @returns {Promise} - Updated assessment data
   */
  async updateAssessmentStatus(assessmentId, status, esgScore = null) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'completed' && !updateData.completed_at) {
        updateData.completed_at = new Date().toISOString()
      }

      if (esgScore !== null) {
        updateData.esg_score = esgScore
      }

      const { data, error } = await supabase
        .from('esg_assessments')
        .update(updateData)
        .eq('id', assessmentId)
        .select()
        .single()

      if (error) {
        console.error('Error updating assessment status:', error)
        throw error
      }

      return data

    } catch (error) {
      console.error('Error in updateAssessmentStatus:', error)
      throw error
    }
  }
}