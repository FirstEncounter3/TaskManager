from django.core.exceptions import ValidationError
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from .serializers import TaskSerializer

from .models import Task

from .utils import all_subtasks_are_valid,  mark_all_subtasks_as_completed

# Create your views here.


class TaskList(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskDetail(generics.RetrieveAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskUpdate(generics.RetrieveUpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_serializer_class(self):
        class UpdateTaskSerializer(TaskSerializer):
            class Meta(TaskSerializer.Meta):
                fields = [
                    "title",
                    "description",
                    "responsible",
                    "status",
                    "completed_at",
                ]

        return UpdateTaskSerializer

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        new_status = request.data.get("status")

        if new_status:
            if not task.is_valid_status_transition(new_status):
                return Response(
                    {"error": "Invalid status transition. Main task must be 'in_progress' before can be completed or paused."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if task.status == "in_progress" and new_status == "completed":
                if not all_subtasks_are_valid(task, new_status):
                    return Response(
                        {
                            "error": "Invalid status transition. All subtasks must be 'in_progress' before can be completed or paused."
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                )

            if (task.status == "in_progress" or task.status == "paused") and new_status == "completed":
                task.mark_as_completed()
                mark_all_subtasks_as_completed(task)
                return Response(
                    self.get_serializer(task).data, status=status.HTTP_200_OK
                )
            
        for attr, value in request.data.items():
            if hasattr(task, attr):
                if attr == "parent":
                    if value == '':
                        setattr(task, attr, None)
                    else:
                        try:
                            parent_task = Task.objects.get(id=value)
                            setattr(task, attr, parent_task)
                        except Task.DoesNotExist:
                            return Response(
                                {"error": "Parent task does not exist."},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                else:
                    setattr(task, attr, value)
        task.status = new_status
        task.save()
        return Response(self.get_serializer(task).data, status=status.HTTP_200_OK)


class TaskDelete(generics.DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskCreate(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_serializer_class(self):
        class CreateTaskSerializer(TaskSerializer):
            class Meta(TaskSerializer.Meta):
                fields = [
                    "title",
                    "description",
                    "responsible",
                    "planned_effort",
                    "parent",
                ]

        return CreateTaskSerializer
