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


        # here llm function to generate response and associate source documents with the chat query
        response = llm_generate_response(query_text, doc_ids)  # Placeholder function to generate response based on query and associated documents\
        answer = response.get("answer", "")
        if not answer or answer.strip() == "" :
            return Response({"error": "Failed to generate response."}, status=status.HTTP_400_BAD_REQUEST)

        # Save document with extra fields
        serializer.save(
            chat_session=chat_session,
            response_text=answer,
            # source_docs=docs  # will use later 
        )


        # if response_text is empty or generation failed  return an error response

        # if response_text is generated successfully, we can associate source documents with the chat query
        # For example, if we have a list of document IDs that were used to generate the response, we can associate them with the chat query like this:


        return Response(serializer.data, status=status.HTTP_201_CREATED)
    



