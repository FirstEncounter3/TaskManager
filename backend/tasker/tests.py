from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from .models import Task

# Create your tests here.


class TaskModelTest(TestCase):

    def setUp(self) -> None:
        self.client = APIClient()
        self.parent_task = Task.objects.create(
            title="Parent task",
            description="Parent task description",
            responsible="Username1",
            planned_effort=1,
        )

        self.subtask = Task.objects.create(
            title="Subtask for parent task",
            description="Subtask description",
            responsible="Username1",
            planned_effort=1,
            parent=self.parent_task,
        )

        self.subtask_for_subtask = Task.objects.create(
            title="Subtask for subtask",
            description="Subtask for subtask description",
            responsible="Username1",
            planned_effort=1,
            parent=self.subtask,
        )

    def test_parent_task_creation(self):
        self.assertEqual(self.parent_task.title, "Parent task")
        self.assertEqual(self.parent_task.description, "Parent task description")
        self.assertEqual(self.parent_task.responsible, "Username1")
        self.assertEqual(self.parent_task.planned_effort, 1)
        self.assertEqual(self.parent_task.status, "assigned")
        self.assertEqual(self.parent_task.parent, None)
        self.assertEqual(self.parent_task.completed_at, None)
        self.assertEqual(self.parent_task.actual_effort, 3)

    def test_subtask_creation(self):
        self.assertEqual(self.subtask.title, "Subtask for parent task")
        self.assertEqual(self.subtask.description, "Subtask description")
        self.assertEqual(self.subtask.responsible, "Username1")
        self.assertEqual(self.subtask.planned_effort, 1)
        self.assertEqual(self.subtask.status, "assigned")
        self.assertEqual(self.subtask.parent, self.parent_task)
        self.assertEqual(self.subtask.completed_at, None)
        self.assertEqual(self.subtask.actual_effort, 2)

    def test_subtask_for_subtask_creation(self):
        self.assertEqual(self.subtask_for_subtask.title, "Subtask for subtask")
        self.assertEqual(
            self.subtask_for_subtask.description, "Subtask for subtask description"
        )
        self.assertEqual(self.subtask_for_subtask.responsible, "Username1")
        self.assertEqual(self.subtask_for_subtask.planned_effort, 1)
        self.assertEqual(self.subtask_for_subtask.status, "assigned")
        self.assertEqual(self.subtask_for_subtask.parent, self.subtask)
        self.assertEqual(self.subtask_for_subtask.completed_at, None)
        self.assertEqual(self.subtask_for_subtask.actual_effort, 1)

    def test_api_parent_task_cannot_be_completed_if_status_is_not_in_progress(self):
        self.client.defaults['HTTP_ACCEPT'] = 'application/json'

        print('Test case: parent task cannot be completed if child is not in progress, assert 400')

        response = self.client.patch(
           f'/{self.parent_task.id}/update/', {"status": "completed"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            "Invalid status transition. Main task must be 'in_progress' before can be completed or paused.",
            response.data["error"],
        )

    def test_api_parent_task_cannot_be_completed_if_child_is_not_in_progress_but_parent_is(self):
        self.client.defaults['HTTP_ACCEPT'] = 'application/json'

        print("Test case: parent_task in progress, but childs not, assert 400")

        self.parent_task.status = "in_progress"
        self.parent_task.save()

        response = self.client.patch(
           f'/{self.parent_task.id}/update/', {"status": "completed"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            "Invalid status transition. All subtasks must be 'in_progress' before can be completed or paused.",
            response.data["error"],
        )

    def test_api_parent_task_can_be_completed_if_conditions_are_met(self):
        self.client.defaults['HTTP_ACCEPT'] = 'application/json'

        print('Test case: parent task can be completed if conditions are met, assert 200')

        self.parent_task.status = "in_progress"
        self.parent_task.save()

        self.subtask.status = "in_progress"
        self.subtask.save()

        self.subtask_for_subtask.status = "in_progress"
        self.subtask_for_subtask.save()

        response = self.client.patch(
            f'/{self.parent_task.id}/update/', {"status": "completed"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "completed")

    
    def test_api_parent_task_cannot_be_paused_if_status_is_not_in_progress(self):
        self.client.defaults['HTTP_ACCEPT'] = 'application/json'

        print('Test case: parent task cannot be paused if status is not in progress, assert 400')

        response = self.client.patch(
           f'/{self.parent_task.id}/update/', {"status": "paused"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn(
            "Invalid status transition. Main task must be 'in_progress' before can be completed or paused.",
            response.data["error"],
        )

    def test_api_paernt_task_can_be_paused_if_childs_is_not_in_progress(self):
        self.client.defaults['HTTP_ACCEPT'] = 'application/json'

        print('Test case: parent task can be paused if child is not in progress, assert 200')

        self.parent_task.status = "in_progress"
        self.parent_task.save()

        response = self.client.patch(
           f'/{self.parent_task.id}/update/', {"status": "paused"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "completed")
