'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, Star, Search, Filter, Heart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
}

export default function StorePage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<any>(null);

  const categories = ['all', 'electronics', 'fashion', 'home', 'beauty'];

  useEffect(() => {
    // In a real app, fetch from API
    // For now, using mock data
    setTimeout(() => {
      setStore({
        name: 'Fashion Corner',
        description: 'Your one-stop shop for trendy fashion',
        primaryColor: '#667eea',
      });

      setProducts([
        {
          id: '1',
          name: 'Premium Wireless Headphones',
          price: 199.99,
          image: '🎧',
          rating: 4.8,
          reviews: 245,
          category: 'electronics',
        },
        {
          id: '2',
          name: 'Organic Cotton T-Shirt',
          price: 29.99,
          image: '👕',
          rating: 4.6,
          reviews: 128,
          category: 'fashion',
        },
        {
          id: '3',
          name: 'Luxury Skincare Set',
          price: 89.99,
          image: '💆',
          rating: 4.9,
          reviews: 156,
          category: 'beauty',
        },
        {
          id: '4',
          name: 'Modern Desk Lamp',
          price: 49.99,
          image: '💡',
          rating: 4.7,
          reviews: 89,
          category: 'home',
        },
        {
          id: '5',
          name: 'Vintage Leather Jacket',
          price: 159.99,
          image: '🧥',
          rating: 4.8,
          reviews: 201,
          category: 'fashion',
        },
        {
          id: '6',
          name: '4K Smart Camera',
          price: 299.99,
          image: '📷',
          rating: 4.7,
          reviews: 134,
          category: 'electronics',
        },
      ]);
      setLoading(false);
    }, 500);
  }, [storeSlug]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: store?.primaryColor }}></div>
              <span className="text-xl font-bold text-gray-900">{store?.name}</span>
            </div>
            <div className="hidden md:flex gap-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition">Home</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition">Products</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition">About</Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition">Contact</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href={`/stores/${storeSlug}/cart`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Cart (0)</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {store?.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {store?.description}
          </p>
        </div>
      </motion.section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
              <Filter className="w-5 h-5 text-gray-400 hidden md:block" />
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 text-lg">No products found</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Product Image */}
                <div
                  className="h-64 flex items-center justify-center text-7xl relative"
                  style={{ backgroundColor: store?.primaryColor + '20' }}
                >
                  {product.image}
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition"
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </div>

                  {/* Add to Cart */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-lg font-medium text-white transition flex items-center justify-center gap-2"
                    style={{ backgroundColor: store?.primaryColor }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </motion.button>

                  <Link href={`/stores/${storeSlug}/products/${product.id}`}>
                    <button className="w-full py-2 text-indigo-600 font-medium hover:text-indigo-700 transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-white font-bold mb-4">{store?.name}</p>
              <p className="text-sm">{store?.description}</p>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Shop</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">All Products</Link></li>
                <li><Link href="#" className="hover:text-white transition">New Arrivals</Link></li>
                <li><Link href="#" className="hover:text-white transition">Sale</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition">Shipping</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 {store?.name}. Powered by ShopSmooth.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
