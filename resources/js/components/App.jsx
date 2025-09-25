import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from './Layout/Layout';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ProductsPage from './Pages/ProductsPage';
import ProductDetailPage from './Pages/ProductDetailPage';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/CheckoutPage';
import OrdersPage from './Pages/OrdersPage';
import OrderDetailPage from './Pages/OrderDetailPage';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminProducts from './Pages/Admin/AdminProducts';
import AdminOrders from './Pages/Admin/AdminOrders';
import AdminInventory from './Pages/Admin/AdminInventory';
import LoadingSpinner from './UI/LoadingSpinner';
import Galaxy from './UI/Galaxy';
import TestComponent from './TestComponent';

function App() {
    const { user, loading } = useAuth();

    if (loading) {
            return (
                <div className="min-h-screen relative flex items-center justify-center bg-black">
                    <Galaxy 
                        density={1}
                        starSpeed={0.5}
                        glowIntensity={0.3}
                        twinkleIntensity={0.3}
                        hueShift={140}
                        speed={1.0}
                        mouseInteraction={true}
                        mouseRepulsion={true}
                        repulsionStrength={2}
                        rotationSpeed={0.1}
                        saturation={0.0}
                        autoCenterRepulsion={0}
                        transparent={false}
                        className="absolute inset-0"
                    />
                    <div className="relative z-10">
                        <LoadingSpinner />
                    </div>
                </div>
            );
    }

    return (
        <div className="min-h-screen relative bg-black">
            <Galaxy 
                density={1}
                starSpeed={0.5}
                glowIntensity={0.3}
                twinkleIntensity={0.3}
                hueShift={140}
                speed={1.0}
                mouseInteraction={true}
                mouseRepulsion={true}
                repulsionStrength={2}
                rotationSpeed={0.1}
                saturation={0.0}
                autoCenterRepulsion={0}
                transparent={false}
                className="absolute inset-0"
            />
            <div className="relative z-10">
                <Routes>
                {/* Public routes */}
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.isAdmin() ? "/admin" : "/"} />} />
                <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={user.isAdmin() ? "/admin" : "/"} />} />
                
                {/* Protected customer routes */}
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
                <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
                <Route path="/cart" element={user && !user.isAdmin() ? <Layout><CartPage /></Layout> : <Navigate to="/login" />} />
                <Route path="/checkout" element={user && !user.isAdmin() ? <Layout><CheckoutPage /></Layout> : <Navigate to="/login" />} />
                <Route path="/orders" element={user && !user.isAdmin() ? <Layout><OrdersPage /></Layout> : <Navigate to="/login" />} />
                <Route path="/orders/:id" element={user && !user.isAdmin() ? <Layout><OrderDetailPage /></Layout> : <Navigate to="/login" />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={user && user.isAdmin() ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/admin/products" element={user && user.isAdmin() ? <AdminProducts /> : <Navigate to="/login" />} />
                <Route path="/admin/orders" element={user && user.isAdmin() ? <AdminOrders /> : <Navigate to="/login" />} />
                <Route path="/admin/inventory" element={user && user.isAdmin() ? <AdminInventory /> : <Navigate to="/login" />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
