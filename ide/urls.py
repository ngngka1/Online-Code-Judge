from django.urls import path, include
from . import views

urlpatterns = [
    path("run-code/", views.runCode),
    path("settings/", views.updateSettings)
]
