'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  Mail,
  Calendar,
  Image as ImageIcon,
  Settings,
  Shield,
  Bell,
  Globe,
  Video,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Admin menu items
const adminMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'User Management', icon: Users },
  { href: '/courses', label: 'Course Management', icon: BookOpen },
  { href: '/teacher/lectures', label: 'Lectures', icon: Video },
  { href: '/enrollments', label: 'Enrollments', icon: UserCheck },
  { href: '/notices', label: 'Notices', icon: Bell },
  { href: '/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
  { href: '/content', label: 'Content', icon: ImageIcon },
  { href: '/common-codes', label: 'Master Codes', icon: Code },
  { href: '/settings', label: 'Website Settings', icon: Settings },
  { href: '/security', label: 'Security', icon: Shield },
];

// Teacher menu items (no dashboard access)
const teacherMenuItems = [
  { href: '/teacher/lectures', label: 'Lectures', icon: Video },
  { href: '/notices', label: 'Notices', icon: Bell },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
];

// Student menu items (view only)
const studentMenuItems = [
  { href: '/student/lectures', label: 'My Courses', icon: BookOpen },
  { href: '/notices', label: 'Notices', icon: Bell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string>('Admin');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || 'Admin');
      } catch {
        // Default to Admin if parsing fails
      }
    }
  }, []);

  // Get menu items based on role
  const getMenuItems = () => {
    switch (userRole) {
      case 'Teacher':
        return teacherMenuItems;
      case 'Student':
        return studentMenuItems;
      default:
        return adminMenuItems;
    }
  };
  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto hide-scrollbar shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex-shrink-0 shadow">
          <img
            src="/logo.jpg"
            alt="Korean With Us Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Korean With Us</h1>
          <p className="text-xs text-gray-500">
            {userRole === 'Teacher' ? 'Teacher Portal' : userRole === 'Student' ? 'Student Portal' : 'Admin Dashboard'}
          </p>
        </div>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-brand-300 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-2 text-gray-500">
          <Globe className="w-5 h-5" />
          <span className="text-sm">Language: English</span>
        </div>
      </div>
    </div>
  );
}

