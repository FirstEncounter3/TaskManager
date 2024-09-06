import React, { useState, useEffect } from "react";


const TaskInfo = ({taskInfo}) => {
    return (
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
        </div>
    )
}


export default TaskInfo;