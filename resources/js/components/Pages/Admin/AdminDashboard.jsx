import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from '../../../config/axios';
import { 
    ShoppingCartIcon, 
    CurrencyDollarIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    TagIcon,
    DocumentIcon,
    CubeIcon,
    UserGroupIcon,
    ClockIcon,
    TruckIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon
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
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'confirmed': return 'text-blue-600 bg-blue-100';
            case 'start_preparing': return 'text-orange-600 bg-orange-100';
            case 'mark_ready': return 'text-green-600 bg-green-100';
            case 'out_for_delivery': return 'text-purple-600 bg-purple-100';
            case 'delivered': return 'text-green-700 bg-green-100';
            case 'processed': return 'text-green-800 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };


    const tabs = [
        { id: 'overview', name: 'Overview', icon: ChartBarIcon },
        { id: 'analytics', name: 'Analytics', icon: ArrowTrendingUpIcon },
        { id: 'manage-products', name: 'Manage Products', icon: TagIcon },
        { id: 'view-orders', name: 'View Orders', icon: DocumentIcon },
        { id: 'inventory', name: 'Inventory', icon: CubeIcon },
        { id: 'manage-users', name: 'Manage Users', icon: UserGroupIcon }
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
                                    <CheckCircleIcon className="w-8 h-8 text-purple-500" />
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

                {/* Manage Products Tab */}
                {activeTab === 'manage-products' && (
                    <div className="space-y-8">
                        {/* Product Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Products</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.products?.total || 0}</p>
                                    </div>
                                    <TagIcon className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Active Products</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.products?.active || 0}</p>
                                    </div>
                                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Low Stock</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.products?.low_stock || 0}</p>
                                    </div>
                                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">All Products</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-black">Product</th>
                                            <th className="text-left py-3 px-4 text-black">Category</th>
                                            <th className="text-left py-3 px-4 text-black">Price</th>
                                            <th className="text-left py-3 px-4 text-black">Stock</th>
                                            <th className="text-left py-3 px-4 text-black">Status</th>
                                            <th className="text-left py-3 px-4 text-black">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData?.products?.data?.map((product) => (
                                            <tr key={product.id} className="border-b">
                                                <td className="py-3 px-4 text-black">{product.name}</td>
                                                <td className="py-3 px-4 text-black capitalize">{product.category?.name || 'N/A'}</td>
                                                <td className="py-3 px-4 text-black">{formatPrice(product.price)}</td>
                                                <td className="py-3 px-4 text-black">{product.stock_quantity}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        product.is_active ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                                                    }`}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-800">
                                                            <CheckIcon className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-800">
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Orders Tab */}
                {activeTab === 'view-orders' && (
                    <div className="space-y-8">
                        {/* Order Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Pending</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.stats?.pending_orders || 0}</p>
                                    </div>
                                    <ClockIcon className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Confirmed</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.stats?.confirmed_orders || 0}</p>
                                    </div>
                                    <CheckCircleIcon className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Ready</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.stats?.ready_orders || 0}</p>
                                    </div>
                                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Delivered</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.stats?.delivered_orders || 0}</p>
                                    </div>
                                    <TruckIcon className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">All Orders</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-black">Order #</th>
                                            <th className="text-left py-3 px-4 text-black">Customer</th>
                                            <th className="text-left py-3 px-4 text-black">Amount</th>
                                            <th className="text-left py-3 px-4 text-black">Status</th>
                                            <th className="text-left py-3 px-4 text-black">Method</th>
                                            <th className="text-left py-3 px-4 text-black">Date</th>
                                            <th className="text-left py-3 px-4 text-black">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData?.recent_orders?.map((order) => (
                                            <tr key={order.id} className="border-b">
                                                <td className="py-3 px-4 text-black">{order.order_number}</td>
                                                <td className="py-3 px-4 text-black">{order.user?.name || 'N/A'}</td>
                                                <td className="py-3 px-4 text-black">{formatPrice(order.total_amount)}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        order.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                                                        order.status === 'confirmed' ? 'text-blue-600 bg-blue-100' :
                                                        order.status === 'delivered' ? 'text-green-600 bg-green-100' :
                                                        'text-gray-600 bg-gray-100'
                                                    }`}>
                                                        {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-black capitalize">{order.delivery_method}</td>
                                                <td className="py-3 px-4 text-black">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-800">
                                                            <CheckIcon className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-800">
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="space-y-8">
                        {/* Inventory Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Products</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.products?.total || 0}</p>
                                    </div>
                                    <CubeIcon className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">In Stock</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.products?.in_stock || 0}</p>
                                    </div>
                                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Low Stock</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.products?.low_stock || 0}</p>
                                    </div>
                                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Out of Stock</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.products?.out_of_stock || 0}</p>
                                    </div>
                                    <XMarkIcon className="w-8 h-8 text-red-500" />
                                </div>
                            </div>
                        </div>

                        {/* Low Stock Products */}
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">Low Stock Products</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-black">Product</th>
                                            <th className="text-left py-3 px-4 text-black">Category</th>
                                            <th className="text-left py-3 px-4 text-black">Current Stock</th>
                                            <th className="text-left py-3 px-4 text-black">Status</th>
                                            <th className="text-left py-3 px-4 text-black">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData?.low_stock_products?.map((product) => (
                                            <tr key={product.id} className="border-b">
                                                <td className="py-3 px-4 text-black">{product.name}</td>
                                                <td className="py-3 px-4 text-black capitalize">{product.category?.name || 'N/A'}</td>
                                                <td className="py-3 px-4 text-black">{product.stock_quantity}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        product.stock_quantity === 0 ? 'text-red-600 bg-red-100' :
                                                        product.stock_quantity < 10 ? 'text-yellow-600 bg-yellow-100' :
                                                        'text-green-600 bg-green-100'
                                                    }`}>
                                                        {product.stock_quantity === 0 ? 'Out of Stock' :
                                                         product.stock_quantity < 10 ? 'Low Stock' : 'In Stock'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-800">
                                                            <CheckIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manage Users Tab */}
                {activeTab === 'manage-users' && (
                    <div className="space-y-8">
                        {/* User Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Users</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.users?.total || 0}</p>
                                    </div>
                                    <UserGroupIcon className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Active Users</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.users?.active || 0}</p>
                                    </div>
                                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                                </div>
                            </div>
                            <div className="glass-card rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">New This Month</p>
                                        <p className="text-2xl font-bold text-black">{dashboardData?.users?.new_this_month || 0}</p>
                                    </div>
                                    <ArrowTrendingUpIcon className="w-8 h-8 text-purple-500" />
                                </div>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="glass-card rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-black mb-4">All Users</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-black">Name</th>
                                            <th className="text-left py-3 px-4 text-black">Email</th>
                                            <th className="text-left py-3 px-4 text-black">Phone</th>
                                            <th className="text-left py-3 px-4 text-black">Status</th>
                                            <th className="text-left py-3 px-4 text-black">Joined</th>
                                            <th className="text-left py-3 px-4 text-black">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData?.users?.data?.map((user) => (
                                            <tr key={user.id} className="border-b">
                                                <td className="py-3 px-4 text-black">{user.name}</td>
                                                <td className="py-3 px-4 text-black">{user.email}</td>
                                                <td className="py-3 px-4 text-black">{user.phone || 'N/A'}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                        user.email_verified_at ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                                                    }`}>
                                                        {user.email_verified_at ? 'Active' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-black">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-800">
                                                            <EyeIcon className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-green-600 hover:text-green-800">
                                                            <CheckIcon className="w-4 h-4" />
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-800">
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
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

            </div>

        </div>
    );
};

export default AdminDashboard;