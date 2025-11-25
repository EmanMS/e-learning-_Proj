from .models import Event

class AnalyticsMiddleware:
    """Middleware to track page views and user actions"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Track page views for authenticated users
        if request.user.is_authenticated and request.method == 'GET':
            # Only track API calls, not static files
            if request.path.startswith('/api/'):
                try:
                    Event.objects.create(
                        user=request.user,
                        event_type='PAGE_VIEW',
                        metadata={'path': request.path, 'method': request.method}
                    )
                except Exception:
                    # Silently fail if event creation fails
                    pass
        
        return response
