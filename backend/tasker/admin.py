from django.contrib import admin

from .models import Task

# Register your models here.

class TaskAdmin(admin.ModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        if obj is not None:
            return ('planned_effort', 'parent')
        else:
            return ()

admin.site.register(Task, TaskAdmin)