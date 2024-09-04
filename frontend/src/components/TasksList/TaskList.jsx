import React, { useState, useEffect } from "react";

import { getTasks } from "../../api/api";


const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [warningMessage, setWarningMessage] = useState("");

    useEffect(() => {
        getTasks()
            .then((data) => {
                setTasks(data);
                console.log(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setWarningMessage(`API is not available. Check the api status. Error: ${error.message}`);
                setIsLoading(false);
            });
    }, []);

    const prepareParentTasks = () => {
        const taskParentWithSubtasks = {};
        tasks.forEach((task) => {
          if (task.parent === null) {
            taskParentWithSubtasks[task.id] = task.title;
          } else {
            if (!taskParentWithSubtasks[task.parent]) {
              taskParentWithSubtasks[task.parent] = [];
            }
            // taskParentWithSubtasks[task.parent].push(task.title);
          }
        });
      
        return taskParentWithSubtasks;
      };
      

    if (prepareParentTasks()) {
        console.log(prepareParentTasks())
    }


    return (
        <div className="task-list">
            <h2>Task List</h2>
            {warningMessage && <p>{warningMessage}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div key={tasks.id}>
                    <ul>
                        {tasks.map((task) => (
                            task.parent ? (
                                <li key={task.id} style={{ paddingLeft: "20px" }}>{task.title}</li>
                            ) : (
                                <li key={task.id}>{task.title}</li>
                            )
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TaskList;