import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  Moon,
  Sun,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
  Bot,
  Landmark,
  FileText
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-[#1E2D4A] bg-white/95 dark:bg-[#101B35]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#365CF5] via-[#2F54EB] to-[#13B8A6] flex items-center justify-center text-white shadow-md shadow-[#365CF5]/25 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#17243A] dark:text-white flex items-center gap-1.5">
              FinJourney <span className="text-[#365CF5] font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#365CF5]/10 dark:bg-[#365CF5]/20">AI</span>
            </span>
            <span className="text-[10px] text-[#718096] dark:text-slate-400 font-semibold tracking-wider uppercase">
              Intelligent Financial Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#718096] dark:text-slate-300">
          <a href="#features" className="hover:text-[#365CF5] dark:hover:text-white transition-colors">Features</a>
          <a href="#journeys" className="hover:text-[#365CF5] dark:hover:text-white transition-colors">Journeys</a>
          <a href="#how-it-works" className="hover:text-[#365CF5] dark:hover:text-white transition-colors">How It Works</a>
          <a href="#capabilities" className="hover:text-[#365CF5] dark:hover:text-white transition-colors">AI Capabilities</a>
          <a href="#security" className="hover:text-[#365CF5] dark:hover:text-white transition-colors">Security</a>
          <a href="#faq" className="hover:text-[#365CF5] dark:hover:text-white transition-colors">FAQ</a>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#17243A] text-[#17243A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-sm font-bold shadow-md shadow-[#365CF5]/25 transition-all hover:scale-[1.02]"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to App</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#17243A] dark:text-slate-200 hover:text-[#365CF5] dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101B35] dark:bg-white text-white dark:text-[#101B35] hover:bg-[#365CF5] dark:hover:bg-slate-100 hover:text-white text-sm font-bold shadow-sm transition-all hover:scale-[1.02]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-[#1E2D4A] text-slate-700 dark:text-slate-200"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-slate-200 dark:border-[#1E2D4A] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-[#1E2D4A] bg-white dark:bg-[#101B35] px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <div className="space-y-1">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-[#17243A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Features
            </a>
            <a
              href="#journeys"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-[#17243A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Journeys
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-[#17243A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              How It Works
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-[#17243A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              AI Capabilities
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-[#17243A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Security
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-[#17243A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              FAQ
            </a>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#365CF5] text-white text-center text-sm font-bold shadow-md"
              >
                Go to Workspace
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-sm font-bold text-[#17243A] dark:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#101B35] dark:bg-white text-white dark:text-[#101B35] text-center text-sm font-bold shadow-md"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
