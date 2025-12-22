'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockInquiries } from '@/lib/mockData';
import { Search, MessageSquare, CheckCircle, XCircle, Send } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { Inquiry, InquiryStatus } from '@/types';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, status: InquiryStatus) => {
    setInquiries(inquiries.map(i => 
      i.id === id ? { ...i, status } : i
    ));
  };

  const handleReply = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowReplyModal(true);
  };

  const getStatusBadge = (status: InquiryStatus) => {
    const colors: Record<InquiryStatus, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'replied': 'bg-brand-100 text-brand-800',
      'closed': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact & Inquiry Management</h1>
            <p className="text-gray-600 mt-1">Handle contact form messages and enrollment inquiries</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{inquiry.subject}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="font-medium">{inquiry.name}</span>
                    <span>{inquiry.email}</span>
                    <span>{inquiry.phone}</span>
                    <span>{formatDateTime(inquiry.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{inquiry.message}</p>
                  {inquiry.replyMessage && (
                    <div className="mt-4 p-4 bg-brand-50 rounded-lg border-l-4 border-brand-500">
                      <p className="text-sm font-medium text-gray-900 mb-1">Reply:</p>
                      <p className="text-sm text-gray-700">{inquiry.replyMessage}</p>
                      {inquiry.repliedAt && (
                        <p className="text-xs text-gray-500 mt-2">Replied on {formatDateTime(inquiry.repliedAt)}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {inquiry.status === 'pending' && (
                    <button
                      onClick={() => handleReply(inquiry)}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Reply
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(inquiry.id, 'replied')}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Replied
                    </button>
                    <button
                      onClick={() => handleStatusChange(inquiry.id, 'closed')}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Modal */}
        {showReplyModal && selectedInquiry && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reply to Inquiry</h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">From: {selectedInquiry.name} ({selectedInquiry.email})</p>
                <p className="text-sm font-medium text-gray-900 mb-2">Subject: {selectedInquiry.subject}</p>
                <p className="text-sm text-gray-700">{selectedInquiry.message}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reply Message</label>
                <textarea
                  rows={6}
                  placeholder="Type your reply here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedInquiry(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedInquiry.id, 'replied');
                    setShowReplyModal(false);
                    setSelectedInquiry(null);
                  }}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

