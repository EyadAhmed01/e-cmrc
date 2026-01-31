import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { CartContext } from '../../Context/CartContext';
import { WishlistContext } from '../../Context/WishlistContext';

export default function ProductDetails() {
  const { pId } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);

  async function getProductDetails() {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(`/products/${pId}`);
      setProductDetails(data.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setMessage('Product not found');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProductDetails();
  }, [pId]);

  async function handleAddToCart() {
    if (!productDetails) return;
    
    for (let i = 0; i < quantity; i++) {
      const result = await addToCart(productDetails.id);
      if (!result.success) {
        setMessage(result.error || 'Failed to add to cart');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
    }
    
    setMessage(`Added ${quantity} item(s) to cart!`);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleWishlistToggle() {
    if (!productDetails) return;
    
    if (isInWishlist(productDetails.id)) {
      await removeFromWishlist(productDetails.id);
      setMessage('Removed from wishlist');
    } else {
      await addToWishlist(productDetails.id);
      setMessage('Added to wishlist');
    }
    setTimeout(() => setMessage(''), 3000);
  }

  function handleQuantityChange(newQuantity) {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-400 animate-pulse">Loading product details...</div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="card-glass p-12">
          <h2 className="text-2xl font-bold mb-4 gradient-text">Product Not Found</h2>
          <button
            onClick={() => navigate('/home')}
            className="btn-primary"
          >
            <i className="fas fa-home mr-2"></i>Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {message && (
        <div className="mb-4 p-4 glass-strong rounded-xl border border-accent/30 text-accent animate-glow-pulse">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-glass p-6">
          <img
            src={productDetails.imageCover}
            alt={productDetails.title}
            className="w-full rounded-xl shadow-lg mb-4"
          />
          {productDetails.images && productDetails.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {productDetails.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${productDetails.title} ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-white/20 hover:border-accent/50 cursor-pointer transition-colors"
                />
              ))}
            </div>
          )}
        </div>

        <div className="card-glass p-6 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">{productDetails.title}</h1>
          <p className="text-gray-400 mb-6 text-lg">{productDetails.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold gradient-text">${productDetails.price}</span>
            {productDetails.priceAfterDiscount && (
              <span className="text-xl text-gray-500 line-through">
                ${productDetails.priceAfterDiscount}
              </span>
            )}
            {productDetails.discount && (
              <span className="glass px-3 py-1 rounded-full text-sm font-semibold text-red-400 border border-red-500/30">
                {productDetails.discount}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star ${
                    i < Math.floor(productDetails.ratingsAverage || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-600'
                  }`}
                ></i>
              ))}
            </div>
            <span className="text-gray-400">
              ({productDetails.ratingsQuantity || 0} reviews)
            </span>
          </div>

          {productDetails.category && (
            <div className="mb-4">
              <span className="text-sm text-gray-400">Category: </span>
              <span className="font-semibold text-white">{productDetails.category.name}</span>
            </div>
          )}

          {productDetails.brand && (
            <div className="mb-6">
              <span className="text-sm text-gray-400">Brand: </span>
              <span className="font-semibold text-white">{productDetails.brand.name}</span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <label className="font-semibold text-white">Quantity:</label>
            <div className="flex items-center gap-3 glass px-3 py-2 rounded-xl">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="text-white hover:text-accent font-bold text-lg disabled:opacity-50 transition-colors"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="text-xl font-semibold w-12 text-center text-white">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="text-white hover:text-accent font-bold text-lg disabled:opacity-50 transition-colors"
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1"
            >
              <i className="fas fa-cart-plus mr-2"></i>Add to Cart
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-smooth ${
                isInWishlist(productDetails.id)
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 glow'
                  : 'glass text-gray-400 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <i className="fas fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
