import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from '../../config/axios';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { 
    ArrowLeftIcon, 
    ShoppingCartIcon, 
    HeartIcon,
    StarIcon,
    TruckIcon,
    BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    const { data: product, isLoading } = useQuery(
        ['product', id],
        () => axios.get(`/api/products/${id}`).then(res => res.data)
    );

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }
        addToCart(product.id, quantity);
    };

    const handleBuyNow = () => {
        if (!user) {
            toast.error('Please login to proceed with purchase');
            navigate('/login');
            return;
        }
        addToCart(product.id, quantity);
        navigate('/cart');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
                    <p className="text-gray-300 mb-6">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors mb-8"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="space-y-4">
                        <div className="aspect-square glass-card rounded-2xl overflow-hidden">
                            {product.image ? (
                                <img 
                                    src={`/storage/${product.image}`} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-8xl font-bold text-white">
                                        {product.name.charAt(0)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Gallery */}
                        {product.gallery && product.gallery.length > 0 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.gallery.map((image, index) => (
                                    <div key={index} className="aspect-square glass rounded-lg overflow-hidden">
                                        <img 
                                            src={`/storage/${image}`} 
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm text-blue-400 font-medium">
                                    {product.category?.name}
                                </span>
                                {!product.category?.allows_delivery && (
                                    <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                        Pickup Only
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
                            
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="text-3xl font-bold text-white">
                                    {formatPrice(product.price)}
                                </div>
                                {product.unit && (
                                    <span className="text-gray-400">/{product.unit}</span>
                                )}
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                product.stock_quantity > 10 
                                    ? 'bg-green-500 text-white' 
                                    : product.stock_quantity > 0 
                                        ? 'bg-yellow-500 text-white' 
                                        : 'bg-red-500 text-white'
                            }`}>
                                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                            
                            {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                                <span className="text-yellow-400 text-sm">
                                    Only {product.stock_quantity} left in stock
                                </span>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        {product.stock_quantity > 0 && (
                            <div className="flex items-center space-x-4">
                                <label className="text-white font-medium">Quantity:</label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-white font-semibold min-w-[2rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {product.stock_quantity > 0 ? (
                                <>
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCartIcon className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-1 glass-button text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                                    >
                                        Buy Now
                                    </button>
                                </>
                            ) : (
                                <button
                                    disabled
                                    className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                                >
                                    Out of Stock
                                </button>
                            )}
                            
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="p-3 glass rounded-lg hover:bg-white/10 transition-colors"
                            >
                                {isFavorite ? (
                                    <HeartIconSolid className="w-6 h-6 text-red-500" />
                                ) : (
                                    <HeartIcon className="w-6 h-6 text-white" />
                                )}
                            </button>
                        </div>

                        {/* Delivery Information */}
                        <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Delivery Information</h3>
                            <div className="space-y-3">
                                {product.category?.allows_delivery ? (
                                    <div className="flex items-center space-x-3">
                                        <TruckIcon className="w-5 h-5 text-green-400" />
                                        <span className="text-white">Available for delivery</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <BuildingStorefrontIcon className="w-5 h-5 text-yellow-400" />
                                        <span className="text-white">Pickup only</span>
                                    </div>
                                )}
                                
                                <div className="text-sm text-gray-400">
                                    {product.category?.allows_delivery 
                                        ? 'This item can be delivered to your address or picked up at our store.'
                                        : 'This item is only available for pickup at our store location.'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
