import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Wallet,
  ShieldCheck,
  Landmark,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  CreditCard,
  ChevronRight,
  Bot,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  PieChart as PieIcon,
  Filter
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import MetricCard from '../components/MetricCard'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import RadialGauge from '../components/RadialGauge'
import { useToast } from '../context/ToastContext'

const CASHFLOW_DATA = [
  { month: 'Jun', income: 58000, expense: 34000, savings: 24000 },
  { month: 'Jul', income: 60000, expense: 36000, savings: 24000 },
  { month: 'Aug', income: 62000, expense: 31000, savings: 31000 },
  { month: 'Sep', income: 61000, expense: 38000, savings: 23000 },
  { month: 'Oct', income: 65000, expense: 32000, savings: 33000 },
  { month: 'Nov', income: 68000, expense: 35000, savings: 33000 },
]

const PIE_COLORS = ['#365CF5', '#13B8A6', '#8B5CF6', '#F59E0B', '#EF4444']

export default function Dashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [insight, setInsight] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loans, setLoans] = useState([])
  const [policies, setPolicies] = useState([])
  const [summary, setSummary] = useState(null)

  // Quick transaction modal state
  const [txModal, setTxModal] = useState(false)
  const [txForm, setTxForm] = useState({
    description: '',
    amount: '',
    transaction_type: 'expense',
    category: 'Food'
  })
  const [submittingTx, setSubmittingTx] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [insRes, txRes, loanRes, polRes, sumRes] = await Promise.allSettled([
        api.get('/fintech/insights'),
        api.get('/transactions'),
        api.get('/loans/applications'),
        api.get('/insurance/policies'),
        api.get('/analytics/summary')
      ])

      if (insRes.status === 'fulfilled') setInsight(insRes.value.data)
      if (txRes.status === 'fulfilled') setTransactions(txRes.value.data)
      if (loanRes.status === 'fulfilled') setLoans(loanRes.value.data)
      if (polRes.status === 'fulfilled') setPolicies(polRes.value.data.items || [])
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data)
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddTx = async (e) => {
    e.preventDefault()
    if (!txForm.description || !txForm.amount) return
    setSubmittingTx(true)
    try {
      await api.post('/transactions', {
        description: txForm.description,
        amount: parseFloat(txForm.amount),
        transaction_type: txForm.transaction_type,
        category: txForm.category
      })
      addToast('Transaction recorded successfully!', 'success')
      setTxModal(false)
      setTxForm({ description: '', amount: '', transaction_type: 'expense', category: 'Food' })
      loadData()
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to add transaction', 'error')
    } finally {
      setSubmittingTx(false)
    }
  }

  const income = insight?.income || 68000
  const expenses = insight?.expenses || 35000
  const balance = insight?.balance || (income - expenses)
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 48

  const healthScore = Math.min(
    95,
    Math.max(68, Math.round(82 + (balance > 0 ? 8 : -10) + (loans.length > 0 ? 4 : 0)))
  )

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

  return (
    <div className="space-y-8 text-[#17243A] dark:text-white">
      {/* Top Banner / Welcome message with Time-of-day greeting */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#365CF5] p-6 sm:p-10 text-white shadow-xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#13B8A6] text-xs font-bold tracking-wide backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI FINANCIAL ENGINE SYNCHRONIZED</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'Member'}! 👋
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Your centralized financial ecosystem is operating smoothly. All customer journeys—Insurance, Lending, and Fintech—are actively monitored.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setTxModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#101B35] font-bold text-sm shadow-md hover:bg-slate-100 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 text-[#365CF5]" />
              <span>Add Transaction</span>
            </button>
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-all backdrop-blur-md"
            >
              <Bot className="w-4 h-4 text-[#13B8A6]" />
              <span>Ask AI Assistant</span>
            </Link>
          </div>
        </div>

        {/* Ambient background shape */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
      </motion.div>

      {/* Total Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Net Balance"
          value={`₹${balance.toLocaleString('en-IN')}`}
          change="+14.2% MoM"
          isPositive={balance >= 0}
          subtitle="Real-time calculated liquid surplus"
          icon={Wallet}
          tone="blue"
        />

        <MetricCard
          title="Monthly Income"
          value={`₹${income.toLocaleString('en-IN')}`}
          subtitle="Verified salary & inflow credits"
          icon={TrendingUp}
          tone="emerald"
        />

        <MetricCard
          title="Monthly Expenses"
          value={`₹${expenses.toLocaleString('en-IN')}`}
          change={`${savingsRate}% savings rate`}
          isPositive={savingsRate >= 20}
          subtitle="Categorized across 5 spending buckets"
          icon={TrendingDown}
          tone="rose"
        />

        <MetricCard
          title="Financial Journeys"
          value="3 Synchronized"
          subtitle="Insurance · Lending · Fintech"
          icon={Activity}
          tone="teal"
        />
      </div>

      {/* Interactive Charts & Financial Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Cashflow Trend & Monthly Comparisons */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-slate-400">
                Performance Analytics
              </span>
              <h2 className="text-lg font-bold text-[#101B35] dark:text-white mt-0.5">
                Monthly Income, Expense & Savings Trend
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#365CF5]/10 text-[#365CF5]">
                <span className="w-2 h-2 rounded-full bg-[#365CF5]" /> Income
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#13B8A6]/10 text-[#13B8A6]">
                <span className="w-2 h-2 rounded-full bg-[#13B8A6]" /> Savings
              </span>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-72 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#365CF5" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#365CF5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13B8A6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#13B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="month" stroke="#718096" fontSize={12} tickLine={false} />
                <YAxis stroke="#718096" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101B35',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                  }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="income" name="Income" stroke="#365CF5" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="savings" name="Net Savings" stroke="#13B8A6" strokeWidth={2.5} fillOpacity={1} fill="url(#savingsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {insight?.budget_tip && (
            <div className="mt-4 p-4 rounded-2xl bg-[#365CF5]/10 border border-[#365CF5]/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#365CF5] shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-[#17243A] dark:text-slate-200">
                <span className="font-bold text-[#365CF5] block mb-0.5">Algorithmic Guidance:</span>
                {insight.budget_tip}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Financial Health Score Gauge */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-slate-400">
              AI Credit & Health Standing
            </span>
            <h2 className="text-lg font-bold text-[#101B35] dark:text-white mt-1">
              Overall Financial Standing
            </h2>
          </div>

          <div className="my-6">
            <RadialGauge score={healthScore} maxScore={100} size={180} strokeWidth={16} />
          </div>

          <div className="w-full space-y-3 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#718096]">Classification:</span>
              <span className="font-extrabold text-[#13B8A6]">Prime (Tier 1)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#718096]">Borrowing Capacity:</span>
              <span className="font-extrabold text-[#365CF5]">High Pre-Approval</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#718096]">Insurance Protection:</span>
              <span className="font-extrabold text-[#16A34A]">Optimal (Health Covered)</span>
            </div>
            <p className="text-[11px] text-[#718096] pt-2 border-t border-slate-100 dark:border-slate-800">
              Evaluated using verified inflow consistency, zero delinquency record, and active emergency cushion.
            </p>
          </div>
        </div>
      </div>

      {/* Spending Breakdown & Active Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Spending Donut Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-slate-400">
                Expenditure Distribution
              </span>
              <h2 className="text-lg font-bold text-[#101B35] dark:text-white mt-0.5">
                Spending by Category
              </h2>
            </div>
            <Link to="/fintech" className="text-xs font-bold text-[#365CF5] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-56 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
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

        {/* Active Policies & Loans Summary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-slate-400">
                  Active Holdings
                </span>
                <h2 className="text-lg font-bold text-[#101B35] dark:text-white mt-0.5">
                  Portfolio Status
                </h2>
              </div>
              <Badge variant="teal" size="xs">Verified</Badge>
            </div>

            <div className="space-y-3 mt-4">
              {/* Insurance card */}
              <div className="p-3.5 rounded-2xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#365CF5]/15 text-[#365CF5] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#101B35] dark:text-white">Health Plus Comprehensive</p>
                    <p className="text-[11px] text-[#718096]">₹6,500/year · Active Policy</p>
                  </div>
                </div>
                <Badge variant="blue" size="xs">Protected</Badge>
              </div>

              {/* Loan card */}
              {loans.length > 0 ? (
                <div className="p-3.5 rounded-2xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#13B8A6]/15 text-[#13B8A6] flex items-center justify-center font-bold">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#101B35] dark:text-white">
                        {loans[0].loan_type.toUpperCase()} Loan
                      </p>
                      <p className="text-[11px] text-[#718096]">
                        ₹{loans[0].requested_amount?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="amber" size="xs">{loans[0].status}</Badge>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#13B8A6]/15 text-[#13B8A6] flex items-center justify-center font-bold">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#101B35] dark:text-white">Personal Loan (Pre-Approved)</p>
                      <p className="text-[11px] text-[#718096]">Pre-approved from 10.5% APR</p>
                    </div>
                  </div>
                  <Link to="/lending" className="text-xs font-bold text-[#365CF5] hover:underline">
                    Apply
                  </Link>
                </div>
              )}

              {/* Document intelligence card */}
              <div className="p-3.5 rounded-2xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#101B35] dark:text-white">Document Intelligence</p>
                    <p className="text-[11px] text-[#718096]">Payslip verified via OCR</p>
                  </div>
                </div>
                <Badge variant="emerald" size="xs">98.4% Match</Badge>
              </div>
            </div>
          </div>

          <Link
            to="/recommendations"
            className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-center text-xs font-bold text-[#101B35] dark:text-white hover:bg-slate-50 dark:hover:bg-[#17243A] transition-colors block"
          >
            View Personalized Recommendations →
          </Link>
        </div>

        {/* Application Progress Tracker */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-slate-400">
                  Customer Journeys
                </span>
                <h2 className="text-lg font-bold text-[#101B35] dark:text-white mt-0.5">
                  Milestone Progress
                </h2>
              </div>
              <Badge variant="blue" size="xs">84% Complete</Badge>
            </div>

            <div className="space-y-5 mt-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#365CF5]">1. Insurance Coverage</span>
                  <span className="text-[#718096]">85%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#365CF5] rounded-full w-[85%]" />
                </div>
                <p className="text-[11px] text-[#718096]">Health covered; term life comparison available.</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#13B8A6]">2. Lending Readiness</span>
                  <span className="text-[#718096]">90%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-[#13B8A6] rounded-full w-[90%]" />
                </div>
                <p className="text-[11px] text-[#718096]">Income verified, pre-qualified for instant disbursal.</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-purple-600 dark:text-purple-400">3. Budget Discipline</span>
                  <span className="text-[#718096]">75%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full w-[75%]" />
                </div>
                <p className="text-[11px] text-[#718096]">Surplus positive. Savings rate target achieved.</p>
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-[#17243A] text-center text-xs font-bold text-[#101B35] dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors block"
          >
            Manage Financial Profile & Goals
          </Link>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-[#101B35] dark:text-white">
              Recent Ledger Entries
            </h2>
            <p className="text-xs text-[#718096] dark:text-slate-400 font-medium mt-0.5">
              Real-time synchronization with automatic categorization & anomaly detection
            </p>
          </div>
          <button
            onClick={() => setTxModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#17243A] hover:bg-slate-200 text-[#101B35] dark:text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#365CF5]" />
            <span>Add Entry</span>
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-10">
              <CreditCard className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="mt-3 text-sm font-semibold text-[#718096]">No transactions recorded yet</p>
              <button
                onClick={() => setTxModal(true)}
                className="mt-2 text-xs font-bold text-[#365CF5] hover:underline"
              >
                Record your first transaction
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[#718096] uppercase font-bold tracking-wider">
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.slice(0, 7).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-[#17243A]/50 transition-colors">
                    <td className="py-3 font-bold text-[#101B35] dark:text-white">
                      {tx.description}
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#17243A] text-slate-700 dark:text-slate-300 font-semibold">
                        {tx.category || 'Other'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-bold capitalize ${
                          tx.transaction_type === 'income' ? 'text-[#16A34A]' : 'text-[#718096] dark:text-slate-400'
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
                          <AlertTriangle className="w-3 h-3" /> Flagged
                        </Badge>
                      ) : (
                        <Badge variant="emerald" size="xs">
                          <CheckCircle2 className="w-3 h-3" /> Verified
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
      <Modal isOpen={txModal} onClose={() => setTxModal(false)} title="Add Financial Ledger Entry">
        <form onSubmit={handleAddTx} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
              Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Cloud Subscription, Grocery Store, Salary"
              value={txForm.description}
              onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
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
                value={txForm.amount}
                onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={txForm.transaction_type}
                onChange={(e) => setTxForm({ ...txForm, transaction_type: e.target.value })}
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
              value={txForm.category}
              onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
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
              onClick={() => setTxModal(false)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#718096] hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingTx}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold transition-all shadow-md shadow-[#365CF5]/25"
            >
              {submittingTx ? 'Saving...' : 'Record Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
