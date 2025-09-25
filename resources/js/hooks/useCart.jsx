import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from '../config/axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cart');
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
            // If user is not authenticated, set empty array
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            await axios.post('/api/cart', { product_id: productId, quantity });
            // Refresh cart items after adding
            await fetchCartItems();
            toast.success('Product added to cart!');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error(error.response?.data?.message || 'Failed to add to cart.');
        }
    };

    const updateCartItemQuantity = async (cartItemId, quantity) => {
        try {
            await axios.put(`/api/cart/${cartItemId}`, { quantity });
            // Refresh cart items after updating
            await fetchCartItems();
            toast.success('Cart updated!');
        } catch (error) {
            console.error('Failed to update cart item:', error);
            toast.error(error.response?.data?.message || 'Failed to update cart.');
        }
    };

    const removeCartItem = async (cartItemId) => {
        try {
            await axios.delete(`/api/cart/${cartItemId}`);
            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
            toast.success('Item removed from cart!');
        } catch (error) {
            console.error('Failed to remove cart item:', error);
            toast.error(error.response?.data?.message || 'Failed to remove item.');
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete('/api/cart');
            setCartItems([]);
            toast.success('Cart cleared!');
        } catch (error) {
            console.error('Failed to clear cart:', error);
            toast.error(error.response?.data?.message || 'Failed to clear cart.');
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        loading,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        getCartTotal,
        getCartItemCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};