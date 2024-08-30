from django.urls import path

from .views import (
    TaskList, 
    TaskDetail, 
    TaskUpdate, 
    TaskDelete,
    TaskCreate,
)

urlpatterns = [
    path("", TaskList.as_view(), name="task-list"),
    path("create/", TaskCreate.as_view(), name="task-create"),
    path("<int:pk>/", TaskDetail.as_view(), name="task-detail"),
    path("<int:pk>/update/", TaskUpdate.as_view(), name="task-update"),
    path("<int:pk>/delete/", TaskDelete.as_view(), name="task-delete"),
]