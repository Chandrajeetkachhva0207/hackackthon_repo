import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  PieChart as PieIcon,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Download,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  Layers,
  Bot
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import api from '../api'
import MetricCard from '../components/MetricCard'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { useToast } from '../context/ToastContext'

const MONTHLY_COMPARISONS = [
  { month: 'Jun', income: 58000, expense: 34000, savings: 24000 },
  { month: 'Jul', income: 60000, expense: 36000, savings: 24000 },
  { month: 'Aug', income: 62000, expense: 31000, savings: 31000 },
  { month: 'Sep', income: 61000, expense: 38000, savings: 23000 },
  { month: 'Oct', income: 65000, expense: 32000, savings: 33000 },
  { month: 'Nov', income: 68000, expense: 35000, savings: 33000 },
]

const PIE_COLORS = ['#365CF5', '#13B8A6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4']

export default function FintechJourney() {
  const { addToast } = useToast()

  const [transactions, setTransactions] = useState([])
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(true)

  // Search & Filter
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Add Transaction Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    description: '',
    amount: '',
    transaction_type: 'expense',
    category: 'Food'
  })
  const [saving, setSaving] = useState(false)

  const loadFintechData = async () => {
    setLoading(true)
    try {
      const [txRes, insRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/fintech/insights')
      ])
      setTransactions(txRes.data || [])
      setInsight(insRes.data || null)
    } catch (err) {
      console.error('Failed to load fintech data', err)
      addToast('Failed to load transaction data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFintechData()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) return
    setSaving(true)
    try {
      const res = await api.post('/transactions', {
        description: form.description,
        amount: parseFloat(form.amount),
        transaction_type: form.transaction_type,
        category: form.category
      })

      if (res.data.suspicious) {
        addToast('Transaction recorded & flagged as unusual for review!', 'info')
      } else {
        addToast('Transaction recorded successfully!', 'success')
      }

      setModalOpen(false)
      setForm({ description: '', amount: '', transaction_type: 'expense', category: 'Food' })
      loadFintechData()
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to record transaction', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Quick synthetic seeder buttons
  const seedTransaction = async (desc, amt, type) => {
    try {
      const res = await api.post('/transactions', {
        description: desc,
        amount: amt,
        transaction_type: type
      })
      if (res.data.suspicious) {
        addToast(`Seeded "${desc}" (Anomaly flagged)`, 'info')
      } else {
        addToast(`Seeded "${desc}"`, 'success')
      }
      loadFintechData()
    } catch (err) {
      addToast('Failed to seed transaction', 'error')
    }
  }

  // Download reports
  const handleDownloadCsv = async (endpoint, filename) => {
    try {
      const token = localStorage.getItem('fj_token')
      const response = await fetch(`/api/analytics/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      addToast(`Downloaded ${filename} successfully`, 'success')
    } catch (err) {
      addToast('Failed to download report', 'error')
    }
  }

  const income = insight?.income || 68000
  const expenses = insight?.expenses || 35000
  const balance = insight?.balance || (income - expenses)
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 48

  const categorySpend = insight?.category_spend && Object.keys(insight.category_spend).length > 0
    ? insight.category_spend
    : {
        'Dining & Food': 8200,
        'Rent & Housing': 14000,
        'Tech & Cloud': 4500,
        'Utilities': 3200,
        'Healthcare': 2100
      }

  const pieData = Object.entries(categorySpend).map(([name, value]) => ({ name, value }))

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description?.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || t.transaction_type === filterType
    const matchesCat = filterCategory === 'all' || t.category === filterCategory
    return matchesSearch && matchesType && matchesCat
  })

  return (
    <div className="space-y-8 text-[#17243A] dark:text-white">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#365CF5] p-6 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#13B8A6] text-xs font-bold tracking-wide backdrop-blur-md mb-3">
              <Wallet className="w-3.5 h-3.5" />
              <span>CASHFLOW INTELLIGENCE & BUDGETING</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Financial Analytics & Budgeting
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Automated ledger categorization, predictive cashflow modeling, spending anomaly detection, and exportable financial reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleDownloadCsv('transactions.csv', 'transactions_report.csv')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all backdrop-blur-md"
            >
              <Download className="w-4 h-4 text-[#13B8A6]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#101B35] text-xs font-bold shadow-md hover:bg-slate-100 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 text-[#365CF5]" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Cash Surplus"
          value={`₹${balance.toLocaleString('en-IN')}`}
          change="+14.2% MoM"
          isPositive={balance >= 0}
          subtitle="Net monthly liquidity"
          icon={Wallet}
          tone="blue"
        />

        <MetricCard
          title="Verified Inflow"
          value={`₹${income.toLocaleString('en-IN')}`}
          subtitle="Salary & inflow streams"
          icon={TrendingUp}
          tone="emerald"
        />

        <MetricCard
          title="Categorized Expenses"
          value={`₹${expenses.toLocaleString('en-IN')}`}
          change={`${savingsRate}% savings rate`}
          isPositive={savingsRate >= 20}
          subtitle="Tracked across 5 categories"
          icon={TrendingDown}
          tone="rose"
        />

        <MetricCard
          title="Suspicious Flags"
          value={transactions.filter((t) => t.suspicious).length.toString()}
          subtitle="Heuristic anomaly alerts"
          icon={ShieldAlert}
          tone="amber"
        />
      </div>

      {/* Rich Interactive Analytics Charts: Income vs Expense & Donut Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Income vs Expense Comparative Bar Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                Cashflow Dynamics
              </span>
              <h3 className="text-base font-bold text-[#101B35] dark:text-white mt-0.5">
                Monthly Income vs. Expense Comparison
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-[#365CF5]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#365CF5]" /> Inflow
              </span>
              <span className="inline-flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Outflow
              </span>
            </div>
          </div>

          <div className="h-72 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_COMPARISONS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="month" stroke="#718096" fontSize={12} tickLine={false} />
                <YAxis stroke="#718096" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101B35',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="income" name="Income" fill="#365CF5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Savings Trend Micro-Chart */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[#718096] font-medium">6-Month Average Savings Rate:</span>
            <span className="font-extrabold text-[#16A34A]">48.6% of Net Inflow</span>
          </div>
        </div>

        {/* Spending Category Donut Chart (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">
                Allocation Matrix
              </span>
              <h3 className="text-base font-bold text-[#101B35] dark:text-white mt-0.5">
                Spending Category Donut
              </h3>
            </div>
            <PieIcon className="w-5 h-5 text-[#13B8A6]" />
          </div>

          <div className="h-56 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101B35',
                    borderRadius: '10px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="font-semibold text-[#17243A] dark:text-slate-200">{item.name}</span>
                </div>
                <span className="font-bold text-[#101B35] dark:text-white">₹{item.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Synthetic Transaction Seeds Strip */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#101B35] dark:text-white">
              Instant Synthetic Test Seeds (1-Click Ledger Updates)
            </h4>
          </div>
          <span className="text-[11px] text-[#718096]">Test automated categorization & fraud rules</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => seedTransaction('Tech Services Corp Salary Credit', 65000, 'income')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/25 hover:bg-[#16A34A]/20 transition-colors"
          >
            + Salary Credit (₹65,000)
          </button>
          <button
            onClick={() => seedTransaction('Whole Foods Supermarket', 4200, 'expense')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#365CF5]/10 text-[#365CF5] border border-[#365CF5]/25 hover:bg-[#365CF5]/20 transition-colors"
          >
            - Grocery Expense (₹4,200)
          </button>
          <button
            onClick={() => seedTransaction('International Wire Transfer Unknown', 95000, 'expense')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/25 hover:bg-rose-500/20 transition-colors"
          >
            - Suspicious Debit Alert (₹95,000)
          </button>
          <button
            onClick={() => seedTransaction('Health Insurance Annual Premium', 6500, 'expense')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#13B8A6]/10 text-[#13B8A6] border border-[#13B8A6]/25 hover:bg-[#13B8A6]/20 transition-colors"
          >
            - Insurance Payment (₹6,500)
          </button>
        </div>
      </div>

      {/* Transactions Ledger Table with Search & Category Filters */}
      <div className="rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Ledger Transactions & Anomaly Register
            </h3>
            <p className="text-xs text-[#718096]">
              {filteredTransactions.length} recorded entries
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#090E1A]">
              <Search className="w-3.5 h-3.5 text-[#718096]" />
              <input
                type="text"
                placeholder="Search description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-[#101B35] dark:text-white focus:outline-none"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#090E1A] text-xs font-bold text-[#101B35] dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <p className="text-xs text-[#718096] py-8 text-center">No transactions match your search filter.</p>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[#718096] uppercase font-bold tracking-wider">
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Fraud/Anomaly Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-[#17243A]/50 transition-colors">
                    <td className="py-3 font-bold text-[#101B35] dark:text-white">
                      {tx.description}
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#17243A] text-slate-700 dark:text-slate-300 font-semibold">
                        {tx.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-bold capitalize ${
                          tx.transaction_type === 'income' ? 'text-[#16A34A]' : 'text-[#718096]'
                        }`}
                      >
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="py-3 text-right font-extrabold text-[#101B35] dark:text-white">
                      {tx.transaction_type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-center">
                      {tx.suspicious ? (
                        <Badge variant="rose" size="xs">
                          <AlertTriangle className="w-3 h-3" /> Flagged Outlier
                        </Badge>
                      ) : (
                        <Badge variant="emerald" size="xs">
                          <CheckCircle2 className="w-3 h-3" /> Verified Clean
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record New Financial Transaction">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
              Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Netflix Subscription, Salary, Groceries"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                placeholder="2500"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={form.transaction_type}
                onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
            >
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transport & Fuel</option>
              <option value="Shopping">Shopping & Retail</option>
              <option value="Bills">Bills & Utilities</option>
              <option value="Healthcare">Healthcare & Medicine</option>
              <option value="Salary">Salary & Inflow</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#718096]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold shadow-md shadow-[#365CF5]/25"
            >
              {saving ? 'Recording...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
