from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

@api_view(['POST'])
def login_api(request):
    username = request.data.get('email')  # Se usa email como username
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    
    if user is not None:
        return Response({'message': 'Inicio de sesión exitoso', 'user': user.username}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def register_api(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(username=email).exists():
        return Response({'error': 'El usuario ya existe'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=email, email=email, password=password)
    return Response({'message': 'Usuario registrado exitosamente'}, status=status.HTTP_201_CREATED)