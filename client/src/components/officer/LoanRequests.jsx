// components/officer/LoanRequests.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import webhookService from '../../services/webhookService'; // correct relative path from /components/officer
import ApplicantDetailsModal from './ApplicantDetailsModal';

const dashboardUtils = {
  // Load loan requests + merge user profile fields (no DB schema change required)
  async loadLoanRequests() {
    // 1) Fetch applications (no relationship embedding)
    const { data: applications, error: appsError } = await supabase
      .from('preloan_applications')
      .select(`
        id,
        user_id,
        loan_amount,
        loan_purpose,
        status,
        created_at,
        updated_at,
        additional_information,
        loan_tenor_months,
        repayment_frequency,
        ai_decision,
        ai_reasoning,
        documents_completed,
        esg_completed,
        assets_completed,
        ai_confidence,
        urgency
      `)
      .order('created_at', { ascending: false });

    if (appsError) throw appsError;
    if (!applications || applications.length === 0) return [];

    // 2) Fetch user profiles where users_profiles.id === preloan_applications.user_id (auth ID)
    const userIds = [...new Set(applications.map(a => a.user_id).filter(Boolean))];

    let profiles = [];
    if (userIds.length > 0) {
      const { data: profs, error: profErr } = await supabase
        .from('users_profiles')
        .select('id, first_name, last_name, email, mobile_number, place_of_birth')
        .in('id', userIds);

      if (profErr) throw profErr;
      profiles = profs || [];
    }

    const profilesById = new Map(profiles.map(p => [p.id, p]));

    // 3) Merge into rows the UI expects
    return applications.map(app => {
      const p = profilesById.get(app.user_id) || null;
      const borrowerName = p
        ? (`${p.first_name || ''} ${p.last_name || ''}`).trim() || 'Unknown User'
        : 'Unknown User';

      return {
        id: app.id,
        user_id: app.user_id,
        borrowerName,
        businessName: app.additional_information || 'Business Name N/A',
        loan_amount: app.loan_amount,
        loan_purpose: app.loan_purpose,
        status: app.status,
        created_at: app.created_at,
        urgency: app.urgency,
        ai_confidence: app.ai_confidence ?? 0.5,
        phone: p?.mobile_number || 'N/A',
        email: p?.email || 'N/A',
        location: p?.place_of_birth || 'N/A',
        loan_tenor_months: app.loan_tenor_months,
        repayment_frequency: app.repayment_frequency,
        ai_decision: app.ai_decision,
        ai_reasoning: app.ai_reasoning,
        documents_completed: app.documents_completed,
        esg_completed: app.esg_completed,
        assets_completed: app.assets_completed,
      };
    });
  },

  // Analytics (simple rollups from preloan_applications)
  async calculateAnalytics() {
    const { data: applications, error } = await supabase
      .from('preloan_applications')
      .select('*');

    if (error) throw error;

    if (!applications || applications.length === 0) {
      return {
        overview: {
          totalApplications: 0,
          approvedLoans: 0,
          rejectedLoans: 0,
          pendingReview: 0,
          processing: 0,
        },
        trend: [],
        byPurpose: [],
        byStatus: [],
      };
    }

    // Overview
    const totalApplications = applications.length;
    const approvedLoans = applications.filter(a => a.status === 'approved').length;
    const rejectedLoans = applications.filter(a => a.status === 'rejected').length;
    const pendingReview = applications.filter(a => ['review', 'pending'].includes(a.status)).length;
    const processing = applications.filter(a => a.status === 'processing').length;

    // Trend (last 14 days)
    const now = new Date();
    const daysBack = 14;
    const trendMap = new Map();
    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      trendMap.set(key, 0);
    }
    applications.forEach(a => {
      const key = (a.created_at || '').slice(0, 10);
      if (trendMap.has(key)) trendMap.set(key, trendMap.get(key) + 1);
    });
    const trend = [...trendMap.entries()].map(([date, total]) => ({ date, total }));

    // By purpose
    const purposeMap = new Map();
    applications.forEach(a => {
      const key = a.loan_purpose || 'Unspecified';
      purposeMap.set(key, (purposeMap.get(key) || 0) + 1);
    });
    const byPurpose = [...purposeMap.entries()]
      .map(([purpose, count]) => ({ purpose, count }))
      .sort((a, b) => b.count - a.count);

    // By status
    const statusMap = new Map();
    applications.forEach(a => {
      const key = a.status || 'unknown';
      statusMap.set(key, (statusMap.get(key) || 0) + 1);
    });
    const byStatus = [...statusMap.entries()]
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    return {
      overview: { totalApplications, approvedLoans, rejectedLoans, pendingReview, processing },
      trend,
      byPurpose,
      byStatus,
    };
  },

  // Update application status
  async updateApplicationStatus(applicationId, newStatus) {
    const { error } = await supabase
      .from('preloan_applications')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', applicationId);

    if (error) throw error;
  },

  // UI helpers
  formatCurrency(amount) {
    if (amount == null) return '₱0';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(amount);
  },

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  getStatusColor(status) {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      pending_documents: 'bg-orange-100 text-orange-800',
      review: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      unknown: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.unknown;
  },

  getStatusLabel(status) {
    const labels = {
      pending: 'Pending',
      pending_documents: 'Pending Docs',
      review: 'Under Review',
      processing: 'Processing',
      approved: 'Approved',
      rejected: 'Rejected',
      unknown: 'Unknown',
    };
    return labels[status] || labels.unknown;
  },
};

