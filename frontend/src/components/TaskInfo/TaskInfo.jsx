import React, { useState } from "react";

import ModalDelete from "../ModalDelete/ModalDelete";

import "./TaskInfo.css";

const TaskInfo = ({ taskInfo }) => {
    const [modalShow, setModalShow] = useState(false);

    const modalOpen = () => {
        setModalShow(true)
    };

    const modalClose = () => {
        setModalShow(false)
    };

    return (
        <>
            <div className="task-info-wrapper">
                <h1>{taskInfo.title}</h1>
                <p>Описание: {taskInfo.description}</p>
                <p>Ответственный: {taskInfo.responsible}</p>
                <p>Время создания: {taskInfo.created_at}</p>
                <p>Статус: {taskInfo.status}</p>
                <p>Планируемое время: {taskInfo.planned_effort}</p>
                <p>Фактическое время: {taskInfo.actual_effort}</p>
                <p>Завершена: {taskInfo.completed_at ? taskInfo.completed_at : "Нет"}</p>
                <p>Родительская задача: {taskInfo.parent ? taskInfo.parent : "Нет"}</p>
                <div className="task-info-buttons">
                    <button className="task-button">Редактировать</button>
                    <button className="task-button delete" onClick={modalOpen}>Удалить</button>
                </div>
            </div>
            <ModalDelete show={modalShow} onClose={modalClose} taskInfo={taskInfo} />
        </>
    )
}


export default TaskInfo;