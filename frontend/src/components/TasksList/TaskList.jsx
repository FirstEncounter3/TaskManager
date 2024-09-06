import React, { useState, useEffect } from "react";

import { getTasks, getTask } from "../../api/api";

import TaskInfo from "../TaskInfo/TaskInfo";
import ModalCreate from "../ModalCreate/ModalCreate";

import "./TaskList.css";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [warningMessage, setWarningMessage] = useState("");
    const [taskInfo, setTaskInfo] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [parentList, setParentList] = useState([]);

    const taskPrepare = (tasks) => {
        const parentObj = {}
        tasks.map((task) => {
            if (!task.parent) {
                task.level = 0;
            } else {
                const parentTask = tasks.find((t) => t.id === task.parent);
                if (parentTask) {
                    task.level = parentTask.level + 1;
                    parentObj[parentTask.id] = parentTask.title
                } else {
                    task.level = 0;
                }
            }
            return task;
        });

        setParentList(parentObj)
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

    const modalOpen = () => {
        setModalShow(true)
    };

    const modalClose = () => {
        setModalShow(false)
    };

    return (
        <>  
            <div className="task-list-container">
                <div className="task-list">
                    {isLoading && <p>Loading...</p>}
                    {tasks.map((task) => (
                        <p key={task.id} style={{ marginLeft: `${task.level * 20}px`, display: task.displayDefault }}>
                            <button className="task" onClick={() => getTaskInfo(task.id)}>{task.title}</button>
                        </p>
                    ))}
                </div>
                <div className="task-info">
                    <div className="right"><button className="task-button" onClick={() => modalOpen()}>Создать</button></div>
                    { taskInfo && <TaskInfo taskInfo={taskInfo} /> }
                </div>
            </div>
            <ModalCreate show={modalShow} onClose={modalClose} parent={parentList}/>
        </>
  );
};

export default TaskList;
