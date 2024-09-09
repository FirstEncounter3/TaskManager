import React, { useState, useEffect } from "react";

import { getTask } from "../../api/api";

import ModalDelete from "../ModalDelete/ModalDelete";
import ModalCreate from "../ModalCreate/ModalCreate";

import "./TaskInfo.css";

const TaskInfo = ({ taskInfo }) => {
  const [modalShowCreate, setModalShowCreate] = useState(false);
  const [modalShowDelete, setModalShowDelete] = useState(false);
  const [parentTitle, setParentTitle] = useState("");

  useEffect(() => {
    if (taskInfo.parent) {
      getTask(taskInfo.parent)
        .then((data) => {
          setParentTitle(data.title);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [taskInfo]);

  const modalCreateOpen = () => {
    setModalShowCreate(true);
  };

  const modalCreateClose = () => {
    setModalShowCreate(false);
  };

  const modalDeleteOpen = () => {
    setModalShowDelete(true);
  };

  const modalDeleteClose = () => {
    setModalShowDelete(false);
  };

  return (
    <>
      <div className="task-info-wrapper">
        <h1>{taskInfo.title}</h1>
        <hr></hr>
        <div className="task-info-content">
          <p>
            <span>Описание: </span>
            {taskInfo.description}
          </p>
          <p>
            <span>Ответственный: </span>
            {taskInfo.responsible}
          </p>
          <p>
            <span>Время создания: </span>
            {taskInfo.created_at}
          </p>
          <p>
            <span>Статус: </span>
            {taskInfo.status}
          </p>
          <p>
            <span>Планируемое время: </span>
            {taskInfo.planned_effort}
          </p>
          <p>
            <span>Фактическое время: </span>
            {taskInfo.actual_effort}
          </p>
          <p>
            <span>Завершена: </span>
            {taskInfo.completed_at ? taskInfo.completed_at : "Нет"}
          </p>
          <p>
            <span>Родительская задача: </span>
            {taskInfo.parent ? parentTitle : "Нет"}
          </p>
        </div>
        <div className="task-info-buttons">
          <button
            className="task-button"
            onClick={modalCreateOpen}
            disabled={taskInfo.status === "completed"}
          >
            Редактировать
          </button>
          <button className="task-button delete" onClick={modalDeleteOpen}>
            Удалить
          </button>
        </div>
      </div>
      <ModalDelete
        show={modalShowDelete}
        onClose={modalDeleteClose}
        taskInfo={taskInfo}
      />
      <ModalCreate
        show={modalShowCreate}
        onClose={modalCreateClose}
        taskInfo={taskInfo}
        editTask={true}
      />
    </>
  );
};

export default TaskInfo;
