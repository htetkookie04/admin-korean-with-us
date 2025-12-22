'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { CreateNoticeModal } from '@/components/notices';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Notice, TargetRole, CreateNoticePayload } from '@/types/notices';
import { 
  Bell, 
  Plus, 
  RefreshCw, 
  Search,
  Calendar,
  User,
  Megaphone,
  Filter
} from 'lucide-react';

// Mock notices data
const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Welcome to Korean With Us!',
    message: 'We are excited to have you join our Korean language learning community. Explore our courses and start your journey to fluency today!',
    targetRoles: ['Admin', 'Teacher', 'Student'],
    createdBy: 'Admin',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'New TOPIK Course Available',
    message: 'We have launched a new TOPIK II preparation course. This comprehensive course covers all sections of the exam with practice tests and study materials. Enroll now to start preparing!',
    targetRoles: ['Student'],
    createdBy: 'Admin',
    createdAt: '2024-12-14T14:30:00Z',
    updatedAt: '2024-12-14T14:30:00Z',
  },
  {
    id: '3',
    title: 'Teacher Meeting - December Schedule',
    message: 'All teachers are requested to attend the monthly meeting on December 20th at 3:00 PM. We will discuss the curriculum updates and student progress reports.',
    targetRoles: ['Teacher'],
    createdBy: 'Admin',
    createdAt: '2024-12-13T09:00:00Z',
    updatedAt: '2024-12-13T09:00:00Z',
  },
  {
    id: '4',
    title: 'Holiday Schedule Notice',
    message: 'Please note that classes will be suspended from December 24th to January 1st for the holiday break. Regular classes will resume on January 2nd. Happy Holidays!',
    targetRoles: ['Teacher', 'Student'],
    createdBy: 'Admin',
    createdAt: '2024-12-12T11:00:00Z',
    updatedAt: '2024-12-12T11:00:00Z',
  },
  {
    id: '5',
    title: 'System Maintenance Notice',
    message: 'The platform will undergo scheduled maintenance on December 18th from 2:00 AM to 4:00 AM KST. During this time, some features may be temporarily unavailable.',
    targetRoles: ['Admin', 'Teacher', 'Student'],
    createdBy: 'Admin',
    createdAt: '2024-12-10T16:00:00Z',
    updatedAt: '2024-12-10T16:00:00Z',
  },
  {
    id: '6',
    title: 'Admin Portal Update',
    message: 'New analytics dashboard features have been added to the admin portal. Check out the improved enrollment tracking and revenue reports.',
    targetRoles: ['Admin'],
    createdBy: 'Admin',
    createdAt: '2024-12-08T08:00:00Z',
    updatedAt: '2024-12-08T08:00:00Z',
  },
];

function NoticesContent() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filterRole, setFilterRole] = useState<TargetRole | 'all'>('all');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
      } catch {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    
    // Simulate loading notices
    setTimeout(() => {
      setNotices(mockNotices);
      setIsLoading(false);
    }, 500);
  }, [router]);

  // Handle success toast
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Filter notices based on user role
  const getFilteredNotices = () => {
    let filtered = notices;
    
    // Role-based filtering (non-admin users only see notices targeted to them)
    if (userRole !== 'Admin') {
      filtered = filtered.filter(notice => 
        notice.targetRoles.includes(userRole as TargetRole)
      );
    }
    
    // Apply role filter dropdown (admin only)
    if (userRole === 'Admin' && filterRole !== 'all') {
      filtered = filtered.filter(notice => 
        notice.targetRoles.includes(filterRole)
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredNotices = getFilteredNotices();

  const handleCreateNotice = async (data: CreateNoticePayload) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add new notice to the list
    const newNotice: Notice = {
      id: `new-${Date.now()}`,
      title: data.title,
      message: data.message,
      targetRoles: data.targetRoles,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotices([newNotice, ...notices]);
    setIsSubmitting(false);
    setShowCreateModal(false);
    setSuccessToast(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNotices(mockNotices);
      setIsLoading(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getRoleBadge = (role: TargetRole) => {
    const colors: Record<TargetRole, string> = {
      'Admin': 'bg-purple-100 text-purple-700 border-purple-200',
      'Teacher': 'bg-blue-100 text-blue-700 border-blue-200',
      'Student': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[role];
  };

  const isAdmin = userRole === 'Admin';

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
            <p className="text-gray-500 mt-1">
              {isAdmin ? 'Manage and create announcements' : 'View announcements and updates'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Create Button - Admin Only */}
            {isAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 active:scale-95 transition-all shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                Create Notice
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Role Filter - Admin Only */}
            {isAdmin && (
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as TargetRole | 'all')}
                  className="pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer min-w-[160px]"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-100 rounded-full w-16" />
                      <div className="h-6 bg-gray-100 rounded-full w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNotices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <Megaphone className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No notices found' : 'No notices yet'}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              {searchTerm 
                ? 'Try adjusting your search terms.'
                : isAdmin 
                  ? 'Create your first notice to announce something to users.'
                  : 'There are no announcements for you at this time.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Notices List */}
        {!isLoading && filteredNotices.length > 0 && (
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <div 
                key={notice.id}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                      <Bell className="w-6 h-6 text-amber-600" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                          {notice.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(notice.createdAt)}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {notice.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {/* Target Roles */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-400 mr-1">Visible to:</span>
                          {notice.targetRoles.map((role) => (
                            <span
                              key={role}
                              className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${getRoleBadge(role)}`}
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                        
                        {/* Created By */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <User className="w-3.5 h-3.5" />
                          <span>{notice.createdBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {!isLoading && notices.length > 0 && (
          <div className="text-center text-sm text-gray-400">
            Showing {filteredNotices.length} of {userRole === 'Admin' ? notices.length : filteredNotices.length} notices
          </div>
        )}

        {/* Create Notice Modal - Admin Only */}
        {showCreateModal && isAdmin && (
          <CreateNoticeModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateNotice}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Success Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 px-5 py-4 bg-emerald-500 text-white rounded-xl shadow-lg">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">Notice created successfully!</span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default function NoticesPage() {
  return (
    <QueryProvider>
      <NoticesContent />
    </QueryProvider>
  );
}

