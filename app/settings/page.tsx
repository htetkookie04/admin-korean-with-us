'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Save, Image as ImageIcon, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    homepage: {
      heroText: 'Learn Korean with expert teachers in a supportive environment',
      aboutText: 'We offer comprehensive Korean language courses for all levels, from beginner to advanced TOPIK preparation.',
      images: ['/images/hero1.jpg', '/images/hero2.jpg'],
    },
    contact: {
      email: 'info@koreanwithus.com',
      phone: '+1-234-567-8900',
      address: '123 Language School St, City, State 12345',
      socialMedia: {
        facebook: 'https://facebook.com/koreanwithus',
        instagram: 'https://instagram.com/koreanwithus',
        youtube: 'https://youtube.com/koreanwithus',
      },
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      maintenanceMode: false,
    },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
            <p className="text-gray-600 mt-1">Manage homepage content, contact info, and site settings</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            <Save className="w-5 h-5" />
            Save All Changes
          </button>
        </div>

        {/* Homepage Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Homepage Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Text</label>
              <input
                type="text"
                value={settings.homepage.heroText}
                onChange={(e) => setSettings({
                  ...settings,
                  homepage: { ...settings.homepage, heroText: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
              <textarea
                rows={4}
                value={settings.homepage.aboutText}
                onChange={(e) => setSettings({
                  ...settings,
                  homepage: { ...settings.homepage, aboutText: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Homepage Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload homepage images</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={settings.contact.email}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              <input
                type="tel"
                value={settings.contact.phone}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </label>
              <textarea
                rows={2}
                value={settings.contact.address}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Social Media Links
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="Facebook URL"
                  value={settings.contact.socialMedia.facebook}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      socialMedia: { ...settings.contact.socialMedia, facebook: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="url"
                  placeholder="Instagram URL"
                  value={settings.contact.socialMedia.instagram}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      socialMedia: { ...settings.contact.socialMedia, instagram: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <input
                  type="url"
                  placeholder="YouTube URL"
                  value={settings.contact.socialMedia.youtube}
                  onChange={(e) => setSettings({
                    ...settings,
                    contact: {
                      ...settings.contact,
                      socialMedia: { ...settings.contact.socialMedia, youtube: e.target.value }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications.emailNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                })}
                className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications.smsNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, smsNotifications: e.target.checked }
                })}
                className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
              <input
                type="checkbox"
                checked={settings.notifications.maintenanceMode}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, maintenanceMode: e.target.checked }
                })}
                className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
              />
            </label>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
