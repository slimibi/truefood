import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import RestaurantsPage from '@/pages/RestaurantsPage';
import { useThemeStore } from '@/store/themeStore';

const App: React.FC = () => {
  const { theme } = useThemeStore();

  // Apply theme on mount
  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      const root = document.documentElement;
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.toggle('dark', systemTheme === 'dark');
      } else {
        root.classList.toggle('dark', theme === 'dark');
      }
    };

    applyTheme(theme);
  }, [theme]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
};

export default App;