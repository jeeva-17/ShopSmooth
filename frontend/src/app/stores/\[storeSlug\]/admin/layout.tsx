'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const storeSlug = params.storeSlug as string;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      label: 'Dashboard',
      href: `/stores/${storeSlug}/admin/dashboard`,
      icon: LayoutDashboard,
    },
    {
      label: 'Products',
      href: `/stores/${storeSlug}/admin/products`,
      icon: Package,
    },
    {
      label: 'Orders',
      href: `/stores/${storeSlug}/admin/orders`,
      icon: ShoppingCart,
    },
    {
      label: 'Customers',
      href: `/stores/${storeSlug}/admin/customers`,
      icon: Users,
    },
    {
      label: 'Settings',
      href: `/stores/${storeSlug}/admin/settings`,
      icon: Settings,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-white fixed h-screen overflow-y-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
            {sidebarOpen && <span className="font-bold text-lg">ShopSmooth</span>}
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    active ? 'bg-indigo-600' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  {sidebarOpen && active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </motion.button>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <motion.button
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white transition"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1" style={{ marginLeft: sidebarOpen ? 280 : 80 }}>
        {/* Top Bar */}
        <motion.div
          animate={{ marginLeft: sidebarOpen ? 0 : 0 }}
          className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <input
              type="search"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
            />
            <button className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              U
            </button>
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 overflow-auto"
          style={{ height: 'calc(100vh - 73px)' }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
