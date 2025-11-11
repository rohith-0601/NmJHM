import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Harshad = () => {
  // -------------------------------
  // Question A States
  // -------------------------------
  const [q1Start, setQ1Start] = useState("");
  const [q1End, setQ1End] = useState("");
  const [q1Result, setQ1Result] = useState(null);
  const [q1Loading, setQ1Loading] = useState(false);

  const handleQ1Submit = async (e) => {
    e.preventDefault();
    setQ1Loading(true);
    setQ1Result(null);
    try {
      const res = await fetch("http://localhost:5001/first_non_harshad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: Number(q1Start), end: Number(q1End) }),
      });
      const data = await res.json();
      setQ1Result(data);
    } catch (err) {
      console.error(err);
    } finally {
      setQ1Loading(false);
    }
  };

  // -------------------------------
  // Question B States
  // -------------------------------
  const [mode, setMode] = useState(null);
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");
  const [targetCount, setTargetCount] = useState("");
  const [q2Result, setQ2Result] = useState(null);
  const [q2Loading, setQ2Loading] = useState(false);

  const handleModeSelect = (m) => {
    setMode(m);
    setQ2Result(null);
  };

  const handleQ2Submit = async (e) => {
    e.preventDefault();
    setQ2Loading(true);
    setQ2Result(null);
    try {
      let payload = {};
      if (mode === 1) {
        payload = {
          mode: 1,
          start_range: Number(startRange),
          end_range: Number(endRange),
        };
      } else {
        payload = { mode: 2, target_count: Number(targetCount) };
      }

      const res = await fetch("http://localhost:5001/harshad_groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setQ2Result(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setQ2Loading(false), 500);
    }
  };

  // -------------------------------
  // Custom Styles
  // -------------------------------
  const customStyles = `
    .soft-bg {
      background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
      min-height: 100vh;
    }
    
    .card-modern {
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e3e8ef;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card-modern:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }
    
    .btn-soft-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    
    .btn-soft-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      color: white;
    }
    
    .btn-outline-soft {
      background: white;
      border: 2px solid #667eea;
      color: #667eea;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    
    .btn-outline-soft:hover {
      background: #667eea;
      color: white;
      transform: scale(1.02);
    }
    
    .btn-outline-soft.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }
    
    .input-soft {
      border: 2px solid #e3e8ef;
      border-radius: 12px;
      padding: 12px 16px;
      transition: all 0.3s ease;
      background: #f8f9fb;
    }
    
    .input-soft:focus {
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      outline: none;
    }
    
    .badge-soft-primary {
      background: linear-gradient(135deg, #e0e7ff 0%, #e5deff 100%);
      color: #5b21b6;
      padding: 8px 20px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .badge-soft-warning {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #92400e;
      padding: 8px 20px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .result-card {
      background: linear-gradient(135deg, #fef3c7 0%, #fee2e2 100%);
      border-radius: 16px;
      border-left: 5px solid #f59e0b;
      padding: 24px;
    }
    
    .metric-box {
      background: white;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      border: 2px solid #f3f4f6;
      transition: all 0.3s ease;
    }
    
    .metric-box:hover {
      border-color: #667eea;
      transform: scale(1.05);
    }
    
    .info-box {
      background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
      border-radius: 16px;
      padding: 20px;
      border: 2px solid #93c5fd;
    }
    
    .streak-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 4px solid #0ea5e9;
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s ease;
    }
    
    .streak-card:hover {
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      transform: translateX(8px);
      box-shadow: 0 4px 15px rgba(14, 165, 233, 0.2);
    }
    
    .table-soft {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .table-soft thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .table-soft tbody tr {
      border-bottom: 1px solid #f3f4f6;
      transition: background 0.2s ease;
    }
    
    .table-soft tbody tr:hover {
      background: #f9fafb;
    }
    
    .spinner-soft {
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
    
    .page-title {
      color: #1f2937;
      font-weight: 700;
    }
    
    .section-title {
      color: #374151;
      font-weight: 600;
    }
    
    .text-soft-primary {
      color: #667eea;
    }
    
    .text-soft-secondary {
      color: #6b7280;
    }
  `;

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <>
      <style>{customStyles}</style>
      <div className="soft-bg">
        <div className="container py-5">
          {/* Header */}
          <div className="text-center mb-5 pt-4">
            <h1 className="display-4 page-title mb-3">
              🔢 Harshad Number Explorer
            </h1>
            <p className="lead text-soft-secondary">
              Discover numbers divisible by their digit sums
            </p>
          </div>

          {/* ==================== QUESTION A ==================== */}
          <div className="row mb-5">
            <div className="col-lg-10 offset-lg-1">
              <div className="card-modern p-5">
                <div className="d-flex align-items-center mb-4">
                  <span className="badge-soft-primary me-3">Challenge A</span>
                  <h3 className="mb-0 section-title">
                    First Non-Harshad Factorial
                  </h3>
                </div>

                <p className="text-soft-secondary mb-4">
                  Find the first factorial number within your range that isn't
                  divisible by its digit sum
                </p>

                <form onSubmit={handleQ1Submit}>
                  <div className="row g-3 mb-4">
                    <div className="col-md-5">
                      <label className="form-label fw-semibold text-soft-secondary small">
                        START NUMBER
                      </label>
                      <input
                        type="number"
                        className="form-control input-soft"
                        placeholder="e.g., 1"
                        value={q1Start}
                        onChange={(e) => setQ1Start(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label fw-semibold text-soft-secondary small">
                        END NUMBER
                      </label>
                      <input
                        type="number"
                        className="form-control input-soft"
                        placeholder="e.g., 100"
                        value={q1End}
                        onChange={(e) => setQ1End(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button type="submit" className="btn btn-soft-primary w-100">
                        🔍 Search
                      </button>
                    </div>
                  </div>
                </form>

                {q1Loading && (
                  <div className="text-center py-5">
                    <div className="spinner-soft mx-auto"></div>
                    <p className="mt-3 text-soft-secondary fw-semibold">
                      Computing factorial values...
                    </p>
                  </div>
                )}

                {q1Result && !q1Loading && (
                  <div className="result-card">
                    {q1Result.status === "non-harshad-found" ? (
                      <>
                        <div className="d-flex align-items-center mb-4">
                          <span className="fs-2 me-3">🎯</span>
                          <div>
                            <h5 className="mb-1 fw-bold" style={{ color: '#92400e' }}>
                              First Non-Harshad Found
                            </h5>
                            <h4 className="mb-0 fw-bold text-dark">
                              {q1Result.number}!
                            </h4>
                          </div>
                        </div>

                        <div className="row g-3 mb-4">
                          <div className="col-md-4">
                            <div className="metric-box">
                              <small className="text-soft-secondary d-block mb-1 fw-semibold">
                                DIGIT SUM
                              </small>
                              <strong className="fs-3 text-soft-primary">
                                {q1Result.digit_sum}
                              </strong>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="metric-box">
                              <small className="text-soft-secondary d-block mb-1 fw-semibold">
                                REMAINDER
                              </small>
                              <strong className="fs-3" style={{ color: '#f59e0b' }}>
                                {q1Result.remainder}
                              </strong>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="metric-box">
                              <small className="text-soft-secondary d-block mb-1 fw-semibold">
                                STATUS
                              </small>
                              <strong className="fs-3" style={{ color: '#dc2626' }}>
                                Non-Harshad
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-3 p-3 border border-light">
                          <p className="mb-2 fw-semibold text-soft-secondary">
                            Factorial Value:
                          </p>
                          <code
                            className="d-block p-3 rounded text-dark"
                            style={{
                              wordBreak: "break-all",
                              fontSize: "0.85rem",
                              maxHeight: "150px",
                              overflow: "auto",
                              background: "#f9fafb",
                            }}
                          >
                            {q1Result.factorial}
                          </code>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-3">
                        <span className="fs-1 mb-2 d-block">✨</span>
                        <p className="text-dark fs-5 mb-0">{q1Result.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================== QUESTION B ==================== */}
          <div className="row mb-5">
            <div className="col-lg-10 offset-lg-1">
              <div className="card-modern p-5">
                <div className="d-flex align-items-center mb-4">
                  <span className="badge-soft-warning me-3">Challenge B</span>
                  <h3 className="mb-0 section-title">
                    Consecutive Harshad Sequences
                  </h3>
                </div>

                <div className="alert alert-light border border-light mb-4">
                  <div className="d-flex align-items-start">
                    <span className="fs-4 me-3">💡</span>
                    <div className="text-soft-secondary">
                      <strong className="text-dark">Example:</strong> 110, 111, 112 form
                      a sequence of three consecutive Harshad numbers
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <button
                      type="button"
                      className={`btn w-100 py-3 ${
                        mode === 1
                          ? "btn-outline-soft active"
                          : "btn-outline-soft"
                      }`}
                      onClick={() => handleModeSelect(1)}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="fs-4 me-2">📊</span>
                        <div className="text-start">
                          <div className="fw-bold">Range Mode</div>
                          <small className="opacity-75">
                            Find groups by size range
                          </small>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="button"
                      className={`btn w-100 py-3 ${
                        mode === 2
                          ? "btn-outline-soft active"
                          : "btn-outline-soft"
                      }`}
                      onClick={() => handleModeSelect(2)}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="fs-4 me-2">🎯</span>
                        <div className="text-start">
                          <div className="fw-bold">Target Mode</div>
                          <small className="opacity-75">
                            Find all streaks of specific length
                          </small>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {mode && (
                  <form onSubmit={handleQ2Submit}>
                    <div className="row g-3 mb-4">
                      {mode === 1 ? (
                        <>
                          <div className="col-md-4">
                            <label className="form-label fw-semibold text-soft-secondary small">
                              FROM GROUP SIZE
                            </label>
                            <input
                              type="number"
                              className="form-control input-soft"
                              placeholder="e.g., 2"
                              value={startRange}
                              onChange={(e) => setStartRange(e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label fw-semibold text-soft-secondary small">
                              TO GROUP SIZE
                            </label>
                            <input
                              type="number"
                              className="form-control input-soft"
                              placeholder="e.g., 5"
                              value={endRange}
                              onChange={(e) => setEndRange(e.target.value)}
                              required
                            />
                          </div>
                        </>
                      ) : (
                        <div className="col-md-8">
                          <label className="form-label fw-semibold text-soft-secondary small">
                            CONSECUTIVE COUNT
                          </label>
                          <input
                            type="number"
                            className="form-control input-soft"
                            placeholder="e.g., 10"
                            value={targetCount}
                            onChange={(e) => setTargetCount(e.target.value)}
                            required
                          />
                        </div>
                      )}
                      <div className="col-md-4 d-flex align-items-end">
                        <button type="submit" className="btn btn-soft-primary w-100">
                          🚀 Search
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {q2Loading && (
                  <div className="text-center py-5">
                    <div className="spinner-soft mx-auto"></div>
                    <p className="mt-3 text-soft-secondary fw-semibold">
                      Analyzing consecutive sequences...
                    </p>
                  </div>
                )}

                {q2Result && !q2Loading && (
                  <div className="bg-light rounded-4 p-4 border border-light">
                    {mode === 1 && q2Result.range_results ? (
                      <>
                        <div className="d-flex align-items-center mb-4">
                          <span className="fs-2 me-3">✅</span>
                          <h5 className="mb-0 fw-bold text-dark">
                            Groups Found: Size {startRange} to {endRange}
                          </h5>
                        </div>

                        <div className="table-responsive">
                          <table className="table table-soft mb-0">
                            <thead className="text-white">
                              <tr>
                                <th className="py-3 px-4">Group Size</th>
                                <th className="py-3 px-4">Count</th>
                                <th className="py-3 px-4">Sequences</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {Object.entries(q2Result.range_results).map(
                                ([size, groups], idx) => {
                                  let displayGroups = [];
                                  if (Array.isArray(groups)) {
                                    if (Array.isArray(groups[0]))
                                      displayGroups = groups;
                                    else displayGroups = [groups];
                                  } else if (typeof groups === "string") {
                                    displayGroups = [[groups]];
                                  } else if (typeof groups === "number") {
                                    displayGroups = [[groups]];
                                  }

                                  return (
                                    <tr key={idx} className="align-middle">
                                      <td className="px-4">
                                        <span
                                          className="badge rounded-pill px-3 py-2"
                                          style={{
                                            background: "#e0e7ff",
                                            color: "#5b21b6",
                                            fontWeight: "600",
                                          }}
                                        >
                                          {size}
                                        </span>
                                      </td>
                                      <td className="px-4">
                                        <span className="fw-bold fs-5 text-soft-primary">
                                          {displayGroups.length}
                                        </span>
                                      </td>
                                      <td className="px-4">
                                        <div
                                          style={{
                                            maxHeight: "100px",
                                            overflow: "auto",
                                            fontSize: "0.9rem",
                                          }}
                                        >
                                          {displayGroups
                                            .map((g) =>
                                              Array.isArray(g)
                                                ? `[${g.join(", ")}]`
                                                : `[${g}]`
                                            )
                                            .join("  •  ")}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : mode === 2 && q2Result.streaks ? (
                      <>
                        <div className="d-flex align-items-center mb-4">
                          <span className="fs-2 me-3">🎊</span>
                          <h5 className="mb-0 fw-bold text-dark">
                            Found {q2Result.count} Streak
                            {q2Result.count !== 1 ? "s" : ""} of{" "}
                            {q2Result.streaks[0]?.length}-Consecutive Numbers
                          </h5>
                        </div>

                        <div className="row g-3">
                          {q2Result.streaks.map((seq, idx) => (
                            <div key={idx} className="col-12">
                              <div className="streak-card">
                                <div className="d-flex align-items-center">
                                  <span
                                    className="badge rounded-pill me-3 px-3 py-2"
                                    style={{
                                      background: "#1f2937",
                                      color: "white",
                                    }}
                                  >
                                    #{idx + 1}
                                  </span>
                                  <span className="fw-semibold text-dark">
                                    {seq.join(" → ")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <span className="fs-1 mb-2 d-block">❌</span>
                        <p className="text-danger fs-5 mb-0">No results found</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="info-box mt-4">
                  <div className="d-flex align-items-start">
                    <span className="fs-3 me-3">🤔</span>
                    <div>
                      <h6 className="fw-bold text-soft-primary mb-2">
                        Why No 20+ Consecutive Harshad Numbers?
                      </h6>
                      <p className="mb-0 text-dark">
                        The divisibility constraint depends on each number's digit
                        sum. As sequences grow longer, the probability that one
                        number's digit sum won't divide evenly increases,
                        inevitably breaking the streak.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Harshad;
