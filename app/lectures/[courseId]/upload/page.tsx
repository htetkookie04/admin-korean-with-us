'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MainLayout from '@/components/layout/MainLayout';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { 
  ArrowLeft, 
  Upload,
  FileVideo,
  FileText,
  X,
  Loader2,
  CheckCircle,
  BookOpen,
  Link as LinkIcon
} from 'lucide-react';

// Validation schema
const uploadLectureSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  zoomLink: z.string().refine((val) => {
    if (!val || val.trim() === '') return true;
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, {
    message: 'Please enter a valid URL',
  }).optional(),
});

type UploadLectureFormData = z.infer<typeof uploadLectureSchema>;

// Mock courses data
const mockCourses: Record<string, { id: string; name: string; level: string }> = {
  '1': { id: '1', name: 'Korean Beginner Level 1', level: 'Beginner' },
  '2': { id: '2', name: 'Korean Intermediate Grammar', level: 'Intermediate' },
  '3': { id: '3', name: 'TOPIK Preparation Course', level: 'TOPIK' },
  '4': { id: '4', name: 'Korean Speaking Practice', level: 'Speaking' },
  '5': { id: '5', name: 'Advanced Korean Literature', level: 'Advanced' },
  '6': { id: '6', name: 'Business Korean', level: 'Intermediate' },
};

function UploadLectureContent() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragActiveVideo, setDragActiveVideo] = useState(false);
  const [dragActivePdf, setDragActivePdf] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const course = mockCourses[courseId];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadLectureFormData>({
    resolver: zodResolver(uploadLectureSchema),
    defaultValues: {
      title: '',
      description: '',
      zoomLink: '',
    },
  });

  useEffect(() => {
    // Check user role from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
        
        // Redirect if not Admin or Teacher
        if (user.role !== 'Admin' && user.role !== 'Teacher') {
          router.push('/dashboard');
        }
      } catch {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  // Simulate upload progress
  useEffect(() => {
    if (isUploading && (videoFile || pdfFile)) {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isUploading, videoFile, pdfFile]);

  const onSubmit = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setUploadProgress(100);
    setIsUploading(false);
    setUploadSuccess(true);
    
    // Redirect after success
    setTimeout(() => {
      router.push(`/teacher/lectures/${courseId}`);
    }, 1500);
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

  const getLevelBadge = (level?: string) => {
    if (!level) return 'bg-gray-100 text-gray-700';
    const colors: Record<string, string> = {
      'Beginner': 'bg-emerald-100 text-emerald-700',
      'Intermediate': 'bg-amber-100 text-amber-700',
      'Advanced': 'bg-rose-100 text-rose-700',
      'Speaking': 'bg-violet-100 text-violet-700',
      'TOPIK': 'bg-sky-100 text-sky-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  // Only Admin and Teacher can access this page
  if (userRole !== 'Admin' && userRole !== 'Teacher') {
    return null;
  }

  if (!course) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-4">The course you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/teacher/lectures"
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Go Back
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Navigation */}
        <Link
          href={`/teacher/lectures/${courseId}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Course</span>
        </Link>

        {/* Page Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-brand-50 via-rose-50 to-amber-50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                <Upload className="w-7 h-7 text-brand-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Upload New Lecture</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-600">{course.name}</span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getLevelBadge(course.level)}`}>
                    {course.level}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {uploadSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Successful!</h3>
              <p className="text-gray-500">Redirecting to course page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Lecture Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title')}
                  type="text"
                  id="title"
                  placeholder="Enter lecture title..."
                  disabled={isUploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all text-lg"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  rows={4}
                  placeholder="Enter lecture description (optional)..."
                  disabled={isUploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all resize-none"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Zoom Link Field */}
              <div>
                <label htmlFor="zoomLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    {...register('zoomLink')}
                    type="url"
                    id="zoomLink"
                    placeholder="https://zoom.us/j/..."
                    disabled={isUploading}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                  />
                </div>
                {errors.zoomLink && (
                  <p className="mt-2 text-sm text-red-500">{errors.zoomLink.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter the Zoom meeting link for this lecture (optional)
                </p>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video File
                  </label>
                  
                  {!videoFile ? (
                    <div
                      onDragEnter={handleDragVideo}
                      onDragLeave={handleDragVideo}
                      onDragOver={handleDragVideo}
                      onDrop={handleDropVideo}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        dragActiveVideo 
                          ? 'border-brand-500 bg-brand-50' 
                          : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
                      } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoSelect}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileVideo className="w-7 h-7 text-brand-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Upload Video
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        MP4, WebM, MOV (Max 500MB)
                      </p>
                    </div>
                  ) : (
                    <div className="relative border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center">
                          <FileVideo className="w-7 h-7 text-brand-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {videoFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(videoFile.size)}
                          </p>
                        </div>
                        
                        {!isUploading && (
                          <button
                            type="button"
                            onClick={() => setVideoFile(null)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Material
                  </label>
                  
                  {!pdfFile ? (
                    <div
                      onDragEnter={handleDragPdf}
                      onDragLeave={handleDragPdf}
                      onDragOver={handleDragPdf}
                      onDrop={handleDropPdf}
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        dragActivePdf 
                          ? 'border-rose-500 bg-rose-50' 
                          : 'border-gray-300 hover:border-rose-400 hover:bg-gray-50'
                      } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfSelect}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-7 h-7 text-rose-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Upload PDF
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Lecture notes, slides (Max 50MB)
                      </p>
                    </div>
                  ) : (
                    <div className="relative border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-7 h-7 text-rose-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {pdfFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(pdfFile.size)}
                          </p>
                        </div>
                        
                        {!isUploading && (
                          <button
                            type="button"
                            onClick={() => setPdfFile(null)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Uploading files...</span>
                    <span className="text-brand-600 font-semibold">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/teacher/lectures/${courseId}`}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-center"
                >
                  Cancel
                </Link>
                
                <button
                  type="submit"
                  disabled={isUploading || (!videoFile && !pdfFile)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Lecture
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function UploadLecturePage() {
  return (
    <QueryProvider>
      <UploadLectureContent />
    </QueryProvider>
  );
}
