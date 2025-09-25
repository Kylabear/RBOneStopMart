import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from '../../config/axios';
import { useAuth } from '../../hooks/useAuth';
import { 
    ShoppingCartIcon, 
    TruckIcon, 
    CreditCardIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import ProductCard from '../UI/ProductCard';
import toast from 'react-hot-toast';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const { data: featuredProducts, isLoading: productsLoading } = useQuery(
        'featured-products',
        () => axios.get('/api/products/featured').then(res => res.data)
    );

    const { data: categories, isLoading: categoriesLoading } = useQuery(
        'categories',
        () => axios.get('/api/categories').then(res => res.data)
    );

    const handleShopNow = () => {
        if (!user) {
            toast.error('Please login to browse our products');
            navigate('/login');
            return;
        }
        navigate('/products');
    };

    const handleViewAllProducts = () => {
        if (!user) {
            toast.error('Please login to view all products');
            navigate('/login');
            return;
        }
        navigate('/products');
    };

    const handleCategoryClick = (categorySlug) => {
        if (!user) {
            toast.error('Please login to browse products by category');
            navigate('/login');
            return;
        }
        navigate(`/products?category=${categorySlug}`);
    };

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

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={handleShopNow}
                                className="glass-button px-8 py-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                            >
                                Shop Now
                            </button>
                            <button
                                className="glass-button px-8 py-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                                onClick={() => {
                                    const footer = document.querySelector('footer');
                                    if (footer) {
                                        footer.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                Contact
                            </button>
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
                                <button 
                                    key={category.id} 
                                    onClick={() => handleCategoryClick(category.slug)}
                                    className="glass-card rounded-2xl p-8 text-center hover:scale-105 transition-transform group w-full"
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
                                </button>
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
                        <button 
                            onClick={handleViewAllProducts}
                            className="glass-button px-8 py-4 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                        >
                            View All Products
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
