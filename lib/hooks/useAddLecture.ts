'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addLecture } from '@/lib/api/teacherService';
import { AddLecturePayload, Lecture } from '@/types/teacher';
import { TEACHER_LECTURES_QUERY_KEY } from './useTeacherLectures';
import { TEACHER_COURSES_QUERY_KEY } from './useTeacherCourses';

interface UseAddLectureOptions {
  onSuccess?: (data: Lecture) => void;
  onError?: (error: Error) => void;
}

export function useAddLecture(courseId: string, options?: UseAddLectureOptions) {
  const queryClient = useQueryClient();

  return useMutation<Lecture, Error, AddLecturePayload>({
    mutationFn: (payload) => addLecture(courseId, payload),
    onSuccess: (data) => {
      // Invalidate and refetch lectures for this course
      queryClient.invalidateQueries({ 
        queryKey: [...TEACHER_LECTURES_QUERY_KEY, courseId] 
      });
      // Also invalidate courses to update lecture count
      queryClient.invalidateQueries({ 
        queryKey: TEACHER_COURSES_QUERY_KEY 
      });
      
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

