import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sliders,
  Home,
  Heart,
  GraduationCap,
  Briefcase,
  Palmtree,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react'
import axios from 'axios'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import AnimatedCounter from '../components/AnimatedCounter'

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState('life_event') // 'life_event' or 'what_if'

  // Life Event Simulation State
  const [eventType, setEventType] = useState('house')
  const [targetYear, setTargetYear] = useState(2030)
  const [customBudget, setCustomBudget] = useState(6500000)
  const [currentSavings, setCurrentSavings] = useState(1200000)
  const [simResult, setSimResult] = useState(null)
  const [loadingSim, setLoadingSim] = useState(false)

  // What-If Scenario State
  const [income, setIncome] = useState(85000)
  const [expense, setExpense] = useState(42000)
  const [loanAmount, setLoanAmount] = useState(500000)
  const [loanRate, setLoanRate] = useState(10.5)
  const [loanTenure, setLoanTenure] = useState(36)
  const [monthlySip, setMonthlySip] = useState(8000)
  const [whatIfData, setWhatIfData] = useState([])

  const events = [
    { id: 'house', label: 'Buying a Home', icon: Home, defaultBudget: 6500000 },
    { id: 'marriage', label: 'Wedding Planning', icon: Heart, defaultBudget: 1800000 },
    { id: 'education', label: 'Higher Education / MBA', icon: GraduationCap, defaultBudget: 2800000 },
    { id: 'business', label: 'Starting a Business', icon: Briefcase, defaultBudget: 2000000 },
    { id: 'retirement', label: 'Retirement Corpus', icon: Palmtree, defaultBudget: 25000000 },
  ]

  useEffect(() => {
    runLifeSimulation()
  }, [eventType, targetYear, customBudget, currentSavings])

  useEffect(() => {
    runWhatIfSimulation()
  }, [income, expense, loanAmount, loanRate, loanTenure, monthlySip])

  const runLifeSimulation = async () => {
    setLoadingSim(true)
    try {
      const res = await axios.post('/api/ai/financial-simulation', {
        event_type: eventType,
        target_year: targetYear,
        custom_budget: customBudget,
        current_savings: currentSavings
      })
      setSimResult(res.data)
    } catch (err) {
      console.error(err)
      // Deterministic calculation
      const years = Math.max(1, targetYear - 2026)
      const inflation = eventType === 'education' ? 0.08 : eventType === 'marriage' ? 0.07 : 0.06
      const projCost = Math.round(customBudget * Math.pow(1 + inflation, years))
      const upfront = Math.round(eventType === 'house' ? projCost * 0.20 : projCost)
      const shortfall = Math.max(0, upfront - currentSavings)
      const monthly = Math.round(shortfall / (years * 12))

      setSimResult({
        event_name: events.find(e => e.id === eventType)?.label || 'Goal',
        target_year: targetYear,
        years_until_event: years,
        base_cost_today: customBudget,
        projected_cost_future: projCost,
        upfront_requirement: upfront,
        current_savings_allocated: currentSavings,
        shortfall: shortfall,
        required_monthly_savings: monthly,
        estimated_inflation_rate: `${(inflation * 100).toFixed(1)}% p.a.`
      })
    } finally {
      setLoadingSim(false)
    }
  }

  const runWhatIfSimulation = async () => {
    try {
      const res = await axios.post('/api/ai/what-if', {
        income,
        expense,
        loan_amount: loanAmount,
        loan_rate: loanRate,
        loan_tenure_months: loanTenure,
        monthly_savings_sip: monthlySip,
        months: 24
      })
      setWhatIfData(res.data)
    } catch (err) {
      console.error(err)
      // Generate synthetic 24-month progression
      const timeline = []
      let cash = 100000
      let wealth = 100000
      const r = (loanRate / 100) / 12
      const emi = (loanAmount * r * Math.pow(1 + r, loanTenure)) / (Math.pow(1 + r, loanTenure) - 1)

      for (let m = 1; m <= 24; m++) {
        const surplus = income - expense - (m <= loanTenure ? emi : 0) - monthlySip
        cash += Math.max(0, surplus)
        wealth = (wealth * 1.009) + monthlySip
        timeline.append ? null : timeline.push({
          month: `M${m}`,
          net_surplus: Math.round(surplus),
          loan_emi: Math.round(emi),
          cash_reserves: Math.round(cash),
          invested_wealth: Math.round(wealth)
        })
      }
      setWhatIfData(timeline)
    }
  }

  // Trajectory Chart Data for Life Event
  const yearsAhead = simResult?.years_until_event || 4
  const trajectoryChartData = []
  const initialCap = currentSavings
  const monthlyReq = simResult?.required_monthly_savings || 15000
  for (let yr = 0; yr <= yearsAhead; yr++) {
    const yrLabel = 2026 + yr
    const withoutExtra = initialCap * Math.pow(1.07, yr)
    const withExtra = (initialCap * Math.pow(1.09, yr)) + (monthlyReq * 12 * yr)
    trajectoryChartData.push({
      year: yrLabel.toString(),
      'Current Savings (Status Quo)': Math.round(withoutExtra),
      'Target Trajectory (With Monthly SIP)': Math.round(withExtra),
      'Projected Cost Benchmark': Math.round(simResult?.projected_cost_future || customBudget)
    })
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#1E2D4A] text-white border border-[#1E2D4A] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#13B8A6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13B8A6]/20 border border-[#13B8A6]/30 text-[#13B8A6] text-xs font-bold tracking-wide mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>AI FINANCIAL WHAT-IF SIMULATOR</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Life Event & Wealth Scenario Engine
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Test major life milestones with real-time inflation modeling, compounding returns, and debt-stress tolerance calculations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 flex items-center p-1.5 rounded-2xl bg-white/10 border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('life_event')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'life_event'
                ? 'bg-[#365CF5] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Life Event Simulator
          </button>
          <button
            onClick={() => setActiveTab('what_if')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'what_if'
                ? 'bg-[#365CF5] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Cashflow & Debt Impact
          </button>
        </div>
      </div>

      {activeTab === 'life_event' ? (
        <div className="space-y-8">
          {/* Milestone Selection Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {events.map((ev) => {
              const Icon = ev.icon
              const isSelected = eventType === ev.id
              return (
                <button
                  key={ev.id}
                  onClick={() => {
                    setEventType(ev.id)
                    setCustomBudget(ev.defaultBudget)
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col items-start gap-3 transition-all ${
                    isSelected
                      ? 'bg-[#365CF5] text-white border-[#365CF5] shadow-lg shadow-[#365CF5]/25 scale-[1.02]'
                      : 'bg-white dark:bg-[#101B35] text-[#17243A] dark:text-white border-slate-200 dark:border-[#1E2D4A] hover:border-[#365CF5]/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-[#365CF5]/10 text-[#365CF5]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold">{ev.label}</span>
                </button>
              )
            })}
          </div>

          {/* Simulator Controls & Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-[#101B35] dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#365CF5]" />
                <span>Simulation Parameters</span>
              </h3>

              {/* Slider 1: Target Year */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#17243A] dark:text-slate-300">Target Year of Execution</span>
                  <span className="text-[#365CF5] font-extrabold">{targetYear} ({targetYear - 2026} Years)</span>
                </div>
                <input
                  type="range"
                  min="2027"
                  max="2040"
                  step="1"
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  className="w-full accent-[#365CF5] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#718096]">
                  <span>2027 (Next Year)</span>
                  <span>2033</span>
                  <span>2040</span>
                </div>
              </div>

              {/* Slider 2: Estimated Budget Today */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#17243A] dark:text-slate-300">Estimated Cost in Today's Money</span>
                  <span className="text-[#365CF5] font-extrabold">₹{customBudget.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="20000000"
                  step="250000"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(Number(e.target.value))}
                  className="w-full accent-[#365CF5] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#718096]">
                  <span>₹5 Lakhs</span>
                  <span>₹1 Crore</span>
                  <span>₹2 Crores</span>
                </div>
              </div>

              {/* Slider 3: Current Savings Allocated */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#17243A] dark:text-slate-300">Existing Savings Earmarked</span>
                  <span className="text-[#13B8A6] font-extrabold">₹{currentSavings.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.min(customBudget, 5000000)}
                  step="50000"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full accent-[#13B8A6] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#718096]">
                  <span>₹0</span>
                  <span>₹25 Lakhs</span>
                  <span>₹50 Lakhs</span>
                </div>
              </div>

              {/* Summary Pill */}
              <div className="p-4 rounded-2xl bg-[#F7F9FC] dark:bg-[#17243A] border border-slate-200 dark:border-[#1E2D4A] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#718096]">Annual Inflation Rate:</span>
                  <span className="font-bold text-[#101B35] dark:text-white">{simResult?.estimated_inflation_rate || '6.0% p.a.'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718096]">Down Payment Requirement:</span>
                  <span className="font-bold text-[#101B35] dark:text-white">
                    {eventType === 'house' ? '20% Upfront + 80% Home Loan' : '100% Fully Self-Funded'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Output Dashboard (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Highlight Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Future Inflation Cost</span>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#101B35] dark:text-white mt-1">
                    ₹{(simResult?.projected_cost_future || customBudget).toLocaleString('en-IN')}
                  </p>
                  <span className="text-[11px] text-[#F59E0B] font-semibold">
                    +₹{((simResult?.projected_cost_future || customBudget) - customBudget).toLocaleString('en-IN')} inflation
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Upfront Capital Needed</span>
                  <p className="text-xl sm:text-2xl font-extrabold text-[#365CF5] mt-1">
                    ₹{(simResult?.upfront_requirement || customBudget).toLocaleString('en-IN')}
                  </p>
                  <span className="text-[11px] text-[#718096] font-semibold">
                    Shortfall: ₹{(simResult?.shortfall || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-tr from-[#365CF5] to-[#13B8A6] text-white shadow-lg shadow-[#365CF5]/25">
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">Required Monthly SIP</span>
                  <p className="text-xl sm:text-2xl font-extrabold mt-1">
                    ₹{(simResult?.required_monthly_savings || 0).toLocaleString('en-IN')}
                  </p>
                  <span className="text-[11px] opacity-90 font-medium">To close gap by {targetYear}</span>
                </div>
              </div>

              {/* Trajectory Growth Chart */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#101B35] dark:text-white">
                      Wealth Accumulation Trajectory vs Target
                    </h4>
                    <p className="text-[11px] text-[#718096]">
                      Compounded growth curve modeled with 9% blended equity/debt returns
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trajectoryChartData}>
                      <defs>
                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#13B8A6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#13B8A6" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#365CF5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#365CF5" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                      <XAxis dataKey="year" stroke="#718096" fontSize={11} />
                      <YAxis
                        stroke="#718096"
                        fontSize={10}
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                      />
                      <Tooltip
                        formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                        contentStyle={{ backgroundColor: '#101B35', borderColor: '#1E2D4A', borderRadius: 12, color: '#fff', fontSize: 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area
                        type="monotone"
                        dataKey="Target Trajectory (With Monthly SIP)"
                        stroke="#13B8A6"
                        strokeWidth={2.5}
                        fill="url(#colorTarget)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Current Savings (Status Quo)"
                        stroke="#365CF5"
                        strokeWidth={2}
                        fill="url(#colorCurrent)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* What-If Cashflow & Debt Simulation Tab */
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sliders (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm space-y-5">
              <h3 className="text-base font-extrabold text-[#101B35] dark:text-white">
                Monthly Cashflow Levers
              </h3>

              {/* Monthly Income */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#17243A] dark:text-slate-300">Monthly Net Income</span>
                  <span className="text-[#365CF5]">₹{income.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="300000"
                  step="5000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full accent-[#365CF5]"
                />
              </div>

              {/* Living Expenses */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#17243A] dark:text-slate-300">Monthly Living Expenses</span>
                  <span className="text-[#EF4444]">₹{expense.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="150000"
                  step="2500"
                  value={expense}
                  onChange={(e) => setExpense(Number(e.target.value))}
                  className="w-full accent-[#EF4444]"
                />
              </div>

              {/* Proposed New Loan */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#17243A] dark:text-slate-300">Proposed New Loan Borrowing</span>
                  <span className="text-[#8B5CF6]">₹{loanAmount.toLocaleString('en-IN')} @ {loanRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2500000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#8B5CF6]"
                />
              </div>

              {/* Monthly SIP Allocation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#17243A] dark:text-slate-300">Monthly Investment / SIP</span>
                  <span className="text-[#13B8A6]">₹{monthlySip.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={monthlySip}
                  onChange={(e) => setMonthlySip(Number(e.target.value))}
                  className="w-full accent-[#13B8A6]"
                />
              </div>
            </div>

            {/* Right Chart (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
              <h3 className="text-base font-extrabold text-[#101B35] dark:text-white mb-1">
                24-Month Projected Balance & Net Wealth
              </h3>
              <p className="text-xs text-[#718096] mb-6">
                Illustrates liquid emergency cash reserves versus compounded market investments.
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={whatIfData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#718096" fontSize={10} />
                    <YAxis
                      stroke="#718096"
                      fontSize={10}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                      contentStyle={{ backgroundColor: '#101B35', borderColor: '#1E2D4A', borderRadius: 12, color: '#fff', fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area
                      type="monotone"
                      dataKey="invested_wealth"
                      name="Compounded Wealth (Investments)"
                      stroke="#13B8A6"
                      fill="#13B8A6"
                      fillOpacity={0.25}
                    />
                    <Area
                      type="monotone"
                      dataKey="cash_reserves"
                      name="Liquid Cash Buffer"
                      stroke="#365CF5"
                      fill="#365CF5"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
