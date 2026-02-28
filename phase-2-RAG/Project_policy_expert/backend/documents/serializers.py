from rest_framework import serializers
from .models import  Document


# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = "__all__"
#         read_only_fields = ("created_by",)


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ("uploaded_by", "processed","file_hash")


