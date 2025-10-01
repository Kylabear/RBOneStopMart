import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from '../../config/axios';
import { 
    MapPinIcon, 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    CheckIcon,
    HomeIcon,
    BuildingOfficeIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, BuildingOfficeIcon as BuildingOfficeIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';

const AddressSelector = ({ selectedAddress, onAddressSelect, onAddressChange, isProfileMode = false }) => {
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        label: 'Home',
        contact_name: '',
        contact_phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        landmark: '',
        is_default: false
    });
    const queryClient = useQueryClient();

    const { data: addresses, isLoading, error } = useQuery(
        'addresses',
        () => {
            console.log('Fetching addresses...');
            return axios.get('/api/addresses').then(res => {
                console.log('Addresses fetched:', res.data);
                return res.data;
            });
        },
        {
            onError: (error) => {
                console.error('Address fetch error:', error);
                console.error('Error response:', error.response?.data);
                toast.error('Failed to load addresses');
            }
        }
    );

    const createAddressMutation = useMutation(
        (data) => {
            console.log('Sending address data:', data);
            return axios.post('/api/addresses', data);
        },
        {
            onSuccess: (response) => {
                console.log('Address created successfully:', response.data);
                queryClient.invalidateQueries('addresses');
                setShowForm(false);
                resetForm();
                toast.success('Address added successfully');
                
                // Call onAddressChange with the new address if provided
                if (onAddressChange && response.data.address) {
                    onAddressChange(response.data.address);
                }
            },
            onError: (error) => {
                console.error('Address creation error:', error);
                console.error('Error response:', error.response?.data);
                toast.error(error.response?.data?.message || 'Failed to add address');
            }
        }
    );

    const updateAddressMutation = useMutation(
        ({ id, data }) => axios.put(`/api/addresses/${id}`, data),
        {
            onSuccess: (response) => {
                queryClient.invalidateQueries('addresses');
                setShowForm(false);
                setEditingAddress(null);
                resetForm();
                toast.success('Address updated successfully');
                
                // Call onAddressChange with the updated address if provided
                if (onAddressChange && response.data.address) {
                    onAddressChange(response.data.address);
                }
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to update address');
            }
        }
    );

    const deleteAddressMutation = useMutation(
        (id) => axios.delete(`/api/addresses/${id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('addresses');
                toast.success('Address deleted successfully');
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to delete address');
            }
        }
    );

    const setDefaultMutation = useMutation(
        (id) => axios.put(`/api/addresses/${id}/default`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('addresses');
                toast.success('Default address updated');
            },
            onError: (error) => {
                toast.error(error.response?.data?.message || 'Failed to update default address');
            }
        }
    );

    const resetForm = () => {
        setFormData({
            label: 'Home',
            contact_name: '',
            contact_phone: '',
            address: '',
            city: '',
            province: '',
            postal_code: '',
            landmark: '',
            is_default: false
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        console.log('Form data:', formData);
        console.log('Is editing:', !!editingAddress);
        
        // Validate required fields
        if (!formData.contact_name.trim()) {
            toast.error('Contact name is required');
            return;
        }
        if (!formData.contact_phone.trim()) {
            toast.error('Contact phone is required');
            return;
        }
        if (!formData.address.trim()) {
            toast.error('Address is required');
            return;
        }
        if (!formData.city.trim()) {
            toast.error('City is required');
            return;
        }
        if (!formData.province.trim()) {
            toast.error('Province is required');
            return;
        }
        
        if (editingAddress) {
            updateAddressMutation.mutate({ id: editingAddress.id, data: formData });
        } else {
            createAddressMutation.mutate(formData);
        }
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        setFormData({
            label: address.label,
            contact_name: address.contact_name,
            contact_phone: address.contact_phone,
            address: address.address,
            city: address.city,
            province: address.province,
            postal_code: address.postal_code || '',
            landmark: address.landmark || '',
            is_default: address.is_default
        });
        setShowForm(true);
    };

    const handleDelete = (address) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteAddressMutation.mutate(address.id);
        }
    };

    const handleSetDefault = (address) => {
        setDefaultMutation.mutate(address.id);
    };

    const getLabelIcon = (label) => {
        switch (label.toLowerCase()) {
            case 'home':
                return <HomeIconSolid className="w-5 h-5 text-blue-600" />;
            case 'office':
                return <BuildingOfficeIconSolid className="w-5 h-5 text-green-600" />;
            default:
                return <MapPinIcon className="w-5 h-5 text-gray-600" />;
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600">Failed to load addresses. Please try again.</p>
            </div>
        );
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="text-center py-8">
                <LoadingSpinner />
                <p className="text-gray-600 mt-2">Loading addresses...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 mb-4">Failed to load addresses</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Debug info */}
            <div className="text-xs text-gray-500 mb-2">
                Debug: {addresses?.length || 0} addresses found
            </div>
            
            {/* Address List */}
            <div className="space-y-3">
                {addresses?.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No addresses saved yet</p>
                        <p className="text-sm text-gray-500">Add your first address to get started</p>
                    </div>
                )}
                {addresses?.map((address) => (
                    <div
                        key={address.id}
                        className={`p-4 border-2 rounded-lg transition-all ${
                            isProfileMode 
                                ? 'border-gray-200 hover:border-gray-300'
                                : selectedAddress?.id === address.id
                                    ? 'border-blue-500 bg-blue-50 cursor-pointer'
                                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                        }`}
                        onClick={isProfileMode ? undefined : () => onAddressSelect(address)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                                {getLabelIcon(address.label)}
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-semibold text-black">{address.label}</span>
                                        {address.is_default && (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 font-medium">{address.contact_name}</p>
                                    <p className="text-gray-600 text-sm">{address.contact_phone}</p>
                                    <p className="text-gray-700 text-sm mt-1">{address.full_address}</p>
                                    {address.landmark && (
                                        <p className="text-gray-500 text-xs mt-1">
                                            Near: {address.landmark}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                {!address.is_default && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSetDefault(address);
                                        }}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Set as default"
                                    >
                                        <StarIcon className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(address);
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="Edit address"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(address);
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Delete address"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add New Address Button */}
            {(!addresses || addresses.length < 3) && (
                <button
                    onClick={() => {
                        console.log('Add new address clicked');
                        resetForm();
                        setEditingAddress(null);
                        setShowForm(true);
                    }}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                >
                    <PlusIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 font-medium">Add New Address</span>
                </button>
            )}

            {/* Address Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-black">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingAddress(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {/* Label */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Label
                                </label>
                                <select
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Contact Name */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Contact Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact_name}
                                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter contact name"
                                />
                            </div>

                            {/* Contact Phone */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.contact_phone}
                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter phone number"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Street Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter street address"
                                />
                            </div>

                            {/* City and Province */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">
                                        Province
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.province}
                                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Province"
                                    />
                                </div>
                            </div>

                            {/* Postal Code */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Postal Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.postal_code}
                                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Postal code"
                                />
                            </div>

                            {/* Landmark */}
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Landmark (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.landmark}
                                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Near landmark or building"
                                />
                            </div>

                            {/* Set as Default */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    checked={formData.is_default}
                                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                                    Set as default address
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingAddress(null);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createAddressMutation.isLoading || updateAddressMutation.isLoading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
                                >
                                    {(createAddressMutation.isLoading || updateAddressMutation.isLoading) ? (
                                        <>
                                            <LoadingSpinner size="small" className="mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        editingAddress ? 'Update Address' : 'Add Address'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddressSelector;
