from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import StaffUser

@csrf_exempt
@require_http_methods(["POST"])
def staff_login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({'success': False, 'error': 'Email and password required'}, status=400)
        
        # Check credentials against database
        try:
            staff_user = StaffUser.objects.get(email=email)
            if staff_user.check_password(password) and staff_user.is_active:
                return JsonResponse({
                    'success': True,
                    'user': {
                        'id': str(staff_user.id),
                        'name': 'NGO India Staff',
                        'email': staff_user.email,
                        'role': 'staff'
                    }
                })
            else:
                return JsonResponse({'success': False, 'error': 'Invalid credentials'}, status=401)
        except StaffUser.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Invalid credentials'}, status=401)
            
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'error': 'Server error'}, status=500)