import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      const data = new FormData();
      data.append('marqueeText', text);
      if (image) data.append('image', image);

      await axios.put('http://localhost:5000/api/admin/settings', data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Updated successfully');
    } catch (err) {
      console.error(err);
      alert('Update failed');
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