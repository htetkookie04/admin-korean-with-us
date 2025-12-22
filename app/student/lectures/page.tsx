'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { BookOpen, Search, RefreshCw, PlayCircle, ChevronRight, GraduationCap } from 'lucide-react';

// Types for enrolled courses
interface EnrolledCourse {
  id: string;
  name: string;
  description: string;
  level: string;
  lectureCount: number;
  completedLectures: number;
  thumbnail?: string;
  schedule: string;
  teacherName: string;
  enrolledAt: string;
}

// Mock enrolled courses data for students
const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: '1',
    name: 'Korean Beginner Level 1',
    description: 'Introduction to Korean language basics including Hangul, greetings, and simple conversations.',
    level: 'Beginner',
    lectureCount: 4,
    completedLectures: 2,
    schedule: 'Mon, Wed, Fri 10:00 AM',
    teacherName: 'Kim Soo-yeon',
    enrolledAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'TOPIK Preparation Course',
    description: 'Comprehensive preparation for TOPIK I and II exams with practice tests and study materials.',
    level: 'TOPIK',
    lectureCount: 2,
    completedLectures: 0,
    schedule: 'Sat 9:00 AM',
    teacherName: 'Park Ji-hoon',
    enrolledAt: '2024-03-05T00:00:00Z',
  },
  {
    id: '4',
    name: 'Korean Speaking Practice',
    description: 'Improve your speaking skills through conversations, role-play, and pronunciation exercises.',
    level: 'Speaking',
    lectureCount: 2,
    completedLectures: 1,
    schedule: 'Mon, Wed 4:00 PM',
    teacherName: 'Lee Min-ji',
    enrolledAt: '2024-04-01T00:00:00Z',
  },
];

function StudentCoursesContent() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const courses = mockEnrolledCourses;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
        
        if (user.role !== 'Student') {
          router.push('/dashboard');
        }
      } catch {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    
    setTimeout(() => setIsLoading(false), 500);
  }, [router]);

  if (userRole !== 'Student') {
    return null;
  }

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      'Beginner': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Intermediate': 'bg-amber-100 text-amber-700 border-amber-200',
      'Advanced': 'bg-rose-100 text-rose-700 border-rose-200',
      'Speaking': 'bg-violet-100 text-violet-700 border-violet-200',
      'TOPIK': 'bg-sky-100 text-sky-700 border-sky-200',
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getProgressPercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-500 mt-1">View your enrolled courses and watch lectures</p>
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
              placeholder="Search courses by name, level, or teacher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-2 bg-gray-100 rounded w-full" />
                  <div className="flex justify-between pt-4">
                    <div className="h-4 bg-gray-100 rounded w-1/4" />
                    <div className="h-9 bg-gray-200 rounded-lg w-24" />
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
              <GraduationCap className="w-10 h-10 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No courses found' : 'No enrolled courses'}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'You haven\'t enrolled in any courses yet. Browse available courses to get started!'
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
            {filteredCourses.map((course) => {
              const progress = getProgressPercentage(course.completedLectures, course.lectureCount);
              
              return (
                <div key={course.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 overflow-hidden">
                  {/* Course Header */}
                  <div className="relative h-36 bg-gradient-to-br from-brand-100 via-brand-50 to-rose-50 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(236,141,165,0.3),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,165,116,0.2),transparent_50%)]" />
                    
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-14 h-14 text-brand-300/60" />
                      </div>
                    )}
                    
                    {/* Level Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getLevelBadge(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    
                    {/* Lecture Count */}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                        <PlayCircle className="w-3.5 h-3.5 text-brand-500" />
                        <span className="text-xs font-semibold text-gray-700">
                          {course.lectureCount} Lectures
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {course.name}
                    </h3>
                    
                    <p className="text-xs text-gray-500 mb-3">
                      by {course.teacherName}
                    </p>
                    
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-semibold text-brand-600">{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {course.completedLectures} of {course.lectureCount} completed
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-400">
                        {course.schedule}
                      </div>
                      
                      <Link
                        href={`/student/lectures/${course.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && courses.length > 0 && (
          <div className="text-center text-sm text-gray-400">
            Showing {filteredCourses.length} of {courses.length} enrolled courses
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function StudentLecturesPage() {
  return (
    <QueryProvider>
      <StudentCoursesContent />
    </QueryProvider>
  );
}

