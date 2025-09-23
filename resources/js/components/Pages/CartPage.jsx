import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const CartPage = () => {
    const { cartItems, loading, updateCartItem, removeFromCart, getCartTotal } = useCart();

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            await removeFromCart(cartItemId);
        } else {
            await updateCartItem(cartItemId, newQuantity);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    const hasDryGoods = cartItems?.some(item => item.product.category.slug === 'dry-goods');
    const canDeliver = cartItems?.every(item => item.product.category.allows_delivery);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
                            <p className="text-gray-300 mb-6">
                                Add some products to your cart to get started.
                            </p>
                            <Link 
                                to="/products" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Shopping Cart</h1>
                    <p className="text-gray-300">{cartItems.length} item(s) in your cart</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="glass-card rounded-2xl p-6">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Product Image */}
                                        <div className="sm:w-24 sm:h-24 w-full h-32">
                                            {item.product.image ? (
                                                <img 
                                                    src={`/storage/${item.product.image}`} 
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <span className="text-2xl font-bold text-white">
                                                        {item.product.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-1">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="text-sm text-blue-400">
                                                        {item.product.category.name}
                                                    </p>
                                                    {!item.product.category.allows_delivery && (
                                                        <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                                                            Pickup Only
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-red-400 hover:text-red-300 transition-colors"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        className="p-1 glass rounded-lg hover:bg-white/10 transition-colors"
                                                    >
                                                        <MinusIcon className="w-4 h-4 text-white" />
                                                    </button>
                                                    <span className="text-white font-semibold min-w-[2rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="p-1 glass rounded-lg hover:bg-white/10 transition-colors"
                                                    >
                                                        <PlusIcon className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-white">
                                                        {formatPrice(item.quantity * item.product.price)}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {formatPrice(item.product.price)} each
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(getCartTotal())}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Delivery Fee</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t border-white/20 pt-4">
                                    <div className="flex justify-between text-lg font-bold text-white">
                                        <span>Total</span>
                                        <span>{formatPrice(getCartTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Restrictions Notice */}
                            {hasDryGoods && (
                                <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                                    <p className="text-yellow-200 text-sm">
                                        <strong>Note:</strong> Your cart contains Dry Goods items which are pickup only. 
                                        Delivery option will not be available.
                                    </p>
                                </div>
                            )}

                            <Link 
                                to="/checkout" 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center block"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link 
                                to="/products" 
                                className="w-full glass-button text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center block mt-3"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
