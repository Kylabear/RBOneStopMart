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
import PromotionalCarousel from '../UI/PromotionalCarousel';
import toast from 'react-hot-toast';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const { data: categories, isLoading: categoriesLoading } = useQuery(
        'categories',
        () => axios.get('/api/categories').then(res => res.data)
    );

    // Promotional slides data based on business categories
    const promotionalSlides = [
        {
            image: '/GROCERRY.jpg',
            logo: '/RBLOGO.png',
            title: 'Groceries',
            subtitle: 'Farm to Table Quality',
            offer: 'Free Delivery on Selected Areas',
            buttonText: 'Shop Now',
            onClick: () => navigate('/products?category=grocery')
        },
        {
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            logo: '/RBLOGO.png',
            title: 'Dry Goods',
            subtitle: 'Premium Quality Essentials',
            offer: 'Buy 2 Get 1 Free',
            buttonText: 'Shop Now',
            onClick: () => navigate('/products?category=dry-goods')
        },
        {
            image: '/FARM.jpg',
            logo: '/RBLOGO.png',
            title: 'Farm Supply',
            subtitle: 'Everything for Your Farm',
            offer: 'Bulk Discounts Available',
            buttonText: 'Shop Now',
            onClick: () => navigate('/products?category=farm-supply')
        },
        {
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            logo: '/RBLOGO.png',
            title: 'Produce',
            subtitle: 'Daily Vegetables & Fruits',
            offer: '20% Off on Bulk Orders',
            buttonText: 'Shop Now',
            onClick: () => navigate('/products?category=produce')
        },
        {
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            logo: '/RBLOGO.png',
            title: 'Dairy Products',
            subtitle: 'Milk, Cheese & Yogurt',
            offer: 'Free Delivery on Orders Over $30',
            buttonText: 'Shop Now',
            onClick: () => navigate('/products?category=dairy')
        },
        {
            image: 'https://images.unsplash.com/photo-1581636625402-29b2e704e6a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            logo: '/RBLOGO.png',
            title: 'Beverages',
            subtitle: 'Soft Drinks, Juices & Water',
            offer: 'Buy 3 Get 1 Free',
            buttonText: 'Shop Now',
            onClick: () => navigate('/products?category=beverages')
        }
    ];

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
            {/* Promotional Hero Carousel */}
            <section className="relative">
                <PromotionalCarousel 
                    slides={promotionalSlides}
                    autoPlay={true}
                    interval={6000}
                />
            </section>

            {/* Categories Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-black text-center mb-12">Our Categories</h2>
                    {categoriesLoading ? (
                        <div className="flex justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {categories?.map((category) => (
                                <button 
                                    key={category.id} 
                                    onClick={() => handleCategoryClick(category.slug)}
                                    className="glass-card rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:scale-105 transition-transform group w-full"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-black">
                                            {category.name.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-blue-300 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-700 mb-4">{category.description}</p>
                                    <div className="text-sm text-blue-400">
                                        {category.products_count} products
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-black text-center mb-12">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <ShoppingCartIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-black mb-4">Easy Shopping</h3>
                            <p className="text-gray-700">
                                Browse our wide selection of products with an intuitive shopping experience.
                            </p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <TruckIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-black mb-4">Delivery & Pickup</h3>
                            <p className="text-gray-700">
                                Choose between delivery or pickup options for your convenience.
                            </p>
                        </div>
                        <div className="glass-card rounded-2xl p-8 text-center">
                            <CreditCardIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-black mb-4">Multiple Payment</h3>
                            <p className="text-gray-700">
                                Pay with COD, GCash, or PayMaya - whatever works best for you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 about-section">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-black text-center mb-12">About Us</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-black mb-6">R&B One Stop Mart</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                We are your trusted neighborhood store, providing quality groceries, dry goods, and farm supplies to our community. 
                                With years of experience in serving our customers, we understand the importance of fresh products and reliable service.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                Our commitment is to offer the best products at competitive prices, with convenient delivery and pickup options 
                                to make your shopping experience as easy as possible.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">500+</div>
                                    <div className="text-gray-600">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">1000+</div>
                                    <div className="text-gray-600">Products Available</div>
                                </div>
                            </div>
                        </div>
                        <div className="mission-vision-section rounded-2xl p-8 text-black">
                            <h4 className="text-xl font-bold mb-4">Our Mission</h4>
                            <p className="mb-6">
                                To provide our community with high-quality groceries, dry goods, and farm supplies while maintaining 
                                excellent customer service and competitive prices.
                            </p>
                            <h4 className="text-xl font-bold mb-4">Our Vision</h4>
                            <p>
                                To be the leading one-stop mart in our community, known for quality products, 
                                reliable service, and customer satisfaction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
