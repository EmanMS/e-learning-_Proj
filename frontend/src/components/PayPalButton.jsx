import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../services/api';
import { PAYPAL_CLIENT_ID } from '../config';

const PayPalButton = ({ course, onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createOrder = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('payments/create-order/', {
                course_id: course.id,
            });

            setLoading(false);
            return response.data.orderID;
        } catch (error) {
            console.error('Failed to create PayPal order', error);
            setLoading(false);
            const errorMsg = error.response?.data?.error || error.message || 'Failed to create payment order';
            setError(errorMsg);
            if (onError) onError(errorMsg);
            throw error;
        }
    };

    const onApprove = async (data, actions) => {
        try {
            setLoading(true);
            setError(null);
            await api.post('payments/capture-order/', {
                orderID: data.orderID,
            });
            setLoading(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to capture PayPal order', error);
            setLoading(false);
            const errorMsg = error.response?.data?.error || 'Payment capture failed';
            setError(errorMsg);
            if (onError) onError(errorMsg);
        }
    };

    const onCancel = () => {
        setError('Payment was cancelled');
        if (onError) onError('Payment was cancelled');
    };

    const onErrorHandler = (err) => {
        console.error('PayPal error:', err);
        const errorMsg = 'Payment processing error occurred';
        setError(errorMsg);
        if (onError) onError(errorMsg);
    };

    return (
        <div className="w-full">
            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Processing payment...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID, currency: 'USD' }}>
                <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onCancel={onCancel}
                    onError={onErrorHandler}
                    style={{ layout: 'vertical' }}
                />
            </PayPalScriptProvider>
        </div>
    );
};

export default PayPalButton;
