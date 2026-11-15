import React from 'react'

export default function SpendingChart({ categorySpend = {} }) {
  const colors = {
    Food: '#315EFB', // Brand Blue
    Transport: '#12B8A6', // Teal
    Shopping: '#8B5CF6', // Purple
    Bills: '#F59E0B', // Amber
    Healthcare: '#EC4899', // Pink
    Other: '#64748B', // Slate
  }

  const entries = Object.entries(categorySpend)
  const total = entries.reduce((acc, [, val]) => acc + val, 0) || 1

  return (
    <div className="space-y-4">
      {/* Multi-segment stacked bar */}
      <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
        {entries.map(([category, amount]) => {
          const percentage = (amount / total) * 100
          if (percentage <= 0) return null
          return (
            <div
              key={category}
              style={{
                width: `${percentage}%`,
                backgroundColor: colors[category] || '#3B82F6'
              }}
              title={`${category}: ₹${amount.toLocaleString('en-IN')} (${percentage.toFixed(1)}%)`}
              className="h-full transition-all duration-700 hover:opacity-85 cursor-pointer"
            />
          )
        })}
      </div>

      {/* Legend / Category tags */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
        {entries.map(([category, amount]) => {
          const percentage = Math.round((amount / total) * 100)
          const color = colors[category] || '#3B82F6'
          return (
            <div
              key={category}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#101828] border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {category}
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#101828] dark:text-white shrink-0">
                {percentage}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

