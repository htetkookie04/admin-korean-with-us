'use client';

import { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockDashboardMetrics } from '@/lib/mockData';
import { Users, UserCheck, TrendingUp, BookOpen, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const metrics = mockDashboardMetrics;
  
  // Filter states
  const [dailyFilter, setDailyFilter] = useState<'7' | '14' | '30'>('30');
  const [weeklyFilter, setWeeklyFilter] = useState<'4' | '8' | 'all'>('4');
  const [monthlyFilter, setMonthlyFilter] = useState<'2024' | '2023' | 'all'>('all');
  const [yearlyFilter, setYearlyFilter] = useState<'3' | '5' | 'all'>('5');

  // Filtered data
  const filteredDailyData = useMemo(() => {
    const days = parseInt(dailyFilter);
    return metrics.enrollmentTrends.daily.slice(-days);
  }, [dailyFilter, metrics.enrollmentTrends.daily]);

  const filteredWeeklyData = useMemo(() => {
    if (weeklyFilter === 'all') {
      return metrics.enrollmentTrends.weekly;
    }
    const weeks = parseInt(weeklyFilter);
    return metrics.enrollmentTrends.weekly.slice(-weeks);
  }, [weeklyFilter, metrics.enrollmentTrends.weekly]);

  const filteredMonthlyData = useMemo(() => {
    if (monthlyFilter === 'all') {
      return metrics.enrollmentTrends.monthly;
    }
    return metrics.enrollmentTrends.monthly.filter(item => item.month.includes(monthlyFilter));
  }, [monthlyFilter, metrics.enrollmentTrends.monthly]);

  const filteredYearlyData = useMemo(() => {
    if (yearlyFilter === 'all') {
      return metrics.enrollmentTrends.yearly;
    }
    const years = parseInt(yearlyFilter);
    return metrics.enrollmentTrends.yearly.slice(-years);
  }, [yearlyFilter, metrics.enrollmentTrends.yearly]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>

        {/* Charts - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Enrollment Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Daily Enrollment Trends</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={dailyFilter}
                  onChange={(e) => setDailyFilter(e.target.value as '7' | '14' | '30')}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredDailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" name="Enrollments" stroke="#ec8da5" strokeWidth={2} dot={{ fill: '#ec8da5' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Enrollment Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Enrollment Trends</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={weeklyFilter}
                  onChange={(e) => setWeeklyFilter(e.target.value as '4' | '8' | 'all')}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="4">Last 4 weeks</option>
                  <option value="8">Last 8 weeks</option>
                  <option value="all">All Weeks</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="count" name="Enrollments" fill="#ec8da5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Enrollment Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Monthly Enrollment Trends</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={monthlyFilter}
                  onChange={(e) => setMonthlyFilter(e.target.value as '2024' | '2023' | 'all')}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="all">All Years</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="count" name="Enrollments" fill="#ec8da5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Enrollment Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Yearly Enrollment Trends</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={yearlyFilter}
                  onChange={(e) => setYearlyFilter(e.target.value as '3' | '5' | 'all')}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="3">Last 3 years</option>
                  <option value="5">Last 5 years</option>
                  <option value="all">All Years</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredYearlyData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec8da5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec8da5" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Area type="monotone" dataKey="count" name="Enrollments" stroke="#ec8da5" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
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

