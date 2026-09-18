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
import { FarmProfile } from './pages/FarmProfile';
import { Weather } from './pages/Weather';
import { CropAdvice } from './pages/CropAdvice';
import { DiseaseTracker } from './pages/DiseaseTracker';
import { AgriMarket } from './pages/AgriMarket';
import { Schemes } from './pages/Schemes';
import { Community } from './pages/Community';
import { CommunityPost } from './pages/CommunityPost';
import { Skeleton } from './components/Skeleton';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-content px-4 py-10 sm:px-6">
        <Skeleton className="mx-auto h-6 w-48" />
        <Skeleton className="mx-auto mt-4 h-40 w-full max-w-md" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Guard that redirects consumers away from farmer-only routes */
function RequireFarmer({ children }: { children: React.ReactNode }) {
  const { activeRole } = useAuth();
  if (activeRole === 'buyer') return <Navigate to="/marketplace" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ListingDetail />} />

        {/* Authenticated routes — any role */}
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

        {/* Farmer-only routes */}
        <Route path="/home" element={<RequireAuth><RequireFarmer><Home /></RequireFarmer></RequireAuth>} />
        <Route path="/prices" element={<RequireAuth><RequireFarmer><Prices /></RequireFarmer></RequireAuth>} />
        <Route path="/sell" element={<RequireAuth><RequireFarmer><Sell /></RequireFarmer></RequireAuth>} />
        <Route path="/sell/success" element={<RequireAuth><RequireFarmer><SellSuccess /></RequireFarmer></RequireAuth>} />
        <Route path="/listings" element={<RequireAuth><RequireFarmer><MyListings /></RequireFarmer></RequireAuth>} />
        <Route path="/farm-profile" element={<RequireAuth><RequireFarmer><FarmProfile /></RequireFarmer></RequireAuth>} />
        <Route path="/weather" element={<RequireAuth><RequireFarmer><Weather /></RequireFarmer></RequireAuth>} />
        <Route path="/crop-advice" element={<RequireAuth><RequireFarmer><CropAdvice /></RequireFarmer></RequireAuth>} />
        <Route path="/disease-tracker" element={<RequireAuth><RequireFarmer><DiseaseTracker /></RequireFarmer></RequireAuth>} />
        <Route path="/market" element={<RequireAuth><RequireFarmer><AgriMarket /></RequireFarmer></RequireAuth>} />
        <Route path="/schemes" element={<RequireAuth><RequireFarmer><Schemes /></RequireFarmer></RequireAuth>} />
        <Route path="/community" element={<RequireAuth><RequireFarmer><Community /></RequireFarmer></RequireAuth>} />
        <Route path="/community/:id" element={<RequireAuth><RequireFarmer><CommunityPost /></RequireFarmer></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
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
    </BrowserRouter>
  );
}