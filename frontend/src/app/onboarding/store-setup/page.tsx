'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckCircle, ArrowRight, Store, Palette, Globe, ShoppingCart } from 'lucide-react';

type StepType = 'store-info' | 'domain' | 'theme' | 'products' | 'complete';

export default function StoreSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepType>('store-info');
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    domain: '',
    themeColor: '#667eea',
    industry: '',
    countryCode: 'US',
  });
  const [loading, setLoading] = useState(false);

  const steps: { id: StepType; label: string; icon: any }[] = [
    { id: 'store-info', label: 'Store Info', icon: Store },
    { id: 'domain', label: 'Domain', icon: Globe },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'products', label: 'Products', icon: ShoppingCart },
    { id: 'complete', label: 'Complete', icon: CheckCircle },
  ];

  const handleNext = async () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stores/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: formData.storeName,
          description: formData.storeDescription,
          slug: formData.domain,
          industry: formData.industry,
          primary_color: formData.themeColor,
          country: formData.countryCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create store');
      }

      const data = await response.json();
      setTimeout(() => {
        router.push(`/stores/${data.slug}/admin/dashboard`);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Set Up Your Store</h1>
          <p className="text-gray-600">Just a few steps to get started</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              const isCurrent = step.id === currentStep;

              return (
                <motion.div key={step.id} className="flex flex-col items-center flex-1">
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                      boxShadow: isCurrent ? '0 0 20px rgba(99, 102, 241, 0.6)' : 'none',
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isCompleted || isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <span className={`text-sm font-medium ${isCurrent ? 'text-indigo-600' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${((steps.findIndex(s => s.id === currentStep) + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {currentStep === 'store-info' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Store Name</label>
                <input
                  type="text"
                  placeholder="e.g., Fashion Corner"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Store Description</label>
                <textarea
                  placeholder="Describe your store and what you sell..."
                  value={formData.storeDescription}
                  onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                >
                  <option value="">Select an industry</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="electronics">Electronics</option>
                  <option value="home">Home & Garden</option>
                  <option value="beauty">Beauty & Personal Care</option>
                  <option value="food">Food & Beverage</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 'domain' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Store Domain (Slug)</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">shopsmooth.app/</span>
                  <input
                    type="text"
                    placeholder="your-store"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">This will be your store's public URL</p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-900">
                  <strong>Pro Tip:</strong> You can connect a custom domain later in your store settings.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'theme' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-4">Primary Color</label>
                <div className="flex gap-4 flex-wrap">
                  {['#667eea', '#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'].map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setFormData({ ...formData, themeColor: color })}
                      className={`w-16 h-16 rounded-lg border-4 transition ${
                        formData.themeColor === color ? 'border-gray-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.themeColor}
                      onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                      className="w-16 h-16 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Preview</h3>
                <div
                  className="h-32 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: formData.themeColor }}
                >
                  {formData.storeName || 'Your Store'}
                </div>
              </div>
            </div>
          )}

          {currentStep === 'products' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-2">Add Your First Products</h3>
                <p className="text-gray-700 mb-4">
                  You can add products after completing setup. Start with at least 3-5 products to create an impressive storefront.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Add product photos and descriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Set prices and stock levels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Organize with categories
                  </li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                className="flex justify-center"
              >
                <CheckCircle className="w-24 h-24 text-green-500" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">All Set!</h2>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Your store {formData.storeName} is ready to go. Let's take you to your admin dashboard.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 mt-8 justify-between"
        >
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 'store-info' || loading}
          >
            Back
          </Button>

          {currentStep === 'complete' ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? 'Setting up...' : 'Go to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={
                (currentStep === 'store-info' && (!formData.storeName || !formData.industry)) ||
                (currentStep === 'domain' && !formData.domain)
              }
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
