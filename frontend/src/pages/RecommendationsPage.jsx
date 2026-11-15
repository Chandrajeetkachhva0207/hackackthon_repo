import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ShieldCheck,
  Landmark,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Percent,
  Sliders,
  Award
} from 'lucide-react'
import Badge from '../components/Badge'
import { useToast } from '../context/ToastContext'

export default function RecommendationsPage() {
  const { addToast } = useToast()
  const [filter, setFilter] = useState('all')

  const recommendations = [
    {
      id: 1,
      title: 'Upgrade Term Life Cover to ₹1 Crore',
      category: 'insurance',
      icon: ShieldCheck,
      tone: 'blue',
      impact: '₹50,00,000 Additional Protection',
      cost: '₹4,200/year',
      urgency: 'High Impact',
      why: 'Based on your monthly income of ₹68,000 and age demographic under 35, securing pure term cover now locks in lowest annual premium rates before age slabs increase.',
      actionText: 'View Life Secure Cover',
      actionLink: '/insurance'
    },
    {
      id: 2,
      title: 'Pre-Approved Personal Loan at Preferred 10.5% Rate',
      category: 'lending',
      icon: Landmark,
      tone: 'teal',
      impact: 'Up to ₹5,00,000 Instant Liquidity',
      cost: 'From 10.5% p.a.',
      urgency: 'Medium',
      why: 'Your simulated debt-to-income (DTI) ratio is 28%, placing you in the top 15% prime borrower tier with preferential interest rate pre-qualification.',
      actionText: 'Simulate Loan Application',
      actionLink: '/lending'
    },
    {
      id: 3,
      title: 'Optimize Dining & Food Delivery Expenditure',
      category: 'fintech',
      icon: Wallet,
      tone: 'purple',
      impact: 'Potential ₹4,500/mo Savings',
      cost: '₹0 Expense',
      urgency: 'High Impact',
      why: 'Your Food category spend accounted for 32% of total monthly outflows. Reducing food delivery frequency by 2 orders/week recovers ₹4,500 monthly surplus.',
      actionText: 'Open Budget Ledger',
      actionLink: '/fintech'
    },
    {
      id: 4,
      title: 'Establish a 6-Month Emergency Fund Cushion',
      category: 'fintech',
      icon: Wallet,
      tone: 'emerald',
      impact: 'High Financial Resilience',
      cost: '₹5,000/mo Allocation',
      urgency: 'Critical',
      why: 'Your liquid buffer currently covers 3.5 months of living expenses. Reaching 6 months ensures protection against unexpected macroeconomic headwinds.',
      actionText: 'Allocate to Emergency Goal',
      actionLink: '/profile'
    }
  ]

  const filtered = recommendations.filter((r) => {
    if (filter === 'all') return true
    return r.category === filter
  })

  return (
    <div className="space-y-8 text-[#17243A] dark:text-white">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#365CF5] p-6 sm:p-10 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#13B8A6] text-xs font-bold tracking-wide backdrop-blur-md mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPLAINABLE AI RECOMMENDATION ENGINE (XAI)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Algorithmic Recommendations
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
              Transparent, algorithmic financial suggestions tailored to your cashflow, risk score, and active product portfolio. Every item explains exactly why it was suggested.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'insurance', 'lending', 'fintech'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filter === f
                    ? 'bg-white text-[#101B35] shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((rec) => {
          const Icon = rec.icon
          return (
            <div
              key={rec.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#365CF5]/10 text-[#365CF5] flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant={rec.urgency.includes('High') ? 'rose' : 'teal'} size="xs">
                    {rec.urgency}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-[#101B35] dark:text-white">
                  {rec.title}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#090E1A] text-xs">
                  <div>
                    <span className="text-[#718096] block text-[10px] uppercase font-bold">Financial Impact</span>
                    <span className="font-extrabold text-[#16A34A]">{rec.impact}</span>
                  </div>
                  <div>
                    <span className="text-[#718096] block text-[10px] uppercase font-bold">Estimated Cost</span>
                    <span className="font-extrabold text-[#101B35] dark:text-white">{rec.cost}</span>
                  </div>
                </div>

                {/* Why This Was Recommended */}
                <div className="mt-4 p-4 rounded-2xl bg-[#365CF5]/5 dark:bg-[#365CF5]/10 border border-[#365CF5]/15">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#365CF5] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why This Is Recommended:</span>
                  </div>
                  <p className="text-xs text-[#17243A] dark:text-slate-300 leading-relaxed font-medium">
                    {rec.why}
                  </p>
                </div>
              </div>

              <Link
                to={rec.actionLink}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold transition-all shadow-md shadow-[#365CF5]/25"
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
