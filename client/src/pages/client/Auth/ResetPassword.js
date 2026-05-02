import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/auth/reset-password/${token}`, {
        password
      });

      toast.success("Password reset successful");
      navigate('/login');

    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-80">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="input-field mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn-primary w-full">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;