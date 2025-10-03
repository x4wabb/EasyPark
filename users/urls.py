from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    LoginView,
    UpdateNameView,
    UpdateEmailView,
    UpdatePhoneView,
    ChangePasswordView,
    UpdateUsernameView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='custom_login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ✅ Authenticated user profile
    path('profile/', ProfileView.as_view(), name='user-profile'),

    # ✅ Update endpoints
    path('update-name/', UpdateNameView.as_view(), name='update_name'),
    path('update-username/', UpdateUsernameView.as_view(), name='update_username'),
    path('update-email/', UpdateEmailView.as_view(), name='update_email'),
    path('update-phone/', UpdatePhoneView.as_view(), name='update_phone'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
