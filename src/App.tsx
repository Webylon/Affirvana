import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ItemDetails = React.lazy(() => import('./pages/ItemDetails'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const Board = React.lazy(() => import('./pages/Board'));
const ProfilePage = React.lazy(() => import('./pages/Profile/ProfilePage'));
const CheckoutPage = React.lazy(() => import('./pages/Checkout/CheckoutPage'));

function App() {
  return (
    <AuthProvider>
      <BalanceProvider>
        <FavoritesProvider>
          <CartProvider>
            <BoardProvider>
              <Router>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                      <Route index element={
                        <Suspense fallback={<LoadingPage />}>
                          <HomePage />
                        </Suspense>
                      } />
                      <Route path="item/:id" element={
                        <Suspense fallback={<LoadingPage />}>
                          <ItemDetails />
                        </Suspense>
                      } />
                      <Route path="favorites" element={
                        <Suspense fallback={<LoadingPage />}>
                          <Favorites />
                        </Suspense>
                      } />
                      <Route path="board" element={
                        <Suspense fallback={<LoadingPage />}>
                          <Board />
                        </Suspense>
                      } />
                      <Route path="profile" element={
                        <Suspense fallback={<LoadingPage />}>
                          <ProfilePage />
                        </Suspense>
                      } />
                      <Route path="checkout" element={
                        <Suspense fallback={<LoadingPage />}>
                          <CheckoutPage />
                        </Suspense>
                      } />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </AnimatePresence>
              </Router>
            </BoardProvider>
          </CartProvider>
        </FavoritesProvider>
      </BalanceProvider>
    </AuthProvider>
  );
}

export default App;