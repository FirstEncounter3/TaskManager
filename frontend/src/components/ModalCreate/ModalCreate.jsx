import React, { useState, useEffect } from "react";

import { createTask, updateTask } from "../../api/api";

import "./ModalCreate.css";

const ModalCreate = ({ show, onClose, parent, taskInfo, editTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState("");
  const [plannedEffort, setPlannedEffort] = useState("");
  const [parentTask, setParentTask] = useState("");
  const [status, setStatus] = useState("assigned");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editTask) {
      setTitle(taskInfo.title);
      setDescription(taskInfo.description);
      setResponsible(taskInfo.responsible);
      setPlannedEffort(taskInfo.planned_effort);
      setParentTask(taskInfo.parent || "");
      setStatus(taskInfo.status);
    } else {
      setTitle("");
      setDescription("");
      setResponsible("");
      setPlannedEffort("");
      setParentTask("");
      setStatus("assigned");
    }
  }, [editTask, taskInfo]);

  const taskCreator = async () => {
    if (!title || !description || !responsible || !plannedEffort) {
      setError("Пожалуйста, заполните все обязательные поля.");
      console.error("Validation Error: All fields are required.");
      alert("Пожалуйста, заполните поля");
      return;
    }

    const createObject = {
      title: title,
      description: description,
      responsible: responsible,
      planned_effort: plannedEffort,
      parent: parentTask,
      status: status,
    };

    if (editTask) {
      try {
        await updateTask(taskInfo.id, createObject);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert(`Ошибка при обновлении задачи: ${error.message}`);
      }
    } else {
      try {
        await createTask(createObject);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert(`Ошибка при создании задачи: ${error.message}`);
      }
    }
  };

  if (show) {
    return (
      <div className="form-wrapper">
        <div className="form-content">
          <h1>{editTask ? "Редактирование задачи" : "Создание задачи"}</h1>
          <div className="label-and-input">
            <label>Заголовок</label>
            <input
              id="title"
              type="text"
              placeholder="Заголовок задачи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            ></input>
          </div>
          <div className="label-and-input">
            <label>Описание</label>
            <textarea
              id="description"
              placeholder="Описание задачи"
              rows={4}
              cols={50}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="label-and-input">
            <label>Ответственный</label>
            <input
              id="responsible"
              type="text"
              placeholder="Ответственный"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              required
            ></input>
          </div>
          {!editTask && (
            <div className="label-and-input">
              <label>Планируемое время реализации</label>
              <input
                id="plannedEffort"
                placeholder="Планируемое время реализации"
                min="0"
                type="number"
                value={plannedEffort}
                onChange={(e) => setPlannedEffort(e.target.value)}
                required
              ></input>
            </div>
          )}
          {editTask && (
            <div className="label-and-input">
              <label>Статус</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="assigned">Назначено</option>
                <option value="in_progress">Выполняется</option>
                <option value="paused">Приостановлена</option>
                <option value="completed">Завершено</option>
              </select>
            </div>
          )}
          {!editTask && (
            <div className="label-and-input">
              <label>Родительская задача</label>
              <select
                id="parentTask"
                value={parentTask}
                onChange={(e) => setParentTask(e.target.value)}
              >
                <option value="">---</option>
                {parent &&
                  Object.keys(parent).map((key) => (
                    <option key={key} value={key}>
                      {parent[key]}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className="task-info-buttons">
            <button className="task-button" onClick={taskCreator}>
              Отправить
            </button>
            <button className="task-button delete" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default ModalCreate;
