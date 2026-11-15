# AI-Powered Financial Journeys

A full-stack MVP for three customer journeys:
- Insurance: policy discovery, plain-language policy explanation, claim guidance.
- Lending: preliminary eligibility insights, OCR document extraction, application tracking.
- Fintech: transaction categorization, budgeting insights, suspicious-activity flags.

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Python + FastAPI + SQLAlchemy + PostgreSQL
- Authentication: JWT + bcrypt password hashing
- AI: configurable OpenAI-compatible LLM API (optional; deterministic fallback included)
- OCR: Tesseract + pytesseract + pdf2image
- ML: scikit-learn (demo model; synthetic training data only)
- Analytics: Power BI-ready CSV export endpoints

## Important safety / demo boundaries
This is a hackathon MVP, not a production financial decision system. The lending score is illustrative and must not be used for actual credit decisions. Loan approval, insurance underwriting, claims acceptance, and fraud blocking are not automated. Human review is required. Do not upload real Aadhaar/PAN/bank documents to a demo deployment. Use synthetic sample data.
The LLM output is informational and should not be treated as legal, tax, investment, lending, or insurance advice. Never expose API keys to the browser.

## 1. Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Tesseract OCR installed on the host (optional for OCR endpoint; see below)

## 2. Configure environment
```bash
cp backend/.env.example backend/.env
```
Set `DATABASE_URL`, `JWT_SECRET`, and optionally `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`.
For local development, create a PostgreSQL database named `financial_journeys`.

## 3. Run backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API docs: http://localhost:8000/docs

The backend creates MVP tables on startup. For production, replace `create_all` with Alembic migrations.

## 4. Run frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## 5. Seed demo data
Register a user in the UI, then add transactions and explore the modules. API examples are in `docs/API_EXAMPLES.md`.
The demo insurance policies and loan products are static seed catalogues in `backend/app/data.py`.

## 6. OCR setup
Install Tesseract:
- Windows: install the Tesseract OCR package and add its install folder to PATH.
- Ubuntu/Debian: `sudo apt-get install tesseract-ocr poppler-utils`
- macOS: `brew install tesseract poppler`

Set `TESSERACT_CMD` in `.env` if the executable is not on PATH.
The OCR endpoint accepts PDF, PNG, JPG, and JPEG, with a size limit. Use synthetic documents only.

## 7. LLM setup
The app works without an LLM key using a deterministic response fallback.
To enable an OpenAI-compatible chat completion API, set:
```env
LLM_API_KEY=your_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=your-supported-chat-model
```
The key remains server-side. Check the chosen provider's current API/model compatibility.

## 8. Power BI
Use Power BI Desktop → Get Data → Web and connect to:
- `http://localhost:8000/api/analytics/summary`
- `http://localhost:8000/api/analytics/transactions.csv`
- `http://localhost:8000/api/analytics/loan-applications.csv`

For a hosted deployment, use HTTPS and a read-only analytics service account or a secured export process. Do not publish customer-level PII in a public Power BI workspace.

## 9. Suggested production hardening
- Add Alembic migrations, structured logging, monitoring, rate limiting and request tracing.
- Use managed secrets, TLS, secure cookies or hardened token storage, refresh-token rotation and MFA.
- Add malware scanning, encrypted object storage, retention/deletion workflows and strict document access controls.
- Replace synthetic ML data with consented, governed, representative datasets; assess bias, calibration and explainability.
- Add lender/insurer integrations only through approved partner APIs and legal agreements.
- Add human review queues, audit trails, complaint handling and incident response.
- Conduct security, privacy, accessibility and financial compliance reviews before launch.
