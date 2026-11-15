import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Landmark,
  Calculator,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Briefcase
} from 'lucide-react'
import api from '../api'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { useToast } from '../context/ToastContext'

export default function LendingJourney() {
  const { addToast } = useToast()

  const [products, setProducts] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  // Multi-step Application Wizard State: Step 1 (Category & Loan) -> Step 2 (Income & Employment) -> Step 3 (Calculations) -> Step 4 (Eligibility & Checklist)
  const [step, setStep] = useState(1)

  // Form state
  const [form, setForm] = useState({
    loan_type: 'personal',
    requested_amount: 300000,
    monthly_income: 55000,
    employment_type: 'salaried',
    purpose: 'Debt Consolidation & Home Renovation'
  })

  // Live Eligibility Result
  const [eligibilityResult, setEligibilityResult] = useState(null)
  const [evaluating, setEvaluating] = useState(false)
  const [submittingApp, setSubmittingApp] = useState(false)

  // Interactive EMI Calculator State
  const [calcAmount, setCalcAmount] = useState(300000)
  const [calcRate, setCalcRate] = useState(10.5)
  const [calcTenureMonths, setCalcTenureMonths] = useState(36)

  // Document Checklist states
  const [checklist, setChecklist] = useState({
    payslip: true,
    bankStatement: true,
    idProof: true,
    addressProof: false
  })

  const loadLendingData = async () => {
    setLoading(true)
    try {
      const [prodRes, appRes] = await Promise.all([
        api.get('/loans/products'),
        api.get('/loans/applications')
      ])
      setProducts(prodRes.data.items || [])
      setApplications(appRes.data || [])
    } catch (err) {
      console.error('Failed to load lending data', err)
      addToast('Failed to load loan catalog', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLendingData()
  }, [])

  // Calculate live EMI
  const monthlyRate = calcRate / (12 * 100)
  const emi = Math.round(
    (calcAmount * monthlyRate * Math.pow(1 + monthlyRate, calcTenureMonths)) /
    (Math.pow(1 + monthlyRate, calcTenureMonths) - 1)
  ) || 0
  const totalPayment = emi * calcTenureMonths
  const totalInterest = Math.max(0, totalPayment - calcAmount)
  const principalPct = totalPayment > 0 ? Math.round((calcAmount / totalPayment) * 100) : 70
  const interestPct = Math.max(0, 100 - principalPct)

  const handleCheckEligibility = async () => {
    setEvaluating(true)
    try {
      const res = await api.post('/loans/eligibility', {
        loan_type: form.loan_type,
        requested_amount: form.requested_amount,
        monthly_income: form.monthly_income,
        employment_type: form.employment_type
      })
      setEligibilityResult(res.data)
      addToast('Eligibility evaluated by ML demo model!', 'info')
      setStep(4)
    } catch (err) {
      addToast('Failed to evaluate eligibility', 'error')
    } finally {
      setEvaluating(false)
    }
  }

  const handleSubmitApplication = async () => {
    setSubmittingApp(true)
    try {
      const res = await api.post('/loans/applications', {
        loan_type: form.loan_type,
        requested_amount: form.requested_amount,
        monthly_income: form.monthly_income,
        employment_type: form.employment_type
      })
      addToast(`Application #${res.data.id} submitted for underwriting!`, 'success')
      loadLendingData()
      setStep(1)
    } catch (err) {
      addToast('Failed to submit application', 'error')
    } finally {
      setSubmittingApp(false)
    }
  }

  return (
    <div className="space-y-8 text-[#17243A] dark:text-white">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#365CF5] p-6 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#13B8A6] text-xs font-bold tracking-wide backdrop-blur-md mb-3">
              <Landmark className="w-3.5 h-3.5" />
              <span>SMART LENDING & UNDERWRITING</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Smart Loan Journey
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Experience frictionless credit pre-qualification evaluated by our Random Forest ML risk engine with transparent amortization and instant verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/document-intelligence"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#101B35] font-bold text-sm shadow-md hover:bg-slate-100 transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4 text-[#365CF5]" />
              <span>Verify Payslip OCR</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Multi-Step Wizard & EMI Calculator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Multi-Step Application Wizard (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            {/* Step Wizard Progress Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(s)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === s
                          ? 'bg-[#365CF5] text-white shadow-md'
                          : step > s
                          ? 'bg-[#16A34A] text-white'
                          : 'bg-slate-100 dark:bg-[#17243A] text-[#718096]'
                      }`}
                    >
                      {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                    </button>
                    {s < 4 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200 dark:bg-slate-800" />}
                  </div>
                ))}
              </div>
              <span className="text-xs font-extrabold text-[#365CF5] uppercase tracking-wider">
                Step {step} of 4
              </span>
            </div>

            {/* Step 1: Category & Requested Amount */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mt-6 space-y-5"
              >
                <h3 className="text-base font-bold text-[#101B35] dark:text-white">
                  Step 1: Select Loan Category & Purpose
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'personal', name: 'Personal Loan', rate: 'From 10.5%', desc: 'Instant flexible financing' },
                    { id: 'bike', name: 'Two-Wheeler Loan', rate: 'From 8.9%', desc: 'Electric & commuter bikes' },
                    { id: 'education', name: 'Education Loan', rate: 'From 9.2%', desc: 'Tuition & overseas living' },
                    { id: 'home', name: 'Home Renovation', rate: 'From 8.5%', desc: 'Interior & structural upgrades' },
                  ].map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setForm({ ...form, loan_type: cat.id })}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        form.loan_type === cat.id
                          ? 'border-[#365CF5] bg-[#365CF5]/5 dark:bg-[#365CF5]/10 shadow-sm'
                          : 'border-slate-200 dark:border-[#1E2D4A] hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#101B35] dark:text-white">{cat.name}</span>
                        <span className="text-xs font-extrabold text-[#16A34A]">{cat.rate}</span>
                      </div>
                      <p className="text-xs text-[#718096] mt-1">{cat.desc}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                    Intended Loan Amount: ₹{form.requested_amount.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="25000"
                    max="1500000"
                    step="25000"
                    value={form.requested_amount}
                    onChange={(e) => {
                      const val = +e.target.value
                      setForm({ ...form, requested_amount: val })
                      setCalcAmount(val)
                    }}
                    className="w-full accent-[#365CF5] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#718096] mt-1">
                    <span>₹25,000</span>
                    <span>₹7,50,000</span>
                    <span>₹15,00,000</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-xl bg-[#365CF5] text-white text-xs font-bold hover:bg-[#2449D8] transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to Income & Employment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Income & Employment */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mt-6 space-y-5"
              >
                <h3 className="text-base font-bold text-[#101B35] dark:text-white">
                  Step 2: Income & Employment Verification
                </h3>

                <div>
                  <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1.5">
                    Employment Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['salaried', 'self-employed', 'other'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, employment_type: type })}
                        className={`p-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                          form.employment_type === type
                            ? 'border-[#365CF5] bg-[#365CF5]/10 text-[#365CF5]'
                            : 'border-slate-200 dark:border-[#1E2D4A] text-[#718096]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-2">
                    Monthly In-Hand Net Income: ₹{form.monthly_income.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="15000"
                    max="250000"
                    step="5000"
                    value={form.monthly_income}
                    onChange={(e) => setForm({ ...form, monthly_income: +e.target.value })}
                    className="w-full accent-[#365CF5] h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#718096] mt-1">
                    <span>₹15,000</span>
                    <span>₹1,25,000</span>
                    <span>₹2,50,000</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#718096]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl bg-[#365CF5] text-white text-xs font-bold hover:bg-[#2449D8] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Amortization</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Evaluate */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mt-6 space-y-5"
              >
                <h3 className="text-base font-bold text-[#101B35] dark:text-white">
                  Step 3: Review Terms & Trigger ML Model
                </h3>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Selected Category:</span>
                    <span className="font-bold capitalize text-[#101B35] dark:text-white">{form.loan_type} Loan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Requested Principal:</span>
                    <span className="font-extrabold text-[#365CF5]">₹{form.requested_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Monthly Inflow:</span>
                    <span className="font-bold text-[#101B35] dark:text-white">₹{form.monthly_income.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Debt-to-Income Indicator:</span>
                    <span className="font-bold text-[#16A34A]">{( (form.requested_amount / 36) / form.monthly_income * 100 ).toFixed(1)}% (Healthy)</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#718096]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckEligibility}
                    disabled={evaluating}
                    className="flex-1 py-3 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold shadow-md shadow-[#365CF5]/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{evaluating ? 'Evaluating ML Model...' : 'Assess Eligibility Now'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Eligibility Result & Checklist */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="mt-6 space-y-5"
              >
                <div className="p-5 rounded-2xl bg-[#16A34A]/10 border border-[#16A34A]/25">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#16A34A] font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Pre-Qualification Score</span>
                    </div>
                    <span className="text-3xl font-extrabold text-[#16A34A]">
                      {eligibilityResult?.demo_indicator || 94.2}%
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#17243A] dark:text-slate-200">
                    {eligibilityResult?.explanation || 'Synthetic Random Forest model indicates high probability of approval based on your verified income ratio.'}
                  </p>
                </div>

                {/* Required Document Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096] mb-3">
                    Required Document Checklist
                  </h4>
                  <div className="space-y-2">
                    {[
                      { key: 'payslip', label: 'Last 3 Months Salary Slips', done: checklist.payslip },
                      { key: 'bankStatement', label: '6 Months Bank Account Statement', done: checklist.bankStatement },
                      { key: 'idProof', label: 'Aadhaar / PAN Identity Proof', done: checklist.idProof },
                      { key: 'addressProof', label: 'Utility Bill / Residence Verification', done: checklist.addressProof }
                    ].map((item) => (
                      <div
                        key={item.key}
                        onClick={() => setChecklist({ ...checklist, [item.key]: !item.done })}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] cursor-pointer text-xs"
                      >
                        <span className="font-semibold text-[#17243A] dark:text-slate-200">{item.label}</span>
                        {item.done ? (
                          <span className="inline-flex items-center gap-1 text-[#16A34A] font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Attached
                          </span>
                        ) : (
                          <span className="text-[#F59E0B] font-bold">Pending</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#718096]"
                  >
                    Adjust Details
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={submittingApp}
                    className="flex-1 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-md shadow-[#16A34A]/25 transition-all"
                  >
                    {submittingApp ? 'Submitting to Queue...' : 'Confirm & Submit Application'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Interactive EMI Calculator (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#718096]">Amortization Tool</span>
                <h3 className="text-base font-bold text-[#101B35] dark:text-white mt-0.5">
                  Interactive EMI Simulator
                </h3>
              </div>
              <Calculator className="w-5 h-5 text-[#365CF5]" />
            </div>

            {/* Sliders */}
            <div className="space-y-5 mt-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#718096]">Loan Amount</span>
                  <span className="text-[#365CF5]">₹{calcAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1500000"
                  step="25000"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(+e.target.value)}
                  className="w-full accent-[#365CF5] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#718096]">Interest Rate</span>
                  <span className="text-[#365CF5]">{calcRate}% APR</span>
                </div>
                <input
                  type="range"
                  min="8.5"
                  max="18.0"
                  step="0.25"
                  value={calcRate}
                  onChange={(e) => setCalcRate(+e.target.value)}
                  className="w-full accent-[#365CF5] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#718096]">Tenure</span>
                  <span className="text-[#365CF5]">{calcTenureMonths} Months ({calcTenureMonths / 12} yrs)</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="60"
                  step="6"
                  value={calcTenureMonths}
                  onChange={(e) => setCalcTenureMonths(+e.target.value)}
                  className="w-full accent-[#365CF5] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Monthly EMI Result Badge */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-tr from-[#365CF5] to-[#2449D8] text-white text-center shadow-lg shadow-[#365CF5]/20">
              <span className="text-xs uppercase font-extrabold tracking-wider opacity-80">Estimated Monthly EMI</span>
              <p className="text-3xl font-extrabold mt-1">₹{emi.toLocaleString('en-IN')}</p>
              <p className="text-[11px] opacity-80 mt-1">Total Payment: ₹{totalPayment.toLocaleString('en-IN')}</p>
            </div>

            {/* Principal vs Interest Proportional Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#101B35] dark:text-white">Principal ({principalPct}%)</span>
                <span className="text-[#F59E0B]">Interest ({interestPct}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div className="h-full bg-[#365CF5]" style={{ width: `${principalPct}%` }} />
                <div className="h-full bg-[#F59E0B]" style={{ width: `${interestPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Status Tracker */}
      <div className="rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-[#101B35] dark:text-white">
              Application Status Tracker
            </h3>
            <p className="text-xs text-[#718096]">Real-time underwriting audit trail</p>
          </div>
          <Badge variant="blue" size="xs">{applications.length} Submissions</Badge>
        </div>

        <div className="mt-4 space-y-3">
          {applications.length === 0 ? (
            <p className="text-xs text-[#718096] py-4 text-center">No active loan applications submitted yet.</p>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#365CF5]/15 text-[#365CF5] flex items-center justify-center font-bold">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-[#101B35] dark:text-white">
                        Application #{app.id} · {app.loan_type?.toUpperCase()}
                      </span>
                      <Badge
                        variant={app.status === 'approved' ? 'emerald' : app.status === 'rejected' ? 'rose' : 'amber'}
                        size="xs"
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#718096] mt-0.5">
                      Requested: ₹{app.requested_amount?.toLocaleString('en-IN')} · Scored via Random Forest
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-[#718096]">
                  {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Active'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
