'use client';

import { Lecture } from '@/types/teacher';
import { PlayCircle, Calendar, Clock, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';

interface LectureItemProps {
  lecture: Lecture;
  index: number;
}

export function LectureItem({ lecture, index }: LectureItemProps) {
  const [showVideo, setShowVideo] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="group bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          {/* Lecture Number */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 font-bold text-lg rounded-xl">
            {index + 1}
          </div>

          {/* Lecture Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-gray-900 truncate group-hover:text-brand-600 transition-colors">
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* PDF Download Button */}
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
            
            {/* Play Button */}
            {lecture.videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 active:scale-95 transition-all duration-200"
              >
                <PlayCircle className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Play</span>
              </button>
            )}
          </div>
        </div>

        {/* Description (expandable) */}
        {lecture.description && (
          <div className="px-4 pb-4 pt-0">
            <p className="text-sm text-gray-500 pl-16">
              {lecture.description}
            </p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {showVideo && lecture.videoUrl && (
        <VideoPlayer
          videoUrl={lecture.videoUrl}
          title={lecture.title}
          onClose={() => setShowVideo(false)}
        />
      )}
    </>
  );
}

