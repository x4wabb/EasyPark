import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'easypark.settings')

app = Celery('easypark')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
