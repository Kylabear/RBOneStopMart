import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import App from './components/App';
import '../css/app.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

        ReactDOM.createRoot(document.getElementById('app')).render(
            <React.StrictMode>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <CartProvider>
                            <BrowserRouter>
                                <App />
                                <Toaster 
                                    position="top-center"
                                    toastOptions={{
                                        duration: 4000,
                                        style: {
                                            background: 'rgba(0, 0, 0, 0.95)',
                                            backdropFilter: 'blur(20px)',
                                            border: '2px solid rgba(236, 72, 153, 0.4)',
                                            color: '#ffffff',
                                            borderRadius: '20px',
                                            padding: '20px 32px',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
                                            maxWidth: '450px',
                                            textAlign: 'center',
                                            zIndex: 99999,
                                        },
                                        success: {
                                            style: {
                                                background: 'rgba(34, 197, 94, 0.95)',
                                                border: '2px solid rgba(34, 197, 94, 0.6)',
                                                color: '#ffffff',
                                                boxShadow: '0 12px 40px rgba(34, 197, 94, 0.3)',
                                            },
                                        },
                                        error: {
                                            style: {
                                                background: 'rgba(239, 68, 68, 0.95)',
                                                border: '2px solid rgba(239, 68, 68, 0.6)',
                                                color: '#ffffff',
                                                boxShadow: '0 12px 40px rgba(239, 68, 68, 0.3)',
                                            },
                                        },
                                    }}
                                />
                            </BrowserRouter>
                        </CartProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </React.StrictMode>
        );
