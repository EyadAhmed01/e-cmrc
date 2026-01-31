import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/products');
            setProducts(data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setMessage('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(productId) {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/products/${productId}`);
            setMessage('Product deleted successfully');
            fetchProducts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to delete product');
            setTimeout(() => setMessage(''), 3000);
        }
    }

    function handleEdit(product) {
        setEditingProduct(product);
        setShowModal(true);
    }

    function handleAdd() {
        setEditingProduct(null);
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        setEditingProduct(null);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold gradient-text">Products Management</h1>
                <button
                    onClick={handleAdd}
                    className="btn-primary"
                >
                    <i className="fas fa-plus mr-2"></i>Add Product
                </button>
            </div>

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
                <div className="text-center py-12 text-gray-400 animate-pulse">Loading products...</div>
            ) : (
                <div className="card-glass overflow-hidden">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={product.imageCover}
                                            alt={product.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-white">{product.title}</div>
                                        <div className="text-sm text-gray-400">{product.category?.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {product.quantity || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-400 hover:text-blue-300 mr-4 transition-colors"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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

            {showModal && (
                <ProductModal
                    product={editingProduct}
                    onClose={handleCloseModal}
                    onSuccess={() => {
                        handleCloseModal();
                        fetchProducts();
                    }}
                />
            )}
        </div>
    );
}

function ProductModal({ product, onClose, onSuccess }) {
    const [message, setMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            title: product?.title || '',
            description: product?.description || '',
            price: product?.price || '',
            quantity: product?.quantity || '',
            category: product?.category?._id || '',
            brand: product?.brand?._id || '',
            imageCover: product?.imageCover || '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            price: Yup.number().required('Price is required').positive('Price must be positive'),
            quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be 0 or more'),
        }),
        onSubmit: async (values) => {
            try {
                if (product) {
                    await axiosInstance.put(`/products/${product.id}`, values);
                    setMessage('Product updated successfully');
                } else {
                    await axiosInstance.post('/products', values);
                    setMessage('Product created successfully');
                }
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Failed to save product');
            }
        },
    });

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="card-glass p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold gradient-text">
                        {product ? 'Edit Product' : 'Add Product'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                {message && (
                    <div className={`mb-4 p-3 rounded-xl ${
                        message.includes('success') 
                            ? 'glass-strong border border-accent/30 text-accent' 
                            : 'glass border border-red-500/30 text-red-400'
                    }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            className="input-glass w-full"
                        />
                        {formik.errors.title && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            rows="4"
                            className="input-glass w-full"
                        />
                        {formik.errors.description && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                className="input-glass w-full"
                            />
                            {formik.errors.price && (
                                <p className="text-red-400 text-sm mt-1">{formik.errors.price}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-300">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                className="input-glass w-full"
                            />
                            {formik.errors.quantity && (
                                <p className="text-red-400 text-sm mt-1">{formik.errors.quantity}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Image URL</label>
                        <input
                            type="url"
                            name="imageCover"
                            value={formik.values.imageCover}
                            onChange={formik.handleChange}
                            className="input-glass w-full"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                        >
                            {product ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
