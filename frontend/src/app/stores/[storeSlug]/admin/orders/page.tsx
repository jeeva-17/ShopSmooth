'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ordersAPI } from '@/services/api';

interface Order {
  id: string | number;
  customer: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

const DEMO_ORDERS: Order[] = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      amount: 299.99,
      status: 'delivered',
      date: '2024-03-15',
      items: 3,
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      amount: 149.99,
      status: 'shipped',
      date: '2024-03-14',
      items: 1,
    },
    {
      id: '#ORD-003',
      customer: 'Bob Wilson',
      email: 'bob@example.com',
      amount: 599.99,
      status: 'processing',
      date: '2024-03-13',
      items: 5,
    },
    {
      id: '#ORD-004',
      customer: 'Alice Johnson',
      email: 'alice@example.com',
      amount: 199.99,
      status: 'pending',
      date: '2024-03-12',
      items: 2,
    },
    {
      id: '#ORD-005',
      customer: 'Charlie Brown',
      email: 'charlie@example.com',
      amount: 89.99,
      status: 'cancelled',
      date: '2024-03-11',
      items: 1,
    },
  ];

export default function OrdersPage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [storeSlug]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    const result = await ordersAPI.list(storeSlug);

    if (result.error) {
      setError(result.error);
      setOrders(DEMO_ORDERS);
    } else if (result.data?.items) {
      setOrders(result.data.items);
    } else {
      setOrders(DEMO_ORDERS);
    }
    setLoading(false);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const updateOrderStatus = async (id: string | number, newStatus: string) => {
    setLoading(true);
    const result = await ordersAPI.updateStatus(storeSlug, id.toString(), newStatus);

    if (result.error) {
      setError(result.error);
      // Fallback to local update
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status: newStatus as any } : order
        )
      );
    } else {
      loadOrders();
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">
          Manage and track all customer orders
        </p>
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
          Loading orders...
        </motion.div>
      )}

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Orders', value: orders.length },
          {
            label: 'Pending',
            value: orders.filter((o) => o.status === 'pending').length,
          },
          {
            label: 'Shipped',
            value: orders.filter((o) => o.status === 'shipped').length,
          },
          {
            label: 'Delivered',
            value: orders.filter((o) => o.status === 'delivered').length,
          },
        ].map((stat, index) => (
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Items
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer}
                      </p>
                      <p className="text-xs text-gray-600">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {order.items} item{order.items > 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                      <Eye className="w-4 h-4 text-indigo-600" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
