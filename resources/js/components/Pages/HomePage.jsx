import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
    ShoppingCartIcon, 
    TruckIcon, 
    CreditCardIcon,
    PhoneIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import ProductCard from '../UI/ProductCard';

const HomePage = () => {
    const { data: featuredProducts, isLoading: productsLoading } = useQuery(
        'featured-products',
        () => axios.get('/api/products/featured').then(res => res.data)
    );

    const { data: categories, isLoading: categoriesLoading } = useQuery(
        'categories',
        () => axios.get('/api/categories').then(res => res.data)
    );

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Welcome to{' '}
                            <span className="gradient-text">R&B One Stop Mart</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Your one-stop destination for Grocery, Dry Goods, and Farm Supply needs. 
                            Shop with convenience and get your orders delivered or pick them up.
                        </p>
                        
                        {/* Contact Information */}
                        <div className="glass-card rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <PhoneIcon className="w-6 h-6 text-blue-400" />
                                    <span className="text-white">09123968514</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <EnvelopeIcon className="w-6 h-6 text-blue-400" />
                                    <span className="text-white">R&BOneStopMart@gmail.com</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-400" />
                                    <span className="text-white">+639686654565 (WhatsApp)</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-white">Facebook: Brenda Bangachon</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                to="/products" 
                                className="glass-button px-8 py-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                            >
                                Shop Now
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <ShoppingCartIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-4">Easy Shopping</h3>
                            <p className="text-gray-300">
                                Browse our wide selection of products with an intuitive shopping experience.
                            </p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <TruckIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-4">Delivery & Pickup</h3>
                            <p className="text-gray-300">
                                Choose between delivery or pickup options for your convenience.
                            </p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <CreditCardIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-4">Multiple Payment</h3>
                            <p className="text-gray-300">
                                Pay with COD, GCash, or PayMaya - whatever works best for you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Our Categories</h2>
                    {categoriesLoading ? (
                        <div className="flex justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {categories?.map((category) => (
                                <Link 
                                    key={category.id} 
                                    to={`/products?category=${category.slug}`}
                                    className="glass-card rounded-2xl p-8 text-center hover:scale-105 transition-transform group"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white">
                                            {category.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-300 mb-4">{category.description}</p>
                                    <div className="text-sm text-blue-400">
                                        {category.products_count} products
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Featured Products</h2>
                    {productsLoading ? (
                        <div className="flex justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts?.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-8">
                        <Link 
                            to="/products" 
                            className="glass-button px-8 py-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
