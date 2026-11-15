from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Literal, Optional, List, Dict, Any
from datetime import datetime

# Authentication Schemas
class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    model_config = ConfigDict(from_attributes=True)

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# User & Financial Profile Schemas
class UserProfileOut(BaseModel):
    id: int
    user_id: int
    phone: Optional[str]
    address: Optional[str]
    pan_masked: Optional[str]
    aadhaar_masked: Optional[str]
    kyc_status: str
    date_of_birth: Optional[str]
    employer: Optional[str]
    model_config = ConfigDict(from_attributes=True)

class UserProfileUpdate(BaseModel):
    phone: Optional[str] = None
    address: Optional[str] = None
    employer: Optional[str] = None
    date_of_birth: Optional[str] = None

class FinancialProfileOut(BaseModel):
    id: int
    user_id: int
    monthly_income: float
    monthly_expenses: float
    savings_balance: float
    existing_debt: float
    credit_score_indicative: int
    health_score: int
    risk_tier: str
    emergency_fund_months: float
    model_config = ConfigDict(from_attributes=True)

class FinancialProfileUpdate(BaseModel):
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    savings_balance: Optional[float] = None
    existing_debt: Optional[float] = None

# Transaction Schemas
class TransactionIn(BaseModel):
    description: str = Field(min_length=2, max_length=255)
    amount: float = Field(gt=0)
    transaction_type: Literal["income", "expense"] = "expense"
    category: Optional[str] = "Other"
    merchant: Optional[str] = ""
    is_recurring: Optional[bool] = False
    transaction_date: Optional[datetime] = None

class TransactionUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    transaction_type: Optional[Literal["income", "expense"]] = None
    category: Optional[str] = None
    merchant: Optional[str] = None

class TransactionOut(BaseModel):
    id: int
    description: str
    amount: float
    transaction_type: str
    category: str
    is_recurring: bool
    merchant: Optional[str]
    suspicious: bool
    anomaly_reason: Optional[str]
    transaction_date: datetime
    model_config = ConfigDict(from_attributes=True)

# Budget & Savings Goal Schemas
class BudgetIn(BaseModel):
    category: str
    monthly_limit: float = Field(gt=0)

class BudgetOut(BaseModel):
    id: int
    category: str
    monthly_limit: float
    spent: float
    month: int
    year: int
    model_config = ConfigDict(from_attributes=True)

class SavingsGoalIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    target_amount: float = Field(gt=0)
    current_amount: Optional[float] = 0.0
    category: Optional[str] = "General"
    deadline: Optional[str] = "2027-12-31"
    monthly_contribution: Optional[float] = 5000.0

class SavingsGoalUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    monthly_contribution: Optional[float] = None
    status: Optional[str] = None

class SavingsGoalOut(BaseModel):
    id: int
    name: str
    target_amount: float
    current_amount: float
    category: str
    deadline: Optional[str]
    monthly_contribution: float
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Insurance Schemas
class InsurancePolicyIn(BaseModel):
    policy_number: str
    name: str
    policy_type: str
    coverage_amount: float
    annual_premium: float
    deductible: Optional[float] = 0.0
    waiting_period_months: Optional[int] = 24
    exclusions: Optional[str] = "Cosmetic procedures, pre-existing waiting clauses"
    start_date: Optional[str] = "2026-01-01"
    expiry_date: Optional[str] = "2027-01-01"

class InsurancePolicyOut(BaseModel):
    id: int
    policy_number: str
    name: str
    policy_type: str
    coverage_amount: float
    annual_premium: float
    deductible: float
    waiting_period_months: int
    exclusions: str
    start_date: Optional[str]
    expiry_date: Optional[str]
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class InsuranceClaimIn(BaseModel):
    policy_id: int
    incident_date: str
    claim_amount: float = Field(gt=0)
    reason: str
    documents_submitted: Optional[str] = "Discharge Summary, Medical Invoices"

class InsuranceClaimOut(BaseModel):
    id: int
    policy_id: int
    claim_number: str
    incident_date: str
    claim_amount: float
    approved_amount: float
    reason: str
    status: str
    documents_submitted: Optional[str]
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Lending Schemas
class LoanIn(BaseModel):
    loan_type: str = "personal"
    requested_amount: float = Field(gt=0, le=100000000)
    monthly_income: float = Field(gt=0, le=100000000)
    employment_type: str = "salaried"
    tenure_months: Optional[int] = 36

class LoanEmiIn(BaseModel):
    amount: float = Field(gt=0)
    rate: float = Field(gt=0)
    tenure_months: int = Field(gt=0, le=360)

class LoanEmiOut(BaseModel):
    monthly_emi: float
    total_interest: float
    total_payment: float
    principal_percentage: float
    interest_percentage: float
    amortization_preview: List[Dict[str, Any]]

class LoanApplicationOut(BaseModel):
    id: int
    loan_type: str
    requested_amount: float
    monthly_income: float
    employment_type: str
    tenure_months: int
    interest_rate: float
    emi: float
    dti_ratio: float
    status: str
    ml_score: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Document Schemas
class DocumentOut(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size: int
    document_type: str
    status: str
    extracted_text: str
    verification_notes: Optional[str]
    created_at: datetime
    entities: Optional[List[Dict[str, Any]]] = None
    model_config = ConfigDict(from_attributes=True)

# AI & Simulation Schemas
class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    module: Literal["general", "insurance", "lending", "fintech"] = "general"

class WhatIfSimulationIn(BaseModel):
    monthly_income: float
    monthly_expenses: float
    loan_amount: Optional[float] = 0.0
    loan_rate: Optional[float] = 10.5
    loan_tenure_months: Optional[int] = 36
    monthly_savings_contribution: Optional[float] = 5000.0
    simulation_months: Optional[int] = 24

class LifeEventSimulationIn(BaseModel):
    event_type: Literal["house", "marriage", "education", "business", "retirement"]
    target_year: int
    budget_estimate: Optional[float] = None
    current_savings_allocated: Optional[float] = None

class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
