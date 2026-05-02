import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
import { Filter, ChevronDown, Eye, Check, X } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 FILTER
   const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
      return order.orderStatus === filter;
    });

  // 🔥 SORT (latest first)
   const sortedOrders = filteredOrders.sort((a, b) =>
     new Date(b.createdAt) - new Date(a.createdAt)
    );
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.get(`${API_URL}/admin/orders`);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axios.put(
        `${API_URL}/admin/orders/${orderId}/status`,
        { orderStatus: status }
      );
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all orders</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">₹{order.totalPrice}</p>
                  <p className="text-sm text-gray-500">{order.orderItems.length} items</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{order.user?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                  </div>
                  <div className="h-12 w-px bg-gray-200 hidden md:block" />
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <p className="font-medium capitalize">{order.paymentMethod}</p>
                  </div>
                </div>

                <button className="flex items-center space-x-1 text-purple-600 font-medium">
                  <span>{expandedOrder === order._id ? 'Hide' : 'View'} Details</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {expandedOrder === order._id && (
              <div className="border-t px-6 py-6 bg-gray-50">
                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <img
                            src={`${API_URL.replace('/api', '')}/uploads/${item.image}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.variant?.quantity}</p>
                            <p className="text-sm text-gray-500">{item.unit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{item.variant?.price}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Shipping Address</h4>
                  <div className="bg-white p-4 rounded-xl">
                    <p className="font-medium">{order.shippingInfo.fullName}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {order.shippingInfo.address}<br />
                      {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}<br />
                      Phone: {order.shippingInfo.phone}
                    </p>
                  </div>
                </div>

                {/* Order Actions */}
                {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(order._id, status)}
                          disabled={order.orderStatus === status}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            order.orderStatus === status
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                      <button
                        onClick={() => updateStatus(order._id, 'cancelled')}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
