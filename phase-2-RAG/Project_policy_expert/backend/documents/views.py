from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Category, Document
from .serializers import CategorySerializer, DocumentSerializer
from rest_framework.viewsets import ModelViewSet


# ------------------------
# CATEGORY VIEWS
# ------------------------

class CategoryViewset(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CategorySerializer

    


# ------------------------
# DOCUMENT VIEWS
# ------------------------

class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Document.objects.filter(user=self.request.user)

        category_id = self.request.query_params.get("category")

        if category_id:
            queryset = queryset.filter(category_id=category_id)

        return queryset
