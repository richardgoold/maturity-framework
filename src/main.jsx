import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import LandingPage from './LandingPage.jsx';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import { AuthProvider } from './AuthContext';
import { ContactModalProvider } from './ContactModal';

import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('App crash:', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {style:{padding:'2rem',fontFamily:'monospace',background:'#1a1a2e',color:'#e94560',minHeight:'100vh'}},
        React.createElement('h2', null, 'Something went wrong'),
        React.createElement('pre', {style:{whiteSpace:'pre-wrap',marginTop:'1rem',color:'#fff'}}, String(this.state.error)),
        React.createElement('button', {onClick:()=>window.location.reload(), style:{marginTop:'1rem',padding:'0.5rem 1rem',background:'#f2a71b',color:'#000',border:'none',borderRadius:'4px',cursor:'pointer'}}, 'Reload')
      );
    }
    return this.props.children;
  }
}

const basename = import.meta.env.BASE_URL || '/maturity-framework/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <AuthProvider>
        <ContactModalProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          {/* Catch-all: redirect to landing */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
        </ContactModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
