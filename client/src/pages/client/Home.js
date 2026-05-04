import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, Leaf, Heart, Star, ChevronRight, Menu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL} from '../../config';
import ProductCard from '../../components/client/ProductCard';
import { getImageUrl } from '../../utils/getImageUrl';


const Home = () => {
  const navigate = useNavigate();
  const [marqueeText, setMarqueeText] = useState('');
  const [promoImage, setPromoImage] = useState('');

  useEffect(() => {
  const fetchSettings = async () => {
    const res = await axios.get(`${API_URL}/settings`);
    setMarqueeText(res.data.marqueeText);
    setPromoImage(res.data.promoImage);
  };

  fetchSettings();
}, []);

  const { data: featuredProducts } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products/featured`);
      return response.data.products;
    }
  });

  const { data: bestSellers } = useQuery({
    queryKey: ['bestSellers'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/products/best-sellers`);
      return response.data.products;
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data.categories;
    }
  });

  const promises = [
    { icon: Leaf, title: '100% Organic', desc: 'Certified by authorities' },
    { icon: Shield, title: 'No Chemicals', desc: 'Zero pesticides & additives' },
    { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹500' },
    { icon: Heart, title: 'Farm Fresh', desc: 'Direct from farmers' }
  ];

  const stats = [
    { value: '500+', label: 'Happy Customers' },
    { value: '180+', label: 'Organic Products' },
    { value: '10+', label: 'Categories' },
    { value: '100%', label: 'Natural' }
  ];

  
  return (
    <div className="min-h-screen">
      {/* Hero Section - Minimal & Premium */}
      <section className="relative bg-gradient-to-br from-cream via-earth-50 to-brand-50 overflow-hidden">
        {/* Marquee */}
        <div className="marquee-container bg-green-700 text-white text-sm sm:text-base py-2 sm:py-3 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
           {marqueeText || "🎉 Welcome to Sri Bhoomi 🌿"}
         </div>
        </div>
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-olive-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl"></div>
        </div>
   
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-olive-100 text-olive-800 rounded-full text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 bg-olive-500 rounded-full"></span>
                Pure & Traditional
              </motion.span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-display font-bold text-earth-900 leading-tight mb-6">
                Return to
                <br />
                <span className="text-gradient-earth">Nature's Bounty</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-earth-600 leading-relaxed mb-8 max-w-lg">
                Discover authentic organic products sourced directly from traditional farms. 
                Experience the pure taste of heritage grains, cold-pressed oils, and ancient wisdom.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/products')}
                  className="btn-primary text-sm sm:text-base px-5 py-3"
                >
                  Explore Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/products?featured=true')}
                  className="btn-outline text-base"
                >
                  Featured Products
                </button>
              </div>
            </motion.div>
            {/* RIGHT SIDE IMAGE */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="hidden lg:flex justify-center"
              >
               <img
                  src={getImageUrl(promoImage)}
                  alt="Promo"
                  className="w-[720px] h-[480px] object-cover rounded-2xl shadow-2xl hover:scale-105 transition"
                />
             </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="#faf8f5"/>
          </svg>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {promises.map((promise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="w-14 h-14 bg-olive-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <promise.icon className="w-7 h-7 text-olive-600" />
                </div>
                <h3 className="font-semibold text-earth-900 mb-1">{promise.title}</h3>
                <p className="text-sm text-earth-500">{promise.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-olive-600 font-medium text-sm uppercase tracking-wider">Handpicked Selection</span>
              <h2 className="section-title mt-2">Featured Products</h2>
              <p className="section-subtitle">Premium organic essentials for your wellness journey</p>
            </div>
            <Link
              to="/products?featured=true"
              className="text-olive-600 font-medium hover:text-olive-700 flex items-center gap-1 group"
            >
              View All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts?.slice(0, 4).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-gradient-to-br from-earth-800 to-earth-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-olive-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-olive-400 font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-6">
                Bringing Farm-Fresh
                <br />
                Goodness to Your Table
              </h2>
              <p className="text-earth-200 leading-relaxed mb-8">
                We partner directly with traditional farmers who follow organic practices passed 
                down through generations. Every product tells a story of sustainable farming, 
                pure ingredients, and authentic flavors.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-olive-400">{stat.value}</div>
                    <div className="text-earth-300 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <span className="text-4xl mb-2 block">🌾</span>
                  <h4 className="font-semibold mb-1">Heritage Grains</h4>
                  <p className="text-sm text-earth-300">Traditional rice & millets</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <span className="text-4xl mb-2 block">🫒</span>
                  <h4 className="font-semibold mb-1">Cold Pressed</h4>
                  <p className="text-sm text-earth-300">Pure oils & ghee</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <span className="text-4xl mb-2 block">🍪</span>
                  <h4 className="font-semibold mb-1">Village Snacks</h4>
                  <p className="text-sm text-earth-300">Traditional sweets</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <span className="text-4xl mb-2 block">🌿</span>
                  <h4 className="font-semibold mb-1">Herbal Wellness</h4>
                  <p className="text-sm text-earth-300">Natural supplements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-olive-600 font-medium text-sm uppercase tracking-wider">Browse</span>
            <h2 className="section-title mt-2">Shop by Category</h2>
            <p className="section-subtitle mx-auto">
              Explore our wide range of organic products across various categories
            </p>
          </div>
          

          <div className="flex gap-6 overflow-x-auto px-4 py-6 scrollbar-hide snap-x snap-mandatory scroll-smooth">

            {categories.map((category) => (
             <div
                key={category._id}
                onClick={() => {
                 navigate(`/products?category=${category.slug}`);
                 window.scrollTo(0, 0);
                }}
                className="min-w-[200px] sm:min-w-[240px] snap-start bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-center hover:scale-105 transition cursor-pointer"
              >

               {/* IMAGE */}
               {category.image ? (
                  <img
                     src={`${BASE_URL}${category.image}`}
                    alt={category.name}
                    className="w-16 h-16 object-contain mb-3"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-3" />
                   )}

                   {/* NAME */}
                   <p className="text-lg font-semibold text-center">
                     {category.name}
                     </p>

                  </div>
            ))}

           </div>
       </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-olive-600 font-medium text-sm uppercase tracking-wider">Most Loved</span>
              <h2 className="section-title mt-2">Best Sellers</h2>
              <p className="section-subtitle">Customer favorites that never disappoint</p>
            </div>
            <Link
              to="/products?bestSeller=true"
              className="text-olive-600 font-medium hover:text-olive-700 flex items-center gap-1 group"
            >
              View All
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers?.slice(0, 4).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-olive-600 font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="section-title mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                location: 'Mumbai',
                rating: 5,
                text: 'The A2 ghee is absolutely divine! My family loves all the products. Best organic store I have found.',
                avatar: 'P'
              },
              {
                name: 'Rajesh Kumar',
                location: 'Delhi',
                rating: 5,
                text: 'Fast delivery, excellent packaging, and the quality is unmatched. The mapillai samba rice reminds me of my grandmother\'s cooking.',
                avatar: 'R'
              },
              {
                name: 'Anita Desai',
                location: 'Bangalore',
                rating: 5,
                text: 'The millets and rice are so fresh and pure. My kids now love eating healthy thanks to these products.',
                avatar: 'A'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-5 sm:p-8 shadow-card"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-earth-700 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-olive-100 text-olive-700 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-earth-900">{testimonial.name}</p>
                    <p className="text-sm text-earth-500">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-olive-600 to-olive-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-olive-100 text-lg mb-8 max-w-xl mx-auto">
            Subscribe for exclusive offers, healthy recipes, and updates on new organic products
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 sm:py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="px-8 py-3 sm:py-4 bg-earth-800 text-white rounded-xl font-semibold hover:bg-earth-900 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
