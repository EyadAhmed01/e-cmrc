import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../Context/CartContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const { cartItems, cartCount, isLoading, updateCartQuantity, removeFromCart, getCart, clearCart } = useContext(CartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        getCart();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            const total = cartItems.reduce((sum, item) => {
                return sum + (item.price * item.count);
            }, 0);
            setTotalPrice(total);
        } else {
            setTotalPrice(0);
        }
    }, [cartItems]);

    async function handleUpdateQuantity(productId, newCount) {
        if (newCount < 1) {
            await removeFromCart(productId);
        } else {
            await updateCartQuantity(productId, newCount);
        }
    }

    async function handleRemove(productId) {
        await removeFromCart(productId);
    }

    function handleCheckout() {
        navigate('/order');
    }

    if (isLoading && cartItems.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-400 animate-pulse">Loading cart...</div>
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="card-glass text-center p-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold mb-4 gradient-text">Your Cart is Empty</h2>
                    <p className="text-gray-400 mb-6">Add some products to your cart to get started!</p>
                    <Link to="/home" className="btn-primary inline-block">
                        <i className="fas fa-shopping-bag mr-2"></i>Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Shopping Cart</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.product.id || item.product._id} className="card-glass p-6 flex flex-col md:flex-row items-center gap-4 group">
                            <Link to={`/productDetails/${item.product.id || item.product._id}`} className="flex-shrink-0">
                                <img 
                                    src={item.product.imageCover} 
                                    alt={item.product.title}
                                    className="w-32 h-32 object-cover rounded-xl transition-transform group-hover:scale-105"
                                />
                            </Link>
                            
                            <div className="flex-grow">
                                <Link to={`/productDetails/${item.product.id || item.product._id}`}>
                                    <h3 className="text-xl font-semibold mb-2 hover:text-accent transition-colors text-white">
                                        {item.product.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-400 mb-2 text-sm line-clamp-2">{item.product.description?.substring(0, 100)}...</p>
                                <p className="text-lg font-bold gradient-text">${item.price}</p>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-3 glass px-3 py-2 rounded-xl">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.product.id || item.product._id, item.count - 1)}
                                        className="text-white hover:text-accent transition-colors font-bold text-lg disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        −
                                    </button>
                                    <span className="text-lg font-semibold w-8 text-center text-white">{item.count}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.product.id || item.product._id, item.count + 1)}
                                        className="text-white hover:text-accent transition-colors font-bold text-lg disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <button
                                    onClick={() => handleRemove(item.product.id || item.product._id)}
                                    className="text-red-400 hover:text-red-500 font-semibold transition-colors"
                                    disabled={isLoading}
                                >
                                    <i className="fas fa-trash mr-1"></i>Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="card-glass p-6 sticky top-4">
                        <h3 className="text-2xl font-bold mb-4 text-white">Order Summary</h3>
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-gray-300">
                                <span>Items ({cartCount})</span>
                                <span className="text-white font-semibold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Shipping</span>
                                <span className="text-accent">Free</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between text-xl font-bold">
                                <span className="text-white">Total</span>
                                <span className="gradient-text">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="btn-primary w-full mb-3"
                            disabled={isLoading}
                        >
                            <i className="fas fa-credit-card mr-2"></i>Proceed to Checkout
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full glass text-red-400 py-3 rounded-xl hover:bg-red-500/10 font-semibold transition-smooth"
                            disabled={isLoading}
                        >
                            <i className="fas fa-trash-alt mr-2"></i>Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
