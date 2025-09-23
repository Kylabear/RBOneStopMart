import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
    ShoppingCartIcon, 
    UserGroupIcon, 
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../UI/LoadingSpinner';

const AdminDashboard = () => {
    const { data: dashboardData, isLoading } = useQuery(
        'admin-dashboard',
        () => axios.get('/api/admin/dashboard').then(res => res.data)
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    const stats = dashboardData?.stats || {};
    const recentOrders = dashboardData?.recent_orders || [];
    const lowStockProducts = dashboardData?.low_stock_products || [];

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
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

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
                    <p className="text-gray-300">Welcome to R&B One Stop Mart Admin Panel</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Orders</p>
                                <p className="text-2xl font-bold text-white">{stats.total_orders || 0}</p>
                            </div>
                            <ShoppingCartIcon className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Pending Orders</p>
                                <p className="text-2xl font-bold text-white">{stats.pending_orders || 0}</p>
                            </div>
                            <ClockIcon className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold text-white">{formatPrice(stats.total_revenue || 0)}</p>
                            </div>
                            <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Products</p>
                                <p className="text-2xl font-bold text-white">{stats.total_products || 0}</p>
                            </div>
                            <CheckCircleIcon className="w-8 h-8 text-purple-400" />
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Customers</p>
                                <p className="text-2xl font-bold text-white">{stats.total_customers || 0}</p>
                            </div>
                            <UserGroupIcon className="w-8 h-8 text-indigo-400" />
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Low Stock Items</p>
                                <p className="text-2xl font-bold text-white">{lowStockProducts.length}</p>
                            </div>
                            <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Recent Orders</h2>
                        {recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 glass rounded-lg">
                                        <div>
                                            <div className="text-white font-medium">#{order.order_number}</div>
                                            <div className="text-gray-400 text-sm">{order.user?.name}</div>
                                            <div className="text-gray-400 text-sm">{formatPrice(order.total_amount)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-4">No recent orders</p>
                        )}
                    </div>

                    {/* Low Stock Products */}
                    <div className="glass-card rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Low Stock Products</h2>
                        {lowStockProducts.length > 0 ? (
                            <div className="space-y-4">
                                {lowStockProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between p-4 glass rounded-lg">
                                        <div>
                                            <div className="text-white font-medium">{product.name}</div>
                                            <div className="text-gray-400 text-sm">{product.category?.name}</div>
                                        </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-red-400 font-semibold">
                                                {product.stock_quantity} left
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                {formatPrice(product.price)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-4">All products are well stocked</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
