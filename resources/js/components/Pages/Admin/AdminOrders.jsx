import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from '../../../config/axios';
import { 
    MagnifyingGlassIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon,
    CameraIcon,
    DocumentIcon,
    TruckIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deliveryMethodFilter, setDeliveryMethodFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pickupProof, setPickupProof] = useState(null);
    const [pickupNotes, setPickupNotes] = useState('');
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery(
        ['admin-orders', search, statusFilter, deliveryMethodFilter],
        () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (statusFilter) params.append('status', statusFilter);
            if (deliveryMethodFilter) params.append('delivery_method', deliveryMethodFilter);
            
            return axios.get(`/api/admin/orders?${params.toString()}`).then(res => res.data);
        }
    );

    const updateOrderStatusMutation = useMutation(
        ({ orderId, status }) => axios.put(`/api/admin/orders/${orderId}/status`, { status }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('admin-orders');
                toast.success('Order status updated successfully');
            },
            onError: () => {
                toast.error('Failed to update order status');
            }
        }
    );

    const verifyPickupMutation = useMutation(
        ({ orderId, proof, notes }) => {
            const formData = new FormData();
            formData.append('proof', proof);
            formData.append('notes', notes);
            return axios.post(`/api/admin/orders/${orderId}/verify-pickup`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('admin-orders');
                setSelectedOrder(null);
                setPickupProof(null);
                setPickupNotes('');
                toast.success('Pickup verified successfully');
            },
            onError: () => {
                toast.error('Failed to verify pickup');
            }
        }
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const handleStatusUpdate = (orderId, newStatus) => {
        updateOrderStatusMutation.mutate({ orderId, status: newStatus });
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
                    <h1 className="text-3xl font-bold text-black mb-4">Order Management</h1>
                    <p className="text-gray-700">Process and track customer orders</p>
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
                                placeholder="Search orders..."
                                className="w-full pl-10 pr-4 py-3 glass rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 glass rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        <select
                            value={deliveryMethodFilter}
                            onChange={(e) => setDeliveryMethodFilter(e.target.value)}
                            className="px-4 py-3 glass rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">All Methods</option>
                            <option value="delivery">Delivery</option>
                            <option value="pickup">Pickup</option>
                        </select>

                        <div className="text-gray-600 text-sm flex items-center">
                            Total Orders: {orders?.total || 0}
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders?.data?.map((order) => (
                        <div key={order.id} className="glass-card rounded-2xl p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">
                                        Order #{order.order_number}
                                    </h3>
                                    <p className="text-gray-600">
                                        Customer: {order.user?.name} • {formatDate(order.created_at)}
                                    </p>
                                </div>
                                <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                                        <EyeIcon className="w-4 h-4" />
                                        <span>View Details</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div>
                                    <div className="text-gray-600 text-sm mb-1">Total Amount</div>
                                    <div className="text-2xl font-bold text-black">
                                        {formatPrice(order.total_amount)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm mb-1">Delivery Method</div>
                                    <div className="text-black font-medium">
                                        {order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm mb-1">Payment Method</div>
                                    <div className="text-black font-medium">
                                        {order.payment_method.toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-600 text-sm mb-1">Items</div>
                                    <div className="text-black font-medium">
                                        {order.order_items?.length || 0} item(s)
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="border-t border-white/20 pt-4 mb-6">
                                <h4 className="text-black font-medium mb-3">Order Items:</h4>
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

                            {/* Status Update Actions */}
                            <div className="flex flex-wrap gap-2">
                                {order.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                            <span>Confirm</span>
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>
                                    </>
                                )}
                                
                                {order.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                        className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <span>Start Preparing</span>
                                    </button>
                                )}
                                
                                {order.status === 'preparing' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <span>Mark Ready</span>
                                    </button>
                                )}
                                
                                {order.status === 'ready' && order.delivery_method === 'delivery' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <span>Mark Delivered</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {orders?.data?.length === 0 && (
                    <div className="text-center py-12">
                        <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-black mb-4">No Orders Found</h2>
                            <p className="text-gray-700">
                                No orders match your current filters.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
