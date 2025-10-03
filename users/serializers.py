from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from datetime import date

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    date_of_birth = serializers.DateField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'is_special', 'phone_number', 'date_of_birth','plate_number']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_phone_number(self, value):
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError("Phone number already registered.")
        return value

    def validate_date_of_birth(self, value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError("You must be at least 18 years old to register")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_special=validated_data.get('is_special', False),
            phone_number=validated_data['phone_number'],
            date_of_birth=validated_data['date_of_birth'],
            plate_number=validated_data.get('plate_number', ''),
        )

# ✅ Used to return user profile data (includes date_joined)
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'phone_number',
            'date_of_birth',
            'is_special',
            'date_joined',
            'plate_number',
            'is_staff',
            

        ]
        read_only_fields = ['id', 'username', 'email', 'date_joined',]
