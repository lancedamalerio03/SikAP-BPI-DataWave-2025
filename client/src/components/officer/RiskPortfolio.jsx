// components/officer/RiskPortfolio.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  AlertCircle,
  XCircle,
  CheckCircle,
  Eye,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Utility functions for Risk Portfolio
const riskUtils = {
  // Load risk profiles, then join users_profiles + user_employment in JS
  async loadRiskProfiles() {
    // 1) Base risk profiles
    const { data: baseProfiles, error: rpErr } = await supabase
      .from('preloan_risk_profiles')
      .select(
        [
          'user_id',
          'credit_score',
          'aml_flagged',
          'id_verified',
          'address_verified',
          'risk_grade',
          'membership_year',
          'created_at',
        ].join(', ')
      )
      .order('created_at', { ascending: false });

    if (rpErr) throw rpErr;
    if (!baseProfiles?.length) return [];

    const userIds = [...new Set(baseProfiles.map(p => p.user_id).filter(Boolean))];

    // 2) Fetch users_profiles (id == auth.users.id)
    const { data: profiles, error: upErr } = await supabase
      .from('users_profiles')
      .select('id, first_name, last_name, email, mobile_number')
      .in('id', userIds);
    if (upErr) throw upErr;

    // 3) Fetch user_employment (by user_id)
    const { data: employmentRows, error: ueErr } = await supabase
      .from('user_employment')
      .select('user_id, occupation, monthly_income, employment_status, is_primary, created_at')
      .in('user_id', userIds);
    if (ueErr) throw ueErr;

    // Indexes for quick lookup
    const profilesById = new Map((profiles || []).map(p => [p.id, p]));

    // Prefer is_primary=true; else most recent by created_at
    const employmentByUser = new Map();
    (employmentRows || []).forEach(row => {
      const prev = employmentByUser.get(row.user_id);
      if (!prev) {
        employmentByUser.set(row.user_id, row);
      } else {
        const prevScore = prev.is_primary ? 2 : 1;
        const curScore = row.is_primary ? 2 : 1;
        if (
          curScore > prevScore ||
          (curScore === prevScore && new Date(row.created_at || 0) > new Date(prev.created_at || 0))
        ) {
          employmentByUser.set(row.user_id, row);
        }
      }
    });

    // 4) Merge into UI shape
    return baseProfiles.map(profile => {
      const p = profilesById.get(profile.user_id);
      const e = employmentByUser.get(profile.user_id);
      const name = p
        ? `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown User'
        : 'Unknown User';

      return {
        id: profile.user_id,
        name,
        credit_score: profile.credit_score,
        aml_flagged: profile.aml_flagged,
        id_verified: profile.id_verified,
        address_verified: profile.address_verified,
        risk_grade: profile.risk_grade, // A/B/C/D/F
        membership_year: profile.membership_year,
        business_type: e?.occupation || 'N/A',
        monthly_income: e?.monthly_income || 0,
        employment_status: e?.employment_status || 'N/A',
        email: p?.email || 'N/A',
        phone: p?.mobile_number || 'N/A',
        created_at: profile.created_at,
      };
    });
  },

  // Risk distribution analytics (A/B/C/D/F + AML)
  async getRiskDistribution() {
    const { data, error } = await supabase
      .from('preloan_risk_profiles')
      .select('risk_grade, aml_flagged');
    if (error) throw error;

    const dist = { A: 0, B: 0, C: 0, D: 0, F: 0, aml_flagged: 0 };
    (data || []).forEach(r => {
      if (dist[r.risk_grade] !== undefined) dist[r.risk_grade] += 1;
      if (r.aml_flagged) dist.aml_flagged += 1;
    });
    return dist;
  },

  // Helpers
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount || 0);
  },

  // Badge colors for A/B/C/D/F
  getRiskColor(grade) {
    const colors = {
      A: 'bg-green-100 text-green-800',
      B: 'bg-blue-100 text-blue-800',
      C: 'bg-yellow-100 text-yellow-800',
      D: 'bg-orange-100 text-orange-800',
      F: 'bg-red-100 text-red-800',
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  },

  // Text color for overview cards
  getGradeTextColor(grade) {
    const colors = {
      A: 'text-green-600',
      B: 'text-blue-600',
      C: 'text-yellow-600',
      D: 'text-orange-600',
      F: 'text-red-600',
    };
    return colors[grade] || 'text-gray-600';
  },
};

function RiskPortfolio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all'); // 'all' or 'A'|'B'|'C'|'D'|'F'
  const [loading, setLoading] = useState(true);
  const [riskProfiles, setRiskProfiles] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0,
    aml_flagged: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profiles, distribution] = await Promise.all([
        riskUtils.loadRiskProfiles(),
        riskUtils.getRiskDistribution(),
      ]);
      setRiskProfiles(profiles);
      setRiskDistribution(distribution);
    } catch (error) {
      console.error('Error loading risk profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter risk profiles
  const filteredRiskProfiles = riskProfiles.filter(profile => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(profile.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || profile.risk_grade === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Risk Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {['A', 'B', 'C', 'D', 'F'].map(grade => (
          <div key={grade} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Grade {grade}</p>
                <p className={`text-2xl font-bold ${riskUtils.getGradeTextColor(grade)}`}>
                  {riskDistribution[grade]}
                </p>
              </div>
              <Shield className={`h-8 w-8 ${riskUtils.getGradeTextColor(grade)}`} />
            </div>
          </div>
        ))}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AML Flagged</p>
              <p className="text-2xl font-bold text-purple-600">{riskDistribution.aml_flagged}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or user ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
            >
              <option value="all">All Risk Grades</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
              <option value="D">Grade D</option>
              <option value="F">Grade F</option>
            </select>
            <button
              onClick={loadData}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Risk Profiles Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading risk profiles...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verifications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Profile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRiskProfiles.map(profile => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium text-sm">
                            {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                          <div className="text-sm text-gray-500">{profile.id}</div>
                          {profile.aml_flagged && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                              AML Flagged
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{profile.credit_score || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{profile.employment_status || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskUtils.getRiskColor(profile.risk_grade)}`}>
                        {profile.risk_grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          {profile.id_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className="text-xs text-gray-600">ID Verified</span>
                        </div>
                        <div className="flex items-center">
                          {profile.address_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span className="text-xs text-gray-600">Address Verified</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{profile.business_type}</div>
                      <div className="text-sm text-gray-500">Income: {riskUtils.formatCurrency(profile.monthly_income)}/mo</div>
                      <div className="text-xs text-gray-400">{profile.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profile.membership_year || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View Profile">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900" title="Risk Analysis">
                          <BarChart3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRiskProfiles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">No risk profiles found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskPortfolio;
