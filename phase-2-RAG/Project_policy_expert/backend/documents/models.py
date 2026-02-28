from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator

User = get_user_model()


# not using still
# class Category(models.Model):
#     created_by = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="categories"
#     )
#     name = models.CharField(max_length=100)

#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ("user", "name")
#         ordering = ["-created_at"]

#     def __str__(self):
#         return f"{self.name} -  ({self.user.email})"


class Document(models.Model):
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    # category = models.ForeignKey(
    #     Category,
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True,

    #     related_name="documents"
    # )

    # title = models.CharField(max_length=255)  # optional, can be extracted from file name or content

    file = models.FileField(
        upload_to="documents/",
        validators=[FileExtensionValidator(allowed_extensions=["pdf"])]
    )
    file_hash = models.CharField(max_length=64, unique=True)
    processed = models.BooleanField(default=False)

   
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.file.name} "
