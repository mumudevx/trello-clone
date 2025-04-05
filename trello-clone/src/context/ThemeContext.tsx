import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // localStorage'dan tema tercihini al veya sistem tercihini kullan
  const getInitialTheme = (): ThemeType => {
    // Önce localStorage'dan temayı almayı dene
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('theme') as ThemeType;
      
      if (savedTheme === 'dark' || savedTheme === 'light') {
        console.log('Theme from localStorage:', savedTheme);
        return savedTheme;
      }
    }
    
    // Sistem karanlık mod tercihi
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('Theme from system preference: dark');
      return 'dark';
    }
    
    console.log('Default theme: light');
    return 'light';
  };

  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);

  // Tema sınıfını HTML'e ekle
  const applyTheme = useCallback((newTheme: ThemeType) => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    console.log('Applying theme class:', newTheme);
    
    // Önce her iki temayı da kaldır, sonra gerekli olanı ekle
    root.classList.remove('dark', 'light');
    root.classList.add(newTheme);
    
    // localStorage'a temayı kaydet
    try {
      localStorage.setItem('theme', newTheme);
      console.log('Theme saved to localStorage:', newTheme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, []);

  // Tema değişikliklerinde tema sınıfını uygula
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = useCallback(() => {
    console.log('Toggle theme called. Current theme:', theme);
    
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('New theme will be:', newTheme);
      return newTheme;
    });
  }, [theme]);

  const contextValue = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}; 