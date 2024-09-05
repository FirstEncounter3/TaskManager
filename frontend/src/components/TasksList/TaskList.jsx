import React, { useState, useEffect } from "react";

import { getTasks, getTask } from "../../api/api";

import TaskInfo from "../TaskInfo/TaskInfo";

import "./TaskList.css";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [warningMessage, setWarningMessage] = useState("");
    const [taskInfo, setTaskInfo] = useState(null);

    const taskPrepare = (tasks) => {
        tasks.map((task) => {
            if (!task.parent) {
                task.level = 0;
            } else {
                const parentTask = tasks.find((t) => t.id === task.parent);
                if (parentTask) {
                    task.level = parentTask.level + 1;
                } else {
                    task.level = 0;
                }
            }
            return task;
        });

        return tasks;
    };

    useEffect(() => {
        getTasks()
            .then((data) => {
                setTasks(taskPrepare(data));
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setWarningMessage(
                    `API is not available. Check the api status. Error: ${error.message}`
                );
                setIsLoading(false);
            });
    }, []);

    const getTaskInfo = (id) => {
        getTask(id)
            .then((data) => {
                setTaskInfo(data);
            })
            .catch((error) => {
                console.log(error);
                setWarningMessage(
                    `API is not available. Check the api status. Error: ${error.message}`
                );
                setIsLoading(false);
            });
    };

    return (
        <>  
            <div className="task-list-container">
                <div className="task-list">
                    {isLoading && <p>Loading...</p>}
                    {tasks.map((task) => (
                        <p key={task.id} style={{ marginLeft: `${task.level * 20}px`, display: task.displayDefault }}>
                            <button onClick={() => getTaskInfo(task.id)}>{task.title}</button>
                        </p>
                    ))}
                </div>
                <div className="task-info">
                    { taskInfo && <TaskInfo taskInfo={taskInfo} /> }
                </div>
            </div>
        </>
  );
};

export default TaskList;
