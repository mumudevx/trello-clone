import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

// StrictMode is disabled because it can cause issues with react-beautiful-dnd
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode> - removed StrictMode to fix drag-and-drop issues
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
  // </React.StrictMode>
)
