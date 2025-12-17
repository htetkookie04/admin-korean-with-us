'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Bot, Send, Sparkles, MessageSquare } from 'lucide-react';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you manage the Korean With Us admin dashboard today?',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant' as const,
        content: `I understand you're asking about "${input}". Here's a helpful response based on your dashboard data. You can use me to get insights, generate reports, or answer questions about your admin panel.`,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-8 h-8 text-brand-600" />
            AI Assistant
          </h1>
          <p className="text-gray-600 mt-1">Get help, insights, and automated suggestions</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-left">
            <Sparkles className="w-6 h-6 text-brand-600 mb-2" />
            <p className="font-medium text-gray-900">Generate Report</p>
            <p className="text-sm text-gray-600 mt-1">Create analytics report</p>
          </button>
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-left">
            <MessageSquare className="w-6 h-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Reply Suggestions</p>
            <p className="text-sm text-gray-600 mt-1">AI-generated inquiry replies</p>
          </button>
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow text-left">
            <Bot className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Data Insights</p>
            <p className="text-sm text-gray-600 mt-1">Get insights from your data</p>
          </button>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow flex flex-col" style={{ height: '600px' }}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-semibold text-gray-900">Chat with AI Assistant</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-medium">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your dashboard..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              AI Assistant can help with: generating reports, answering questions, providing insights, and more.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Automated Email Suggestions</h3>
              <p className="text-sm text-gray-600">
                Get AI-generated reply suggestions for contact form inquiries and enrollment questions.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Inactive Student Detection</h3>
              <p className="text-sm text-gray-600">
                Automatically identify students who haven't logged in recently and suggest follow-up actions.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Report Generation</h3>
              <p className="text-sm text-gray-600">
                Generate comprehensive reports on enrollments, user activity, and course performance.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Data Insights</h3>
              <p className="text-sm text-gray-600">
                Get intelligent insights and recommendations based on your dashboard data and trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

