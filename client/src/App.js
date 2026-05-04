import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/client/Navbar';
import Footer from './components/client/Footer';
import Home from './pages/client/Home';
import Products from './pages/client/Products';
import ProductDetail from './pages/client/ProductDetail';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Dashboard from './pages/client/Dashboard';
import PrivateRoute from './components/client/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import ForgotPassword from './pages/client/Auth/ForgotPassword';
import ResetPassword from './pages/client/Auth/ResetPassword';
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ScrollToTop />   
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
  
}

export default App;
