import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get wishlist items from API
    async function getWishlist() {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/wishlist');
            setWishlistItems(data.data || []);
            setWishlistCount(data.data?.length || 0);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load wishlist');
            setWishlistItems([]);
            setWishlistCount(0);
        } finally {
            setIsLoading(false);
        }
    }

    // Add product to wishlist
    async function addToWishlist(productId) {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.post('/wishlist', {
                productId: productId
            });
            setWishlistItems(data.data || []);
            setWishlistCount(data.data?.length || 0);
            setError(null);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add to wishlist');
            return { success: false, error: err.response?.data?.message };
        } finally {
            setIsLoading(false);
        }
    }

    // Remove product from wishlist
    async function removeFromWishlist(productId) {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.delete(`/wishlist/${productId}`);
            setWishlistItems(data.data || []);
            setWishlistCount(data.data?.length || 0);
            setError(null);
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove from wishlist');
            return { success: false, error: err.response?.data?.message };
        } finally {
            setIsLoading(false);
        }
    }

    // Check if product is in wishlist
    function isInWishlist(productId) {
        return wishlistItems.some(item => item.id === productId || item._id === productId);
    }

    // Load wishlist on mount if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            getWishlist();
        }
    }, []);

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            wishlistCount,
            isLoading,
            error,
            getWishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
