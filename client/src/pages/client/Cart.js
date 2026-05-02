import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { API_URL } from '../../config';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/getImageUrl';


const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const shipping = cartTotal > 500 ? 0 : 50;
  const grandTotal = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="text-9xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any organic goodness to your cart yet.
            Start shopping to discover our premium collection!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors"
          >
            <ShoppingBag className="mr-2 w-5 h-5" />
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">
                      {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear Cart
                    </button>
                  </div>

                  <div className="space-y-6">
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item.productId}-${item.variant?.quantity}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 sm:gap-6 py-6 border-b last:border-0"
                      >
                        <Link to={`/products/${item.slug}`}>
                          <img
                            src={getImageUrl(item.image)} 
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0"
                          />
                        </Link>

                        <div className="flex-1 min-w-[120px]">
                          <Link
                            to={`/products/${item.slug}`}
                            className="font-bold text-lg text-gray-900 hover:text-green-700 transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-gray-500 text-sm mt-1">{item.variant?.quantity}</p>
                          <p className="text-green-700 font-bold text-lg mt-2">
                            ₹{item.variant?.price || 0}
                          </p>
                        </div>

                        {/* ✅ FIXED PART */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6">

                          <div className="flex items-center border rounded-xl">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.productId, item.variant?.quantity, item.quantity - 1);
                                }
                              }}
                              className="p-3 hover:bg-gray-100 transition-colors rounded-l-xl"
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                if (item.quantity < (item.variant?.stock || 0)) {
                                  updateQuantity(item.productId, item.variant?.quantity, item.quantity + 1);
                                } else {
                                  toast.error("Maximum stock reached", {
                                    id: 'stock-error'
                                  });
                                }
                              }}
                              className="p-3 hover:bg-gray-100 transition-colors rounded-r-xl"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="text-right w-full sm:w-auto">
                            <p className="font-bold text-xl text-gray-900 whitespace-nowrap">
                              ₹{((item.variant?.price || 0 )* item.quantity).toFixed(2)}
                            </p>
                            <button
                              onClick={() =>removeFromCart(item.productId, item.variant?.quantity)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium mt-2 flex items-center ml-auto"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          </div>

                        </div>
                        {/* ✅ END FIX */}

                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                  <Link
                    to="/products"
                    className="flex items-center text-green-700 hover:text-green-800 font-medium"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-700">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  {cartTotal < 500 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-sm text-green-700">
                        Add ₹{(500 - cartTotal).toFixed(2)} more for{" "}
                        <span className="font-bold">FREE delivery!</span>
                      </p>
                      <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 transition-all"
                          style={{ width: `${(cartTotal / 500) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-green-700">₹{grandTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full py-4 bg-green-700 text-white text-center rounded-xl font-bold hover:bg-green-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-2">Secure Payment</p>
                  <div className="flex items-center space-x-3 text-2xl">
                    <span>💳</span>
                    <span>🏦</span>
                    <span>📱</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    100% secure payment processing
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;