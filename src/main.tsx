import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { soundEffects } from './lib/audio/SoundEffects';

console.log('Starting application...');

// Initialize sound effects
soundEffects;

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find root element');
  throw new Error('Failed to find the root element');
}

console.log('Root element found, creating React root');

try {
  const root = createRoot(rootElement);
  console.log('React root created, rendering App');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('Initial render complete');
} catch (error) {
  console.error('Error during application initialization:', error);
  throw error;
}