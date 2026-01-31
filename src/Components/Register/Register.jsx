import React, { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik'; 
import * as Yup from "yup";
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

export default function Register() {
    const [errMsg, setErrMsg] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const { token, setToken } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/home');
        }
    }, [token, navigate]);

    async function handleSubmit(values) {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.post('/auth/signup', values);
            localStorage.setItem("userToken", data.token);
            setToken(data.token);
            navigate('/home');
        } catch (err) {
            setErrMsg(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    }

    const yupSchema = Yup.object().shape({
        name: Yup.string().required('Required').min(5, 'Minimum 5 characters').max(15, 'Maximum 15 characters'),
        email: Yup.string().required('Required').email('Invalid Email'),
        password: Yup.string().required('Required').min(6, 'Minimum 6 characters').max(15, 'Maximum 15 characters'),
        rePassword: Yup.string()
            .required('Required')
            .oneOf([Yup.ref('password')], 'Passwords must match'),
        phone: Yup.string()
            .required('Required')
            .matches(/^01[0251][0-9]{8}$/, 'Invalid Phone Number'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rePassword: '',
            name: '',
            phone: ''
        },
        onSubmit: handleSubmit,
        validationSchema: yupSchema
    });

    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-12'>
            <div className='card-glass w-full max-w-md p-8 animate-float'>
                <h2 className='gradient-text text-3xl font-bold mb-8 text-center'>Register</h2>
                {errMsg && 
                    <div className="p-4 mb-4 glass rounded-xl border border-red-500/30 text-red-400" role="alert">
                        {errMsg}
                    </div>
                }
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email address</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            type="email" name="email" id="email"
                            className="input-glass w-full"
                            placeholder="Enter your email"
                            required />
                        {formik.errors.email && formik.touched.email && (
                            <div className="mt-2 text-sm text-red-400">
                                {formik.errors.email}
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            type="password" name="password" id="password"
                            className="input-glass w-full"
                            placeholder="Enter your password"
                            required />
                        {formik.errors.password && formik.touched.password && (
                            <div className="mt-2 text-sm text-red-400">
                                {formik.errors.password}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="rePassword" className="block mb-2 text-sm font-medium text-gray-300">Confirm Password</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.rePassword}
                            type="password" name="rePassword" id="rePassword"
                            className="input-glass w-full"
                            placeholder="Confirm your password"
                            required />
                        {formik.errors.rePassword && formik.touched.rePassword && (
                            <div className="mt-2 text-sm text-red-400">
                                {formik.errors.rePassword}
                            </div>
                        )}
                    </div>

                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Name</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            type="text" name="name" id="name"
                            className="input-glass w-full"
                            placeholder="Enter your name"
                            required />
                        {formik.errors.name && formik.touched.name && (
                            <div className="mt-2 text-sm text-red-400">
                                {formik.errors.name}
                            </div>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-300">Phone Number</label>
                        <input
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.phone}
                            type="tel" name="phone" id="phone"
                            className="input-glass w-full"
                            placeholder="01XXXXXXXXX"
                            required />
                        {formik.errors.phone && formik.touched.phone && (
                            <div className="mt-2 text-sm text-red-400">
                                {formik.errors.phone}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={isLoading} 
                        type="submit" 
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i>Loading...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                <i className="fas fa-user-plus mr-2"></i>Register
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
