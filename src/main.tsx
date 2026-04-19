import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { StudyProvider } from './context/StudyContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* AuthProvider: makes currentUser + auth methods available everywhere */}
    <AuthProvider>
      {/* StudyProvider: makes subjects + CRUD operations available everywhere */}
      <StudyProvider>
        <App />
      </StudyProvider>
    </AuthProvider>
  </StrictMode>,
);
