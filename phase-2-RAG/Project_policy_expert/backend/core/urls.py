from django.contrib import admin
from django.urls import include, path, re_path

from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


from accounts.views import GoogleLogin, GoogleLoginCallback, LoginPage

urlpatterns = [
    path("admin/", admin.site.urls),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    path("login/", LoginPage.as_view(), name="login"),
    path("api/v1/auth/", include("dj_rest_auth.urls")),


    re_path(r"^api/v1/auth/accounts/", include("allauth.urls")),

    path("api/v1/auth/registration/", include("dj_rest_auth.registration.urls")),


    path("api/v1/auth/google/", GoogleLogin.as_view(), name="google_login"),  # return access and refresh tokens after successful authentication with Google OAuth(verify code and exchange it for tokens)
    path(
        "api/v1/auth/google/callback/",
        GoogleLoginCallback.as_view(),
        name="google_login_callback",
    ),
]