import os
from app.database import Base, engine, SessionLocal
from app.models import User, FinancialProfile, Transaction, SavingsGoal, Notification, InsurancePolicy, LoanProduct
from app.security import hash_password
from datetime import datetime, timedelta

# Remove outdated DB file if exists to rebuild clean schema
db_file = "financial_journeys.db"
if os.path.exists(db_file):
    os.remove(db_file)
    print(f"Removed old {db_file}")

# Create all tables freshly with new columns
Base.metadata.create_all(bind=engine)
print("Created all tables successfully.")

db = SessionLocal()
try:
    # 1. Create Demo User
    demo_user = User(
        email="demo@example.com",
        password_hash=hash_password("password123"),
        name="Alex Rivera",
        is_admin=True
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)
    print(f"Created demo user: {demo_user.email} (ID: {demo_user.id})")

    # 2. Financial Profile
    fin_prof = FinancialProfile(
        user_id=demo_user.id,
        monthly_income=85000.0,
        monthly_expenses=42000.0,
        liquid_savings=450000.0,
        total_debt=125000.0,
        credit_score_estimate=780,
        risk_tolerance="moderate"
    )
    db.add(fin_prof)

    # 3. Seed Realistic Transactions
    tx_seeds = [
        ("Tech Corp Monthly Salary", 85000.0, "income", "Salary", False, "Tech Corp", False, ""),
        ("City Central Luxury Apartment Rent", 22000.0, "expense", "Housing", True, "Property Management", False, ""),
        ("Nature Fresh Organic Groceries", 6500.0, "expense", "Food & Groceries", False, "Nature Fresh Supermarket", False, ""),
        ("Metro High-Speed Broadband", 1499.0, "expense", "Utilities", True, "FiberNet", False, ""),
        ("Equinox Fitness Membership", 2500.0, "expense", "Health & Wellness", True, "Equinox", False, ""),
        ("Bistro Prime Weekend Dinner", 4250.0, "expense", "Food & Dining", False, "Bistro Prime", False, ""),
        ("Uber Premium Ride", 680.0, "expense", "Transportation", False, "Uber", False, ""),
        ("Digital Streaming Prime 4K", 499.0, "expense", "Entertainment", True, "Prime Video", False, ""),
        ("Flagged Luxury Electronics Retail", 18499.0, "expense", "Shopping", False, "Gadget Hub Luxury", True, "Isolation Forest flagged amount as statistical distribution outlier")
    ]

    for desc, amt, tx_type, cat, recur, merch, susp, reason in tx_seeds:
        t = Transaction(
            user_id=demo_user.id,
            description=desc,
            amount=amt,
            transaction_type=tx_type,
            category=cat,
            is_recurring=recur,
            merchant=merch,
            suspicious=susp,
            anomaly_reason=reason,
            transaction_date=datetime.utcnow() - timedelta(days=len(tx_seeds))
        )
        db.add(t)

    # 4. Savings Goals
    goals = [
        SavingsGoal(user_id=demo_user.id, title="Emergency Shield (6 Mos)", target_amount=250000.0, current_amount=175000.0, target_date="2027-06-30", category="Emergency", status="in_progress"),
        SavingsGoal(user_id=demo_user.id, title="Home Down Payment", target_amount=1500000.0, current_amount=450000.0, target_date="2028-12-31", category="Real Estate", status="in_progress"),
        SavingsGoal(user_id=demo_user.id, title="Europe Summer Vacation", target_amount=200000.0, current_amount=140000.0, target_date="2027-09-15", category="Travel", status="in_progress")
    ]
    db.add_all(goals)

    # 5. Notifications
    notes = [
        Notification(user_id=demo_user.id, title="Unusual Transaction Flagged", message="IsolationForest model flagged ₹18,499 at Electronics Retail for review.", notification_type="alert", is_read=False),
        Notification(user_id=demo_user.id, title="Pre-Qualified Home Loan Available", message="Your Financial Health score of 88 qualifies you for 8.45% preferential APR.", notification_type="recommendation", is_read=False),
        Notification(user_id=demo_user.id, title="Insurance Policy Renewal in 18 Days", message="Comprehensive Health Plus policy expires next month. Zero-commission renewal open.", notification_type="reminder", is_read=False),
        Notification(user_id=demo_user.id, title="Goal Milestone Achieved", message="Emergency Shield reached 70% of target amount! Keep up the momentum.", notification_type="milestone", is_read=True)
    ]
    db.add_all(notes)

    db.commit()
    print("Database successfully seeded with realistic enterprise data!")
finally:
    db.close()
