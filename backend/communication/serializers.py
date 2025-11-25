from rest_framework import serializers
from .models import Discussion, Notification
from users.serializers import UserSerializer

class DiscussionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Discussion
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

    def get_replies(self, obj):
        if obj.parent is None:
            return DiscussionSerializer(obj.replies.all(), many=True).data
        return []

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
