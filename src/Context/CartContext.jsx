import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [cartId, setCartId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get cart items from API
    async function getCart() {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/cart');
            setCartItems(data.data.products || []);
            setCartCount(data.numOfCartItems || 0);
            setCartId(data.data._id || null);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load cart');
            setCartItems([]);
            setCartCount(0);
            setCartId(null);
        } finally {
            setIsLoading(false);
        }
    }

    // Add product to cart
    async function addToCart(productId) {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.post('/cart', {
                productId: productId
            });
            setCartItems(data.data.products || []);
            setCartCount(data.numOfCartItems || 0);
            setCartId(data.data._id || null);
            setError(null);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to cart');
            return { success: false, error: err.response?.data?.message };
        } finally {
            setIsLoading(false);
        }
    }

    // Remove product from cart
    async function removeFromCart(productId) {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.delete(`/cart/${productId}`);
            setCartItems(data.data.products || []);
            setCartCount(data.numOfCartItems || 0);
            setCartId(data.data._id || null);
            setError(null);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove from cart');
            return { success: false, error: err.response?.data?.message };
        } finally {
            setIsLoading(false);
        }
    }

    // Update product quantity in cart
    async function updateCartQuantity(productId, count) {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.put(`/cart/${productId}`, {
                count: count
            });
            setCartItems(data.data.products || []);
            setCartCount(data.numOfCartItems || 0);
            setCartId(data.data._id || null);
            setError(null);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update cart');
            return { success: false, error: err.response?.data?.message };
        } finally {
            setIsLoading(false);
        }
    }

    // Clear cart
    async function clearCart() {
        try {
            setIsLoading(true);
            await axiosInstance.delete('/cart');
            setCartItems([]);
            setCartCount(0);
            setCartId(null);
            setError(null);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to clear cart');
            return { success: false, error: err.response?.data?.message };
        } finally {
            setIsLoading(false);
        }
    }

    // Load cart on mount if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            getCart();
        }
    }, []);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            cartId,
            isLoading,
            error,
            getCart,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}
