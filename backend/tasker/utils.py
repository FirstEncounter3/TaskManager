def all_subtasks_are_valid(task, new_status):
    for subtask in task.subtask.all():
        if not subtask.is_valid_status_transition(new_status):
            return False
        if not all_subtasks_are_valid(subtask, new_status):
             return False
    return True

def mark_all_subtasks_as_completed(task):
    for subtask in task.subtask.all():
        subtask.mark_as_completed()
        mark_all_subtasks_as_completed(subtask)