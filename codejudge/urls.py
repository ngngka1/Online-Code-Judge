from django.urls import path, include
from . import views

urlpatterns = [
    path("run-code/", views.run_code),
    path("submit-code/", views.submit_code),
    path("settings/", views.update_settings),
    path("create-problem/", views.create_problem),
    path("get-problem/<problem_title:str>", views.get_problem),
    path("update-problem/<problem_title:str>", views.update_problem),
    path("get-problems-list", views.get_problem_list),
]
