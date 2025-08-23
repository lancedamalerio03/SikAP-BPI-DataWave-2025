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

      // Parse and structure the questions
      const questions = {
        environment: {
          category: 'Environment',
          question: data.environment?.question || '',
          response: data.environment?.response || ''
        },
        social: {
          category: 'Social',
          question: data.social?.question || '',
          response: data.social?.response || ''
        },
        governance: {
          category: 'Governance',
          question: data.governance?.question || '',
          response: data.governance?.response || ''
        },
        stability_1: {
          category: 'Financial Stability 1',
          question: data.stability_1?.question || '',
          response: data.stability_1?.response || ''
        },
        stability_2: {
          category: 'Financial Stability 2',
          question: data.stability_2?.question || '',
          response: data.stability_2?.response || ''
        },
        stability_3: {
          category: 'Financial Stability 3',
          question: data.stability_3?.question || '',
          response: data.stability_3?.response || ''
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
   * Update ESG assessment responses
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
          question: responses.environment?.question || '',
          response: responses.environment?.response || null
        },
        social: {
          question: responses.social?.question || '',
          response: responses.social?.response || null
        },
        governance: {
          question: responses.governance?.question || '',
          response: responses.governance?.response || null
        },
        stability_1: {
          question: responses.stability_1?.question || '',
          response: responses.stability_1?.response || null
        },
        stability_2: {
          question: responses.stability_2?.question || '',
          response: responses.stability_2?.response || null
        },
        stability_3: {
          question: responses.stability_3?.question || '',
          response: responses.stability_3?.response || null
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
   * Complete ESG assessment and calculate score
   * @param {string} assessmentId - The ESG assessment ID
   * @param {Object} responses - The final responses
   * @returns {Promise} - Completed assessment data
   */
  async completeAssessment(assessmentId, responses) {
    try {
      console.log('Completing ESG assessment:', assessmentId)

      // Calculate a basic ESG score (you can implement more sophisticated scoring)
      const esgScore = this.calculateESGScore(responses)

      const updateData = {
        environment: {
          question: responses.environment?.question || '',
          response: responses.environment?.response || null
        },
        social: {
          question: responses.social?.question || '',
          response: responses.social?.response || null
        },
        governance: {
          question: responses.governance?.question || '',
          response: responses.governance?.response || null
        },
        stability_1: {
          question: responses.stability_1?.question || '',
          response: responses.stability_1?.response || null
        },
        stability_2: {
          question: responses.stability_2?.question || '',
          response: responses.stability_2?.response || null
        },
        stability_3: {
          question: responses.stability_3?.question || '',
          response: responses.stability_3?.response || null
        },
        esg_score: esgScore,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('esg_assessments')
        .update(updateData)
        .eq('id', assessmentId)
        .select()
        .single()

      if (error) {
        console.error('Error completing ESG assessment:', error)
        throw error
      }

      return data

    } catch (error) {
      console.error('Error in completeAssessment:', error)
      throw error
    }
  },

  /**
   * Calculate ESG Score based on responses
   * This is a basic implementation - you can make it more sophisticated
   * @param {Object} responses - The responses object
   * @returns {number} - ESG score (0-100)
   */
  calculateESGScore(responses) {
    let totalScore = 0
    let answeredQuestions = 0

    // Simple scoring: each answered question gets points
    Object.values(responses).forEach(response => {
      if (response?.response && response.response.trim() !== '') {
        answeredQuestions++
        // Give basic points for having an answer (you can implement more sophisticated scoring)
        totalScore += 16.67 // 100/6 questions = ~16.67 points per question
      }
    })

    // Return score rounded to nearest integer
    return Math.round(totalScore)
  },

  /**
   * Check if user has ESG assessment for their loan
   * @param {string} applicationId - The preloan_applications ID
   * @returns {Promise<boolean>} - Whether assessment exists
   */
  async hasAssessment(applicationId) {
    try {
      const { data, error } = await supabase
        .from('esg_assessments')
        .select('id')
        .eq('application_id', applicationId)
        .maybeSingle()

      if (error) {
        console.error('Error checking ESG assessment:', error)
        return false
      }

      return !!data

    } catch (error) {
      console.error('Error in hasAssessment:', error)
      return false
    }
  }
}