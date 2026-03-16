'use client';

import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { productsAPI } from '@/services/api';

interface Product {
  id: string | number;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    stock: 45,
    category: 'Electronics',
    status: 'active',
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    stock: 120,
    category: 'Fashion',
    status: 'active',
  },
  {
    id: '3',
    name: 'Luxury Skincare Set',
    price: 89.99,
    stock: 0,
    category: 'Beauty',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Modern Desk Lamp',
    price: 49.99,
    stock: 78,
    category: 'Home',
    status: 'active',
  },
];

export default function ProductsPage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
  });

  useEffect(() => {
    loadProducts();
  }, [storeSlug]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    const result = await productsAPI.list(storeSlug);

    if (result.error) {
      setError(result.error);
      setProducts(DEMO_PRODUCTS);
    } else if (result.data?.items) {
      setProducts(result.data.items);
    } else {
      setProducts(DEMO_PRODUCTS);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async () => {
    if (formData.name && formData.price && formData.stock && formData.category) {
      setLoading(true);
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: parseInt(formData.category) || null,
        is_active: true,
      };

      const result = await productsAPI.create(storeSlug, payload);

      if (result.error) {
        setError(result.error);
        // Fallback: add to local state
        const newProduct: Product = {
          ...payload,
          id: Date.now().toString(),
          status: 'active' as const,
          category: formData.category,
        };
        setProducts([...products, newProduct]);
      } else {
        loadProducts();
      }

      setFormData({ name: '', price: '', stock: '', category: '' });
      setShowModal(false);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setLoading(true);
    const result = await productsAPI.delete(storeSlug, id.toString());

    if (result.error) {
      setError(result.error);
      setProducts(products.filter((p) => p.id !== id));
    } else {
      loadProducts();
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your store inventory</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm"
        >
          Loading products...
        </motion.div>
      )}

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
          />
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Product Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Stock
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Edit2 className="w-4 h-4 text-indigo-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Product Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Home">Home</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Add Product
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
