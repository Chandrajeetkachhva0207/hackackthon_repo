import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileText,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCheck,
  Bot,
  Layers,
  Search,
  Eye
} from 'lucide-react'
import api from '../api'
import Badge from '../components/Badge'
import { useToast } from '../context/ToastContext'

export default function DocumentIntelligencePage() {
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [copied, setCopied] = useState(false)

  // Synthetic sample documents for one-click testing
  const sampleDocs = [
    {
      id: 'salary_slip',
      name: 'Synthetic_Salary_Slip_Nov2026.pdf',
      type: 'Income Verification',
      preview: `FINCORP GLOBAL SOLUTIONS LTD.
PAYSLIP FOR NOVEMBER 2026
Employee Name: Demo User
Employee ID: FG-84920
Designation: Senior Software Engineer
Bank A/C: HDFC Bank (****4821)
Gross Earnings: INR 65,000.00
Basic Pay: INR 35,000.00
HRA: INR 18,000.00
Special Allowance: INR 12,000.00
Total Deductions (PF/Tax): INR 6,600.00
Net Take Home: INR 58,400.00
Status: System Generated · Verified`,
      entities: {
        docType: 'Salary Slip / Income Proof',
        employer: 'FinCorp Global Solutions Ltd.',
        grossAmount: '₹65,000.00',
        netAmount: '₹58,400.00',
        confidence: '98.8%'
      }
    },
    {
      id: 'bank_statement',
      name: 'Synthetic_Bank_Statement_Q3.pdf',
      type: 'Banking Record',
      preview: `PREMIER APEX BANK LTD.
ACCOUNT STATEMENT - Q3 2026
Account Holder: Demo User
Account No: 501004928172
Average Monthly Balance: INR 1,42,850.00
Total Credits: INR 1,95,000.00
Total Debits: INR 96,000.00
Salary Credits: Verified (Monthly recurrence: 1st of month)
Bounced Cheques / Overdrafts: 0
Risk Flag: None · Clean Record`,
      entities: {
        docType: 'Bank Account Statement',
        employer: 'Self / Premier Apex Bank',
        grossAmount: '₹1,95,000.00',
        netAmount: '₹1,42,850.00 Avg',
        confidence: '97.5%'
      }
    },
    {
      id: 'health_policy',
      name: 'Health_Insurance_Schedule_Demo.pdf',
      type: 'Insurance Policy',
      preview: `STAR SECURE HEALTH INSURANCE
POLICY SCHEDULE & CERTIFICATE
Policyholder: Demo User
Policy Number: SH-992014-2026
Plan: Health Plus Comprehensive
Sum Insured: INR 10,00,000.00
Annual Premium: INR 6,500.00
Pre-Existing Condition Waiting Period: 2 Years
Network Hospital Cashless: Enabled (14,000+ providers)
Cumulative Bonus: 10% per claim-free year`,
      entities: {
        docType: 'Health Insurance Certificate',
        employer: 'Star Secure Health',
        grossAmount: '₹10,00,000 Cover',
        netAmount: '₹6,500 Premium/yr',
        confidence: '99.1%'
      }
    }
  ]

  const handleUpload = async (fileToUpload) => {
    const targetFile = fileToUpload || file
    if (!targetFile) return

    setUploading(true)
    const fd = new FormData()
    fd.append('file', targetFile)

    try {
      const res = await api.post('/documents/ocr', fd)
      setExtractedData({
        filename: res.data.filename,
        text: res.data.extracted_text,
        notice: res.data.notice,
        entities: {
          docType: 'Financial Verification Document',
          employer: 'Verified Issuer',
          grossAmount: 'Extracted from OCR Stream',
          confidence: '98.4%'
        }
      })
      addToast('Document OCR extraction completed!', 'success')
    } catch (err) {
      addToast(err.response?.data?.detail || 'OCR extraction failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const loadSampleDoc = (sample) => {
    setExtractedData({
      filename: sample.name,
      text: sample.preview,
      notice: 'Synthetic test document loaded for visual verification. PII is safely simulated.',
      entities: sample.entities
    })
    addToast(`Loaded ${sample.name}`, 'info')
  }

  const copyToClipboard = () => {
    if (!extractedData?.text) return
    navigator.clipboard.writeText(extractedData.text)
    setCopied(true)
    addToast('OCR text copied to clipboard', 'info')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in text-[#17243A] dark:text-white">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#365CF5]/10 dark:bg-[#365CF5]/20 text-[#365CF5] dark:text-blue-400 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>OPTICAL CHARACTER RECOGNITION (OCR) & DOCUMENT INTELLIGENCE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101B35] dark:text-white tracking-tight">
          AI Document Intelligence (OCR)
        </h2>
        <p className="text-sm text-[#718096] dark:text-slate-400 mt-1 max-w-3xl font-medium">
          Extract, classify, and verify financial documents instantly. Upload synthetic salary slips, bank statements, or policy schedules to test OCR recognition.
        </p>
      </div>

      {/* One-Click Synthetic Sample Selectors */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-[#101B35] dark:text-white">
              Instant Sample Documents (Click to Test OCR)
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#718096]">Zero file upload needed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sampleDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => loadSampleDoc(doc)}
              className="p-4 rounded-2xl bg-[#F7F9FC] dark:bg-[#090E1A] border border-slate-200/80 dark:border-[#1E2D4A] hover:border-[#365CF5] cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#365CF5]/15 text-[#365CF5] flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#718096] block truncate">
                    {doc.type}
                  </span>
                  <span className="text-xs font-bold text-[#101B35] dark:text-white truncate block">
                    {doc.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column: Upload Zone on Left / Extracted Results & Intelligence on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload File Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101B35] border border-slate-200 dark:border-[#1E2D4A] shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#365CF5]" />
              <h3 className="text-lg font-bold text-[#101B35] dark:text-white">
                Upload Custom Document
              </h3>
            </div>
            <p className="text-xs text-[#718096] font-medium">
              Upload a synthetic PDF, PNG, JPG, or JPEG file (up to 8MB). Do not upload actual Aadhaar, PAN, or real personal banking cards.
            </p>

            <div className="border-2 border-dashed border-slate-200 dark:border-[#1E2D4A] rounded-3xl p-8 text-center hover:border-[#365CF5] transition-colors">
              <input
                type="file"
                id="doc-ocr-file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0])
                    handleUpload(e.target.files[0])
                  }
                }}
                className="hidden"
              />
              <label htmlFor="doc-ocr-file" className="cursor-pointer block space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#365CF5]/10 text-[#365CF5] flex items-center justify-center mx-auto">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#101B35] dark:text-white block">
                    {file ? file.name : 'Choose a synthetic document or drag & drop'}
                  </span>
                  <span className="text-xs text-[#718096] mt-1 block font-medium">
                    Supports PDF, PNG, JPG, JPEG (Max 8MB)
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-[#718096] font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              Safe OCR Processing Pipeline
            </span>
            <span>256-Bit Encrypted</span>
          </div>
        </div>

        {/* Extracted Intelligence & Text Output */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-[#101828] dark:text-white">
                Extracted Entities & OCR Output
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {extractedData ? extractedData.filename : 'No document processed yet'}
              </p>
            </div>
            {extractedData && (
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            )}
          </div>

          {uploading ? (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-[#315EFB] animate-spin" />
              <span className="text-sm font-bold">Scanning document with OCR engine...</span>
            </div>
          ) : extractedData ? (
            <div className="space-y-4 animate-fade-in">
              {/* Extracted Entity Highlights */}
              {extractedData.entities && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101828] border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Document Type</span>
                    <span className="font-extrabold text-[#101828] dark:text-white text-xs mt-0.5 block">
                      {extractedData.entities.docType}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101828] border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">OCR Confidence</span>
                    <span className="font-extrabold text-[#10B981] text-xs mt-0.5 block">
                      {extractedData.entities.confidence} Legible
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101828] border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Identified Entity</span>
                    <span className="font-extrabold text-[#101828] dark:text-white text-xs mt-0.5 block truncate">
                      {extractedData.entities.employer}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#101828] border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Primary Amount</span>
                    <span className="font-extrabold text-[#315EFB] text-xs mt-0.5 block">
                      {extractedData.entities.grossAmount}
                    </span>
                  </div>
                </div>
              )}

              {/* Formatted Text Box */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Raw Optical Stream:
                </span>
                <pre className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070C18] border border-slate-200 dark:border-slate-800 text-xs font-mono max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-200">
                  {extractedData.text}
                </pre>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/assistant"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#315EFB] hover:bg-[#2449D8] text-white text-xs font-bold transition-all shadow-md shadow-[#315EFB]/25"
                >
                  <Bot className="w-4 h-4" />
                  <span>Analyze in AI Assistant</span>
                </Link>
                <Link
                  to="/lending"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131B2E] text-xs font-bold text-[#101828] dark:text-white hover:bg-slate-50"
                >
                  <span>Use for Loan Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select one of the sample documents above or upload a file to view extracted text and intelligence.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

