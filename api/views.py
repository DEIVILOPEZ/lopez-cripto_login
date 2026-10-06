import jwt  # O lee el token plano si estás haciendo pruebas rápidas
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

@api_view(['POST'])
def google_login(request):
    token = request.data.get('token')
    
    # Decodifica el token enviado por el navegador de Google
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        email = decoded.get('email', 'usuario_google@gmail.com')
    except Exception:
        email = "usuario_google@gmail.com"

    # Crea o recupera el usuario en Django
    user, _ = User.objects.get_or_create(username=email, defaults={'email': email})

    return Response({
        "message": "Login exitoso",
        "email": user.email,
        "id": user.id
    }, status=200)