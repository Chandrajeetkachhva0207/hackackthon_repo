import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Landmark,
  Wallet,
  RotateCcw,
  Copy,
  Check,
  HelpCircle,
  Mic,
  MicOff,
  Paperclip,
  FileText,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AssistantPage() {
  const { user } = useAuth()
  const { addToast } = useToast()

  const [activeModule, setActiveModule] = useState('general')
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}! I am your FinJourney AI Financial Companion. I can analyze your income surplus, evaluate loan eligibility parameters, clarify insurance exclusions, or interpret financial documents. How can I help you today?`,
      time: 'Just now',
      module: 'general',
      card: {
        type: 'recommendation',
        title: 'Instant Financial Checkup',
        description: 'Your estimated debt-to-income ratio is healthy at 28%. We recommend exploring tax-saving health policies.',
        link: '/insurance',
        linkText: 'View Insurance Catalog'
      }
    }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [isListening, setIsListening] = useState(false)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, busy])

  const suggestedPrompts = {
    general: [
      'What are policy waiting periods and pre-existing limits?',
      'How can I lower my loan EMI without increasing tenure?',
      'Explain the 50/30/20 budgeting rule with my salary.',
      'What are the key differences between pure term and ULIP covers?'
    ],
    insurance: [
      'What are policy waiting periods and pre-existing disease limits?',
      'What is the difference between comprehensive and third-party motor insurance?',
      'How do I calculate my family’s optimal life cover?',
      'What documents are needed when filing an insurance claim?'
    ],
    lending: [
      'How can I lower my loan EMI without increasing tenure?',
      'What factors influence my preliminary lending score?',
      'What is the impact of employment type on loan interest rate?',
      'What documents are required for personal loan verification?'
    ],
    fintech: [
      'How can I identify and plug subtle spending leaks?',
      'What qualifies as a suspicious transaction flag?',
      'Explain the 50/30/20 budgeting rule with my salary.',
      'How do I set realistic emergency fund milestones?'
    ]
  }

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input
    if (!query.trim() || busy) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      module: activeModule
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setBusy(true)

    try {
      const res = await api.post('/chat', {
        message: query,
        module: activeModule
      })

      // Attach relevant financial recommendation card if keywords match
      let recCard = null
      const lowerQ = query.toLowerCase()
      if (lowerQ.includes('loan') || lowerQ.includes('emi') || lowerQ.includes('credit')) {
        recCard = {
          type: 'lending',
          title: 'Smart Loan Eligibility Available',
          description: 'Based on synthetic criteria, pre-approved personal loans start at 10.5% APR.',
          link: '/lending',
          linkText: 'Check Live Eligibility Score'
        }
      } else if (lowerQ.includes('insurance') || lowerQ.includes('policy') || lowerQ.includes('term')) {
        recCard = {
          type: 'insurance',
          title: 'Comprehensive Health Cover Match',
          description: 'Compare Top 3 health policies with side-by-side cashless hospitalization terms.',
          link: '/insurance',
          linkText: 'Compare Policies Side-by-Side'
        }
      } else if (lowerQ.includes('budget') || lowerQ.includes('50/30/20') || lowerQ.includes('spend')) {
        recCard = {
          type: 'fintech',
          title: 'Automated Cashflow Allocation',
          description: 'Inspect your categorized monthly expenses and suspicious transaction flags.',
          link: '/fintech',
          linkText: 'Open Budget Ledger'
        }
      }

      const botReply = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        module: activeModule,
        card: recCard
      }

      setMessages((prev) => [...prev, botReply])
    } catch (err) {
      console.error('Chat error', err)
      const errorReply = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: 'I apologize, but I could not reach the financial intelligence backend. Please verify your connection or try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        module: activeModule,
        isError: true
      }
      setMessages((prev) => [...prev, errorReply])
    } finally {
      setBusy(false)
    }
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    addToast('Response copied to clipboard', 'info')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        text: 'Conversation cleared. How else may I guide your financial journey?',
        time: 'Just now',
        module: activeModule
      }
    ])
  }

  // Voice input toggle (SpeechRecognition API with fallback simulation)
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false)
      return
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      setIsListening(true)
      addToast('Listening... Speak your financial query', 'info')

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        handleSend(transcript)
      }

      recognition.onerror = () => {
        setIsListening(false)
        addToast('Voice input unavailable, switching to keyboard', 'warning')
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      // Fallback simulated voice prompt
      setIsListening(true)
      addToast('Simulating voice input...', 'info')
      setTimeout(() => {
        setInput('What is the optimal emergency fund for a monthly salary of ₹65,000?')
        setIsListening(false)
      }, 1500)
    }
  }

  const handleDocumentAttach = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      addToast(`Selected ${file.name}. Transferring to Document Intelligence...`, 'info')
      setInput(`Please analyze the structure and key terms of my attached document: ${file.name}`)
    }
  }

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm overflow-hidden text-[#17243A] dark:text-white">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#090E1A]/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#365CF5] to-[#13B8A6] flex items-center justify-center text-white shadow-md shadow-[#365CF5]/20">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#16A34A] border-2 border-white dark:border-[#101B35]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-[#101B35] dark:text-white">
                FinJourney AI Assistant
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#365CF5]/10 text-[#365CF5] dark:bg-[#365CF5]/20 dark:text-blue-400">
                Context-Aware v3.0
              </span>
            </div>
            <p className="text-xs text-[#718096] dark:text-slate-400 font-medium">
              Real-time financial algorithms & regulatory guidance
            </p>
          </div>
        </div>

        {/* Domain Module Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'general', label: 'All Modules', icon: Sparkles },
            { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
            { id: 'lending', label: 'Lending', icon: Landmark },
            { id: 'fintech', label: 'Budgeting', icon: Wallet },
          ].map((mod) => {
            const Icon = mod.icon
            const active = activeModule === mod.id
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  active
                    ? 'bg-[#365CF5] text-white shadow-sm'
                    : 'bg-white dark:bg-[#17243A] text-[#718096] dark:text-slate-300 border border-slate-200 dark:border-[#1E2D4A] hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mod.label}</span>
              </button>
            )
          })}

          <button
            onClick={handleClear}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-[#1E2D4A] text-[#718096] hover:text-[#101B35] dark:hover:text-white ml-1"
            title="Clear Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((m) => {
          const isBot = m.role === 'assistant'
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  isBot
                    ? 'bg-[#101B35] text-[#13B8A6] dark:bg-white dark:text-[#101B35]'
                    : 'bg-[#365CF5] text-white'
                }`}
              >
                {isBot ? <Bot className="w-5 h-5" /> : <span className="text-xs font-extrabold">YOU</span>}
              </div>

              {/* Message Content Bubble */}
              <div className="space-y-2">
                <div
                  className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isBot
                      ? 'bg-slate-50 dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] text-[#17243A] dark:text-slate-100'
                      : 'bg-[#365CF5] text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Financial Recommendation Card inside chat */}
                  {m.card && (
                    <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] text-left">
                      <div className="flex items-center gap-2 text-[#365CF5] font-bold text-xs mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{m.card.title}</span>
                      </div>
                      <p className="text-xs text-[#718096] dark:text-slate-300 mb-3">
                        {m.card.description}
                      </p>
                      <Link
                        to={m.card.link}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#365CF5] text-white font-bold text-xs hover:bg-[#2449D8] transition-colors"
                      >
                        <span>{m.card.linkText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Bubble Footer */}
                  <div
                    className={`mt-2.5 flex items-center justify-between text-[10px] ${
                      isBot ? 'text-[#718096]' : 'text-blue-100'
                    }`}
                  >
                    <span>{m.time}</span>
                    {isBot && (
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="hover:text-[#365CF5] inline-flex items-center gap-1 transition-colors"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#16A34A]" />
                            <span className="text-[#16A34A] font-bold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Typing Animation State */}
        {busy && (
          <div className="flex gap-3 max-w-2xl mr-auto">
            <div className="w-9 h-9 rounded-xl bg-[#101B35] text-[#13B8A6] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2D4A] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#365CF5] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#13B8A6] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#365CF5] animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-[#718096] font-semibold ml-2">Consulting financial models...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Pills */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#090E1A]/40 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestedPrompts[activeModule]?.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-[#17243A] border border-slate-200 dark:border-[#1E2D4A] text-[#17243A] dark:text-slate-200 hover:border-[#365CF5] hover:text-[#365CF5] whitespace-nowrap transition-colors shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box with Voice & Document Attachment */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#101B35]">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelected}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
        />

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          {/* Document Attachment Button */}
          <button
            type="button"
            onClick={handleDocumentAttach}
            className="p-3 rounded-2xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#090E1A] text-[#718096] hover:text-[#365CF5] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Attach financial document for OCR explanation"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-3 rounded-2xl border transition-colors ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#090E1A] text-[#718096] hover:text-[#365CF5]'
            }`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : `Ask any question about ${activeModule} journeys or financial concepts...`
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#1E2D4A] bg-slate-50 dark:bg-[#090E1A] text-sm text-[#101B35] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#365CF5] placeholder-[#718096]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="p-3 rounded-2xl bg-[#365CF5] hover:bg-[#2449D8] disabled:opacity-40 text-white transition-all shadow-md shadow-[#365CF5]/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
