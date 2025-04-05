import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaSignOutAlt, FaUser, FaTrello, FaSun, FaMoon, FaTag } from 'react-icons/fa';
import LabelManagement from '../labels/LabelManagement';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const { isAuthenticated, user } = state;
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isLabelManagementOpen, setIsLabelManagementOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Tema değişikliği için özel işleyici
  const handleThemeToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Theme toggle button clicked");
    console.log("Current theme before toggle:", theme);
    toggleTheme();
  }, [theme, toggleTheme]);

  return (
    <>
      <header className="bg-blue-700 dark:bg-slate-800 text-white p-4 shadow-md transition-colors duration-200">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-white no-underline">
            <FaTrello className="text-xl" />
            <h1 className="text-2xl font-bold">Trello Clone</h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Tema Geçiş Butonu */}
            <button 
              onClick={handleThemeToggle} 
              className="p-2 rounded-full hover:bg-blue-600 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={theme === 'light' ? 'Karanlık moda geç' : 'Aydınlık moda geç'}
              title={theme === 'light' ? 'Karanlık moda geç' : 'Aydınlık moda geç'}
              type="button"
            >
              {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
            </button>

            {isAuthenticated && (
              <button 
                onClick={() => setIsLabelManagementOpen(true)}
                className="p-2 rounded-full hover:bg-blue-600 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Etiket Yönetimi"
                title="Etiket Yönetimi"
                type="button"
              >
                <FaTag size={18} />
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <FaUser className="mr-2" />
                  {user?.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center bg-blue-600 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-900 px-4 py-2 rounded-md transition"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link 
                  to="/login" 
                  className="bg-blue-600 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-900 px-4 py-2 rounded-md transition"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-blue-700 hover:bg-blue-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 px-4 py-2 rounded-md transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Label Management Modal */}
      <LabelManagement 
        isOpen={isLabelManagementOpen} 
        onClose={() => setIsLabelManagementOpen(false)} 
      />
    </>
  );
};

export default Navbar; 