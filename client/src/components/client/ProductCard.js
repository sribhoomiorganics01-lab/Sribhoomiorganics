import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/getImageUrl';
import { API_URL, BASE_URL } from '../../config';


const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

const handleAddToCart = () => {
  if (!availableVariant) {
    toast.error("Out of stock", { id: 'stock-error' });
    return;
  }

  addToCart({
    ...product,
    productId: product._id,
    variant: availableVariant
  }, 1);

  toast.success('Added to cart!', {
    id: 'cart-toast'
  });
};
    
    const availableVariant = product.variants?.find(v => v.stock > 0);
    const firstVariant = availableVariant || product.variants?.[0];
    

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="card-elevated overflow-hidden group flex flex-col">
          {/* Image Container */}
          <div className="relative h-40 sm:h-52  overflow-hidden bg-earth-100">
            <img
                 src={getImageUrl(product.image)}
                alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
               onError={(e) => {
                  e.target.src = '/fallback.png';
                }}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && !product.salePrice && (
                <span className="badge-featured text-sm px-3 py-1.5">
                  ⭐ Featured
                </span>
              )}
              {product.bestSeller && !product.featured && !product.salePrice && (
                <span className="badge-bestseller text-sm px-3 py-1.5">
                  🏆 Best Seller
                </span>
              )}
            </div>

            <motion.button
  initial={{ opacity: 0, y: 20 }}
  whileHover={{ scale: availableVariant?.stock > 0 ? 1.05 : 1 }}
  whileTap={{ scale: availableVariant?.stock > 0 ? 0.95 : 1 }}
 onClick={(e) => {
  e.preventDefault();   // 🔥 STOP LINK NAVIGATION
  e.stopPropagation();  // 🔥 STOP EVENT BUBBLE
  handleAddToCart();
}}
  disabled={!availableVariant}
  className={`absolute bottom-4 right-4 p-2.5 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 ${
    !availableVariant
      ? "bg-gray-300 cursor-not-allowed"
      : "bg-white/95 hover:bg-olive-600 hover:text-white"
  }`}
>
  <ShoppingCart className="w-5 h-5" />
</motion.button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 flex flex-col flex-grow space-y-2">
            {/* Category */}
            <p className="text-xs font-medium text-olive-600 uppercase tracking-wider mb-2">
              {product.category?.name || 'Organic'}
            </p>

            {/* Title */}
            <h3 className="font-display text-sm sm:text-base md:text-lg font-semibold text-earth-900 mb-2 line-clamp-2 group-hover:text-olive-700 transition-colors leading-snug">
              {product.name}
            </h3>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Price & Unit */}
            <div className="flex items-end justify-between pt-3 border-t border-earth-100">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg md:text-xl font-bold text-earth-900">
                      ₹{firstVariant?.price || 0}
                  </span>
                </div>
                <span className="text-xs text-earth-500 mt-0.5">
                    {firstVariant?.quantity}
                  </span>            
                   </div>

              {/* Stock Status */}
              {product.stock > 0 && product.stock <= 10 && (
                <span className="text-xs text-red-600 font-medium">Only {product.stock} left</span>
              )}
            </div>

            {/* Add to Cart Button (Mobile) */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}onClick={(e) => {
  e.preventDefault(); 
  e.stopPropagation();  
  handleAddToCart();
}}
              className="mt-3 w-full py-2 text-sm bg-earth-100 hover:bg-olive-600 text-earth-800 hover:text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 lg:hidden"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
