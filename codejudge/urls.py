from django.urls import path, include
from . import views

urlpatterns = [
    path("run-code/", views.run_code),
    path("submit-code/", views.submit_code),
    path("settings/", views.update_settings),
    path("create-problem/", views.create_problem),
    path("get-problem/<str:problem_title>", views.get_problem),
    path("update-problem/<str:problem_title>", views.update_problem),
    path("get-problems-list/", views.get_problem_list),
]
