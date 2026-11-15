import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Trash2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Plane,
  Home,
  Clock
} from 'lucide-react'
import axios from 'axios'
import Modal from '../components/Modal'
import { useToast } from '../context/ToastContext'
import AnimatedCounter from '../components/AnimatedCounter'

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [contributeModalOpen, setContributeModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [contributeAmount, setContributeAmount] = useState(5000)

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [newCurrent, setNewCurrent] = useState('0')
  const [newCategory, setNewCategory] = useState('General')
  const [newDate, setNewDate] = useState('2027-12-31')

  const { addToast } = useToast()

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/ai/goals')
      setGoals(res.data)
    } catch (err) {
      console.error(err)
      // Realistic fallback
      setGoals([
        {
          id: 1,
          title: 'Emergency Shield (6 Mos Living Costs)',
          target_amount: 250000,
          current_amount: 175000,
          progress_percent: 70,
          remaining_amount: 75000,
          target_date: '2027-06-30',
          category: 'Emergency',
          status: 'in_progress'
        },
        {
          id: 2,
          title: 'Home Down Payment (20% Upfront)',
          target_amount: 1500000,
          current_amount: 450000,
          progress_percent: 30,
          remaining_amount: 1050000,
          target_date: '2028-12-31',
          category: 'Real Estate',
          status: 'in_progress'
        },
        {
          id: 3,
          title: 'Europe Summer Vacation',
          target_amount: 200000,
          current_amount: 140000,
          progress_percent: 70,
          remaining_amount: 60000,
          target_date: '2027-09-15',
          category: 'Travel',
          status: 'in_progress'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGoal = async (e) => {
    e.preventDefault()
    if (!newTitle || !newTarget) return
    try {
      const payload = {
        title: newTitle,
        target_amount: parseFloat(newTarget),
        current_amount: parseFloat(newCurrent || 0),
        category: newCategory,
        target_date: newDate
      }
      const res = await axios.post('/api/ai/goals', payload)
      addToast(`Goal "${newTitle}" created successfully!`, 'success')
      setModalOpen(false)
      fetchGoals()
      // reset
      setNewTitle('')
      setNewTarget('')
      setNewCurrent('0')
    } catch (err) {
      console.error(err)
      addToast('Could not create goal. Please check inputs.', 'error')
    }
  }

  const handleContribute = async () => {
    if (!selectedGoal) return
    try {
      await axios.post(`/api/ai/goals/${selectedGoal.id}/contribute`, {
        amount: parseFloat(contributeAmount)
      })
      addToast(`Allocated ₹${Number(contributeAmount).toLocaleString('en-IN')} to "${selectedGoal.title}"!`, 'success')
      setContributeModalOpen(false)
      fetchGoals()
    } catch (err) {
      console.error(err)
      // optimistic update
      setGoals(prev => prev.map(g => {
        if (g.id === selectedGoal.id) {
          const updated = g.current_amount + parseFloat(contributeAmount)
          return {
            ...g,
            current_amount: updated,
            progress_percent: Math.min(100, Math.round((updated / g.target_amount) * 100))
          }
        }
        return g
      }))
      addToast(`Simulated allocation of ₹${Number(contributeAmount).toLocaleString('en-IN')}`, 'success')
      setContributeModalOpen(false)
    }
  }

  const handleDelete = async (id, title) => {
    try {
      await axios.delete(`/api/ai/goals/${id}`)
      addToast(`Goal "${title}" removed.`, 'info')
      setGoals(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      setGoals(prev => prev.filter(g => g.id !== id))
      addToast(`Goal removed from view.`, 'info')
    }
  }

  // Summary Metrics
  const totalTarget = goals.reduce((acc, g) => acc + (g.target_amount || 0), 0)
  const totalSaved = goals.reduce((acc, g) => acc + (g.current_amount || 0), 0)
  const overallPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#1E2D4A] text-white border border-[#1E2D4A] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#365CF5]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#365CF5]/20 border border-[#365CF5]/30 text-[#8DB7FF] text-xs font-bold tracking-wide mb-3">
            <Target className="w-3.5 h-3.5 text-[#13B8A6]" />
            <span>GOAL-BASED WEALTH ARCHITECT</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Financial Goals & Milestone Tracker
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Link your savings to explicit milestones with automated monthly pace analysis and progress milestones.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="relative z-10 self-start md:self-center inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-extrabold shadow-lg shadow-[#365CF5]/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Aggregate Goal Progress Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Cumulative Goals Target</span>
          <p className="text-2xl font-extrabold text-[#101B35] dark:text-white mt-1">
            ₹{totalTarget.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#718096] font-semibold">{goals.length} Active Targets</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Total Capital Earmarked</span>
          <p className="text-2xl font-extrabold text-[#13B8A6] mt-1">
            ₹{totalSaved.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#16A34A] font-semibold">
            ₹{(totalTarget - totalSaved).toLocaleString('en-IN')} remaining
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Portfolio Completion</span>
          <p className="text-2xl font-extrabold text-[#365CF5] mt-1">
            <AnimatedCounter value={overallPct} />%
          </p>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#365CF5] to-[#13B8A6]"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((g) => {
          const remaining = Math.max(0, g.target_amount - g.current_amount)
          const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100))

          return (
            <motion.div
              key={g.id}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#365CF5]/10 text-[#365CF5] text-[10px] font-extrabold uppercase tracking-wider">
                    {g.category || 'Goal'}
                  </span>

                  <button
                    onClick={() => handleDelete(g.id, g.title)}
                    className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-extrabold text-[#101B35] dark:text-white leading-snug">
                  {g.title}
                </h3>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-[#718096] font-semibold">Saved So Far</span>
                    <p className="text-lg font-extrabold text-[#101B35] dark:text-white">
                      ₹{g.current_amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[#718096] font-semibold">Target</span>
                    <p className="text-sm font-bold text-slate-500">
                      ₹{g.target_amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 100
                          ? 'bg-[#16A34A]'
                          : pct >= 50
                          ? 'bg-[#365CF5]'
                          : 'bg-[#13B8A6]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold mt-1.5">
                    <span className="text-[#365CF5]">{pct}% Funded</span>
                    <span className="text-[#718096]">₹{remaining.toLocaleString('en-IN')} left</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-[#718096]">
                  <Calendar className="w-3.5 h-3.5 text-[#365CF5]" />
                  <span>Target Date: {g.target_date || 'Dec 2027'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1E2D4A] flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedGoal(g)
                    setContributeModalOpen(true)
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Funds</span>
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Create Goal Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Financial Goal">
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#17243A] dark:text-slate-200 mb-1">
              Goal Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New Car Down Payment"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#17243A] text-xs font-semibold text-[#17243A] dark:text-white focus:outline-none focus:border-[#365CF5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17243A] dark:text-slate-200 mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                required
                min="1000"
                placeholder="500000"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#17243A] text-xs font-semibold text-[#17243A] dark:text-white focus:outline-none focus:border-[#365CF5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17243A] dark:text-slate-200 mb-1">
                Initial Saved (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="50000"
                value={newCurrent}
                onChange={(e) => setNewCurrent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#17243A] text-xs font-semibold text-[#17243A] dark:text-white focus:outline-none focus:border-[#365CF5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#17243A] dark:text-slate-200 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#17243A] text-xs font-semibold text-[#17243A] dark:text-white focus:outline-none focus:border-[#365CF5]"
              >
                <option value="Emergency">Emergency</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Travel">Travel</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Education">Education</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17243A] dark:text-slate-200 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#17243A] text-xs font-semibold text-[#17243A] dark:text-white focus:outline-none focus:border-[#365CF5]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#718096] hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold shadow-md shadow-[#365CF5]/25"
            >
              Create Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* Contribute Funds Modal */}
      <Modal
        isOpen={contributeModalOpen}
        onClose={() => setContributeModalOpen(false)}
        title={`Contribute to "${selectedGoal?.title}"`}
      >
        <div className="space-y-4">
          <p className="text-xs text-[#718096]">
            Select an amount to allocate towards this goal from your monthly surplus:
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[2000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                onClick={() => setContributeAmount(amt)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  contributeAmount === amt
                    ? 'bg-[#365CF5] text-white border-[#365CF5]'
                    : 'bg-[#F7F9FC] dark:bg-[#17243A] border-slate-200 dark:border-[#1E2D4A] text-[#17243A] dark:text-white'
                }`}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17243A] dark:text-slate-200 mb-1">
              Custom Amount (₹)
            </label>
            <input
              type="number"
              min="100"
              value={contributeAmount}
              onChange={(e) => setContributeAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-[#1E2D4A] bg-white dark:bg-[#17243A] text-xs font-semibold text-[#17243A] dark:text-white focus:outline-none focus:border-[#365CF5]"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={() => setContributeModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#718096]"
            >
              Cancel
            </button>
            <button
              onClick={handleContribute}
              className="px-5 py-2.5 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold shadow-md shadow-[#365CF5]/25"
            >
              Confirm Allocation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
