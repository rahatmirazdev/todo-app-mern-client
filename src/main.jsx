import './index.css';
import router from './router/Route';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { verifyAppConfig } from './utils/configChecker';

// Verify configuration during app startup
const appConfig = verifyAppConfig();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router}>
        <AuthProvider>
        </AuthProvider>
      </RouterProvider>
    </ThemeProvider>
  </StrictMode>
);