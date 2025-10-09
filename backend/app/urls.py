from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UploadImageView

urlpatterns = [
    path("upload/", UploadImageView.as_view(), name="upload-image"),
]
