import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../../config';
import ProductCard from '../../components/client/ProductCard';
import Skeleton from '../../components/client/Skeleton';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState('newest');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const bestSeller = searchParams.get('bestSeller') || '';
  const page = parseInt(searchParams.get('page')) || 1;

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, search, featured, bestSeller, page, sortOption,priceRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (featured) params.append('featured', featured);
      if (bestSeller) params.append('bestSeller', bestSeller);
      if (priceRange[1] < 1000) {
       params.append('minPrice', priceRange[0]);
       params.append('maxPrice', priceRange[1]);
      }
      
      // Add sorting
      switch (sortOption) {
        case 'price-low':
          params.append('sortField', 'price');
          params.append('sortOrder', 'asc');
          break;
        case 'price-high':
          params.append('sortField', 'price');
          params.append('sortOrder', 'desc');
          break;
        case 'name':
          params.append('sortField', 'name');
          params.append('sortOrder', 'asc');
          break;
        default:
          params.append('sortField', 'createdAt');
          params.append('sortOrder', 'desc');
      }
      
      params.append('page', page);
      params.append('limit', 12);

      const response = await axios.get(`${API_URL}/products?${params}`);
      return response.data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data.categories;
    }
  });

  const getTitle = () => {
    if (featured === 'true') return 'Featured Products';
    if (bestSeller === 'true') return 'Best Sellers';
    if (search) return `Search results for "${search}"`;
    if (category) {
      const cat = categories?.find(c => c.slug === category);
      return cat?.name || 'Products';
    }
    return 'All Products';
  };

  const handleCategoryClick = (slug) => {
    if (category === slug) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const handleQuickFilter = (filter) => {
    searchParams.delete('category');
    searchParams.delete('featured');
    searchParams.delete('bestSeller');
    if (filter === 'featured') {
      searchParams.set('featured', 'true');
    } else if (filter === 'bestSeller') {
      searchParams.set('bestSeller', 'true');
    }
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage);
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    searchParams.delete('category');
    searchParams.delete('featured');
    searchParams.delete('bestSeller');
    searchParams.delete('search');
    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const hasFilters = category || featured || bestSeller || search;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-2"
          >
            {getTitle()}
          </motion.h1>
          <p className="text-white/80 text-lg">
  {data?.total || 0} products found
</p>


        </div>
      </div>

      <AnimatePresence>
  {showFilters && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex justify-end"
      onClick={() => setShowFilters(false)}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
        className="w-80 bg-white h-full p-6 overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setShowFilters(false)}
          className="mb-4 flex items-center gap-2 text-gray-700"
        >
          <X className="w-5 h-5" />
          Close
        </button>

        {/* 👇 MOVE YOUR FILTER CONTENT HERE */}
        {/* Copy everything inside your <aside> and paste here */}
        <div className="space-y-6">

  {/* Categories */}
  <div>
    <h3 className="font-semibold text-lg mb-3">Categories</h3>

    <button
      onClick={() => {
        searchParams.delete('category');
        setSearchParams(searchParams);
        setShowFilters(false);
      }}
      className="block w-full text-left py-2 border-b"
    >
      All Products
    </button>

    {categories?.map((cat) => (
      <button
        key={cat._id}
        onClick={() => {
          handleCategoryClick(cat.slug);
          setShowFilters(false);
        }}
        className="block w-full text-left py-2 border-b"
      >
        {cat.name}
      </button>
    ))}
  </div>

  {/* Quick Filters */}
  <div>
    <h3 className="font-semibold text-lg mb-3">Quick Filters</h3>

    <button
      onClick={() => {
        handleQuickFilter('featured');
        setShowFilters(false);
      }}
      className="block w-full text-left py-2 border-b"
    >
      ⭐ Featured Products
    </button>

    <button
      onClick={() => {
        handleQuickFilter('bestSeller');
        setShowFilters(false);
      }}
      className="block w-full text-left py-2 border-b"
    >
      🏆 Best Sellers
    </button>
  </div>

  {/* Price Range */}
  <div>
    <h3 className="font-semibold text-lg mb-3">Price Range</h3>

    <input
      type="range"
      min="100"
      max="1000"
      step="50"
      value={priceRange[1]}
      onChange={(e) => {
        setPriceRange([0, parseInt(e.target.value)]);
        searchParams.set('page', 1);
        setSearchParams(searchParams);
      }}
      className="w-full"
    />

    <div className="flex justify-between text-sm mt-2">
      <span>₹100</span>
      <span>₹{priceRange[1]}</span>
    </div>
  </div>

</div>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                {hasFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-green-700 hover:text-green-800 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      searchParams.delete('category');
                      searchParams.delete('page');
                      setSearchParams(searchParams);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      !category
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    All Products
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                        category === cat.slug
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="mr-2">{cat.icon}</span>
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Filters</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleQuickFilter('featured')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      featured === 'true'
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    ⭐ Featured Products
                  </button>
                  <button
                    onClick={() => handleQuickFilter('bestSeller')}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      bestSeller === 'true'
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    🏆 Best Sellers
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>₹0</span>
                    <span>₹{priceRange[1]}{priceRange[1] >= 1000 ? '+' : ''}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => {
                            setPriceRange([0, parseInt(e.target.value)]);
                            searchParams.set('page', 1);
                            setSearchParams(searchParams);
                          }}
                    className="w-full accent-green-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₹100</span>
                    <span>₹1000+</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </button>
                <span className="text-gray-600">
                  Showing {data?.products?.length || 0} of {data?.total || 0} products
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm hidden sm:inline">Sort by:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

          
            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={category || featured || bestSeller || 'all'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {data?.products?.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {data?.products?.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {data?.pages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="p-3 bg-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {[...Array(data.pages)].map((_, i) => {
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === data.pages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={i}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium ${
                              page === pageNum
                                ? 'bg-green-700 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return <span key={i}>...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === data.pages}
                      className="p-3 bg-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
