from rest_framework import serializers
from .models import ChatSession,ChatQuery


class QuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatQuery
        fields = "__all__"


class ChatSessionSerializer(serializers.ModelSerializer):
    queries = QuerySerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = "__all__"
        read_only_fields = ("user", "sesseion_id")