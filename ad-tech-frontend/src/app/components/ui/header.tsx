'use client';

import { useTheme } from '@/app/context/ThemeContext'; // Import the useTheme hook
import { FaMoon, FaSun } from 'react-icons/fa'; // Import icons for moon and sun (you'll need to install react-icons)

const Header = () => {
  const { theme, toggleTheme } = useTheme(); // Access theme and toggle function

  return (
    <header className="flex justify-between items-center p-4 dark:bg-[#1e1e1e] text-gray-900 dark:text-white shadow-sm transition-all duration-300">
      <h1 className="text-lg font-semibold"></h1>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className="flex items-center space-x-2 p-2 rounded-2xl bg-[#f1f4f5] dark:bg-black  dark:shadow-[-10px_-10px_30px_4px_rgba(0,0,0,0.1),_10px_10px_30px_4px_rgba(45,78,255,0.15)] hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
      >
        {theme === 'light' ? (
          <FaMoon className="text-xl" /> // Moon icon for light mode
        ) : (
          <FaSun className="text-xl" /> // Sun icon for dark mode
        )}
        <span className="hidden sm:block">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
      </button>
    </header>
  );
};

export default Header;
