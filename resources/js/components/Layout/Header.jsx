import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
    MagnifyingGlassIcon, 
    HeartIcon, 
    ShoppingCartIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navigationLinks = [
        { name: 'Home', href: '/' },
        { name: 'Contact', href: '#footer' },
        { name: 'About', href: '#about' },
    ];

    return (
        <>
            {/* Main Header */}
            <header className="bg-[#CCFFCC] shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center space-x-3 p-2">
                                <img 
                                    src="/RBLOGO.png" 
                                    alt="R&B One Stop Mart Logo" 
                                    className="h-10 sm:h-12 md:h-14 w-auto drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300 filter brightness-110"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-gray-800 hover:text-blue-600 font-medium transition-colors duration-200"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="What are you looking for?"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        <MagnifyingGlassIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Wishlist */}
                            <button className="p-2 text-gray-800 hover:text-red-500 transition-colors">
                                <HeartIcon className="w-6 h-6" />
                            </button>

                            {/* Cart */}
                            <Link to="/cart" className="p-2 text-gray-800 hover:text-blue-600 transition-colors relative">
                                <ShoppingCartIcon className="w-6 h-6" />
                                {/* Cart Badge */}
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            {/* User Account */}
                            {user ? (
                                <div className="relative group">
                                    <button className="p-2 text-gray-800 hover:text-blue-600 transition-colors">
                                        <UserIcon className="w-6 h-6" />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            My Orders
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link 
                                    to="/login" 
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Sign Up
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-gray-800 hover:text-blue-600 transition-colors"
                            >
                                {isMobileMenuOpen ? (
                                    <XMarkIcon className="w-6 h-6" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 py-4">
                            {/* Mobile Navigation */}
                            <nav className="space-y-2">
                                {navigationLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className="block px-4 py-2 text-gray-800 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile Search */}
                            <div className="mt-4 px-4">
                                <form onSubmit={handleSearch}>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="What are you looking for?"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                        >
                                            <MagnifyingGlassIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;