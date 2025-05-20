from django.http import JsonResponse

def status_page(request):
    return JsonResponse({
        "project": "NICU Backend Server",
        "status": "running",
        "version": "1.0.0",
        "api_docs": "/api/",
        "admin": "/admin/",
        "message": "Welcome to the NICU Backend API. Visit /api/ for API endpoints or /admin/ for admin panel."
    })