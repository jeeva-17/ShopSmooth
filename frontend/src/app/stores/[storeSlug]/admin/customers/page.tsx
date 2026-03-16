'use client';

import { motion } from 'framer-motion';
import { Search, Mail, MapPin, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      orders: 5,
      totalSpent: 1299.95,
      joinDate: '2024-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      orders: 3,
      totalSpent: 449.97,
      joinDate: '2024-02-10',
      status: 'active',
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      orders: 8,
      totalSpent: 2499.99,
      joinDate: '2024-01-05',
      status: 'active',
    },
    {
      id: '4',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Houston, TX',
      orders: 1,
      totalSpent: 199.99,
      joinDate: '2024-03-01',
      status: 'active',
    },
    {
      id: '5',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '+1 (555) 567-8901',
      location: 'Phoenix, AZ',
      orders: 0,
      totalSpent: 0,
      joinDate: '2024-02-28',
      status: 'inactive',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Customers', value: customers.length },
    { label: 'Active', value: customers.filter((c) => c.status === 'active').length },
    {
      label: 'Total Revenue',
      value: `$${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`,
    },
    {
      label: 'Avg. Order Value',
      value: `$${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.filter((c) => c.orders > 0).length).toFixed(2)}`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">View and manage your customer base</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
          />
        </div>
      </motion.div>

      {/* Customers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {customer.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Joined {new Date(customer.joinDate).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  customer.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {customer.status}
              </span>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{customer.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {customer.orders} order{customer.orders !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="text-lg font-bold text-gray-900">
                  ${customer.totalSpent.toFixed(2)}
                </span>
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
