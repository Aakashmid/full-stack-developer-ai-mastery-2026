from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.generics import  ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status

from .models import ChatSession, ChatQuery
from .serializers import ChatSessionSerializer, QuerySerializer
from ..services.llm_response import llm_generate_response



class ChatSessionViewSet(ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
    permission_classes = [IsAuthenticated]


    def perform_create(self, serializer):
        # Automatically set the user and generate a unique session ID
        import uuid
        session_id = str(uuid.uuid4())
        serializer.save(user=self.request.user, session_id=session_id)


    # def create(self, request, *args, **kwargs):
    #     import uuid
    #     session_id = str(uuid.uuid4())
    #     serializer.save(user=self.request.user, session_id=session_id)

    #     return super().create(request, *args, **kwargs)


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
    

    
    

class QueryListCreateView(ListCreateAPIView):
    serializer_class = QuerySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        session_id = self.kwargs['session_id']
        return ChatQuery.objects.filter(chat_session__session_id=session_id, chat_session__user=self.request.user)
    
    
    def create(self, request, *args, **kwargs):
        query_text = request.data.get('query')
        session_id = self.kwargs['session_id']

        try:
            chat_session = ChatSession.objects.get(session_id=session_id, user=request.user)
        except ChatSession.DoesNotExist:
            return Response({"error": "Chat session not found."}, status=status.HTTP_404_NOT_FOUND)

        # Here we would implement our logic to generate a response based on the query
        # and the context of the chat session (e.g., using the associated documents).
        response_text = f"Response to: {query_text}"  # Placeholder response




        # Create a new ChatQuery instance
        # Initialize serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # if query_text is empty or None, return an error response
        # if query_text is None or query_text.strip() == "":
        #     return Response({"error": "Query text cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)


        # if first query in chat - rename the chat 
        if not chat_session.queries.exists():
            chat_session.name = query_text
            chat_session.save()

        # here llm function to generate response and associate source documents with the chat query
        response_text = llm_generate_re
        sponse(query_text, chat_session.doc_ids.all())  # Placeholder function to generate response based on query and associated documents


        if not response_text:
            return Response({"error": "Failed to generate response."}, status=status.HTTP_400_BAD_REQUEST)
        

        docs = chat_session.doc_ids.all()  # Get associated documents for the chat session

        # Save document with extra fields
        serializer.save(
            chat_session=chat_session,
            response=response_text,
            source_docs=docs
        )


        # if response_text is empty or generation failed  return an error response

        # if response_text is generated successfully, we can associate source documents with the chat query
        # For example, if we have a list of document IDs that were used to generate the response, we can associate them with the chat query like this:


        return Response(serializer.data, status=status.HTTP_201_CREATED)
    



