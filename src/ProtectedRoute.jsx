import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setTimedOut(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading && !timedOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading && timedOut) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-gray-800 font-semibold mb-2">Taking longer than expected</p>
          <p className="text-gray-500 text-sm mb-4">The connection may be slow. Try refreshing or logging in again.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">Refresh</button>
            <button onClick={() => window.location.href = '/maturity-framework/login'} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
