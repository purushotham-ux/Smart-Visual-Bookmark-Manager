import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { AuthProvider } from './contexts/AuthContext';
import './styles/index.css';
import './styles/tailwind.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
); 