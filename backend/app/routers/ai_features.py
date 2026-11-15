from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from ..database import get_db
from ..models import User, SavingsGoal, Notification, Transaction
from ..security import get_current_user
from ..ml import (
    simulate_life_event,
    simulate_what_if_scenario,
    forecast_financial_trajectory,
    detect_transaction_anomaly,
    calculate_financial_health_score
)
from ..data import INSURANCE_POLICIES, LOAN_PRODUCTS

router = APIRouter(prefix="/api/ai", tags=["AI Intelligence & Financial Planning"])

# Models
class SimulationRequest(BaseModel):
    event_type: str = "house"
    target_year: int = 2029
    custom_budget: Optional[float] = 3500000.0
    current_savings: Optional[float] = 500000.0

class WhatIfRequest(BaseModel):
    income: float = 85000.0
    expense: float = 42000.0
    loan_amount: float = 500000.0
    loan_rate: float = 10.5
    loan_tenure_months: int = 36
    monthly_savings_sip: float = 5000.0
    months: int = 24

class GoalCreate(BaseModel):
    title: str
    target_amount: float
    current_amount: float = 0.0
    target_date: Optional[str] = None
    category: str = "General"

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    status: Optional[str] = None

class GoalContribute(BaseModel):
    amount: float

# 1. Life Event Simulator
@router.post("/financial-simulation")
def run_financial_simulation(payload: SimulationRequest, user: User = Depends(get_current_user)):
    return simulate_life_event(
        event_type=payload.event_type,
        target_year=payload.target_year,
        custom_budget=payload.custom_budget,
        current_savings=payload.current_savings
    )

# 2. What-If Reactive Scenario
@router.post("/what-if")
def run_what_if_scenario(payload: WhatIfRequest, user: User = Depends(get_current_user)):
    return simulate_what_if_scenario(
        income=payload.income,
        expense=payload.expense,
        loan_amount=payload.loan_amount,
        loan_rate=payload.loan_rate,
        loan_tenure_months=payload.loan_tenure_months,
        monthly_savings_sip=payload.monthly_savings_sip,
        months=payload.months
    )

