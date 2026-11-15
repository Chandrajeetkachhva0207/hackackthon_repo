# API examples

All endpoints except `/`, `/health`, `/api/auth/register`, and `/api/auth/login` require:
`Authorization: Bearer <access_token>`

## Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"DemoPass123"}'
```

## Chat
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"module":"lending","message":"Explain the demo loan process"}'
```

## Lending eligibility insight
```bash
curl -X POST http://localhost:8000/api/loans/eligibility \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"loan_type":"personal","requested_amount":150000,"monthly_income":30000,"employment_type":"salaried"}'
```

## Add fintech transaction
```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"description":"Grocery store","amount":1250,"transaction_type":"expense"}'
```
