# Generated by Django 5.1 on 2024-08-30 06:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasker', '0002_alter_task_actual_effort_alter_task_completed_at_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='planned_effort',
            field=models.IntegerField(default=0, help_text='<span style="color: red;">Это поле заполняется автоматически и не может быть изменено вручную.</span>'),
        ),
    ]
