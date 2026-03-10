from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import DocumentUploadListView , DocumentDestrogyView , CategoryViewset

router = DefaultRouter()
router.register(r"groups", CategoryViewset, basename="category")

urlpatterns = [
    path("",DocumentUploadListView.as_view(), name="document-upload-list"),
    path("remove/<int:pk>/",DocumentDestrogyView.as_view(), name="document-delete"),
    path("", include(router.urls)),

]
