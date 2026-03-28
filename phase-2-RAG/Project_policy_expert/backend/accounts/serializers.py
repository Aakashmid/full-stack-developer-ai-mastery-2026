# backend/accounts/serializers.py
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.utils.translation import gettext_lazy as _

class CustomLoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        request = self.context.get("request")
        username_or_email = attrs.get("username_or_email")
        password = attrs.get("password")
        if not username_or_email or not password:
            raise serializers.ValidationError(_("Must include 'username_or_email' and 'password'."))

        User = get_user_model()
        user_qs = User.objects.filter(email__iexact=username_or_email)
        if user_qs.exists():
            username = user_qs.first().get_username()
        else:
            username = username_or_email

        user = authenticate(request=request,username = username, password=password)
        if not user:
            raise serializers.ValidationError(_("Unable to log in with provided credentials."))

        attrs["user"] = user
        return attrs


# auth/serializers.py


class CustomRegisterSerializer(RegisterSerializer):
    password = serializers.CharField(write_only=True)
    password1 = None
    password2 = None
    

    def validate(self, data):
        # inject password into expected fields
        data['password1'] = data.get('password')
        data['password2'] = data.get('password')
        return data

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['password1'] = self.validated_data.get('password')
        data['password2'] = self.validated_data.get('password')
        return data
