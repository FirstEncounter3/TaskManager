import React, { useState, useEffect } from "react";


const TaskInfo = ({taskInfo}) => {
    return (
        <div>{taskInfo.description}</div>
    )
}


export default TaskInfo;