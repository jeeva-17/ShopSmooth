'use client';

import { motion } from 'framer-motion';
import { Save, Globe, Palette, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { storeSettingsAPI } from '@/services/api';

export default function SettingsPage() {
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    storeName: 'TechGear Store',
    storeDescription: 'Premium electronics and gadgets for tech enthusiasts',
    storeEmail: 'contact@techgear.com',
    storePhone: '+1 (555) 123-4567',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    currency: 'USD',
    taxRate: '8',
    shippingCost: '10',
  });

  useEffect(() => {
    loadSettings();
  }, [storeSlug]);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    const result = await storeSettingsAPI.get(storeSlug);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setSettings({
        storeName: result.data.name || settings.storeName,
        storeDescription: result.data.description || settings.storeDescription,
        storeEmail: result.data.email || settings.storeEmail,
        storePhone: result.data.phone || settings.storePhone,
        primaryColor: result.data.primary_color || settings.primaryColor,
        secondaryColor: result.data.secondary_color || settings.secondaryColor,
        currency: result.data.currency || settings.currency,
        taxRate: result.data.tax_rate || settings.taxRate,
        shippingCost: result.data.shipping_cost || settings.shippingCost,
      });
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const payload = {
      name: settings.storeName,
      description: settings.storeDescription,
      email: settings.storeEmail,
      phone: settings.storePhone,
      primary_color: settings.primaryColor,
      secondary_color: settings.secondaryColor,
      currency: settings.currency,
      tax_rate: parseFloat(settings.taxRate),
      shipping_cost: parseFloat(settings.shippingCost),
    };

    const result = await storeSettingsAPI.update(storeSlug, payload);

    if (result.error) {
      setError(result.error);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'billing', label: 'Billing & Plans', icon: Lock },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Store Settings</h1>
        <p className="text-gray-600">Manage your store configuration and preferences</p>
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
          Loading settings...
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 border-b border-gray-200"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-medium"
        >
          ✓ Settings saved successfully!
        </motion.div>
      )}

      {/* General Settings */}
      {activeTab === 'general' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <div className="max-w-2xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) =>
                  handleInputChange('storeName', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Store Description
              </label>
              <textarea
                value={settings.storeDescription}
                onChange={(e) =>
                  handleInputChange('storeDescription', e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) =>
                    handleInputChange('storeEmail', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) =>
                    handleInputChange('storePhone', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    handleInputChange('currency', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) =>
                    handleInputChange('taxRate', e.target.value)
                  }
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Shipping Cost
                </label>
                <input
                  type="number"
                  value={settings.shippingCost}
                  onChange={(e) =>
                    handleInputChange('shippingCost', e.target.value)
                  }
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Branding */}
      {activeTab === 'branding' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <div className="max-w-2xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Primary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    handleInputChange('primaryColor', e.target.value)
                  }
                  className="w-20 h-20 rounded-lg cursor-pointer"
                />
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    This color is used for buttons, links, and highlights
                  </p>
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) =>
                      handleInputChange('primaryColor', e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Secondary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) =>
                    handleInputChange('secondaryColor', e.target.value)
                  }
                  className="w-20 h-20 rounded-lg cursor-pointer"
                />
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    This color is used for accents and backgrounds
                  </p>
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) =>
                      handleInputChange('secondaryColor', e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-4">Preview</p>
              <div className="space-y-3">
                <button
                  style={{ backgroundColor: settings.primaryColor }}
                  className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 transition"
                >
                  Primary Button
                </button>
                <div
                  style={{ backgroundColor: settings.secondaryColor }}
                  className="w-full h-20 rounded-lg"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Billing & Plans */}
      {activeTab === 'billing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-8"
        >
          <div className="max-w-2xl space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Current Plan: Professional
              </h3>
              <p className="text-blue-800 mb-4">
                $79/month - Perfect for growing businesses
              </p>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                Upgrade Plan
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Plan Features
              </h3>
              <ul className="space-y-3">
                {[
                  'Unlimited products',
                  'Advanced analytics',
                  'Custom domain support',
                  'Email support',
                  'API access',
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <span className="text-green-600 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Billing Information
              </h3>
              <p className="text-gray-600 mb-4">
                Next billing date: April 15, 2024
              </p>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                View Invoice History
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end gap-4"
      >
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>
    </motion.div>
  );
}
