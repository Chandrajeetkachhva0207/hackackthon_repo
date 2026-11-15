import React from 'react'
import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'

export default function RadialGauge({
  score = 88,
  maxScore = 100,
  size = 180,
  strokeWidth = 16,
  label = 'Health Score'
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / maxScore) * circumference

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-[#1E2D4A]"
          fill="transparent"
        />

        {/* Animated Progress track with gradient */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gauge-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="transparent"
        />

        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#365CF5" />
            <stop offset="100%" stopColor="#13B8A6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center text content with animated counter */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-3xl font-extrabold tracking-tight text-[#101B35] dark:text-white">
          <AnimatedCounter value={score} duration={1.2} />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096]">
          out of {maxScore}
        </span>
      </div>
    </div>
  )
}
