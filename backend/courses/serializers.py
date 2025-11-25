from rest_framework import serializers
from .models import Course, Module, Content, Enrollment
from users.serializers import UserSerializer
from assessments.serializers import QuizSerializer, AssignmentSerializer

class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    contents = ContentSerializer(many=True, read_only=True)
    quiz = QuizSerializer(read_only=True)
    assignment = AssignmentSerializer(read_only=True)

    class Meta:
        model = Module
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    instructor = UserSerializer(read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(student=request.user, course=obj).exists()
        return False

    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Simple progress calculation: completed contents / total contents
            # This is a bit expensive for a list view, but okay for MVP
            from progress.models import Progress
            total_content = 0
            for module in obj.modules.all():
                total_content += module.contents.count()
            
            if total_content == 0:
                return 0
            
            completed_content = Progress.objects.filter(user=request.user, content__module__course=obj, is_completed=True).count()
            return (completed_content / total_content) * 100
        return 0

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'
        read_only_fields = ('student', 'enrolled_at')
