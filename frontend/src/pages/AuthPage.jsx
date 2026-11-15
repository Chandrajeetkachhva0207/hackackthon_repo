import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, User, KeyRound, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AuthPage({ mode = 'login' }) {
  const { login, register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [isRegister, setIsRegister] = useState(mode === 'register')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password)
        addToast('Account created successfully!', 'success')
      } else {
        await login(form.email, form.password)
        addToast('Welcome back!', 'success')
      }
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to authenticate. Please check your credentials or backend connection.'
      )
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setForm({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    })
    setIsRegister(false)
    addToast('Demo credentials populated', 'info')
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#090E1A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#365CF5]/15 to-[#13B8A6]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Brand logo header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#365CF5] to-[#13B8A6] flex items-center justify-center text-white shadow-md shadow-[#365CF5]/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#101B35] dark:text-white">
            FinJourney <span className="text-[#365CF5]">AI</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
          {isRegister ? 'Start your financial journey' : 'Welcome back to FinJourney'}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#718096] dark:text-slate-400">
          Intelligent financial guidance across insurance, lending, and budgeting.
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#101B35] py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200 dark:border-[#1E2D4A] space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#090E1A] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false)
                setError('')
              }}
              className={`py-2 rounded-xl transition-all ${
                !isRegister
                  ? 'bg-white dark:bg-[#17243A] text-[#101B35] dark:text-white shadow-sm'
                  : 'text-[#718096] hover:text-[#101B35] dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true)
                setError('')
              }}
              className={`py-2 rounded-xl transition-all ${
                isRegister
                  ? 'bg-white dark:bg-[#17243A] text-[#101B35] dark:text-white shadow-sm'
                  : 'text-[#718096] hover:text-[#101B35] dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="p-3.5 rounded-2xl bg-[#365CF5]/10 border border-[#365CF5]/20 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-[#365CF5] block">Quick Testing Mode</span>
              <span className="text-[11px] text-[#718096]">demo@example.com · password123</span>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="px-3 py-1.5 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold shadow-sm transition-all"
            >
              Fill Demo Account
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Chandrajeet Rajput"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-[#F7F9FC] dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="demo@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-[#F7F9FC] dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#718096] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-[#F7F9FC] dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-sm font-bold shadow-md shadow-[#365CF5]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-[#718096]">
            By continuing, you agree to our{' '}
            <span className="text-[#365CF5] font-semibold cursor-pointer">Synthetic Terms</span> and{' '}
            <span className="text-[#365CF5] font-semibold cursor-pointer">Privacy Notice</span>.
          </div>
        </div>
      </div>
    </div>
  )
}
