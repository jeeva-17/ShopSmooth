'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Navbar } from '@/components/layout/Navbar';
import { ShoppingCart, Star } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Product {
  id: number;
  name: string;
  price: number;
  compare_at_price?: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  is_featured: boolean;
}

export default function Home() {
  const { addItem } = useStore();

  const products: Product[] = [
    {
      id: 1,
      name: 'Classic White T-Shirt',
      price: 29.99,
      compare_at_price: 49.99,
      description: 'Premium quality white t-shirt made from 100% organic cotton',
      image: '👕',
      rating: 4.8,
      reviews: 124,
      is_featured: true,
    },
    {
      id: 2,
      name: 'Vintage Black T-Shirt',
      price: 34.99,
      compare_at_price: 59.99,
      description: 'Cool vintage style black t-shirt with authentic prints',
      image: '🖤',
      rating: 4.6,
      reviews: 89,
      is_featured: true,
    },
    {
      id: 3,
      name: 'Summer Floral Dress',
      price: 59.99,
      compare_at_price: 99.99,
      description: 'Perfect for warm days - breathable floral print dress',
      image: '👗',
      rating: 4.9,
      reviews: 156,
      is_featured: true,
    },
    {
      id: 4,
      name: 'Leather Crossbody Bag',
      price: 89.99,
      compare_at_price: 149.99,
      description: 'Elegant leather bag perfect for everyday use',
      image: '👜',
      rating: 4.7,
      reviews: 98,
      is_featured: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Welcome to Fashion Corner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the latest trends and timeless styles. Shop our curated collection of premium fashion and accessories.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="#products">
                <Button variant="primary" size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Featured Products Section */}
        <section id="products" className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600">Hand-picked items you'll love</p>
            </div>

            {/* Product Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
                >
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 h-40 flex items-center justify-center text-6xl">
                    {product.image}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    {product.is_featured && (
                      <Badge variant="success" size="sm" dot>
                        Featured
                      </Badge>
                    )}

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>

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

                    {/* Pricing */}
                    <div className="flex items-center gap-2 py-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compare_at_price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        addItem({
                          id: `${product.id}-1`,
                          productId: product.id,
                          name: product.name,
                          image: product.image,
                          price: product.price,
                          quantity: 1,
                          slug: product.name.toLowerCase().replace(/\s+/g, '-'),
                          storeSlug: 'fashion-corner',
                        });
                      }}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Products Link */}
            <div className="text-center pt-8">
              <Link href="/products">
                <Button variant="outline" size="lg">
                  View All Products
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-600 text-white py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto px-4 text-center space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Join Our Community
            </h2>
            <p className="text-indigo-100 text-lg">
              Be the first to know about new products, exclusive deals, and style inspiration.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-500"
              />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-white font-bold mb-4">Fashion Corner</p>
              <p className="text-sm">Your one-stop shop for trendy fashion and accessories.</p>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Shop</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products">All Products</Link></li>
                <li><Link href="/products?category=tshirts">T-Shirts</Link></li>
                <li><Link href="/products?category=dresses">Dresses</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/shipping">Shipping Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Fashion Corner. All rights reserved. Powered by ShopSmooth.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
