from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=255, unique=True , primary_key=True)
    name = models.CharField(max_length=255)

    doc_ids = models.ManyToManyField("documents.Document" , related_name="chat_sessions" )   # context of chat session

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.name} - ({self.sesseion_id})"
    




class ChatQuery(models.Model):
    chat_session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="queries")
    query = models.TextField()
    response = models.TextField()

    source_docs = models.ManyToManyField("documents.Document", related_name="chat_queries")  # source documents for the query

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Query: {self.query[:10]}... | Response: {self.response[:10]}..."