
from django.contrib import admin
from django.urls import path , include
from api.views import smart_form_filler ,server_status

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/extract-data/', smart_form_filler ,name="extract-data"),
    path('api/server-status/', server_status, name="server-status"),
]
