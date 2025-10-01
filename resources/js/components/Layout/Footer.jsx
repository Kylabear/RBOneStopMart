import React from 'react';
import {
    PhoneIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
    return (
        <footer id="footer" className="bg-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Business Info */}
                    <div>
                        <h3 className="text-xl font-bold text-black mb-4">R&B One Stop Mart</h3>
                        <p className="text-gray-700 mb-4">
                            Your one-stop destination for Grocery, Dry Goods, and Farm Supply needs.
                        </p>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-4">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <PhoneIcon className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">09123968514</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">R&BOneStopMart@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-700">+639686654565 (WhatsApp)</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <a href="/products" className="block text-gray-700 hover:text-black transition-colors">
                                Products
                            </a>
                            <a href="/orders" className="block text-gray-700 hover:text-black transition-colors">
                                My Orders
                            </a>
                            <a href="/cart" className="block text-gray-700 hover:text-black transition-colors">
                                Shopping Cart
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-700 text-sm">
                            © 2024 R&B One Stop Mart. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-700 hover:text-black transition-colors text-sm">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
