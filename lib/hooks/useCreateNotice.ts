'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNotice } from '@/lib/api/noticesService';
import { CreateNoticePayload, Notice } from '@/types/notices';
import { NOTICES_QUERY_KEY } from './useNotices';

interface UseCreateNoticeOptions {
  onSuccess?: (data: Notice) => void;
  onError?: (error: Error) => void;
}

export function useCreateNotice(options?: UseCreateNoticeOptions) {
  const queryClient = useQueryClient();

  return useMutation<Notice, Error, CreateNoticePayload>({
    mutationFn: createNotice,
    onSuccess: (data) => {
      // Invalidate and refetch notices
      queryClient.invalidateQueries({ queryKey: NOTICES_QUERY_KEY });
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

