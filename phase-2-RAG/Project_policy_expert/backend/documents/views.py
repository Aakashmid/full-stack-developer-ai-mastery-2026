from rest_framework import generics, permissions,status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import  Document
import hashlib
from .serializers import DocumentSerializer
from .services.ingest import ingest_document



# ------------------------
# CATEGORY VIEWS
# ------------------------
# optional ( no  including yet in app)
# class CategoryViewset(ModelViewSet):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = CategorySerializer
    


# ------------------------
# DOCUMENT VIEWS
# ------------------------

class DocumentUploadListView(generics.ListCreateAPIView):
    '''Handles document upload and listing for authenticated users'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentSerializer

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user)
    

    def create(self, request, *args, **kwargs):
        uploaded_file = request.FILES['file']

        # Compute SHA-256 hash
        sha256 = hashlib.sha256()
        for chunk in uploaded_file.chunks():
            sha256.update(chunk)
        file_hash = sha256.hexdigest()

        # Check for duplicate
        if Document.objects.filter(file_hash=file_hash).exists():
            return Response(
                {"error": "This file has already been uploaded."},
                status=status.HTTP_400_BAD_REQUEST
            )

       
        # Initialize serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save document with extra fields
        document = serializer.save(
            uploaded_by=self.request.user,
            file_hash=file_hash
        )


        # ingest into chroma immediately after upload
        ingest_document(document)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class DocumentDestrogyView(generics.DestroyAPIView):
    '''Handles document deletion'''
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user)
    
# class DocumentIngestView(generics.GenericAPIView):
#     '''Endpoint to trigger ingest for a document'''
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = DocumentSerializer
#     queryset = Document.objects.all()

#     def post(self, request, pk):
#         document = self.get_object()
#         ingest_document(document)


#         return Response(, status=status.HTTP_200_OK)