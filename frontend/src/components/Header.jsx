import React, { useState } from 'react'
import { Menu, Sun, Moon, Bell, Search, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'

export default function Header({ title, subtitle, onOpenMobile }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: 'AI Recommendation Ready', desc: 'Optimize your ₹14,000 monthly food spend.', time: '10m ago', unread: true },
    { id: 2, title: 'Loan Eligibility Insight', desc: 'Pre-qualified for Personal Flex loan up to ₹5,00,000.', time: '1h ago', unread: true },
    { id: 3, title: 'Security Check Passed', desc: 'Your KYC synthetic profile is verified.', time: '1d ago', unread: false },
  ]

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 dark:bg-[#101B35]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1E2D4A] px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Title & subtitle */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
              {title || 'Financial Workspace'}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Live
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-[#718096] dark:text-slate-400 font-semibold mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* AI Engine Status badge */}
        <Link
          to="/assistant"
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#365CF5]/10 dark:bg-[#365CF5]/20 text-[#365CF5] dark:text-blue-400 text-xs font-bold border border-[#365CF5]/25 hover:bg-[#365CF5]/15 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Engine Active</span>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#17243A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications dropdown toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#17243A] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#101B35]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-xl p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-[#101B35] dark:text-white">Notifications</span>
                <span className="text-[11px] font-bold text-[#365CF5] cursor-pointer">Mark all read</span>
              </div>
              <div className="py-2 divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-[#17243A]/50 p-2 rounded-xl transition-colors">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-[#365CF5] shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#101B35] dark:text-white">{n.title}</p>
                      <p className="text-[11px] text-[#718096] dark:text-slate-400 mt-0.5">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User initials pill */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-[#1E2D4A]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#365CF5] to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}
