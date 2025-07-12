import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import { router } from './router/Router.jsx';
import AuthProvider from './provider/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <div className='font-urbanist max-w-7xl mx-auto'>
      <RouterProvider router={router} />
    </div>
    </AuthProvider>
    
  </StrictMode>,
)
