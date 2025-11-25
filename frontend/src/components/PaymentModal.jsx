import React from 'react';
import PayPalButton from '../components/PayPalButton';
import { X, DollarSign, BookOpen } from 'lucide-react';

const PaymentModal = ({ course, onClose, onSuccess }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full relative shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-2">Complete Your Purchase</h2>
                <p className="text-blue-100">Secure payment powered by PayPal</p>
            </div>

            {/* Course Details */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{course.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Total Amount</span>
                    <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                        <DollarSign size={24} className="text-green-600" />
                        {course.price}
                    </div>
                </div>
            </div>

            {/* Payment Section */}
            <div className="p-6">
                <p className="text-sm text-gray-600 mb-4 text-center">
                    You'll get lifetime access to this course after payment
                </p>
                <PayPalButton course={course} onSuccess={onSuccess} />
            </div>
        </div>
    </div>
);

export default PaymentModal;

