from django.contrib import admin
from django.urls import path
from mi_app.views import login_api, register_api

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login_api, name='api_login'),
    path('api/register/', register_api, name='api_register'),
]