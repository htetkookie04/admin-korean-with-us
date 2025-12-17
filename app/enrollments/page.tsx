'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockEnrollments } from '@/lib/mockData';
import { Check, X, Download, Filter, Search } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Enrollment, EnrollmentStatus } from '@/types';

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'all'>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  
  // More filters state
  const [moreFilters, setMoreFilters] = useState({
    dateFrom: '',
    dateTo: '',
  });

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || enrollment.courseId === courseFilter;
    
    // Date range filter
    const enrolledDate = new Date(enrollment.enrolledAt);
    const matchesDateFrom = !moreFilters.dateFrom || enrolledDate >= new Date(moreFilters.dateFrom);
    const matchesDateTo = !moreFilters.dateTo || enrolledDate <= new Date(moreFilters.dateTo);
    
    return matchesSearch && matchesStatus && matchesCourse && matchesDateFrom && matchesDateTo;
  });

  const clearMoreFilters = () => {
    setMoreFilters({
      dateFrom: '',
      dateTo: '',
    });
  };

  const hasActiveMoreFilters = moreFilters.dateFrom || moreFilters.dateTo;

  const handleApprove = (id: string) => {
    setEnrollments(enrollments.map(e => 
      e.id === id ? { ...e, status: 'approved' as EnrollmentStatus } : e
    ));
  };

  const handleReject = (id: string) => {
    setEnrollments(enrollments.map(e => 
      e.id === id ? { ...e, status: 'rejected' as EnrollmentStatus } : e
    ));
  };

  const getStatusBadge = (status: EnrollmentStatus) => {
    const colors: Record<EnrollmentStatus, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'completed': 'bg-brand-100 text-brand-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting enrollments as ${format.toUpperCase()}...`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
            <p className="text-gray-600 mt-1">Approve, reject, and track student enrollments</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search enrollments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EnrollmentStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Courses</option>
              <option value="1">Korean Beginner Level 1</option>
              <option value="2">Korean Intermediate Conversation</option>
              <option value="3">Korean Speaking Practice</option>
              <option value="4">TOPIK Preparation Level 3-4</option>
            </select>
            <div className="relative">
              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  hasActiveMoreFilters 
                    ? 'border-brand-500 bg-brand-50 text-brand-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                More Filters
                {hasActiveMoreFilters && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-brand-600 text-white rounded-full">
                    {[moreFilters.dateFrom, moreFilters.dateTo].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* More Filters Popup */}
              {showMoreFilters && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">More Filters</h3>
                      <button 
                        onClick={() => setShowMoreFilters(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Date Range Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Date Range</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">From</label>
                            <input
                              type="date"
                              value={moreFilters.dateFrom}
                              onChange={(e) => setMoreFilters({ ...moreFilters, dateFrom: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">To</label>
                            <input
                              type="date"
                              value={moreFilters.dateTo}
                              onChange={(e) => setMoreFilters({ ...moreFilters, dateTo: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={clearMoreFilters}
                        className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={() => setShowMoreFilters(false)}
                        className="flex-1 px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{enrollment.studentName}</div>
                      <div className="text-sm text-gray-500">ID: {enrollment.studentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enrollment.courseName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(enrollment.status)}`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.enrolledAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {enrollment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(enrollment.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(enrollment.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => {
                            setSelectedEnrollment(enrollment);
                            setShowDetails(true);
                          }}
                          className="text-brand-600 hover:text-brand-900"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Enrollments</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{enrollments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {enrollments.filter(e => e.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {enrollments.filter(e => e.status === 'approved').length}
            </p>
          </div>
        </div>

        {/* Enrollment Details Modal */}
        {showDetails && selectedEnrollment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Enrollment Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Student Info */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Student Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Student Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEnrollment.studentName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Student ID</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEnrollment.studentId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEnrollment.studentEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEnrollment.studentPhone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEnrollment.studentAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Course Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Course Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEnrollment.courseName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Course ID</p>
                      <p className="text-sm font-medium text-gray-900">{selectedEnrollment.courseId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Status */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Enrollment Status</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedEnrollment.status)}`}>
                        {selectedEnrollment.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Enrolled Date</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(selectedEnrollment.enrolledAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                {selectedEnrollment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedEnrollment.id);
                        setShowDetails(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve Enrollment
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedEnrollment.id);
                        setShowDetails(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject Enrollment
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetails(false)}
                  className={`${selectedEnrollment.status === 'pending' ? '' : 'flex-1'} px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

