'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { VideoPlayer } from '@/components/teacher/VideoPlayer';
import { 
  ArrowLeft, 
  BookOpen,
  PlayCircle,
  Calendar,
  Clock,
  FileText,
  Download,
  CheckCircle,
  User,
  RefreshCw
} from 'lucide-react';

// Types
interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  pdfUrl?: string;
  duration?: number;
  order: number;
  createdAt: string;
  isCompleted?: boolean;
}

interface EnrolledCourse {
  id: string;
  name: string;
  description: string;
  level: string;
  schedule: string;
  teacherName: string;
}

// Mock course data
const mockCourses: Record<string, EnrolledCourse> = {
  '1': {
    id: '1',
    name: 'Korean Beginner Level 1',
    description: 'Introduction to Korean language basics including Hangul, greetings, and simple conversations.',
    level: 'Beginner',
    schedule: 'Mon, Wed, Fri 10:00 AM',
    teacherName: 'Kim Soo-yeon',
  },
  '3': {
    id: '3',
    name: 'TOPIK Preparation Course',
    description: 'Comprehensive preparation for TOPIK I and II exams with practice tests and study materials.',
    level: 'TOPIK',
    schedule: 'Sat 9:00 AM',
    teacherName: 'Park Ji-hoon',
  },
  '4': {
    id: '4',
    name: 'Korean Speaking Practice',
    description: 'Improve your speaking skills through conversations, role-play, and pronunciation exercises.',
    level: 'Speaking',
    schedule: 'Mon, Wed 4:00 PM',
    teacherName: 'Lee Min-ji',
  },
};

// Mock lectures data with completion status for students
const mockLectures: Record<string, Lecture[]> = {
  '1': [
    { id: 'l1', title: 'Introduction to Hangul - Vowels', description: 'Learn the basic Korean vowels and their pronunciations.', videoUrl: 'https://example.com/video1.mp4', pdfUrl: 'https://example.com/hangul-vowels.pdf', duration: 1800, order: 1, createdAt: '2024-01-16T10:00:00Z', isCompleted: true },
    { id: 'l2', title: 'Introduction to Hangul - Consonants', description: 'Master the Korean consonants and practice writing them.', videoUrl: 'https://example.com/video2.mp4', pdfUrl: 'https://example.com/hangul-consonants.pdf', duration: 2100, order: 2, createdAt: '2024-01-18T10:00:00Z', isCompleted: true },
    { id: 'l3', title: 'Basic Greetings in Korean', description: 'Learn common Korean greetings for everyday situations.', videoUrl: 'https://example.com/video3.mp4', duration: 1500, order: 3, createdAt: '2024-01-20T10:00:00Z', isCompleted: false },
    { id: 'l4', title: 'Self Introduction', description: 'How to introduce yourself in Korean professionally and casually.', videoUrl: 'https://example.com/video4.mp4', pdfUrl: 'https://example.com/self-intro-worksheet.pdf', duration: 1650, order: 4, createdAt: '2024-01-22T10:00:00Z', isCompleted: false },
  ],
  '3': [
    { id: 'l8', title: 'TOPIK I - Listening Strategies', description: 'Essential strategies for the TOPIK I listening section.', videoUrl: 'https://example.com/video8.mp4', pdfUrl: 'https://example.com/topik-listening-tips.pdf', duration: 3000, order: 1, createdAt: '2024-03-11T09:00:00Z', isCompleted: false },
    { id: 'l9', title: 'TOPIK I - Reading Comprehension', description: 'Tips and techniques for reading section success.', videoUrl: 'https://example.com/video9.mp4', pdfUrl: 'https://example.com/topik-reading-practice.pdf', duration: 2800, order: 2, createdAt: '2024-03-18T09:00:00Z', isCompleted: false },
  ],
  '4': [
    { id: 'l10', title: 'Daily Conversation Practice', description: 'Practice everyday conversations at the coffee shop, restaurant, and market.', videoUrl: 'https://example.com/video10.mp4', duration: 1800, order: 1, createdAt: '2024-04-06T16:00:00Z', isCompleted: true },
    { id: 'l11', title: 'Pronunciation Workshop', description: 'Focus on difficult Korean sounds and intonation patterns.', videoUrl: 'https://example.com/video11.mp4', pdfUrl: 'https://example.com/pronunciation-guide.pdf', duration: 2000, order: 2, createdAt: '2024-04-08T16:00:00Z', isCompleted: false },
  ],
};

