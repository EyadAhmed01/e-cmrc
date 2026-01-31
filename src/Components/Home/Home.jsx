import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { WishlistContext } from '../../Context/WishlistContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const [message, setMessage] = useState('');

  async function getProducts() {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get('/products', { params: { limit: 20 } });
      setProducts(data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 gradient-text">Featured Products</h2>

      {message && (
        <div className="mb-4 p-4 glass-strong rounded-xl border border-accent/30 text-accent animate-glow-pulse">
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-lg text-gray-400 animate-pulse">Loading products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-lg text-gray-400">No products found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card-glass group">
              <Link to={"/productDetails/" + product.id} className="block">
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                    src={product.imageCover} 
                    alt={product.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
              <div className="p-4">
                <Link to={"/productDetails/" + product.id}>
                  <h5 className="mb-2 text-lg font-bold text-white hover:text-accent transition-colors line-clamp-1">
                    {product.title}
                  </h5>
                </Link>
                <p className="mb-3 text-sm text-gray-400 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
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
                    <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                  </button>
                  <button
                    onClick={(e) => handleWishlistToggle(product.id, e)}
                    className={`px-3 py-2 rounded-xl transition-smooth ${
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
      )}
    </div>
  );
}
