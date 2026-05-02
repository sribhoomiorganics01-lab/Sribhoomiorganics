import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="67087531073-cbrr6gfe310lmsssbttj97k3rs8hrh95.apps.googleusercontent.com">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <App />
              <Toaster
                position="top-right"
                  containerStyle={{
                   top: '70px',   
                   right: '12px'
                  }}
                toastOptions={{
                  duration: 1000,
                  style: {
                    background: '#2e7d32',
                    color: '#fff',
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
