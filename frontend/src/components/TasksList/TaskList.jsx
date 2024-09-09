import React, { useState, useEffect } from "react";

import { getTasks, getTask } from "../../api/api";

import TaskInfo from "../TaskInfo/TaskInfo";
import ModalCreate from "../ModalCreate/ModalCreate";
import UserMessage from "../UserMessage/UserMessage";

import "./TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [messageShow, setMessageShow] = useState(false)
  const [taskInfo, setTaskInfo] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [parentList, setParentList] = useState([]);

  const taskPrepare = (tasks) => {
    const parentObj = {};
    const taskMap = {};

    tasks.forEach((task) => {
      taskMap[task.id] = { ...task, children: [] };
      if (task.status !== "completed") {
        parentObj[task.id] = task.title;
      }
    });

    tasks.forEach((task) => {
      if (task.parent) {
        taskMap[task.parent].children.push(taskMap[task.id]);
      }
    });

    setParentList(parentObj);
    return Object.values(taskMap).filter((task) => !task.parent);
  };

  const renderTasks = (tasks, level = 0) => {
    return tasks.map((task) => (
      <div key={task.id} style={{ marginLeft: `${level * 20}px` }}>
        <button className="task" onClick={() => getTaskInfo(task.id)}>
          {task.title}
        </button>
        {task.children &&
          task.children.length > 0 &&
          renderTasks(task.children, level + 1)}
      </div>
    ));
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
        setMessageShow(true);
        setMessageType("error")
        setIsLoading(false);

        setTimeout(() => {
            setMessageShow(false);
        }, 10000);
      });
  }, []);

  const getTaskInfo = (id) => {
    getTask(id)
      .then((data) => {
        setTaskInfo(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setWarningMessage(
          `API is not available. Check the api status. Error: ${error.message}`
        );
        setMessageShow(true);
        setMessageType("error")
        setIsLoading(false);

        setTimeout(() => {
          setMessageShow(false);
        }, 10000);
      });
  };

  const modalOpen = () => {
    setModalShow(true);
  };

  const modalClose = () => {
    setModalShow(false);
  };

  return (
    <>
      <div className="task-list-container">
        <div className="task-list">
          {isLoading && <span className="loader"></span>}
          {renderTasks(tasks)}
        </div>
        <div className="task-info">
          <div className="right">
            <button className="task-button" onClick={() => modalOpen()}>
              Создать
            </button>
          </div>
          {tasks.length === 0 ? (
            <h1>
              Задачи не найдены
            </h1>
          ) : (
            taskInfo && <TaskInfo taskInfo={taskInfo} />
          )}
        </div>
      </div>
      <UserMessage message={warningMessage} type={messageType} messageShow={messageShow} />
      <ModalCreate
        show={modalShow}
        onClose={modalClose}
        parent={parentList}
        editTask={false}
      />
    </>
  );
};

export default TaskList;
