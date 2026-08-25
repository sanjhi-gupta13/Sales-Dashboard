# 📊 SalesPulse Analytics | SkillCred Sales Dashboard

A modern, high-performance **Sales & Performance Analytics Dashboard** built for the college project submission (*SkillCred*). It features a dark obsidian glassmorphism UI, real-time KPI metrics, dynamic date filtering, Supabase PL/pgSQL RPC database integration, Postman REST API collection, and CSV reporting exports.

![Sales Dashboard](https://img.shields.io/badge/Status-Active-emerald?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20Supabase%20%7C%20Chart.js-indigo?style=for-the-badge)

---

## 🔥 Key Features

- ** Sleek Dark Obsidian Glassmorphism UI**: Custom UI design (*SalesPulse Analytics*) featuring dark glass cards, glowing status pills, and responsive layout.
- ** Dynamic Date Filter (`report_date`)**: Interactive header date picker allowing users to select any report date (e.g. `2026-05-30`, `2026-05-17`).
- ** Real-Time KPI Summary Grid**: 
  - **Today Performance** (Orders & Revenue)
  - **Month-to-Date (MTD)** (Orders & Revenue)
  - **Prev Month (Same Day)**
  - **Prev Month (Full)**
- **🏆 Daily Leaderboard Table**: 
  - Ranks Sales Representatives (*Faizan, Talha, Bhageshri, Nidhi, Sanika, Prabhat, Farooq*).
  - Displays Today Sales, MTD Sales, MTD Revenue, ARPU (Average Revenue per User), Target achievement progress bar, and Previous Month comparisons.
  - Live search filter for sales representatives.
- ** Top Destinations Ranking**: Ranked travel package metrics with visual progress bars.
- **📈 Dual Interactive Line Charts**: Powered by Chart.js for Daily Summary order velocity and Monthly Summary growth trends.
- ** Wallet Summary & Transactions**: Account balance overview (₹2,45,800.00), pending payouts, and transaction history.
- **📥 One-Click CSV Export**: Download sales performance reports directly to a `.csv` file.

---

## 🛠️ Project Structure

```text
Sales-Dashboard/
├── index.html                                 # Main single-page HTML application
├── style.css                                  # Custom glassmorphism stylesheet & animations
├── app.js                                     # Core JS logic & Supabase RPC integration
├── supabase_schema.sql                        # PostgreSQL DDL script & PL/pgSQL function
├── SkillCred_Sales_Dashboard.postman_collection.json # Postman REST & RPC API collection
├── .env.example                               # Environment template file
└── .gitignore                                 # Git ignore rules
```

---

## 🗄️ Supabase Database & RPC Setup

The backend uses a PostgreSQL stored function `get_sales_dashboard(report_date date)` in Supabase.

### How to Apply the Schema in Supabase:
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) under your **Sales dashboard** organization.
2. Go to **SQL Editor** -> **New Query**.
3. Copy and paste the contents of [`supabase_schema.sql`](./supabase_schema.sql).
4. Click **Run**.

### What `supabase_schema.sql` creates:
- **Schema**: `sales_dashboard`
- **Tables**: `sales_dashboard.users`, `sales_dashboard.orders`
- **Stored Procedure**: `public.get_sales_dashboard(report_date date)` returning JSON arrays for:
  - `daily_metrics`
  - `monthly_metrics`
  - `kpi_metrics`
  - `sales_rep`

---

## 🚀 How to Run Locally

### Option 1: Open Directly in Browser
Simply open [`index.html`](./index.html) in Chrome, Edge, or Firefox!

### Option 2: Run via Local HTTP Server
```bash
# Using npx serve
npx serve -l 5050

# Or using Python HTTP server
python -m http.server 5050
```
Then navigate to `http://localhost:5050` in your web browser.

---

## 📮 Postman API Collection

A pre-configured Postman v2.1 collection file ([`SkillCred_Sales_Dashboard.postman_collection.json`](./SkillCred_Sales_Dashboard.postman_collection.json)) is included in this repository.

### Included Endpoints:
- `POST /rest/v1/rpc/get_sales_dashboard` (Body: `{"report_date": "2026-05-30"}`)
- `GET /rest/v1/orders`
- `GET /rest/v1/users`

---

## 💻 Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Glassmorphism), JavaScript (ES6+)
- **Icons & Visuals**: Lucide Icons, Chart.js
- **Database / Backend**: Supabase (PostgreSQL, Row Level Security, PL/pgSQL Stored Procedures)
- **API Testing**: Postman v2.1 Collection
