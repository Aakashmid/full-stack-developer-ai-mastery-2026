# chat/urls.py
from django.urls import path, include
from rest_framework import routers
from .views import  ChatSessionViewSet  , QueryListView

# Base router for chats
router = routers.DefaultRouter()
router.register(r'', ChatSessionViewSet, basename='chat-session')


urlpatterns = [
    path('', include(router.urls)),     
    path('<str:session_id>/queries/',QueryListView.as_view(),name='chat-session-queries' ),     
]