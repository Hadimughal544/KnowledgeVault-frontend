import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { applyTheme } from './store/themeStore';
import './index.css';
import App from './App.tsx';

// Apply saved theme before first paint
const saved = localStorage.getItem('kv-theme');
if (saved) {
  try {
    const { state } = JSON.parse(saved);
    if (state?.theme) applyTheme(state.theme);
  } catch {
    applyTheme('system');
  }
} else {
  applyTheme('system');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
