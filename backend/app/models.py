from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="customer") # customer, admin
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    financial_profile = relationship("FinancialProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    savings_goals = relationship("SavingsGoal", back_populates="user", cascade="all, delete-orphan")
    insurance_policies = relationship("InsurancePolicy", back_populates="user", cascade="all, delete-orphan")
    insurance_claims = relationship("InsuranceClaim", back_populates="user", cascade="all, delete-orphan")
    loan_applications = relationship("LoanApplication", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), default="")
    address: Mapped[Optional[str]] = mapped_column(String(255), default="")
    pan_masked: Mapped[Optional[str]] = mapped_column(String(20), default="ABCDE****F")
    aadhaar_masked: Mapped[Optional[str]] = mapped_column(String(20), default="**** **** 4821")
    kyc_status: Mapped[str] = mapped_column(String(30), default="verified") # unverified, review_required, verified
    date_of_birth: Mapped[Optional[str]] = mapped_column(String(20), default="1995-06-15")
    employer: Mapped[Optional[str]] = mapped_column(String(120), default="FinCorp Global Solutions")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class FinancialProfile(Base):
    __tablename__ = "financial_profiles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    monthly_income: Mapped[float] = mapped_column(Float, default=68000.0)
    monthly_expenses: Mapped[float] = mapped_column(Float, default=35000.0)
    savings_balance: Mapped[float] = mapped_column(Float, default=142000.0)
    existing_debt: Mapped[float] = mapped_column(Float, default=25000.0)
    credit_score_indicative: Mapped[int] = mapped_column(Integer, default=765)
    health_score: Mapped[int] = mapped_column(Integer, default=88)
    risk_tier: Mapped[str] = mapped_column(String(30), default="Prime (Tier 1)")
    emergency_fund_months: Mapped[float] = mapped_column(Float, default=4.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="financial_profile")

class Transaction(Base):
    __tablename__ = "transactions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    description: Mapped[str] = mapped_column(String(255))
    amount: Mapped[float] = mapped_column(Float)
    transaction_type: Mapped[str] = mapped_column(String(20), default="expense") # income, expense
    category: Mapped[str] = mapped_column(String(60), default="Other")
    is_recurring: Mapped[bool] = mapped_column(Boolean, default=False)
    merchant: Mapped[Optional[str]] = mapped_column(String(120), default="")
    suspicious: Mapped[bool] = mapped_column(Boolean, default=False)
    anomaly_reason: Mapped[Optional[str]] = mapped_column(String(255), default="")
    transaction_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")

class Budget(Base):
    __tablename__ = "budgets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    category: Mapped[str] = mapped_column(String(60))
    monthly_limit: Mapped[float] = mapped_column(Float)
    spent: Mapped[float] = mapped_column(Float, default=0.0)
    month: Mapped[int] = mapped_column(Integer, default=11)
    year: Mapped[int] = mapped_column(Integer, default=2026)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="budgets")

class SavingsGoal(Base):
    __tablename__ = "savings_goals"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(120))
    target_amount: Mapped[float] = mapped_column(Float)
    current_amount: Mapped[float] = mapped_column(Float, default=0.0)
    category: Mapped[str] = mapped_column(String(50), default="General")
    deadline: Mapped[Optional[str]] = mapped_column(String(30), default="2027-12-31")
    monthly_contribution: Mapped[float] = mapped_column(Float, default=5000.0)
    status: Mapped[str] = mapped_column(String(30), default="in_progress") # in_progress, achieved
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="savings_goals")

    @property
    def title(self):
        return self.name

    @title.setter
    def title(self, val):
        self.name = val

    @property
    def target_date(self):
        return self.deadline

    @target_date.setter
    def target_date(self, val):
        self.deadline = val

class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    policy_number: Mapped[str] = mapped_column(String(60), unique=True)
    name: Mapped[str] = mapped_column(String(120))
    policy_type: Mapped[str] = mapped_column(String(50)) # health, life, motor, travel
    coverage_amount: Mapped[float] = mapped_column(Float)
    annual_premium: Mapped[float] = mapped_column(Float)
    deductible: Mapped[float] = mapped_column(Float, default=0.0)
    waiting_period_months: Mapped[int] = mapped_column(Integer, default=24)
    exclusions: Mapped[str] = mapped_column(Text, default="Cosmetic surgeries, self-inflicted injuries, pre-existing conditions during waiting period")
    start_date: Mapped[Optional[str]] = mapped_column(String(30), default="2026-01-01")
    expiry_date: Mapped[Optional[str]] = mapped_column(String(30), default="2027-01-01")
    status: Mapped[str] = mapped_column(String(30), default="active") # active, expired, pending_renewal
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="insurance_policies")
    claims = relationship("InsuranceClaim", back_populates="policy", cascade="all, delete-orphan")

