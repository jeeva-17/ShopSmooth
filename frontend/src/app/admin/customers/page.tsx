'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, TrendingUp } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  total_orders: number;
  total_spent: number;
  joined_date: string;
  status: 'active' | 'inactive';
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-234-567-8901',
    city: 'New York',
    total_orders: 5,
    total_spent: 445.99,
    joined_date: '2025-06-15',
    status: 'active',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1-234-567-8902',
    city: 'Los Angeles',
    total_orders: 3,
    total_spent: 289.50,
    joined_date: '2025-08-20',
    status: 'active',
  },
  {
    id: 3,
    name: 'Emma Davis',
    email: 'emma@example.com',
    phone: '+1-234-567-8903',
    city: 'Chicago',
    total_orders: 8,
    total_spent: 892.45,
    joined_date: '2025-01-10',
    status: 'active',
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james@example.com',
    phone: '+1-234-567-8904',
    city: 'Houston',
    total_orders: 2,
    total_spent: 159.99,
    joined_date: '2025-10-05',
    status: 'inactive',
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'spent' | 'orders'>('name');

  const filteredCustomers = customers
    .filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'spent':
          return b.total_spent - a.total_spent;
        case 'orders':
          return b.total_orders - a.total_orders;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter((c) => c.status === 'active').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.total_spent, 0),
    avgOrderValue: customers.reduce((sum, c) => sum + c.total_spent, 0) / customers.reduce((sum, c) => sum + c.total_orders, 1),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-2">View and manage your customer base.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCustomers}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Active Customers</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeCustomers}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalRevenue.toFixed(2)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Avg Order Value</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${stats.avgOrderValue.toFixed(2)}</p>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="name">Sort by Name</option>
          <option value="spent">Sort by Spent</option>
          <option value="orders">Sort by Orders</option>
        </select>
      </div>

      {/* Customers List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {customer.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{customer.city}</span>
                  </div>
                </div>
              </div>

              <div className="text-right ml-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">{customer.total_orders} orders</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">${customer.total_spent.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Joined {customer.joined_date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <p>No customers found matching your search.</p>
        </div>
      )}
    </div>
  );
}
