// client/src/services/loanOfficerService.js
import { supabase } from '../lib/supabase';

export class LoanOfficerService {
  
  /**
   * Fetch all loan applications with borrower details for loan officer dashboard
   * @param {Object} filters - Filtering options
   * @returns {Promise<Array>} Array of loan applications with borrower information
   */
     static async fetchLoanApplications(filters = {}) {
     try {
       console.log('🔄 Fetching loan applications for officer dashboard...');
       console.log('Filters:', filters);
       
       if (!supabase) {
         console.log('Supabase not configured, returning mock data');
         return this.getMockLoanApplications(filters);
       }

       console.log('✅ Supabase client available, querying database...');

       // Since preloan_applications.user_id references auth.users(id), not users_profiles(id),
       // we need to do manual joins. First, let's get the loan applications.
       
                // Only fetch the specific loan applications requested
         const allowedLoanIds = [
           'd08a4a19-b314-407e-a74e-097fc125e3cb',
           '7c7f429e-e1e3-4f15-a060-c941a12515fd'
         ];
         console.log('🔒 Restricting to specific loan IDs:', allowedLoanIds);

         let loansQuery = supabase
           .from('preloan_applications')
           .select('*')
           .in('id', allowedLoanIds)
           .order('created_at', { ascending: false });

       // Apply filters to loans query
       if (filters.status && filters.status !== 'all') {
         loansQuery = loansQuery.eq('status', filters.status);
       }

       // Note: Removed general limit filter since we're already limiting to specific IDs

       console.log('📋 Fetching loan applications...');
       const { data: loans, error: loansError } = await loansQuery;

       if (loansError) {
         console.error('❌ Error fetching loan applications:', loansError);
         return this.getMockLoanApplications(filters);
       }

       console.log(`✅ Fetched ${loans?.length || 0} loan applications`);

       if (!loans || loans.length === 0) {
         console.log('📝 No loan applications found');
         return [];
       }

       // Now fetch user profiles for these loans using the user_id
       // The user_id in preloan_applications corresponds to auth.users.id, 
       // which should match users_profiles.id (assuming users_profiles.id is the same UUID)
       const userIds = [...new Set(loans.map(loan => loan.user_id).filter(Boolean))];
       let profiles = [];
       let employments = [];
       let addresses = [];
       let riskProfiles = [];
       let assetDeclarations = [];
       
       if (userIds.length > 0) {
         console.log(`👥 Fetching data for ${userIds.length} users...`);
         
         // Fetch user profiles
         const { data: profilesData, error: profilesError } = await supabase
           .from('users_profiles')
           .select('*')
           .in('id', userIds);
         
         if (!profilesError && profilesData) {
           profiles = profilesData;
           console.log(`✅ Fetched ${profiles.length} user profiles`);
         } else {
           console.error('⚠️ Error fetching profiles:', profilesError);
         }

         // Fetch employment data
         const { data: employmentData, error: employmentError } = await supabase
           .from('user_employment')
           .select('*')
           .in('user_id', userIds);
         
         if (!employmentError && employmentData) {
           employments = employmentData;
           console.log(`✅ Fetched ${employments.length} employment records`);
         } else {
           console.error('⚠️ Error fetching employment:', employmentError);
         }

         // Fetch addresses
         const { data: addressData, error: addressError } = await supabase
           .from('user_addresses')
           .select('*')
           .in('user_id', userIds);
         
         if (!addressError && addressData) {
           addresses = addressData;
           console.log(`✅ Fetched ${addresses.length} address records`);
         } else {
           console.error('⚠️ Error fetching addresses:', addressError);
         }

         // Fetch risk profiles
         const { data: riskData, error: riskError } = await supabase
           .from('preloan_risk_profiles')
           .select('*')
           .in('user_id', userIds);
         
         if (!riskError && riskData) {
           riskProfiles = riskData;
           console.log(`✅ Fetched ${riskProfiles.length} risk profiles`);
         } else {
           console.error('⚠️ Error fetching risk profiles:', riskError);
         }

         // Fetch asset declarations by applicationId (not user_id)
         const applicationIds = loans.map(loan => loan.id).filter(Boolean);
         if (applicationIds.length > 0) {
           const { data: assetData, error: assetError } = await supabase
             .from('assets_declarations')
             .select('*')
             .in('applicationId', applicationIds);
           
           if (!assetError && assetData) {
             assetDeclarations = assetData;
             console.log(`✅ Fetched ${assetDeclarations.length} asset declarations`);
           } else {
             console.error('⚠️ Error fetching asset declarations:', assetError);
           }
         }
       }

       // Apply search filter manually if specified
       let filteredLoans = loans;
       if (filters.search) {
         console.log(`🔍 Applying search filter: "${filters.search}"`);
         const searchLower = filters.search.toLowerCase();
         filteredLoans = loans.filter(loan => {
           const profile = profiles.find(p => p.id === loan.user_id);
           if (!profile) return false;
           
           const fullName = `${profile.first_name || ''} ${profile.middle_name || ''} ${profile.last_name || ''}`.toLowerCase();
           const email = (profile.email || '').toLowerCase();
           
           return fullName.includes(searchLower) || 
                  email.includes(searchLower) ||
                  loan.id.toLowerCase().includes(searchLower);
         });
         console.log(`🔍 Search filtered: ${filteredLoans.length} results`);
       }
       
       // Manually join the data
       const loansWithProfiles = filteredLoans.map(loan => ({
         ...loan,
         users_profiles: profiles.find(profile => profile.id === loan.user_id) || null,
         user_employment: employments.filter(emp => emp.user_id === loan.user_id),
         user_addresses: addresses.filter(addr => addr.user_id === loan.user_id),
         preloan_risk_profiles: riskProfiles.find(risk => risk.user_id === loan.user_id) || {},
         assets_declarations: assetDeclarations.filter(asset => asset.applicationId === loan.id)
       }));
       
       console.log(`✅ Manual join successful: ${loansWithProfiles.length} loans with profiles`);
       const transformedData = this.transformLoanData(loansWithProfiles);
       console.log('✅ Transformed data ready:', transformedData.length, 'applications');
       return transformedData;

     } catch (error) {
       console.error('❌ Exception in fetchLoanApplications:', error);
       return this.getMockLoanApplications(filters);
     }
   }

