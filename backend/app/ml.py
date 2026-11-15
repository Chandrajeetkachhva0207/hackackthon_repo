import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from typing import Dict, Any, List

# ==========================================================
# 1. Scikit-Learn Loan Eligibility Model & Classifier
# ==========================================================
def build_eligibility_model():
    rng = np.random.default_rng(42)
    # Generate 1500 realistic synthetic borrower profiles
    income = rng.uniform(15000, 250000, 1500)
    amount = rng.uniform(25000, 2000000, 1500)
    employment = rng.integers(0, 2, 1500) # 1 = salaried/business, 0 = gig/unverified
    dti_ratio = (amount / 36) / np.maximum(income, 1)

    # Ground truth rules for creditworthiness demonstration
    labels = ((income >= 25000) & (dti_ratio <= 0.45) & (employment == 1)).astype(int)
    X = np.column_stack([income, amount, employment, dti_ratio])

    pipeline = Pipeline([
        ("scale", StandardScaler()),
        ("classifier", RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42))
    ])
    pipeline.fit(X, labels)
    return pipeline

eligibility_pipeline = build_eligibility_model()

def evaluate_loan_eligibility(monthly_income: float, requested_amount: float, employment_type: str, tenure_months: int = 36) -> Dict[str, Any]:
    employed = 1 if employment_type.lower() in ["salaried", "self-employed"] else 0
    estimated_emi = (requested_amount / tenure_months) * 1.10 # approx with interest
    dti = estimated_emi / max(monthly_income, 1)

    features = [[monthly_income, requested_amount, employed, dti]]
    proba = float(eligibility_pipeline.predict_proba(features)[0][1])
    score = round(proba * 100, 1)

    # Generate transparent explainability rationale
    factors = []
    if dti <= 0.35:
        factors.append("Healthy Debt-to-Income ratio below 35% (+)")
    else:
        factors.append(f"Elevated Debt-to-Income ratio of {round(dti*100, 1)}% (-)")

    if monthly_income >= 40000:
        factors.append("Consistent monthly inflow exceeds standard underwriting minimums (+)")
    else:
        factors.append("Monthly inflow is on the conservative tier (-)")

    if employed == 1:
        factors.append("Verified employment status fulfills tenure prerequisites (+)")

    return {
        "demo_indicator": score,
        "is_prequalified": score >= 60.0,
        "dti_ratio": round(dti * 100, 1),
        "explanation": "Evaluated using Random Forest multi-factor model on income, debt-to-income, and employment status.",
        "factors": factors,
        "disclaimer": "Synthetic-data demonstration indicator. Not a credit score, underwriting guarantee, or loan approval."
    }

demo_eligibility_insight = evaluate_loan_eligibility

# ==========================================================
# 2. Scikit-Learn Anomaly & Fraud Detector
# ==========================================================
def build_anomaly_detector():
    rng = np.random.default_rng(101)
    # Train on typical transaction amounts
    normal_amounts = rng.normal(loc=2500, scale=3500, size=800)
    normal_amounts = np.abs(normal_amounts)
    X = normal_amounts.reshape(-1, 1)

    iso_forest = IsolationForest(contamination=0.03, random_state=42)
    iso_forest.fit(X)
    return iso_forest

anomaly_model = build_anomaly_detector()

def detect_transaction_anomaly(amount: float, description: str, category: str = "Other") -> Dict[str, Any]:
    d = description.lower()
    is_outlier = False
    reasons = []

    # Keyword heuristics
    suspicious_keywords = ["unknown", "unrecognized", "suspicious", "crypto offshore", "test fraud", "wire transfer unknown"]
    if any(k in d for k in suspicious_keywords):
        is_outlier = True
        reasons.append("Unrecognized or high-risk merchant pattern detected")

    # Statistical outlier check
    if amount >= 50000:
        is_outlier = True
        reasons.append(f"High-value debit ₹{amount:,.0f} exceeds standard spending threshold")
    else:
        pred = anomaly_model.predict([[amount]])[0]
        if pred == -1 and amount > 15000:
            is_outlier = True
            reasons.append("Isolation Forest flagged amount as statistical distribution outlier")

    return {
        "suspicious": is_outlier,
        "anomaly_reason": "; ".join(reasons) if is_outlier else ""
    }

