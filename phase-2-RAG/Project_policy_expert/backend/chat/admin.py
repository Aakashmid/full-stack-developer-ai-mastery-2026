from django.contrib import admin
from .models import ChatQuery,ChatSession
# Register your models here.

admin.site.register([ChatQuery, ChatSession])