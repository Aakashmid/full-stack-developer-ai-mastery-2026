# chat/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import  ChatSessionViewSet  , QueryListCreateView

# Base router for chats
router = routers.DefaultRouter()
router.register(r'', ChatSessionViewSet, basename='chat-session')


urlpatterns = [
    path('chats', include(router.urls)),     
    path('chats/<string:session_id>/queries/',QueryListCreateView.as_view(),name='chat-session-queries' ),     

]