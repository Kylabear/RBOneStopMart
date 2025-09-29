import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from '../../../config/axios';
import { 
    ShoppingCartIcon, 
    UserGroupIcon, 
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    ClockIcon,
    CheckCircleIcon,
    ChartBarIcon,
    CubeIcon,
    TagIcon,
    ArrowTrendingUpIcon,
    UsersIcon,
    ClipboardDocumentListIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../UI/LoadingSpinner';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

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
    const fastMovingProducts = dashboardData?.fast_moving_products || [];
    const categoryAnalytics = dashboardData?.category_analytics || {};

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
            default: return 'text-gray-600';
        }
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: ChartBarIcon },
        { id: 'analytics', name: 'Analytics', icon: ArrowTrendingUpIcon },
        { id: 'users', name: 'User Management', icon: UsersIcon },
        { id: 'inventory', name: 'Inventory', icon: CubeIcon },
        { id: 'orders', name: 'Orders', icon: ClipboardDocumentListIcon }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 admin-page">
            {/* Header */}
            <div className="glass-card shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
                        <p className="text-gray-700 mt-2">Manage your R&B One Stop Mart store</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="mb-8">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Orders</p>
                                        <p className="text-2xl font-bold text-black">{stats.total_orders || 0}</p>
                                    </div>
                                    <ShoppingCartIcon className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>

                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Revenue</p>
                                        <p className="text-2xl font-bold text-black">{formatPrice(stats.total_revenue || 0)}</p>
                                    </div>
                                    <CurrencyDollarIcon className="w-8 h-8 text-green-500" />
                                </div>
                            </div>

                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Customers</p>
                                        <p className="text-2xl font-bold text-black">{stats.total_customers || 0}</p>
                                    </div>
                                    <UserGroupIcon className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>

                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Low Stock Items</p>
                                        <p className="text-2xl font-bold text-black">{stats.low_stock_count || 0}</p>
                                    </div>
                                    <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Link
                                    to="/admin/products"
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <TagIcon className="w-6 h-6 text-blue-500" />
                                    <span className="text-black">Manage Products</span>
                                </Link>
                                <Link
                                    to="/admin/orders"
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <ClipboardDocumentListIcon className="w-6 h-6 text-green-500" />
                                    <span className="text-black">View Orders</span>
                                </Link>
                                <Link
                                    to="/admin/inventory"
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <CubeIcon className="w-6 h-6 text-orange-500" />
                                    <span className="text-black">Inventory</span>
                                </Link>
                                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <UsersIcon className="w-6 h-6 text-purple-500" />
                                    <span className="text-black">Manage Users</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">Recent Orders</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-black">Order #</th>
                                            <th className="text-left py-3 px-4 text-black">Customer</th>
                                            <th className="text-left py-3 px-4 text-black">Amount</th>
                                            <th className="text-left py-3 px-4 text-black">Status</th>
                                            <th className="text-left py-3 px-4 text-black">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.slice(0, 5).map((order) => (
                                            <tr key={order.id} className="border-b">
                                                <td className="py-3 px-4 text-black">{order.order_number}</td>
                                                <td className="py-3 px-4 text-black">{order.user?.name || 'N/A'}</td>
                                                <td className="py-3 px-4 text-black">{formatPrice(order.total_amount)}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-black">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        {/* Category Performance */}
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">Category Performance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.entries(categoryAnalytics).map(([category, data]) => (
                                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-black capitalize">{category}</h4>
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Sales:</span>
                                                <span className="text-black font-semibold">{formatPrice(data.total_sales || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Orders:</span>
                                                <span className="text-black font-semibold">{data.order_count || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Products:</span>
                                                <span className="text-black font-semibold">{data.product_count || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fast Moving Products */}
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">Fast Moving Products (Grocery)</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-black">Product</th>
                                            <th className="text-left py-3 px-4 text-black">Category</th>
                                            <th className="text-left py-3 px-4 text-black">Units Sold</th>
                                            <th className="text-left py-3 px-4 text-black">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fastMovingProducts.slice(0, 10).map((product) => (
                                            <tr key={product.id} className="border-b">
                                                <td className="py-3 px-4 text-black">{product.name}</td>
                                                <td className="py-3 px-4 text-black capitalize">{product.category?.name || 'N/A'}</td>
                                                <td className="py-3 px-4 text-black">{product.total_quantity_sold || 0}</td>
                                                <td className="py-3 px-4 text-black">{formatPrice(product.total_revenue || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Management Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-8">
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">User Management</h3>
                            <p className="text-gray-600 mb-4">Manage customer accounts and permissions</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Total Users</h4>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">{stats.total_customers || 0}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Active Users</h4>
                                    <p className="text-2xl font-bold text-green-600 mt-2">{stats.active_users || 0}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">New This Month</h4>
                                    <p className="text-2xl font-bold text-purple-600 mt-2">{stats.new_users_this_month || 0}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    View All Users
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="space-y-8">
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">Inventory Overview</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Total Products</h4>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">{stats.total_products || 0}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Low Stock Items</h4>
                                    <p className="text-2xl font-bold text-red-600 mt-2">{stats.low_stock_count || 0}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Out of Stock</h4>
                                    <p className="text-2xl font-bold text-orange-600 mt-2">{stats.out_of_stock_count || 0}</p>
                                </div>
                            </div>

                            <Link
                                to="/admin/inventory"
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Manage Inventory
                            </Link>
                        </div>

                        {/* Low Stock Alert */}
                        {lowStockProducts.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-red-800 mb-4">Low Stock Alert</h3>
                                <div className="space-y-2">
                                    {lowStockProducts.slice(0, 5).map((product) => (
                                        <div key={product.id} className="flex justify-between items-center p-2 glass-card rounded">
                                            <span className="text-black">{product.name}</span>
                                            <span className="text-red-600 font-semibold">Stock: {product.stock_quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-8">
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">Order Management</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Pending</h4>
                                    <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending_orders || 0}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Confirmed</h4>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">{stats.confirmed_orders || 0}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Ready</h4>
                                    <p className="text-2xl font-bold text-green-600 mt-2">{stats.ready_orders || 0}</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-black">Delivered</h4>
                                    <p className="text-2xl font-bold text-purple-600 mt-2">{stats.delivered_orders || 0}</p>
                                </div>
                            </div>

                            <Link
                                to="/admin/orders"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                View All Orders
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;