export type UserRole = 'Admin' | 'Student' | 'Teacher';
export type UserType = 'student' | 'teacher' | 'admin_staff';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type InquiryStatus = 'pending' | 'replied' | 'closed';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Speaking' | 'TOPIK';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  type: UserType;
  status: 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  enrollmentHistory?: Enrollment[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
  ipAddress?: string;
}

export interface Course {
  id: string;
  name: string;
  level: CourseLevel;
  description: string;
  fee: number;
  schedule: string;
  teacherId?: string;
  teacherName?: string;
  resources: string[];
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentAddress: string;
  courseId: string;
  courseName: string;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  repliedAt?: string;
  replyMessage?: string;
}

export interface Timetable {
  id: string;
  courseId: string;
  courseName: string;
  level: CourseLevel;
  teacherId: string;
  teacherName: string;
  room: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  occupancy: number;
  maxOccupancy: number;
}

export interface Content {
  id: string;
  type: 'photo' | 'video';
  title: string;
  category: 'class' | 'cultural_event' | 'achievement';
  url: string;
  thumbnail?: string;
  description?: string;
  createdAt: string;
}

export interface WebsiteSettings {
  homepage: {
    heroText: string;
    aboutText: string;
    images: string[];
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    socialMedia: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
    };
  };
  teachers: Array<{
    id: string;
    name: string;
    bio: string;
    image: string;
    specialization: string[];
  }>;
  pricing: Array<{
    courseId: string;
    courseName: string;
    price: number;
    duration: string;
  }>;
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    maintenanceMode: boolean;
  };
}

export interface DashboardMetrics {
  totalUsers: number;
  totalEnrollments: number;
  activeUsers: number;
  pendingEnrollments: number;
  enrollmentTrends: {
    daily: Array<{ date: string; count: number }>;
    weekly: Array<{ week: string; count: number }>;
    monthly: Array<{ month: string; count: number }>;
  };
  popularCourse: {
    courseId: string;
    courseName: string;
    enrollmentCount: number;
  };
  conversionRate: number;
}

