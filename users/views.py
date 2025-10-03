from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserProfileSerializer
import random
import re
from .utils.sms import send_sms
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

# ✅ Handles user registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            try:
                code = random.randint(100000, 999999)
                message = f"✅ EasyPark: Registration successful! Your code is {code}"
                send_sms(user.phone_number, message)
            except Exception as e:
                print(f"SMS failed: {e}")

            return Response(RegisterSerializer(user).data, status=status.HTTP_201_CREATED)

        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Handles login
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# ✅ Authenticated user profile view (GET + PUT for plate_number)
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        plate_number = request.data.get("plate_number")
        if plate_number is not None:
            request.user.plate_number = plate_number
            request.user.save()
            return Response({"message": "Plate number updated successfully"})
        return Response({"detail": "Plate number is required"}, status=400)

# ✅ Account update views
class UpdateUsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        new_username = request.data.get("username")
        if not new_username:
            return Response({"detail": "Username is required"}, status=400)
        if User.objects.filter(username=new_username).exists():
            return Response({"detail": "Username already taken"}, status=400)
        request.user.username = new_username
        request.user.save()
        return Response({"message": "Username updated successfully"})

class UpdateNameView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        full_name = request.data.get("full_name")
        if not full_name:
            return Response({"detail": "Full name is required"}, status=400)
        request.user.full_name = full_name
        request.user.save()
        return Response({"message": "Full name updated successfully"})

class UpdateEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        new_email = request.data.get("email")
        if not new_email:
            return Response({"detail": "Email is required"}, status=400)
        if User.objects.filter(email=new_email).exists():
            return Response({"detail": "Email already taken"}, status=400)
        request.user.email = new_email
        request.user.save()
        return Response({"message": "Email updated successfully"})

class UpdatePhoneView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response({"detail": "Phone number is required"}, status=400)
        if not re.fullmatch(r"\+?[0-9]{8,15}", phone):
            return Response({"detail": "Invalid phone number format"}, status=400)
        request.user.phone_number = phone
        request.user.save()
        return Response({"message": "Phone number updated successfully"})

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not request.user.check_password(old_password):
            return Response({"detail": "Incorrect current password"}, status=400)

        request.user.set_password(new_password)
        request.user.save()
        return Response({"message": "Password updated successfully"})
