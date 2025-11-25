from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from courses.models import Course, Enrollment
from .paypal import create_order, capture_order

from rest_framework import permissions

class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    """Create a PayPal order for a given course.
    Returns the order ID and approval URL which the frontend will use to render the PayPal button.
    """
    def post(self, request):
        course_id = request.data.get('course_id')
        try:
            course = Course.objects.get(id=course_id)
            # Create PayPal order (amount in USD)
            order_data = create_order(amount=course.price, currency='USD')
            # Store pending payment record linked to PayPal order ID
            Payment.objects.create(
                user=request.user,
                course=course,
                amount=course.price,
                paypal_order_id=order_data['order_id'],
                status='pending'
            )
            return Response({
                'orderID': order_data['order_id'],
                'approvalUrl': order_data['approval_url']
            })
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CaptureOrderView(APIView):
    """Capture a PayPal order after the buyer approved it.
    Marks the payment as succeeded and enrolls the user.
    """
    def post(self, request):
        order_id = request.data.get('orderID')
        try:
            capture_result = capture_order(order_id)
            payment = Payment.objects.get(paypal_order_id=order_id)
            payment.status = 'succeeded'
            payment.save()
            # Enroll the user in the course
            Enrollment.objects.get_or_create(student=payment.user, course=payment.course)
            return Response({'status': 'success', 'details': capture_result})
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
