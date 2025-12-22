'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, FileVideo, FileText, Loader2, CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAddLecture } from '@/lib/hooks/useAddLecture';

// Validation schema
const addLectureSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
});

type AddLectureFormData = z.infer<typeof addLectureSchema>;

interface AddLectureModalProps {
  courseId: string;
  courseName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddLectureModal({ courseId, courseName, onClose, onSuccess }: AddLectureModalProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragActiveVideo, setDragActiveVideo] = useState(false);
  const [dragActivePdf, setDragActivePdf] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddLectureFormData>({
    resolver: zodResolver(addLectureSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const addLectureMutation = useAddLecture(courseId, {
    onSuccess: () => {
      reset();
      setVideoFile(null);
      setPdfFile(null);
      onSuccess();
    },
    onError: (error) => {
      console.error('Failed to add lecture:', error);
    },
  });

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !addLectureMutation.isPending) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, addLectureMutation.isPending]);

  // Simulate upload progress
  useEffect(() => {
    if (addLectureMutation.isPending && (videoFile || pdfFile)) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
      
      return () => clearInterval(interval);
    } else if (!addLectureMutation.isPending) {
      setUploadProgress(0);
    }
  }, [addLectureMutation.isPending, videoFile, pdfFile]);

  const onSubmit = (data: AddLectureFormData) => {
    addLectureMutation.mutate({
      title: data.title,
      description: data.description || '',
      video: videoFile || undefined,
    });
  };

  const handleDragVideo = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActiveVideo(true);
    } else if (e.type === 'dragleave') {
      setDragActiveVideo(false);
    }
  };

  const handleDragPdf = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActivePdf(true);
    } else if (e.type === 'dragleave') {
      setDragActivePdf(false);
    }
  };

  const handleDropVideo = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveVideo(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('video/')) {
      setVideoFile(files[0]);
    }
  };

  const handleDropPdf = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActivePdf(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'application/pdf') {
      setPdfFile(files[0]);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setVideoFile(files[0]);
    }
  };

  const handlePdfSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setPdfFile(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !addLectureMutation.isPending && onClose()}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-brand-50 to-rose-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Lecture</h2>
            <p className="text-sm text-gray-500 mt-0.5">{courseName}</p>
          </div>
          
          <button
            onClick={onClose}
            disabled={addLectureMutation.isPending}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
              Lecture Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              placeholder="Enter lecture title..."
              disabled={addLectureMutation.isPending}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              placeholder="Enter lecture description (optional)..."
              disabled={addLectureMutation.isPending}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* File Uploads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Video File
              </label>
              
              {!videoFile ? (
                <div
                  onDragEnter={handleDragVideo}
                  onDragLeave={handleDragVideo}
                  onDragOver={handleDragVideo}
                  onDrop={handleDropVideo}
                  onClick={() => videoInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    dragActiveVideo 
                      ? 'border-brand-500 bg-brand-50' 
                      : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
                  } ${addLectureMutation.isPending ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    disabled={addLectureMutation.isPending}
                    className="hidden"
                  />
                  
                  <FileVideo className="w-8 h-8 text-brand-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Upload Video
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM, MOV
                  </p>
                </div>
              ) : (
                <div className="relative border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                      <FileVideo className="w-5 h-5 text-brand-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(videoFile.size)}
                      </p>
                    </div>
                    
                    {!addLectureMutation.isPending && (
                      <button
                        type="button"
                        onClick={() => setVideoFile(null)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                PDF Material
              </label>
              
              {!pdfFile ? (
                <div
                  onDragEnter={handleDragPdf}
                  onDragLeave={handleDragPdf}
                  onDragOver={handleDragPdf}
                  onDrop={handleDropPdf}
                  onClick={() => pdfInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    dragActivePdf 
                      ? 'border-rose-500 bg-rose-50' 
                      : 'border-gray-300 hover:border-rose-400 hover:bg-gray-50'
                  } ${addLectureMutation.isPending ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfSelect}
                    disabled={addLectureMutation.isPending}
                    className="hidden"
                  />
                  
                  <FileText className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Upload PDF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lecture notes, slides
                  </p>
                </div>
              ) : (
                <div className="relative border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-rose-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {pdfFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(pdfFile.size)}
                      </p>
                    </div>
                    
                    {!addLectureMutation.isPending && (
                      <button
                        type="button"
                        onClick={() => setPdfFile(null)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Progress */}
          {addLectureMutation.isPending && (videoFile || pdfFile) && (
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Uploading files...</span>
                <span className="text-brand-600 font-semibold">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {addLectureMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">
                Failed to add lecture. Please try again.
              </p>
            </div>
          )}

          {/* Success Message */}
          {addLectureMutation.isSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-sm text-green-600 font-medium">
                Lecture added successfully!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={addLectureMutation.isPending}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={addLectureMutation.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
            >
              {addLectureMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Add Lecture
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
