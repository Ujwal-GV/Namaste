import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast';
import { BreadcrumbProvider } from './context/BreadcrumbContext.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={ queryClient }>
    <AuthProvider>
      <BreadcrumbProvider>
        <App />
      </BreadcrumbProvider>
      <Toaster />
    </AuthProvider>
  </QueryClientProvider>
)
