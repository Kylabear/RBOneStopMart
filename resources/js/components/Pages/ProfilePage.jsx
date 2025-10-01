import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserIcon, PhoneIcon, MapPinIcon, ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import AddressSelector from '../UI/AddressSelector';
import toast from 'react-hot-toast';
import axios from '../../config/axios';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });

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
            // Fetch CSRF cookie first
            await axios.get('/sanctum/csrf-cookie');
            
            const response = await axios.put('/api/profile', formData);
            
            // Update user data in context
            setUser(response.data.user);
            
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update error:', error);
            if (error.response?.data?.errors) {
                const firstError = Object.values(error.response.data.errors)[0][0];
                toast.error(firstError);
            } else {
                toast.error(error.response?.data?.message || 'Failed to update profile');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-black mb-2">User Profile</h1>
                    <p className="text-gray-700">Manage your account information</p>
                </div>

                <div className="glass-card rounded-2xl p-8">
                    <div className="flex items-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <UserIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-black">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">
                                {user.role === 'admin' ? 'Administrator' : 'Customer'}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                                <PhoneIcon className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your phone number"
                            />
                        </div>


                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <LoadingSpinner />
                                        <span className="ml-2">Updating...</span>
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Address Management Section */}
                <div className="glass-card rounded-2xl p-8 mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-black mb-2">My Addresses</h2>
                            <p className="text-gray-600">Manage your delivery addresses</p>
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                        <p className="text-gray-600 text-center mb-4">
                            Add and manage your delivery addresses for faster checkout
                        </p>
                        <AddressSelector
                            selectedAddress={null}
                            onAddressSelect={() => {}}
                            onAddressChange={() => {}}
                            isProfileMode={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
