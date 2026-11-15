import React, { useState, useEffect } from 'react'
import {
  UserCheck,
  Target,
  ShieldCheck,
  Landmark,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  Percent,
  Sliders,
  Sparkles,
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import MetricCard from '../components/MetricCard'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { useToast } from '../context/ToastContext'

export default function ProfilePage() {
  const { user } = useAuth()
  const { addToast } = useToast()

  const [insight, setInsight] = useState(null)
  const [loans, setLoans] = useState([])
  const [goals, setGoals] = useState([
    { id: 1, name: '6-Month Emergency Fund', current: 210000, target: 300000, category: 'Safety' },
    { id: 2, name: 'Home Renovation Downpayment', current: 450000, target: 800000, category: 'Real Estate' },
    { id: 3, name: 'Electric Vehicle Purchase', current: 95000, target: 150000, category: 'Auto' },
  ])

  // New goal modal
  const [goalModal, setGoalModal] = useState(false)
  const [newGoal, setNewGoal] = useState({ name: '', target: '', category: 'General' })

  // Document Vault list
  const [documents, setDocuments] = useState([
    { id: 'DOC-01', name: 'Synthetic_Salary_Slip_Nov2026.pdf', type: 'Income Proof', date: '15-Nov-2026', status: 'OCR Verified' },
    { id: 'DOC-02', name: 'Sample_Bank_Statement_Q3.pdf', type: 'Banking Records', date: '10-Nov-2026', status: 'OCR Verified' },
    { id: 'DOC-03', name: 'Health_Insurance_Schedule_Demo.pdf', type: 'Insurance', date: '04-Nov-2026', status: 'Catalog Ref' },
  ])

  useEffect(() => {
    api.get('/fintech/insights').then((res) => setInsight(res.data)).catch(() => {})
    api.get('/loans/applications').then((res) => setLoans(res.data)).catch(() => {})
  }, [])

  const handleAddGoal = (e) => {
    e.preventDefault()
    if (!newGoal.name || !newGoal.target) return
    const goalItem = {
      id: Date.now(),
      name: newGoal.name,
      current: 0,
      target: parseFloat(newGoal.target),
      category: newGoal.category
    }
    setGoals([...goals, goalItem])
    setGoalModal(false)
    setNewGoal({ name: '', target: '', category: 'General' })
    addToast('Financial Goal created!', 'success')
  }

  const handleAllocate = (goalId) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, current: Math.min(g.target, g.current + 5000) } : g))
    addToast('Allocated ₹5,000 from cash surplus to goal!', 'success')
  }

  const income = insight?.income || 68000
  const expenses = insight?.expenses || 35000
  const dti = Math.round((expenses / Math.max(income, 1)) * 100)

  return (
    <div className="space-y-8 text-[#17243A] dark:text-white">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#365CF5] p-6 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#13B8A6] text-xs font-bold tracking-wide backdrop-blur-md mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>PERSONALIZED IDENTITY & RISK METRICS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Financial Profile & Wealth Goals
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Consolidated view of your KYC status, debt-to-income affordability metrics, active target milestones, and verified document vault.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setGoalModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#101B35] font-bold text-sm shadow-md hover:bg-slate-100 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 text-[#365CF5]" />
              <span>New Financial Goal</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Information & Risk Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#365CF5]/10 text-[#365CF5] flex items-center justify-center font-extrabold text-xl">
            {user?.name?.[0]?.toUpperCase() || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#101B35] dark:text-white">{user?.name || 'Demo User'}</h3>
              <Badge variant="emerald" size="xs">KYC Verified</Badge>
            </div>
            <p className="text-xs text-[#718096]">{user?.email || 'demo@example.com'}</p>
            <p className="text-[11px] text-[#718096] mt-0.5">Tier 1 Prime · Synthetic Risk Score 88</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">Affordability Metric</span>
            <Badge variant="blue" size="xs">Optimal</Badge>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#101B35] dark:text-white">{dti}% DTI</span>
              <span className="text-xs font-bold text-[#16A34A]">Healthy Buffer</span>
            </div>
            <p className="text-[11px] text-[#718096]">Debt-to-income remains well under 45% regulatory threshold.</p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">Liquid Surplus</span>
            <Badge variant="teal" size="xs">Surplus</Badge>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#101B35] dark:text-white">₹{(income - expenses).toLocaleString('en-IN')}</span>
              <span className="text-xs text-[#718096]">/month</span>
            </div>
            <p className="text-[11px] text-[#718096]">Available for target goal allocation & emergency cushion.</p>
          </div>
        </div>
      </div>

      {/* Financial Goals Tracking */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">Active Financial Goals</h3>
            <p className="text-xs text-[#718096]">Real-time milestone progress tracking</p>
          </div>
          <button
            onClick={() => setGoalModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#17243A] hover:bg-slate-200 text-[#101B35] dark:text-white text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5 text-[#365CF5]" />
            <span>Add Goal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100))
            return (
              <div
                key={g.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#365CF5]/10 text-[#365CF5]">
                      {g.category}
                    </span>
                    <span className="text-xs font-extrabold text-[#16A34A]">{pct}% Done</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#101B35] dark:text-white mt-2">{g.name}</h4>
                  <div className="flex justify-between text-xs text-[#718096] mt-2">
                    <span>₹{g.current.toLocaleString('en-IN')}</span>
                    <span className="font-bold text-[#101B35] dark:text-white">₹{g.target.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1.5">
                    <div className="h-full bg-gradient-to-r from-[#365CF5] to-[#13B8A6] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAllocate(g.id)}
                  className="w-full py-2 rounded-xl bg-white dark:bg-[#17243A] border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#365CF5] hover:bg-[#365CF5] hover:text-white transition-all shadow-sm"
                >
                  + Quick Allocate ₹5,000
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Document Vault */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">Encrypted Document Vault</h3>
            <p className="text-xs text-[#718096]">Verified records and parsed OCR files</p>
          </div>
          <Link
            to="/document-intelligence"
            className="text-xs font-bold text-[#365CF5] hover:underline flex items-center gap-1"
          >
            <span>OCR Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[#718096] uppercase font-bold tracking-wider">
                <th className="pb-3">Doc Ref</th>
                <th className="pb-3">Filename</th>
                <th className="pb-3">Document Type</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-[#17243A]/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#365CF5]">{doc.id}</td>
                  <td className="py-3 font-bold text-[#101B35] dark:text-white">{doc.name}</td>
                  <td className="py-3 text-[#718096]">{doc.type}</td>
                  <td className="py-3 text-[#718096]">{doc.date}</td>
                  <td className="py-3 text-center">
                    <Badge variant="emerald" size="xs">
                      <CheckCircle2 className="w-3 h-3" /> {doc.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goal Modal */}
      <Modal isOpen={goalModal} onClose={() => setGoalModal(false)} title="Create New Financial Goal">
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
              Goal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Higher Education Fund, Home Downpayment"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
              Target Amount (₹)
            </label>
            <input
              type="number"
              min="5000"
              step="5000"
              required
              placeholder="500000"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
            >
              <option value="Safety">Safety & Emergency</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Auto">Vehicle & Transport</option>
              <option value="Investment">Wealth & Investment</option>
              <option value="General">General Milestone</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setGoalModal(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#718096]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold shadow-md shadow-[#365CF5]/25"
            >
              Create Goal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
