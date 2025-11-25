import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await api.get('/payments/history/');
            setPayments(response.data);
        } catch (error) {
            console.error('Failed to fetch payment history', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'succeeded':
                return <CheckCircle className="text-green-600" size={20} />;
            case 'failed':
                return <XCircle className="text-red-600" size={20} />;
            default:
                return <Clock className="text-yellow-600" size={20} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'succeeded':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'failed':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <CreditCard size={36} className="text-blue-600" />
                        Payment History
                    </h1>
                    <p className="text-gray-600 text-lg">View all your course purchases and transactions</p>
                </div>

                {/* Payments List */}
                {payments.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payment History</h3>
                        <p className="text-gray-500">You haven't made any purchases yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment) => (
                            <div
                                key={payment.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        {/* Course Info */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {payment.course?.title || 'Course'}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Payment ID: {payment.paypal_order_id}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(payment.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${parseFloat(payment.amount).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Status Badge */}
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                <span className="font-semibold capitalize text-sm">
                                                    {payment.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Card */}
                {payments.length > 0 && (
                    <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Total Transactions</p>
                                <p className="text-3xl font-bold">{payments.length}</p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Successful Payments</p>
                                <p className="text-3xl font-bold">
                                    {payments.filter(p => p.status === 'succeeded').length}
                                </p>
                            </div>
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Total Spent</p>
                                <p className="text-3xl font-bold">
                                    ${payments.filter(p => p.status === 'succeeded').reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
