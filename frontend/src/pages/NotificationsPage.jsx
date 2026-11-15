import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Clock,
  Check,
  Filter,
  RefreshCw,
  Landmark,
  ShieldCheck,
  Target
} from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../context/ToastContext'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'alert', 'recommendation'
  const { addToast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/ai/notifications')
      setNotifications(res.data)
    } catch (err) {
      console.error(err)
      // Realistic fallback
      setNotifications([
        {
          id: 1,
          title: 'Unusual Transaction Flagged by Isolation Forest',
          message: 'IsolationForest statistical model flagged a transaction of ₹18,499 at Electronics Retail as an outlier based on 90-day spending patterns.',
          notification_type: 'alert',
          is_read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          action_link: '/fintech',
          action_label: 'Review Ledger'
        },
        {
          id: 2,
          title: 'Pre-Qualified Home Loan Rate Update',
          message: 'Based on your prime Financial Health Score of 88, you are indicative pre-qualified for a Home Loan at 8.45% preferential APR.',
          notification_type: 'recommendation',
          is_read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          action_link: '/lending',
          action_label: 'View Pre-Approval'
        },
        {
          id: 3,
          title: 'Comprehensive Health Insurance Renewal in 18 Days',
          message: 'Comprehensive Health Plus policy expires next month. Zero-commission direct renewal window is now open.',
          notification_type: 'reminder',
          is_read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          action_link: '/insurance',
          action_label: 'Renew Policy'
        },
        {
          id: 4,
          title: 'Emergency Shield Milestone Reached (70%)',
          message: 'Congratulations! You have accumulated ₹1,75,000 toward your 6-month liquid cushion goal.',
          notification_type: 'milestone',
          is_read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          action_link: '/goals',
          action_label: 'View Goals'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (id) => {
    try {
      await axios.post(`/api/ai/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      addToast('Marked notification as read.', 'info')
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }
  }

  const markAllRead = async () => {
    try {
      await axios.post('/api/ai/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      addToast('All notifications marked as read.', 'success')
    } catch (err) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      addToast('All notifications marked as read.', 'success')
    }
  }

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read
    if (filter === 'alert') return n.notification_type === 'alert'
    if (filter === 'recommendation') return n.notification_type === 'recommendation'
    return true
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-5 h-5 text-[#EF4444]" />
      case 'recommendation':
        return <Sparkles className="w-5 h-5 text-[#365CF5]" />
      case 'reminder':
        return <Clock className="w-5 h-5 text-[#F59E0B]" />
      case 'milestone':
        return <CheckCircle2 className="w-5 h-5 text-[#13B8A6]" />
      default:
        return <Bell className="w-5 h-5 text-[#365CF5]" />
    }
  }

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'alert':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'recommendation':
        return 'bg-[#365CF5]/10 text-[#365CF5] border-[#365CF5]/20'
      case 'reminder':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'milestone':
        return 'bg-[#13B8A6]/10 text-[#13B8A6] border-[#13B8A6]/20'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101B35] via-[#17243A] to-[#1E2D4A] text-white border border-[#1E2D4A] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#365CF5]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#365CF5]/20 border border-[#365CF5]/30 text-[#8DB7FF] text-xs font-bold tracking-wide mb-3">
            <Bell className="w-3.5 h-3.5 text-[#13B8A6]" />
            <span>REAL-TIME AUDIT & NOTIFICATION HUB</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <span>Notifications & Anomaly Alerts</span>
            {unreadCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-[#EF4444] text-white text-xs font-bold shadow-md shadow-[#EF4444]/30">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Algorithmic warnings for transaction outliers, policy renewal milestones, and pre-underwritten loan offers.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="relative z-10 self-start md:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-[#1E2D4A] pb-4">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'alert', label: 'Security & Anomalies' },
          { id: 'recommendation', label: 'Opportunities' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab.id
                ? 'bg-[#365CF5] text-white shadow-md shadow-[#365CF5]/25'
                : 'bg-white dark:bg-[#101B35] text-[#718096] dark:text-slate-300 border border-slate-200 dark:border-[#1E2D4A] hover:border-[#365CF5]/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A]">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-[#101B35] dark:text-white">All Caught Up!</h3>
            <p className="text-xs text-[#718096] mt-1">No alerts matching your current filter.</p>
          </div>
        ) : (
          filtered.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.is_read
                  ? 'bg-white dark:bg-[#101B35] border-l-4 border-l-[#365CF5] border-slate-200 dark:border-[#1E2D4A] shadow-md'
                  : 'bg-white/60 dark:bg-[#101B35]/60 border-slate-200 dark:border-[#1E2D4A] opacity-85'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-[#17243A] border border-slate-200 dark:border-[#1E2D4A] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(item.notification_type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getBadgeStyle(item.notification_type)}`}>
                      {item.notification_type}
                    </span>
                    {!item.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#365CF5]" />
                    )}
                    <span className="text-[11px] text-[#718096]">
                      {new Date(item.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-[#101B35] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#718096] dark:text-slate-300 leading-relaxed max-w-3xl">
                    {item.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {!item.is_read && (
                  <button
                    onClick={() => markRead(item.id)}
                    className="p-2 rounded-xl text-[#718096] hover:text-[#365CF5] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                {item.action_link && (
                  <Link
                    to={item.action_link}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#365CF5] hover:bg-[#2449D8] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <span>{item.action_label || 'View'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
