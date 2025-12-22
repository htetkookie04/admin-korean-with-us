// Notices Types

export type TargetRole = 'Admin' | 'Teacher' | 'Student';

export interface Notice {
  id: string;
  title: string;
  message: string;
  targetRoles: TargetRole[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticePayload {
  title: string;
  message: string;
  targetRoles: TargetRole[];
}

export interface NoticesResponse {
  notices: Notice[];
}