function LoanRequests() {
  const [loading, setLoading] = useState(true);
  const [loanRequests, setLoanRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [creatingPlanId, setCreatingPlanId] = useState(null);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rows, analyticsData] = await Promise.all([
        dashboardUtils.loadLoanRequests(),
        dashboardUtils.calculateAnalytics(),
      ]);
      setLoanRequests(rows);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Error loading loan requests:', err);
      setError(err?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreateLoanPlan = async (row) => {
    try {
      // Guard: processing should already imply all checks are done
      if (!(row.documents_completed && row.esg_completed && row.assets_completed)) {
        alert('This application is not fully completed yet.');
        return;
      }

      setCreatingPlanId(row.id);

      // Build a structured payload for n8n
      const payload = {
        applicationId: row.id,
        userId: row.user_id,
        status: row.status,
        borrower: {
          name: row.borrowerName,
          email: row.email,
          phone: row.phone,
        },
        loanData: {
          amount: row.loan_amount,
          purpose: row.loan_purpose,
          tenor_months: row.loan_tenor_months,
          repayment_frequency: row.repayment_frequency,
          urgency: row.urgency,
        },
        checks: {
          documents_completed: !!row.documents_completed,
          esg_completed: !!row.esg_completed,
          assets_completed: !!row.assets_completed,
        },
        ai: {
          decision: row.ai_decision,
          confidence: row.ai_confidence,
          reasoning: row.ai_reasoning,
        },
        created_at: row.created_at,
      };

      await webhookService.createLoanPlan(payload);
      alert('Loan plan request sent ✓');
    } catch (e) {
      console.error('Loan plan webhook error:', e);
      alert(`Failed to create loan plan: ${e.message || e}`);
    } finally {
      setCreatingPlanId(null);
    }
  };

  const handleViewApplicant = (applicationId) => {
    setSelectedApplicantId(applicationId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplicantId(null);
  };

  const filtered = loanRequests.filter(r => {
    const matchesSearch =
      !searchTerm ||
      r.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.loan_amount || '').includes(searchTerm) ||
      (r.loan_purpose || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Loan Requests</h1>
        <button
          onClick={fetchAll}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, purpose, or amount"
            className="w-full rounded-lg border pl-9 pr-3 py-2"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="pending_documents">Pending Documents</option>
            <option value="review">Under Review</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Total Applications</div>
          <div className="text-2xl font-semibold">
            {analytics?.overview.totalApplications ?? '—'}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-2xl font-semibold text-emerald-600">
            {analytics?.overview.approvedLoans ?? '—'}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Under Review</div>
          <div className="text-2xl font-semibold text-blue-600">
            {analytics?.overview.pendingReview ?? '—'}
          </div>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Processing</div>
          <div className="text-2xl font-semibold text-purple-600">
            {analytics?.overview.processing ?? '—'}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Borrower</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Purpose</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Created</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                  Loading loan requests…
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-red-600">
                  <div className="inline-flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {String(error)}
                  </div>
                </td>
              </tr>
            )}
            {!loading && !error && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                  No loan requests found.
                </td>
              </tr>
            )}
            {!loading && !error && filtered.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.borrowerName}</div>
                  <div className="text-gray-500">{r.phone}</div>
                </td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.loan_purpose || '—'}</td>
                <td className="px-4 py-3">
                  {dashboardUtils.formatCurrency(r.loan_amount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${dashboardUtils.getStatusColor(r.status)}`}
                  >
                    {dashboardUtils.getStatusLabel(r.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {dashboardUtils.formatDate(r.created_at)}
                </td>
                <td className="px-4 py-3">
                  {r.status === 'processing' ? (
                    <button
                      onClick={() => handleCreateLoanPlan(r)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                      disabled={creatingPlanId === r.id}
                      title="Create Loan Plan"
                    >
                      <FileText className={`w-4 h-4 ${creatingPlanId === r.id ? 'animate-pulse' : ''}`} />
                      {creatingPlanId === r.id ? 'Sending…' : 'Create Loan Plan'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 rounded-md border hover:bg-gray-50" 
                        title="View"
                        onClick={() => handleViewApplicant(r.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-md border hover:bg-gray-50 text-green-600"
                        title="Approve"
                        onClick={async () => {
                          try {
                            await dashboardUtils.updateApplicationStatus(r.id, 'approved');
                            await fetchAll();
                          } catch (e) {
                            console.error(e);
                            alert('Failed to approve');
                          }
                        }}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-md border hover:bg-gray-50 text-red-600"
                        title="Reject"
                        onClick={async () => {
                          try {
                            await dashboardUtils.updateApplicationStatus(r.id, 'rejected');
                            await fetchAll();
                          } catch (e) {
                            console.error(e);
                            alert('Failed to reject');
                          }
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Applicant Details Modal */}
      <ApplicantDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        applicantId={selectedApplicantId}
        applicationType="loan"
      />
    </div>
  );
}

export default LoanRequests;