  /**
   * Transform raw database data into UI-friendly format
   * @param {Array} rawData - Raw data from database
   * @returns {Array} Transformed loan applications
   */
  static transformLoanData(rawData) {
    return rawData.map(loan => {
      const profile = loan.users_profiles;
      const employment = loan.user_employment?.[0] || {};
      const address = loan.user_addresses?.find(addr => addr.is_primary) || loan.user_addresses?.[0] || {};
      const riskProfile = loan.preloan_risk_profiles || {};
      const assets = loan.assets_declarations?.[0] || {};

      const borrowerName = [profile?.first_name, profile?.middle_name, profile?.last_name]
        .filter(Boolean)
        .join(' ') || 'Unknown Borrower';

      return {
        id: loan.id,
        borrowerName,
        borrowerEmail: profile?.email || '',
        borrowerPhone: profile?.mobile_number || '',
        borrowerType: this.getBorrowerType(employment),
        loanAmount: parseFloat(loan.loan_amount) || 0,
        loanPurpose: this.formatLoanPurpose(loan.loan_purpose),
        loanTenorMonths: loan.loan_tenor_months || 0,
        repaymentFrequency: loan.repayment_frequency || '',
        urgency: loan.urgency || '',
        status: loan.status || 'pending_documents',
        submittedDate: this.formatDate(loan.created_at),
        updatedDate: this.formatDate(loan.updated_at),
        location: this.formatLocation(address),
        aiRecommendation: loan.ai_decision || 'Pending Analysis',
        aiConfidence: loan.ai_confidence || 0,
        aiReasoning: loan.ai_reasoning || '',
        riskLevel: this.getRiskLevel(riskProfile),
        creditScore: riskProfile.credit_score || 0,
        monthlyIncome: employment.monthly_income || 0,
        employmentStatus: employment.employment_status || '',
        occupation: employment.occupation || '',
        employer: employment.employer_name || '',
        yearsOfEmployment: employment.years_of_employment || 0,
        
        // Document completion status
        documentsCompleted: loan.documents_completed || false,
        esgCompleted: loan.esg_completed || false,
        assetsCompleted: loan.assets_completed || false,
        
        // Borrower details
        borrowerDetails: {
          profile,
          employment,
          address,
          riskProfile,
          assets: assets.declared_assets || null,
          accountStatus: profile?.account_status || '',
          dateOfBirth: profile?.date_of_birth || '',
          gender: profile?.gender || '',
          civilStatus: profile?.civil_status || '',
          citizenship: profile?.citizenship || '',
          amlFlagged: riskProfile.aml_flagged || false,
          idVerified: riskProfile.id_verified || false,
          addressVerified: riskProfile.address_verified || false,
          membershipYear: riskProfile.membership_year || null
        },
        
        // Additional information
        additionalInformation: loan.additional_information || '',
        paymentTerms: this.calculatePaymentTerms(loan.loan_amount, loan.loan_tenor_months),
        collateral: this.determineCollateral(assets.declared_assets),
        
        // Risk assessment
        flags: this.generateRiskFlags(riskProfile, employment, loan),
        
        // UI helpers
        statusColor: this.getStatusColor(loan.status),
        riskColor: this.getRiskColor(this.getRiskLevel(riskProfile)),
        priorityScore: this.calculatePriorityScore(loan, riskProfile)
      };
    });
  }

  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Dashboard statistics
   */
     static async getDashboardStats() {
     try {
       console.log('📊 Fetching dashboard statistics...');
       
       if (!supabase) {
         console.log('Supabase not configured, using mock stats');
         return this.getMockDashboardStats();
       }

       const today = new Date().toISOString().split('T')[0];
       console.log('Today date for filtering:', today);

       // Only count the specific loan applications we're interested in
       const allowedLoanIds = [
         'd08a4a19-b314-407e-a74e-097fc125e3cb',
         '7c7f429e-e1e3-4f15-a060-c941a12515fd'
       ];
       console.log('🔒 Restricting stats to specific loan IDs:', allowedLoanIds);

       // Get counts for different statuses with error handling for each query
       console.log('Querying pending review applications...');
       const { count: pendingCount, error: pendingError } = await supabase
         .from('preloan_applications')
         .select('id', { count: 'exact', head: true })
         .in('id', allowedLoanIds)
         .in('status', ['pending_documents', 'documents_submitted', 'ready_for_review']);

       if (pendingError) console.error('Error fetching pending count:', pendingError);

       console.log('Querying approved today applications...');
       const { count: approvedCount, error: approvedError } = await supabase
         .from('preloan_applications')
         .select('id', { count: 'exact', head: true })
         .in('id', allowedLoanIds)
         .eq('status', 'approved')
         .gte('updated_at', today);

       if (approvedError) console.error('Error fetching approved count:', approvedError);

       console.log('Querying needs review applications...');
       const { count: needsReviewCount, error: needsReviewError } = await supabase
         .from('preloan_applications')
         .select('id', { count: 'exact', head: true })
         .in('id', allowedLoanIds)
         .in('status', ['needs_review', 'manual_review_required']);

       if (needsReviewError) console.error('Error fetching needs review count:', needsReviewError);

       console.log('Querying total applications...');
       const { count: totalCount, error: totalError } = await supabase
         .from('preloan_applications')
         .select('id', { count: 'exact', head: true })
         .in('id', allowedLoanIds);

       if (totalError) console.error('Error fetching total count:', totalError);

       const stats = {
         pendingReview: pendingCount || 0,
         approvedToday: approvedCount || 0,
         needsAttention: needsReviewCount || 0,
         totalApplications: totalCount || 0
       };

       console.log('✅ Dashboard stats fetched:', stats);
       return stats;

     } catch (error) {
       console.error('❌ Exception fetching dashboard stats:', error);
       return this.getMockDashboardStats();
     }
   }

