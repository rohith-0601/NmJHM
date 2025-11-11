// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Harshad from "./components/HarshadPages/Harshad";
import Polynomial from "./components/PolynomialPages/Polynomial";
import GaussLeg from "./components/GuassPages/GuassLeg";
import Diffeqn from "./components/DiffeqnPages/Diffeqn";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Harshad", icon: "" },
    { path: "/polynomial", label: "Polynomial", icon: "" },
    { path: "/gauss", label: "Gauss-Legendre", icon: "" },
    { path: "/diffeqn", label: "Differential Eqn", icon: "" },
  ];

  const customStyles = `
    .navbar-modern {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 249, 251, 0.98) 100%);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e3e8ef;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
      z-index: 1000;
      padding: 12px 0;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #1f2937;
      font-weight: 700;
      font-size: 1.3rem;
      transition: all 0.3s ease;
    }

    .navbar-brand:hover {
      color: #667eea;
      transform: translateX(3px);
    }

    .brand-icon {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.3rem;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .nav-links {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .nav-item {
      position: relative;
      text-decoration: none;
      color: #6b7280;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 10px 20px;
      border-radius: 12px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 2px solid transparent;
    }

    .nav-item:hover {
      background: #f3f4f6;
      color: #1f2937;
      transform: translateY(-2px);
    }

    .nav-item.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .nav-item.active:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .nav-icon {
      font-size: 1.1rem;
      display: inline-block;
    }

    .page-content {
      padding-top: 70px;
    }

    /* Mobile Navigation */
    .mobile-nav-toggle {
      display: none;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 1.2rem;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }

    .mobile-nav-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 20px;
      }

      .mobile-nav-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav-links {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        gap: 8px;
        padding: 20px;
        border-bottom: 1px solid #e3e8ef;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-120%);
        transition: transform 0.3s ease;
      }

      .nav-links.open {
        transform: translateY(0);
      }

      .nav-item {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <BrowserRouter>
        {/* Modern Top Navbar */}
        <nav className="navbar-modern">
          <div className="navbar-container">
            <a href="/" className="navbar-brand">
              <div className="brand-icon">∑</div>
              <span>Numerical Methods</span>
            </a>

            <button 
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Page Routes */}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Harshad />} />
            <Route path="/polynomial" element={<Polynomial />} />
            <Route path="/gauss" element={<GaussLeg />} />
            <Route path="/diffeqn" element={<Diffeqn />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
