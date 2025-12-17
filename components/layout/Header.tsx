'use client';

import { useRouter } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import NotificationPanel from '@/components/NotificationPanel';

export default function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('admin@koreanwithus.com');
  const [userName, setUserName] = useState('Admin User');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    if (email) {
      setUserEmail(email);
    }
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('rememberMe');
    router.push('/login');
  };

  const getUserInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="fixed top-0 left-72 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-medium">
              {getUserInitials(userName)}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}

