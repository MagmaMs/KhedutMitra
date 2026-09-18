import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ListingsProvider } from './contexts/ListingsContext';
import { CropProvider } from './contexts/CropContext';
import { DemoProvider } from './contexts/DemoContext';
import { ToastProvider } from './contexts/ToastContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { Prices } from './pages/Prices';
import { Sell } from './pages/Sell';
import { SellSuccess } from './pages/SellSuccess';
import { MyListings } from './pages/MyListings';
import { Marketplace } from './pages/Marketplace';
import { ListingDetail } from './pages/ListingDetail';
import { Profile } from './pages/Profile';

function RequireAuth({ children }: {children: React.ReactNode;}) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ListingDetail />} />
        <Route
          path="/home"
          element={
          <RequireAuth>
              <Home />
            </RequireAuth>
          } />
        
        <Route
          path="/prices"
          element={
          <RequireAuth>
              <Prices />
            </RequireAuth>
          } />
        
        <Route
          path="/sell"
          element={
          <RequireAuth>
              <Sell />
            </RequireAuth>
          } />
        
        <Route
          path="/sell/success"
          element={
          <RequireAuth>
              <SellSuccess />
            </RequireAuth>
          } />
        
        <Route
          path="/listings"
          element={
          <RequireAuth>
              <MyListings />
            </RequireAuth>
          } />
        
        <Route
          path="/profile"
          element={
          <RequireAuth>
              <Profile />
            </RequireAuth>
          } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>);

}

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <DemoProvider>
            <CropProvider>
              <ListingsProvider>
                <ToastProvider>
                  <AppRoutes />
                </ToastProvider>
              </ListingsProvider>
            </CropProvider>
          </DemoProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>);

}