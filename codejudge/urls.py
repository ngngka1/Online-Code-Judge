from django.urls import path, include
from . import views

urlpatterns = [
    path("run-code/", views.runCode),
    path("submit-code/", views.submitCode),
    path("settings/", views.updateSettings),
    path("create-problem/", views.createProblem),
    path("get-problem/<str:problem_title>", views.getProblem),
    path("update-problem/<str:problem_title>", views.updateProblem),
    path("get-problems-list/", views.getProblemsList),
]
