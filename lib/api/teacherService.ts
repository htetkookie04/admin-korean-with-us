import apiClient from './axios';
import { 
  TeacherCoursesResponse, 
  TeacherLecturesResponse, 
  Lecture,
  AddLecturePayload 
} from '@/types/teacher';

// Teacher API Service

/**
 * Get all courses assigned to the teacher
 * GET /teacher/courses
 */
export const getTeacherCourses = async (): Promise<TeacherCoursesResponse> => {
  const response = await apiClient.get<TeacherCoursesResponse>('/teacher/courses');
  return response.data;
};

/**
 * Get all lectures for a specific course
 * GET /teacher/lectures/:courseId
 */
export const getTeacherLectures = async (courseId: string): Promise<TeacherLecturesResponse> => {
  const response = await apiClient.get<TeacherLecturesResponse>(`/teacher/lectures/${courseId}`);
  return response.data;
};

/**
 * Add a new lecture to a course
 * POST /teacher/lectures/:courseId
 * Uses FormData for video and PDF upload
 */
export const addLecture = async (
  courseId: string, 
  payload: AddLecturePayload
): Promise<Lecture> => {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  
  if (payload.video) {
    formData.append('video', payload.video);
  }
  
  if (payload.pdf) {
    formData.append('pdf', payload.pdf);
  }
  
  const response = await apiClient.post<Lecture>(
    `/teacher/lectures/${courseId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};

