import React from "react";

import { deleteTask } from "../../api/api";

import "./ModalDelete.css";

const ModalDelete = ({ show, onClose, taskInfo }) => {
    if (!show) return null;

    const acceptDelete = () => {
        deleteTask(taskInfo.id);
        onClose();
    }

    return (
        <div className="modal-delete-wrapper">
            <p>{`Вы уверены, что хотите удалить задачу ${taskInfo.title}`}</p>
            <div className="modal-delete-buttons">
                <button onClick={acceptDelete}>Да</button>
                <button onClick={onClose}>Отмена</button>
            </div>
        </div>
    )
}


export default ModalDelete