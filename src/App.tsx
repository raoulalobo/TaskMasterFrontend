import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertiesPage from './pages/PropertiesPage';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import TransactionsPage from './pages/TransactionsPage';
import MyPropertiesPage from './pages/MyPropertiesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPropertiesPage from './pages/AdminPropertiesPage';
import AdminTransactionsPage from './pages/AdminTransactionsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Route profil - accessible à tous les utilisateurs connectés */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['buyer', 'landowner', 'admin']}>
                  <ProfilePage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          
          {/* Routes pour les acheteurs */}
          <Route 
            path="/properties" 
            element={<PropertiesPage />} 
          />
          <Route 
            path="/property/:id" 
            element={<PropertyDetailPage />} 
          />
          
          {/* Routes pour les propriétaires */}
          <Route 
            path="/my-properties" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['landowner']}>
                  <MyPropertiesPage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/add-property" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['landowner']}>
                  <AddPropertyPage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/edit-property/:id" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['landowner']}>
                  <EditPropertyPage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          
          {/* Routes pour les acheteurs et propriétaires */}
          <Route 
            path="/transactions" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['buyer', 'landowner']}>
                  <TransactionsPage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          
          {/* Routes administrateurs */}
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminDashboardPage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/properties" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminPropertiesPage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/transactions" 
            element={
              <PrivateRoute>
                <RoleBasedRoute allowedRoles={['admin']}>
                  <AdminTransactionsPage />
                </RoleBasedRoute>
              </PrivateRoute>
            } 
          />
          </Routes>
        </main>
        
        {/* Footer global */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-600">
              Fait par amour pour les Camerounais par les Camerounais ❤️
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;