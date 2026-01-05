'use client';

import { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockDashboardMetrics } from '@/lib/mockData';
import { Download, TrendingUp, Users, BookOpen, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#ec8da5', '#d77a92', '#f5c4d0', '#e06b8a', '#d44d6e'];

export default function AnalyticsPage() {
  const metrics = mockDashboardMetrics;

  // Filter states
  const [dailyFilter, setDailyFilter] = useState<'7' | '14' | '30'>('30');
  const [weeklyFilter, setWeeklyFilter] = useState<'4' | '8' | 'all'>('all');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Line type="monotone" dataKey="count" stroke="#ec8da5" strokeWidth={2} name="Enrollments" dot={{ fill: '#ec8da5' }} />
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
                <Bar dataKey="count" fill="#ec8da5" name="Enrollments" radius={[4, 4, 0, 0]} />
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
                <Bar dataKey="count" fill="#d77a92" name="Enrollments" radius={[4, 4, 0, 0]} />
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
                  <linearGradient id="colorYearlyCount" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="count" name="Enrollments" stroke="#ec8da5" strokeWidth={2} fillOpacity={1} fill="url(#colorYearlyCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution */}
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
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {courseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
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

