import React from "react";

import { deleteTask } from "../../api/api";

import "./ModalDelete.css";

const ModalDelete = ({ show, onClose, taskInfo }) => {
  if (!show) return null;

  const acceptDelete = async () => {
    try {
        await deleteTask(taskInfo.id);
        onClose();
        window.location.reload();
    } catch (error) {
      console.error(error);
      alert(`Ошибка при удалении ${error.message}`);
    }
  };

  return (
    <div className="modal-delete-wrapper">
      <div className="modal-delete">
        <p>{`Вы уверены, что хотите удалить задачу ${taskInfo.title}`}</p>
        <div className="task-info-buttons">
          <button className="task-button delete" onClick={acceptDelete}>
            Да
          </button>
          <button className="task-button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
