import React, { useContext, useEffect, useState } from 'react';
import { WishlistContext } from '../../Context/WishlistContext';
import { CartContext } from '../../Context/CartContext';
import { Link } from 'react-router-dom';

export default function Wishlist() {
    const { wishlistItems, isLoading, removeFromWishlist, getWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getWishlist();
    }, []);

    async function handleRemoveFromWishlist(productId) {
        await removeFromWishlist(productId);
        setMessage('Removed from wishlist');
        setTimeout(() => setMessage(''), 3000);
    }

    async function handleAddToCart(productId) {
        const result = await addToCart(productId);
        if (result.success) {
            setMessage('Product added to cart!');
        } else {
            setMessage(result.error || 'Failed to add to cart');
        }
        setTimeout(() => setMessage(''), 3000);
    }

    if (isLoading && wishlistItems.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-400 animate-pulse">Loading wishlist...</div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="card-glass text-center p-12">
                    <div className="text-6xl mb-4">❤️</div>
                    <h2 className="text-2xl font-bold mb-4 gradient-text">Your Wishlist is Empty</h2>
                    <p className="text-gray-400 mb-6">Add some products to your wishlist!</p>
                    <Link to="/home" className="btn-primary inline-block">
                        <i className="fas fa-shopping-bag mr-2"></i>Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 gradient-text">My Wishlist</h2>

            {message && (
                <div className="mb-4 p-4 glass-strong rounded-xl border border-accent/30 text-accent animate-glow-pulse">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((product) => (
                    <div key={product.id || product._id} className="card-glass group">
                        <Link to={`/productDetails/${product.id || product._id}`} className="block">
                            <div className="relative overflow-hidden rounded-xl mb-4">
                                <img
                                    src={product.imageCover}
                                    alt={product.title}
                                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link to={`/productDetails/${product.id || product._id}`}>
                                <h3 className="text-lg font-semibold mb-2 hover:text-accent transition-colors text-white line-clamp-1">
                                    {product.title}
                                </h3>
                            </Link>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                {product.description}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xl font-bold gradient-text">${product.price}</span>
                                <div className="flex items-center gap-1 glass px-2 py-1 rounded-lg">
                                    <i className="fas fa-star text-yellow-400"></i>
                                    <span className="text-sm text-white">{product.ratingsAverage || 0}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAddToCart(product.id || product._id)}
                                    className="btn-primary flex-1 text-sm py-2"
                                >
                                    <i className="fas fa-cart-plus mr-1"></i>Add to Cart
                                </button>
                                <button
                                    onClick={() => handleRemoveFromWishlist(product.id || product._id)}
                                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/30 border border-red-500/30 transition-smooth"
                                >
                                    <i className="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