  /**
   * Update loan application status
   * @param {string} loanId - Loan application ID
   * @param {string} newStatus - New status
   * @param {string} officerId - Loan officer ID
   * @param {string} notes - Optional notes
   * @returns {Promise<boolean>} Success status
   */
     static async updateLoanStatus(loanId, newStatus, officerId, notes = '') {
     try {
       console.log(`🔄 Updating loan ${loanId} to status: ${newStatus}`);
       
       if (!supabase) {
         console.log('Mock: Updated loan status', { loanId, newStatus, officerId, notes });
         return true;
       }

       // Only allow updates to specific loan IDs
       const allowedLoanIds = [
         'd08a4a19-b314-407e-a74e-097fc125e3cb',
         '7c7f429e-e1e3-4f15-a060-c941a12515fd'
       ];

       if (!allowedLoanIds.includes(loanId)) {
         console.error('❌ Cannot update loan: ID not in allowed list');
         return false;
       }

       const updateData = {
         status: newStatus,
         updated_at: new Date().toISOString()
       };

       // Only add ai_reasoning if notes are provided
       if (notes) {
         updateData.ai_reasoning = `Officer Notes: ${notes}`;
       }

       console.log('Update data:', updateData);

       const { data, error } = await supabase
         .from('preloan_applications')
         .update(updateData)
         .eq('id', loanId)
         .in('id', allowedLoanIds) // Extra safety check
         .select(); // Return the updated record

       if (error) {
         console.error('❌ Error updating loan status:', error);
         return false;
       }

       console.log(`✅ Successfully updated loan ${loanId} to status: ${newStatus}`, data);
       return true;

     } catch (error) {
       console.error('❌ Exception updating loan status:', error);
       return false;
     }
   }

