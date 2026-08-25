// ========================================================
// APEXSALES DASHBOARD - CORE JAVASCRIPT & DYNAMIC DATE ENGINE
// ========================================================

// 1. SUPABASE CLIENT INITIALIZATION & CREDENTIALS
const SUPABASE_URL = "https://izzruigfgaxvkltuzwlw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6enJ1aWdmZ2F4dmtsdHV6d2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NDkwNzMsImV4cCI6MjEwMzIyNTA3M30.4ofYgGzHWgFx_uausoqE9ToNlX1wbkSKcB1rqzJovos";

let supabaseClient = null;
let isSupabaseActive = false;
let selectedReportDate = "2026-05-30";

if (typeof supabase !== 'undefined' && SUPABASE_URL) {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    isSupabaseActive = true;
  } catch (err) {
    console.warn("Supabase init error, switching to Demo Data Mode:", err);
  }
}

// 2. DYNAMIC SEED & METRICS ENGINE FOR ANY SELECTED DATE
function generateDynamicMetricsForDate(dateStr) {
  const dt = new Date(dateStr + "T00:00:00");
  const day = dt.getDate() || 30;
  const monthIdx = dt.getMonth(); // 0 = Jan, 4 = May, 5 = Jun
  const year = dt.getFullYear() || 2026;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthName = monthNames[monthIdx] || "May";
  const monthNumStr = String(monthIdx + 1).padStart(2, '0');

  // Dynamic KPI calculations based on selected date
  const today_sales = Math.max(2, (day * 7 + monthIdx * 3) % 22 + 4);
  const today_revenue = today_sales * 2350 + (day * 120);
  const mtd_sales = Math.max(15, day * 18 + (monthIdx * 25) + 30);
  const mtd_revenue = mtd_sales * 1920;
  const prev_month_same_day_sales = Math.max(1, Math.round(today_sales * 0.82));
  const prev_month_same_day_revenue = prev_month_same_day_sales * 2100;
  const prev_month_sales = Math.max(10, Math.round(mtd_sales * 0.88));
  const prev_month_revenue = prev_month_sales * 1850;

  // Dynamic Reps Leaderboard based on selected date
  const baseReps = [
    { name: 'Faizan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', weight: 1.4 },
    { name: 'Talha', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', weight: 1.2 },
    { name: 'Bhageshri', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', weight: 1.15 },
    { name: 'Nidhi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', weight: 0.95 },
    { name: 'Sanika', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', weight: 0.92 },
    { name: 'Prabhat', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', weight: 0.75 },
    { name: 'Farooq', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', weight: 0.3 }
  ];

  const sales_rep = baseReps.map((r, i) => {
    const tdy_s = Math.max(0, Math.round((today_sales / 4) * r.weight + ((day + i) % 3)));
    const tdy_r = tdy_s * 2100;
    const mtd_s = Math.max(1, Math.round((mtd_sales / 4.5) * r.weight + (day * 2) + i * 3));
    const mtd_r = mtd_s * 1850;
    return {
      sales_representative: r.name,
      avatar_url: r.avatar,
      tdy_sales: tdy_s,
      tdy_revenue: tdy_r,
      mtd_sales: mtd_s,
      mtd_revenue: mtd_r,
      target_orders: 125,
      pv_month_orders: Math.round(mtd_s * 0.75)
    };
  }).sort((a, b) => b.mtd_sales - a.mtd_sales);

  // Dynamic Daily Metrics array up to current selected day
  const daily_metrics = [];
  const daysToGenerate = Math.min(day, 31);
  for (let d = 1; d <= daysToGenerate; d += Math.max(1, Math.floor(daysToGenerate / 10))) {
    const dStr = String(d).padStart(2, '0') + '-' + monthNumStr;
    const dSales = Math.max(5, (d * 9 + day * 3) % 45 + 15);
    daily_metrics.push({
      date: dStr,
      no_of_sales: dSales,
      total_revenue: dSales * 1850
    });
  }

  // Dynamic Monthly Metrics array
  const monthly_metrics = [
    { month_label: "Nov 25", no_of_sales: 120, total_revenue: 98000 },
    { month_label: "Dec 25", no_of_sales: 240, total_revenue: 195000 },
    { month_label: "Jan 26", no_of_sales: 380, total_revenue: 310000 },
    { month_label: "Feb 26", no_of_sales: 490, total_revenue: 412000 },
    { month_label: "Mar 26", no_of_sales: 560, total_revenue: 478000 },
    { month_label: "Apr 26", no_of_sales: 690, total_revenue: 589000 },
    { month_label: `${currentMonthName} ${String(year).slice(-2)}`, no_of_sales: mtd_sales, total_revenue: mtd_revenue }
  ];

  return {
    kpi: {
      today_sales,
      today_revenue,
      mtd_sales,
      mtd_revenue,
      prev_month_same_day_sales,
      prev_month_same_day_revenue,
      prev_month_sales,
      prev_month_revenue
    },
    reps: sales_rep,
    destinations: [
      { name: "Thailand [True]", count: Math.round(mtd_sales * 0.35) },
      { name: "Thailand", count: Math.round(mtd_sales * 0.31) },
      { name: "Singapore, Malaysia", count: Math.round(mtd_sales * 0.08) },
      { name: "Vietnam", count: Math.round(mtd_sales * 0.06) },
      { name: "Singapore, Malaysia, Thailand", count: Math.round(mtd_sales * 0.04) },
      { name: "Japan", count: Math.round(mtd_sales * 0.03) },
      { name: "Singapore, Malaysia, Indonesia", count: Math.round(mtd_sales * 0.02) }
    ],
    daily: daily_metrics,
    monthly: monthly_metrics,
    wallet: [
      { id: "TX-9901", tx_date: `${day} ${currentMonthName} ${year}`, tx_type: "Commission Credit", description: "Faizan - Thailand Deal", amount: "+₹4,500.00", status: "Completed" },
      { id: "TX-9902", tx_date: `${Math.max(1, day - 2)} ${currentMonthName} ${year}`, tx_type: "Payout Withdrawal", description: "Bank Transfer to HDFC ****4921", amount: "-₹25,000.00", status: "Completed" },
      { id: "TX-9903", tx_date: `${Math.max(1, day - 5)} ${currentMonthName} ${year}`, tx_type: "Commission Credit", description: "Talha - Singapore Tour", amount: "+₹3,200.00", status: "Completed" },
      { id: "TX-9904", tx_date: `${Math.max(1, day - 8)} ${currentMonthName} ${year}`, tx_type: "Incentive Bonus", description: "Top Weekly Rep Reward", amount: "+₹10,000.00", status: "Completed" },
      { id: "TX-9905", tx_date: `${Math.max(1, day - 10)} ${currentMonthName} ${year}`, tx_type: "Payout Withdrawal", description: "Bank Transfer to ICICI ****1102", amount: "-₹50,000.00", status: "Processing" }
    ]
  };
}

// Global state
let currentRepsData = [];

// 3. APPLICATION INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  
  // Attach change listener to Date Picker
  const datePicker = document.getElementById("report-date-picker");
  if (datePicker) {
    selectedReportDate = datePicker.value || "2026-05-30";
    datePicker.addEventListener("change", (e) => onDateChange(e.target.value));
  }

  updateSupabaseStatusBadge();
  loadAllDashboardData(selectedReportDate);
});

// Update Status Badge
function updateSupabaseStatusBadge() {
  const badge = document.getElementById("supabase-status-badge");
  const text = document.getElementById("supabase-status-text");
  if (badge && text) {
    if (isSupabaseActive) {
      text.textContent = "Supabase Live";
      badge.className = "hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    } else {
      text.textContent = "Demo DB Mode";
      badge.className = "hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  }
}

// Handler for Date Picker Change
function onDateChange(newDate) {
  if (!newDate) return;
  selectedReportDate = newDate;
  loadAllDashboardData(selectedReportDate);
}

// 4. LOAD DATA FROM SUPABASE RPC get_sales_dashboard(report_date) WITH DYNAMIC FALLBACK
async function loadAllDashboardData(reportDate) {
  const dynamicFallback = generateDynamicMetricsForDate(reportDate);
  
  let kpis = dynamicFallback.kpi;
  let reps = dynamicFallback.reps;
  let dests = dynamicFallback.destinations;
  let daily = dynamicFallback.daily;
  let monthly = dynamicFallback.monthly;
  let wallet = dynamicFallback.wallet;

  if (isSupabaseActive) {
    try {
      // Execute PL/pgSQL RPC Function get_sales_dashboard(report_date)
      const { data, error } = await supabaseClient.rpc('get_sales_dashboard', { report_date: reportDate });

      if (data && data.length > 0) {
        const row = data[0];
        if (row.kpi_metrics && row.kpi_metrics.length > 0 && row.kpi_metrics[0].today_sales !== undefined) {
          kpis = row.kpi_metrics[0];
        }
        if (row.sales_rep && row.sales_rep.length > 0) {
          reps = row.sales_rep;
        }
        if (row.daily_metrics && row.daily_metrics.length > 0) {
          daily = row.daily_metrics;
        }
        if (row.monthly_metrics && row.monthly_metrics.length > 0) {
          monthly = row.monthly_metrics;
        }
      }
    } catch (err) {
      console.warn("RPC get_sales_dashboard error, using dynamic generator:", err);
    }
  }

  currentRepsData = reps;

  // Render metrics and views
  renderKpis(kpis);
  renderLeaderboard(reps);
  renderDestinations(dests);
  renderWalletTable(wallet);
  initCharts(daily, monthly);
}

// 5. RENDER KPI CARDS
function renderKpis(kpi) {
  const todayRevK = ((kpi.today_revenue || 0) / 1000).toFixed(2);
  const mtdRevK = ((kpi.mtd_revenue || 0) / 1000).toFixed(2);
  const prevSameRevK = ((kpi.prev_month_same_day_revenue || 0) / 1000).toFixed(2);
  const prevFullRevK = ((kpi.prev_month_revenue || 0) / 1000).toFixed(2);

  document.getElementById("kpi-today-orders").textContent = kpi.today_sales !== undefined ? kpi.today_sales : 12;
  document.getElementById("kpi-today-rev").textContent = `₹${todayRevK}K Revenue`;

  document.getElementById("kpi-mtd-orders").textContent = kpi.mtd_sales !== undefined ? kpi.mtd_sales : 658;
  document.getElementById("kpi-mtd-rev").textContent = `₹${mtdRevK}K Revenue`;

  document.getElementById("kpi-prevsame-orders").textContent = kpi.prev_month_same_day_sales !== undefined ? kpi.prev_month_same_day_sales : 536;
  document.getElementById("kpi-prevsame-rev").textContent = `₹${prevSameRevK}K Revenue`;

  document.getElementById("kpi-prevfull-orders").textContent = kpi.prev_month_sales !== undefined ? kpi.prev_month_sales : 964;
  document.getElementById("kpi-prevfull-rev").textContent = `₹${prevFullRevK}K Revenue`;
}

// 6. RENDER DAILY LEADERBOARD TABLE
function renderLeaderboard(reps) {
  const tbody = document.getElementById("leaderboard-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  reps.forEach((rep, index) => {
    const rank = index + 1;
    const repName = rep.sales_representative || rep.name || 'Sales Rep';
    const avatar = rep.avatar_url || rep.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150`;
    const mtdSales = rep.mtd_sales || rep.mtd_orders || 0;
    const mtdRevenue = rep.mtd_revenue || rep.mtd_rev || 0;
    const tdySales = rep.tdy_sales || rep.day_orders || 0;
    const tdyRevenue = rep.tdy_revenue || rep.day_revenue || 0;
    const targetVal = rep.target_orders || 125;
    const targetPct = Math.round((mtdSales / targetVal) * 100);
    const arpuVal = mtdSales > 0 ? Math.round(mtdRevenue / mtdSales) : 850;

    const dayRevK = (tdyRevenue / 1000).toFixed(1);
    const mtdRevK = (mtdRevenue / 1000).toFixed(1);

    // Progress bar color selection
    let barColor = "bg-indigo-500";
    if (targetPct >= 100) barColor = "bg-[#10b981]";
    else if (targetPct >= 75) barColor = "bg-cyan-400";
    else if (targetPct < 20) barColor = "bg-amber-500";

    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-800/40 transition-colors";

    tr.innerHTML = `
      <td class="py-3 px-3 font-semibold text-slate-400">${rank}</td>
      <td class="py-3 px-3">
        <div class="flex items-center space-x-2.5">
          <img src="${avatar}" alt="${repName}" class="w-7 h-7 rounded-full object-cover border border-slate-700" />
          <span class="font-bold text-slate-100">${repName}</span>
        </div>
      </td>
      <td class="py-3 px-3">
        <div class="font-bold text-slate-100">${tdySales}</div>
        <div class="text-[10px] text-slate-400">₹${dayRevK}K</div>
      </td>
      <td class="py-3 px-3 font-bold text-slate-100">${mtdSales}</td>
      <td class="py-3 px-3 font-semibold text-emerald-400">₹${mtdRevK}K</td>
      <td class="py-3 px-3 text-slate-300">₹${arpuVal}</td>
      <td class="py-3 px-3">
        <div class="flex items-center space-x-2">
          <span class="font-bold text-slate-200 text-[11px] w-8">${targetPct}%</span>
          <div class="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="${barColor} h-full rounded-full" style="width: ${Math.min(targetPct, 100)}%"></div>
          </div>
          <span class="text-[10px] text-slate-400">${targetVal}</span>
        </div>
      </td>
      <td class="py-3 px-3 text-right font-semibold text-slate-400">${rep.pv_month_orders || Math.round(mtdSales * 0.75)}</td>
    `;

    tbody.appendChild(tr);
  });
}

// 7. FILTER LEADERBOARD REPS
function filterLeaderboard() {
  const query = document.getElementById("search-rep-input").value.toLowerCase();
  const filtered = currentRepsData.filter(rep => {
    const name = rep.sales_representative || rep.name || '';
    return name.toLowerCase().includes(query);
  });
  renderLeaderboard(filtered);
}

// 8. RENDER TOP DESTINATIONS
function renderDestinations(dests) {
  const container = document.getElementById("destinations-list");
  if (!container) return;

  container.innerHTML = "";
  const maxCount = Math.max(...dests.map(d => d.count), 1);

  dests.forEach(d => {
    const pct = Math.round((d.count / maxCount) * 100);
    const item = document.createElement("div");
    item.className = "bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between";

    item.innerHTML = `
      <div class="flex-1 pr-3">
        <div class="flex items-center justify-between text-xs font-semibold text-slate-200 mb-1">
          <span class="truncate max-w-[180px]">${d.name}</span>
          <span class="text-slate-400 font-bold ml-2">${d.count}</span>
        </div>
        <div class="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style="width: ${pct}%"></div>
        </div>
      </div>
      <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
        ${d.count}
      </div>
    `;

    container.appendChild(item);
  });
}

// 9. RENDER WALLET TRANSACTIONS TABLE
function renderWalletTable(transactions) {
  const tbody = document.getElementById("wallet-tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  transactions.forEach(tx => {
    const isCompleted = tx.status === "Completed";
    const statusClass = isCompleted 
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-amber-500/10 text-amber-400 border-amber-500/20";
    
    const amountClass = tx.amount.startsWith("+") ? "text-emerald-400" : "text-slate-200";

    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-800/40 transition-colors";

    tr.innerHTML = `
      <td class="py-3 px-3 font-mono text-slate-400">${tx.id}</td>
      <td class="py-3 px-3 text-slate-300">${tx.tx_date}</td>
      <td class="py-3 px-3 font-semibold text-indigo-400">${tx.tx_type}</td>
      <td class="py-3 px-3 text-slate-200">${tx.description}</td>
      <td class="py-3 px-3 font-bold ${amountClass}">${tx.amount}</td>
      <td class="py-3 px-3 text-right">
        <span class="text-[10px] px-2.5 py-1 rounded-full font-semibold border ${statusClass}">
          ${tx.status}
        </span>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// 10. INITIALIZE CHART.JS GRAPHS
let dailyChart = null;
let monthlyChart = null;

function initCharts(dailyData, monthlyData) {
  const ctxDaily = document.getElementById('chart-daily');
  const ctxMonthly = document.getElementById('chart-monthly');

  if (ctxDaily && typeof Chart !== 'undefined') {
    if (dailyChart) dailyChart.destroy();

    dailyChart = new Chart(ctxDaily, {
      type: 'line',
      data: {
        labels: dailyData.map(d => d.date || d.order_date),
        datasets: [{
          label: 'Daily Sales',
          data: dailyData.map(d => d.no_of_sales !== undefined ? d.no_of_sales : d.orders),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#06b6d4',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  if (ctxMonthly && typeof Chart !== 'undefined') {
    if (monthlyChart) monthlyChart.destroy();

    monthlyChart = new Chart(ctxMonthly, {
      type: 'line',
      data: {
        labels: monthlyData.map(m => m.month_label || m.month),
        datasets: [{
          label: 'Monthly Sales',
          data: monthlyData.map(m => m.no_of_sales !== undefined ? m.no_of_sales : m.orders),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderWidth: 2.5,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#34d399',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }
}

// 11. TAB SWITCHING LOGIC
function switchTab(tabName) {
  const dashboardView = document.getElementById("view-dashboard");
  const walletView = document.getElementById("view-wallet");
  const btnDashboard = document.getElementById("tab-dashboard");
  const btnWallet = document.getElementById("tab-wallet");

  if (tabName === 'dashboard') {
    dashboardView.classList.remove("hidden");
    walletView.classList.add("hidden");
    btnDashboard.classList.add("active");
    btnWallet.classList.remove("active");
  } else {
    dashboardView.classList.add("hidden");
    walletView.classList.remove("hidden");
    btnWallet.classList.add("active");
    btnDashboard.classList.remove("active");
  }
}

// 12. DOWNLOAD CSV EXPORT FUNCTION
function downloadCSV() {
  const headers = ["Rank", "Sales Rep", "Day Sales", "Day Revenue (₹)", "MTD Sales", "MTD Revenue (₹)", "ARPU (₹)", "Target (%)"];
  const rows = currentRepsData.map((rep, idx) => {
    const repName = rep.sales_representative || rep.name || '';
    const mtdS = rep.mtd_sales || 0;
    const mtdR = rep.mtd_revenue || 0;
    const tdyS = rep.tdy_sales || 0;
    const tdyR = rep.tdy_revenue || 0;
    return [
      idx + 1,
      `"${repName}"`,
      tdyS,
      tdyR,
      mtdS,
      mtdR,
      mtdS > 0 ? Math.round(mtdR / mtdS) : 0,
      Math.round((mtdS / 125) * 100) + "%"
    ];
  });

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `SalesPulse_Report_${selectedReportDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
