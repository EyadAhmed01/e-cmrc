import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function AdminBrands() {
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchBrands();
    }, []);

    async function fetchBrands() {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/brands');
            setBrands(data.data || []);
        } catch (error) {
            console.error('Error fetching brands:', error);
            setMessage('Failed to load brands');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(brandId) {
        if (!window.confirm('Are you sure you want to delete this brand?')) {
            return;
        }

        try {
            await axiosInstance.delete(`/brands/${brandId}`);
            setMessage('Brand deleted successfully');
            fetchBrands();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to delete brand');
            setTimeout(() => setMessage(''), 3000);
        }
    }

    function handleEdit(brand) {
        setEditingBrand(brand);
        setShowModal(true);
    }

    function handleAdd() {
        setEditingBrand(null);
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
        setEditingBrand(null);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold gradient-text">Brands Management</h1>
                <button
                    onClick={handleAdd}
                    className="btn-primary"
                >
                    <i className="fas fa-plus mr-2"></i>Add Brand
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
                <div className="text-center py-12 text-gray-400 animate-pulse">Loading brands...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.map((brand) => (
                        <div key={brand._id} className="card-glass p-6">
                            {brand.image && (
                                <img
                                    src={brand.image}
                                    alt={brand.name}
                                    className="w-full h-32 object-contain mb-4"
                                />
                            )}
                            <h3 className="text-xl font-semibold mb-2 text-white">{brand.name}</h3>
                            {brand.slug && (
                                <p className="text-gray-400 text-sm mb-4">{brand.slug}</p>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(brand)}
                                    className="btn-secondary flex-1"
                                >
                                    <i className="fas fa-edit mr-2"></i>Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(brand._id)}
                                    className="glass text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-smooth flex-1"
                                >
                                    <i className="fas fa-trash mr-2"></i>Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <BrandModal
                    brand={editingBrand}
                    onClose={handleCloseModal}
                    onSuccess={() => {
                        handleCloseModal();
                        fetchBrands();
                    }}
                />
            )}
        </div>
    );
}

function BrandModal({ brand, onClose, onSuccess }) {
    const [message, setMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            name: brand?.name || '',
            slug: brand?.slug || '',
            image: brand?.image || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            slug: Yup.string().required('Slug is required'),
        }),
        onSubmit: async (values) => {
            try {
                if (brand) {
                    await axiosInstance.put(`/brands/${brand._id}`, values);
                    setMessage('Brand updated successfully');
                } else {
                    await axiosInstance.post('/brands', values);
                    setMessage('Brand created successfully');
                }
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Failed to save brand');
            }
        },
    });

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="card-glass p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold gradient-text">
                        {brand ? 'Edit Brand' : 'Add Brand'}
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
                        <label className="block text-sm font-medium mb-1 text-gray-300">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            className="input-glass w-full"
                        />
                        {formik.errors.name && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formik.values.slug}
                            onChange={formik.handleChange}
                            className="input-glass w-full"
                        />
                        {formik.errors.slug && (
                            <p className="text-red-400 text-sm mt-1">{formik.errors.slug}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formik.values.image}
                            onChange={formik.handleChange}
                            className="input-glass w-full"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                        >
                            {brand ? 'Update' : 'Create'}
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
