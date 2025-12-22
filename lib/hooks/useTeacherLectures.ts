'use client';

import { useQuery } from '@tanstack/react-query';
import { getTeacherLectures } from '@/lib/api/teacherService';
import { TeacherLecturesResponse } from '@/types/teacher';

export const TEACHER_LECTURES_QUERY_KEY = ['teacher', 'lectures'];

export function useTeacherLectures(courseId: string) {
  return useQuery<TeacherLecturesResponse, Error>({
    queryKey: [...TEACHER_LECTURES_QUERY_KEY, courseId],
    queryFn: () => getTeacherLectures(courseId),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

