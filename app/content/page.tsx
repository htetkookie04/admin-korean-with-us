'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockContent } from '@/lib/mockData';
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Video, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Content } from '@/types';

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>(mockContent);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'photo' | 'video' | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setContent(content.filter(c => c.id !== id));
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'class': 'bg-brand-100 text-brand-800',
      'cultural_event': 'bg-purple-100 text-purple-800',
      'achievement': 'bg-green-100 text-green-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-1">Manage photos, videos, and media content</p>
          </div>
          <button
            onClick={() => {
              setSelectedContent(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Content
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Categories</option>
              <option value="class">Class</option>
              <option value="cultural_event">Cultural Event</option>
              <option value="achievement">Achievement</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'photo' | 'video' | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Types</option>
              <option value="photo">Photos</option>
              <option value="video">Videos</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                {item.type === 'photo' ? (
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                ) : (
                  <Video className="w-16 h-16 text-gray-400" />
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedContent(item);
                      setShowModal(true);
                    }}
                    className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-brand-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(item.category)}`}>
                    {item.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                )}
                <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedContent ? 'Edit Content' : 'Add New Content'}
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    defaultValue={selectedContent?.title || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      defaultValue={selectedContent?.type || 'photo'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      defaultValue={selectedContent?.category || 'class'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="class">Class</option>
                      <option value="cultural_event">Cultural Event</option>
                      <option value="achievement">Achievement</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    defaultValue={selectedContent?.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Media</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, MP4, MOV (Max 50MB)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

