# Power BI connection guide

1. Start the API and create a demo account.
2. In Power BI Desktop, select **Get Data → Web**.
3. Connect to the authenticated analytics endpoints. For a quick local demo, use Power Query's Web.Contents with an Authorization header; do not embed a personal long-lived JWT in a shared PBIX file.
4. Recommended report pages:
   - Executive summary: transaction count, income, expenses, balance, application count.
   - Spending analysis: expense by category, income vs expenses, monthly trend.
   - Lending funnel: applications by status, requested amount distribution.
5. Use only synthetic/anonymized data. For production, create a dedicated read-only analytics endpoint/service identity and row-level security.

Example Power Query (replace token locally; do not publish the token):
```powerquery
let
    Token = "YOUR_SHORT_LIVED_ACCESS_TOKEN",
    Source = Json.Document(
        Web.Contents(
            "http://localhost:8000/api/analytics/summary",
            [Headers=[Authorization="Bearer " & Token]]
        )
    )
in
    Source
```
