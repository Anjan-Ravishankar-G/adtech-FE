'use client';
import { useTheme } from '@/app/context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="flex justify-between items-center p-4 bg-[#f1f4f5] dark:bg-[#1e1e1e] text-gray-900 dark:text-white shadow-sm transition-all duration-300">
      <h1 className="text-lg font-semibold"></h1>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className="flex items-center space-x-2 p-2 rounded-2xl bg-white dark:bg-black  dark:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
      >
        {theme === 'light' ? (
          <FaMoon className="text-xl" />
        ) : (
          <FaSun className="text-xl text-yellow-400" />
        )}
        <span className="hidden sm:block">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
      </button>
    </header>
  );
};

export default Header;