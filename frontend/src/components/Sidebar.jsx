import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Activity,
  ShieldCheck,
  Landmark,
  Wallet,
  FileText,
  Target,
  Sliders,
  Sparkles,
  Bell,
  UserCheck,
  BarChart3,
  LogOut,
  X,
  Bot
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/dashboard', label: 'Financial Dashboard', icon: LayoutDashboard },
    { to: '/financial-intelligence', label: 'AI Financial Intelligence', icon: Activity, badge: 'Scoring' },
    { to: '/insurance', label: 'Insurance Center', icon: ShieldCheck, badge: 'AI Match' },
    { to: '/lending', label: 'Smart Lending', icon: Landmark, badge: 'ML Model' },
    { to: '/fintech', label: 'Fintech & Expenses', icon: Wallet },
    { to: '/document-intelligence', label: 'Document Center', icon: FileText, badge: 'OCR' },
    { to: '/goals', label: 'Financial Goals', icon: Target },
    { to: '/simulator', label: 'What-If Simulator', icon: Sliders, badge: 'Live' },
    { to: '/recommendations', label: 'Analytics & Reports', icon: Sparkles },
    { to: '/notifications', label: 'Notifications & Alerts', icon: Bell },
    { to: '/profile', label: 'Profile & Security', icon: UserCheck },
  ]

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#101B35] text-slate-300 border-r border-[#1E2D4A] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Branding */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#1E2D4A]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#365CF5] to-[#13B8A6] flex items-center justify-center text-white shadow-md shadow-[#365CF5]/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                FinJourney <span className="text-[#365CF5] font-bold text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#365CF5]/20">AI</span>
              </span>
              <span className="text-[10px] text-[#718096] font-semibold tracking-wide uppercase">ENTERPRISE FINTECH</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#718096]">
            Core Financial Suite
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                    isActive
                      ? 'bg-[#365CF5] text-white shadow-md shadow-[#365CF5]/25'
                      : 'text-slate-300 hover:bg-[#17243A] hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-white/10 text-slate-200">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}

          {/* Quick AI Assistant Link */}
          <div className="pt-3 pb-1">
            <NavLink
              to="/assistant"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#365CF5] to-[#13B8A6] text-white shadow-md'
                    : 'bg-[#17243A]/60 text-slate-200 hover:bg-[#17243A] border border-[#1E2D4A]'
                }`
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <Bot className="w-4 h-4 text-[#13B8A6] shrink-0" />
                <span className="truncate">AI Assistant</span>
              </div>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-[#13B8A6]/20 text-[#13B8A6]">
                24/7
              </span>
            </NavLink>
          </div>

          {/* Admin / Underwriting Hub */}
          <div className="pt-2">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#718096]">
              Management
            </div>
            <NavLink
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'bg-[#365CF5] text-white shadow-md'
                    : 'text-slate-400 hover:bg-[#17243A] hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3 min-w-0">
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span className="truncate">Admin & Underwriting</span>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Footer User Info & Signout */}
        <div className="p-4 border-t border-[#1E2D4A] bg-[#0E172E]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#365CF5] to-[#13B8A6] flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Verified User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'user@finjourney.ai'}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
