'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  ShoppingCart,
  Zap,
  Globe,
  TrendingUp,
  Users,
  Lock,
  Smartphone,
  BarChart3,
  ArrowRight,
  Check,
  Star
} from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    {
      icon: ShoppingCart,
      title: 'Complete Store Setup',
      description: 'Create your online store in minutes with our intuitive setup wizard. No coding required.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance built on modern technology. Your store loads in milliseconds.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Sell worldwide with multi-currency support and international shipping integrations.',
    },
    {
      icon: TrendingUp,
      title: 'Sales Analytics',
      description: 'Real-time analytics dashboard to track your sales, customers, and growth metrics.',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Manage customers, track orders, and build lasting relationships with your audience.',
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-level security with SSL encryption, PCI compliance, and secure payments.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      monthlyPrice: 29,
      yearlyPrice: 290,
      description: 'Perfect for getting started',
      features: [
        'Up to 100 products',
        '5 GB storage',
        'Basic analytics',
        'Email support',
        'Community access',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Professional',
      monthlyPrice: 79,
      yearlyPrice: 790,
      description: 'For growing businesses',
      features: [
        'Unlimited products',
        '100 GB storage',
        'Advanced analytics',
        'Priority support',
        'Custom domain',
        'API access',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      description: 'For large-scale operations',
      features: [
        'Everything in Professional',
        'Unlimited storage',
        'Custom integrations',
        '24/7 phone support',
        'Dedicated account manager',
        'Advanced security features',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Founder, TrendWear Co.',
      image: '👩‍💼',
      quote: 'ShopSmooth helped us grow from $0 to $100k revenue in 6 months. The interface is incredibly intuitive!',
      rating: 5,
    },
    {
      name: 'Mike Chen',
      role: 'Founder, TechGear Store',
      image: '👨‍💼',
      quote: 'The best e-commerce platform we\'ve used. Fast, reliable, and the customer support is outstanding.',
      rating: 5,
    },
    {
      name: 'Emma Williams',
      role: 'Owner, Artisan Crafts',
      image: '👩‍🎨',
      quote: 'Finally, a platform that understands the needs of small businesses. Highly recommended!',
      rating: 5,
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
    <div className="bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">ShopSmooth</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 -z-10"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-4 text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
              <Zap className="w-4 h-4" />
              Try ShopSmooth Free for 14 Days
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
            Launch Your Online Store in Minutes
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful entrepreneurs using ShopSmooth. Build, manage, and grow your e-commerce business with the tools of industry leaders.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link href="/auth/signup">
              <Button variant="primary" size="lg" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#demo" className="inline-block">
              <Button variant="outline" size="lg">Watch Demo</Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-4"
          >
            <Check className="w-4 h-4 text-green-500" />
            No credit card required
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-6xl mx-auto px-4"
        >
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl aspect-video flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
            Dashboard Preview
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you build and scale your business.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="p-8 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
                >
                  <Icon className="w-12 h-12 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business. Always know what you'll pay.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="inline-flex gap-2 p-1 bg-gray-200 rounded-lg">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  activeTab === 'monthly'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setActiveTab('yearly')}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  activeTab === 'yearly'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly <span className="text-green-600 text-sm ml-1">(Save 17%)</span>
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`rounded-xl border transition-all ${
                  plan.popular
                    ? 'border-indigo-600 shadow-2xl lg:scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                } p-8 bg-white relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${activeTab === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12)}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full mb-8"
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Loved by Entrepreneurs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful store owners who trust ShopSmooth.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 rounded-xl border border-gray-200 bg-gray-50"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 text-center space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-xl text-indigo-100">
            Join ShopSmooth today and launch your online store in minutes. No credit card required.
          </p>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 mx-auto">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg"></div>
                <span className="text-white font-bold">ShopSmooth</span>
              </div>
              <p className="text-sm">The modern e-commerce platform for entrepreneurs.</p>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Product</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Company</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Resources</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/community" className="hover:text-white transition">Community</Link></li>
                <li><Link href="/api" className="hover:text-white transition">API</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold mb-4">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 ShopSmooth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
