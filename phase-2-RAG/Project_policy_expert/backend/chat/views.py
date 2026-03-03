from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.generics import  ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status

from .models import ChatSession, ChatQuery
from .serializers import ChatSessionSerializer, QuerySerializer
from rag.llm_response import llm_generate_response



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



        # Create a new ChatQuery instance
        # Initialize serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)


        # if first query in chat - rename the chat 
        if not chat_session.queries.exists():
            chat_session.name = query_text
            chat_session.save()



        

        doc_ids = list(chat_session.doc_ids.values_list("id",flat=True))  # Get associated documents for the chat session

        # if doc_ids is not list of integers or empty list return an error response
        if  not isinstance(doc_ids, list) or not all(isinstance(id, int) for id in doc_ids) or len(doc_ids) == 0:
            print(type(doc_ids), doc_ids)
            return Response({"error": "No documents associated with this chat session."}, status=status.HTTP_400_BAD_REQUEST)


        try: 
            # here llm function to generate response and associate source documents with the chat query
            response = llm_generate_response(query_text, doc_ids)  # Placeholder function to generate response based on query and associated documents\
        except Exception as e:
            return Response({"error": f"Failed to generate response: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                
        answer = response.get("answer", "")
        if not answer or answer.strip() == "" :
            return Response({"error": "Failed to generate response Try again ."}, status=status.HTTP_400_BAD_REQUEST)


        # Save document with extra fields
        serializer.save(
            chat_session=chat_session,
            response_text=answer,
            # source_docs=docs  # will use later 
        )


        return Response(serializer.data, status=status.HTTP_201_CREATED)
    



