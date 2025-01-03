import React from 'react';
import { GameUI } from './components/GameUI';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useThemeStore } from './store/themeStore';

const App: React.FC = () => {
  const { currentTheme } = useThemeStore();
  
  React.useEffect(() => {
    // Update cursor style based on theme
    document.body.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='${encodeURIComponent(currentTheme.cursorColor)}' stroke='rgba(255, 255, 255, 0.8)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3C/svg%3E") 12 12, auto`;
  }, [currentTheme]);
  
  return (
    <ErrorBoundary>
      <GameUI />
    </ErrorBoundary>
  );
};

export default App;