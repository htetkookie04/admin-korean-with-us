'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Bell, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TargetRole } from '@/types/notices';

// Validation schema
const createNoticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  message: z.string().min(1, 'Message is required').max(5000, 'Message must be less than 5000 characters'),
  targetRoles: z.array(z.enum(['Admin', 'Teacher', 'Student'])).min(1, 'Select at least one target role'),
});

type CreateNoticeFormData = z.infer<typeof createNoticeSchema>;

interface CreateNoticeModalProps {
  onClose: () => void;
  onSubmit: (data: CreateNoticeFormData) => void;
  isSubmitting: boolean;
}

const availableRoles: { value: TargetRole; label: string; color: string }[] = [
  { value: 'Admin', label: 'Admin', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'Teacher', label: 'Teacher', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'Student', label: 'Student', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

export function CreateNoticeModal({ onClose, onSubmit, isSubmitting }: CreateNoticeModalProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<CreateNoticeFormData>({
    resolver: zodResolver(createNoticeSchema),
    defaultValues: {
      title: '',
      message: '',
      targetRoles: [],
    },
  });

  const selectedRoles = watch('targetRoles');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, isSubmitting]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.role-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSubmit = (data: CreateNoticeFormData) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Notice</h2>
              <p className="text-sm text-gray-500">Send announcement to users</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              placeholder="Enter notice title..."
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('message')}
              id="message"
              rows={5}
              placeholder="Enter your announcement message..."
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
            />
            {errors.message && (
              <p className="mt-1.5 text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          {/* Target Roles Multi-Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Target Roles <span className="text-red-500">*</span>
            </label>
            
            <Controller
              name="targetRoles"
              control={control}
              render={({ field }) => (
                <div className="relative role-dropdown">
                  {/* Selected Roles Display / Dropdown Trigger */}
                  <div
                    onClick={() => !isSubmitting && setIsDropdownOpen(!isDropdownOpen)}
                    className={`min-h-[44px] px-4 py-2 border rounded-xl cursor-pointer transition-all flex flex-wrap gap-2 items-center ${
                      isDropdownOpen 
                        ? 'border-amber-500 ring-2 ring-amber-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    } ${isSubmitting ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
                  >
                    {field.value.length === 0 ? (
                      <span className="text-gray-400">Select target roles...</span>
                    ) : (
                      field.value.map((role) => {
                        const roleInfo = availableRoles.find(r => r.value === role);
                        return (
                          <span
                            key={role}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${roleInfo?.color}`}
                          >
                            {roleInfo?.label}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(field.value.filter(r => r !== role));
                              }}
                              className="ml-0.5 hover:opacity-70"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {availableRoles.map((role) => {
                        const isSelected = field.value.includes(role.value);
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                field.onChange(field.value.filter(r => r !== role.value));
                              } else {
                                field.onChange([...field.value, role.value]);
                              }
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                              isSelected ? 'bg-amber-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${role.color}`}>
                                {role.label}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-5 h-5 text-amber-600" />
                            )}
                          </button>
                        );
                      })}
                      
                      {/* Select All / Clear All */}
                      <div className="flex border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => field.onChange(['Admin', 'Teacher', 'Student'])}
                          className="flex-1 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange([])}
                          className="flex-1 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors border-l border-gray-100"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            />
            
            {errors.targetRoles && (
              <p className="mt-1.5 text-sm text-red-500">{errors.targetRoles.message}</p>
            )}
            
            <p className="mt-1.5 text-xs text-gray-400">
              Select which user roles will see this notice
            </p>
          </div>

          {/* Preview */}
          {selectedRoles.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Preview - Visible to:</p>
              <div className="flex flex-wrap gap-2">
                {selectedRoles.map((role) => {
                  const roleInfo = availableRoles.find(r => r.value === role);
                  return (
                    <span
                      key={role}
                      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${roleInfo?.color}`}
                    >
                      {roleInfo?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Create Notice
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

