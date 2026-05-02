import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../../config';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
 
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
     const res = await axios.get(`${API_URL}/categories`);
     return res.data.categories;
    }
  });

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };
  

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-earth-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-olive-600 rounded-xl flex items-center justify-center text-white text-xl">
              🌿
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-earth-900 tracking-tight">Sri Bhoomi</h1>
              <p className="text-xs text-earth-500 -mt-0.5">Organics</p>
            </div>
          </Link>
          

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-earth-700 hover:text-olive-700 font-medium transition-colors"
            >
              Home
            </Link>

            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                onBlur={() => setTimeout(() => setCategoryOpen(false), 200)}
                className="flex items-center space-x-1 text-earth-700 hover:text-olive-700 font-medium transition-colors"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {categoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-earth-100 p-2 z-50"
                  >
                    {categories?.map((cat) => (
                      <Link
                       key={cat._id}
                       to={`/products?category=${cat.slug}`} // keep slug 👍
                       onClick={() => setCategoryOpen(false)}
                       className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                      >
                      <span className="text-xl">{cat.icon || '🌿'}</span>
                      <span className="text-earth-700 font-medium">{cat.name}</span>
                      </Link>
                    ))}
                    <div className="border-t border-earth-100 mt-2 pt-2">
                      <Link
                        to="/products"
                        onClick={() => setCategoryOpen(false)}
                        className="flex items-center justify-center space-x-2 px-4 py-3 text-olive-700 hover:bg-olive-50 rounded-xl font-medium transition-colors"
                      >
                        View All Products
                        <Package className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/products?featured=true"
              className="text-earth-700 hover:text-olive-700 font-medium transition-colors"
            >
              Featured
            </Link>

            <Link
              to="/products?bestSeller=true"
              className="text-earth-700 hover:text-olive-700 font-medium transition-colors"
            >
              Best Sellers
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-earth-600 hover:text-olive-700 hover:bg-cream rounded-xl transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 text-earth-600 hover:text-olive-700 hover:bg-cream rounded-xl transition-all"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartItemsCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-olive-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {getCartItemsCount()}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onBlur={() => setTimeout(() => setUserMenuOpen(false), 200)}
                  className="flex items-center space-x-2 p-1.5 hover:bg-cream rounded-xl transition-all"
                >
                  <div className="w-8 h-8 bg-olive-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-earth-100 overflow-hidden"
                    >
                      <div className="px-5 py-4 bg-cream border-b border-earth-100">
                        <p className="font-semibold text-earth-900">{user.name}</p>
                        <p className="text-sm text-earth-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                        >
                          <User className="w-5 h-5 text-earth-500" />
                          <span className="text-earth-700">My Account</span>
                        </Link>
                        <Link
                          to="/dashboard?tab=orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-cream transition-colors"
                        >
                          <Package className="w-5 h-5 text-earth-500" />
                          <span className="text-earth-700">My Orders</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-earth-700 hover:text-olive-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-olive-600 text-white font-medium rounded-xl hover:bg-olive-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-earth-600 hover:bg-cream rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-earth-100 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form onSubmit={handleSearch} className="relative z-10">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for organic products..."
                  className="w-full pl-12 pr-4 py-3.5 bg-cream border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="lg:hidden border-t border-earth-100 overflow-hidden bg-white"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-earth-700 hover:bg-cream rounded-xl font-medium"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-earth-700 hover:bg-cream rounded-xl font-medium"
              >
                All Products
              </Link>
              <Link
                to="/products?featured=true"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-earth-700 hover:bg-cream rounded-xl font-medium"
              >
                Featured
              </Link>
              <Link
                to="/products?bestSeller=true"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-earth-700 hover:bg-cream rounded-xl font-medium"
              >
                Best Sellers
              </Link>
              {!user && (
                <div className="pt-4 border-t border-earth-100 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-earth-700 hover:bg-cream rounded-xl font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-olive-600 text-white text-center rounded-xl font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
