import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import useAuth from './hooks/useAuth';
import './App.css';

// Import des pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import CreateTransactionPage from './pages/CreateTransactionPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPropertiesPage from './pages/AdminPropertiesPage';
import AdminTransactionsPage from './pages/AdminTransactionsPage';

// Import des composants
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Composant PrivateRoute pour protéger les routes
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Composant RoleBasedRoute pour les routes admin
interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return allowedRoles.includes(user.user_type) ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/property/:id" element={<PropertyDetailPage />} />
              
              {/* Routes protégées - propriétaires */}
              <Route path="/add-property" element={
                <PrivateRoute>
                  <AddPropertyPage />
                </PrivateRoute>
              } />
              <Route path="/edit-property/:id" element={
                <PrivateRoute>
                  <EditPropertyPage />
                </PrivateRoute>
              } />
              <Route path="/my-properties" element={
                <PrivateRoute>
                  <MyPropertiesPage />
                </PrivateRoute>
              } />
              
              {/* Routes protégées - acheteurs */}
              <Route path="/create-transaction/:id" element={
                <PrivateRoute>
                  <CreateTransactionPage />
                </PrivateRoute>
              } />
              <Route path="/transactions" element={
                <PrivateRoute>
                  <TransactionsPage />
                </PrivateRoute>
              } />
              <Route path="/transaction/:id" element={
                <PrivateRoute>
                  <TransactionDetailPage />
                </PrivateRoute>
              } />
              
              {/* Routes admin */}
              <Route path="/admin" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </RoleBasedRoute>
              } />
              <Route path="/admin/users" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </RoleBasedRoute>
              } />
              <Route path="/admin/properties" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminPropertiesPage />
                </RoleBasedRoute>
              } />
              <Route path="/admin/transactions" element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminTransactionsPage />
                </RoleBasedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;