from rest_framework import serializers
from .models import ChatSession,ChatQuery
from documents.models import Document


class QuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatQuery
        fields = "__all__"
        # read_only_fields = ("chat_session", "response","source_docs")
        read_only_fields = ("chat_session", "response")


class ChatSessionSerializer(serializers.ModelSerializer):
    # queries = QuerySerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = "__all__"
        read_only_fields = ("user", "session_id")

    
    # validate whether doc_ids exist in documents table or not before creating chat session
    # def validate(self, data):
    #     doc_ids = data.get('doc_ids', [])
    #     if not Document.objects.filter(id__in=doc_ids).count() == len(doc_ids):
    #         raise serializers.ValidationError("One or more document IDs do not exist.")
    #     return data