function StudentCourseLecturesContent() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [playingVideo, setPlayingVideo] = useState<{ url: string; title: string } | null>(null);
  
  const course = mockCourses[courseId];

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
    
    setTimeout(() => {
      setLectures(mockLectures[courseId] || []);
      setIsLoading(false);
    }, 500);
  }, [router, courseId]);

  if (userRole !== 'Student') {
    return null;
  }

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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const completedCount = lectures.filter(l => l.isCompleted).length;
  const progressPercent = lectures.length > 0 ? Math.round((completedCount / lectures.length) * 100) : 0;

  if (!course) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-4">You may not be enrolled in this course.</p>
          <Link
            href="/student/lectures"
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Back to My Courses
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
          href="/student/lectures"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to My Courses</span>
        </Link>

        {/* Course Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-brand-50 via-rose-50 to-amber-50 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                    <BookOpen className="w-6 h-6 text-brand-500" />
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getLevelBadge(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {course.name}
                </h1>
                
                <p className="text-gray-600 text-sm md:text-base mb-4 max-w-2xl">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg">
                    <User className="w-4 h-4 text-brand-500" />
                    <span>{course.teacherName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg">
                    <PlayCircle className="w-4 h-4 text-brand-500" />
                    <span>{lectures.length} Lectures</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 bg-white/60 px-3 py-1.5 rounded-lg">
                    <Calendar className="w-4 h-4 text-brand-500" />
                    <span>{course.schedule}</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Card */}
              <div className="bg-white rounded-xl p-4 shadow-sm min-w-[200px]">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Your Progress</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-bold text-brand-600">{progressPercent}%</span>
                  <span className="text-sm text-gray-400 mb-1">complete</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {completedCount} of {lectures.length} lectures completed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lectures Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Course Lectures</h2>
            <button
              onClick={() => { setIsLoading(true); setTimeout(() => { setLectures(mockLectures[courseId] || []); setIsLoading(false); }, 500); }}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                    <div className="w-20 h-10 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && lectures.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No lectures yet</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                Lectures for this course haven&apos;t been uploaded yet. Check back soon!
              </p>
            </div>
          )}

          {/* Lecture List */}
          {!isLoading && lectures.length > 0 && (
            <div className="space-y-3">
              {lectures.map((lecture, index) => (
                <div 
                  key={lecture.id}
                  className={`group rounded-xl border transition-all duration-200 overflow-hidden ${
                    lecture.isCompleted 
                      ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-200' 
                      : 'bg-white border-gray-100 hover:border-brand-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Lecture Number / Completed Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg ${
                      lecture.isCompleted 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600'
                    }`}>
                      {lecture.isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* Lecture Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-base font-semibold truncate transition-colors ${
                        lecture.isCompleted ? 'text-emerald-800' : 'text-gray-900 group-hover:text-brand-600'
                      }`}>
                        {lecture.title}
                      </h4>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(lecture.createdAt)}</span>
                        </div>
                        
                        {lecture.duration && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatDuration(lecture.duration)}</span>
                          </div>
                        )}
                        
                        {lecture.pdfUrl && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-500">
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </div>
                        )}
                        
                        {lecture.isCompleted && (
                          <span className="text-xs text-emerald-600 font-medium">Completed</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* PDF Download */}
                      {lecture.pdfUrl && (
                        <a
                          href={lecture.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 active:scale-95 transition-all duration-200"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium hidden sm:inline">PDF</span>
                        </a>
                      )}
                      
                      {/* Watch Button */}
                      {lecture.videoUrl && (
                        <button
                          onClick={() => setPlayingVideo({ url: lecture.videoUrl!, title: lecture.title })}
                          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg active:scale-95 transition-all duration-200 ${
                            lecture.isCompleted
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm hover:shadow-md'
                          }`}
                        >
                          <PlayCircle className="w-5 h-5" />
                          <span className="text-sm font-medium hidden sm:inline">
                            {lecture.isCompleted ? 'Rewatch' : 'Watch'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {lecture.description && (
                    <div className="px-4 pb-4 pt-0">
                      <p className="text-sm text-gray-500 pl-16">
                        {lecture.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Helpful Tip */}
          {!isLoading && lectures.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700">
                💡 Click <strong>Watch</strong> to play a lecture video. Download PDFs for additional study materials.
              </p>
            </div>
          )}
        </div>

        {/* Video Player Modal */}
        {playingVideo && (
          <VideoPlayer
            videoUrl={playingVideo.url}
            title={playingVideo.title}
            onClose={() => setPlayingVideo(null)}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default function StudentCourseLecturesPage() {
  return (
    <QueryProvider>
      <StudentCourseLecturesContent />
    </QueryProvider>
  );
}

