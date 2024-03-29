from django.urls import path, include
from . import views

urlpatterns = [
    path("run-code/", views.run_code),
    path("settings/", views.update_settings)
]
