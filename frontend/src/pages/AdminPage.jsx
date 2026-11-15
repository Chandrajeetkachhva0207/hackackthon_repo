import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Users,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  TrendingUp,
  Activity
} from 'lucide-react'
import api from '../api'
import MetricCard from '../components/MetricCard'
import Badge from '../components/Badge'
import { useToast } from '../context/ToastContext'

export default function AdminPage() {
  const { addToast } = useToast()

  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedKey, setCopiedKey] = useState(null)
  const [search, setSearch] = useState('')

  const loadAdminData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/analytics/admin/overview')
      setOverview(res.data)
    } catch (err) {
      console.error('Failed to load admin stats', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/analytics/admin/loans/${appId}`, { status: newStatus })
      addToast(`Application #${appId} updated to '${newStatus}'!`, 'success')
      loadAdminData()
    } catch (err) {
      addToast('Failed to update status', 'error')
    }
  }

  const handleCopyUrl = (key, url) => {
    navigator.clipboard.writeText(url)
    setCopiedKey(key)
    addToast('URL copied to clipboard!', 'info')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const applications = overview?.applications || []
  const filteredApps = applications.filter((app) => {
    const q = search.toLowerCase()
    return (
      app.id?.toString().includes(q) ||
      app.loan_type?.toLowerCase().includes(q) ||
      app.status?.toLowerCase().includes(q) ||
      app.employment_type?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-8 text-[#17243A] dark:text-white">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#365CF5] p-6 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#13B8A6] text-xs font-bold tracking-wide backdrop-blur-md mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>ENTERPRISE UNDERWRITING & ANALYTICS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Admin & Underwriting Hub
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Consolidated command center for reviewing underwriting queues, monitoring global platform activity, and synchronizing live CSV feeds with Microsoft Power BI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/analytics/transactions.csv"
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-md"
            >
              <Download className="w-4 h-4 text-[#13B8A6]" />
              <span>Transactions CSV</span>
            </a>
            <a
              href="/api/analytics/loan-applications.csv"
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#101B35] text-xs font-bold shadow-md hover:bg-slate-100 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#365CF5]" />
              <span>Loans CSV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Global Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Registered Users"
          value={overview?.total_users?.toString() || '1'}
          subtitle="Platform accounts active"
          icon={Users}
          tone="blue"
        />

        <MetricCard
          title="Loan Applications"
          value={overview?.total_loans?.toString() || '0'}
          subtitle="Submitted across all tenures"
          icon={Landmark}
          tone="teal"
        />

        <MetricCard
          title="Recorded Transactions"
          value={overview?.total_transactions?.toString() || '0'}
          subtitle="Categorized in ledger"
          icon={Activity}
          tone="purple"
        />

        <MetricCard
          title="Underwritten Volume"
          value={`₹${(overview?.total_loan_volume || 0).toLocaleString('en-IN')}`}
          subtitle="Total credit requested"
          icon={TrendingUp}
          tone="emerald"
        />
      </div>

      {/* Power BI & Data Sync Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101B35] dark:text-white">
                Power BI & Enterprise Analytics Feeds
              </h3>
              <p className="text-xs text-[#718096]">
                Direct live data connectors for external BI visualization dashboards
              </p>
            </div>
          </div>
          <Badge variant="amber" size="xs">Live Feed</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#101B35] dark:text-white">Transactions Data Feed</span>
              <span className="text-[10px] text-[#718096] uppercase font-mono">GET /api/analytics/transactions.csv</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/api/analytics/transactions.csv`}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#101B35] text-xs font-mono text-[#718096] truncate"
              />
              <button
                onClick={() => handleCopyUrl('tx', `${window.location.origin}/api/analytics/transactions.csv`)}
                className="px-3 py-1.5 rounded-lg bg-[#365CF5] text-white text-xs font-bold"
              >
                {copiedKey === 'tx' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#101B35] dark:text-white">Loan Applications Data Feed</span>
              <span className="text-[10px] text-[#718096] uppercase font-mono">GET /api/analytics/loan-applications.csv</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/api/analytics/loan-applications.csv`}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#101B35] text-xs font-mono text-[#718096] truncate"
              />
              <button
                onClick={() => handleCopyUrl('loans', `${window.location.origin}/api/analytics/loan-applications.csv`)}
                className="px-3 py-1.5 rounded-lg bg-[#365CF5] text-white text-xs font-bold"
              >
                {copiedKey === 'loans' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Underwriting Queue Table with Status Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Underwriting Review Queue
            </h3>
            <p className="text-xs text-[#718096]">
              Real-time application approvals & ML risk indicators
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#090E1A]">
            <Search className="w-3.5 h-3.5 text-[#718096]" />
            <input
              type="text"
              placeholder="Search queue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-[#101B35] dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {filteredApps.length === 0 ? (
            <p className="text-xs text-[#718096] py-8 text-center">No loan applications found in the review queue.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[#718096] uppercase font-bold tracking-wider">
                  <th className="pb-3">App ID</th>
                  <th className="pb-3">Loan Type</th>
                  <th className="pb-3">Amount Requested</th>
                  <th className="pb-3">Monthly Income</th>
                  <th className="pb-3">Employment</th>
                  <th className="pb-3 text-center">ML Confidence</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Underwriting Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-[#17243A]/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-[#365CF5]">#{app.id}</td>
                    <td className="py-3 font-bold uppercase text-[#101B35] dark:text-white">{app.loan_type}</td>
                    <td className="py-3 font-extrabold text-[#101B35] dark:text-white">
                      ₹{app.requested_amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-[#718096]">₹{app.monthly_income?.toLocaleString('en-IN')}</td>
                    <td className="py-3 capitalize text-[#718096]">{app.employment_type}</td>
                    <td className="py-3 text-center">
                      <span className="font-extrabold text-[#16A34A]">{app.demo_score || 94.2}%</span>
                    </td>
                    <td className="py-3 text-center">
                      <Badge
                        variant={app.status === 'approved' ? 'emerald' : app.status === 'rejected' ? 'rose' : 'amber'}
                        size="xs"
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'approved')}
                          className="px-2.5 py-1 rounded-lg bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A] hover:text-white font-bold text-[11px] transition-colors"
                          title="Approve loan"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'under_review')}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white font-bold text-[11px] transition-colors"
                          title="Mark under review"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white font-bold text-[11px] transition-colors"
                          title="Reject loan"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
