import axios from "axios";


const baseUrl = "http://localhost:8000";


const getTasks = async () => {
    const response = await axios.get(`${baseUrl}`);
    return response.data;
};

const getTask = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
};


const createTask = async (task) => {
    const response = await axios.post(`${baseUrl}/create`, task);
    return response.data;
};


const updateTask = async (id, task) => {
    const response = await axios.put(`${baseUrl}/${id}`, task);
    return response.data;
};


const deleteTask = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
};


export { getTasks, getTask, createTask, updateTask, deleteTask }