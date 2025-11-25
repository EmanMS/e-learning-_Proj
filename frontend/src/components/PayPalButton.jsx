import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../services/api';
import { PAYPAL_CLIENT_ID } from '../config';

/**
 * PayPalButton component renders the PayPal button for a given course.
 * It creates an order via the backend, then captures it when the buyer approves.
 * On successful capture, it calls onSuccess() to let the parent component refresh state.
 */
const PayPalButton = ({ course, onSuccess }) => {
    const createOrder = async () => {
        try {
            const response = await api.post('payments/create-order/', {
                course_id: course.id,
            });
            return response.data.orderID; // PayPal order ID
        } catch (error) {
            console.error('Failed to create PayPal order', error);
            throw error;
        }
    };

    const onApprove = async (data, actions) => {
        try {
            await api.post('payments/capture-order/', {
                orderID: data.orderID,
            });
            // Capture succeeded, notify parent
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to capture PayPal order', error);
        }
    };

    return (
        <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID, currency: 'USD' }}>
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
        </PayPalScriptProvider>
    );
};

export default PayPalButton;
