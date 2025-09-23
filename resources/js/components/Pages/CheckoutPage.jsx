import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { 
    TruckIcon, 
    BuildingStorefrontIcon,
    CreditCardIcon,
    PhoneIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        delivery_method: 'pickup',
        payment_method: 'cod',
        delivery_address: user?.address || '',
        contact_phone: user?.phone || '',
        notes: '',
        delivery_date: '',
    });

    const hasDryGoods = cartItems?.some(item => item.product.category.slug === 'dry-goods');
    const canDeliver = cartItems?.every(item => item.product.category.allows_delivery);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                delivery_address: formData.delivery_method === 'delivery' ? formData.delivery_address : null,
                delivery_date: formData.delivery_date ? new Date(formData.delivery_date).toISOString() : null,
            };

            const response = await axios.post('/api/orders', orderData);
            
            toast.success('Order placed successfully!');
            await clearCart();
            navigate('/orders');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    if (!cartItems || cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Checkout</h1>
                    <p className="text-gray-300">Complete your order</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Method */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <TruckIcon className="w-6 h-6 mr-2" />
                                Delivery Method
                            </h2>
                            
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="delivery_method"
                                        value="pickup"
                                        checked={formData.delivery_method === 'pickup'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <BuildingStorefrontIcon className="w-5 h-5 text-white" />
                                    <div>
                                        <div className="text-white font-medium">Pickup</div>
                                        <div className="text-gray-400 text-sm">Pick up your order at our store</div>
                                    </div>
                                </label>

                                {canDeliver && (
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="delivery_method"
                                            value="delivery"
                                            checked={formData.delivery_method === 'delivery'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <TruckIcon className="w-5 h-5 text-white" />
                                        <div>
                                            <div className="text-white font-medium">Delivery</div>
                                            <div className="text-gray-400 text-sm">Get your order delivered to your address</div>
                                        </div>
                                    </label>
                                )}

                                {hasDryGoods && (
                                    <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                                        <p className="text-yellow-200 text-sm">
                                            <strong>Note:</strong> Your cart contains Dry Goods items which are pickup only. 
                                            Delivery option is not available for these items.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Address */}
                            {formData.delivery_method === 'delivery' && (
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Delivery Address
                                    </label>
                                    <textarea
                                        name="delivery_address"
                                        value={formData.delivery_address}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Enter your delivery address"
                                    />
                                </div>
                            )}

                            {/* Delivery Date */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Preferred Delivery/Pickup Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="delivery_date"
                                    value={formData.delivery_date}
                                    onChange={handleChange}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full px-4 py-3 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <PhoneIcon className="w-6 h-6 mr-2" />
                                Contact Information
                            </h2>
                            
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    name="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <CreditCardIcon className="w-6 h-6 mr-2" />
                                Payment Method
                            </h2>
                            
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="cod"
                                        checked={formData.payment_method === 'cod'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <div>
                                        <div className="text-white font-medium">Cash on Delivery (COD)</div>
                                        <div className="text-gray-400 text-sm">Pay when you receive your order</div>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="gcash"
                                        checked={formData.payment_method === 'gcash'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <div>
                                        <div className="text-white font-medium">GCash</div>
                                        <div className="text-gray-400 text-sm">Pay via GCash mobile payment</div>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="paymaya"
                                        checked={formData.payment_method === 'paymaya'}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <div>
                                        <div className="text-white font-medium">PayMaya</div>
                                        <div className="text-gray-400 text-sm">Pay via PayMaya mobile payment</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Order Notes */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Order Notes</h2>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Any special instructions for your order..."
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex-1">
                                            <div className="text-white font-medium text-sm">
                                                {item.product.name}
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                {item.quantity} × {formatPrice(item.product.price)}
                                            </div>
                                        </div>
                                        <div className="text-white font-semibold">
                                            {formatPrice(item.quantity * item.product.price)}
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="border-t border-white/20 pt-4">
                                    <div className="flex justify-between text-gray-300 mb-2">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(getCartTotal())}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300 mb-2">
                                        <span>Delivery Fee</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-white">
                                        <span>Total</span>
                                        <span>{formatPrice(getCartTotal())}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner size="small" className="mr-2" />
                                        Placing Order...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
