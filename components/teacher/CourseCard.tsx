'use client';

import { TeacherCourse } from '@/types/teacher';
import { BookOpen, PlayCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  course: TeacherCourse;
}

export function CourseCard({ course }: CourseCardProps) {
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

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 overflow-hidden">
      {/* Course Thumbnail/Header */}
      <div className="relative h-40 bg-gradient-to-br from-brand-100 via-brand-50 to-rose-50 overflow-hidden">
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
            <BookOpen className="w-16 h-16 text-brand-300/60" />
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getLevelBadge(course.level)}`}>
            {course.level}
          </span>
        </div>
        
        {/* Lecture Count Badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <PlayCircle className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-semibold text-gray-700">
              {course.lectureCount} {course.lectureCount === 1 ? 'Lecture' : 'Lectures'}
            </span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {course.name}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
          {course.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            {course.schedule || 'Schedule TBA'}
          </div>
          
          <Link
            href={`/teacher/lectures/${course.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Open
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

