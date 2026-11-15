import React from 'react'

export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300 border-slate-200 dark:border-navy-700',
    blue: 'bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-400 border-brand-blue/20',
    teal: 'bg-brand-teal/10 text-brand-teal dark:bg-brand-teal/20 dark:text-teal-400 border-brand-teal/20',
    emerald: 'bg-brand-emerald/10 text-brand-emerald dark:bg-brand-emerald/20 dark:text-emerald-400 border-brand-emerald/20',
    rose: 'bg-brand-rose/10 text-brand-rose dark:bg-brand-rose/20 dark:text-rose-400 border-brand-rose/20',
    amber: 'bg-brand-amber/10 text-brand-amber dark:bg-brand-amber/20 dark:text-amber-400 border-brand-amber/20',
  }

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size] || sizeStyles.sm}`}
    >
      {children}
    </span>
  )
}

