import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        totalRevenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        try {
            setIsLoading(true);
            
            const [productsRes, ordersRes, usersRes] = await Promise.all([
                axiosInstance.get('/products?limit=1'),
                axiosInstance.get('/orders'),
                axiosInstance.get('/users')
            ]);

            const productsCount = productsRes.data.results || 0;
            const ordersCount = ordersRes.data.results || 0;
            const usersCount = usersRes.data.results || 0;

            let totalRevenue = 0;
            if (ordersRes.data.data) {
                totalRevenue = ordersRes.data.data.reduce((sum, order) => {
                    return sum + (order.totalOrderPrice || 0);
                }, 0);
            }

            setStats({
                products: productsCount,
                orders: ordersCount,
                users: usersCount,
                totalRevenue: totalRevenue
            });

            if (ordersRes.data.data) {
                setRecentOrders(ordersRes.data.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-400 animate-pulse">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 gradient-text">Dashboard</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Products</p>
                            <p className="text-3xl font-bold text-white">{stats.products}</p>
                        </div>
                        <div className="glass p-3 rounded-full">
                            <i className="fas fa-box text-blue-400 text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/admin/products" className="text-accent text-sm mt-2 hover:underline inline-block">
                        View all →
                    </Link>
                </div>

                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Orders</p>
                            <p className="text-3xl font-bold text-white">{stats.orders}</p>
                        </div>
                        <div className="glass p-3 rounded-full">
                            <i className="fas fa-shopping-cart text-accent text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/admin/orders" className="text-accent text-sm mt-2 hover:underline inline-block">
                        View all →
                    </Link>
                </div>

                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Users</p>
                            <p className="text-3xl font-bold text-white">{stats.users}</p>
                        </div>
                        <div className="glass p-3 rounded-full">
                            <i className="fas fa-users text-purple-400 text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/admin/users" className="text-accent text-sm mt-2 hover:underline inline-block">
                        View all →
                    </Link>
                </div>

                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold gradient-text">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="glass p-3 rounded-full">
                            <i className="fas fa-dollar-sign text-yellow-400 text-2xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card-glass p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Recent Orders</h2>
                {recentOrders.length === 0 ? (
                    <p className="text-gray-400">No orders yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            {order._id.substring(0, 8)}...
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
