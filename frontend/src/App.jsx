import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'

import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import InsuranceJourney from './pages/InsuranceJourney'
import LendingJourney from './pages/LendingJourney'
import FintechJourney from './pages/FintechJourney'
import AssistantPage from './pages/AssistantPage'
import ProfilePage from './pages/ProfilePage'
import RecommendationsPage from './pages/RecommendationsPage'
import AdminPage from './pages/AdminPage'
import DocumentIntelligencePage from './pages/DocumentIntelligencePage'

// Newly created dedicated modules
import FinancialIntelligencePage from './pages/FinancialIntelligencePage'
import SimulatorPage from './pages/SimulatorPage'
import GoalsPage from './pages/GoalsPage'
import NotificationsPage from './pages/NotificationsPage'

import Sidebar from './components/Sidebar'
import Header from './components/Header'

function ProtectedAppShell({ children }) {
  const { user, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#090E1A] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#365CF5] animate-pulse" />
        <span className="text-sm font-bold text-slate-500">Loading FinJourney AI...</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const pageMeta = {
    '/dashboard': { title: 'Financial Dashboard', subtitle: 'Real-time health score, balances & active journeys' },
    '/financial-intelligence': { title: 'AI Financial Intelligence', subtitle: 'Multi-factor actuarial scoring, risk audit & buffer sustainability' },
    '/insurance': { title: 'Insurance Center', subtitle: 'Policy comparison, plain-language AI explain & premium simulator' },
    '/lending': { title: 'Smart Lending', subtitle: 'Loan catalogue, machine learning eligibility & document OCR' },
    '/fintech': { title: 'Fintech & Expenses', subtitle: 'Automated categorization, anomaly alerts & spending breakdown' },
    '/document-intelligence': { title: 'AI Document Intelligence (OCR)', subtitle: 'Automated OCR extraction, classification & verification' },
    '/goals': { title: 'Financial Goals', subtitle: 'Goal-based wealth architect with automated monthly pace analysis' },
    '/simulator': { title: 'What-If Simulator', subtitle: 'Life event planning & reactive cashflow debt simulation' },
    '/recommendations': { title: 'Analytics & Reports', subtitle: 'Transparent algorithmic suggestions with explainability' },
    '/notifications': { title: 'Notifications & Alerts', subtitle: 'IsolationForest outlier flags & rate change notifications' },
    '/profile': { title: 'Profile & Security', subtitle: 'Income verification, debt capacity & document vault' },
    '/assistant': { title: 'AI Financial Assistant', subtitle: 'Conversational companion for all financial questions' },
    '/admin': { title: 'Admin & Underwriting Hub', subtitle: 'Platform metrics, underwriting queue & Power BI feeds' },
  }

  const currentMeta = pageMeta[location.pathname] || {
    title: 'Financial Workspace',
    subtitle: 'AI-Powered Financial Journeys'
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#090E1A] text-[#17243A] dark:text-white flex transition-colors">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <footer className="py-6 px-8 text-center text-xs text-[#718096] dark:text-slate-400 border-t border-slate-200 dark:border-[#1E2D4A]">
          FinJourney AI · Hackathon Enterprise MVP · Synthetic demo data only · Not legal, credit, or tax advice
        </footer>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />

            {/* Protected Workspace Routes (All 11 Views + Assistant & Admin) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedAppShell>
                  <Dashboard />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/financial-intelligence"
              element={
                <ProtectedAppShell>
                  <FinancialIntelligencePage />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/insurance"
              element={
                <ProtectedAppShell>
                  <InsuranceJourney />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/lending"
              element={
                <ProtectedAppShell>
                  <LendingJourney />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/fintech"
              element={
                <ProtectedAppShell>
                  <FintechJourney />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/document-intelligence"
              element={
                <ProtectedAppShell>
                  <DocumentIntelligencePage />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedAppShell>
                  <GoalsPage />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/simulator"
              element={
                <ProtectedAppShell>
                  <SimulatorPage />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedAppShell>
                  <RecommendationsPage />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedAppShell>
                  <NotificationsPage />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedAppShell>
                  <ProfilePage />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/assistant"
              element={
                <ProtectedAppShell>
                  <AssistantPage />
                </ProtectedAppShell>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedAppShell>
                  <AdminPage />
                </ProtectedAppShell>
              }
            />

            {/* Catch-all redirect to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
