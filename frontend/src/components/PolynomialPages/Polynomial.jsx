// src/components/Polynomial.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Utility: convert polynomial string to human-readable math ---
const formatPolynomial = (expr) => {
  if (!expr) return "";
  return expr
    .replace(/\*\*3/g, "³")
    .replace(/\*\*2/g, "²")
    .replace(/\*\*1/g, "")
    .replace(/\*/g, "")
    .replace(/-/g, "−")
    .replace(/\+/g, " + ")
    .replace(/  +/g, " ")
    .trim();
};

// --- Small UI helpers ---
const PrettyPre = ({ children }) => (
  <pre
    style={{
      whiteSpace: "pre-wrap",
      fontSize: "0.9rem",
      backgroundColor: "#f8f9fb",
      border: "2px solid #e3e8ef",
      borderRadius: 12,
      padding: "16px 20px",
      marginBottom: 16,
      display: "inline-block",
      width: "100%",
      overflowX: "auto",
      fontFamily: "'Fira Code', 'Consolas', monospace",
      color: "#374151",
      lineHeight: 1.6,
    }}
  >
    {children}
  </pre>
);

// Inline array display
const InlineArray = ({ arr }) => {
  if (!arr) return <PrettyPre>None</PrettyPre>;
  if (!Array.isArray(arr)) return <PrettyPre>{String(arr)}</PrettyPre>;
  return (
    <PrettyPre>
      [
      {arr
        .map((x) =>
          Number.isFinite(x)
            ? Number(x).toFixed(6)
            : typeof x === "object"
            ? JSON.stringify(x)
            : String(x)
        )
        .join(", ")}
      ]
    </PrettyPre>
  );
};

