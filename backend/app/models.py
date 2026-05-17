from django.db import models


class OutfitSearch(models.Model):
    image = models.ImageField(upload_to="uploads/")
    gender = models.CharField(max_length=50, blank=True, null=True)
    outfit_type = models.CharField(max_length=100, blank=True, null=True)
    refined_label = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=100, blank=True, null=True)
    fit = models.CharField(max_length=100, blank=True, null=True)
    style_summary = models.TextField(blank=True, null=True)
    results = models.JSONField(blank=True, null=True)
    clerk_user_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.style_summary or f"OutfitSearch {self.id}"