# ==========================================================
# 3. AI Financial Health Scoring Engine (0-100)
# ==========================================================
def calculate_financial_health_score(
    monthly_income: float,
    monthly_expenses: float,
    savings_balance: float,
    existing_debt: float,
    active_policies_count: int = 1
) -> Dict[str, Any]:
    # Weights:
    # 1. Savings Ratio (25 pts): Savings / Income
    # 2. DTI Ratio (25 pts): Debt payments / Income
    # 3. Expense Ratio (20 pts): Expenses / Income
    # 4. Emergency Cushion (20 pts): Savings / Expenses
    # 5. Protection Factor (10 pts): Active Insurance Policies

    income = max(monthly_income, 1.0)
    surplus = max(0.0, monthly_income - monthly_expenses)
    savings_ratio = surplus / income
    dti_ratio = existing_debt / (income * 12)
    expense_ratio = monthly_expenses / income
    months_buffer = savings_balance / max(monthly_expenses, 1.0)

    # 1. Savings Score (0-25)
    s_score = min(25.0, (savings_ratio / 0.20) * 25.0)

    # 2. DTI Score (0-25) - lower DTI is better
    dti_score = max(0.0, 25.0 - (dti_ratio / 0.40) * 25.0)

    # 3. Expense Control (0-20) - 50-70% is standard
    if expense_ratio <= 0.60:
        exp_score = 20.0
    elif expense_ratio <= 0.85:
        exp_score = 14.0
    else:
        exp_score = max(5.0, 20.0 - (expense_ratio - 0.60) * 40.0)

    # 4. Emergency Fund (0-20) - 6 months is benchmark
    ef_score = min(20.0, (months_buffer / 6.0) * 20.0)

    # 5. Protection (0-10)
    prot_score = 10.0 if active_policies_count >= 1 else 3.0

    total_score = int(round(s_score + dti_score + exp_score + ef_score + prot_score))
    total_score = max(35, min(98, total_score))

    tier = "Prime (Tier 1)" if total_score >= 80 else "Strong (Tier 2)" if total_score >= 65 else "Building (Tier 3)"

    strengths = []
    improvements = []

    if savings_ratio >= 0.20:
        strengths.append(f"Strong monthly savings rate of {round(savings_ratio*100)}% (exceeds 20% benchmark)")
    else:
        improvements.append("Increase monthly savings allocation toward the 20% rule of thumb")

    if months_buffer >= 3.0:
        strengths.append(f"Emergency reserve covers {round(months_buffer, 1)} months of living costs")
    else:
        improvements.append("Build emergency cushion to at least 3–6 months of essential expenses")

    if dti_ratio <= 0.25:
        strengths.append("Conservative debt-to-income ratio leaves significant borrowing headroom")
    else:
        improvements.append("Accelerate debt pre-payments to reduce monthly debt service load")

    if active_policies_count >= 1:
        strengths.append("Active health insurance coverage shields against catastrophic hospitalization")
    else:
        improvements.append("Enroll in fundamental health and term life protection")

    return {
        "score": total_score,
        "tier": tier,
        "breakdown": {
            "savings_discipline": round(s_score, 1),
            "debt_affordability": round(dti_score, 1),
            "expense_management": round(exp_score, 1),
            "emergency_cushion": round(ef_score, 1),
            "insurance_protection": round(prot_score, 1),
        },
        "metrics": {
            "monthly_surplus": surplus,
            "savings_ratio_pct": round(savings_ratio * 100, 1),
            "expense_ratio_pct": round(expense_ratio * 100, 1),
            "emergency_buffer_months": round(months_buffer, 1)
        },
        "strengths": strengths,
        "areas_for_improvement": improvements,
        "methodology": "Score is derived from weighted financial metrics: Savings Rate (25%), Debt-to-Income (25%), Expense Control (20%), Emergency Reserves (20%), and Insurance Coverage (10%). Not an official credit bureau score."
    }

# ==========================================================
# 4. Financial Forecasting & Prediction Engine
# ==========================================================
def forecast_financial_trajectory(past_monthly_expenses: List[float], monthly_income: float) -> Dict[str, Any]:
    # Default 6-month historical baseline if insufficient data
    if not past_monthly_expenses or len(past_monthly_expenses) < 3:
        past_monthly_expenses = [32000, 34000, 31000, 36000, 33000, 35000]

    X = np.arange(len(past_monthly_expenses)).reshape(-1, 1)
    y = np.array(past_monthly_expenses)

    reg = LinearRegression()
    reg.fit(X, y)

    # Forecast next 6 months
    forecast_months = ["Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027"]
    predictions = []

    for i, month_label in enumerate(forecast_months):
        future_x = np.array([[len(past_monthly_expenses) + i]])
        predicted_exp = float(reg.predict(future_x)[0])
        predicted_exp = max(10000.0, round(predicted_exp, -2)) # round to hundreds
        predicted_savings = max(0.0, monthly_income - predicted_exp)
        shortfall = predicted_exp > monthly_income

        predictions.append({
            "month": month_label,
            "predicted_expense": predicted_exp,
            "predicted_savings": predicted_savings,
            "projected_surplus": monthly_income - predicted_exp,
            "shortfall_risk": shortfall,
            "confidence_interval": [round(predicted_exp * 0.94), round(predicted_exp * 1.06)]
        })

    return {
        "historical_expenses": past_monthly_expenses,
        "forecasts": predictions,
        "trend_direction": "increasing" if reg.coef_[0] > 0 else "stable",
        "monthly_delta": round(float(reg.coef_[0]), 1),
        "model_name": "Linear Trend Regression with Variance Interval Band"
    }

