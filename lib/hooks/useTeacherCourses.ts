'use client';

import { useQuery } from '@tanstack/react-query';
import { getTeacherCourses } from '@/lib/api/teacherService';
import { TeacherCoursesResponse } from '@/types/teacher';

export const TEACHER_COURSES_QUERY_KEY = ['teacher', 'courses'];

export function useTeacherCourses() {
  return useQuery<TeacherCoursesResponse, Error>({
    queryKey: TEACHER_COURSES_QUERY_KEY,
    queryFn: getTeacherCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

