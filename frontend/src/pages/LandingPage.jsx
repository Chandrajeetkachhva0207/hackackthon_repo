import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Landmark,
  Wallet,
  Bot,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Zap,
  Star,
  Layers,
  Clock,
  Sliders,
  ChevronDown,
  BarChart3,
  FileText,
  Activity,
  Award
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AnimatedCounter from '../components/AnimatedCounter'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      q: 'How does the AI Financial Assistant deliver personalized insights?',
      a: 'The assistant uses deterministic financial algorithms and contextual LLM inference across your categorized expenses, active policies, and loan inquiries to provide real-time recommendations, tax-efficient tips, and debt-to-income guidance.'
    },
    {
      q: 'Is real personal or banking data required to test the platform?',
      a: 'No. FinJourney AI is an enterprise hackathon MVP built with realistic synthetic data generators. You can test OCR on synthetic payslips and bank statements, run loan eligibility with pre-seeded models, and inspect health scores without uploading real PII.'
    },
    {
      q: 'How does the Smart Loan Eligibility model work?',
      a: 'Our underwriting engine leverages a scikit-learn Random Forest classifier trained on debt-to-income ratios, verified monthly inflow, and employment classifications to generate instant indicative pre-approvals in under 30 seconds.'
    },
    {
      q: 'Can I compare multiple insurance policies side-by-side?',
      a: 'Yes. The Insurance Recommendation Engine allows you to select and compare any two policies side-by-side, analyzing coverage amounts, deductibles, waiting periods, and exclusions with 1-click plain-language AI clause explanations.'
    },
    {
      q: 'How does the Document Intelligence (OCR) pipeline process files?',
      a: 'Uploaded PDF or image documents pass through an optical character recognition engine with automatic entity extraction for employers, net take-home salary, account numbers, and tampering integrity checks.'
    }
  ]

  const journeys = [
    {
      id: 'insurance',
      title: 'Insurance Recommendation Engine',
      category: 'Smart Protection',
      description: 'Discover tailored health, life, and motor coverage with algorithmic comparison and plain-language clause translation.',
      icon: ShieldCheck,
      color: 'from-[#13B8A6] to-[#0D9488]',
      accentBg: 'bg-[#13B8A6]/10 text-[#13B8A6]',
      features: ['Side-by-side coverage matrix', 'Plain-language clause translator', 'Dynamic annual premium slider', 'Zero-commission direct catalog'],
      cta: 'Explore Insurance'
    },
    {
      id: 'lending',
      title: 'Smart Loan Eligibility & EMI',
      category: 'Intelligent Credit',
      description: 'Get instant pre-qualification scored by a Random Forest machine learning classifier with interactive tenure and interest calculators.',
      icon: Landmark,
      color: 'from-[#365CF5] to-[#2546D4]',
      accentBg: 'bg-[#365CF5]/10 text-[#365CF5]',
      features: ['Under 30s ML eligibility scoring', 'Live EMI & interest amortization', 'Automated payslip OCR parsing', 'Transparent APR & charges breakdown'],
      cta: 'Calculate Loans'
    },
    {
      id: 'fintech',
      title: 'Fintech & Automated Budgeting',
      category: 'Cashflow Optimization',
      description: 'Harness automated ledger categorization, real-time spending anomaly detection, and actionable 50/30/20 budget strategies.',
      icon: Wallet,
      color: 'from-[#8B5CF6] to-[#6D28D9]',
      accentBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      features: ['Rule-based transaction categorization', 'Suspicious fraud anomaly alerts', 'Cashflow surplus/deficit tracking', 'Instant synthetic ledger seeding'],
      cta: 'View Budgeting'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#090E1A] text-[#17243A] dark:text-white transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-[#365CF5]/15 via-[#13B8A6]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#365CF5]/10 dark:bg-[#365CF5]/20 border border-[#365CF5]/20 text-[#365CF5] dark:text-blue-400 text-xs font-bold tracking-wide mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#365CF5]" />
            <span>ENTERPRISE FINTECH 3.0 · NEXT-GEN FINANCIAL INTELLIGENCE</span>
          </motion.div>

          {/* Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] max-w-5xl mx-auto text-[#101B35] dark:text-white"
          >
            Your Financial Journey,{' '}
            <span className="text-gradient-teal">Powered by AI.</span>
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[#718096] dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            One intelligent platform to simplify insurance, lending, and financial decisions with personalized AI-powered experiences.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-base font-extrabold shadow-lg shadow-[#365CF5]/30 transition-all duration-200 hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#journeys"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-[#101B35] border border-slate-300 dark:border-[#1E2D4A] hover:bg-slate-50 dark:hover:bg-[#17243A] text-[#17243A] dark:text-white text-base font-bold shadow-sm transition-all"
            >
              <span>Explore Platform</span>
              <ChevronRight className="w-4 h-4 text-[#718096]" />
            </a>
          </motion.div>

          {/* Trust Metrics Pill Strip */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-[#718096] dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Zero Real PII Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Instant AI Assistance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Bank-Grade 256-Bit TLS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>Random Forest ML Scoring</span>
            </div>
          </div>

          {/* Interactive Financial Dashboard Preview Container with Floating Insight Cards */}
          <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-[#1E2D4A] shadow-2xl">
            {/* Floating Card 1: Health Score */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -left-8 top-16 z-20 items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-xl text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#13B8A6]/15 text-[#13B8A6] flex items-center justify-center font-extrabold text-sm">
                88
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Financial Health</p>
                <p className="text-xs font-extrabold text-[#17243A] dark:text-white">Tier 1 · Prime Standing</p>
              </div>
            </motion.div>

            {/* Floating Card 2: Loan Pre-Approval */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
              className="hidden lg:flex absolute -right-8 top-28 z-20 items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-xl text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#365CF5]/15 text-[#365CF5] flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Pre-Approved Credit</p>
                <p className="text-xs font-extrabold text-[#17243A] dark:text-white">Up to ₹5,00,000 @ 10.5%</p>
              </div>
            </motion.div>

            {/* Mock Dashboard Window */}
            <div className="rounded-2xl bg-white dark:bg-[#101B35] overflow-hidden border border-slate-200 dark:border-[#1E2D4A] p-6 sm:p-8 text-left shadow-inner">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-mono text-[#718096]">app.finjourney.ai/workspace</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/15 text-[#16A34A] text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  Live Sync
                </div>
              </div>

              {/* Window Content Mockup */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Calculated Surplus</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-[#101B35] dark:text-white">₹33,000</span>
                    <span className="text-xs font-bold text-[#16A34A]">+12.4%</span>
                  </div>
                  <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#365CF5] h-full w-[65%]" />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Underwriting Status</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-[#101B35] dark:text-white">Instant</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#13B8A6]/15 text-[#13B8A6] text-xs font-bold">ML Scored</span>
                  </div>
                  <p className="mt-2 text-xs text-[#718096]">Personal Loan #4928 eligible</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#718096]">Insurance Portfolio</span>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-[#101B35] dark:text-white">Active</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#365CF5]/15 text-[#365CF5] text-xs font-bold">100% Covered</span>
                  </div>
                  <p className="mt-2 text-xs text-[#718096]">Health Plus Comprehensive</p>
                </div>
              </div>

              {/* Bottom Assistant Teaser Bar */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#365CF5]/10 via-[#13B8A6]/10 to-transparent border border-[#365CF5]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#365CF5] text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-medium text-[#17243A] dark:text-slate-200">
                    <span className="font-bold text-[#365CF5]">AI Companion:</span> "Based on your November surplus, allocating ₹5,000 to your emergency fund reduces financial risk by 18%."
                  </p>
                </div>
                <Link
                  to="/assistant"
                  className="hidden sm:inline-flex text-xs font-bold text-[#365CF5] hover:underline items-center gap-1 shrink-0"
                >
                  <span>Chat Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flagship Journeys Section */}
      <section id="journeys" className="py-20 lg:py-28 border-t border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#101B35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-wider uppercase text-[#365CF5]">Core Financial Suite</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
              Three Unified Customer Journeys.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#718096] dark:text-slate-300">
              Break down the friction between protecting your life, financing your ambitions, and mastering your day-to-day cashflow.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {journeys.map((j) => {
              const Icon = j.icon
              return (
                <motion.div
                  key={j.id}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="rounded-3xl p-8 bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] hover:border-[#365CF5]/50 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${j.color} text-white flex items-center justify-center shadow-md`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${j.accentBg}`}>
                        {j.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#101B35] dark:text-white group-hover:text-[#365CF5] transition-colors">
                      {j.title}
                    </h3>

                    <p className="mt-3 text-sm text-[#718096] dark:text-slate-300 leading-relaxed">
                      {j.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[#1E2D4A] space-y-2.5">
                      {j.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-[#17243A] dark:text-slate-200 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/${j.id}`}
                    className="mt-8 w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-[#17243A] border border-slate-200 dark:border-[#1E2D4A] text-xs font-bold text-[#17243A] dark:text-white hover:bg-[#365CF5] hover:text-white dark:hover:bg-[#365CF5] transition-all shadow-sm group-hover:shadow"
                  >
                    <span>{j.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Capabilities Showcase */}
      <section id="capabilities" className="py-20 lg:py-28 bg-[#F7F9FC] dark:bg-[#090E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-wider uppercase text-[#13B8A6]">Intelligence Layer</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
              Enterprise AI That Explains Itself.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#718096] dark:text-slate-300">
              No black-box decisions. Every recommendation, credit score, and OCR extraction is completely transparent and actionable.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#365CF5]/10 text-[#365CF5] flex items-center justify-center mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#101B35] dark:text-white">Optical Intelligence</h4>
              <p className="mt-2 text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
                Tesseract-powered parsing with synthetic OCR fallbacks for payslips, tax certificates, and account statements.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#13B8A6]/10 text-[#13B8A6] flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#101B35] dark:text-white">Random Forest Model</h4>
              <p className="mt-2 text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
                Multi-factor risk classification evaluated across verified income, debt-to-income limits, and repayment capacity.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#101B35] dark:text-white">Domain AI Assistant</h4>
              <p className="mt-2 text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
                Context-aware conversational companion providing instant plain-language guidance across all four financial modules.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#101B35] dark:text-white">Anomaly Detection</h4>
              <p className="mt-2 text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
                Automated heuristic outlier tracking alerting you to uncharacteristic debits, duplicate charges, or suspicious transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual 4-Step Journey */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white dark:bg-[#101B35] border-t border-slate-200 dark:border-[#1E2D4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-wider uppercase text-[#365CF5]">Workflow</span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
              From Inquiry to Approval in Minutes.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#718096] dark:text-slate-300">
              Four streamlined steps designed to eliminate paperwork, long queues, and confusing financial jargon.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="p-6 rounded-3xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] relative">
              <span className="w-8 h-8 rounded-full bg-[#365CF5] text-white font-extrabold text-xs flex items-center justify-center mb-4 shadow-sm">
                01
              </span>
              <h4 className="font-bold text-base text-[#101B35] dark:text-white">Connect Profile</h4>
              <p className="mt-2 text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
                Sign in with demo credentials to access pre-computed balances, active loans, and policy holdings.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] relative">
              <span className="w-8 h-8 rounded-full bg-[#13B8A6] text-white font-extrabold text-xs flex items-center justify-center mb-4 shadow-sm">
                02
              </span>
              <h4 className="font-bold text-base text-[#101B35] dark:text-white">Upload & Extract</h4>
              <p className="mt-2 text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
                Feed payslips or banking PDFs through our OCR pipeline for instant automated verification.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] relative">
              <span className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center mb-4 shadow-sm">
                03
              </span>
              <h4 className="font-bold text-base text-[#101B35] dark:text-white">Evaluate & Compare</h4>
              <p className="mt-2 text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
                Run live ML eligibility scoring or compare insurance products with side-by-side matrices.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] relative">
              <span className="w-8 h-8 rounded-full bg-[#16A34A] text-white font-extrabold text-xs flex items-center justify-center mb-4 shadow-sm">
                04
              </span>
              <h4 className="font-bold text-base text-[#101B35] dark:text-white">Optimize & Grow</h4>
              <p className="mt-2 text-xs text-[#718096] dark:text-slate-300 leading-relaxed">
                Track your financial health score, receive automated budget tips, and submit for underwriting review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Statistics & Trust Indicators */}
      <section id="security" className="py-20 bg-[#F7F9FC] dark:bg-[#090E1A] border-t border-slate-200 dark:border-[#1E2D4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#233352] text-white shadow-xl">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-wider uppercase text-[#13B8A6]">Benchmarked Metrics</span>
              <h3 className="mt-2 text-2xl sm:text-4xl font-extrabold">Engineered for Fintech Excellence</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300">
                Metrics calculated on synthetic demonstration data models and benchmark datasets.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  <AnimatedCounter value={14.2} prefix="₹" suffix="Cr+" decimals={1} />
                </span>
                <p className="mt-1 text-xs text-slate-300 font-semibold">Modeled Loan Volume</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-[#13B8A6]">
                  <AnimatedCounter value={98.4} suffix="%" decimals={1} />
                </span>
                <p className="mt-1 text-xs text-slate-300 font-semibold">OCR Field Extraction</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-[#365CF5]">
                  &lt; <AnimatedCounter value={30} suffix="s" />
                </span>
                <p className="mt-1 text-xs text-slate-300 font-semibold">ML Underwriting Pre-score</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-[#16A34A]">
                  0
                </span>
                <p className="mt-1 text-xs text-slate-300 font-semibold">Real PII Stored</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials (Sample personas) */}
      <section className="py-20 lg:py-28 bg-white dark:bg-[#101B35] border-t border-slate-200 dark:border-[#1E2D4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-wider uppercase text-[#365CF5]">User Perspectives</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#101B35] dark:text-white">
              Loved by Forward-Thinking Users.
            </h2>
            <p className="mt-2 text-xs text-[#718096]">Sample user feedback representing core user personas.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-[#17243A] dark:text-slate-200 italic leading-relaxed">
                  "The side-by-side insurance comparison and plain-language explanation made selecting health cover transparent for the first time."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#1E2D4A] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#365CF5] text-white font-bold flex items-center justify-center text-xs">
                  AK
                </div>
                <div>
                  <p className="text-xs font-bold text-[#101B35] dark:text-white">Arjun Kapoor</p>
                  <p className="text-[11px] text-[#718096]">Product Manager · Bangalore</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-[#17243A] dark:text-slate-200 italic leading-relaxed">
                  "Uploading my payslip and getting an instantaneous ML eligibility score with EMI breakdowns saved me days of back-and-forth."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#1E2D4A] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#13B8A6] text-white font-bold flex items-center justify-center text-xs">
                  PS
                </div>
                <div>
                  <p className="text-xs font-bold text-[#101B35] dark:text-white">Priya Sharma</p>
                  <p className="text-[11px] text-[#718096]">Fintech Entrepreneur · Mumbai</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-[#17243A] dark:text-slate-200 italic leading-relaxed">
                  "Having an AI assistant that can answer loan, policy, and budget queries from a unified workspace feels like having a private banker."
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#1E2D4A] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                  RN
                </div>
                <div>
                  <p className="text-xs font-bold text-[#101B35] dark:text-white">Rohan Nair</p>
                  <p className="text-[11px] text-[#718096]">Senior Architect · Hyderabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section id="faq" className="py-20 lg:py-28 bg-[#F7F9FC] dark:bg-[#090E1A] border-t border-slate-200 dark:border-[#1E2D4A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-wider uppercase text-[#365CF5]">Got Questions?</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#101B35] dark:text-white">
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-[#101B35] dark:text-white hover:text-[#365CF5] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#718096] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#365CF5]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#718096] dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-tr from-[#101B35] via-[#17243A] to-[#365CF5] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto">
            Experience intelligent underwriting, plain-language policy explanations, and automated budgeting today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#101B35] hover:bg-slate-100 text-sm font-extrabold shadow-xl hover:scale-105 transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 text-[#365CF5]" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition-all backdrop-blur-md"
            >
              <span>Sign In with Demo User</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#090E1A] text-xs text-[#718096]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#365CF5] to-[#13B8A6] flex items-center justify-center text-white font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base text-[#101B35] dark:text-white">
                  FinJourney <span className="text-[#365CF5]">AI</span>
                </span>
              </div>
              <p className="text-xs text-[#718096] dark:text-slate-400 max-w-sm leading-relaxed">
                Empowering customers with AI-driven insurance clarity, instant loan pre-qualification, and disciplined budgeting intelligence.
              </p>
            </div>

            <div>
              <p className="font-bold text-[#101B35] dark:text-white uppercase tracking-wider text-[11px] mb-3">Journeys</p>
              <ul className="space-y-2">
                <li><Link to="/insurance" className="hover:text-[#365CF5]">Insurance Engine</Link></li>
                <li><Link to="/lending" className="hover:text-[#365CF5]">Smart Loan Eligibility</Link></li>
                <li><Link to="/fintech" className="hover:text-[#365CF5]">Fintech Budgeting</Link></li>
                <li><Link to="/document-intelligence" className="hover:text-[#365CF5]">Document OCR</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-[#101B35] dark:text-white uppercase tracking-wider text-[11px] mb-3">Workspace</p>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-[#365CF5]">Health Dashboard</Link></li>
                <li><Link to="/assistant" className="hover:text-[#365CF5]">AI Assistant</Link></li>
                <li><Link to="/profile" className="hover:text-[#365CF5]">Financial Profile</Link></li>
                <li><Link to="/admin" className="hover:text-[#365CF5]">Underwriting Hub</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-[#101B35] dark:text-white uppercase tracking-wider text-[11px] mb-3">Compliance</p>
              <ul className="space-y-2">
                <li><span className="hover:text-[#365CF5] cursor-pointer">Synthetic Privacy</span></li>
                <li><span className="hover:text-[#365CF5] cursor-pointer">Security Practices</span></li>
                <li><span className="hover:text-[#365CF5] cursor-pointer">Model Disclaimers</span></li>
                <li><span className="hover:text-[#365CF5] cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-[11px]">
              © 2026 FinJourney AI. Hackathon Prototype MVP. For demonstration and educational purposes only. Not financial, tax, or legal advice.
            </p>
            <p className="text-[11px] font-semibold text-[#101B35] dark:text-slate-300">
              Designed with Stripe, Revolut & Linear SaaS Aesthetics
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
