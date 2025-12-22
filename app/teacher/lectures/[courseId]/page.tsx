'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { LectureList, AddLectureModal } from '@/components/teacher';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { TeacherCourse, Lecture } from '@/types/teacher';
import { 
  ArrowLeft, 
  Plus,
  RefreshCw, 
  BookOpen,
  PlayCircle,
  Calendar,
  Upload
} from 'lucide-react';

// Mock courses data
const mockCourses: Record<string, TeacherCourse> = {
  '1': {
    id: '1',
    name: 'Korean Beginner Level 1',
    description: 'Introduction to Korean language basics including Hangul, greetings, and simple conversations.',
    level: 'Beginner',
    lectureCount: 12,
    schedule: 'Mon, Wed, Fri 10:00 AM',
    createdAt: '2024-01-15T00:00:00Z',
  },
  '2': {
    id: '2',
    name: 'Korean Intermediate Grammar',
    description: 'Advanced grammar patterns, complex sentence structures, and formal expressions for intermediate learners.',
    level: 'Intermediate',
    lectureCount: 8,
    schedule: 'Tue, Thu 2:00 PM',
    createdAt: '2024-02-20T00:00:00Z',
  },
  '3': {
    id: '3',
    name: 'TOPIK Preparation Course',
    description: 'Comprehensive preparation for TOPIK I and II exams with practice tests and study materials.',
    level: 'TOPIK',
    lectureCount: 15,
    schedule: 'Sat 9:00 AM',
    createdAt: '2024-03-10T00:00:00Z',
  },
  '4': {
    id: '4',
    name: 'Korean Speaking Practice',
    description: 'Improve your speaking skills through conversations, role-play, and pronunciation exercises.',
    level: 'Speaking',
    lectureCount: 6,
    schedule: 'Mon, Wed 4:00 PM',
    createdAt: '2024-04-05T00:00:00Z',
  },
  '5': {
    id: '5',
    name: 'Advanced Korean Literature',
    description: 'Explore Korean literature, poetry, and advanced reading comprehension for fluent speakers.',
    level: 'Advanced',
    lectureCount: 10,
    schedule: 'Fri 6:00 PM',
    createdAt: '2024-05-01T00:00:00Z',
  },
  '6': {
    id: '6',
    name: 'Business Korean',
    description: 'Professional Korean for business settings including formal language, email writing, and presentations.',
    level: 'Intermediate',
    lectureCount: 4,
    schedule: 'Thu 7:00 PM',
    createdAt: '2024-06-15T00:00:00Z',
  },
};

// Mock lectures data
const mockLectures: Record<string, Lecture[]> = {
  '1': [
    { id: 'l1', courseId: '1', title: 'Introduction to Hangul - Vowels', description: 'Learn the basic Korean vowels and their pronunciations.', videoUrl: 'https://example.com/video1.mp4', pdfUrl: 'https://example.com/hangul-vowels.pdf', duration: 1800, order: 1, createdAt: '2024-01-16T10:00:00Z', updatedAt: '2024-01-16T10:00:00Z' },
    { id: 'l2', courseId: '1', title: 'Introduction to Hangul - Consonants', description: 'Master the Korean consonants and practice writing them.', videoUrl: 'https://example.com/video2.mp4', pdfUrl: 'https://example.com/hangul-consonants.pdf', duration: 2100, order: 2, createdAt: '2024-01-18T10:00:00Z', updatedAt: '2024-01-18T10:00:00Z' },
    { id: 'l3', courseId: '1', title: 'Basic Greetings in Korean', description: 'Learn common Korean greetings for everyday situations.', videoUrl: 'https://example.com/video3.mp4', duration: 1500, order: 3, createdAt: '2024-01-20T10:00:00Z', updatedAt: '2024-01-20T10:00:00Z' },
    { id: 'l4', courseId: '1', title: 'Self Introduction', description: 'How to introduce yourself in Korean professionally and casually.', videoUrl: 'https://example.com/video4.mp4', pdfUrl: 'https://example.com/self-intro-worksheet.pdf', duration: 1650, order: 4, createdAt: '2024-01-22T10:00:00Z', updatedAt: '2024-01-22T10:00:00Z' },
  ],
  '2': [
    { id: 'l5', courseId: '2', title: 'Complex Sentence Patterns', description: 'Learn advanced sentence structures with multiple clauses.', videoUrl: 'https://example.com/video5.mp4', pdfUrl: 'https://example.com/sentence-patterns.pdf', duration: 2400, order: 1, createdAt: '2024-02-21T14:00:00Z', updatedAt: '2024-02-21T14:00:00Z' },
    { id: 'l6', courseId: '2', title: 'Formal vs Informal Speech', description: 'Understanding the differences between formal and informal Korean.', videoUrl: 'https://example.com/video6.mp4', duration: 2200, order: 2, createdAt: '2024-02-23T14:00:00Z', updatedAt: '2024-02-23T14:00:00Z' },
    { id: 'l7', courseId: '2', title: 'Honorific Language (존댓말)', description: 'Master the honorific system in Korean language.', videoUrl: 'https://example.com/video7.mp4', pdfUrl: 'https://example.com/honorifics-guide.pdf', duration: 2700, order: 3, createdAt: '2024-02-25T14:00:00Z', updatedAt: '2024-02-25T14:00:00Z' },
  ],
  '3': [
    { id: 'l8', courseId: '3', title: 'TOPIK I - Listening Strategies', description: 'Essential strategies for the TOPIK I listening section.', videoUrl: 'https://example.com/video8.mp4', pdfUrl: 'https://example.com/topik-listening-tips.pdf', duration: 3000, order: 1, createdAt: '2024-03-11T09:00:00Z', updatedAt: '2024-03-11T09:00:00Z' },
    { id: 'l9', courseId: '3', title: 'TOPIK I - Reading Comprehension', description: 'Tips and techniques for reading section success.', videoUrl: 'https://example.com/video9.mp4', pdfUrl: 'https://example.com/topik-reading-practice.pdf', duration: 2800, order: 2, createdAt: '2024-03-18T09:00:00Z', updatedAt: '2024-03-18T09:00:00Z' },
  ],
  '4': [
    { id: 'l10', courseId: '4', title: 'Daily Conversation Practice', description: 'Practice everyday conversations at the coffee shop, restaurant, and market.', videoUrl: 'https://example.com/video10.mp4', duration: 1800, order: 1, createdAt: '2024-04-06T16:00:00Z', updatedAt: '2024-04-06T16:00:00Z' },
    { id: 'l11', courseId: '4', title: 'Pronunciation Workshop', description: 'Focus on difficult Korean sounds and intonation patterns.', videoUrl: 'https://example.com/video11.mp4', pdfUrl: 'https://example.com/pronunciation-guide.pdf', duration: 2000, order: 2, createdAt: '2024-04-08T16:00:00Z', updatedAt: '2024-04-08T16:00:00Z' },
  ],
  '5': [
    { id: 'l12', courseId: '5', title: 'Introduction to Korean Poetry', description: 'Explore classical and modern Korean poetry.', videoUrl: 'https://example.com/video12.mp4', pdfUrl: 'https://example.com/poetry-anthology.pdf', duration: 2500, order: 1, createdAt: '2024-05-03T18:00:00Z', updatedAt: '2024-05-03T18:00:00Z' },
  ],
  '6': [],
};

