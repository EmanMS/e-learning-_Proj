from django.db import models
from django.conf import settings

class Event(models.Model):
    class EventType(models.TextChoices):
        PAGE_VIEW = 'PAGE_VIEW', 'Page View'
        COURSE_PURCHASE = 'COURSE_PURCHASE', 'Course Purchase'
        COURSE_COMPLETION = 'COURSE_COMPLETION', 'Course Completion'
        QUIZ_ATTEMPT = 'QUIZ_ATTEMPT', 'Quiz Attempt'
        ASSIGNMENT_SUBMIT = 'ASSIGNMENT_SUBMIT', 'Assignment Submit'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events')
    event_type = models.CharField(max_length=30, choices=EventType.choices)
    timestamp = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.event_type} at {self.timestamp}"
