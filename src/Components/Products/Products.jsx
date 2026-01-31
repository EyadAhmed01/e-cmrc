import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { WishlistContext } from '../../Context/WishlistContext';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
    const [message, setMessage] = useState('');

    async function getProducts() {
        try {
            setIsLoading(true);
            const params = {
                page: currentPage,
                limit: 12
            };
            if (selectedBrand) params.brand = selectedBrand;
            if (selectedCategory) params.category = selectedCategory;
            if (searchTerm) params.keyword = searchTerm;

            const { data } = await axiosInstance.get('/products', { params });
            setProducts(data.data || []);
            setTotalPages(data.pagination?.numberOfPages || 1);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function getBrands() {
        try {
            const { data } = await axiosInstance.get('/brands');
            setBrands(data.data || []);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    }

    async function getCategories() {
        try {
            const { data } = await axiosInstance.get('/categories');
            setCategories(data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    useEffect(() => {
        getProducts();
    }, [currentPage, selectedBrand, selectedCategory]);

    useEffect(() => {
        getBrands();
        getCategories();
    }, []);

    async function handleAddToCart(productId, e) {
        e.preventDefault();
        e.stopPropagation();
        const result = await addToCart(productId);
        if (result.success) {
            setMessage('Product added to cart!');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.error || 'Failed to add to cart');
            setTimeout(() => setMessage(''), 3000);
        }
    }

    async function handleWishlistToggle(productId, e) {
        e.preventDefault();
        e.stopPropagation();
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
            setMessage('Removed from wishlist');
        } else {
            await addToWishlist(productId);
            setMessage('Added to wishlist');
        }
        setTimeout(() => setMessage(''), 3000);
    }

    function handleSearch(e) {
        e.preventDefault();
        setCurrentPage(1);
        getProducts();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Products</h2>

            {message && (
                <div className="mb-4 p-4 glass-strong rounded-xl border border-accent/30 text-accent animate-glow-pulse">
                    {message}
                </div>
            )}

            {/* Filters */}
            <div className="card-glass p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Search</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="input-glass w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Brand</label>
                        <select
                            value={selectedBrand}
                            onChange={(e) => {
                                setSelectedBrand(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="input-glass w-full"
                        >
                            <option value="">All Brands</option>
                            {brands.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="input-glass w-full"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="btn-primary w-full"
                        >
                            <i className="fas fa-search mr-2"></i>Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Products Grid */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="text-lg text-gray-400 animate-pulse">Loading products...</div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-lg text-gray-400">No products found</div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="card-glass group">
                                <Link to={`/productDetails/${product.id}`} className="block">
                                    <div className="relative overflow-hidden rounded-xl mb-4">
                                        <img
                                            src={product.imageCover}
                                            alt={product.title}
                                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link to={`/productDetails/${product.id}`}>
                                        <h3 className="text-lg font-semibold mb-2 hover:text-accent transition-colors text-white line-clamp-1">
                                            {product.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xl font-bold gradient-text">${product.price}</span>
                                        <div className="flex items-center gap-1 glass px-2 py-1 rounded-lg">
                                            <i className="fas fa-star text-yellow-400"></i>
                                            <span className="text-sm text-white">{product.ratingsAverage || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleAddToCart(product.id, e)}
                                            className="btn-primary flex-1 text-sm py-2"
                                        >
                                            <i className="fas fa-cart-plus mr-1"></i>Add to Cart
                                        </button>
                                        <button
                                            onClick={(e) => handleWishlistToggle(product.id, e)}
                                            className={`px-4 py-2 rounded-xl transition-smooth ${
                                                isInWishlist(product.id)
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 glow'
                                                    : 'glass text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                            }`}
                                        >
                                            <i className="fas fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="glass px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 text-white transition-smooth"
                            >
                                Previous
                            </button>
                            <span className="glass px-4 py-2 rounded-xl text-white">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="glass px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 text-white transition-smooth"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
