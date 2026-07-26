import api from "./api";

export const getWorkLogs = async (userId) => {

    const response = await api.get(`/api/work/${userId}`);

    return response.data;

};

export const saveWorkLog = async (request) => {

    await api.post("/api/work", request);

};