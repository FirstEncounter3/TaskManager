from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone

# Create your models here.


class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    responsible = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=(
            ("assigned", "Назначена"),
            ("in_progress", "Выполняется"),
            ("paused", "Приостановлена"),
            ("completed", "Завершена"),
        ),
        default="assigned",
    )
    planned_effort = models.IntegerField(
        default=0,
        help_text='<span style="color: red;">This field is specified upon creation, then calculated automatically and cannot be manually changed later</span>',
    )
    actual_effort = models.IntegerField(default=0, editable=False)
    completed_at = models.DateTimeField(editable=False, null=True, blank=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="subtask",
        help_text='<span style="color: red;">This field is specified upon creation and cannot be manually changed later</span>',
    )

    def parent_actual_effort_recount(self):
        self.actual_effort = self.planned_effort + sum(
            subtask.actual_effort for subtask in self.subtask.all()
        )

    def save(self, *args, **kwargs):
        if not self.id:
            self.actual_effort = self.planned_effort
        super().save(*args, **kwargs)

    def set_time_completed(self):
        self.completed_at = timezone.now()

    def is_valid_status_transition(self, new_status):
        current_status = self.status

        invalid_transitions = {
            ("assigned", "completed"),
            ("assigned", "paused"),
            ("completed", "in_progress"),
            ("completed", "paused"),
            ("completed", "assigned"),
        }

        if (current_status, new_status) in invalid_transitions:
            return False

        return True

    def mark_as_completed(self):
        self.status = "completed"
        self.set_time_completed()
        self.save()

    def __str__(self):
        return self.title


@receiver(post_save, sender=Task)
def signal_parent_actual_effort_recount(sender, instance, **kwargs):
    if instance.parent:
        instance.parent.parent_actual_effort_recount()
        instance.parent.save()

@receiver(post_delete, sender=Task)
def signal_parent_actual_effort_recount_on_delete(sender, instance, **kwargs):
    try:
        if instance.parent:
            instance.parent.parent_actual_effort_recount()
            instance.parent.save()
    except Task.DoesNotExist:
        pass