import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { getGHIData } from "../api/ghiApi";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  Title,
  PointElement,
  LineElement,
  BarElement,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ACCENT = { amber: "#F5A623", sky: "#38BDF8", green: "#34D399", red: "#F87171" };

const THEMES = {
  dark: {
    background: "#0B1220",
    card: "#131B2E",
    cardTo: "#182238",
    border: "#232F48",
    text: "#E8EDF5",
    muted: "#8A93A6",
    faint: "#545E75",
    gridLine: "#182238",
  },
  light: {
    background: "#F8FAFC",
    card: "#FFFFFF",
    cardTo: "#F1F5F9",
    border: "#D1D5DB",
    text: "#111827",
    muted: "#6B7280",
    faint: "#9CA3AF",
    gridLine: "#EEF1F5",
  },
};

const RANGES = [
  { key: "1d", label: "1 Day" },
  { key: "7d", label: "7 Days" },
  { key: "1m", label: "1 Month" },
  { key: "all", label: "All" },
];

const CHART_STYLES = [
  { key: "line", label: "Line" },
  { key: "bar", label: "Bar" },
  { key: "scatter", label: "Scatter" },
];

function LineChart() {
  const [darkMode, setDarkMode] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [chartStyle, setChartStyle] = useState("line");
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [visible, setVisible] = useState(true);
  const chartRef = useRef(null);

  const theme = darkMode ? THEMES.dark : THEMES.light;

  const fetchData = useCallback(() => {
    setStatus("loading");
    setErrorMsg("");
    getGHIData()
      .then((result) => {
        if (!result || result.length === 0) {
          throw new Error("No data returned from the server.");
        }
        setData(result);
        setStatus("ready");
      })
      .catch((err) => {
        setErrorMsg(
          err?.message === "Failed to fetch"
            ? "Couldn't reach the server. Check your connection or try again."
            : err?.message || "Something went wrong while loading GHI data."
        );
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (status !== "ready") return;
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, [chartStyle, timeRange, status]);

  let filteredData = data;
  if (timeRange === "1d") filteredData = data.slice(-1);
  if (timeRange === "7d") filteredData = data.slice(-7);
  if (timeRange === "1m") filteredData = data.slice(-30);
  if (timeRange === "all") filteredData = data;

  const labels = filteredData.map((item) => item.Date);
  const values = filteredData.map((item) => item.GHI);
  const maxGHI = values.length ? Math.max(...values) : 0;
  const minGHI = values.length ? Math.min(...values) : 0;
  const avgGHI = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  const underlyingType = chartStyle === "bar" ? "bar" : "line";

  const baseDataset = { label: "GHI", data: values };

  const styleDataset =
    chartStyle === "bar"
      ? { backgroundColor: ACCENT.amber, borderRadius: 4, maxBarThickness: 28 }
      : chartStyle === "scatter"
      ? {
          showLine: false,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: ACCENT.amber,
          pointBorderColor: theme.background,
          pointBorderWidth: 1.5,
        }
      : {
          showLine: true, 
          borderColor: ACCENT.amber,
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: ACCENT.amber,
          pointHoverBorderColor: theme.background,
          pointHoverBorderWidth: 2,
          tension: 0.35,
          fill: true,
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return "rgba(245,166,35,0.2)";
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, darkMode ? "rgba(245,166,35,0.35)" : "rgba(245,166,35,0.18)");
            gradient.addColorStop(1, "rgba(245,166,35,0)");
            return gradient;
          },
        };

  const chartData = { labels, datasets: [{ ...baseDataset, ...styleDataset }] };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    animation: { duration: 350, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: theme.card,
        titleColor: theme.muted,
        bodyColor: theme.text,
        borderColor: theme.border,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: { label: (item) => `  ${item.parsed.y.toFixed(2)} kWh/m²` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { color: theme.border },
        ticks: { color: theme.faint, maxTicksLimit: 8, maxRotation: 0 },
      },
      y: {
        grid: { color: theme.gridLine },
        border: { display: false },
        ticks: { color: theme.faint },
      },
    },
  };

  return (
    <div
      className="min-h-screen p-6 font-sans transition-colors duration-200"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <div className="max-w-4xl mx-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F5A623] to-[#C9791A] flex items-center justify-center shadow-[0_0_20px_rgba(245,166,35,0.2)] shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <circle cx="12" cy="12" r="4.5" fill="#1A1206" />
                <g stroke="#1A1206" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 2v3" /><path d="M12 19v3" />
                  <path d="M4.2 4.2l2.1 2.1" /><path d="M17.7 17.7l2.1 2.1" />
                  <path d="M2 12h3" /><path d="M19 12h3" />
                  <path d="M4.2 19.8l2.1-2.1" /><path d="M17.7 6.3l2.1-2.1" />
                </g>
              </svg>
            </div>
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase" style={{ color: theme.faint }}>
                PV Doctor · Monitoring Portal
              </div>
              <h2 className="text-lg font-semibold">GHI Irradiance Tracker</h2>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 rounded-full pl-3 pr-1 py-1 border text-[11px] font-mono transition-colors duration-200"
            style={{ backgroundColor: theme.card, borderColor: theme.border, color: theme.muted }}
          >
            <span>{darkMode ? "Dark" : "Light"}</span>
            <div
              className="w-8 h-[18px] rounded-full relative border transition-colors duration-200"
              style={{ backgroundColor: theme.background, borderColor: theme.border }}
            >
              <div
                className="w-3 h-3 rounded-full absolute top-[2px] transition-all duration-200"
                style={{ backgroundColor: ACCENT.amber, left: darkMode ? "2px" : "14px" }}
              />
            </div>
          </button>
        </div>

        {/* controls row disabled while loading/error so users can't switch onto broken state */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div
            className="inline-flex rounded-xl p-1 gap-1 border"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            {RANGES.map((r) => (
              <button
                key={r.key}
                disabled={status !== "ready"}
                onClick={() => setTimeRange(r.key)}
                className="px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={
                  timeRange === r.key
                    ? { backgroundColor: ACCENT.amber, color: "#1A1206" }
                    : { color: theme.muted }
                }
              >
                {r.label}
              </button>
            ))}
          </div>

          <div
            className="inline-flex rounded-xl p-1 gap-1 border"
            style={{ backgroundColor: theme.card, borderColor: theme.border }}
          >
            {CHART_STYLES.map((s) => (
              <button
                key={s.key}
                disabled={status !== "ready"}
                onClick={() => setChartStyle(s.key)}
                className="px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={
                  chartStyle === s.key
                    ? { backgroundColor: ACCENT.sky, color: "#04202E" }
                    : { color: theme.muted }
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* stat cards only rendered once data is actually ready */}
        {status === "ready" && (
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 transition-opacity duration-200"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {[
              { label: "Maximum", value: maxGHI, accent: ACCENT.amber },
              { label: "Minimum", value: minGHI, accent: ACCENT.sky },
              { label: "Average", value: avgGHI, accent: ACCENT.green },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-4 border border-t-2"
                style={{ backgroundColor: theme.card, borderColor: theme.border, borderTopColor: stat.accent }}
              >
                <h3 className="text-[10.5px] font-mono tracking-widest uppercase mb-2" style={{ color: theme.faint }}>
                  {stat.label}
                </h3>
                <p className="text-2xl font-mono font-semibold">
                  {stat.value.toFixed(2)}
                  <span className="text-sm font-sans ml-1" style={{ color: theme.muted }}>kWh/m²</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* chart panel */}
        <div
          className="rounded-2xl p-5 pb-4 border"
          style={{
            background: `linear-gradient(180deg, ${theme.card} 0%, ${theme.cardTo} 100%)`,
            borderColor: theme.border,
          }}
        >
          <div className="flex justify-between items-baseline mb-4 flex-wrap gap-2">
            <span className="text-sm font-semibold">Global Horizontal Irradiance</span>
            <span className="text-[11px] font-mono" style={{ color: theme.faint }}>DAILY TOTAL</span>
          </div>

          <div className="h-[320px] relative flex items-center justify-center">

            {/* loading spinner */}
            {status === "loading" && (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full animate-spin"
                  style={{
                    border: `3px solid ${theme.border}`,
                    borderTopColor: ACCENT.amber,
                  }}
                />
                <span className="text-[12px] font-mono" style={{ color: theme.faint }}>
                  Loading GHI data…
                </span>
              </div>
            )}

            {/* error state */}
            {status === "error" && (
              <div className="flex flex-col items-center gap-3 text-center px-6">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: "rgba(248,113,113,0.12)", color: ACCENT.red }}
                >
                  !
                </div>
                <span className="text-sm font-medium" style={{ color: theme.text }}>
                  Couldn't load GHI data
                </span>
                <span className="text-[12px] font-mono max-w-xs" style={{ color: theme.faint }}>
                  {errorMsg}
                </span>
                <button
                  onClick={fetchData}
                  className="mt-1 px-4 py-1.5 rounded-lg text-[12px] font-mono font-medium transition-colors duration-200"
                  style={{ backgroundColor: ACCENT.amber, color: "#1A1206" }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* chart faded in/out on range or style switch */}
            {status === "ready" && (
              <div
                className="w-full h-full transition-opacity duration-200"
                style={{ opacity: visible ? 1 : 0 }}
              >
                <Chart ref={chartRef} type={underlyingType} data={chartData} options={options} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default LineChart;