function CourseLecturesContent() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  
  // Get course data from mock
  const course = mockCourses[courseId];

  useEffect(() => {
    // Check user role from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
      } catch {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    
    // Load mock lectures
    setTimeout(() => {
      setLectures(mockLectures[courseId] || []);
      setIsLoading(false);
    }, 500);
  }, [router, courseId]);

  // Handle success toast
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    setSuccessToast(true);
    // Add a mock lecture to the list
    const newLecture: Lecture = {
      id: `new-${Date.now()}`,
      courseId,
      title: 'New Lecture',
      description: 'Newly uploaded lecture',
      videoUrl: 'https://example.com/new-video.mp4',
      duration: 1800,
      order: lectures.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLectures([...lectures, newLecture]);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLectures(mockLectures[courseId] || []);
      setIsLoading(false);
    }, 500);
  };

  // Check if user can upload (Admin or Teacher only)
  const canUpload = userRole === 'Admin' || userRole === 'Teacher';

  // Get back link based on role
  const getBackLink = () => {
    if (userRole === 'Teacher') return '/teacher/lectures';
    return '/courses';
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
            href={getBackLink()}
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
      <div className="space-y-6">
        {/* Back Navigation */}
        <Link
          href={getBackLink()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Courses</span>
        </Link>

        {/* Course Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-brand-50 via-rose-50 to-amber-50 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                    <BookOpen className="w-6 h-6 text-brand-500" />
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getLevelBadge(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                
                {/* Course Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {course.name}
                </h1>
                
                {course.description && (
                  <p className="text-gray-600 text-sm md:text-base mb-4 max-w-2xl">
                    {course.description}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg">
                    <PlayCircle className="w-4 h-4 text-brand-500" />
                    <span className="font-medium">{lectures.length} {lectures.length === 1 ? 'Lecture' : 'Lectures'}</span>
                  </div>
                  
                  {course.schedule && (
                    <div className="flex items-center gap-2 text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg">
                      <Calendar className="w-4 h-4 text-brand-500" />
                      <span>{course.schedule}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                  title="Refresh"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                
                {/* Upload Buttons - Only for Admin + Teacher */}
                {canUpload && (
                  <>
                    {/* Quick Upload Modal */}
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                      title="Quick upload"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="hidden sm:inline">Quick Add</span>
                    </button>
                    
                    {/* Full Upload Page */}
                    <Link
                      href={`/lectures/${courseId}/upload`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-medium rounded-xl hover:bg-brand-600 active:scale-95 transition-all shadow-sm hover:shadow-md"
                    >
                      <Upload className="w-5 h-5" />
                      Upload Lecture
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lectures Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Course Lectures</h2>
            {lectures.length > 0 && (
              <span className="text-sm text-gray-400">
                {lectures.length} {lectures.length === 1 ? 'lecture' : 'lectures'} available
              </span>
            )}
          </div>

          {/* Lecture List */}
          <LectureList 
            lectures={lectures} 
            isLoading={isLoading}
          />
          
          {/* Student Notice */}
          {userRole === 'Student' && lectures.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700">
                💡 Click the <strong>Play</strong> button on any lecture to watch the video.
              </p>
            </div>
          )}
        </div>

        {/* Add Lecture Modal - Only for Admin + Teacher */}
        {showAddModal && canUpload && (
          <AddLectureModal
            courseId={courseId}
            courseName={course.name}
            onClose={() => setShowAddModal(false)}
            onSuccess={handleAddSuccess}
          />
        )}

        {/* Success Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 px-5 py-4 bg-emerald-500 text-white rounded-xl shadow-lg">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">Lecture uploaded successfully!</span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function TeacherCourseLecturesPage() {
  return (
    <QueryProvider>
      <CourseLecturesContent />
    </QueryProvider>
  );
}
