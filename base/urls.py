from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("ide/", include("ide.urls")),
    path("codejudge/", include("codejudge.urls")),
    path("auth/", include("usersAuth.urls"))
]
