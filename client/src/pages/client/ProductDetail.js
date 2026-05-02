import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Minus, Plus, Check, Truck, Shield, RotateCcw, Heart, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL, BASE_URL } from '../../config';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import ProductCard from '../../components/client/ProductCard';
import { getImageUrl } from '../../utils/getImageUrl';


const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart, cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const { data: product, isLoading, refetch } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/products/slug/${slug}`
      );
      return response.data.product;
    },
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: true
  });

  React.useEffect(() => {
  if (product && product.variants && product.variants.length > 0) {
    setSelectedVariant((prev) => {
      if (!prev) return product.variants[0];

       // 🔥 find same variant from updated product
     const updatedVariant = product.variants.find(
     v => v._id === prev._id
  );

  return updatedVariant || product.variants[0];
});
    setQuantity(1);
  }
}, [product]);

  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', product?._id],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/products/related/${product._id}`
      );
      return response.data.products;
    },
    enabled: !!product?._id
  });

  const cartItem = cart.find(
  item =>
    item.productId === product?._id &&
    item.variant?._id === selectedVariant?._id
);

const cartQty = cartItem?.quantity || 0;

const availableStock = (selectedVariant?.stock || 0) - cartQty;
  
const handleAddToCart = () => {
  if (!selectedVariant) {
    toast.error("Select a variant", { id: 'variant-error' });
    return;
  }

  const stock = selectedVariant.stock || 0;

  if (quantity > availableStock) {
    toast.error('Maximum stock reached', { id: 'stock-error' });
    return;
  }

  addToCart({
    ...product,
    productId: product._id,
    name: product.name,
    image: product.image,
    variant: selectedVariant
  }, quantity);

  // ✅ ONLY SHOW SUCCESS IF ACTUALLY ADDED
  if (quantity <= stock) {
    toast.success('Added to cart!', {
      id: 'cart-toast'
    });
  }
};
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="flex items-center hover:text-green-700 transition-colors">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-green-700 transition-colors">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square"
              >
                <img
                  src={getImageUrl(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </motion.div>

              {product.featured && (
                <div className="absolute top-4 right-4 bg-green-700 text-white px-4 py-2 rounded-full font-bold">
                  ⭐ Featured
                </div>
              )}
            </div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="mb-2">
                <span className="text-green-700 font-semibold">
                  {product.category?.name}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Variants */}
              <div className="mb-6">
              <p className="font-semibold mb-2">Select Quantity:</p>

              <div className="flex gap-3">
              {product?.variants?.map((variant) => (
               <button
               key={variant._id} // ✅ FIX 1
               onClick={() => setSelectedVariant(variant)}
               className={`px-4 py-2 rounded-lg border ${
               selectedVariant?._id === variant._id // ✅ FIX 2
               ? 'bg-green-700 text-white'
               : 'bg-white'
              }`}
              >
             {variant.quantity}
             </button>
              ))}
              </div>

               <h2 className="text-3xl font-bold">
                ₹{selectedVariant?.price || 0}
                </h2>
                </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-6">
                {(selectedVariant?.stock || 0) > 0 ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-medium">
                      In Stock ({selectedVariant?.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">Quantity</p>
                <div className="flex items-center border-2 border-gray-200 rounded-xl w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-gray-100 transition-colors rounded-l-xl"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-4 font-bold text-lg min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock || 1, quantity + 1))}
                    className="p-4 hover:bg-gray-100 transition-colors rounded-r-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-wrap gap-4 mb-8">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={(selectedVariant?.stock || 0) === 0}
                  className="flex-1 min-w-[200px] py-4 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{(selectedVariant?.stock || 0) > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-green-700" />
                  <div>
                    <p className="font-semibold text-sm">Free Delivery</p>
                    <p className="text-xs text-gray-500">Orders above ₹500</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-700" />
                  <div>
                    <p className="font-semibold text-sm">100% Organic</p>
                    <p className="text-xs text-gray-500">Certified products</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-6 h-6 text-green-700" />
                  <div>
                    <p className="font-semibold text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-500">7 days return policy</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews ({product.numReviews})
            </h2>
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 ml-auto">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
