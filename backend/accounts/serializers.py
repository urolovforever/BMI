from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    User model uchun serializer
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_email_verified', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_email_verified']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Ro'yxatdan o'tish uchun serializer
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Parollar bir xil emas!"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Foydalanuvchi ma'lumotlarini yangilash uchun
    """
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


class ChangePasswordSerializer(serializers.Serializer):
    """
    Parolni o'zgartirish uchun
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
