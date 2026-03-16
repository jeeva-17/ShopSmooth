'use client';

import { motion } from 'framer-motion';
import { BarChart3, ShoppingCart, Users, DollarSign, Package } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up',
    },
    {
      label: 'Total Orders',
      value: '248',
      change: '+8.2%',
      icon: ShoppingCart,
      trend: 'up',
    },
    {
      label: 'Total Customers',
      value: '1,204',
      change: '+5.1%',
      icon: Users,
      trend: 'up',
    },
    {
      label: 'Total Products',
      value: '42',
      change: '+2 new',
      icon: Package,
      trend: 'up',
    },
  ];

  const recentOrders = [
    { id: '#1001', customer: 'John Doe', amount: '$299.99', status: 'Delivered', date: 'Today' },
    { id: '#1002', customer: 'Jane Smith', amount: '$149.99', status: 'Shipped', date: 'Today' },
    { id: '#1003', customer: 'Bob Wilson', amount: '$599.99', status: 'Processing', date: 'Yesterday' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome! Here's your store performance.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 text-indigo-600" />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sales This Month</h2>
          <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-end justify-between px-4 py-6 gap-2">
            {[65, 78, 45, 92, 67, 89, 72, 85, 78, 92, 88, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="flex-1 bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-lg"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
          <div className="space-y-4">
            {[
              { name: 'Premium Headphones', sales: 145 },
              { name: 'Wireless Charger', sales: 128 },
              { name: 'Phone Case', sales: 112 },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <p className="text-gray-700 font-medium">{product.name}</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="h-full bg-indigo-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.sales / 145) * 100}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{product.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
