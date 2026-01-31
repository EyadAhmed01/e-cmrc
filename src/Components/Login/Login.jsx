import { useFormik } from 'formik'
import React, { useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('email is required').email('must be a valid email').matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'must be a valid email'),
  password: Yup.string().required('password is required').min(8,'must be at least 8 characters long').max(20,'must be at most 20 characters long').matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z])/, 'password must contain at least one letter, one number and one special character')
})

export default function Login() {
  const [errorMsg, setErrorMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate= useNavigate();
  const { setToken } = useContext(UserContext);
  
  async function handleSubmit (userInfo) {
    try {
      setIsLoading(true);
      const {data} = await axiosInstance.post('/auth/signin', userInfo);
      setErrorMsg(null);
      localStorage.setItem('userToken', data.token);
      setToken(data.token);
      navigate('/home');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  })
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="card-glass w-full max-w-md p-8 animate-float">
        <h2 className='gradient-text text-3xl font-bold mb-8 text-center'>Login</h2>
        
        {errorMsg && (
          <div className="mb-4 p-4 glass rounded-xl border border-red-500/30 text-red-400" role="alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Your email</label>
            <input 
              type="email"
              id="email" 
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="input-glass w-full"
              placeholder="Enter your email"
            />
            {formik.errors.email && formik.touched.email && (
              <div className="mt-2 text-sm text-red-400">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Your password</label>
            <input
              type="password" 
              id="password" 
              name='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="input-glass w-full"
              placeholder="Enter your password"
            />
            {formik.errors.password && formik.touched.password && (
              <div className="mt-2 text-sm text-red-400">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>Loading...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <i className="fas fa-sign-in-alt mr-2"></i>Login
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
