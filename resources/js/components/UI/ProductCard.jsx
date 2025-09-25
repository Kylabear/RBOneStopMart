import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }
        
        addToCart(product.id, 1);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(price);
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
            <Link to={`/products/${product.id}`}>
                <div className="relative">
                    {product.image ? (
                        <img 
                            src={`/storage/${product.image}`} 
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">
                                {product.name.charAt(0)}
                            </span>
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.stock_quantity > 10 
                                ? 'bg-green-500 text-white' 
                                : product.stock_quantity > 0 
                                    ? 'bg-yellow-500 text-white' 
                                    : 'bg-red-500 text-white'
                        }`}>
                            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="mb-2">
                        <span className="text-sm text-blue-400 font-medium">
                            {product.category?.name}
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {product.name}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-white">
                                {formatPrice(product.price)}
                            </span>
                            {product.unit && (
                                <span className="text-sm text-gray-400 ml-1">/{product.unit}</span>
                            )}
                        </div>
                        
                        <div className="flex space-x-2">
                            <Link
                                to={`/products/${product.id}`}
                                className="p-2 glass-button rounded-lg hover:scale-110 transition-transform"
                                title="View Details"
                            >
                                <EyeIcon className="w-4 h-4 text-white" />
                            </Link>
                            
                            {product.stock_quantity > 0 && (
                                <button
                                    onClick={handleAddToCart}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg hover:scale-110 transition-transform"
                                    title="Add to Cart"
                                >
                                    <ShoppingCartIcon className="w-4 h-4 text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                        <div className="mt-2 text-sm text-yellow-400">
                            Only {product.stock_quantity} left in stock
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
