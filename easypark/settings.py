from pathlib import Path
import os
from dotenv import load_dotenv # Assuming you use a library like python-dotenv to load the .env file

# Load environment variables from .env file
load_dotenv() 

BASE_DIR = Path(__file__).resolve().parent.parent

# ----------------------------------------------------
# CRITICAL SECRETS - Loaded from Environment
# ----------------------------------------------------

# This must be loaded from your .env file
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY') 

# Set DEBUG based on environment variable, default to False for security
DEBUG = os.environ.get('DEBUG', 'False') == 'True' 

ALLOWED_HOSTS = []

# ----------------------------------------------------
# APPLICATION DEFINITION
# ----------------------------------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework.authtoken',
    'rest_framework',
    'dj_rest_auth',
    'corsheaders',
    'users',
    'parking',
    'django_celery_beat',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True
AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# ----------------------------------------------------
# THIRD-PARTY SERVICES (SECRETS LOADED FROM ENV)
# ----------------------------------------------------

# Stripe
# The Public Key is generally safe to keep here as it's meant for the frontend
STRIPE_PUBLIC_KEY = 'pk_test_51RFKkTHCLZGaf24la36b7pHrIJM3CPHk03ZmaZCl7dXNMK95BJDEhfLdjIh4vsMKkGeKLtfhENU0DRuoVQ5CcOSu00ql10BLYq'
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')       # <-- SECURED
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET') # <-- SECURED

# Twilio
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')     # <-- SECURED
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')       # <-- SECURED
TWILIO_PHONE_NUMBER = os.environ.get('TWILIO_PHONE_NUMBER')   # <-- SECURED

# Email (Gmail SMTP)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')        # <-- SECURED
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD') # <-- SECURED
DEFAULT_FROM_EMAIL = f"EasyPark <{os.environ.get('EMAIL_USER')}>" # Uses the secured EMAIL_HOST_USER

# Celery
CELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"
ROOT_URLCONF = 'easypark.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'easypark.wsgi.application'

# ----------------------------------------------------
# DATABASE
# ----------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ----------------------------------------------------
# PASSWORD VALIDATION
# ----------------------------------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ----------------------------------------------------
# INTERNATIONALIZATION
# ----------------------------------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ----------------------------------------------------
# STATIC AND MEDIA FILES
# ----------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'  
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'