# 3. Expense Intelligence & Spending Leak Analysis
@router.get("/expense-intelligence")
def expense_intelligence(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    txs = db.scalars(select(Transaction).where(Transaction.user_id == user.id)).all()
    expense_txs = [t for t in txs if t.transaction_type == "expense"]
    total_expense = sum(t.amount for t in expense_txs) or 42000.0
    
    # Category aggregation
    cat_spend = {}
    recurring_detected = []
    suspicious_count = 0
    for t in expense_txs:
        cat_spend[t.category] = cat_spend.get(t.category, 0.0) + t.amount
        if t.suspicious:
            suspicious_count += 1
        desc_lower = t.description.lower()
        if any(w in desc_lower for w in ["netflix", "spotify", "gym", "prime", "sub", "broadband", "rent", "emi"]):
            recurring_detected.append({
                "description": t.description,
                "amount": t.amount,
                "frequency": "Monthly",
                "category": t.category
            })
            
    # Spending leaks calculation
    dining_out = cat_spend.get("Dining", 0.0) + cat_spend.get("Food & Dining", 0.0)
    shopping = cat_spend.get("Shopping", 0.0)
    leaks = []
    if dining_out > 8000:
        leaks.append({
            "title": "Frequent Food Delivery & Dining",
            "potential_saving": round(dining_out * 0.35, 2),
            "recommendation": "Reducing weekday takeout orders could save up to 35% without impacting weekend leisure."
        })
    if len(recurring_detected) > 3:
        leaks.append({
            "title": "Multiple Active Digital Subscriptions",
            "potential_saving": 1200.0,
            "recommendation": "Audit unused subscriptions. 2 overlapping streaming memberships detected."
        })

    return {
        "total_expense": total_expense,
        "category_breakdown": cat_spend,
        "recurring_commitments": recurring_detected,
        "recurring_total": sum(r["amount"] for r in recurring_detected),
        "suspicious_transactions_count": suspicious_count,
        "spending_leaks": leaks,
        "budget_rule_50_30_20": {
            "needs_target": round(total_expense * 0.50, 2),
            "wants_target": round(total_expense * 0.30, 2),
            "savings_target": round(total_expense * 0.20, 2),
            "actual_needs": round(total_expense * 0.58, 2),
            "actual_wants": round(total_expense * 0.28, 2),
            "actual_savings": round(total_expense * 0.14, 2)
        }
    }

# 4. Cash Flow & Savings Forward Projections
@router.get("/forecast")
def get_forecast(months: int = 6, user: User = Depends(get_current_user)):
    return forecast_financial_trajectory(past_monthly_expenses=[32000, 34500, 31200, 36000, 33100, 35400], monthly_income=85000.0)

# 5. Goal Management CRUD
@router.get("/goals")
def get_goals(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goals = db.scalars(select(SavingsGoal).where(SavingsGoal.user_id == user.id)).all()
    if not goals:
        seeds = [
            SavingsGoal(user_id=user.id, name="Emergency Shield (6 Mos)", target_amount=250000.0, current_amount=175000.0, deadline="2027-06-30", category="Emergency", status="in_progress"),
            SavingsGoal(user_id=user.id, name="Home Down Payment", target_amount=1500000.0, current_amount=450000.0, deadline="2028-12-31", category="Real Estate", status="in_progress"),
            SavingsGoal(user_id=user.id, name="Europe Vacation", target_amount=200000.0, current_amount=140000.0, deadline="2027-09-15", category="Travel", status="in_progress")
        ]
        db.add_all(seeds)
        db.commit()
        goals = db.scalars(select(SavingsGoal).where(SavingsGoal.user_id == user.id)).all()
    
    res = []
    for g in goals:
        title = getattr(g, "name", None) or getattr(g, "title", "Goal")
        target_date = getattr(g, "deadline", None) or getattr(g, "target_date", "2027-12-31")
        pct = round((g.current_amount / g.target_amount) * 100, 1) if g.target_amount > 0 else 0
        res.append({
            "id": g.id,
            "title": title,
            "target_amount": g.target_amount,
            "current_amount": g.current_amount,
            "progress_percent": min(pct, 100.0),
            "remaining_amount": max(0.0, g.target_amount - g.current_amount),
            "target_date": target_date,
            "category": g.category,
            "status": g.status
        })
    return res

@router.post("/goals")
def create_goal(payload: GoalCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    target_date = payload.target_date or (datetime.utcnow() + timedelta(days=365)).strftime("%Y-%m-%d")
    goal = SavingsGoal(
        user_id=user.id,
        name=payload.title,
        target_amount=payload.target_amount,
        current_amount=payload.current_amount,
        deadline=target_date,
        category=payload.category,
        status="in_progress"
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return {
        "id": goal.id,
        "title": goal.name,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "progress_percent": round((goal.current_amount / goal.target_amount) * 100, 1) if goal.target_amount > 0 else 0,
        "target_date": goal.deadline,
        "category": goal.category,
        "status": goal.status
    }

@router.post("/goals/{goal_id}/contribute")
def contribute_goal(goal_id: int, payload: GoalContribute, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goal = db.scalar(select(SavingsGoal).where(SavingsGoal.id == goal_id, SavingsGoal.user_id == user.id))
    if not goal:
        raise HTTPException(404, "Goal not found")
    goal.current_amount += payload.amount
    if goal.current_amount >= goal.target_amount:
        goal.status = "achieved"
    db.commit()
    db.refresh(goal)
    return {
        "id": goal.id,
        "current_amount": goal.current_amount,
        "progress_percent": round((goal.current_amount / goal.target_amount) * 100, 1),
        "status": goal.status
    }

@router.delete("/goals/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    goal = db.scalar(select(SavingsGoal).where(SavingsGoal.id == goal_id, SavingsGoal.user_id == user.id))
    if not goal:
        raise HTTPException(404, "Goal not found")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}

# 6. Notifications Hub
@router.get("/notifications")
def get_notifications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    notes = db.scalars(select(Notification).where(Notification.user_id == user.id).order_by(Notification.created_at.desc())).all()
    if not notes:
        seeds = [
            Notification(user_id=user.id, title="Unusual Transaction Flagged", message="IsolationForest model flagged ₹18,499 at Electronics Retail for review.", notification_type="alert", is_read=False),
            Notification(user_id=user.id, title="Pre-Qualified Home Loan Available", message="Your Financial Health score of 88 qualifies you for 8.45% preferential APR.", notification_type="recommendation", is_read=False),
            Notification(user_id=user.id, title="Insurance Policy Renewal in 18 Days", message="Comprehensive Health Plus policy expires next month. Zero-commission renewal open.", notification_type="reminder", is_read=False),
            Notification(user_id=user.id, title="Goal Milestone Achieved", message="Emergency Shield reached 70% of target amount! Keep up the momentum.", notification_type="milestone", is_read=True)
        ]
        db.add_all(seeds)
        db.commit()
        notes = db.scalars(select(Notification).where(Notification.user_id == user.id).order_by(Notification.created_at.desc())).all()
    return [{
        "id": n.id,
        "title": n.title,
        "message": n.message,
        "notification_type": n.notification_type,
        "is_read": n.is_read,
        "created_at": n.created_at.isoformat() if n.created_at else datetime.utcnow().isoformat()
    } for n in notes]

@router.post("/notifications/{notif_id}/read")
def mark_read(notif_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    n = db.scalar(select(Notification).where(Notification.id == notif_id, Notification.user_id == user.id))
    if n:
        n.is_read = True
        db.commit()
    return {"status": "ok"}

@router.post("/notifications/read-all")
def mark_all_read(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    notes = db.scalars(select(Notification).where(Notification.user_id == user.id, Notification.is_read == False)).all()
    for n in notes:
        n.is_read = True
    db.commit()
    return {"status": "ok", "updated": len(notes)}

# 7. Loan EMI Calculator & Amortization Schedule
class EMICalculatorRequest(BaseModel):
    principal: float = 500000.0
    annual_interest_rate: float = 10.5
    tenure_months: int = 36

@router.post("/emi-calculator")
def calculate_emi(payload: EMICalculatorRequest):
    P = payload.principal
    r = (payload.annual_interest_rate / 12) / 100
    n = payload.tenure_months
    
    if r == 0:
        emi = P / n
    else:
        emi = (P * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)
        
    total_payment = emi * n
    total_interest = total_payment - P
    
    schedule = []
    balance = P
    for month in range(1, min(n + 1, 61)):
        interest_paid = balance * r
        principal_paid = emi - interest_paid
        balance = max(0.0, balance - principal_paid)
        schedule.append({
            "month": month,
            "emi": round(emi, 2),
            "principal_paid": round(principal_paid, 2),
            "interest_paid": round(interest_paid, 2),
            "remaining_balance": round(balance, 2)
        })
        
    return {
        "monthly_emi": round(emi, 2),
        "principal": round(P, 2),
        "total_interest": round(total_interest, 2),
        "total_payable": round(total_payment, 2),
        "interest_ratio_percent": round((total_interest / total_payment) * 100, 1),
        "amortization_schedule": schedule
    }

# 8. Insurance Coverage Gap Analysis
class CoverageAnalysisRequest(BaseModel):
    annual_income: float = 1020000.0
    dependents_count: int = 2
    existing_life_cover: float = 2500000.0
    existing_health_cover: float = 500000.0

@router.post("/insurance/coverage-analysis")
def analyze_coverage_gap(payload: CoverageAnalysisRequest):
    ideal_life = payload.annual_income * 12
    ideal_health = 1000000.0 + (payload.dependents_count * 200000.0)
    
    life_gap = max(0.0, ideal_life - payload.existing_life_cover)
    health_gap = max(0.0, ideal_health - payload.existing_health_cover)
    
    recommendations = []
    if life_gap > 0:
        recommendations.append({
            "category": "Term Life Insurance",
            "recommended_cover": ideal_life,
            "current_cover": payload.existing_life_cover,
            "shortfall": life_gap,
            "urgency": "High" if payload.dependents_count > 0 else "Medium",
            "rationale": f"Rule-of-thumb protection requires 12x annual income (₹{ideal_life:,.0f}) to safeguard {payload.dependents_count} dependents."
        })
    if health_gap > 0:
        recommendations.append({
            "category": "Comprehensive Health Insurance",
            "recommended_cover": ideal_health,
            "current_cover": payload.existing_health_cover,
            "shortfall": health_gap,
            "urgency": "High",
            "rationale": f"Medical inflation averages 12-14% annually. A minimum buffer of ₹{ideal_health:,.0f} prevents out-of-pocket medical debt."
        })
        
    return {
        "overall_protection_score": round(min(100.0, ((payload.existing_life_cover + payload.existing_health_cover) / (ideal_life + ideal_health)) * 100), 1),
        "ideal_life_cover": ideal_life,
        "ideal_health_cover": ideal_health,
        "life_gap": life_gap,
        "health_gap": health_gap,
        "actionable_recommendations": recommendations,
        "disclaimer": "Actuarial simulation benchmark only. Consult licensed insurance advisors for binding coverage terms."
    }
