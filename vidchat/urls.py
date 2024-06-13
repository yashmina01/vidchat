from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('base.urls')),      #this will trigger my base app urls.py file
]
