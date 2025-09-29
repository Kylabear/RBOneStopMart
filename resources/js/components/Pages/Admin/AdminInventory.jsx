import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from '../../../config/axios';
import { 
    MagnifyingGlassIcon,
    PencilIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminInventory = () => {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [stockUpdate, setStockUpdate] = useState('');
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery(
        ['admin-inventory', search, categoryFilter, stockFilter],
        () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (categoryFilter) params.append('category_id', categoryFilter);
            if (stockFilter) params.append('stock_status', stockFilter);
            
            return axios.get(`/api/admin/products?${params.toString()}`).then(res => res.data);
        }
    );

    const { data: categories } = useQuery(
        'categories',
        () => axios.get('/api/categories').then(res => res.data)
    );

    const updateStockMutation = useMutation(
        ({ productId, stock }) => axios.put(`/api/admin/products/${productId}/stock`, { stock }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('admin-inventory');
                setEditingProduct(null);
                setStockUpdate('');
                toast.success('Stock updated successfully');
            },
            onError: () => {
                toast.error('Failed to update stock');
            }
        }
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    const handleStockUpdate = (productId) => {
        if (stockUpdate !== '') {
            updateStockMutation.mutate({ productId, stock: parseInt(stockUpdate) });
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { status: 'Out of Stock', color: 'text-red-400 bg-red-500/20' };
        if (stock <= 10) return { status: 'Low Stock', color: 'text-yellow-400 bg-yellow-500/20' };
        return { status: 'In Stock', color: 'text-green-400 bg-green-500/20' };
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 admin-page py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-black mb-4">Inventory Management</h1>
                    <p className="text-gray-700">Track and manage product stock levels</p>
                </div>

                {/* Filters */}
                <div className="glass-card rounded-2xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 glass rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-3 glass rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                            className="px-4 py-3 glass rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">All Stock</option>
                            <option value="low">Low Stock</option>
                            <option value="out">Out of Stock</option>
                        </select>

                        <div className="text-gray-600 text-sm flex items-center">
                            Total Products: {products?.total || 0}
                        </div>
                    </div>
                </div>

                {/* Inventory Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-black">
                                    {products?.data?.filter(p => p.stock_quantity > 10).length || 0}
                                </div>
                                <div className="text-gray-600 text-sm">In Stock</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-yellow-500/20 rounded-lg">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-black">
                                    {products?.data?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length || 0}
                                </div>
                                <div className="text-gray-600 text-sm">Low Stock</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-red-500/20 rounded-lg">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-black">
                                    {products?.data?.filter(p => p.stock_quantity === 0).length || 0}
                                </div>
                                <div className="text-gray-600 text-sm">Out of Stock</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg">
                                <CheckCircleIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-black">
                                    {products?.data?.filter(p => p.is_active).length || 0}
                                </div>
                                <div className="text-gray-600 text-sm">Active Products</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-black font-semibold">Product</th>
                                    <th className="px-6 py-4 text-left text-black font-semibold">Category</th>
                                    <th className="px-6 py-4 text-left text-black font-semibold">Current Stock</th>
                                    <th className="px-6 py-4 text-left text-black font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left text-black font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {products?.data?.map((product) => {
                                    const stockStatus = getStockStatus(product.stock_quantity);
                                    return (
                                        <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 flex-shrink-0">
                                                        {product.image ? (
                                                            <img 
                                                                src={`/storage/${product.image}`} 
                                                                alt={product.name}
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                                <span className="text-lg font-bold text-black">
                                                                    {product.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-black font-medium">{product.name}</div>
                                                        <div className="text-gray-600 text-sm">
                                                            {formatPrice(product.price)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-blue-400">{product.category?.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-2xl font-bold text-black">
                                                    {product.stock_quantity}
                                                </div>
                                                {product.unit && (
                                                    <div className="text-gray-600 text-sm">{product.unit}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                                                    {stockStatus.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {editingProduct === product.id ? (
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="number"
                                                            value={stockUpdate}
                                                            onChange={(e) => setStockUpdate(e.target.value)}
                                                            placeholder="New stock"
                                                            className="w-20 px-2 py-1 glass rounded text-black text-sm"
                                                        />
                                                        <button
                                                            onClick={() => handleStockUpdate(product.id)}
                                                            className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                                        >
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct(null);
                                                                setStockUpdate('');
                                                            }}
                                                            className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
                                                        >
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setEditingProduct(product.id);
                                                            setStockUpdate(product.stock_quantity.toString());
                                                        }}
                                                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {products?.data?.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-600 mb-4">No products found</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminInventory;
