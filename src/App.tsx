
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import WeatherPage from '@/pages/WeatherPage';
import CountryPage from '@/pages/CountryPage';
import CurrencyPage from '@/pages/CurrencyPage';
import NewsPage from '@/pages/NewsPage';
import FlightPage from '@/pages/FlightPage';
import BookmarkPage from '@/pages/BookmarkPage';
import NotFound from '@/pages/NotFound';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Create a client
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="weather" element={<WeatherPage />} />
        <Route path="country" element={<CountryPage />} />
        <Route path="currency" element={<CurrencyPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="flight" element={<FlightPage />} />
        <Route path="bookmarks" element={<BookmarkPage />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
