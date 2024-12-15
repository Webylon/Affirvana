import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';
import { BoardProvider } from './context/BoardContext';
import { BalanceProvider } from './context/BalanceContext';
import Layout from './components/Layout';
import LoadingPage from './components/LoadingPage';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import AuthCallback from './pages/auth/AuthCallback';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ItemDetails = React.lazy(() => import('./pages/ItemDetails'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const Board = React.lazy(() => import('./pages/Board'));
const ProfilePage = React.lazy(() => import('./pages/Profile/ProfilePage'));
const CheckoutPage = React.lazy(() => import('./pages/Checkout/CheckoutPage'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <BalanceProvider>
            <FavoritesProvider>
              <CartProvider>
                <BoardProvider>
                  <Suspense fallback={<LoadingPage />}>
                    <Toaster position="top-right" />
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />

                      {/* Protected Routes */}
                      <Route
                        path="/"
                        element={
                          <PrivateRoute>
                            <Layout />
                          </PrivateRoute>
                        }
                      >
                        <Route index element={<HomePage />} />
                        <Route path="item/:id" element={<ItemDetails />} />
                        <Route path="favorites" element={<Favorites />} />
                        <Route path="board" element={<Board />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="checkout" element={<CheckoutPage />} />
                      </Route>

                      {/* Catch all route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </BoardProvider>
              </CartProvider>
            </FavoritesProvider>
          </BalanceProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;