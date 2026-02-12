from rest_framework import serializers
from .models import Category, Document


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "file",
            "category",
            "processed",
            "processing_status",
            "uploaded_at",
        ]
        read_only_fields = ["id", "processed", "processing_status", "uploaded_at"]
