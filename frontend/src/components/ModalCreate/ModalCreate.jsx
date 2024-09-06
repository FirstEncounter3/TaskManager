import React, { useState, useEffect } from "react";

import { createTask } from "../../api/api";

const ModalCreate = ({show, onClose, parent}) => {

    console.log('PARENT > ', parent)

    const taskCreator = () => {
        const createObject = {}

    };

    const testPost = () => {
        const select = document.getElementById("parentTask").value
        console.log(select)
    }

    if (show) {
        return (
            <div className="form-wrapper">
                <div className="label-and-input">
                    <label>Заголовок</label>
                    <input id="title"></input>
                </div>
                <div className="label-and-input">
                    <label>Описание</label>
                    <input id="description"></input>
                </div>
                <div className="label-and-input">
                    <label>Ответственный</label>
                    <input id="responsible"></input>
                </div>
                <div className="label-and-input">
                    <label>Планируемое время реализации</label>
                    <input id="plannedEffort"></input>
                </div>
                <div className="label-and-input">
                    <label>Родительская задача</label>
                    <select id="parentTask">
                        <option value="---">---</option>
                        {Object.keys(parent).map((key) => (
                        <option key={key} value={key}>
                            {parent[key]}
                        </option>
                        ))}
                    </select>
                </div>
                <button onClick={testPost}>Отправить</button>
                <button onClick={onClose}>Закрыть</button>
            </div>
        )
    }
    return null;
}

export default ModalCreate;