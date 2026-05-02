import React, { useState } from 'react';
import axios from '../../../utils/axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/auth/forgot-password', { email });
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="input-field mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="btn-primary w-full">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;