  // Helper methods
  static getBorrowerType(employment) {
    const status = employment.employment_status || '';
    const occupation = employment.occupation || '';
    const business = employment.nature_of_business || '';
    
    if (status.includes('Self-employed') || status.includes('Business Owner')) {
      return `SEME - ${business || occupation || 'Business Owner'}`;
    }
    if (status.includes('Freelancer') || status.includes('Contractor')) {
      return `Freelancer - ${occupation || 'Service Provider'}`;
    }
    if (status.includes('OFW')) {
      return `OFW - ${occupation || 'Overseas Worker'}`;
    }
    if (occupation.toLowerCase().includes('driver') || occupation.toLowerCase().includes('rider')) {
      return `Gig Worker - ${occupation}`;
    }
    
    return `${status} - ${occupation || 'Employee'}`.replace(' - ', ' ') || 'Standard Employee';
  }

  static formatLoanPurpose(purpose) {
    const purposeMap = {
      business_expansion: 'Business Expansion',
      equipment_purchase: 'Equipment Purchase',
      vehicle_purchase: 'Vehicle Purchase',
      working_capital: 'Working Capital',
      debt_consolidation: 'Debt Consolidation',
      home_improvement: 'Home Improvement',
      education: 'Education',
      medical_expenses: 'Medical Expenses',
      emergency_fund: 'Emergency Fund',
      other: 'Other'
    };
    return purposeMap[purpose] || purpose || 'Other';
  }

  static formatLocation(address) {
    if (!address.city && !address.province) return 'Location Not Specified';
    return [address.city, address.province].filter(Boolean).join(', ');
  }

  static getRiskLevel(riskProfile) {
    const riskGrade = riskProfile.risk_grade;
    if (riskGrade) return riskGrade;
    
    const score = riskProfile.credit_score || 0;
    if (score >= 700) return 'Low';
    if (score >= 600) return 'Medium';
    return 'High';
  }

  static formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static calculatePaymentTerms(amount, tenorMonths) {
    if (!amount || !tenorMonths) return 'Pending calculation';
    
    // Simple calculation - in real app, would use proper interest rates
    const monthlyPayment = Math.round(amount / tenorMonths);
    return `${tenorMonths} months, ₱${monthlyPayment.toLocaleString()}/month`;
  }

  static determineCollateral(assets) {
    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return 'Clean loan - no collateral required';
    }
    
