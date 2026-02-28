from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status

from .models import ChatSession, ChatQuery
from .serializers import ChatSessionSerializer, QuerySerializer



class ChatSessionViewSet(ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the user and generate a unique session ID
        import uuid
        session_id = str(uuid.uuid4())
        serializer.save(user=self.request.user, session_id=session_id)


    def get_queryset(self):
        # Return only chat sessions belonging to the authenticated user
        return ChatSession.objects.filter(user=self.request.user)


    @action(detail=True, methods=['post'], url_path='ask')
    def ask(self, request, pk=None):
        chat_session = self.get_object()
        query_text = request.data.get('query')

        # Here we would implement our logic to generate a response based on the query
        # and the context of the chat session (e.g., using the associated documents).
        response_text = f"Response to: {query_text}"  # Placeholder response

        # Create a new ChatQuery instance
        chat_query = ChatQuery.objects.create(chat_session=chat_session, query=query_text, response=response_text)

        # Serialize and return the response
        serializer = QuerySerializer(chat_query)
        return Response(serializer.data)
    

    
    

class QueryListView(ListAPIView):
    serializer_class = QuerySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        session_id = self.kwargs['session_id']
        return ChatQuery.objects.filter(chat_session__session_id=session_id, chat_session__user=self.request.user)



