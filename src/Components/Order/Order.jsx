import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CartContext } from '../../Context/CartContext';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function Order() {
    const { cartItems, cartCount, cartId, getCart, clearCart } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const [cartTotal, setCartTotal] = useState(0);

    useEffect(() => {
        getCart();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            const total = cartItems.reduce((sum, item) => {
                return sum + (item.price * item.count);
            }, 0);
            setCartTotal(total);
        } else {
            setCartTotal(0);
        }
    }, [cartItems]);

    const validationSchema = Yup.object().shape({
        details: Yup.string().required('Address is required'),
        phone: Yup.string()
            .required('Phone is required')
            .matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number'),
        city: Yup.string().required('City is required'),
    });

    const formik = useFormik({
        initialValues: {
            details: '',
            phone: '',
            city: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                setError('');
                
                const orderData = {
                    shippingAddress: {
                        details: values.details,
                        phone: values.phone,
                        city: values.city,
                    }
                };

                if (!cartId) {
                    setError('Cart ID not found. Please add items to cart first.');
                    return;
                }

                const { data } = await axiosInstance.post(`/orders/checkout-session/${cartId}`, orderData);
                
                if (data.status === 'success') {
                    setSuccess(true);
                    await clearCart();
                    setTimeout(() => {
                        navigate('/home');
                    }, 3000);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to place order');
            } finally {
                setIsLoading(false);
            }
        },
    });

    if (cartCount === 0 && !success) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="card-glass text-center p-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold mb-4 gradient-text">Your Cart is Empty</h2>
                    <p className="text-gray-400 mb-6">Add some products to your cart before checkout!</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="btn-primary inline-block"
                    >
                        <i className="fas fa-shopping-bag mr-2"></i>Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="card-glass max-w-md mx-auto p-12 text-center animate-float">
                    <div className="text-6xl text-accent mb-4 animate-glow-pulse">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 gradient-text">Order Placed Successfully!</h2>
                    <p className="text-gray-400 mb-6">Thank you for your purchase. You will be redirected to home page shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Checkout</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Form */}
                <div className="card-glass p-6">
                    <h3 className="text-2xl font-bold mb-6 text-white">Shipping Information</h3>

                    {error && (
                        <div className="mb-4 p-4 glass rounded-xl border border-red-500/30 text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium mb-2 text-gray-300">
                                Address Details
                            </label>
                            <textarea
                                id="details"
                                name="details"
                                value={formik.values.details}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows="3"
                                className={`input-glass w-full ${
                                    formik.errors.details && formik.touched.details
                                        ? 'border-red-500/50'
                                        : ''
                                }`}
                                placeholder="Enter your full address"
                            />
                            {formik.errors.details && formik.touched.details && (
                                <p className="mt-1 text-sm text-red-400">{formik.errors.details}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-300">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`input-glass w-full ${
                                    formik.errors.phone && formik.touched.phone
                                        ? 'border-red-500/50'
                                        : ''
                                }`}
                                placeholder="01XXXXXXXXX"
                            />
                            {formik.errors.phone && formik.touched.phone && (
                                <p className="mt-1 text-sm text-red-400">{formik.errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium mb-2 text-gray-300">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`input-glass w-full ${
                                    formik.errors.city && formik.touched.city
                                        ? 'border-red-500/50'
                                        : ''
                                }`}
                                placeholder="Enter your city"
                            />
                            {formik.errors.city && formik.touched.city && (
                                <p className="mt-1 text-sm text-red-400">{formik.errors.city}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <i className="fas fa-spinner fa-spin mr-2"></i>Processing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <i className="fas fa-shopping-cart mr-2"></i>Place Order
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="card-glass p-6 h-fit sticky top-4">
                    <h3 className="text-2xl font-bold mb-4 text-white">Order Summary</h3>
                    <div className="space-y-3 mb-4">
                        {cartItems.map((item) => (
                            <div key={item.product.id || item.product._id} className="flex justify-between items-center border-b border-white/10 pb-2">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={item.product.imageCover}
                                        alt={item.product.title}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm text-white">{item.product.title}</p>
                                        <p className="text-sm text-gray-400">Qty: {item.count}</p>
                                    </div>
                                </div>
                                <span className="font-semibold text-white">${(item.price * item.count).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-white/10 pt-3 space-y-2">
                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span className="text-white">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Shipping</span>
                            <span className="text-accent">Free</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-2">
                            <span className="text-white">Total</span>
                            <span className="gradient-text">${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
