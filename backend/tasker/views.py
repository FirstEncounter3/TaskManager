from django.core.exceptions import ValidationError
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from .serializers import TaskSerializer

from .models import Task

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
                fields = ['title', 'description', 'responsible', 'status']
        return UpdateTaskSerializer

    def perform_update(self, serializer):
        if self.get_object().pk:
            serializer.validated_data.pop('planned_effort', None)
            serializer.errors['planned_effort'] = 'This field cannot be modified after creation'

        task = self.get_object()
        current_status = self.get_object().status
        new_status = serializer.validated_data.get('status')

        if current_status == 'in_progress' and new_status == 'completed':
            task.mark_as_completed()
        elif current_status == 'assigned' and new_status == 'in_progress':
            pass  # Разрешаем изменение статуса на "В процессе"
        elif current_status == 'in_progress' and new_status == 'paused':
            pass  # Разрешаем изменение статуса на "Приостановлено"
        else:
            serializer.errors['status'] = 'Invalid status transition'
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer.save()
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            



class TaskDelete(generics.DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class TaskCreate(generics.CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer