import { Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Navbar from './components/ui/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Boards from './pages/Boards';
import BoardDetail from './pages/boards/BoardDetail';
import { useEffect } from 'react';
import { migrateLabels } from './utils/migrateLabels';

// Development modunda olup olmadığını kontrol et
const isDevelopment = import.meta.env.DEV;

function App() {
  const { theme } = useTheme();
  
  // Log tema değişikliklerini izle
  useEffect(() => {
    console.log('App component - current theme:', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Uygulama başladığında etiket geçişini çalıştır
  useEffect(() => {
    try {
      migrateLabels();
    } catch (error) {
      console.error('Etiket geçişi sırasında hata:', error);
    }
  }, []);

  return (
    <div className={`min-h-screen bg-blue-50 dark:bg-slate-900 dark:text-white transition-colors duration-200`}>
      <Navbar />
      <main className="container mx-auto p-4 md:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/:boardId" element={<BoardDetail />} />
        </Routes>
      </main>
      {/* Anlık tema göstergesi - debug için */}
      {isDevelopment && (
        <div className="fixed bottom-2 right-2 bg-white dark:bg-slate-800 text-gray-800 dark:text-white px-2 py-1 rounded text-xs opacity-70">
          Theme: {theme}
        </div>
      )}
    </div>
  );
}

export default App;
