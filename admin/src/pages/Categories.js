import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
import { Plus, Edit2, Trash2, X, GripVertical } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '', 
    image: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('adminToken');

    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setCategories( response.data?.categories || response.data?.data?.categories || response.data?.data || []);
  } catch (error) {
    toast.error('Failed to fetch categories');
  } finally {
    setLoading(false);
  }
};

  const handleOpenModal = (category) => {
  if (category && category._id) {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: null
    });
  } else {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: null
    });
  }

  setShowModal(true);
};

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');

     if (editingCategory) {
  const data = new FormData();
  data.append('name', formData.name);
  data.append('description', formData.description || '');

  if (formData.image) {
    data.append('image', formData.image);
  }

  // FIXED
await axios.put(
  `${API_URL}/categories/${editingCategory._id}`,
  data,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

  toast.success('Category updated successfully');
} else {
       const data = new FormData();
data.append('name', formData.name);
data.append('description', formData.description || '');

if (formData.image) {
  data.append('image', formData.image);
}

// FIXED
await axios.post(`${API_URL}/categories`, data, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
        toast.success('Category created successfully');
      }
      await fetchCategories();
      handleCloseModal();
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');

     await axios.delete(`${API_URL}/categories/${id}`, {
       headers: {
         Authorization: `Bearer ${token}`
       }
      });

      toast.success('Category deleted successfully');
      await fetchCategories();
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
    
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
               <img
                  src={`${API_URL.replace('/api', '')}${category.image}`}
                  alt={category.name}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
              </div>
            </div>

            {category.description && (
              <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                {category.description}
              </p>
            )}

            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => handleOpenModal(category)}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </button>
              {category.name !== 'General' && (
               <button
                 onClick={() => setDeleteId(category._id)}
                 className="px-4 py-2 bg-red-500 text-white rounded"
                >
                Delete
                </button>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Grains & Flours"
                />
              </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Category Image
  </label>

  <input
    type="file"
    onChange={(e) =>
      setFormData({
        ...formData,
        image: e.target.files[0]
      })
    }
    className="w-full"
  />
</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief description of the category"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  {editingCategory ? 'Update' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
              {deleteId && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-80">
      <h2 className="text-lg font-semibold mb-4">
        Delete this category?
      </h2>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setDeleteId(null)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            handleDelete(deleteId);
            setDeleteId(null);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Categories;
