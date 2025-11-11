// src/components/Diffeqn.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  LogarithmicScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  LogarithmicScale,
  CategoryScale,
  Tooltip,
  Legend
);

const PrettyPre = ({ children }) => (
  <pre
    style={{
      whiteSpace: "pre-wrap",
      backgroundColor: "#f8f9fb",
      border: "2px solid #e3e8ef",
      borderRadius: 12,
      padding: "16px 20px",
      fontSize: "0.9rem",
      marginBottom: 16,
      overflowX: "auto",
      fontFamily: "'Fira Code', 'Consolas', monospace",
      color: "#374151",
      lineHeight: 1.6,
    }}
  >
    {children}
  </pre>
);

const Diffeqn = () => {
  const [n, setN] = useState(32);
  const [etaMax, setEtaMax] = useState(5.0);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState(null);

  const runSolver = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResp(null);
    try {
      const res = await fetch("http://localhost:5001/diffeqn_solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: Number(n), eta_max: Number(etaMax) }),
      });
      const data = await res.json();
      if (data.status === "success") setResp(data.result);
      else setError(data.message || "Server error");
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // --- Chart 1: f_num vs f_exact ---
  const chartData1 =
    resp && {
      labels: resp.eta.map((v) => v.toFixed(3)),
      datasets: [
        {
          label: "Collocation Solution (f_num)",
          data: resp.f_num,
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#667eea",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          fill: true,
        },
        {
          label: "Analytical erf(η)",
          data: resp.f_exact,
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          borderDash: [8, 4],
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2.5,
          fill: false,
        },
      ],
    };

  // --- Chart 2: Error vs η ---
  const chartData2 =
    resp && {
      labels: resp.eta.map((v) => v.toFixed(3)),
      datasets: [
        {
          label: "Absolute Error |f_num - f_exact|",
          data: resp.error,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#10b981",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          fill: true,
        },
      ],
    };

  const chartOptions = (logY = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
            weight: "600",
            family: "'Inter', sans-serif",
          },
          color: "#374151",
        },
      },
      tooltip: {
        mode: "nearest",
        backgroundColor: "rgba(31, 41, 55, 0.95)",
        titleColor: "#fff",
        bodyColor: "#e5e7eb",
        borderColor: "#667eea",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: "600",
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "η",
          color: "#6b7280",
          font: {
            size: 14,
            weight: "600",
          },
        },
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
        },
      },
      y: {
        title: {
          display: true,
          text: logY ? "Error (log scale)" : "f(η)",
          color: "#6b7280",
          font: {
            size: 14,
            weight: "600",
          },
        },
        type: logY ? "logarithmic" : "linear",
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          callback: (val) => (logY ? val.toExponential(1) : val.toFixed(2)),
        },
      },
    },
  });

  const customStyles = `
    .diffeq-bg {
      background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
      min-height: 100vh;
    }
    
    .input-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e3e8ef;
      padding: 32px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .input-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }
    
    .input-soft {
      border: 2px solid #e3e8ef;
      border-radius: 12px;
      padding: 12px 18px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f8f9fb;
      color: #1f2937;
      font-weight: 500;
    }
    
    .input-soft:focus {
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      outline: none;
    }
    
    .btn-solve {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 12px;
      transition: all 0.3s ease;
      font-size: 1rem;
    }
    
    .btn-solve:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      color: white;
    }
    
    .btn-solve:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .equation-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-radius: 16px;
      padding: 20px 24px;
      border: 2px solid #fbbf24;
      margin-top: 24px;
    }
    
    .equation-box p {
      color: #92400e;
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 0.95rem;
    }
    
    .equation-box pre {
      background: white !important;
      color: #1f2937 !important;
      border: 2px solid #fed7aa !important;
      font-weight: 600;
      font-size: 1rem;
    }
    
    .results-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e3e8ef;
      padding: 32px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .results-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }
    
    .section-label {
      color: #6b7280;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      display: block;
    }
    
    .chart-container {
      background: white;
      border-radius: 16px;
      padding: 28px;
      border: 2px solid #e3e8ef;
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
      margin-top: 32px;
    }
    
    .chart-title {
      color: #1f2937;
      font-weight: 700;
      font-size: 1.2rem;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .alert-soft {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      border: 2px solid #fca5a5;
      border-radius: 16px;
      padding: 20px;
      color: #991b1b;
      font-weight: 500;
    }
    
    .spinner-modern {
      width: 50px;
      height: 50px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .page-header {
      text-align: center;
      padding: 40px 0;
    }
    
    .page-title {
      color: #1f2937;
      font-weight: 700;
      font-size: 2.5rem;
      margin-bottom: 12px;
    }
    
    .page-subtitle {
      color: #6b7280;
      font-size: 1.1rem;
      font-weight: 400;
    }
    
    .result-header {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 28px;
      border-left: 5px solid #10b981;
    }
    
    .result-header h5 {
      color: #065f46;
      font-weight: 700;
      margin: 0;
      font-size: 1.15rem;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 12px;
      padding: 20px;
      border: 2px solid #bae6fd;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .stat-label {
      color: #0369a1;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    
    .stat-value {
      color: #0c4a6e;
      font-size: 1.3rem;
      font-weight: 700;
      font-family: 'Fira Code', monospace;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="diffeq-bg">
        <div className="container py-5">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">
              ∂ Gauss–Legendre ODE Solver
            </h1>
            <p className="page-subtitle">
              Collocation method for differential equations with analytical comparison
            </p>
          </div>

          {/* Input Form */}
          <div className="row mb-5">
            <div className="col-lg-10 offset-lg-1">
              <div className="input-card">
                <form onSubmit={runSolver}>
                  <div className="row align-items-end g-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-secondary small mb-2">
                        COLLOCATION NODES (n)
                      </label>
                      <input
                        type="number"
                        className="form-control input-soft"
                        value={n}
                        min={4}
                        max={128}
                        onChange={(e) => setN(e.target.value)}
                        placeholder="4-128 nodes"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-secondary small mb-2">
                        DOMAIN LIMIT (η_max)
                      </label>
                      <input
                        type="number"
                        className="form-control input-soft"
                        value={etaMax}
                        step="0.1"
                        onChange={(e) => setEtaMax(e.target.value)}
                        placeholder="e.g., 5.0"
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-solve w-100"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Solving...
                          </>
                        ) : (
                          <>
                            ⚡ Run Solver
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {loading && (
                  <div className="text-center mt-4 pt-3">
                    <div className="spinner-modern mx-auto"></div>
                    <p className="mt-3 text-secondary fw-semibold">
                      Solving differential equation...
                    </p>
                  </div>
                )}

                {!resp && !loading && (
                  <div className="equation-box">
                    <p>📐 This module solves the ODE using Gauss–Legendre collocation:</p>
                    <PrettyPre>f'' + 2ηf' = 0,   with   f(0) = 0,   f(∞) = 1</PrettyPre>
                    <p className="mt-3 mb-0" style={{ fontSize: "0.85rem" }}>
                      The analytical solution is the error function: f(η) = erf(η)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="row mb-4">
              <div className="col-lg-10 offset-lg-1">
                <div className="alert-soft">
                  ❌ <strong>Error:</strong> {error}
                </div>
              </div>
            </div>
          )}

          {/* Output */}
          {resp && !loading && (
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <div className="results-card">
                  <div className="result-header">
                    <h5>✅ Solution Complete (n = {resp.n})</h5>
                  </div>

                  {/* Statistics */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-label">η_max</div>
                      <div className="stat-value">{resp.eta_max.toFixed(2)}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Max Error</div>
                      <div className="stat-value">{resp.max_error.toExponential(2)}</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Mean Error</div>
                      <div className="stat-value">{resp.mean_error.toExponential(2)}</div>
                    </div>
                  </div>

                  {/* Logs */}
                  <span className="section-label">Computation Logs</span>
                  <PrettyPre>{resp.logs.join("\n")}</PrettyPre>

                  {/* Chart 1: Numerical vs Analytical */}
                  <div className="chart-container">
                    <h5 className="chart-title">
                      <span>📈</span>
                      f(η): Numerical vs Analytical Comparison
                    </h5>
                    <div style={{ height: "450px" }}>
                      <Line
                        key={`chart1-${resp.n}-${resp.eta_max}`}
                        data={chartData1}
                        options={chartOptions(false)}
                      />
                    </div>
                  </div>

                  {/* Chart 2: Error Plot */}
                  <div className="chart-container">
                    <h5 className="chart-title">
                      <span>📉</span>
                      Absolute Error vs η (Logarithmic Scale)
                    </h5>
                    <div style={{ height: "450px" }}>
                      <Line
                        key={`chart2-${resp.n}-${resp.eta_max}`}
                        data={chartData2}
                        options={chartOptions(true)}
                      />
                    </div>
                  </div>

                  {/* Nodes */}
                  <div className="mt-4">
                    <span className="section-label">η Collocation Nodes</span>
                    <PrettyPre>
                      [{resp.eta.map((v) => v.toFixed(3)).join(", ")}]
                    </PrettyPre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Diffeqn;
