from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status as http_status
from .models import Quiz, Question, Assignment, Submission, QuizAttempt
from .serializers import QuizSerializer, QuestionSerializer, AssignmentSerializer, SubmissionSerializer, QuizAttemptSerializer
from courses.views import IsInstructorOrReadOnly

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsInstructorOrReadOnly]

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsInstructorOrReadOnly]

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsInstructorOrReadOnly]

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'INSTRUCTOR':
            return Submission.objects.all()
        return Submission.objects.filter(user=user)

class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        quiz = serializer.validated_data['quiz']
        answers = serializer.validated_data['answers']
        
        # Calculate score
        questions = quiz.questions.all()
        correct_count = 0
        
        for question in questions:
            question_id = str(question.id)
            if question_id in answers:
                if int(answers[question_id]) == question.correct_answer:
                    correct_count += 1
        
        score = (correct_count / len(questions) * 100) if questions else 0
        serializer.save(user=self.request.user, score=score)
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'INSTRUCTOR':
            return QuizAttempt.objects.all()
        return QuizAttempt.objects.filter(user=user)
