'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { CourseCard } from '@/components/teacher';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { BookOpen, Search, RefreshCw } from 'lucide-react';
import { TeacherCourse } from '@/types/teacher';

// Mock data for development/demo purposes
const mockCourses: TeacherCourse[] = [
  {
    id: '1',
    name: 'Korean Beginner Level 1',
    description: 'Introduction to Korean language basics including Hangul, greetings, and simple conversations.',
    level: 'Beginner',
    lectureCount: 12,
    schedule: 'Mon, Wed, Fri 10:00 AM',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Korean Intermediate Grammar',
    description: 'Advanced grammar patterns, complex sentence structures, and formal expressions for intermediate learners.',
    level: 'Intermediate',
    lectureCount: 8,
    schedule: 'Tue, Thu 2:00 PM',
    createdAt: '2024-02-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'TOPIK Preparation Course',
    description: 'Comprehensive preparation for TOPIK I and II exams with practice tests and study materials.',
    level: 'TOPIK',
    lectureCount: 15,
    schedule: 'Sat 9:00 AM',
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Korean Speaking Practice',
    description: 'Improve your speaking skills through conversations, role-play, and pronunciation exercises.',
    level: 'Speaking',
    lectureCount: 6,
    schedule: 'Mon, Wed 4:00 PM',
    createdAt: '2024-04-05T00:00:00Z',
  },
  {
    id: '5',
    name: 'Advanced Korean Literature',
    description: 'Explore Korean literature, poetry, and advanced reading comprehension for fluent speakers.',
    level: 'Advanced',
    lectureCount: 10,
    schedule: 'Fri 6:00 PM',
    createdAt: '2024-05-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Business Korean',
    description: 'Professional Korean for business settings including formal language, email writing, and presentations.',
    level: 'Intermediate',
    lectureCount: 4,
    schedule: 'Thu 7:00 PM',
    createdAt: '2024-06-15T00:00:00Z',
  },
];

function TeacherLecturesContent() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Use mock data for demo (replace with useTeacherCourses() when API is ready)
  const courses = mockCourses;

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
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, [router]);

  // Hide if not Admin or Teacher
  if (userRole !== 'Admin' && userRole !== 'Teacher') {
    return null;
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lectures</h1>
            <p className="text-gray-500 mt-1">Manage lectures for your assigned courses</p>
          </div>
          
          <button
            onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses by name or level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="flex justify-between pt-4">
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-9 bg-gray-200 rounded-lg w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No courses found' : 'No courses assigned'}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'You don\'t have any courses assigned yet. Contact an administrator to get started.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && courses.length > 0 && (
          <div className="text-center text-sm text-gray-400">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function TeacherLecturesPage() {
  return (
    <QueryProvider>
      <TeacherLecturesContent />
    </QueryProvider>
  );
}

