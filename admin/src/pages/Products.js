import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL,BASE_URL } from '../config';
import { Plus, Edit2, Trash2, X, Image, Star, Tag } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    stock: '',
    unit: 'piece',
    image: '',
    featured: false,
    bestSeller: false,
    organic: true
  });
  const [variants, setVariants] = useState([
   { quantity: '', price: '',stock: '' }
  ]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {

      const token = localStorage.getItem('adminToken');

const response = await axios.get(
  `${API_URL}/products`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
      setProducts(response.data?.products || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('adminToken');

    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setCategories(response.data?.categories || []);
  } catch (error) {
    console.error('Failed to fetch categories');
  }
};

  const handleOpenModal = (product = null) => {
    setImage(null); 
    if (product) {
      setVariants(
  product.variants?.map(v => ({
    quantity: v.quantity || '',
    price: v.price || '',
    stock: v.stock || ''
  })) || [{ quantity: '', price: '', stock: '' }]
);
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice || '',
        category: product.category._id,
        stock: product.stock,
        unit: product.unit,
        image: product.image,
        featured: product.featured,
        bestSeller: product.bestSeller,
        organic: product.organic
      });
    } else {
      setVariants([{ quantity: '', price: '', stock:'' }]);
      setEditingProduct(null);
      setFormData({
         name: '',
         description: '',
         price: '',
         salePrice: '',
         category: '',
         stock: '',
         unit: 'piece',
         image: '',
         featured: false,
         bestSeller: false,
         organic: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImage(null); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const addVariant = () => {
   setVariants([...variants, { quantity: '', price: '', stock:''}]);
 };

  const handleVariantChange = (index, field, value) => {
   const updated = [...variants];
   updated[index][field] = value;
   setVariants(updated);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
     const token = localStorage.getItem('adminToken');

     const data = new FormData();

     data.append('name', formData.name);
     data.append('description', formData.description);
     data.append('variants', JSON.stringify(variants));
     data.append('category', formData.category);
     data.append('featured', formData.featured);
     data.append('bestSeller', formData.bestSeller);
     data.append('organic', formData.organic);

     // 🔥 important
     if (image) {
        data.append('image',image);
      }
if (editingProduct) {

 await axios.put(
  `${API_URL}/products/${editingProduct._id}`,
  data,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  }
);
  toast.success('Product updated successfully');
} else {
         await axios.post(
  `${API_URL}/products`,
  data,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  }
);
         toast.success('Product created successfully');
        }

        await fetchProducts();
        handleCloseModal();
      } catch (error) {
          console.error("ERROR:", error.response?.data || error.message);
          toast.error(error.response?.data?.message || 'Operation failed');
        }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');

await axios.delete(`${API_URL}/products/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
      toast.success('Product deleted successfully');
      await fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
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
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">{products.length} products in catalog</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                            product.image?.startsWith("http")
                            ? product.image
                            : `${BASE_URL.replace('/api', '')}/uploads/${product.image}`
                          }
                        alt={product.name}
                        onError={(e) => (e.target.src = '/placeholder.png')}
                        className="w-14 h-14 object-cover rounded-xl"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.unit}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {product.category?.name}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-gray-900">
                        ₹{product.variants?.[0]?.price || 0}
                      </p>
                      {product.salePrice && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{product.variants?.[0]?.price || 0}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                   <span
                     className={`font-semibold ${
                     product.variants?.some(v => v.stock < 5)
                       ? 'text-red-600'
                       : 'text-gray-900'
                     }`}
                    >
                    {product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0)} in stock
                  </span>
                </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      {product.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      )}
                      {product.bestSeller && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Best Seller
                        </span>
                      )}
                      {product.organic && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          🌿 Organic
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(product._id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found. Add your first product!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter product description"
                />
              </div>

              <div>
               <label className="block text-sm font-medium mb-2">
               Variants
             </label>

             {variants.map((v, i) => (
             <div key={i} className="flex gap-2 mb-2">
             <input
               placeholder="Quantity"
               value={v.quantity}
               onChange={(e) =>
                 handleVariantChange(i, 'quantity', e.target.value)
                }
              />

              <input
               placeholder="Price"
               type="number"
               value={v.price}
               onChange={(e) =>
                 handleVariantChange(i, 'price', e.target.value)
                }
              />

              <input
               placeholder="Stock"
               type="number"
               value={v.stock || ''}
               onChange={(e) =>
                 handleVariantChange(i, 'stock', e.target.value)
                }
              />
             </div>
             ))}

              <button type="button" onClick={addVariant}>
             + Add Variant
              </button>
            </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                
              </div>

           

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    console.log(e.target.files[0]); // DEBUG
                    setImage(e.target.files[0]); // ✅ clean
                  }}
                 className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="font-medium">⭐ Featured Product</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="bestSeller"
                    checked={formData.bestSeller}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="font-medium">🏆 Best Seller</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="organic"
                    checked={formData.organic}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-600 rounded"
                  />
                  <span className="font-medium">🌿 Organic</span>
                </label>
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
                  {editingProduct ? 'Update Product' : 'Add Product'}
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
        Delete this product?
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

export default Products;
