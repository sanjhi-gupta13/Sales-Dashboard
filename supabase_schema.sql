-- ========================================================
-- SKILLCRED SALES DASHBOARD - SUPABASE SQL SCHEMA & RPC FUNCTION
-- Copy and paste this entire script into your Supabase SQL Editor
-- (Organization: Sales dashboard | Project: izzruigfgaxvkltuzwlw)
-- ========================================================

-- 1. Create Schema
CREATE SCHEMA IF NOT EXISTS sales_dashboard;

-- 2. Drop existing objects if re-running
DROP FUNCTION IF EXISTS public.get_sales_dashboard(date);
DROP FUNCTION IF EXISTS sales_dashboard.get_sales_dashboard(date);

-- 3. Create Users Table in sales_dashboard schema
CREATE TABLE IF NOT EXISTS sales_dashboard.users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Orders Table in sales_dashboard schema
CREATE TABLE IF NOT EXISTS sales_dashboard.orders (
    order_id SERIAL PRIMARY KEY,
    created_by INT REFERENCES sales_dashboard.users(user_id),
    order_date_time TIMESTAMP NOT NULL,
    amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    destination VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Seed Users Data
TRUNCATE TABLE sales_dashboard.orders CASCADE;
TRUNCATE TABLE sales_dashboard.users CASCADE;

INSERT INTO sales_dashboard.users (user_id, name, avatar_url) VALUES
(1, 'Faizan', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 'Talha', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(3, 'Bhageshri', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
(4, 'Nidhi', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
(5, 'Sanika', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'),
(6, 'Prabhat', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
(7, 'Farooq', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150');

-- 6. Seed Orders Data (Reps sales around 2026-05-30 and 2026-06-18)
INSERT INTO sales_dashboard.orders (created_by, order_date_time, amount, discount_amount, destination) VALUES
-- Faizan orders (May 2026)
(1, '2026-05-30 10:30:00', 3200, 200, 'Thailand'),
(1, '2026-05-30 14:15:00', 4500, 300, 'Thailand [True]'),
(1, '2026-05-30 16:45:00', 2500, 200, 'Singapore, Malaysia'),
(1, '2026-05-28 11:20:00', 5000, 500, 'Japan'),
(1, '2026-05-25 09:10:00', 3800, 300, 'Vietnam'),
(1, '2026-05-15 15:30:00', 6000, 600, 'Thailand'),
(1, '2026-04-20 12:00:00', 4000, 400, 'Thailand'),

-- Talha orders
(2, '2026-05-30 11:00:00', 2800, 200, 'Singapore, Malaysia'),
(2, '2026-05-30 15:30:00', 3500, 300, 'Vietnam'),
(2, '2026-05-27 14:00:00', 4200, 400, 'Thailand'),
(2, '2026-05-18 10:45:00', 5500, 500, 'Japan'),
(2, '2026-04-18 16:20:00', 3100, 200, 'Thailand'),

-- Bhageshri orders
(3, '2026-05-30 09:45:00', 1500, 100, 'Thailand [True]'),
(3, '2026-05-30 13:10:00', 2200, 200, 'Singapore, Malaysia, Thailand'),
(3, '2026-05-22 16:00:00', 3900, 300, 'Thailand'),
(3, '2026-05-10 11:30:00', 4800, 400, 'Japan'),
(3, '2026-04-25 14:15:00', 2900, 200, 'Vietnam'),

-- Nidhi orders
(4, '2026-05-30 12:30:00', 2600, 200, 'Vietnam'),
(4, '2026-05-30 17:00:00', 3100, 300, 'Thailand'),
(4, '2026-05-24 15:45:00', 4100, 400, 'Singapore, Malaysia'),
(4, '2026-05-12 10:15:00', 3600, 300, 'Thailand [True]'),
(4, '2026-04-15 11:00:00', 2700, 200, 'Japan'),

-- Sanika orders
(5, '2026-05-30 14:20:00', 3300, 300, 'Thailand'),
(5, '2026-05-30 18:00:00', 3700, 300, 'Singapore, Malaysia, Indonesia'),
(5, '2026-05-26 11:15:00', 4500, 400, 'Japan'),
(5, '2026-05-14 13:40:00', 2900, 200, 'Vietnam'),
(5, '2026-04-22 09:30:00', 3400, 300, 'Thailand'),

-- Prabhat orders
(6, '2026-05-30 16:10:00', 1800, 100, 'Thailand'),
(6, '2026-05-29 10:00:00', 2500, 200, 'Singapore, Malaysia'),
(6, '2026-05-19 14:50:00', 3200, 300, 'Vietnam'),
(6, '2026-04-28 15:20:00', 4100, 400, 'Japan'),

-- Farooq orders
(7, '2026-05-30 15:00:00', 1200, 100, 'Thailand'),
(7, '2026-05-21 11:30:00', 2100, 200, 'Vietnam');

-- 7. Create stored function get_sales_dashboard
CREATE OR REPLACE FUNCTION public.get_sales_dashboard(report_date date)
RETURNS TABLE(
  daily_metrics json,
  monthly_metrics json,
  kpi_metrics json,
  sales_rep json
)
LANGUAGE plpgsql
AS $$
BEGIN 
RETURN QUERY

  WITH base AS (
    SELECT 
      u.name AS sales_representative,
      u.avatar_url,
      o.order_date_time::date AS order_date,
      (o.amount - o.discount_amount) AS revenue
    FROM sales_dashboard.orders o 
    JOIN sales_dashboard.users u ON o.created_by = u.user_id
    WHERE o.order_date_time::date BETWEEN
      DATE_TRUNC('month', report_date - INTERVAL '1 month')
      AND report_date
  ),
  daily_summary AS (
    SELECT 
      TO_CHAR(order_date, 'DD-MM') AS date,
      COUNT(*)::int AS no_of_sales,
      SUM(revenue)::numeric AS total_revenue
    FROM base
    WHERE order_date >= DATE_TRUNC('month', report_date)
    GROUP BY order_date
    ORDER BY order_date ASC
  ),
  month_summary AS (
    SELECT 
      EXTRACT(year FROM order_date_time::date)::int AS year,
      EXTRACT(month FROM order_date_time::date)::int AS month,
      TO_CHAR(order_date_time::date, 'Mon YY') AS month_label,
      COUNT(*)::int AS no_of_sales,
      SUM(amount - discount_amount)::numeric AS total_revenue
    FROM sales_dashboard.orders
    GROUP BY 1, 2, 3
    ORDER BY 1 ASC, 2 ASC
  ),
  kpi_metrics AS (
    SELECT
      -- today matrix summary
      COALESCE(COUNT(*) FILTER (WHERE order_date = report_date), 0)::int AS today_sales,
      COALESCE(SUM(revenue) FILTER (WHERE order_date = report_date), 0)::numeric AS today_revenue,

      -- mtd matrix
      COALESCE(COUNT(*) FILTER (WHERE order_date >= DATE_TRUNC('month', report_date)), 0)::int AS mtd_sales,
      COALESCE(SUM(revenue) FILTER (WHERE order_date >= DATE_TRUNC('month', report_date)), 0)::numeric AS mtd_revenue,

      -- previous month matrix
      COALESCE(COUNT(*) FILTER (WHERE order_date < DATE_TRUNC('month', report_date)), 0)::int AS prev_month_sales,
      COALESCE(SUM(revenue) FILTER (WHERE order_date < DATE_TRUNC('month', report_date)), 0)::numeric AS prev_month_revenue,

      -- previous month same day
      COALESCE(COUNT(*) FILTER (WHERE order_date <= (report_date - INTERVAL '1 month')), 0)::int AS prev_month_same_day_sales,
      COALESCE(SUM(revenue) FILTER (WHERE order_date <= (report_date - INTERVAL '1 month')), 0)::numeric AS prev_month_same_day_revenue
    FROM base
  ),
  leaderboard AS (
    SELECT 
      ms.sales_representative,
      ms.avatar_url,
      ms.mtd_sales::int,
      ms.mtd_revenue::numeric,
      COALESCE(ts.tdy_sales, 0)::int AS tdy_sales,
      COALESCE(ts.tdy_revenue, 0)::numeric AS tdy_revenue
    FROM 
    (
      SELECT 
        sales_representative, 
        MAX(avatar_url) AS avatar_url,
        COUNT(*) AS mtd_sales, 
        SUM(revenue) AS mtd_revenue
      FROM base 
      WHERE order_date >= DATE_TRUNC('month', report_date)
      GROUP BY sales_representative
    ) AS ms
    LEFT JOIN 
    (
      SELECT 
        sales_representative, 
        COUNT(*) AS tdy_sales, 
        SUM(revenue) AS tdy_revenue
      FROM base 
      WHERE order_date = report_date
      GROUP BY sales_representative
    ) AS ts ON ts.sales_representative = ms.sales_representative
    ORDER BY ms.mtd_sales DESC
  )
  SELECT
    COALESCE((SELECT json_agg(to_jsonb(d)) FROM daily_summary d), '[]'::json) AS daily_metrics,
    COALESCE((SELECT json_agg(to_jsonb(m)) FROM month_summary m), '[]'::json) AS monthly_metrics,
    COALESCE((SELECT json_agg(to_jsonb(k)) FROM kpi_metrics k), '[]'::json) AS kpi_metrics,
    COALESCE((SELECT json_agg(to_jsonb(s)) FROM leaderboard s), '[]'::json) AS sales_rep;

END;
$$;

-- 8. Grant Execution Rights
GRANT USAGE ON SCHEMA sales_dashboard TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA sales_dashboard TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_sales_dashboard(date) TO anon, authenticated, service_role;
