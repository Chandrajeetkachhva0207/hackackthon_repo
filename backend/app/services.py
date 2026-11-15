import re
import httpx
from collections import defaultdict
from .config import settings
from .data import INSURANCE_POLICIES, LOAN_PRODUCTS

def categorize(description: str) -> str:
    d = description.lower()
    rules = {
        "Food": ["restaurant", "cafe", "swiggy", "zomato", "grocery", "food"],
        "Transport": ["uber", "ola", "petrol", "fuel", "metro", "bus"],
        "Shopping": ["amazon", "flipkart", "mall", "shopping"],
        "Bills": ["electricity", "mobile", "recharge", "internet", "bill"],
        "Healthcare": ["pharmacy", "hospital", "doctor", "medical"],
        "Salary": ["salary", "payroll"]
    }
    for category, words in rules.items():
        if any(word in d for word in words):
            return category
    return "Other"

def suspicious_flag(amount: float, description: str) -> bool:
    # Demo heuristic only; not a production fraud detector.
    return amount >= 50000 or any(x in description.lower() for x in ["unknown", "unrecognized", "test fraud"])

def rank_insurance(query: str):
    q = query.lower()
    if "bike" in q or "motor" in q:
        preferred = ["motor"]
    elif "health" in q or "medical" in q:
        preferred = ["health"]
    elif "life" in q:
        preferred = ["life"]
    else:
        preferred = []
    return sorted(INSURANCE_POLICIES, key=lambda p: (p["type"] not in preferred, p["annual_premium"]))

def rank_loans(amount: float, monthly_income: float):
    # Simple transparent demo filter, not underwriting or an approval decision.
    return sorted(
        [p for p in LOAN_PRODUCTS if p["max_amount"] >= amount],
        key=lambda p: p["rate_from"]
    )

async def assistant_reply(message: str, module: str) -> str:
    msg_lower = message.lower()

    if settings.llm_api_key and settings.llm_model:
        system = (
            "You are a careful financial journey assistant. Give general educational information only. "
            "Do not guarantee loan approval, insurance coverage, claim acceptance, returns, or fraud findings. "
            "Ask for consent before suggesting use of personal data. Encourage verification with licensed providers "
            "and human review for consequential decisions. Do not request full Aadhaar, PAN, passwords, OTPs, or card numbers."
        )
        url = settings.llm_base_url.rstrip("/") + "/chat/completions"
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    url,
                    headers={"Authorization": f"Bearer {settings.llm_api_key}"},
                    json={"model": settings.llm_model, "messages":[
                        {"role":"system","content":system + f" Current module: {module}."},
                        {"role":"user","content":message}
                    ], "temperature":0.3}
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
        except Exception:
            pass

    # Intelligent deterministic knowledge responses when LLM key is unset
    if "waiting period" in msg_lower:
        return ("Policy waiting periods are standard initial intervals before certain conditions become claimable:\n"
                "• Initial Waiting Period: Usually 30 days for general ailments (accidents are covered from Day 1).\n"
                "• Specific Illnesses: 1 to 2 years for conditions like hernia, cataract, or joint replacement.\n"
                "• Pre-Existing Diseases (PED): Typically 2 to 4 years before treatment costs are reimbursed.\n"
                "Always review the exact policy wording with your insurer before binding coverage.")

    if "emi" in msg_lower or "interest" in msg_lower or "lower" in msg_lower:
        return ("To reduce your monthly loan EMI or overall interest burden:\n"
                "1. Make a higher initial down payment to lower the principal borrowed.\n"
                "2. Opt for partial pre-payments during bonuses to reduce outstanding principal early.\n"
                "3. Maintain a prime credit score (750+) to negotiate lower interest rates.\n"
                "4. Compare lenders using our interactive EMI Simulator in the Lending module.")

    if "50/30/20" in msg_lower or "budget" in msg_lower:
        return ("The 50/30/20 budgeting framework is a proven rule of thumb:\n"
                "• 50% for Needs: Rent, groceries, utilities, debt obligations, insurance.\n"
                "• 30% for Wants: Dining out, subscriptions, leisure, entertainment.\n"
                "• 20% for Savings: Emergency fund, SIPs, retirement, liquid investments.\n"
                "You can record transactions in our Fintech module to track your live category percentages.")

    if "term" in msg_lower or "life" in msg_lower:
        return ("Key differences between Term Life and Investment-linked covers:\n"
                "• Pure Term Insurance: Pure protection with high sum insured (e.g. ₹1 Crore) at a very affordable annual premium. No maturity payoff if you survive.\n"
                "• Endowment / ULIPs: Combines insurance and investing, but carries higher charges and significantly lower life cover.\n"
                "Financial planners generally recommend buying pure term cover and investing the difference in low-cost index funds.")

    if "document" in msg_lower or "ocr" in msg_lower or "pan" in msg_lower:
        return ("For loan and insurance applications, standard verification documents include:\n"
                "• Identity & Address: Government ID (Aadhaar, Passport, Voter ID).\n"
                "• Financial Proofs: 3-6 months bank statements, latest 3 salary slips, Form 16 / ITR.\n"
                "• Note: For this demo environment, please upload only synthetic sample documents using our Document OCR tool.")

    if module == "insurance":
        return ("I can help you compare our illustrative policy catalogue and understand policy conditions. "
                "Ask me about health hospitalization, term life cover, claim settlement ratios (CSR), or waiting periods.")
    if module == "lending":
        return ("I can guide you through our demo loan journeys and explain eligibility scoring. "
                "Share your broad requirement (e.g. personal, bike, education loan) and income range to see preliminary matches.")
    if module == "fintech":
        return ("I can categorize your everyday transactions, highlight spending leaks, and help optimize monthly savings. "
                "Record a sample transaction or ask me about budgeting benchmarks.")

    return ("Hello! As your FinJourney AI companion, I provide guidance across all three financial pillars:\n"
            "1. Protection: Understanding and comparing insurance policies\n"
            "2. Borrowing: Simulating EMIs and checking preliminary loan eligibility\n"
            "3. Management: Categorizing expenses and flagging unusual activity\n"
            "Feel free to ask any question or select a specific journey module above.")
