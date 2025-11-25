from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Progress
from .serializers import ProgressSerializer

class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Progress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_complete(self, request):
        content_id = request.data.get('content_id')
        if not content_id:
            return Response({'error': 'content_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        progress, created = Progress.objects.get_or_create(user=request.user, content_id=content_id)
        progress.is_completed = True
        progress.save()
        return Response({'status': 'marked as complete'}, status=status.HTTP_200_OK)
