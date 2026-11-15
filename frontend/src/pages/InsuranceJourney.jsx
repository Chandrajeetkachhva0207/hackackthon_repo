import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Sliders,
  ArrowRight,
  Info,
  Layers,
  HeartPulse,
  Car,
  UserPlus,
  FileText,
  ChevronRight
} from 'lucide-react'
import api from '../api'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import { useToast } from '../context/ToastContext'

export default function InsuranceJourney() {
  const { addToast } = useToast()

  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Policy Explain Modal State
  const [explainModal, setExplainModal] = useState(false)
  const [explainingPolicy, setExplainingPolicy] = useState(null)
  const [explanationText, setExplanationText] = useState('')
  const [loadingExplain, setLoadingExplain] = useState(false)

  // Compare Mode State
  const [compareList, setCompareList] = useState([])
  const [compareModal, setCompareModal] = useState(false)

  // Interactive Premium Calculator State
  const [calcAge, setCalcAge] = useState(30)
  const [calcCover, setCalcCover] = useState(1000000) // 10 Lakhs
  const [calcCriticalIllness, setCalcCriticalIllness] = useState(true)
  const [calcZeroDep, setCalcZeroDep] = useState(false)

  // Policy Enrollment Modal
  const [enrollModal, setEnrollModal] = useState(false)
  const [enrollingPolicy, setEnrollingPolicy] = useState(null)
  const [enrollStep, setEnrollStep] = useState(1)

  const loadPolicies = async (query = '') => {
    setLoading(true)
    try {
      const res = await api.get('/insurance/policies', { params: { q: query } })
      setPolicies(res.data.items || [])
    } catch (err) {
      console.error('Failed to load policies', err)
      addToast('Failed to load policies catalog', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPolicies(search)
  }, [search])

  const handleExplain = async (policy) => {
    setExplainingPolicy(policy)
    setExplainModal(true)
    setLoadingExplain(true)
    try {
      const res = await api.post('/insurance/explain', { policy_id: policy.id })
      setExplanationText(res.data.plain_language_explanation)
    } catch (err) {
      setExplanationText(
        `${policy.name} provides ${policy.coverage}. Premium is ₹${policy.annual_premium}/year. This is a synthetic demo policy.`
      )
    } finally {
      setLoadingExplain(false)
    }
  }

  const toggleCompare = (policy) => {
    if (compareList.some((p) => p.id === policy.id)) {
      setCompareList(compareList.filter((p) => p.id !== policy.id))
    } else {
      if (compareList.length >= 3) {
        addToast('You can compare up to 3 policies at once', 'info')
        return
      }
      setCompareList([...compareList, policy])
    }
  }

  // Calculate estimated premium
  const calculatedPremium = Math.round(
    (calcCover * 0.005) * (1 + (calcAge - 20) * 0.02) +
    (calcCriticalIllness ? 1800 : 0) +
    (calcZeroDep ? 1200 : 0)
  )

  const filteredPolicies = policies.filter((p) => {
    if (selectedCategory === 'all') return true
    return p.type?.toLowerCase() === selectedCategory
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
            PROTECT WHAT MATTERS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight mt-1">
            Intuitive Insurance Journey
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Compare comprehensive policies, demystify complex terms with AI, and simulate customized coverage in seconds.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={() => setCompareModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-blue text-white text-sm font-bold shadow-glow-blue animate-fade-in"
          >
            <Layers className="w-4 h-4" />
            <span>Compare Selected ({compareList.length})</span>
          </button>
        )}
      </div>

      {/* Category Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'all', label: 'All Covers', icon: ShieldCheck, count: 'Catalog' },
          { id: 'health', label: 'Health Insurance', icon: HeartPulse, count: 'Hospitalization' },
          { id: 'life', label: 'Term Life Cover', icon: UserPlus, count: 'Pure Term' },
          { id: 'motor', label: 'Motor & Bike', icon: Car, count: 'Accident & Liability' },
        ].map((cat) => {
          const Icon = cat.icon
          const active = selectedCategory === cat.id
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                active
                  ? 'bg-brand-blue/10 dark:bg-brand-blue/20 border-brand-blue text-navy-900 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-surface-darkCard border-surface-border dark:border-surface-darkBorder hover:border-slate-300'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  active ? 'bg-brand-blue text-white' : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold">{cat.label}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{cat.count}</p>
            </div>
          )
        })}
      </div>

      {/* Main 2-Column Section: Catalog on Left, Calculator & Guidance on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Policies Catalog */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-card flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search policies (e.g. bike, health, life, hospital, accident)..."
              className="flex-1 bg-transparent text-sm text-navy-900 dark:text-white focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs font-semibold text-slate-400 hover:text-navy-900"
              >
                Clear
              </button>
            )}
          </div>

          {/* Policy Cards Grid */}
          <div className="space-y-4">
            {filteredPolicies.map((p) => {
              const isCompared = compareList.some((item) => item.id === p.id)
              return (
                <div
                  key={p.id}
                  className="p-6 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">
                        {p.type || 'Insurance'}
                      </span>
                      <span className="text-xs text-slate-400">CSR: 98.6%</span>
                    </div>

                    <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                      {p.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {p.coverage}
                    </p>

                    {p.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        {p.notes}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 dark:border-navy-800">
                    <div className="sm:text-right">
                      <span className="text-xs text-slate-400 block">Annual Premium</span>
                      <span className="text-xl sm:text-2xl font-extrabold text-navy-900 dark:text-white">
                        ₹{p.annual_premium?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">per year (demo)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCompare(p)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          isCompared
                            ? 'bg-brand-blue text-white border-brand-blue'
                            : 'bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-navy-700 hover:bg-slate-50'
                        }`}
                      >
                        {isCompared ? 'Comparing' : 'Compare'}
                      </button>

                      <button
                        onClick={() => handleExplain(p)}
                        className="px-4 py-2 rounded-xl bg-brand-blue/10 dark:bg-brand-blue/20 hover:bg-brand-blue hover:text-white text-brand-blue dark:text-blue-400 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Explain</span>
                      </button>

                      <button
                        onClick={() => {
                          setEnrollingPolicy(p)
                          setEnrollStep(1)
                          setEnrollModal(true)
                        }}
                        className="px-4 py-2 rounded-xl bg-navy-900 dark:bg-white text-white dark:text-navy-900 hover:bg-brand-blue text-xs font-bold transition-all"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Premium Calculator & Terminology */}
        <div className="space-y-6">
          {/* Interactive Premium Calculator Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-card space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-navy-900 dark:text-white">
                Live Premium Simulator
              </h3>
            </div>

            {/* Slider 1: Age */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Insured Age:</span>
                <span className="text-navy-900 dark:text-white">{calcAge} years</span>
              </div>
              <input
                type="range"
                min="18"
                max="65"
                value={calcAge}
                onChange={(e) => setCalcAge(+e.target.value)}
                className="w-full accent-brand-blue cursor-pointer"
              />
            </div>

            {/* Slider 2: Sum Insured */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500">Coverage (Sum Insured):</span>
                <span className="text-navy-900 dark:text-white">
                  ₹{(calcCover / 100000).toFixed(0)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="300000"
                max="5000000"
                step="100000"
                value={calcCover}
                onChange={(e) => setCalcCover(+e.target.value)}
                className="w-full accent-brand-teal cursor-pointer"
              />
            </div>

            {/* Addon Checkboxes */}
            <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-navy-800">
              <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={calcCriticalIllness}
                  onChange={(e) => setCalcCriticalIllness(e.target.checked)}
                  className="rounded text-brand-blue focus:ring-brand-blue"
                />
                <span>Critical Illness Cover (+₹1,800/yr)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={calcZeroDep}
                  onChange={(e) => setCalcZeroDep(e.target.checked)}
                  className="rounded text-brand-blue focus:ring-brand-blue"
                />
                <span>Hospital Daily Cash (+₹1,200/yr)</span>
              </label>
            </div>

            {/* Result Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Estimated Annual Premium
              </span>
              <div className="text-3xl font-extrabold text-brand-blue mt-1">
                ₹{calculatedPremium.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-400"> / yr</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Illustrative calculation based on synthetic risk tables.
              </p>
            </div>
          </div>

          {/* Plain-Language Insurance Glossary */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-darkCard border border-surface-border dark:border-surface-darkBorder shadow-card space-y-4">
            <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-blue" />
              Insurance Terms Explained
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900/60">
                <span className="font-bold text-navy-900 dark:text-white block">Deductible</span>
                <span className="text-slate-500">The amount you pay out of pocket before the insurer begins covering expenses.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900/60">
                <span className="font-bold text-navy-900 dark:text-white block">Waiting Period</span>
                <span className="text-slate-500">A designated period (e.g., 2–4 years for pre-existing diseases) before specific conditions are claimable.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900/60">
                <span className="font-bold text-navy-900 dark:text-white block">Claim Settlement Ratio (CSR)</span>
                <span className="text-slate-500">The percentage of total claims settled by the insurer out of all claims received in a financial year.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Plain-Language Explain Modal */}
      <Modal
        isOpen={explainModal}
        onClose={() => setExplainModal(false)}
        title={explainingPolicy ? `AI Breakdown: ${explainingPolicy.name}` : 'Policy Explanation'}
        subtitle="Plain-language translation of policy terms, coverage conditions, and exclusions."
      >
        <div className="space-y-4">
          {loadingExplain ? (
            <div className="py-8 text-center text-slate-500 flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-blue animate-spin" />
              <span>Analyzing policy terms with AI engine...</span>
            </div>
          ) : (
            <>
              <div className="p-5 rounded-2xl bg-brand-blue/5 dark:bg-brand-blue/10 border border-brand-blue/20 text-sm leading-relaxed text-navy-900 dark:text-slate-100">
                <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Plain-Language Synthesis:
                </h4>
                {explanationText}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
                  <span className="text-slate-400 block font-semibold">Hospital Network</span>
                  <span className="text-navy-900 dark:text-white font-bold mt-0.5 block">14,200+ Cashless</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
                  <span className="text-slate-400 block font-semibold">Pre/Post Hospitalization</span>
                  <span className="text-navy-900 dark:text-white font-bold mt-0.5 block">60 / 90 Days Covered</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                Notice: Verify the exact policy document with your insurer before binding coverage.
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setExplainModal(false)}
              className="px-5 py-2.5 rounded-xl bg-navy-900 dark:bg-white text-white dark:text-navy-900 text-xs font-bold hover:bg-brand-blue"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Compare Policies Modal */}
      <Modal
        isOpen={compareModal}
        onClose={() => setCompareModal(false)}
        title="Side-by-Side Policy Comparison"
        subtitle="Compare coverage, premiums, and conditions."
        maxWidth="max-w-4xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-navy-800 text-slate-400">
                <th className="pb-3 font-bold uppercase">Feature</th>
                {compareList.map((p) => (
                  <th key={p.id} className="pb-3 font-bold text-navy-900 dark:text-white">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
              <tr>
                <td className="py-3 font-bold text-slate-500">Annual Premium</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 font-extrabold text-brand-blue">
                    ₹{p.annual_premium?.toLocaleString('en-IN')}/yr
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-500">Coverage Summary</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 text-slate-700 dark:text-slate-300">
                    {p.coverage}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-500">Category</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 uppercase font-semibold text-slate-500">
                    {p.type}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-500">Claim Settlement</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 font-bold text-brand-emerald">
                    98.6%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Policy Enrollment Modal */}
      <Modal
        isOpen={enrollModal}
        onClose={() => setEnrollModal(false)}
        title={enrollingPolicy ? `Enroll in ${enrollingPolicy.name}` : 'Policy Application'}
        subtitle="Step-by-step digital application simulation"
      >
        <div className="space-y-6">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between">
            {['Plan Selected', 'Insured Details', 'Declaration', 'Complete'].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    enrollStep > idx + 1
                      ? 'bg-brand-emerald text-white'
                      : enrollStep === idx + 1
                      ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20'
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-400'
                  }`}
                >
                  {enrollStep > idx + 1 ? '✓' : idx + 1}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-medium">{step}</span>
              </div>
            ))}
          </div>

          {enrollStep === 1 && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-100 dark:border-navy-800">
                <h4 className="font-bold text-sm text-navy-900 dark:text-white">{enrollingPolicy?.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{enrollingPolicy?.coverage}</p>
                <div className="mt-3 font-extrabold text-brand-blue text-lg">
                  ₹{enrollingPolicy?.annual_premium?.toLocaleString('en-IN')} / year
                </div>
              </div>
              <p className="text-xs text-slate-500">Confirm the chosen cover and proceed to enter personal details.</p>
            </div>
          )}

          {enrollStep === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nominee Name</label>
                <input
                  type="text"
                  defaultValue="Family Member"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Relationship</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm">
                  <option>Spouse</option>
                  <option>Parent</option>
                  <option>Child</option>
                </select>
              </div>
            </div>
          )}

          {enrollStep === 3 && (
            <div className="space-y-3">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-brand-blue" />
                <span>I declare that all information provided is accurate and I accept policy terms.</span>
              </label>
            </div>
          )}

          {enrollStep === 4 && (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-brand-emerald mx-auto" />
              <h4 className="text-base font-bold text-navy-900 dark:text-white">
                Application Submitted Successfully!
              </h4>
              <p className="text-xs text-slate-500">
                Your demo policy request has been logged. Policy documents generated for sandbox review.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-navy-800">
            {enrollStep > 1 && enrollStep < 4 ? (
              <button
                onClick={() => setEnrollStep(enrollStep - 1)}
                className="px-4 py-2 text-xs font-bold text-slate-500"
              >
                Back
              </button>
            ) : <div />}

            {enrollStep < 3 && (
              <button
                onClick={() => setEnrollStep(enrollStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold"
              >
                Continue
              </button>
            )}

            {enrollStep === 3 && (
              <button
                onClick={() => setEnrollStep(4)}
                className="px-6 py-2.5 rounded-xl bg-brand-emerald text-white text-xs font-bold"
              >
                Submit Application
              </button>
            )}

            {enrollStep === 4 && (
              <button
                onClick={() => setEnrollModal(false)}
                className="px-6 py-2.5 rounded-xl bg-navy-900 dark:bg-white text-white dark:text-navy-900 text-xs font-bold"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

