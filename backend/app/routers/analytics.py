from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from io import StringIO
import csv
from ..database import get_db
from ..models import User, Transaction, LoanApplication
from ..security import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Power BI analytics"])

@router.get("/summary")
def summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tx = db.scalars(select(Transaction).where(Transaction.user_id == user.id)).all()
    loans = db.scalars(select(LoanApplication).where(LoanApplication.user_id == user.id)).all()
    return {"transaction_count":len(tx), "income":sum(t.amount for t in tx if t.transaction_type=="income"),
            "expenses":sum(t.amount for t in tx if t.transaction_type=="expense"),
            "loan_application_count":len(loans)}

@router.get("/admin/overview")
def admin_overview(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user_count = db.scalar(select(func.count(User.id))) or 0
    loan_count = db.scalar(select(func.count(LoanApplication.id))) or 0
    tx_count = db.scalar(select(func.count(Transaction.id))) or 0
    total_requested = db.scalar(select(func.sum(LoanApplication.requested_amount))) or 0.0
    all_loans = db.scalars(select(LoanApplication).order_by(LoanApplication.created_at.desc()).limit(20)).all()
    return {
        "total_users": user_count,
        "total_loans": loan_count,
        "total_transactions": tx_count,
        "total_loan_volume": float(total_requested),
        "applications": [
            {
                "id": l.id,
                "user_id": l.user_id,
                "loan_type": l.loan_type,
                "requested_amount": l.requested_amount,
                "monthly_income": l.monthly_income,
                "employment_type": l.employment_type,
                "status": l.status,
                "demo_score": l.demo_score,
                "created_at": l.created_at.isoformat() if l.created_at else None
            }
            for l in all_loans
        ]
    }

@router.patch("/admin/loans/{application_id}")
def update_loan_status(application_id: int, payload: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    app = db.get(LoanApplication, application_id)
    if not app:
        raise HTTPException(404, "Application not found")
    if "status" in payload:
        app.status = str(payload["status"])
    db.commit()
    db.refresh(app)
    return {"id": app.id, "status": app.status}

@router.get("/transactions.csv")
def transactions_csv(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.scalars(select(Transaction).where(Transaction.user_id == user.id)).all()
    out = StringIO(); writer = csv.writer(out)
    writer.writerow(["transaction_id","date","description","amount","type","category","suspicious"])
    for r in rows:
        writer.writerow([r.id,r.transaction_date.isoformat(),r.description,r.amount,r.transaction_type,r.category,r.suspicious])
    out.seek(0)
    return StreamingResponse(iter([out.getvalue()]), media_type="text/csv",
        headers={"Content-Disposition":"attachment; filename=transactions.csv"})

@router.get("/loan-applications.csv")
def loans_csv(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.scalars(select(LoanApplication).where(LoanApplication.user_id == user.id)).all()
    out = StringIO(); writer = csv.writer(out)
    writer.writerow(["application_id","loan_type","requested_amount","monthly_income","employment_type","status","created_at"])
    for r in rows:
        writer.writerow([r.id,r.loan_type,r.requested_amount,r.monthly_income,r.employment_type,r.status,r.created_at.isoformat()])
    out.seek(0)
    return StreamingResponse(iter([out.getvalue()]), media_type="text/csv",
        headers={"Content-Disposition":"attachment; filename=loan-applications.csv"})
