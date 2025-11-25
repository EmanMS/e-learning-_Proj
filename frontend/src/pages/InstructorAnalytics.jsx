import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { TrendingUp, Users, DollarSign, BookOpen, BarChart3 } from 'lucide-react';

const InstructorAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/analytics/stats/instructor_stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                    <p className="text-red-600 text-lg">Failed to load analytics data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <BarChart3 size={40} className="text-blue-600" />
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">Track your course performance and revenue</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <BookOpen className="text-blue-600" size={24} />
                            </div>
                            <TrendingUp className="text-green-500" size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Courses</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_courses}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Users className="text-green-600" size={24} />
                            </div>
                            <TrendingUp className="text-green-500" size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Enrollments</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_enrollments}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <DollarSign className="text-purple-600" size={24} />
                            </div>
                            <TrendingUp className="text-green-500" size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900">${stats.total_revenue.toFixed(2)}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <BarChart3 className="text-yellow-600" size={24} />
                            </div>
                            <TrendingUp className="text-green-500" size={20} />
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium mb-1">Avg. Enrollments</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {stats.total_courses > 0 ? (stats.total_enrollments / stats.total_courses).toFixed(1) : 0}
                        </p>
                    </div>
                </div>

                {/* Course Performance Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Course Performance</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Course Title
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Enrollments
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Revenue
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {stats.courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-900 font-semibold">{course.enrollments}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={16} className="text-green-600" />
                                                <span className="text-sm text-gray-900 font-semibold">${course.revenue.toFixed(2)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorAnalytics;
