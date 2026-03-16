'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    sku: 'TSHIRT-001',
    price: 29.99,
    stock: 45,
    category: 'Apparel',
    status: 'active',
  },
  {
    id: 2,
    name: 'Vintage Black T-Shirt',
    sku: 'TSHIRT-002',
    price: 34.99,
    stock: 32,
    category: 'Apparel',
    status: 'active',
  },
  {
    id: 3,
    name: 'Summer Floral Dress',
    sku: 'DRESS-001',
    price: 59.99,
    stock: 18,
    category: 'Dresses',
    status: 'active',
  },
  {
    id: 4,
    name: 'Leather Crossbody Bag',
    sku: 'BAG-001',
    price: 89.99,
    stock: 12,
    category: 'Accessories',
    status: 'active',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-2">Manage your store's inventory and product catalog.</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Add Product Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Product Name" className="px-4 py-2 rounded-lg border border-gray-300" />
            <input type="text" placeholder="SKU" className="px-4 py-2 rounded-lg border border-gray-300" />
            <input type="number" placeholder="Price" className="px-4 py-2 rounded-lg border border-gray-300" />
            <input type="number" placeholder="Stock Quantity" className="px-4 py-2 rounded-lg border border-gray-300" />
            <select className="px-4 py-2 rounded-lg border border-gray-300">
              <option>Select Category</option>
              <option>Apparel</option>
              <option>Accessories</option>
              <option>Dresses</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="primary">Save Product</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {/* Products Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className={product.stock > 20 ? 'text-green-600' : product.stock > 10 ? 'text-yellow-600' : 'text-red-600'}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded transition">
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1 hover:bg-gray-100 rounded transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            <p>No products found.</p>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Inventory Value</p>
          <p className="text-3xl font-bold text-gray-900">${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Low Stock Items</p>
          <p className="text-3xl font-bold text-gray-900">{products.filter((p) => p.stock < 20).length}</p>
        </motion.div>
      </div>
    </div>
  );
}