const MatrixTable = ({ mat }) => {
  if (!Array.isArray(mat)) return <PrettyPre>{String(mat)}</PrettyPre>;
  return (
    <div
      className="table-responsive"
      style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
    >
      <table className="table table-sm table-bordered mb-0" style={{ 
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "white"
      }}>
        <tbody>
          {mat.map((row, i) => (
            <tr key={i} style={{ 
              borderBottom: i < mat.length - 1 ? "1px solid #e3e8ef" : "none"
            }}>
              {row.map((v, j) => (
                <td
                  key={j}
                  style={{
                    minWidth: 90,
                    textAlign: "right",
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    padding: "8px 12px",
                    fontSize: "0.85rem",
                    backgroundColor: (i + j) % 2 === 0 ? "#fafbfc" : "white",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  {Number.isFinite(v) ? Number(v).toFixed(6) : String(v)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AnswerCard = ({ label, title, children }) => (
  <div className="answer-card mb-4">
    <div className="answer-header">
      <span className="answer-badge">{label}</span>
      <h5 className="answer-title">{title}</h5>
    </div>
    <div className="answer-content">{children}</div>
  </div>
);

// --- Main Component ---
const Polynomial = () => {
  const [n, setN] = useState(100);
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    setError(null);
    setResp(null);
    try {
      const res = await fetch("http://localhost:5001/legendre_pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: Number(n) }),
      });
      const data = await res.json();
      if (data.status === "success") {
        const result = data.result ?? data;
        setResp(result);
      } else setError("Server returned an error response");
    } catch (err) {
      console.error(err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const customStyles = `
    .poly-bg {
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
    
    .btn-compute {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-weight: 600;
      padding: 12px 32px;
      border-radius: 12px;
      transition: all 0.3s ease;
      font-size: 1rem;
    }
    
    .btn-compute:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      color: white;
    }
    
    .answer-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e3e8ef;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .answer-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }
    
    .answer-header {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 20px 28px;
      border-bottom: 2px solid #bae6fd;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .answer-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }
    
    .answer-title {
      margin: 0;
      color: #1f2937;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .answer-content {
      padding: 28px;
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
    
    .summary-card {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-radius: 20px;
      padding: 28px;
      border: 2px solid #fbbf24;
    }
    
    .summary-card h6 {
      color: #92400e;
      font-weight: 700;
      margin-bottom: 16px;
      font-size: 1.1rem;
    }
    
    .summary-card ul {
      margin: 0;
      padding-left: 20px;
    }
    
    .summary-card li {
      color: #78350f;
      font-weight: 500;
      margin-bottom: 8px;
      line-height: 1.6;
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
    
    .matrix-container {
      background: #f8f9fb;
      border-radius: 12px;
      padding: 20px;
      border: 2px solid #e3e8ef;
    }
    
    .matrix-title {
      color: #374151;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 12px;
    }
    
    .alert-soft {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      border: 2px solid #fca5a5;
      border-radius: 16px;
      padding: 20px;
      color: #991b1b;
      font-weight: 500;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="poly-bg">
        <div className="container py-5">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">
              📐 Modified Legendre Polynomial
            </h1>
            <p className="page-subtitle">
              Explore polynomial analysis with companion matrices and eigenvalue computation
            </p>
          </div>

          {/* Input Form */}
          <div className="row mb-5">
            <div className="col-lg-8 offset-lg-2">
              <div className="input-card">
                <form onSubmit={submit}>
                  <div className="row align-items-end g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold text-secondary small mb-2">
                        LEGENDRE ORDER (n)
                      </label>
                      <input
                        type="number"
                        className="form-control input-soft"
                        value={n}
                        min={0}
                        onChange={(e) => setN(e.target.value)}
                        placeholder="Enter polynomial order"
                      />
                    </div>
                    <div className="col-md-4">
                      <button type="submit" className="btn btn-compute w-100">
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Computing...
                          </>
                        ) : (
                          <>
                            ⚡ Run Pipeline
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
                      Processing polynomial computations...
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

          {/* Results */}
          {resp && !loading && (
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                {/* A */}
                <AnswerCard
                  label="A"
                  title={`Modified (shifted) Legendre polynomial — P*₍${n}₎(x)`}
                >
                  <span className="section-label">Polynomial (Pretty Format)</span>
                  <PrettyPre>
                    {formatPolynomial(
                      resp.P_shifted_pretty ??
                        resp.P_shifted_str ??
                        resp.polynomial
                    )}
                  </PrettyPre>

                  <span className="section-label mt-4">Polynomial (One-Line Format)</span>
                  <PrettyPre>
                    {formatPolynomial(resp.P_shifted_str ?? resp.polynomial)}
                  </PrettyPre>

                  <span className="section-label mt-4">
                    Coefficients (Highest → Lowest Degree)
                  </span>
                  <InlineArray arr={resp.coeffs_high ?? resp.coeffs_high} />
                </AnswerCard>

                {/* B */}
                <AnswerCard
                  label="B"
                  title="Companion Matrix (Frobenius Form)"
                >
                  <span className="section-label">Companion Matrix (A)</span>
                  <div className="matrix-container">
                    <MatrixTable mat={resp.companion_matrix ?? resp.companion_matrix} />
                  </div>
                </AnswerCard>

                {/* C */}
                <AnswerCard
                  label="C"
                  title="Roots via Eigenvalues (LU Decomposition)"
                >
                  <span className="section-label">Eigenvalues (Polynomial Roots)</span>
                  <InlineArray arr={resp.eigenvalues ?? resp.eigenvalues} />

                  <span className="section-label mt-4">
                    LU Decomposition Matrices
                  </span>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="matrix-container">
                        <h6 className="matrix-title">Permutation Matrix (P)</h6>
                        <MatrixTable mat={resp.P_lu} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="matrix-container">
                        <h6 className="matrix-title">Lower Triangular (L)</h6>
                        <MatrixTable mat={resp.L_lu} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="matrix-container">
                        <h6 className="matrix-title">Upper Triangular (U)</h6>
                        <MatrixTable mat={resp.U_lu} />
                      </div>
                    </div>
                  </div>
                </AnswerCard>

                {/* D */}
                <AnswerCard label="D" title="Linear System Solution: A·x = b">
                  <span className="section-label">Vector b (b = [1, 2, ..., n])</span>
                  <InlineArray
                    arr={
                      resp.b_vector ??
                      Array.from({ length: Number(n) }, (_, i) => i + 1)
                    }
                  />

                  <span className="section-label mt-4">Determinant of Matrix A</span>
                  <PrettyPre>
                    det(A) = {String(resp.determinant ?? resp.determinant)}
                  </PrettyPre>

                  <span className="section-label mt-4">Solution Vector x (Rounded)</span>
                  <InlineArray
                    arr={resp.x_solution ?? resp.solution ?? resp.x_solution}
                  />
                </AnswerCard>

                {/* E */}
                <AnswerCard
                  label="E"
                  title="Root Refinement (Newton-Raphson Method)"
                >
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div className="matrix-container">
                        <h6 className="matrix-title">Smallest Root (Newton)</h6>
                        <PrettyPre>
                          {String(resp.newton_smallest ?? resp.newton_smallest)}
                        </PrettyPre>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="matrix-container">
                        <h6 className="matrix-title">Largest Root (Newton)</h6>
                        <PrettyPre>
                          {String(resp.newton_largest ?? resp.newton_largest)}
                        </PrettyPre>
                      </div>
                    </div>
                  </div>

                  <span className="section-label">Newton Iteration Logs</span>
                  <PrettyPre>
                    {(resp.newton_logs ?? resp.logs ?? []).join("\n")}
                  </PrettyPre>
                </AnswerCard>

                {/* Summary */}
                <div className="summary-card mb-5">
                  <h6>📊 Computation Summary</h6>
                  <ul>
                    <li>
                      <strong>Polynomial Degree:</strong>{" "}
                      {resp.coeffs_high?.length
                        ? resp.coeffs_high.length - 1
                        : "N/A"}
                    </li>
                    <li>
                      <strong>Eigenvalues Computed:</strong>{" "}
                      {resp.eigenvalues?.length ?? "N/A"}
                    </li>
                    <li>
                      <strong>Matrix Determinant:</strong>{" "}
                      {String(resp.determinant ?? resp.determinant)}
                    </li>
                    <li>
                      <strong>Order (n):</strong> {n}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Polynomial;
