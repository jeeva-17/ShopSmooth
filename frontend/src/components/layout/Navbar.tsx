'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useStore as useCartStore } from '@/store/useStore';
import { useStore as useStoreContext } from '@/lib/store-context';
import { Button } from '../ui/Button';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useMemo } from 'react';

export function Navbar({ storeName = 'ShopSmooth', navbarPrimaryColor: propPrimaryColor = '#FF6B6B', navbarTextColor: propTextColor = '#FFFFFF' }) {
  const { cartCount, setCartOpen, toggleSidebar } = useCartStore();
  const { store } = useStoreContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use store colors from context if available, otherwise use props
  const navbarPrimaryColor = store?.navbar_primary_color || propPrimaryColor;
  const navbarTextColor = store?.navbar_text_color || propTextColor;
  const storeName_ = store?.name || storeName;

  return (
    <motion.nav
      style={{ backgroundColor: navbarPrimaryColor }}
      className="sticky top-0 z-50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="font-bold text-xl"
              style={{ color: navbarTextColor }}
            >
              {storeName_}
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:opacity-80 transition" style={{ color: navbarTextColor }}>
              Home
            </Link>
            <Link href="/products" className="hover:opacity-80 transition" style={{ color: navbarTextColor }}>
              Products
            </Link>
            <Link href="/about" className="hover:opacity-80 transition" style={{ color: navbarTextColor }}>
              About
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="relative"
              style={{ color: navbarTextColor }}
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartCount()}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: navbarTextColor }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ borderTopColor: `${navbarTextColor}33` }}
            className="md:hidden border-t"
          >
            <div className="flex flex-col gap-2 py-4">
              <Link href="/" className="hover:opacity-80 px-4 py-2" style={{ color: navbarTextColor }}>
                Home
              </Link>
              <Link href="/products" className="hover:opacity-80 px-4 py-2" style={{ color: navbarTextColor }}>
                Products
              </Link>
              <Link href="/about" className="hover:opacity-80 px-4 py-2" style={{ color: navbarTextColor }}>
                About
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;
