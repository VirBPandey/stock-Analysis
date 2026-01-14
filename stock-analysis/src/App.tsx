import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StockAnalysis } from './features/stock-analysis';
import { PortfolioAnalysis } from './features/portfolio-analysis';
import { Portfolio } from './features/portfolio';
import SoldShares from './components/SoldShares';
import NearTargetShares from './components/NearTargetShares';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Stock Analysis Dashboard</h1>
          <nav>
            <ul>
              {isAuthenticated ? (
                <>
                  <li><Link to="/stocks">Stock Analysis</Link></li>
                  {user?.role === 'admin' && (
                    <>
                      <li><Link to="/portfolio">My Portfolio</Link></li>
                      <li><Link to="/portfolio-analysis">Portfolio Analysis</Link></li>
                      <li><Link to="/near-targets">Near Target Dates</Link></li>
                      <li><Link to="/sold-shares">Sold Shares</Link></li>
                    </>
                  )}
                  <li><button onClick={logout}>Logout</button></li>
                  <li>Welcome, {user?.username} ({user?.role})</li>
                </>
              ) : (
                <li><Link to="/login">Login</Link></li>
              )}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><StockAnalysis /></ProtectedRoute>} />
            <Route path="/stocks" element={<ProtectedRoute><StockAnalysis /></ProtectedRoute>} />
            {user?.role === 'admin' && (
              <>
                <Route path="/portfolio" element={<ProtectedRoute requiredRole="admin"><Portfolio /></ProtectedRoute>} />
                <Route path="/portfolio-analysis" element={<ProtectedRoute requiredRole="admin"><PortfolioAnalysis /></ProtectedRoute>} />
                <Route path="/near-targets" element={<ProtectedRoute requiredRole="admin"><NearTargetShares /></ProtectedRoute>} />
                <Route path="/sold-shares" element={<ProtectedRoute requiredRole="admin"><SoldShares /></ProtectedRoute>} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
