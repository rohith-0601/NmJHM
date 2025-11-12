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
    .table-soft thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
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
            <h1 className="display-4 fw-bold text-dark mb-2">
              🔢 Harshad Number Explorer
            </h1>
            <p className="lead text-secondary">
              Discover factorials and consecutive Harshad sequences
            </p>
          </div>

          {/* ==================== QUESTION A ==================== */}
          <div className="card-modern p-5 mb-5">
            <h3 className="fw-bold text-dark mb-4">
              Challenge A: First Non-Harshad Factorials
            </h3>

            <form onSubmit={handleQ1Submit}>
              <div className="row g-3 mb-4">
                <div className="col-md-5">
                  <input
                    type="number"
                    className="form-control input-soft"
                    placeholder="Start number"
                    value={q1Start}
                    onChange={(e) => setQ1Start(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="number"
                    className="form-control input-soft"
                    placeholder="End number"
                    value={q1End}
                    onChange={(e) => setQ1End(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-soft-primary w-100">
                    🔍 Find
                  </button>
                </div>
              </div>
            </form>

            {q1Loading && (
              <div className="text-center py-5">
                <div className="spinner-soft mx-auto"></div>
                <p className="mt-3 text-secondary fw-semibold">
                  Computing factorials...
                </p>
              </div>
            )}

            {q1Result && !q1Loading && (
              <div className="mt-4">
                {q1Result.status === "non-harshad-found" ? (
                  <>
                    <h5 className="fw-bold text-dark mb-3">
                      ❌ Non-Harshad Factorials Found
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-soft table-bordered align-middle">
                        <thead>
                          <tr>
                            <th>n</th>
                            <th>Digit Sum</th>
                            <th>Remainder</th>
                            <th>Factorial (n!)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {q1Result.results.map((item, idx) => (
                            <tr key={idx}>
                              <td className="fw-bold">{item.n}</td>
                              <td>{item.digit_sum}</td>
                              <td className="text-danger fw-bold">
                                {item.remainder}
                              </td>
                              <td
                                style={{
                                  wordBreak: "break-all",
                                  fontSize: "0.85rem",
                                  maxHeight: "150px",
                                  overflowY: "auto",
                                }}
                              >
                                {item.factorial}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="alert alert-info">
                    {q1Result.message}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==================== QUESTION B ==================== */}
          <div className="card-modern p-5">
            <h3 className="fw-bold text-dark mb-4">
              Challenge B: Consecutive Harshad Sequences
            </h3>

            <div className="d-flex gap-3 mb-4">
              <button
                type="button"
                className={`btn ${
                  mode === 1 ? "btn-soft-primary" : "btn-outline-secondary"
                } w-50`}
                onClick={() => handleModeSelect(1)}
              >
                Range Mode
              </button>
              <button
                type="button"
                className={`btn ${
                  mode === 2 ? "btn-soft-primary" : "btn-outline-secondary"
                } w-50`}
                onClick={() => handleModeSelect(2)}
              >
                Consecutive Mode
              </button>
            </div>

            {mode && (
              <form onSubmit={handleQ2Submit}>
                <div className="row g-3 mb-4">
                  {mode === 1 ? (
                    <>
                      <div className="col-md-4">
                        <input
                          type="number"
                          className="form-control input-soft"
                          placeholder="From (e.g., 2)"
                          value={startRange}
                          onChange={(e) => setStartRange(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="number"
                          className="form-control input-soft"
                          placeholder="To (e.g., 5)"
                          value={endRange}
                          onChange={(e) => setEndRange(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col-md-8">
                      <input
                        type="number"
                        className="form-control input-soft"
                        placeholder="Enter consecutive count (e.g., 10)"
                        value={targetCount}
                        onChange={(e) => setTargetCount(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div className="col-md-4">
                    <button
                      type="submit"
                      className="btn btn-soft-primary w-100"
                    >
                      🚀 Find
                    </button>
                  </div>
                </div>
              </form>
            )}

            {q2Loading && (
              <div className="text-center py-5">
                <div className="spinner-soft mx-auto"></div>
                <p className="mt-3 text-secondary fw-semibold">
                  Searching Harshad sequences...
                </p>
              </div>
            )}

            {q2Result && !q2Loading && (
              <div className="mt-4">
                {mode === 1 && q2Result.range_results ? (
                  <>
                    <h5 className="fw-bold text-dark mb-3">
                      ✅ Groups Found ({startRange} - {endRange})
                    </h5>
                    <table className="table table-soft">
                      <thead>
                        <tr>
                          <th>Group Size</th>
                          <th>Count</th>
                          <th>Groups Found</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(q2Result.range_results).map(
                          ([size, groups], idx) => {
                            let displayGroups = [];
                            if (Array.isArray(groups)) {
                              if (Array.isArray(groups[0])) displayGroups = groups;
                              else displayGroups = [groups];
                            } else {
                              displayGroups = [[groups]];
                            }

                            return (
                              <tr key={idx}>
                                <td>{size}</td>
                                <td>{displayGroups.length}</td>
                                <td style={{ wordBreak: "break-all" }}>
                                  {displayGroups
                                    .map((g) =>
                                      Array.isArray(g)
                                        ? `[${g.join(", ")}]`
                                        : `[${g}]`
                                    )
                                    .join("  •  ")}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </>
                ) : mode === 2 && q2Result.streaks ? (
                  <>
                    <h5 className="fw-bold text-dark">
                      ✅ Found {q2Result.count} Streak
                      {q2Result.count !== 1 ? "s" : ""} of{" "}
                      {q2Result.streaks[0]?.length}-Consecutive Harshads
                    </h5>
                    <ul className="list-group mt-3">
                      {q2Result.streaks.map((seq, idx) => (
                        <li
                          key={idx}
                          className="list-group-item bg-light border-0"
                        >
                          {seq.join(", ")}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-danger fw-semibold">
                    ❌ No results found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Harshad;
