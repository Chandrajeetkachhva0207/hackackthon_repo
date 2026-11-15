import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

export default function MetricCard({
  title,
  value,
  change,
  isPositive,
  subtitle,
  icon: Icon,
  tone = 'blue',
  onClick
}) {
  const toneClasses = {
    blue: 'bg-[#365CF5]/10 text-[#365CF5] dark:bg-[#365CF5]/20 dark:text-blue-400',
    teal: 'bg-[#13B8A6]/10 text-[#13B8A6] dark:bg-[#13B8A6]/20 dark:text-teal-400',
    emerald: 'bg-[#16A34A]/10 text-[#16A34A] dark:bg-[#16A34A]/20 dark:text-emerald-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  }

  // Extract number and prefix if value is currency (e.g. "₹68,000")
  const isCurrency = typeof value === 'string' && value.startsWith('₹')
  const isNumeric = isCurrency || typeof value === 'number' || !isNaN(Number(value))
  const cleanNumber = isCurrency ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : Number(value)

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm hover:shadow-xl hover:border-[#365CF5]/40 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#718096] dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <motion.div
            whileHover={{ rotate: 8, scale: 1.1 }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${toneClasses[tone] || toneClasses.blue}`}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101B35] dark:text-white">
          {isNumeric && !isNaN(cleanNumber) ? (
            <AnimatedCounter
              value={cleanNumber}
              prefix={isCurrency ? '₹' : ''}
              decimals={0}
            />
          ) : (
            value
          )}
        </span>
        {change !== undefined && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-[#16A34A]/15 text-[#16A34A]'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </motion.span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[#718096] dark:text-slate-400 font-semibold">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
