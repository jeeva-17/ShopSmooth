'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Check, AlertCircle, Loader } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { useStoreSettings } from '@/lib/hooks/useStoreSettings';

export default function AdminSettings() {
  const { store, storeId } = useStore();
  const [activeTab, setActiveTab] = useState<'appearance' | 'payment' | 'delivery' | 'pages'>('appearance');
  const [colors, setColors] = useState({
    navbar_primary_color: '#FF6B6B',
    navbar_secondary_color: '#4ECDC4',
    navbar_text_color: '#FFFFFF',
    accent_color: '#FFE66D',
  });
  const [payment, setPayment] = useState({
    enable_online_payment: true,
    enable_cod: true,
  });
  const [delivery, setDelivery] = useState({
    delivery_charge: '5.00',
    free_delivery_above: '50.00',
    estimated_delivery_days: '3',
  });
  const [pages, setPages] = useState({
    about_us: 'Welcome to Fashion Corner!',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingTab, setSavingTab] = useState<string | null>(null);

  const settings = useStoreSettings(storeId || 1);

  // Load store data when it changes
  useEffect(() => {
    if (store) {
      setColors({
        navbar_primary_color: store.navbar_primary_color || '#FF6B6B',
        navbar_secondary_color: store.navbar_secondary_color || '#4ECDC4',
        navbar_text_color: store.navbar_text_color || '#FFFFFF',
        accent_color: store.accent_color || '#FFE66D',
      });
      setPayment({
        enable_online_payment: store.enable_online_payment,
        enable_cod: store.enable_cod,
      });
      setDelivery({
        delivery_charge: store.delivery_charge.toString(),
        free_delivery_above: store.free_delivery_above.toString(),
        estimated_delivery_days: store.estimated_delivery_days.toString(),
      });
      setPages({
        about_us: store.about_us || '',
      });
    }
  }, [store]);

  const handleColorChange = (key: string, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setError(null);
  };

  const handleSaveAppearance = async () => {
    setSavingTab('appearance');
    try {
      await settings.updateAppearance(colors);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save colors');
    } finally {
      setSavingTab(null);
    }
  };

  const handleSavePayment = async () => {
    setSavingTab('payment');
    try {
      await settings.updatePayment(payment);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save payment settings');
    } finally {
      setSavingTab(null);
    }
  };

  const handleSaveDelivery = async () => {
    setSavingTab('delivery');
    try {
      await settings.updateDelivery({
        delivery_charge: parseFloat(delivery.delivery_charge),
        free_delivery_above: parseFloat(delivery.free_delivery_above),
        estimated_delivery_days: parseInt(delivery.estimated_delivery_days),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save delivery settings');
    } finally {
      setSavingTab(null);
    }
  };

  const handleSavePages = async () => {
    setSavingTab('pages');
    try {
      await settings.updatePages(pages);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save pages');
    } finally {
      setSavingTab(null);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'payment', label: 'Payment Methods' },
    { id: 'delivery', label: 'Delivery Settings' },
    { id: 'pages', label: 'Store Pages' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500 mt-2">Customize your store appearance and settings.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-0.5 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Color Preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Navbar Colors Preview</h2>
            <div
              style={{
                backgroundColor: colors.navbar_primary_color,
              }}
              className="rounded-lg p-6 text-white mb-6 shadow"
            >
              <div style={{ color: colors.navbar_text_color }}>
                <p className="text-lg font-semibold">Fashion Corner</p>
                <p className="text-sm opacity-80">Your store preview with custom colors</p>
              </div>
            </div>
          </div>

          {/* Color Settings */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Brand Colors</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors.navbar_primary_color}
                    onChange={(e) => handleColorChange('navbar_primary_color', e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Current color</p>
                    <p className="font-mono text-sm font-semibold">{colors.navbar_primary_color}</p>
                  </div>
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors.navbar_secondary_color}
                    onChange={(e) => handleColorChange('navbar_secondary_color', e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Current color</p>
                    <p className="font-mono text-sm font-semibold">{colors.navbar_secondary_color}</p>
                  </div>
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Navbar Text Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors.navbar_text_color}
                    onChange={(e) => handleColorChange('navbar_text_color', e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Current color</p>
                    <p className="font-mono text-sm font-semibold">{colors.navbar_text_color}</p>
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colors.accent_color}
                    onChange={(e) => handleColorChange('accent_color', e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Current color</p>
                    <p className="font-mono text-sm font-semibold">{colors.accent_color}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Button
                onClick={handleSaveAppearance}
                variant="primary"
                disabled={savingTab === 'appearance'}
              >
                {savingTab === 'appearance' ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button variant="secondary">Reset to Default</Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer" style={{
              borderColor: payment.enable_online_payment ? '#4F46E5' : '#E5E7EB',
              backgroundColor: payment.enable_online_payment ? '#F0F4FF' : '#F9FAFB'
            }}>
              <input
                type="checkbox"
                checked={payment.enable_online_payment}
                onChange={(e) => setPayment({ ...payment, enable_online_payment: e.target.checked })}
                className="w-5 h-5"
              />
              <div>
                <p className="font-semibold text-gray-900">Online Payment (Razorpay)</p>
                <p className="text-sm text-gray-600">Accept credit/debit cards, UPI, and more</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer" style={{
              borderColor: payment.enable_cod ? '#4F46E5' : '#E5E7EB',
              backgroundColor: payment.enable_cod ? '#F0F4FF' : '#F9FAFB'
            }}>
              <input
                type="checkbox"
                checked={payment.enable_cod}
                onChange={(e) => setPayment({ ...payment, enable_cod: e.target.checked })}
                className="w-5 h-5"
              />
              <div>
                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Allow customers to pay when they receive orders</p>
              </div>
            </label>
          </div>
          <Button
            onClick={handleSavePayment}
            variant="primary"
            disabled={savingTab === 'payment'}
          >
            {savingTab === 'payment' ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Payment Settings'
            )}
          </Button>
        </motion.div>
      )}

      {/* Delivery Tab */}
      {activeTab === 'delivery' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900">Delivery Settings</h2>
          <div className="space-y-4">
            <Input
              label="Delivery Charge"
              type="number"
              step="0.01"
              value={delivery.delivery_charge}
              onChange={(e) => setDelivery({ ...delivery, delivery_charge: e.target.value })}
              placeholder="5.00"
            />
            <Input
              label="Free Delivery Above"
              type="number"
              step="0.01"
              value={delivery.free_delivery_above}
              onChange={(e) => setDelivery({ ...delivery, free_delivery_above: e.target.value })}
              placeholder="50.00"
            />
            <Input
              label="Estimated Delivery Days"
              type="number"
              value={delivery.estimated_delivery_days}
              onChange={(e) => setDelivery({ ...delivery, estimated_delivery_days: e.target.value })}
              placeholder="3"
            />
          </div>
          <Button
            onClick={handleSaveDelivery}
            variant="primary"
            disabled={savingTab === 'delivery'}
          >
            {savingTab === 'delivery' ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Delivery Settings'
            )}
          </Button>
        </motion.div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900">Store Pages</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Us</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
                placeholder="Tell customers about your store..."
                value={pages.about_us}
                onChange={(e) => setPages({ ...pages, about_us: e.target.value })}
              />
            </div>
            <Button
              onClick={handleSavePages}
              variant="primary"
              disabled={savingTab === 'pages'}
            >
              {savingTab === 'pages' ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Pages'
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
