import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Shield, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { API_URL, RAZORPAY_KEY } from '../../config';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/getImageUrl';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  const shipping = cartTotal > 500 ? 0 : 50;
  const grandTotal = cartTotal + shipping;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { fullName, email, phone, address, city, state, pincode } = formData;
    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      toast.error('Please fill all required fields');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.productId,
        name: item.name,
        price: item.salePrice || item.price,
        quantity: item.quantity,
        image: item.image,
        variant:item.variant
      }));

      const orderData = {
        orderItems,
        shippingInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: 'razorpay'
      };

      const orderResponse = await axios.post(
        `/orders`,
        orderData
      );

      const { razorpayOrder, order } = orderResponse.data;

      const res = await loadRazorpay();
      if (!res) {
        toast.error('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Sri Bhoomi Organics',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#2e7d32'
        },
        handler: async (response) => {
          try {
            await await axios.post(`/orders/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.success('Payment successful! Order placed.');
            clearCart();
            navigate('/dashboard?tab=orders');
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: {
         ondismiss: async () => {
           try {
             await axios.delete(`/orders/${order._id}`);
             console.log("Order deleted (payment cancelled)");
            } catch (err) {
               console.error(err);
              }
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async (response) => {
      try {
       await axios.delete(`/orders/${order._id}`);
       console.log("Order deleted (payment failed)");
      }catch (err) {
       console.error(err);
      }

      toast.error(response.error?.description || 'Payment failed');
      setLoading(false);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process payment');
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.productId,
        name: item.name,
        price: item.salePrice || item.price,
        quantity: item.quantity,
        image: item.image,
        variant: item.variant
        
      }));

      const orderData = {
        orderItems,
        shippingInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: 'cod'
      };

      await axios.post(`/orders`, orderData);

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/dashboard?tab=orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStep(2);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <div className="w-20 h-1 bg-green-700" />
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                2
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Truck className="w-6 h-6 mr-3 text-green-700" />
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="10-digit mobile number"
                        maxLength="10"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Address *
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="House number, street, landmark"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter state"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="6-digit pincode"
                        maxLength="6"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 py-4 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors"
                  >
                    Continue to Payment
                  </motion.button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-sm p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-3 text-green-700" />
                    Payment Method
                  </h2>

                  <div className="space-y-4 mb-8">
                    {/* Razorpay Option */}
                    <label className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'razorpay' 
                        ? 'border-green-700 bg-green-50' 
                        : 'border-gray-200 hover:border-green-500'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-green-700"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">💳</span>
                          <div>
                            <p className="font-bold text-gray-900">Pay with Razorpay</p>
                            <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking, Wallets</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-green-700">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm font-medium">Secure</span>
                      </div>
                    </label>

                    {/* COD Option */}
                    <label className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === 'cod' 
                        ? 'border-green-700 bg-green-50' 
                        : 'border-gray-200 hover:border-green-500'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-green-700"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">💵</span>
                          <div>
                            <p className="font-bold text-gray-900">Cash on Delivery</p>
                            <p className="text-sm text-gray-500">Pay when you receive your order</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </button>
                    <button
                      onClick={() => paymentMethod === 'razorpay' ? handleRazorpayPayment() : handleCODOrder()}
                      disabled={loading}
                      className="flex-[2] py-4 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : paymentMethod === 'razorpay' ? `Pay ₹${grandTotal.toFixed(2)}` : 'Place Order'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4">
                      <img
                        src={getImageUrl(item.image)} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.variant?.quantity}</p>
                      </div>
                      <p className="font-bold">
                        ₹{((item.variant?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
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
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-green-700">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
