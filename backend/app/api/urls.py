from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UploadImageViewSet


post_router = DefaultRouter()
post_router.register(r"outfit_searches", UploadImageViewSet)
