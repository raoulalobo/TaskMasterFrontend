import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';

const Navbar: React.FC = () => {
  const { isAuthenticated, userType, user, updateAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.logout();
      // Mettre à jour l'état d'authentification
      updateAuth();
      // Fermer le menu mobile après déconnexion
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fermer le menu mobile lors du clic sur un lien
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Fonction pour obtenir le nom complet de l'utilisateur
  const getUserFullName = () => {
    if (user) {
      return `${user.first_name} ${user.last_name}`;
    }
    return '';
  };

  // Fonction pour obtenir le libellé du type d'utilisateur
  const getUserTypeLabel = () => {
    switch (userType) {
      case 'landowner':
        return 'Propriétaire';
      case 'buyer':
        return 'Acheteur';
      case 'admin':
        return 'Administrateur';
      default:
        return '';
    }
  };

  return (
    <nav className="bg-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Logo et bouton hamburger mobile */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-xl sm:text-2xl font-bold text-indigo-700"
                onClick={closeMobileMenu}
              >
                TaskMarket
              </Link>
            </div>
            
            {/* Navigation desktop */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="border-indigo-500 text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
                Accueil
              </Link>
              {userType === 'landowner' && (
                <>
                  <Link to="/my-properties" className="border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
                    Mes Biens
                  </Link>
                  <Link to="/add-property" className="border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
                    Ajouter un Bien
                  </Link>
                </>
              )}
              {userType === 'buyer' && (
                <Link to="/properties" className="border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
                  Rechercher des Biens
                </Link>
              )}
              {(userType === 'landowner' || userType === 'buyer') && (
                <Link to="/transactions" className="border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
                  Transactions
                </Link>
              )}
              {userType === 'admin' && (
                <>
                  <Link to="/admin/users" className="border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
                    Utilisateurs
                  </Link>
                  <Link to="/admin/properties" className="border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
                    Biens
                  </Link>
                  <Link to="/admin/transactions" className="border-transparent text-gray-600 hover:border-gray-300 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1">
                    Transactions
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Actions desktop */}
          <div className="hidden md:flex md:items-center">
            {isAuthenticated ? (
              <div className="ml-3 relative flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="text-base text-gray-700 font-medium">
                    {getUserFullName()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getUserTypeLabel()}
                  </span>
                </div>
                <Link 
                  to="/profile"
                  className="bg-gray-100 p-3 rounded-full text-gray-500 hover:text-indigo-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110 block"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <span className="sr-only">Voir le profil</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
                <button 
                  onClick={handleLogout}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md text-base font-medium transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                  style={{ minHeight: '44px' }}
                >
                  {loading ? 'Déconnexion...' : 'Déconnexion'}
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-indigo-700 py-3 px-4 text-base font-medium transition duration-300 ease-in-out transform hover:-translate-y-1"
                  style={{ minHeight: '44px' }}
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-700 hover:bg-indigo-800 text-white py-3 px-4 rounded-md text-base font-medium transition duration-300 ease-in-out transform hover:scale-105"
                  style={{ minHeight: '44px' }}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Bouton hamburger mobile */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-600 hover:text-indigo-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              style={{ minHeight: '44px', minWidth: '44px' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Menu principal"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {/* Icône hamburger */}
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
          {/* Navigation principale */}
          <Link 
            to="/" 
            className="text-indigo-700 bg-indigo-50 block px-3 py-3 rounded-md text-base font-medium border-l-4 border-indigo-500 transition-colors duration-200"
            style={{ minHeight: '44px' }}
            onClick={closeMobileMenu}
          >
            🏠 Accueil
          </Link>
          
          {userType === 'landowner' && (
            <>
              <Link 
                to="/my-properties" 
                className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                style={{ minHeight: '44px' }}
                onClick={closeMobileMenu}
              >
                🏢 Mes Biens
              </Link>
              <Link 
                to="/add-property" 
                className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                style={{ minHeight: '44px' }}
                onClick={closeMobileMenu}
              >
                ➕ Ajouter un Bien
              </Link>
            </>
          )}
          
          {userType === 'buyer' && (
            <Link 
              to="/properties" 
              className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
              style={{ minHeight: '44px' }}
              onClick={closeMobileMenu}
            >
              🔍 Rechercher des Biens
            </Link>
          )}
          
          {(userType === 'landowner' || userType === 'buyer') && (
            <Link 
              to="/transactions" 
              className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
              style={{ minHeight: '44px' }}
              onClick={closeMobileMenu}
            >
              💰 Transactions
            </Link>
          )}
          
          {userType === 'admin' && (
            <>
              <Link 
                to="/admin/users" 
                className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                style={{ minHeight: '44px' }}
                onClick={closeMobileMenu}
              >
                👥 Utilisateurs
              </Link>
              <Link 
                to="/admin/properties" 
                className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                style={{ minHeight: '44px' }}
                onClick={closeMobileMenu}
              >
                🏘️ Biens
              </Link>
              <Link 
                to="/admin/transactions" 
                className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                style={{ minHeight: '44px' }}
                onClick={closeMobileMenu}
              >
                📊 Transactions
              </Link>
            </>
          )}

          {/* Séparateur */}
          <div className="border-t border-gray-200 pt-4 pb-3">
            {isAuthenticated ? (
              <>
                {/* Infos utilisateur */}
                <div className="px-3 py-2">
                  <div className="text-base font-medium text-gray-800">
                    {getUserFullName()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getUserTypeLabel()}
                  </div>
                </div>
                
                {/* Actions utilisateur */}
                <div className="mt-3 space-y-1">
                  <Link 
                    to="/profile" 
                    className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                    style={{ minHeight: '44px' }}
                    onClick={closeMobileMenu}
                  >
                    ⚙️ Profil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50 block px-3 py-3 rounded-md text-base font-medium disabled:opacity-50 transition-colors duration-200"
                    style={{ minHeight: '44px' }}
                  >
                    {loading ? '⏳ Déconnexion...' : '🚪 Déconnexion'}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                  style={{ minHeight: '44px' }}
                  onClick={closeMobileMenu}
                >
                  🔑 Connexion
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-700 hover:bg-indigo-800 text-white block px-3 py-3 rounded-md text-base font-medium transition-colors duration-200"
                  style={{ minHeight: '44px' }}
                  onClick={closeMobileMenu}
                >
                  📝 Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;