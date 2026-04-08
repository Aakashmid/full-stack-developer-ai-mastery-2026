from rest_framework import generics, permissions,status , serializers
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from drf_spectacular.utils import extend_schema

from .models import  Document , Category
import hashlib
from .serializers import DocumentSerializer , CategorySerializer
from rag.ingest import ingest_document



# ------------------------
# CATEGORY VIEWS
# ------------------------
class CategoryViewset(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CategorySerializer
    


# ------------------------
# DOCUMENT VIEWS
# ------------------------


# custom serializer to show categorized and uncategorized documents in the same response for the GET /documents/ endpoint
class DocumentOverviewSerializer(serializers.Serializer):
    categories = CategorySerializer(many=True)
    uncategorized = DocumentSerializer(many=True)




class DocumentUploadListView(generics.ListCreateAPIView):
    '''Handles document upload and listing for authenticated users'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentSerializer

    # def get_queryset(self):
    #     return Document.objects.filter(uploaded_by=self.request.user,category=None)
    
    @extend_schema(responses=DocumentOverviewSerializer)
    def get(self, request, *args, **kwargs):
        categories = Category.objects.filter(created_by=request.user)
        categorized_docs = CategorySerializer(categories, many=True).data   

        # get uncategorized documents (those without a category)
        docs = Document.objects.filter(uploaded_by=request.user, category=None)
        uncategorized_docs = DocumentSerializer(docs, many=True).data


        return Response({
            "categorized": categorized_docs,
            "uncategorized": uncategorized_docs
        })



    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)


        uploaded_file = request.data.get('file')
        # Compute SHA-256 hash
        sha256 = hashlib.sha256()
        for chunk in uploaded_file.chunks():
            sha256.update(chunk)
        file_hash = sha256.hexdigest()


        # Check for duplicate file existence based on hash
        if Document.objects.filter(uploaded_by=request.user, file_hash=file_hash).exists():
            return Response(
                {"error": "This file has already been uploaded."},
                status=status.HTTP_400_BAD_REQUEST
            )

       

        document = serializer.save(
            uploaded_by=self.request.user,
            file_hash=file_hash
        )

        # ingest into chroma immediately after upload
        try :
            ingest_document(document)
        except Exception as e:
            document.delete()
            return Response({"error": f"Failed to save document: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        return Response(self.get_serializer(document).data, status=status.HTTP_201_CREATED)


class DocumentUpdateView(generics.UpdateAPIView):
    '''Handles document update (e.g. categorization)'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user)

class DocumentDestrogyView(generics.DestroyAPIView):
    '''Handles document deletion'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user)
    