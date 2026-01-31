import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';

export default function Brands() {
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function getBrands() {
        try {
            setIsLoading(true);
            const { data } = await axiosInstance.get('/brands');
            setBrands(data.data || []);
        } catch (error) {
            console.error('Error fetching brands:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getBrands();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-400 animate-pulse">Loading brands...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Brands</h2>
            
            {brands.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-lg text-gray-400">No brands found</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {brands.map((brand) => (
                        <Link
                            key={brand._id}
                            to={`/products?brand=${brand._id}`}
                            className="card-glass p-6 text-center group hover:border-accent/30 transition-all"
                        >
                            {brand.image && (
                                <img
                                    src={brand.image}
                                    alt={brand.name}
                                    className="w-32 h-32 object-contain mx-auto mb-4 transition-transform group-hover:scale-110"
                                />
                            )}
                            <h3 className="text-xl font-semibold text-white hover:text-accent transition-colors">
                                {brand.name}
                            </h3>
                            {brand.slug && (
                                <p className="text-sm text-gray-400 mt-2">{brand.slug}</p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