# ==========================================================
# 5. Life Event & What-If Financial Simulators
# ==========================================================
def simulate_life_event(event_type: str, target_year: int, custom_budget: float = None, current_savings: float = None) -> Dict[str, Any]:
    years_ahead = max(1, target_year - 2026)
    months_ahead = years_ahead * 12

    defaults = {
        "house": {"name": "Buying a House", "base_cost": 6500000, "downpayment_pct": 0.20, "inflation_pct": 0.06},
        "marriage": {"name": "Marriage Planning", "base_cost": 1500000, "downpayment_pct": 1.0, "inflation_pct": 0.07},
        "education": {"name": "Higher Education / MBA", "base_cost": 2800000, "downpayment_pct": 0.70, "inflation_pct": 0.08},
        "business": {"name": "Starting a Business", "base_cost": 2000000, "downpayment_pct": 1.0, "inflation_pct": 0.05},
        "retirement": {"name": "Retirement Corpus", "base_cost": 25000000, "downpayment_pct": 1.0, "inflation_pct": 0.06}
    }

    config = defaults.get(event_type, defaults["house"])
    base_cost = custom_budget if custom_budget and custom_budget > 0 else config["base_cost"]
    inflation = config["inflation_pct"]

    # Projected cost adjusted for annual inflation
    projected_cost = base_cost * ((1 + inflation) ** years_ahead)
    target_upfront = projected_cost * config["downpayment_pct"]

    saved_so_far = current_savings if current_savings is not None else (target_upfront * 0.25)
    remaining_to_save = max(0.0, target_upfront - saved_so_far)
    monthly_savings_needed = remaining_to_save / max(months_ahead, 1)

    return {
        "event_name": config["name"],
        "target_year": target_year,
        "years_until_event": years_ahead,
        "base_cost_today": base_cost,
        "projected_cost_future": round(projected_cost),
        "upfront_requirement": round(target_upfront),
        "current_savings_allocated": round(saved_so_far),
        "shortfall": round(remaining_to_save),
        "required_monthly_savings": round(monthly_savings_needed),
        "estimated_inflation_rate": f"{round(inflation * 100, 1)}% p.a."
    }

def simulate_what_if_scenario(
    income: float,
    expense: float,
    loan_amount: float = 0,
    loan_rate: float = 10.5,
    loan_tenure_months: int = 36,
    monthly_savings_sip: float = 5000,
    months: int = 24
) -> List[Dict[str, Any]]:
    # Calculate loan EMI
    loan_emi = 0.0
    if loan_amount > 0 and loan_tenure_months > 0:
        r = (loan_rate / 100) / 12
        loan_emi = (loan_amount * r * ((1 + r) ** loan_tenure_months)) / (((1 + r) ** loan_tenure_months) - 1)

    timeline = []
    cumulative_savings = 100000.0 # starting balance
    cumulative_wealth_with_returns = 100000.0
    expected_sip_return_annual = 0.11 # 11% CAGR

    for m in range(1, months + 1):
        net_monthly_surplus = income - expense - (loan_emi if m <= loan_tenure_months else 0) - monthly_savings_sip
        cumulative_savings += (income - expense - (loan_emi if m <= loan_tenure_months else 0))

        # SIP with monthly compounding
        monthly_growth = (1 + expected_sip_return_annual) ** (1/12)
        cumulative_wealth_with_returns = (cumulative_wealth_with_returns * monthly_growth) + monthly_savings_sip

        timeline.append({
            "month": f"M{m}",
            "net_surplus": round(net_monthly_surplus),
            "loan_emi": round(loan_emi) if m <= loan_tenure_months else 0,
            "cash_reserves": round(max(0, cumulative_savings)),
            "invested_wealth": round(cumulative_wealth_with_returns)
        })

    return timeline
