from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Event
from .serializers import EventSerializer
from courses.models import Course, Enrollment

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def instructor_stats(self, request):
        """Get analytics for instructor's courses"""
        if request.user.role != 'INSTRUCTOR':
            return Response({'error': 'Only instructors can access this'}, status=403)

        courses = Course.objects.filter(instructor=request.user)
        
        stats = {
            'total_courses': courses.count(),
            'total_enrollments': Enrollment.objects.filter(course__instructor=request.user).count(),
            'total_revenue': sum(course.price for course in courses) * Enrollment.objects.filter(course__instructor=request.user).count(),
            'courses': []
        }

        for course in courses:
            enrollments = Enrollment.objects.filter(course=course).count()
            stats['courses'].append({
                'id': course.id,
                'title': course.title,
                'enrollments': enrollments,
                'revenue': float(course.price) * enrollments
            })

        return Response(stats)
