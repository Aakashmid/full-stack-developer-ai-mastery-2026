from rest_framework import serializers
from .models import  Document,Category



class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ("uploaded_by", "processed","file_hash","uploaded_at")



class CategorySerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = ("created_by","created_at")


