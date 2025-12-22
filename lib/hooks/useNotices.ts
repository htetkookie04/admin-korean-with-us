'use client';

import { useQuery } from '@tanstack/react-query';
import { getNotices } from '@/lib/api/noticesService';
import { NoticesResponse } from '@/types/notices';

export const NOTICES_QUERY_KEY = ['notices'];

export function useNotices() {
  return useQuery<NoticesResponse, Error>({
    queryKey: NOTICES_QUERY_KEY,
    queryFn: getNotices,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

