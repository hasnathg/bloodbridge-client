import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import { router } from './router/Router.jsx';
import AuthProvider from './provider/AuthProvider.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <div className='font-urbanist'>
       <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
    </QueryClientProvider>
    </div>
    </AuthProvider>
    
  </StrictMode>,
)
