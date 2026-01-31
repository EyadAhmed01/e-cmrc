import React, { useContext, useState } from 'react';
import { UserContext } from '../../Context/UserContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../utils/axiosInstance';

export default function Account() {
    const { user, setToken } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
            email: Yup.string().required('Email is required').email('Invalid email'),
            phone: Yup.string().matches(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number'),
        }),
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                await axiosInstance.put('/users/updateMe', values);
                setMessage('Profile updated successfully');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Failed to update profile');
                setTimeout(() => setMessage(''), 3000);
            } finally {
                setIsLoading(false);
            }
        },
    });

    async function handleChangePassword() {
        const newPassword = prompt('Enter new password (min 8 characters):');
        if (!newPassword || newPassword.length < 8) {
            setMessage('Password must be at least 8 characters');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        try {
            setIsLoading(true);
            await axiosInstance.put('/users/changeMyPassword', {
                currentPassword: prompt('Enter current password:'),
                password: newPassword,
                passwordConfirm: newPassword,
            });
            setMessage('Password changed successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to change password');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsLoading(false);
        }
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="text-lg text-gray-400 animate-pulse">Loading account information...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 gradient-text">My Account</h1>

            {message && (
                <div className={`mb-4 p-4 rounded-xl ${
                    message.includes('success') 
                        ? 'glass-strong border border-accent/30 text-accent' 
                        : 'glass border border-red-500/30 text-red-400'
                }`}>
                    {message}
                </div>
            )}

            <div className="card-glass p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Profile Information</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`input-glass w-full ${
                                formik.errors.name && formik.touched.name ? 'border-red-500/50' : ''
                            }`}
                        />
                        {formik.errors.name && formik.touched.name && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`input-glass w-full ${
                                formik.errors.email && formik.touched.email ? 'border-red-500/50' : ''
                            }`}
                        />
                        {formik.errors.email && formik.touched.email && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formik.values.phone || ''}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`input-glass w-full ${
                                formik.errors.phone && formik.touched.phone ? 'border-red-500/50' : ''
                            }`}
                            placeholder="01XXXXXXXXX"
                        />
                        {formik.errors.phone && formik.touched.phone && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.phone}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Role</label>
                        <input
                            type="text"
                            value={user.role || 'user'}
                            disabled
                            className="input-glass w-full bg-white/5 text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i>Updating...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <i className="fas fa-save mr-2"></i>Update Profile
                            </span>
                        )}
                    </button>
                </form>
            </div>

            <div className="card-glass p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Security</h2>
                <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="btn-secondary w-full"
                >
                    <i className="fas fa-key mr-2"></i>Change Password
                </button>
            </div>
        </div>
    );
}
