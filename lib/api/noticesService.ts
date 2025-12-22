import apiClient from './axios';
import { NoticesResponse, Notice, CreateNoticePayload } from '@/types/notices';

/**
 * Get all notices
 * GET /notices
 */
export const getNotices = async (): Promise<NoticesResponse> => {
  const response = await apiClient.get<NoticesResponse>('/notices');
  return response.data;
};

/**
 * Create a new notice (Admin only)
 * POST /notices
 */
export const createNotice = async (payload: CreateNoticePayload): Promise<Notice> => {
  const response = await apiClient.post<Notice>('/notices', payload);
  return response.data;
};

