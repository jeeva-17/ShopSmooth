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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: store?.primaryColor }}></div>
            <span className="text-xl font-bold text-gray-900">{store?.name}</span>
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
          <p className="text-xl text-gray-600">
            {store?.description}
          </p>
        </div>
      </motion.section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-48 flex items-center justify-center text-5xl bg-gray-100">
                {product.image}
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
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
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${product.price}</p>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
