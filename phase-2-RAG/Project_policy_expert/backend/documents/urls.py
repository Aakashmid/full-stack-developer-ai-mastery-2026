from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DocumentUploadListView , DocumentDestrogyView 

urlpatterns = [
    path("",DocumentUploadListView.as_view(), name="document-upload-list"),
    path("remove/<int:pk>/",DocumentDestrogyView.as_view(), name="document-delete"),
    # path("ingest/<int:pk>/",DocumentDestrogyView.as_view(), name="document-delete"),

]
