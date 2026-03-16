'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsData {
  total_orders: number;
  total_revenue: number;
  total_customers: number;
  pending_orders: number;
  top_products: Array<{
    id: number;
    name: string;
    total_sold: number;
    total_revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics - in a real app, would call API
    setAnalytics({
      total_orders: 42,
      total_revenue: 2840.5,
      total_customers: 28,
      pending_orders: 5,
      top_products: [
        { id: 1, name: 'Classic White T-Shirt', total_sold: 15, total_revenue: 449.85 },
        { id: 3, name: 'Summer Floral Dress', total_sold: 8, total_revenue: 479.92 },
        { id: 4, name: 'Leather Crossbody Bag', total_sold: 4, total_revenue: 359.96 },
      ],
    });
    setLoading(false);
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    href
  }: {
    icon: any;
    label: string;
    value: string | number;
    href: string
  }) => (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-white rounded-lg shadow p-6 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div className="bg-indigo-100 p-4 rounded-lg">
            <Icon className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
      </motion.div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's your store performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={analytics?.total_orders || 0}
          href="/admin/orders"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${analytics?.total_revenue?.toFixed(2) || 0}`}
          href="/admin/orders"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={analytics?.total_customers || 0}
          href="/admin/customers"
        />
        <StatCard
          icon={Package}
          label="Pending Orders"
          value={analytics?.pending_orders || 0}
          href="/admin/orders"
        />
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Sold</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.top_products.map((product) => (
                <motion.tr
                  key={product.id}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 px-4 text-sm text-gray-900">{product.name}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-600">
                    {product.total_sold} units
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                    ${product.total_revenue.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/products/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Add New Product
          </motion.button>
        </Link>
        <Link href="/admin/settings">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Customize Store
          </motion.button>
        </Link>
        <Link href="/admin/orders">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            View Orders
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
