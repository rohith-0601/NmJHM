// src/components/GaussLeg.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// -----------------------------------------------------------
// Utility pretty printer (inline arrays)
// -----------------------------------------------------------
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

const InlineArray = ({ arr }) => {
  if (!arr) return <PrettyPre>None</PrettyPre>;
  if (!Array.isArray(arr)) return <PrettyPre>{String(arr)}</PrettyPre>;
  return (
    <PrettyPre>
      [{arr.map((x) => (Number.isFinite(x) ? Number(x).toFixed(6) : String(x))).join(", ")}]
    </PrettyPre>
  );
};

const MatrixTable = ({ title, mat }) => (
  <div className="mb-4">
    <span className="section-label">{title}</span>
    <div className="matrix-container">
      <div className="table-responsive">
        <table className="table table-sm table-bordered mb-0" style={{ 
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "white"
        }}>
          <tbody>
            {Array.isArray(mat) &&
              mat.map((row, i) => (
                <tr key={i} style={{ 
                  borderBottom: i < mat.length - 1 ? "1px solid #e3e8ef" : "none"
                }}>
                  {row.map((v, j) => (
                    <td
                      key={j}
                      style={{
                        minWidth: 80,
                        textAlign: "right",
                        fontFamily: "'Fira Code', 'Consolas', monospace",
                        padding: "8px 12px",
                        fontSize: "0.8rem",
                        backgroundColor: (i + j) % 2 === 0 ? "#fafbfc" : "white",
                        color: "#374151",
                        fontWeight: "500",
                      }}
                    >
                      {Number.isFinite(v) ? v.toFixed(5) : String(v)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const GaussLeg = () => {
  const [n, setN] = useState(4);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState(null);

  const runPipeline = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setError(null);
    setResp(null);
    try {
      const res = await fetch("http://localhost:5001/gauss_legendre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: Number(n) }),
      });
      const data = await res.json();
      if (data.status === "success") setResp(data);
      else setError(data.message || "Server error");
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Chart data with modern styling
  const chartData = resp
    ? {
        labels: resp.roots_gw.map((x) => x.toFixed(4)),
        datasets: [
          {
            label: "Golub–Welsch Weights",
            data: resp.weights_gw,
            borderColor: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#667eea",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            fill: true,
          },
          {
            label: "Lagrange Weights",
            data: resp.weights_lag,
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            tension: 0.4,
            pointStyle: "triangle",
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#f59e0b",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            fill: true,
          },
        ],
      }
    : null;

  const chartOptions = {
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
          text: "Roots (ξ)",
          color: "#6b7280",
          font: {
            size: 13,
            weight: "600",
          },
        },
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        title: { 
          display: true, 
          text: "Weights (w)",
          color: "#6b7280",
          font: {
            size: 13,
            weight: "600",
          },
        },
        grid: {
          color: "#e5e7eb",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const customStyles = `
    .gauss-bg {
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
    
    .btn-analyze {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 12px;
      transition: all 0.3s ease;
      font-size: 1rem;
    }
    
    .btn-analyze:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      color: white;
    }
    
    .btn-analyze:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .info-box {
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
      border-radius: 16px;
      padding: 20px;
      border: 2px solid #93c5fd;
      margin-top: 24px;
    }
    
    .info-box p {
      color: #1e40af;
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 0.95rem;
    }
    
    .info-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .info-list li {
      background: white;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 8px;
      color: #374151;
      font-weight: 500;
      font-size: 0.9rem;
      border-left: 4px solid #667eea;
      transition: all 0.3s ease;
    }
    
    .info-list li:hover {
      transform: translateX(5px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
    
    .matrix-container {
      background: #f8f9fb;
      border-radius: 12px;
      padding: 20px;
      border: 2px solid #e3e8ef;
    }
    
    .chart-container {
      background: white;
      border-radius: 16px;
      padding: 28px;
      border: 2px solid #e3e8ef;
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    }
    
    .chart-title {
      color: #1f2937;
      font-weight: 700;
      font-size: 1.2rem;
      margin-bottom: 20px;
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
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="gauss-bg">
        <div className="container py-5">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">
              📊 Gauss–Legendre Quadrature
            </h1>
            <p className="page-subtitle">
              Numerical integration with collocation methods and derivative matrices
            </p>
          </div>

          {/* Input Form */}
          <div className="row mb-5">
            <div className="col-lg-8 offset-lg-2">
              <div className="input-card">
                <form onSubmit={runPipeline}>
                  <div className="row align-items-end g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold text-secondary small mb-2">
                        QUADRATURE ORDER (n)
                      </label>
                      <input
                        type="number"
                        className="form-control input-soft"
                        value={n}
                        min={2}
                        max={64}
                        onChange={(e) => setN(e.target.value)}
                        placeholder="Enter order (2-64)"
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-analyze w-100"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Running...
                          </>
                        ) : (
                          <>
                            ⚡ Run Analysis
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
                      Computing Gauss-Legendre nodes and weights...
                    </p>
                  </div>
                )}

                {!resp && !loading && (
                  <div className="info-box">
                    <p>📋 This pipeline performs:</p>
                    <ul className="info-list">
                      <li>
                        <strong>A.</strong> Modified Legendre polynomial coefficients
                      </li>
                      <li>
                        <strong>B.</strong> Golub–Welsch and Lagrange nodes & weights
                      </li>
                      <li>
                        <strong>C.</strong> Collocation derivative matrices A₁ and B
                      </li>
                      <li>
                        <strong>D.</strong> Visualization of weights vs roots comparison
                      </li>
                    </ul>
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
                    <h5>✅ Analysis Complete for Order n = {resp.n}</h5>
                  </div>

                  {/* Coefficients */}
                  <span className="section-label">
                    Polynomial Coefficients (Highest → Lowest Degree)
                  </span>
                  <InlineArray arr={resp.coeffs} />

                  {/* Golub-Welsch */}
                  <span className="section-label mt-4">
                    Roots and Weights (Golub–Welsch Method)
                  </span>
                  <PrettyPre>
                    {resp.roots_gw
                      .map(
                        (r, i) =>
                          `Root[${i + 1}] = ${r.toFixed(6)},  Weight = ${resp.weights_gw[
                            i
                          ].toFixed(6)}`
                      )
                      .join("\n")}
                  </PrettyPre>

                  {/* Lagrange */}
                  <span className="section-label mt-4">
                    Weights (Lagrange Integration Method)
                  </span>
                  <PrettyPre>
                    {resp.weights_lag
                      .map(
                        (w, i) =>
                          `Root[${i + 1}] = ${resp.roots_gw[i].toFixed(
                            6
                          )},  Weight = ${w.toFixed(6)}`
                      )
                      .join("\n")}
                  </PrettyPre>

                  {/* Matrices */}
                  <MatrixTable title="Collocation Matrix A₁ (First Derivative y')" mat={resp.A1} />
                  <MatrixTable title="Collocation Matrix B (Second Derivative y'')" mat={resp.B} />

                  {/* Nodes */}
                  <span className="section-label mt-4">Collocation Points (x-nodes)</span>
                  <InlineArray arr={resp.x_nodes} />

                  {/* Chart */}
                  <div className="chart-container mt-5">
                    <h5 className="chart-title">
                      <span>📈</span>
                      Weights vs Roots Comparison
                    </h5>
                    <div style={{ height: "450px" }}>
                      <Line
                        key={JSON.stringify(resp.roots_gw)}
                        data={chartData}
                        options={chartOptions}
                      />
                    </div>
                  </div>

                  {/* Logs */}
                  <div className="mt-5">
                    <span className="section-label">Computation Logs</span>
                    <PrettyPre>{resp.logs.join("\n")}</PrettyPre>
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

export default GaussLeg;
