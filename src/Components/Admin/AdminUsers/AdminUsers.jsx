import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/users');
            setUsers(data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(userId) {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/users/${userId}`);
            setMessage('User deleted successfully');
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to delete user');
            setTimeout(() => setMessage(''), 3000);
        }
    }

    async function handleToggleRole(userId, currentRole) {
        try {
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await axiosInstance.patch(`/users/${userId}`, { role: newRole });
            setMessage(`User role updated to ${newRole}`);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to update user role');
            setTimeout(() => setMessage(''), 3000);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 gradient-text">Users Management</h1>

            {message && (
                <div className={`mb-4 p-4 rounded-xl ${
                    message.includes('success') 
                        ? 'glass-strong border border-accent/30 text-accent' 
                        : 'glass border border-red-500/30 text-red-400'
                }`}>
                    {message}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12 text-gray-400 animate-pulse">Loading users...</div>
            ) : (
                <div className="card-glass overflow-hidden">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {user.phone || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            user.role === 'admin' 
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleToggleRole(user._id, user.role)}
                                            className="text-accent hover:text-accent/80 mr-4 transition-colors"
                                        >
                                            {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
