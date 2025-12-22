'use client';

import { Lecture } from '@/types/teacher';
import { LectureItem } from './LectureItem';
import { FileVideo } from 'lucide-react';

interface LectureListProps {
  lectures: Lecture[];
  isLoading?: boolean;
}

export function LectureList({ lectures, isLoading }: LectureListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="w-20 h-10 bg-gray-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileVideo className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No lectures yet</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          This course doesn&apos;t have any lectures. Click the &quot;Add Lecture&quot; button above to create your first lecture.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lectures.map((lecture, index) => (
        <LectureItem 
          key={lecture.id} 
          lecture={lecture} 
          index={index}
        />
      ))}
    </div>
  );
}

