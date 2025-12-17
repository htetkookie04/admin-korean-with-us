'use client';

import MainLayout from '@/components/layout/MainLayout';
import { mockDashboardMetrics } from '@/lib/mockData';
import { Download, TrendingUp, Users, BookOpen } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#ec8da5', '#d77a92', '#f5c4d0', '#e06b8a', '#d44d6e'];

export default function AnalyticsPage() {
  const metrics = mockDashboardMetrics;

  const courseDistribution = [
    { name: 'Beginner', value: 35 },
    { name: 'Intermediate', value: 25 },
    { name: 'Speaking', value: 20 },
    { name: 'TOPIK', value: 20 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-1">Comprehensive analytics and insights</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.totalUsers}</p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12% from last month
                </p>
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
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metrics.activeUsers}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}% active rate
                </p>
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
                <TrendingUp className="w-6 h-6 text-orange-600" />
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
                <Line type="monotone" dataKey="count" stroke="#ec8da5" strokeWidth={2} name="Enrollments" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Enrollment Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.enrollmentTrends.weekly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ec8da5" name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Enrollment Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.enrollmentTrends.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#d77a92" name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Course */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Popular Course</h2>
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-brand-50 to-purple-50 rounded-lg">
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.popularCourse.courseName}</p>
              <p className="text-lg text-gray-600 mt-2">{metrics.popularCourse.enrollmentCount} total enrollments</p>
              <p className="text-sm text-gray-500 mt-1">Highest enrollment rate across all courses</p>
            </div>
            <div className="text-5xl font-bold text-brand-600">{metrics.popularCourse.enrollmentCount}</div>
          </div>
        </div>

        {/* Report Options */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <p className="font-medium text-gray-900">User Activity Report</p>
              <p className="text-sm text-gray-600 mt-1">Download CSV/PDF</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <p className="font-medium text-gray-900">Enrollment Report</p>
              <p className="text-sm text-gray-600 mt-1">Download CSV/PDF</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <p className="font-medium text-gray-900">Financial Report</p>
              <p className="text-sm text-gray-600 mt-1">Download CSV/PDF</p>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

