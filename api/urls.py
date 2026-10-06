from django.urls import path
from . import views

urlpatterns = [
    # RUTA DE AUTENTICACIÓN
    path('auth/', views.auth_user, name='auth_user'),
    
    # RUTA DE GOOGLE LOGIN
    path('google-login/', views.google_login, name='google_login'),
]