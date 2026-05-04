import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import toast from 'react-hot-toast';

const Settings = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "mern_upload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dajkgy9is/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};

  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('adminToken');

    let imageUrl = "";

    // 🔥 Upload to Cloudinary first
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "mern_upload");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dajkgy9is/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      imageUrl = data.secure_url;
    }

    // 🔥 Send only URL to backend
    await axios.put(`${API_URL}/admin/settings`, {
      marqueeText: text,
      image: imageUrl
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success('Updated successfully');

    // optional quick refresh
    setTimeout(() => window.location.reload(), 1000);

  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Update failed');
  }
};

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Homepage Settings</h2>

      <input
        type="text"
        placeholder="Enter marquee text"
        onChange={(e) => setText(e.target.value)}
        className="block mb-4 p-2 border w-full"
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="block mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
};

export default Settings;