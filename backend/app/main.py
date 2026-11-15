from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import Base, engine
from .routers import auth, journeys, analytics, financial, transactions, ai_features

# Ensure all SQLAlchemy models and tables are synchronized
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Powered Financial Journeys API",
    version="1.0.0",
    description="Enterprise Fintech Platform unifying Insurance, Lending, and Cashflow Management with Machine Learning."
)

origins = list(set([x.strip() for x in settings.cors_origins.split(",") if x.strip()] + [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Core Routers
app.include_router(auth.router)
app.include_router(journeys.router)
app.include_router(analytics.router)
app.include_router(financial.router)
app.include_router(transactions.router)
app.include_router(ai_features.router)

@app.get("/")
def root():
    return {
        "message": "AI-Powered Financial Journeys API is running",
        "docs": "/docs",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "platform": "FinJourney AI Enterprise MVP",
        "ml_engine": "scikit-learn active",
        "ocr_engine": "ready"
    }
