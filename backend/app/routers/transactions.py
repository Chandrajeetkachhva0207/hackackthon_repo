from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
from io import StringIO
import csv
from typing import Optional, List
from ..database import get_db
from ..models import User, Transaction
from ..schemas import TransactionIn, TransactionUpdate, TransactionOut
from ..security import get_current_user
from ..services import categorize
from ..ml import detect_transaction_anomaly

router = APIRouter(prefix="/api", tags=["Transactions & Expense Intelligence"])

@router.get("/transactions", response_model=List[TransactionOut])
def get_transactions(
    q: Optional[str] = None,
    category: Optional[str] = None,
    transaction_type: Optional[str] = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    query = select(Transaction).where(Transaction.user_id == user.id)
    if transaction_type and transaction_type != "all":
        query = query.where(Transaction.transaction_type == transaction_type)
    if category and category != "all":
        query = query.where(Transaction.category == category)
    if q:
        query = query.where(Transaction.description.ilike(f"%{q}%"))

    query = query.order_by(Transaction.transaction_date.desc())
    return db.scalars(query).all()

@router.post("/transactions", response_model=TransactionOut)
def create_transaction(payload: TransactionIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cat = payload.category
    if not cat or cat == "Other":
        cat = "Salary" if payload.transaction_type == "income" else categorize(payload.description)

    # Scikit-learn Anomaly Detection
    anomaly_res = detect_transaction_anomaly(payload.amount, payload.description, cat)

    row = Transaction(
        user_id=user.id,
        description=payload.description,
        amount=payload.amount,
        transaction_type=payload.transaction_type,
        category=cat,
        merchant=payload.merchant or "",
        is_recurring=payload.is_recurring or False,
        suspicious=anomaly_res["suspicious"],
        anomaly_reason=anomaly_res["anomaly_reason"],
        transaction_date=payload.transaction_date or datetime.utcnow()
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

@router.put("/transactions/{id}", response_model=TransactionOut)
def update_transaction(id: int, payload: TransactionUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tx = db.scalar(select(Transaction).where(Transaction.id == id, Transaction.user_id == user.id))
    if not tx:
        raise HTTPException(404, "Transaction not found")

    if payload.description is not None: tx.description = payload.description
    if payload.amount is not None: tx.amount = payload.amount
    if payload.transaction_type is not None: tx.transaction_type = payload.transaction_type
    if payload.category is not None: tx.category = payload.category
    if payload.merchant is not None: tx.merchant = payload.merchant

    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/transactions/{id}")
def delete_transaction(id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tx = db.scalar(select(Transaction).where(Transaction.id == id, Transaction.user_id == user.id))
    if not tx:
        raise HTTPException(404, "Transaction not found")

    db.delete(tx)
    db.commit()
    return {"status": "success", "message": f"Transaction #{id} deleted successfully"}

@router.post("/transactions/upload-csv")
async def upload_transactions_csv(file: UploadFile = File(...), db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(400, "Only valid .csv files are supported")

    content = await file.read()
    decoded = content.decode("utf-8", errors="replace")
    reader = csv.DictReader(StringIO(decoded))

    imported_count = 0
    for row in reader:
        desc = row.get("description") or row.get("Description") or "CSV Import"
        try:
            amt = float(row.get("amount") or row.get("Amount") or 0.0)
        except ValueError:
            amt = 0.0

        if amt <= 0:
            continue

        ttype = (row.get("type") or row.get("Type") or "expense").lower()
        if ttype not in ["income", "expense"]:
            ttype = "expense"

        cat = row.get("category") or row.get("Category") or categorize(desc)
        anomaly_res = detect_transaction_anomaly(amt, desc, cat)

        tx = Transaction(
            user_id=user.id,
            description=desc,
            amount=amt,
            transaction_type=ttype,
            category=cat,
            suspicious=anomaly_res["suspicious"],
            anomaly_reason=anomaly_res["anomaly_reason"],
            transaction_date=datetime.utcnow()
        )
        db.add(tx)
        imported_count += 1

    db.commit()
    return {"status": "success", "imported_count": imported_count, "message": f"Successfully parsed and saved {imported_count} transactions"}

# Backward compatibility route for fintech insights
@router.get("/fintech/insights")
def fintech_insights(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.scalars(select(Transaction).where(Transaction.user_id == user.id)).all()
    expenses = sum(t.amount for t in rows if t.transaction_type == "expense")
    income = sum(t.amount for t in rows if t.transaction_type == "income")
    by_category = {}
    for t in rows:
        if t.transaction_type == "expense":
            by_category[t.category] = by_category.get(t.category, 0.0) + t.amount

    return {
        "income": income if income > 0 else 68000.0,
        "expenses": expenses if expenses > 0 else 35000.0,
        "balance": (income if income > 0 else 68000.0) - (expenses if expenses > 0 else 35000.0),
        "category_spend": by_category,
        "alerts": [{"transaction_id": t.id, "description": t.description, "amount": t.amount, "reason": t.anomaly_reason} for t in rows if t.suspicious],
        "budget_tip": "Review your highest spending category and allocate at least 20% of net inflow toward your liquid emergency fund."
    }
