// Teacher Lecture Management Types

export interface TeacherCourse {
  id: string;
  name: string;
  description: string;
  level: string;
  lectureCount: number;
  thumbnail?: string;
  schedule: string;
  createdAt: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  pdfUrl?: string;
  duration?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddLecturePayload {
  title: string;
  description: string;
  video?: File;
  pdf?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TeacherCoursesResponse {
  courses: TeacherCourse[];
}

export interface TeacherLecturesResponse {
  course: TeacherCourse;
  lectures: Lecture[];
}