class InsuranceClaim(Base):
    __tablename__ = "insurance_claims"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    policy_id: Mapped[int] = mapped_column(ForeignKey("insurance_policies.id"))
    claim_number: Mapped[str] = mapped_column(String(60), unique=True)
    incident_date: Mapped[str] = mapped_column(String(30))
    claim_amount: Mapped[float] = mapped_column(Float)
    approved_amount: Mapped[float] = mapped_column(Float, default=0.0)
    reason: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(40), default="submitted") # submitted, under_review, approved, rejected
    documents_submitted: Mapped[Optional[str]] = mapped_column(String(255), default="Hospital Discharge Summary, Final Bill")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="insurance_claims")
    policy = relationship("InsurancePolicy", back_populates="claims")

class LoanApplication(Base):
    __tablename__ = "loan_applications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    loan_type: Mapped[str] = mapped_column(String(50)) # personal, bike, education, home
    requested_amount: Mapped[float] = mapped_column(Float)
    monthly_income: Mapped[float] = mapped_column(Float)
    employment_type: Mapped[str] = mapped_column(String(50))
    tenure_months: Mapped[int] = mapped_column(Integer, default=36)
    interest_rate: Mapped[float] = mapped_column(Float, default=10.5)
    emi: Mapped[float] = mapped_column(Float, default=0.0)
    dti_ratio: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(40), default="submitted_for_review") # submitted_for_review, under_review, approved, rejected
    ml_score: Mapped[float] = mapped_column(Float, default=0.0)
    rejection_reason: Mapped[Optional[str]] = mapped_column(String(255), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="loan_applications")

class LoanProduct(Base):
    __tablename__ = "loan_products"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    loan_type: Mapped[str] = mapped_column(String(50))
    min_amount: Mapped[float] = mapped_column(Float)
    max_amount: Mapped[float] = mapped_column(Float)
    rate_from: Mapped[float] = mapped_column(Float)
    min_tenure: Mapped[int] = mapped_column(Integer)
    max_tenure: Mapped[int] = mapped_column(Integer)
    processing_fee_pct: Mapped[float] = mapped_column(Float, default=1.0)
    features: Mapped[str] = mapped_column(String(255), default="Zero prepayment charges, instant pre-approval")

class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    filename: Mapped[str] = mapped_column(String(255))
    file_type: Mapped[str] = mapped_column(String(50)) # pdf, png, jpg
    file_size: Mapped[int] = mapped_column(Integer, default=0) # bytes
    document_type: Mapped[str] = mapped_column(String(60), default="salary_slip") # salary_slip, bank_statement, pan_card, aadhaar_card, policy, loan_doc
    status: Mapped[str] = mapped_column(String(40), default="verified") # uploaded, processing, review_required, verified, rejected
    extracted_text: Mapped[str] = mapped_column(Text, default="")
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, default="{}")
    verification_notes: Mapped[Optional[str]] = mapped_column(String(255), default="OCR confidence > 98%, no digital tampering detected.")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")
    entities = relationship("ExtractedDocumentData", back_populates="document", cascade="all, delete-orphan")

class ExtractedDocumentData(Base):
    __tablename__ = "extracted_document_data"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("documents.id"))
    key: Mapped[str] = mapped_column(String(80))
    value: Mapped[str] = mapped_column(String(255))
    confidence: Mapped[float] = mapped_column(Float, default=0.98)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="entities")

# Backward compatibility alias
UploadedDocument = Document

class FinancialPrediction(Base):
    __tablename__ = "financial_predictions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    prediction_type: Mapped[str] = mapped_column(String(60)) # monthly_expense, savings_forecast, cashflow_shortfall
    forecast_month: Mapped[str] = mapped_column(String(20))
    predicted_value: Mapped[float] = mapped_column(Float)
    lower_bound: Mapped[float] = mapped_column(Float)
    upper_bound: Mapped[float] = mapped_column(Float)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.95)
    model_used: Mapped[str] = mapped_column(String(80), default="Scikit-learn LinearRegression + ARIMA")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    category: Mapped[str] = mapped_column(String(40)) # insurance, lending, savings, budgeting
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str] = mapped_column(Text)
    reason: Mapped[str] = mapped_column(Text)
    impact: Mapped[str] = mapped_column(String(100))
    urgency: Mapped[str] = mapped_column(String(30), default="Medium")
    action_url: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(30), default="active") # active, dismissed, completed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    title: Mapped[str] = mapped_column(String(150))
    message: Mapped[str] = mapped_column(String(255))
    notification_type: Mapped[str] = mapped_column(String(40), default="info") # fraud_alert, bill_reminder, recommendation, underwriting
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    action: Mapped[str] = mapped_column(String(80)) # document_upload, loan_applied, claim_submitted, profile_updated
    resource_type: Mapped[str] = mapped_column(String(60))
    resource_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    details: Mapped[Optional[str]] = mapped_column(String(255), default="")
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), default="127.0.0.1")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
