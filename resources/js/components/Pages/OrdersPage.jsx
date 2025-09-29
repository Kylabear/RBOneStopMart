import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { 
    EyeIcon, 
    TruckIcon, 
    BuildingStorefrontIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';

const OrdersPage = () => {
    const { data: orders, isLoading } = useQuery(
        'user-orders',
        () => axios.get('/api/orders').then(res => res.data)
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
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-500/20';
            case 'confirmed': return 'text-blue-400 bg-blue-500/20';
            case 'preparing': return 'text-orange-400 bg-orange-500/20';
            case 'ready': return 'text-green-400 bg-green-500/20';
            case 'delivered': return 'text-green-500 bg-green-500/20';
            case 'cancelled': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-600 bg-gray-500/20';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black mb-4">My Orders</h1>
                    <p className="text-gray-700">Track and manage your orders</p>
                </div>

                {orders?.data?.length > 0 ? (
                    <div className="space-y-6">
                        {orders.data.map((order) => (
                            <div key={order.id} className="glass-card rounded-2xl p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-black mb-2">
                                            Order #{order.order_number}
                                        </h3>
                                        <p className="text-gray-600">
                                            Placed on {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <Link
                                            to={`/orders/${order.id}`}
                                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            <span>View Details</span>
                                        </Link>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="flex items-center space-x-3">
                                        {order.delivery_method === 'delivery' ? (
                                            <TruckIcon className="w-5 h-5 text-blue-400" />
                                        ) : (
                                            <BuildingStorefrontIcon className="w-5 h-5 text-green-400" />
                                        )}
                                        <div>
                                            <div className="text-black font-medium">
                                                {order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup'}
                                            </div>
                                            <div className="text-gray-600 text-sm">
                                                {order.delivery_method === 'delivery' ? 'To your address' : 'At store location'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <CalendarIcon className="w-5 h-5 text-purple-400" />
                                        <div>
                                            <div className="text-black font-medium">
                                                {order.delivery_date ? formatDate(order.delivery_date) : 'Not scheduled'}
                                            </div>
                                            <div className="text-gray-600 text-sm">Delivery date</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-black">
                                            {formatPrice(order.total_amount)}
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {order.order_items?.length || 0} item(s)
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="border-t border-white/20 pt-4">
                                    <h4 className="text-black font-medium mb-3">Items:</h4>
                                    <div className="space-y-2">
                                        {order.order_items?.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-700">
                                                    {item.product?.name} × {item.quantity}
                                                </span>
                                                <span className="text-black">
                                                    {formatPrice(item.total_price)}
                                                </span>
                                            </div>
                                        ))}
                                        {order.order_items?.length > 3 && (
                                            <div className="text-gray-600 text-sm">
                                                +{order.order_items.length - 3} more item(s)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-black mb-4">No Orders Yet</h2>
                            <p className="text-gray-700 mb-6">
                                You haven't placed any orders yet. Start shopping to see your orders here.
                            </p>
                            <Link 
                                to="/products" 
                                className="bg-blue-600 hover:bg-blue-700 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
