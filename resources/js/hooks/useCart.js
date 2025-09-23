import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
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
    const [loading, setLoading] = useState(false);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/cart');
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            setLoading(true);
            await axios.post('/api/cart', {
                product_id: productId,
                quantity: quantity
            });
            
            await fetchCartItems();
            toast.success('Item added to cart');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add item to cart');
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (cartItemId, quantity) => {
        try {
            setLoading(true);
            await axios.put(`/api/cart/${cartItemId}`, {
                quantity: quantity
            });
            
            await fetchCartItems();
            toast.success('Cart updated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update cart');
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartItemId) => {
        try {
            setLoading(true);
            await axios.delete(`/api/cart/${cartItemId}`);
            
            await fetchCartItems();
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove item from cart');
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            await axios.delete('/api/cart');
            
            setCartItems([]);
            toast.success('Cart cleared');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to clear cart');
        } finally {
            setLoading(false);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.quantity * item.product.price), 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCartItems();
        }
    }, []);

    const value = {
        cartItems,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCartItems,
        getCartTotal,
        getCartItemCount,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
