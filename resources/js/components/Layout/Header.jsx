import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
    ShoppingCartIcon, 
    UserIcon, 
    Bars3Icon, 
    XMarkIcon,
    MagnifyingGlassIcon,
    HomeIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import NotificationBell from '../UI/NotificationBell';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <header className="glass-over-galaxy sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingBagIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">R&B One Stop Mart</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-1 text-white hover:text-blue-300 transition-colors">
                            <HomeIcon className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <Link to="/products" className="text-white hover:text-blue-300 transition-colors">
                            Products
                        </Link>
                        {user && !user.isAdmin() && (
                            <>
                                <Link to="/cart" className="relative flex items-center space-x-1 text-white hover:text-blue-300 transition-colors">
                                    <ShoppingCartIcon className="w-5 h-5" />
                                    <span>Cart</span>
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/orders" className="text-white hover:text-blue-300 transition-colors">
                                    Orders
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <NotificationBell />
                                <div className="flex items-center space-x-2">
                                    <UserIcon className="w-5 h-5 text-white" />
                                    <span className="text-white">{user.name}</span>
                                </div>
                                {user.isAdmin() && (
                                    <Link 
                                        to="/admin" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button 
                                    onClick={handleLogout}
                                    className="text-white hover:text-red-300 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/login" 
                                    className="text-white hover:text-blue-300 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="text-white hover:text-blue-300 transition-colors"
                        >
                            <MagnifyingGlassIcon className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-blue-300 transition-colors"
                        >
                            {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden glass-over-galaxy rounded-lg mt-2 p-4">
                        <nav className="flex flex-col space-y-4">
                            <Link 
                                to="/" 
                                className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <HomeIcon className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <Link 
                                to="/products" 
                                className="text-white hover:text-blue-300 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </Link>
                            {user && !user.isAdmin() && (
                                <>
                                    <Link 
                                        to="/cart" 
                                        className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <ShoppingCartIcon className="w-4 h-4" />
                                        <span>Cart ({cartItemCount})</span>
                                    </Link>
                                    <Link 
                                        to="/orders" 
                                        className="text-white hover:text-blue-300 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Orders
                                    </Link>
                                </>
                            )}
                            {user ? (
                                <div className="border-t border-white/20 pt-4">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <UserIcon className="w-4 h-4 text-white" />
                                        <span className="text-white">{user.name}</span>
                                    </div>
                                    {user.isAdmin() && (
                                        <Link 
                                            to="/admin" 
                                            className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mb-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button 
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-white hover:text-red-300 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-white/20 pt-4 flex flex-col space-y-2">
                                    <Link 
                                        to="/login" 
                                        className="text-white hover:text-blue-300 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
