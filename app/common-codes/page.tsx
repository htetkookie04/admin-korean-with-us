'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Plus, Pencil, Trash2, Code, X, Loader2, Folder, FolderOpen } from 'lucide-react';

// Types
type CrudAction = 'add' | 'edit' | 'delete';
type EntityType = 'category' | 'item';

interface CommonCode {
  id: string;
  name: string;
  value?: string;
}

interface Category {
  id: string;
  name: string;
  items: CommonCode[];
}

// Mock initial data
const initialCategories: Category[] = [
  {
    id: '1',
    name: 'Enrollment Status',
    items: [
      { id: '1', name: 'Active' },
      { id: '2', name: 'Pending' },
      { id: '3', name: 'Completed' },
      { id: '4', name: 'Cancelled' },
    ],
  },
  {
    id: '2',
    name: 'Course Level',
    items: [
      { id: '1', name: 'Beginner' },
      { id: '2', name: 'Intermediate' },
      { id: '3', name: 'Advanced' },
      { id: '4', name: 'TOPIK I' },
      { id: '5', name: 'TOPIK II' },
    ],
  },
];

export default function CommonCodesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategories[0]?.id || '');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<EntityType>('item');
  const [editingEntity, setEditingEntity] = useState<Category | CommonCode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  // Unified CRUD handler function for both categories and items
  const handleCrud = async (
    action: CrudAction,
    entityType: EntityType,
    categoryId?: string,
    itemId?: string,
    data?: Partial<Category | CommonCode>
  ) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setCategories(prevCategories => {
      const newCategories = [...prevCategories];

      if (entityType === 'category') {
        switch (action) {
          case 'add':
            if (data?.name) {
              const newCategory: Category = {
                id: `cat-${Date.now()}`,
                name: data.name as string,
                items: [],
              };
              newCategories.push(newCategory);
              // Auto-select the newly created category
              setSelectedCategoryId(newCategory.id);
            }
            break;

          case 'edit':
            if (categoryId && data?.name) {
              const index = newCategories.findIndex(cat => cat.id === categoryId);
              if (index !== -1) {
                newCategories[index] = {
                  ...newCategories[index],
                  name: data.name as string,
                };
              }
            }
            break;

          case 'delete':
            if (categoryId) {
              const index = newCategories.findIndex(cat => cat.id === categoryId);
              if (index !== -1) {
                newCategories.splice(index, 1);
                // If deleted category was selected, select first available or clear
                if (selectedCategoryId === categoryId) {
                  setSelectedCategoryId(newCategories[0]?.id || '');
                }
              }
            }
            break;
        }
      } else if (entityType === 'item' && categoryId) {
        const categoryIndex = newCategories.findIndex(cat => cat.id === categoryId);
        if (categoryIndex === -1) return prevCategories;

        const category = { ...newCategories[categoryIndex] };
        const items = [...category.items];

        switch (action) {
          case 'add':
            if (data?.name) {
              const newItem: CommonCode = {
                id: `item-${Date.now()}`,
                name: data.name as string,
                value: 'value' in data ? data.value : undefined,
              };
              items.push(newItem);
            }
            break;

          case 'edit':
            if (itemId && data?.name) {
              const itemIndex = items.findIndex(item => item.id === itemId);
              if (itemIndex !== -1) {
                items[itemIndex] = {
                  ...items[itemIndex],
                  ...data,
                };
              }
            }
            break;

          case 'delete':
            if (itemId) {
              const itemIndex = items.findIndex(item => item.id === itemId);
              if (itemIndex !== -1) {
                items.splice(itemIndex, 1);
              }
            }
            break;
        }

        category.items = items;
        newCategories[categoryIndex] = category;
      }

      return newCategories;
    });

    setIsSubmitting(false);
    setShowModal(false);
    setEditingEntity(null);
    setInputValue('');
  };

  const handleAddCategory = () => {
    setModalType('category');
    setEditingEntity(null);
    setInputValue('');
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setModalType('category');
    setEditingEntity(category);
    setInputValue(category.name);
    setShowModal(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (confirm(`Are you sure you want to delete the category "${category?.name}"? This will also delete all items in this category.`)) {
      handleCrud('delete', 'category', categoryId);
    }
  };

  const handleAddItem = () => {
    if (!selectedCategoryId) {
      alert('Please select a category first');
      return;
    }
    setModalType('item');
    setEditingEntity(null);
    setInputValue('');
    setShowModal(true);
  };

  const handleEditItem = (item: CommonCode) => {
    setModalType('item');
    setEditingEntity(item);
    setInputValue(item.name);
    setShowModal(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      handleCrud('delete', 'item', selectedCategoryId, itemId);
    }
  };

  const handleModalSubmit = () => {
    if (!inputValue.trim()) {
      alert('Please enter a value');
      return;
    }

    if (modalType === 'category') {
      if (editingEntity) {
        handleCrud('edit', 'category', (editingEntity as Category).id, undefined, { name: inputValue.trim() });
      } else {
        handleCrud('add', 'category', undefined, undefined, { name: inputValue.trim() });
      }
    } else {
      if (editingEntity) {
        handleCrud('edit', 'item', selectedCategoryId, (editingEntity as CommonCode).id, { name: inputValue.trim() });
      } else {
        handleCrud('add', 'item', selectedCategoryId, undefined, { name: inputValue.trim() });
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Master Codes</h1>
            <p className="text-gray-600 mt-1">Manage categories and their associated codes</p>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 active:scale-95 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Folder className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No categories found. Click "Add Category" to create one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all group cursor-pointer ${
                    selectedCategoryId === category.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/30'
                  }`}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {selectedCategoryId === category.id ? (
                      <FolderOpen className="w-5 h-5 text-brand-600" />
                    ) : (
                      <Folder className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <span className="text-gray-900 font-medium">{category.name}</span>
                      <span className="ml-3 text-sm text-gray-500">
                        ({category.items.length} {category.items.length === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-gray-600 hover:text-brand-600 hover:bg-white rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Items Section */}
        {selectedCategory && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedCategory.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Manage items for this category</p>
              </div>
              <button
                onClick={handleAddItem}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 active:scale-95 transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            {selectedCategory.items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Code className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No items found. Click "Add Item" to create one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCategory.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
                  >
                    <span className="text-gray-900 font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-gray-600 hover:text-brand-600 hover:bg-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Category Selected Message */}
        {!selectedCategory && categories.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            <p>Please select a category to view its items</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => !isSubmitting && setShowModal(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-brand-50 to-brand-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-200 rounded-xl flex items-center justify-center">
                    {modalType === 'category' ? (
                      <Folder className="w-5 h-5 text-brand-600" />
                    ) : (
                      <Code className="w-5 h-5 text-brand-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingEntity ? `Edit ${modalType === 'category' ? 'Category' : 'Item'}` : `Add New ${modalType === 'category' ? 'Category' : 'Item'}`}
                    </h2>
                    {modalType === 'item' && selectedCategory && (
                      <p className="text-sm text-gray-500">{selectedCategory.name}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => !isSubmitting && setShowModal(false)}
                  disabled={isSubmitting}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">
                <div>
                  <label htmlFor="entityName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {modalType === 'category' ? 'Category Name' : 'Item Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="entityName"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Enter ${modalType === 'category' ? 'category' : 'item'} name...`}
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isSubmitting && inputValue.trim()) {
                        handleModalSubmit();
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                    autoFocus
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !isSubmitting && setShowModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleModalSubmit}
                    disabled={isSubmitting || !inputValue.trim()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editingEntity ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        {editingEntity ? (
                          <>
                            <Pencil className="w-4 h-4" />
                            Update
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
