import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/orders');
            setOrders(data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 gradient-text">Orders Management</h1>

            {isLoading ? (
                <div className="text-center py-12 text-gray-400 animate-pulse">Loading orders...</div>
            ) : (
                <div className="card-glass overflow-hidden">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {order._id.substring(0, 12)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {order.user?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        ${order.totalOrderPrice?.toFixed(2) || '0.00'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            order.isPaid 
                                                ? 'bg-accent/20 text-accent border border-accent/30' 
                                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        }`}>
                                            {order.isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

function OrderDetailsModal({ order, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="card-glass p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold gradient-text">Order Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-white">Order ID:</h3>
                        <p className="text-gray-300">{order._id}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">User:</h3>
                        <p className="text-gray-300">{order.user?.name || 'N/A'}</p>
                        <p className="text-gray-300">{order.user?.email || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Shipping Address:</h3>
                        <p className="text-gray-300">
                            {order.shippingAddress?.details || 'N/A'}
                        </p>
                        <p className="text-gray-300">
                            {order.shippingAddress?.city || ''}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Items:</h3>
                        <div className="space-y-2">
                            {order.cartItems?.map((item, index) => (
                                <div key={index} className="flex justify-between border-b border-white/10 pb-2">
                                    <div>
                                        <p className="font-medium text-white">{item.product?.title}</p>
                                        <p className="text-sm text-gray-400">Qty: {item.count}</p>
                                    </div>
                                    <p className="font-medium text-white">${(item.price * item.count).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-white">Total:</span>
                            <span className="gradient-text">${order.totalOrderPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Status:</h3>
                        <p className={`inline-block px-3 py-1 rounded-full ${
                            order.isPaid 
                                ? 'bg-accent/20 text-accent border border-accent/30' 
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    <button
                        onClick={onClose}
                        className="btn-secondary flex-1"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
