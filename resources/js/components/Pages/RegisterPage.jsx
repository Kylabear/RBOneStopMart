import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: '',
        whatsapp: '',
        facebook: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

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
            const result = await register(formData);
            
            if (result.success) {
                toast.success('Registration successful!');
                navigate('/');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="glass-card rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-300">Join R&B One Stop Mart today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-white mb-2">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows="3"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your address"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-white mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-white mb-2">
                                WhatsApp Number (Optional)
                            </label>
                            <input
                                id="whatsapp"
                                name="whatsapp"
                                type="tel"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your WhatsApp number"
                            />
                        </div>

                        <div>
                            <label htmlFor="facebook" className="block text-sm font-medium text-white mb-2">
                                Facebook Profile (Optional)
                            </label>
                            <input
                                id="facebook"
                                name="facebook"
                                type="text"
                                value={formData.facebook}
                                onChange={handleChange}
                                className="w-full px-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Enter your Facebook profile name"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="small" className="mr-2" />
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-300">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
