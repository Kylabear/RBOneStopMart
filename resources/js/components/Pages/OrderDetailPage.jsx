import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from '../../config/axios';
import { 
    ArrowLeftIcon, 
    TruckIcon, 
    BuildingStorefrontIcon,
    CreditCardIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: order, isLoading } = useQuery(
        ['order', id],
        () => axios.get(`/api/orders/${id}`).then(res => res.data)
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-400';
            case 'confirmed': return 'text-blue-400';
            case 'preparing': return 'text-orange-400';
            case 'ready': return 'text-green-400';
            case 'delivered': return 'text-green-500';
            case 'cancelled': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
                    <p className="text-gray-300 mb-6">The order you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors mb-8"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back to Orders</span>
                </button>

                <div className="space-y-8">
                    {/* Order Header */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    Order #{order.order_number}
                                </h1>
                                <p className="text-gray-400">
                                    Placed on {formatDate(order.created_at)}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center space-x-3">
                                {order.delivery_method === 'delivery' ? (
                                    <TruckIcon className="w-6 h-6 text-blue-400" />
                                ) : (
                                    <BuildingStorefrontIcon className="w-6 h-6 text-green-400" />
                                )}
                                <div>
                                    <div className="text-white font-medium">
                                        {order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup'}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {order.delivery_method === 'delivery' ? 'To your address' : 'At store location'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <CreditCardIcon className="w-6 h-6 text-purple-400" />
                                <div>
                                    <div className="text-white font-medium">
                                        {order.payment_method.toUpperCase()}
                                    </div>
                                    <div className="text-gray-400 text-sm">Payment method</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-6 h-6 text-orange-400" />
                                <div>
                                    <div className="text-white font-medium">
                                        {order.delivery_date ? formatDate(order.delivery_date) : 'Not scheduled'}
                                    </div>
                                    <div className="text-gray-400 text-sm">Delivery date</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Order Items</h2>
                        <div className="space-y-4">
                            {order.order_items?.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 p-4 glass rounded-lg">
                                    <div className="w-16 h-16 flex-shrink-0">
                                        {item.product?.image ? (
                                            <img 
                                                src={`/storage/${item.product.image}`} 
                                                alt={item.product.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <span className="text-xl font-bold text-white">
                                                    {item.product?.name?.charAt(0) || '?'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium">{item.product?.name}</h3>
                                        <p className="text-gray-400 text-sm">{item.product?.category?.name}</p>
                                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                                    </div>
                                    
                                    <div className="text-right">
                                        <div className="text-white font-semibold">
                                            {formatPrice(item.total_price)}
                                        </div>
                                        <div className="text-gray-400 text-sm">
                                            {formatPrice(item.unit_price)} each
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-300">
                                <span>Subtotal</span>
                                <span>{formatPrice(order.total_amount)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Delivery Fee</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t border-white/20 pt-4">
                                <div className="flex justify-between text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    {order.delivery_address && (
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <MapPinIcon className="w-6 h-6 mr-2" />
                                Delivery Address
                            </h2>
                            <p className="text-gray-300">{order.delivery_address}</p>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <PhoneIcon className="w-6 h-6 mr-2" />
                            Contact Information
                        </h2>
                        <div className="space-y-2">
                            <p className="text-gray-300">
                                <span className="font-medium">Phone:</span> {order.contact_phone}
                            </p>
                            {order.notes && (
                                <div>
                                    <p className="font-medium text-white mb-1">Notes:</p>
                                    <p className="text-gray-300">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
