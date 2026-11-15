import React, { useEffect, useState } from 'react'

export default function AnimatedCounter({
  value,
  duration = 1.2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) {
  const numericTarget = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTimestamp = null
    const startValue = 0

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1)
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (numericTarget - startValue) * easeProgress
      setDisplayValue(current)

      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    const animId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(animId)
  }, [numericTarget, duration])

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString('en-IN')

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
