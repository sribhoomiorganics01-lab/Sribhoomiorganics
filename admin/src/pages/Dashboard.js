import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
import { Package, ShoppingCart, Users, Grid3X3, AlertTriangle, Clock, TrendingUp, Eye } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

const fetchStats = async () => {
  try {
    const token = localStorage.getItem('adminToken');

    // 🔥 ADD THIS CHECK
    if (!token) {
      toast.error('Admin not logged in');
      setLoading(false);
      return;
    }

    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setStats(response.data.stats);

  } catch (error) {
    console.log("DASHBOARD ERROR:", error?.response);

    // 🔥 HANDLE 401 CLEANLY
    if (error?.response?.status === 401) {
      toast.error('Session expired. Please login again');
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
      return;
    }

    toast.error('Failed to fetch dashboard data');
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <Package className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Categories',
      value: stats?.totalCategories || 0,
      icon: <Grid3X3 className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      label: 'Low Stock',
      value: stats?.lowStock || 0,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: <Clock className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <span className="text-sm text-gray-500">{stats?.recentOrders?.length || 0} orders</span>
          </div>

          <div className="space-y-4">
            {stats?.recentOrders?.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{order.totalPrice}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                    order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}

            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>

          <div className="space-y-4">
            {stats?.topProducts?.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                  </div>
                </div>
                <p className="font-bold text-green-600">₹{product.revenue}</p>
              </div>
            ))}

            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No sales data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Revenue */}
      {stats?.monthlyRevenue && stats.monthlyRevenue.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stats.monthlyRevenue.map((month) => (
              <div key={month._id} className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <p className="text-sm text-gray-600 font-medium">{month._id}</p>
                <p className="text-xl font-bold text-green-700 mt-1">₹{month.revenue}</p>
                <p className="text-xs text-gray-500">{month.orders} orders</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