    const totalValue = assets.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0);
    const mainAsset = assets[0];
    
    if (totalValue > 0) {
      return `${mainAsset.asset_type} - ${mainAsset.description} (₱${totalValue.toLocaleString()} estimated value)`;
    }
    
    return 'Assets declared - pending valuation';
  }

  static generateRiskFlags(riskProfile, employment, loan) {
    const flags = [];
    
    if (riskProfile.aml_flagged) flags.push('AML Flagged');
    if (!riskProfile.id_verified) flags.push('ID Not Verified');
    if (!riskProfile.address_verified) flags.push('Address Not Verified');
    if (riskProfile.credit_score && riskProfile.credit_score < 600) flags.push('Low Credit Score');
    if (employment.years_of_employment && employment.years_of_employment < 1) flags.push('Limited Employment History');
    if (!loan.documents_completed) flags.push('Incomplete Documents');
    
    return flags;
  }

  static getStatusColor(status) {
    const colorMap = {
      pending_documents: 'bg-amber-100 text-amber-800',
      documents_submitted: 'bg-blue-100 text-blue-800',
      ready_for_review: 'bg-purple-100 text-purple-800',
      under_review: 'bg-indigo-100 text-indigo-800',
      needs_review: 'bg-orange-100 text-orange-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-emerald-100 text-emerald-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  static getRiskColor(risk) {
    const colorMap = {
      'Low': 'text-green-600',
      'Medium': 'text-amber-600',
      'High': 'text-red-600'
    };
    return colorMap[risk] || 'text-gray-600';
  }

  static calculatePriorityScore(loan, riskProfile) {
    let score = 0;
    
    // Higher priority for ready applications
    if (loan.status === 'ready_for_review') score += 10;
    if (loan.status === 'needs_review') score += 15;
    
    // Risk factors
    if (riskProfile.aml_flagged) score += 20;
    if (riskProfile.credit_score < 600) score += 5;
    
    // Urgency
    if (loan.urgency === 'urgent') score += 8;
    if (loan.urgency === 'very_urgent') score += 12;
    
    // Amount (higher amounts get priority)
    if (loan.loan_amount > 100000) score += 3;
    
    return score;
  }

  // Mock data methods
  static getMockDashboardStats() {
    return {
      pendingReview: 8,
      approvedToday: 3,
      needsAttention: 2,
      totalApplications: 45
    };
  }

  static getMockLoanApplications(filters = {}) {
    const mockData = [
      {
        id: 'mock-loan-1',
        borrowerName: 'Maria Santos',
        borrowerEmail: 'maria.santos@email.com',
        borrowerPhone: '+63917-123-4567',
        borrowerType: 'Gig Worker - GrabFood Driver',
        loanAmount: 75000,
        loanPurpose: 'Vehicle Purchase',
        loanTenorMonths: 24,
        repaymentFrequency: 'monthly',
        urgency: 'normal',
        status: 'ready_for_review',
        submittedDate: 'Mar 15, 2025',
        updatedDate: 'Mar 15, 2025',
        location: 'Quezon City, Metro Manila',
        aiRecommendation: 'Approve',
        aiConfidence: 0.85,
        aiReasoning: 'Stable gig income, consistent mobile wallet activity. Recommended for approval.',
        riskLevel: 'Medium',
        creditScore: 680,
        monthlyIncome: 25000,
        employmentStatus: 'Self-employed',
        occupation: 'Delivery Driver',
        employer: 'GrabFood',
        yearsOfEmployment: 2,
        documentsCompleted: true,
        esgCompleted: true,
        assetsCompleted: false,
        borrowerDetails: {
          accountStatus: 'verified',
          dateOfBirth: '1995-08-15',
          gender: 'Female',
          civilStatus: 'Single',
          citizenship: 'Filipino',
          amlFlagged: false,
          idVerified: true,
          addressVerified: true,
          membershipYear: 2023
        },
        additionalInformation: 'Looking to upgrade from motorcycle to car for better delivery efficiency',
        paymentTerms: '24 months, ₱3,500/month',
        collateral: '2019 Honda Click 125 (₱65,000 estimated value)',
        flags: [],
        statusColor: 'bg-purple-100 text-purple-800',
        riskColor: 'text-amber-600',
        priorityScore: 10
      },
      // Add more mock applications as needed...
    ];

    // Apply filters to mock data
    let filtered = mockData;
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(loan => loan.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(loan => 
        loan.borrowerName.toLowerCase().includes(searchLower) ||
        loan.borrowerEmail.toLowerCase().includes(searchLower) ||
        loan.borrowerType.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }
    
    return filtered;
  }
}

export default LoanOfficerService;
