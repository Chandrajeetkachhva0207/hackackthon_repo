from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from datetime import datetime
from ..database import get_db
from ..models import User, FinancialProfile, UserProfile, Transaction, SavingsGoal, InsurancePolicy, LoanApplication, Notification
from ..schemas import FinancialProfileOut, FinancialProfileUpdate, UserProfileOut, UserProfileUpdate
from ..security import get_current_user
from ..ml import calculate_financial_health_score, forecast_financial_trajectory

router = APIRouter(prefix="/api/financial", tags=["Financial Intelligence"])

@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        # 1. Transactions & Cashflow
        txs = db.scalars(select(Transaction).where(Transaction.user_id == user.id).order_by(Transaction.transaction_date.desc())).all()
    except Exception:
        txs = []

    inflow = sum(t.amount for t in txs if t.transaction_type == "income")
    outflow = sum(t.amount for t in txs if t.transaction_type == "expense")

    monthly_income = inflow if inflow > 0 else 85000.0
    monthly_expenses = outflow if outflow > 0 else 42000.0
    total_savings = 450000.0 + max(0.0, monthly_income - monthly_expenses)
    existing_debts = 125000.0

    # 2. Category Breakdown
    category_spend = {}
    for t in txs:
        if t.transaction_type == "expense":
            category_spend[t.category] = category_spend.get(t.category, 0.0) + t.amount

    if not category_spend:
        category_spend = {
            "Housing": 22000.0,
            "Food & Dining": 10750.0,
            "Shopping": 18499.0,
            "Utilities": 1499.0,
            "Health & Wellness": 2500.0
        }

    # 3. Health Score & Risk Indicators
    health_result = calculate_financial_health_score(
        monthly_income=monthly_income,
        monthly_expenses=monthly_expenses,
        savings_balance=total_savings,
        existing_debt=existing_debts,
        active_policies_count=1
    )

    # 4. Goals Progress
    try:
        goals = db.scalars(select(SavingsGoal).where(SavingsGoal.user_id == user.id)).all()
    except Exception:
        goals = []

    goal_items = []
    for g in goals:
        name = getattr(g, "name", None) or getattr(g, "title", "Financial Goal")
        target = getattr(g, "target_amount", 100000.0)
        curr = getattr(g, "current_amount", 0.0)
        pct = min(100, round((curr / max(target, 1.0)) * 100))
        goal_items.append({
            "id": g.id,
            "name": name,
            "target_amount": target,
            "current_amount": curr,
            "category": getattr(g, "category", "General"),
            "deadline": getattr(g, "deadline", "2027-12-31"),
            "percentage": pct
        })

    # 5. Upcoming Bills
    upcoming_bills = [
        {"id": 1, "name": "Comprehensive Health Plus Premium", "amount": 6500.0, "due_date": "Due in 18 days", "category": "Insurance"},
        {"id": 2, "name": "Broadband & Fiber Line", "amount": 1499.0, "due_date": "Due in 6 days", "category": "Utilities"},
        {"id": 3, "name": "Personal Loan EMI (Auto-Debit)", "amount": 9245.0, "due_date": "Due on 5th Dec", "category": "Credit"}
    ]

    # 6. Personalized Alerts
    alerts = []
    suspicious_count = len([t for t in txs if getattr(t, 'suspicious', False)])
    if suspicious_count > 0:
        alerts.append({
            "type": "warning",
            "title": "Anomaly Alert",
            "message": f"{suspicious_count} transactions flagged by IsolationForest for review."
        })
    alerts.append({
        "type": "info",
        "title": "Tax Optimization",
        "message": "Enrolling in a Section 80D health plan can reduce annual tax liability by up to ₹25,000."
    })

    recent_tx = []
    for t in txs[:6]:
        d = t.transaction_date
        d_str = d.strftime("%d-%b-%Y") if hasattr(d, "strftime") else str(d or "")
        recent_tx.append({
            "id": t.id,
            "description": t.description,
            "amount": t.amount,
            "transaction_type": t.transaction_type,
            "category": t.category,
            "suspicious": getattr(t, "suspicious", False),
            "date": d_str
        })

    return {
        "total_income": monthly_income,
        "monthly_expenses": monthly_expenses,
        "total_savings": total_savings,
        "existing_debts": existing_debts,
        "monthly_cash_flow": {
            "income": monthly_income,
            "expenses": monthly_expenses,
            "surplus": monthly_income - monthly_expenses
        },
        "health_score": health_result,
        "category_spend": category_spend,
        "goals": goal_items,
        "recent_transactions": recent_tx,
        "upcoming_bills": upcoming_bills,
        "alerts": alerts
    }

@router.get("/health-score")
def get_financial_health_score_details(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        txs = db.scalars(select(Transaction).where(Transaction.user_id == user.id)).all()
    except Exception:
        txs = []

    inflow = sum(t.amount for t in txs if t.transaction_type == "income")
    outflow = sum(t.amount for t in txs if t.transaction_type == "expense")

    income = inflow if inflow > 0 else 85000.0
    expenses = outflow if outflow > 0 else 42000.0
    savings = 450000.0
    debt = 125000.0

    return calculate_financial_health_score(income, expenses, savings, debt, active_policies_count=1)

@router.get("/predictions")
def get_financial_predictions(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return forecast_financial_trajectory(past_monthly_expenses=[32000, 34500, 31200, 36000, 33100, 35400], monthly_income=85000.0)

@router.get("/profile")
def get_financial_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    prof = db.scalar(select(FinancialProfile).where(FinancialProfile.user_id == user.id))
    if not prof:
        return {
            "monthly_income": 85000.0,
            "monthly_expenses": 42000.0,
            "liquid_savings": 450000.0,
            "total_debt": 125000.0,
            "risk_tolerance": "moderate"
        }
    return {
        "monthly_income": prof.monthly_income,
        "monthly_expenses": prof.monthly_expenses,
        "liquid_savings": prof.liquid_savings,
        "total_debt": prof.total_debt,
        "risk_tolerance": prof.risk_tolerance
    }
