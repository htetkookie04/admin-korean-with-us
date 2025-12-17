'use client';

import MainLayout from '@/components/layout/MainLayout';
import { mockDashboardMetrics } from '@/lib/mockData';
import { Users, UserCheck, TrendingUp, BookOpen } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const metrics = mockDashboardMetrics;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.totalUsers}</p>
                <p className="text-sm text-green-600 mt-2">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.totalEnrollments}</p>
                <p className="text-sm text-green-600 mt-2">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.activeUsers}</p>
                <p className="text-sm text-gray-600 mt-2">{metrics.pendingEnrollments} pending</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.conversionRate}%</p>
                <p className="text-sm text-brand-600 mt-2">Visitors → Sign-ups</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Enrollment Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.enrollmentTrends.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#ec8da5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Enrollment Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.enrollmentTrends.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ec8da5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Course */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Popular Course</h2>
          <div className="flex items-center justify-between p-4 bg-brand-50 rounded-lg">
            <div>
              <p className="text-lg font-semibold text-gray-900">{metrics.popularCourse.courseName}</p>
              <p className="text-sm text-gray-600 mt-1">{metrics.popularCourse.enrollmentCount} enrollments</p>
            </div>
            <div className="text-3xl font-bold text-brand-600">{metrics.popularCourse.enrollmentCount}</div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

